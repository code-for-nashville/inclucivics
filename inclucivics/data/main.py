import csv
from datetime import datetime
import json
from os.path import basename
import time

import rethinkdb as r

from . import etl, api
from ..app.include.functions import (
    rdb_conn,
    INCLUCIVCS_DB_NAME,
    GOVERNMENT_EMPLOYEE_TABLE_NAME,
)

TIMESTAMPS_TABLE = 'timestamps'


def save_timestamp(new_timestamp):
    """
    Insert a new timestamp value into rethinkdb
    """
    r.db(INCLUCIVCS_DB_NAME)\
        .table(TIMESTAMPS_TABLE)\
        .insert(dict(id=new_timestamp))\
        .run(rdb_conn())


def get_latest_loaded_timestamp():
    return r.db(INCLUCIVCS_DB_NAME)\
        .table(TIMESTAMPS_TABLE)\
        .max('id')\
        .run(rdb_conn())


def prepare_and_insert_data(data, timestamp):
    etl.prepare_for_insert(data, timestamp)
    r.db(INCLUCIVCS_DB_NAME)\
        .table(GOVERNMENT_EMPLOYEE_TABLE_NAME)\
        .insert(data)\
        .run(rdb_conn())
    save_timestamp(timestamp)


def insert_latest_data_from_api(timestamp):
    """Load the latest copy of the government employment demographics data"""
    data = api.retrieve_data()
    prepare_and_insert_data(data, timestamp)


def check_and_update():
    """"Checks if there is a more up-to-date employee demographic dataset on the open data portal and if so loads it"""
    latest_loaded_timestamp = get_latest_loaded_timestamp()

    latest_online_timestamp = api.check_for_update()

    if latest_online_timestamp > latest_loaded_timestamp:
        insert_latest_data_from_api(latest_online_timestamp)


"""Load data from CSV and JSON files manually downloaded off of the open data portal"""


def get_timestamp_from_filepath(filepath):
    file_datestring = basename(filepath).split(".")[0]
    file_datetime = datetime.strptime(file_datestring, "%Y%m%d")
    return int(time.mktime(file_datetime.timetuple()))


def insert_data_from_json_file(filepath):
    timestamp = get_timestamp_from_filepath(filepath)
    if r.db(INCLUCIVCS_DB_NAME).table(TIMESTAMPS_TABLE).get_all(timestamp).run(rdb_conn()):
        raise Exception(
            "This file for timestamp {timestamp} already been loaded into rethinkdb based on information from "
            "the {table} table. "
            .format(timestamp=timestamp, table=TIMESTAMPS_TABLE),
        )

    with open(filepath) as data_file:
        data = json.load(data_file)
        prepare_and_insert_data(data, timestamp)


def map_dict_keys(dict2change, key_name_dict):
    """Swap out the keys in a dict based on a mapping"""
    for key in dict2change.iterkeys():
        if key_name_dict.get(key):
            dict2change[key_name_dict[key]] = dict2change[key]
            del dict2change[key]
    return dict2change


def insert_data_from_csv_file(filepath, delimiter=','):
    timestamp = get_timestamp_from_filepath(filepath)
    if r.db(INCLUCIVCS_DB_NAME).table(TIMESTAMPS_TABLE).get_all(timestamp).run(rdb_conn()):
        raise Exception(
            "This file for timestamp {timestamp} already been loaded into rethinkdb based on information from "
            "the {table} table. "
            .format(timestamp=timestamp, table=TIMESTAMPS_TABLE),
        )

    # The CSV format has changed over time. Not all columns are always present, and some names
    # have been changed over time. We'll convert the column names to normalized keys for sanity
    FIELDNAME_MAP = {
        '': 'address_number',
        'Address Number': 'address_number',
        'Department': 'current_dept_description',
        'Current Dept': 'current_dept',
        'Title': 'title',
        'Class # Description': 'title',
        'Pay Grade': 'pay_grade_step',
        'Pay Grade/Step': 'pay_grade_step',
        'Annual Salary': 'annual_salary',
        'Ethnic Code': 'ethnic_code',
        'Description':  'ethnic_code_description',
        'Gender': 'gender',
        'Year of Birth': 'year_of_birth',
        'EEO Job description': 'eeo_job_cat_desc',
        'EEO Job Description': 'eeo_job_cat_desc',
        'EEO Job Cat Desc': 'eeo_job_cat_desc',
        'Class ': 'class',
        'Class': 'class',
        'Class #': 'class',
        'Employment Status': 'employment_status',
        'Employment Status Description': 'employment_status',
        'EEO Job Cat': 'eeo_job_cat',
        'Date Started': 'date_started',
        'FLSA Exempt': 'flsa_exempt_y_n',
    }

    with open(filepath) as data_file:
        reader = csv.DictReader(data_file, delimiter=delimiter)
        data = [map_dict_keys(row, FIELDNAME_MAP) for row in reader]
        prepare_and_insert_data(data, timestamp)

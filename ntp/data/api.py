"""
Primary python API for interacting with the data from the open data portal.  There's a lot of cases in here that need to be tested.
"""
import requests
from init_db import rdb_data, rdb_timestamps
from pprint import pprint
from toolz.itertoolz import groupby, concat
import time
import rethinkdb as r
import datetime
from collections import Counter


def should_update(epoch_date):
    """
    Check rethinkdb for a record of imported datasets.
    """
    downloads = [elem for elem in rdb_timestamps.run(r.connect())]

    if downloads:
        sorted(downloads, lambda key: key["date"], reverse=True)[0]
        if epoch_date - most_recent < 0:
            return False
    return True 


def check_for_update():
    """
    Shameless hard coded.  Check the open data portal for the demographic data's explicit api and get
    the last updated value.
    """

    endpoint = "https://data.nashville.gov/api/views/4ibi-mxs4"
    response = requests.get(endpoint)
    demographics_object = response.json()

    epoch_timestamp = demographics_object.get("rowsUpdatedAt")
    return epoch_timestamp


def sanitize(doc, sanitize_key):
    """
    Salary data often has mixed types ie. $30000.00 and 33000.00 etc so
    I filter all of that and return a cleaned version of the incoming document with the same schema
    """
    row = doc.copy()
    assert isinstance(row[sanitize_key], (unicode, str))

    temp = row[sanitize_key].split(".")[0] if "." in row[sanitize_key] else row[sanitize_key]

    row[sanitize_key] = int("".join(char for char in temp if char.isalnum()))
    assert isinstance(row[sanitize_key], int)
    return row


def income_level(doc, salary_key):
    """
    Creates qualitative descriptions of salaries based on income ranges.  Requires sanitize annual_salary value
    """

    row = doc.copy()
    key = "income_level"
    lower = "Lower Income Range (Less than $33,000)"
    middle = "Middle Income Range ($33,000 and $66,000)"
    upper = "Upper Income Range (Greater than $66,000)"

    if row[salary_key] < 33000:
        row[key] = lower
    
    elif 33000 <= row[salary_key] < 66000:
        row[key] = middle
    else:
        row[key] = upper

    return row


def return_sanitized():
    """
    Make the API request and scrup all incoming data.  Return unmodified aside from etl step. 
    """

    api_endpoint  = "https://data.nashville.gov/resource/4ibi-mxs4.json?$limit=50000"
    data = requests.get(api_endpoint).json()
    assert data

    demographics = [income_level(sanitize(row, "annual_salary"), "annual_salary") for row in data] 
    return demographics


def flatten(list_of_lists):
    return [inner for inner in outer for inner in outer]


def filter_grouped(grouby_dict, keep_fields):
    return {
        key: dict(Counter(list(concat([
           [ 
               elem[second_key] 
                for second_key in elem
                if second_key in keep_fields
           ] 
            for elem in grouby_dict[key]
        ]))).most_common())
        for key in grouby_dict
    }


def group_all(sanitized_data):
    """
    Handle all the required data manipulations in memory.  Should simply map to the required objects for the front end.
    """
    grouped = groupby("current_dept_description", sanitized_data) 
    assert isinstance(grouped, dict)
    assert grouped

    double_grouped =  [{
        "name": key,
        "ethnicity": filter_grouped(groupby("ethnic_code_description", grouped[key]), ["income_level"]),
        "gender": filter_grouped(groupby("gender", grouped[key]), ["income_level"])
        } for key in grouped] 
      
    assert all(isinstance(key, dict) for key in double_grouped)

    return double_grouped

if __name__ == "__main__":
    from pprint import pprint
    pprint(group_all(return_sanitized()))

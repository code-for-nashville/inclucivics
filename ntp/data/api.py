"""
Primary python API for interacting with the data from the open data portal.  There's a lot of cases in here that need to be tested.
"""
import requests
from pprint import pprint
from ntp.data.init_db import rdb_timestamps, r
from toolz.itertoolz import groupby, concat
from toolz.dicttoolz import valmap  
import time
import rethinkdb as r
import datetime
from collections import Counter


def should_update(ntp_last_updated, odp_last_updated):
    """
    Check rethinkdb for a record of imported datasets.
    """
    if int(odp_last_updated) > int(ntp_last_updated):
        return True 
    return False 


def check_for_update():
    """
    Shameless hard coded.  Check the open data portal for the demographic data's explicit api and get
    the last updated value.
    """

    endpoint = "https://data.nashville.gov/api/views/4ibi-mxs4"
    response = requests.get(endpoint)
    demographics_object = response.json()

    epoch_timestamp = demographics_object.get("rowsUpdatedAt")
    return int(epoch_timestamp)


def retrieve_data():
    """
    Grab the actual demographics data from the Open Data Portal
    """

    api_endpoint  = "https://data.nashville.gov/resource/4ibi-mxs4.json?$limit=50000"
    data = requests.get(api_endpoint).json()
    return data


def ntp_last_update():
    """
    Get the last updated value of Inclucivics Data
    """
    last_updated = [elem for elem in rdb_timestamps.run(r.connect())]

    if last_updated:
        return sorted(last_updated, key=lambda k: k.get("id"), reverse=True)

    # Zero is the initial condition, i.e., no timestamps inserted
    return 0

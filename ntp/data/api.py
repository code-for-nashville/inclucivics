"""
Primary python API for interacting with the data from the open data portal.  There's a lot of cases in here that need to be tested.
"""
import requests
from init_db import rdb_data, rdb_timestamps
from pprint import pprint
from toolz.itertoolz import groupby
import time
import rethinkdb as r
import datetime


def should_update(epoch_date):
    """
    Check rethinkdb for a record of imported datasets.
    """
    downloads = [elem for elem in rdb_timestamps.run(r.connect())]

    if downloads:
            sort(downloads, lambda key: key["date"], reverse=True)[0]
        )
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


def group_all(sanitized_data):
    """
    Handle all the required data manipulations in memory.  Should simply map to the required objects for the front end.
    """
    grouped = groupby("current_dept_description", sanitized_data) 
    assert isinstance(grouped, dict)
    assert grouped
  
    double_grouped =  [{
        "name": key,
        "ethnicity": groupby("ethnic_code_description", grouped[key]),
        "gender": groupby("gender", grouped[key])
        } for key in grouped] 
      
    assert all(isinstance(key, dict) for key in double_grouped)

    return double_grouped

if __name__ == "__main__":
    print datetime.datetime.fromtimestamp(check_for_update())

from collections import Counter
from datetime import datetime

import pytz
from toolz.itertoolz import groupby, concat

SALARY_KEY = "annual_salary"


def sanitize_salary(doc):
    """
    Salary data often has mixed types ie. $30000.00 and 33000.00 etc so
    I filter all of that and return a cleaned version of the incoming document with the same schema
    """
    string_dollar_amount = doc[SALARY_KEY].replace("$", "").replace(",", "")
    doc[SALARY_KEY] = float(string_dollar_amount or 0)


def add_income_level(doc):
    """
    Adds qualitative descriptions of salaries based on income ranges.  Requires sanitize annual_salary value
    """
    key = "income_level"
    lower = "Lower Income Range (Less than $33,000)"
    middle = "Middle Income Range ($33,000 and $66,000)"
    upper = "Upper Income Range (Greater than $66,000)"

    if doc[SALARY_KEY] < 33000:
        doc[key] = lower
    elif 33000 <= doc[SALARY_KEY] < 66000:
        doc[key] = middle
    else:
        doc[key] = upper


def realize_numeric_fields(row):
    """Converts all string numeric fields to longs (if they exist)"""
    fields = ["address_number", "class", "eeo_job_cat", "ethnic_code", "year_of_birth"]
    for field in fields:
        if not row.get(field):
            continue
        try:
            row[field] = int(row[field])
        except:
            print "Failed to convert to number field {field} for row: {row}".format(
                field=field, row=row,
            )


def prepare_for_insert(data, timestamp):
    """
    Normalize and sanitize data.

    Make salary a floating point number, add a qualitative income level description field, coalesce other string
    fields into their correct types, and add a timestamp field to differentiate between different dates this data
    has been pulled for.
    """
    central_tz = pytz.timezone('US/Central')
    for row in data:
        realize_numeric_fields(row)
        sanitize_salary(row)
        add_income_level(row)
        if row.get('date_started'):
            format_string = '%Y-%m-%dT%H:%M:%S' if 'T' in row['date_started'] else '%m/%d/%Y'
            row['date_started'] = datetime.strptime(row['date_started'], format_string).replace(tzinfo=central_tz)
        if row.get('flsa_exempt_y_n'):
            row['flsa_exempt_y_n'] = True if row['flsa_exempt_y_n'] == 'Y' else False
        row["timestamp"] = datetime.fromtimestamp(timestamp).replace(tzinfo=central_tz)


def filter_grouped(grouby_dict, keep_fields):
    """
    Filter out the values returned by toolz.itertoolz.groupby to only the desired dictionary keys.
    i.e. "keep_fields"

    This is iterating through a fairly nested object that looks like:

    {
        key1: [
            {sub_key: val},
            ...
        ],
        key2: [
            {sub_key: val},
            ...
        ]
    }

    Within the nested list comprehension we extract only the values associated with the keep_fields keys, concatenate
    the resulting list_of_lists, apply a Counter() count, and finally convert that to a dictionary.

    Basically data jujitsu
    """
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
        "ethnicity": filter_grouped(groupby("income_level", grouped[key]), ["ethnic_code_description"]),
        "gender": filter_grouped(groupby("income_level", grouped[key]), ["gender"])
        } for key in grouped]

    assert all(isinstance(key, dict) for key in double_grouped)

    return double_grouped


def format_for_insert(sanitized_data):
    """
    Convert the double nested dictionary structure into json-like values for each demographic

    The schema prior to this stage is

    {"<demographic>": {<income_level> : <count_dict>}}

    and the desired schema is going to be something like
    {"<demographic>": [{<key_name>: <income_level>, <val_name>:  <counts>}]}

    """

    def to_json_like(dictionary, key_name, value_name):
        """
        convert a dictionary into json_like
        """
        json_like = [{key_name: elem[0], value_name: [list(tupl) for tupl in elem[1].items()]} for elem in dictionary.items()]
        return json_like

    def valmap_if(dictionary, key_name, value_name):
        """
        Apply to_json_like to values within the data that are lists.
        """
        return {
            key: to_json_like(dictionary[key], key_name, value_name) if isinstance(dictionary[key], dict) else dictionary[key]
            for key in dictionary
        }

    formatted = [valmap_if(item, "title", "data") for item in sanitized_data]

    return formatted


def prepare_static_data(sanitized_data):
    """
    Perform all aggregation operations in incoming data from open data portal
    """
    return format_for_insert(group_all(sanitized_data))


def prepare_temporal_data(sanitized_data, timestamp):
    """
    Handle all data manipulations needed to create temporal data graphs
    """
    updated_datetime = datetime.fromtimestamp(timestamp)

    # e.g. "2015 - August"
    LABEL_FORMAT_STRING = "%Y - %B"
    date_label = updated_datetime.strftime(LABEL_FORMAT_STRING)

    # {"<income_level>": [...rows]} to
    # {"series": [{"data": <percent>, "name": "<ethnicity"}], "title": "<income_level>", "time": "<timestamp>"}
    result = []
    grouped_by_income = groupby("income_level", sanitized_data)
    for income_level, values in grouped_by_income.iteritems():
        total_at_income_level = len(values)
        grouped_by_ethnicity = groupby("ethnic_code_description", values)
        result.append({
            "series": [
                {
                    "data": float(len(employees)) / total_at_income_level,
                    "name": ethnicity,
                }
                for ethnicity, employees in grouped_by_ethnicity.iteritems()
            ],
            "time": date_label,
            "title": income_level
        })

    return result

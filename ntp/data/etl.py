from toolz.itertoolz import groupby
from collections import Counter


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


def return_sanitized(data):
    """
    Make the API request and scrup all incoming data.  Return unmodified aside from etl step. 
    """

    demographics = [income_level(sanitize(row, "annual_salary"), "annual_salary") for row in data] 
    return demographics


def count_by_key(grouby_dict, key_to_count):
    """
    Replace each element with a dict mapping a key to it's counts, per group in the value returned by toolz.itertoolz.groupby

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

    The tricky part of this is that dict can be initialized with a list of tuples, for each tuple the first element
    becomes the key, and the second the value. Counter.most_common returns a list of tuples with the first element
    being the element being counted, and the second it's count.

    Basically data jujitsu
    """

    return {
        key: dict(
            Counter(
                elem[key_to_count]
                for elem in elems
            ).most_common()
        )
        for key, elems in grouby_dict.iteritems()
    }


def group_all(sanitized_data):
    """
    Handle all the required data manipulations in memory.  Should simply map to the required objects for the front end.
    """
    grouped = groupby("current_dept_description", sanitized_data)
    assert isinstance(grouped, dict)
    assert grouped

    double_grouped = [
        {
            "name": key,
            "ethnicity": count_by_key(groupby("income_level", grouped[key]), "ethnic_code_description"),
            "gender": count_by_key(groupby("income_level", grouped[key]), "gender")
        }
        for key in grouped
    ]

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


def prepare_temporal_data(sanitized_data):
    """
    Handle all data manipulations needed to create temporal data graphs
    """
    return sanitized_data 

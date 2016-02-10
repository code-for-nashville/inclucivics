from toolz.itertoolz import groupby, concat
from toolz.dicttoolz import valmap  
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

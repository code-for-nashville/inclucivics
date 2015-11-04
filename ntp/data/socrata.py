import requests
from pprint import pprint
from toolz.itertoolz import groupby


def fetch_data(url):
    """
    Simple convenience for requests.get  Allows me to go straight from url to json data.
    """
    r = requests.get(url)
    data = r.json()
    return data


def sanitize(doc, sanitize_key):
    """
    Salary data often has mixed types ie. $30000.00 and 33000.00 etc so
    I filter all of that and return a cleaned version of the incoming document with the same schema
    """
    row = doc.copy()
    assert isinstance(row[sanitize_key], (unicode, str))

    temp = row[sanitize_key].split(".")[0] if "." in row[sanitize_key] else row[sanitize_key]

    row[sanitize_key] = "".join(char for char in temp if char.isalnum())
    assert isinstance(row[sanitize_key], (unicode, str)) and all(char.isalnum() for char in row[sanitize_key])

    return row


def main():
    """
    Primary import controller.  Most state is handled here
    """
    api_endpoint  = "https://data.nashville.gov/resource/4ibi-mxs4.json?$limit=50000"
    demographics = [sanitize(row, "annual_sanitize_key") for row in fetch_data(api_endpoint)]
    grouped = groupby("current_dept_description", demographics) 
    assert isinstance(grouped, dict)
  
    double_grouped =  {key: groupby("ethnic_code_description", grouped[key]) for key in grouped}
    assert all(isinstance(double_grouped[key], dict) for key in double_grouped)
    return double_grouped

if __name__ == "__main__":
    main()
    



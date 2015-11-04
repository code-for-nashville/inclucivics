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


def main():
    """
    Primary import controller.  Most state is handled here
    """

    api_endpoint  = "https://data.nashville.gov/resource/4ibi-mxs4.json?$limit=50000"
    demographics = [income_level(sanitize(row, "annual_salary"), "annual_salary") for row in fetch_data(api_endpoint)]
    grouped = groupby("current_dept_description", demographics) 
    assert isinstance(grouped, dict)
  
    double_grouped =  [{
        "name": key,
        "ethnicity": groupby("ethnic_code_description", grouped[key]),
        "gender": groupby("gender", grouped[key])
        } for key in grouped] 
      

    assert all(isinstance(key, dict) for key in double_grouped)

    return double_grouped


if __name__ == "__main__":
    main()
    



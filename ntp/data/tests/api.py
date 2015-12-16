from ntp.data.api import return_sanitized, filter_grouped, group_all 
from pprint import pprint
from time import sleep

def test_return_sanitized():
    """
    Runs full retrieval of data from ODP to grouping step.
    """
    data = return_sanitized()
    assert data
    assert isinstance(data, list)
    assert all(isinstance(elem, dict) for elem in data)
    assert all("annual_salary" in elem for elem in data)
    return data

def test_group_all():
    """
    Ensure the major data manipulation is occurring as expected.
    """
    # Sleep for a few seconds so as to not upset the API request limit
    sanitized = test_return_sanitized()
    grouped = group_all(sanitized)

    for key in ["name", "ethnicity", "gender"]:
        assert all(key in elem for elem in grouped)

    departments = [elem["name"] for elem in grouped]
    assert len(departments) == len(set(departments))
    return grouped

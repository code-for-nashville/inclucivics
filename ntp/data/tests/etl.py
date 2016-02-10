from ntp.data.etl import return_sanitized, filter_grouped, group_all, format_for_insert
from ntp.data.api import retrieve_data
from pprint import pprint
from time import sleep


def test_return_sanitized():
    """
    Runs full retrieval of data from ODP to grouping step.
    """
    data = return_sanitized(retrieve_data())
    assert data
    assert isinstance(data, list)
    assert all(isinstance(elem, dict) for elem in data)
    assert all("annual_salary" in elem for elem in data)
    return data


def test_group_all():
    """
    Ensure the major data manipulation is occurring as expected.
    """
    sanitized = test_return_sanitized()
    grouped = group_all(sanitized)

    for key in ["name", "ethnicity", "gender"]:
        assert all(key in elem for elem in grouped)

    departments = [elem["name"] for elem in grouped]
    assert len(departments) == len(set(departments))
    return grouped

def test_format_for_insert():
    """
    Ensure our demographics come out as there are supposed to.
    """
    grouped = test_group_all()
    formatted = format_for_insert(grouped)
    assert formatted
    assert isinstance(formatted, list)
    assert all(isinstance(elem, dict) for elem in formatted)

    for doc in formatted:
        for key in ["ethnicity", "gender"]:
            assert isinstance(doc[key], list)
            for datum in doc[key]:
                for key in ["data", "title"]:
                    assert key in datum
    return formatted                    

from ntp.data.etl import return_sanitized, group_all, prepare_temporal_data, format_for_insert
import json
from os import path


def _retreive_test_data():
    """Reads in a file of real data downloaded and included in the project"""
    with open(path.join(path.dirname(__file__), '..', '..', 'files', 'input', '20151230.json')) as f:
        return json.load(f)


def test_return_sanitized():
    """
    Runs full retrieval of data from ODP to grouping step.
    """
    data = return_sanitized(_retreive_test_data())
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


def test_prepare_temporal_data():
    sanitized_data = return_sanitized(_retreive_test_data())
    temporalized = prepare_temporal_data(sanitized_data, 1451487633)
    assert isinstance(temporalized, list)

"""
Module that reads in a DSV file downloaded from Socrata with Employee demographic data,
sanitizes it, parses it, and returns a dict of summary statistics.
"""
from collections import Counter
import csv
from itertools import (
    chain,
    groupby,
)
import json
import sys

LOW = 'Lower Income Range (Less than $33,000)'
MID = 'Middle Income Range ($33,000 and $66,000)'
HIGH = 'Upper Income Range (Greater than $66,000)'
INCOMES = [LOW, MID, HIGH]
GENDERS = ['M', 'F']
DEMOGRAPHICS = [
    'American Indian/Alaskan Native',
    'Asian or Pacific Islander',
    'Black',
    'Hawaiian or Pacific Islander',
    'Hispanic',
    'Two or More Races',
    'Unknown',
    'White (Not of Hispanic Origin)',
]


def parse_float(s):
    """Parse a string to a float, assuming is uses comma as a thousands separator"""
    return float(s.replace(',', '').replace('$', '').strip())


def demographic(line):
    return line['Description']


def department(line):
    return line['Department']


def gender(line):
    return line['Gender']


def income(line):
    return line['Income Category']


def income_category(value):
    if value < 33000:
        return LOW
    if value < 66000:
        return MID
    return HIGH

def add_missing_keys(counts, count_keys):
    for key in count_keys:
        if key not in counts: counts[key] = 0

with open(sys.argv[1], 'r') as f:
    lines = list(csv.DictReader(f, delimiter="|"))

    # Some seasonal employees have "Annual Salary" listed as an empty string. For now skip, but log how many
    # Some records in 20150301.csv have '$-  '
    parsed = []
    for ix, l in enumerate(lines):
        try:
            l['Annual Salary'] = parse_float(l['Annual Salary'])
        except ValueError:
            print("Skipping line {}: Unable to parse '{}' as float".format(ix, l['Annual Salary']))
            continue
        l['Income Category'] = income_category(l['Annual Salary'])
        parsed.append(l)

    # Group by Department
    by_department = sorted(parsed, key=department)
    per_department = {k: list(v) for k, v in groupby(by_department, key=department)}

    # For each income group, generate a grouping by gender and demographic
    department_rollups = {}
    # We tack on "All Departments" to get rollups for everyone. It's inefficient but it still sub-second execution time
    for department, values in chain(per_department.items(), [('All Departments', parsed)]):
        department_rollups[department] = {
            'ethnicity': [],
            'gender': [],
        }

        by_income_level = sorted(values, key=income)
        per_income_level = {k: list(v) for k, v in groupby(by_income_level, key=income)}
        for level, income_values in per_income_level.items():
            gender_counts = Counter(gender(l) for l in income_values)
            add_missing_keys(gender_counts, GENDERS)
            demographic_counts = Counter(demographic(l) for l in income_values)
            add_missing_keys(demographic_counts, DEMOGRAPHICS)
            department_rollups[department]['ethnicity'].append({
                'data': [[demographic, count] for demographic, count in demographic_counts.items()],
                'income_level': level,
                'type': 'pie',
            })
            department_rollups[department]['gender'].append({
                'data': [[gender, count] for gender, count in gender_counts.items()],
                'income_level': level,
                'type': 'pie',
            })

    with open('public/department-rollups.json', 'w') as f:
        json.dump(department_rollups, f)

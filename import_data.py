"""IncluCivics data import script.

Module that reads in a DSV file downloaded from Socrata with Employee
demographic data, sanitizes it, parses it, and returns a dict of
summary statistics.

"""
from collections import Counter, defaultdict
import csv
from itertools import (
    chain,
    groupby,
)
import json
import sys
import os
from datetime import datetime
from data_constants import (SUMMARY_STRUCTURE, LOW, MID, HIGH, UNKNOWN_INCOME)


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
    """Parse string to float, assuming it uses a comma to separate 1000s."""
    return float(s.replace(',', '').replace('$', '').strip())


def demographic(line):
    """Get 'Description' value off of line."""
    return line['Description']


def department(line):
    """Get 'Department' value off of line."""
    return line['Department']


def gender(line):
    """Get 'Gender' value off of line."""
    return line['Gender']


def income(line):
    """Get 'Income Category' value off of line."""
    return line['Income Category']


def income_category(value):
    """Enum type function for Income Category."""
    if value < 33000:
        return LOW
    if value < 66000:
        return MID
    return HIGH


def add_missing_keys(counts, count_keys):
    for key in count_keys:
        if key not in counts:
            counts[key] = 0


def generate_report(file):
    """Create a monthy report."""
    with open(file, 'r') as f:
        lines = list(csv.DictReader(f, delimiter="|"))

# Some seasonal employees have "Annual Salary" listed as an empty string.
# For now skip, but log how many
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
        for depart, values in chain(per_department.items(), [('All Departments', parsed)]):
            department_rollups[depart] = {
                'ethnicity': [],
                'gender': [],
            }

            by_income_level = sorted(values, key=income)
            per_income_level = {k: list(v) for k, v in groupby(by_income_level, key=income)}
            for level, income_values in per_income_level.items():
                gender_counts = Counter(gender(l) for l in income_values)
                demographic_counts = Counter(demographic(l) for l in income_values)
                department_rollups[depart]['ethnicity'].append({
                    'data': [[demographic, count] for demographic, count in demographic_counts.items()],
                    'income_level': level,
                    'type': 'pie',
                })
                department_rollups[depart]['gender'].append({
                    'data': [[gender, count] for gender, count in gender_counts.items()],
                    'income_level': level,
                    'type': 'pie',
                })

        with open('public/department-rollups.json', 'w') as f:
            json.dump(department_rollups, f)


def parse_filename(filename):
    """Parse filename into date."""
    return datetime.strptime(filename[:-4], '%Y%m%d').strftime('%Y - %B')


def generate_summary():
    """Create Summary report."""
    root, dirs, files = os.walk('input').__next__()

    for file in files:
        date = parse_filename(file)
        summary_structure = SUMMARY_STRUCTURE
        for summary in summary_structure:
            summary['time'].append(date)

        with open('{}/{}'.format(root, file), 'r') as f:
            lines = list(csv.DictReader(f, delimiter="|"))
        metro_overall = defaultdict()
        default_incomes = {
            LOW: defaultdict(lambda: -1, {'total': 0}),
            MID: defaultdict(lambda: -1, {'total': 0}),
            HIGH: defaultdict(lambda: -1, {'total': 0}),
            UNKNOWN_INCOME: defaultdict(lambda: -1, {'total': 0})
        }
        incomes_overall = defaultdict(lambda: -1, default_incomes)

        for ix, line in enumerate(lines):
            # Calculate "Metro Overall"
            if demographic(line) in metro_overall:
                metro_overall[demographic(line)] += 1
            else:
                metro_overall[demographic(line)] = 1
            # Calculate "Lower Income Range (Less than $33,000)"
            try:
                line['Annual Salary'] = parse_float(line['Annual Salary'])
                line['Income Category'] = income_category(line['Annual Salary'])
            except ValueError:
                line['Income Category'] = UNKNOWN_INCOME
                print("Skipping line {}: Unable to parse '{}' as float".format(ix,line['Annual Salary']))
            if demographic(line) in incomes_overall[line['Income Category']]:
                incomes_overall[line['Income Category']][demographic(line)] += 1
            else:
                incomes_overall[line['Income Category']][demographic(line)] = 1
            incomes_overall[line['Income Category']]['total'] += 1


        # Add "Metro Overall" to structure
        for serie in summary_structure[0]['series']:
            serie['data'].append(metro_overall[serie['name']] / len(lines))

        # Add "Lower Income Range (Less than $33,000)" to structure
        for serie in summary_structure[1]['series']:
            serie['data'].append(incomes_overall[LOW][serie['name']] / incomes_overall[LOW]['total'])

        for serie in summary_structure[2]['series']:
            serie['data'].append(incomes_overall[MID][serie['name']] / incomes_overall[LOW]['total'])

        for serie in summary_structure[3]['series']:
            serie['data'].append(incomes_overall[HIGH][serie['name']] / incomes_overall[LOW]['total'])

    with open('src/data/summary-test.json', 'w') as f:
        json.dump(summary_structure, f)


if __name__ == '__main__':
    if len(sys.argv) == 2:
        try:
            file = sys.argv[1]
            print('Generating report for {}'.format(file))
            generate_report(file)
        except FileNotFoundError:
            print('⚠️  Could not locate the 📄  to parse. Try checking the input directory for dataset.')
        else:
            print('Generating summary report')
            generate_summary()

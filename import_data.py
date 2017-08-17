"""IncluCivics data import script.

Module that reads in a DSV file downloaded from Socrata with Employee
demographic data, sanitizes it, parses it, and returns a dict of
summary statistics.

"""
from collections import defaultdict
import csv
import json
import os
from datetime import datetime

ALL_DEPARTMENTS = 'All Departments'
GENDER = 'gender'
ETHNICITY = 'ethnicity'
LOW = 'Lower Income Range (Less than $33,000)'
MID = 'Middle Income Range ($33,000 and $66,000)'
HIGH = 'Upper Income Range (Greater than $66,000)'
INCOMES = [HIGH, MID, LOW]
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


class ReportLine(object):
    """Simple wrapper around a line from the demographics report"""

    class BadIncomeException(Exception):
        """Raised if the income string of a line can't be parsed"""
        pass

    def __init__(self, line):
        """ReportLine constructor

            line - a dictionary like the kind returned by csv.DictReader
        """
        self._line = line.copy()
        try:
            self._line['Annual Salary Parsed'] = self.__parse_income(self._line['Annual Salary'])
        except ValueError:
            raise self.BadIncomeException

    def __parse_income(self, income_string):
        """Internal method to parse the income string we get back from reports into a float

        Some seasonal employees have "Annual Salary" listed as an empty string, and some records in 20150301.csv just
        have '$-  ' listed as a salary. Allow these to raise a ValueError.
        """
        income_string = income_string.replace(',', '').replace('$', '').strip()
        return float(income_string)

    @property
    def demographic(self):
        demographic = self._line.get('Description')
        if demographic:
            return demographic

        return self._line['Ethnic Code Description']

    @property
    def department(self):
        return self._line.get('Department', self._line['Current Dept Description'])

    @property
    def gender(self):
        return self._line['Gender']

    @property
    def income_category(self):
        if self._line['Annual Salary Parsed'] < 33000:
            return LOW
        if self._line['Annual Salary Parsed'] < 66000:
            return MID
        return HIGH


def file_to_lines(filename):
    with open(filename, 'r') as f:
        lines = list(csv.DictReader(f))

    for ix, l in enumerate(lines):
        try:
            yield ReportLine(l)
        except ReportLine.BadIncomeException:
            print("Skipping line {}: Unable to parse '{}' as float".format(ix, l['Annual Salary']))
            continue


def generate_report(filename):
    """Generates the report to use in the "Explore" section. The list of departments for the year is also saved

    The report looks like:

        {
            <department>: {
                <metric_type>: {
                    <income level> {
                        {
                            <a>: n,
                            <b>: n,
                        }
                    }
                }
            }
        }
    """
    lines = file_to_lines(filename)
    # For each department generate income level reports by demographic and gender, and a total
    report = defaultdict(lambda: {
        GENDER: defaultdict(lambda: {gender: 0 for gender in GENDERS}),
        ETHNICITY: defaultdict(lambda: defaultdict(lambda: 0))
    })
    departments = set()

    for line in lines:
        departments.add(line.department)
        for metric, value in [(GENDER, line.gender), (ETHNICITY, line.demographic)]:
            report[line.department][metric][line.income_category][value] += 1
            report[ALL_DEPARTMENTS][metric][line.income_category][value] += 1

    # A slightly misleading title, since this includes gender and ethnicity breakdowns
    with open('src/data/summary-by-department.json', 'w') as f:
        json.dump(report, f)

    with open('src/data/departments.json', 'w') as f:
        json.dump([ALL_DEPARTMENTS] + sorted(departments), f)


def generate_summary():
    """Generate overall information"""
    root, _, filenames = list(os.walk('input'))[0]

    OVERALL = 'Metro Overall'
    summaries = {}
    dates = []
    for fname in filenames:
        lines = file_to_lines('{root}/{fname}'.format(root=root, fname=fname))

        # Generate a dict mapping income to demographics to count
        summary = {
            'values': defaultdict(
                lambda: {ethnicity: 0. for ethnicity in DEMOGRAPHICS}
            ),
            # Note the "." to make this a float literal
            'totals': defaultdict(lambda: 0.)
        }

        for line in lines:
            summary['values'][line.income_category][line.demographic] += 1.
            summary['values'][OVERALL][line.demographic] += 1.
            summary['totals'][line.income_category] += 1.
            summary['totals'][OVERALL] += 1.

        fdate = datetime.strptime(fname[:-4], '%Y%m%d').strftime('%Y - %B')
        summaries[fdate] = summary
        dates.append(fdate)

    # Reorganize so we have a list of income levels and a list of name/data pairs
    listy_summaries = [
        {
            'data': [
                {
                    'name': key,
                    'data': [
                        100 * (summaries[d]['values'][level][key] / summaries[d]['totals'][level])
                        for d in dates
                    ]
                }
                for key in DEMOGRAPHICS
            ],
            'dates': dates,
            'level': level,
        }
        for level in [OVERALL] + INCOMES
    ]

    with open('src/data/summary.json', 'w') as f:
        json.dump(listy_summaries, f)


def command():
    import argparse
    parser = argparse.ArgumentParser('Generate reports from downloaded files')
    parser.add_argument('--filename', help='Name of the report you want to generate')
    args = parser.parse_args()
    if not args.filename:
        print('Generating summary reports')
        generate_summary()
        return

    try:
        print('Generating report for {}'.format(args.filename))
        generate_report(args.filename)
    except FileNotFoundError:
        print('⚠️  Could not locate the 📄  to parse. Try checking the input directory for dataset.')


if __name__ == '__main__':
    command()

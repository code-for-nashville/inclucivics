from include.rethinkdb.tables import RdbTableEmployeesByDepartment
from os import system


def table_check():
    if RdbTableEmployeesByDepartment.count() == 0:
        system('python data/sanitize.py')
        system('python data/aggregate.py')



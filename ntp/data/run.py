from include.rethinkdb.tables import RdbTableRawData
from os import system


def table_check():
    if RdbTableRawData.count().run() == 0:
        system('python data/sanitize.py')
        system('python data/aggregate.py')


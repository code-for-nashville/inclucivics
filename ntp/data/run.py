from include.rethinkdb.tables import RdbTableRawData
import aggregate as agg
import sanitize as clean


def table_check():
    if RdbTableRawData.count().run() == 0:
        clean.run()
        agg.run()
        #system('python data/sanitize.py')
        #system('python data/aggregate.py')


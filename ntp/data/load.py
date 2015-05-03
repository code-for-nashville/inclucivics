import aggregate as agg
import sanitize as clean


def table_check():
    clean.run()
    agg.run()

table_check()


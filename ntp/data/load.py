import aggregate as agg
import sanitize as clean
import chi


def table_check():
    clean.run()
    agg.run()
    chi.run()



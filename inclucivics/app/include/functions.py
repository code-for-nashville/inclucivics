import rethinkdb as r
from ..data import DB_NAME, GOVERNMENT_EMPLOYEE_TABLE_NAME


def rdb_conn():
    return r.connect('localhost', 28015)


def rdb_get_data_by_department(department, key_index, timestamp=None):
    if not timestamp:
        from ...data.main import get_latest_loaded_timestamp
        timestamp = get_latest_loaded_timestamp()

    output = [
        elem for elem in
        r.db(DB_NAME)
        .table(GOVERNMENT_EMPLOYEE_TABLE_NAME)
        .get_all(
            department,
            index=key_index
        ).run(rdb_conn())
    ]

    return output[0]


def rdb_get_department_names(department_key):
    output = [
        elem for elem in
        r.db(DB_NAME)
        .table(GOVERNMENT_EMPLOYEE_TABLE_NAME)
        .map(
            lambda row: row[department_key]
        )
        .distinct()
        .run(rdb_conn())
    ]

    return output

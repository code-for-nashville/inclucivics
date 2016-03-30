import rethinkdb as r

LEGACY_DATABASE_NAME = 'hrc'
DATABASE_NAME = 'inclucivics'
TABLE_NAME = 'static'
SERVER = 'localhost'
PORT = 28015


def rdb_conn():
    return r.connect(SERVER, PORT)


def rdb_get_data_by_department(department, key_index):
    output = [
        elem for elem in
        r.db(LEGACY_DATABASE_NAME)
        .table(TABLE_NAME)
        .get_all(
            department,
            index=key_index
        ).run(rdb_conn())
    ]

    return output[0]


def rdb_get_department_names(department_key):
    output = [
        elem for elem in
        r.db(LEGACY_DATABASE_NAME)
        .table(TABLE_NAME)
        .map(
            lambda row: row[department_key]
        )
        .distinct()
        .run(rdb_conn())
    ]

    return output

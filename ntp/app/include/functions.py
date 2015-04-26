from ntp.data.include.rethinkdb.tables import RdbMostRecent


def rdb_get_data_by_department(department, key_index):

        output = [
            elem for elem in
            RdbMostRecent
            .get_all(
                department,
                index=key_index
            ).run()
        ]

        return output[0]


def rdb_get_department_names(department_key):

    output = [
        elem for elem in
        RdbMostRecent
        .map(
            lambda row: row[department_key]
        )
        .distinct()
        .run()
    ]

    return output


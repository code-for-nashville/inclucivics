from ntp.data_preparation.include.rethinkdb.tables import RdbTableEmployeesByDepartment


def rdb_get_data_by_department(department, key_index):

        output = [
            elem for elem in
            RdbTableEmployeesByDepartment
            .get_all(
                department,
                index=key_index
            ).run()
        ]

        return output[0]


def rdb_get_department_names(department_key):

    output = [
        elem for elem in
        RdbTableEmployeesByDepartment
        .map(
            lambda row: row[department_key]
        )
        .distinct()
        .run()
    ]

    return output


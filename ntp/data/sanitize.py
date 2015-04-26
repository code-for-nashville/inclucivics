import os
from include.sanitize.functions import lazy_read
from include.rethinkdb.vars import IMPORT_PATH
from include.sanitize.vars import DIRTY_SALARY, CLEAN_SALARY, GENDER, DEPARTMENT, ETHNICITY
from include.rethinkdb.init_db import RawDb


def run():
    root_path = os.path.join(os.path.dirname(__file__), IMPORT_PATH)
    hr_input = (filename for filename in os.listdir(root_path) if filename.endswith(".csv"))

    for full_name in hr_input:
        filename = full_name.split(".")[0]

        if filename not in RawDb.table_list().run():
            RawDb.table_create(filename).run()
            RawDb.table(filename).index_create(CLEAN_SALARY).run()

            new_table = RawDb.table(filename)

            path = os.path.join(os.path.dirname(__file__), IMPORT_PATH, full_name)

            # So this is all pretty hacky. I had to manually edit the file to handle the the change in key names, who
            #knows how prevalent this problem is going to be.

            data = [
                row for row in lazy_read(path, delimiter="|")
                if DIRTY_SALARY in row
                and len(row[DIRTY_SALARY]) != 0
            ]

            if not data:
                data = [
                    row for row in lazy_read(path, delimiter=",")
                    if DIRTY_SALARY in row
                    and len(row[DIRTY_SALARY]) != 0
                ]

            for document in data:
                if isinstance(document[DIRTY_SALARY], str):
                    document[CLEAN_SALARY] = int(
                        document[DIRTY_SALARY]
                        .replace(",", "")
                        .split(".")[0]
                    )
                    del document[DIRTY_SALARY]
                elif isinstance(document[DIRTY_SALARY], float):
                    del document[DIRTY_SALARY]

            to_insert = [
                {
                    GENDER: elem[GENDER],
                    ETHNICITY: elem[ETHNICITY],
                    DEPARTMENT: elem[DEPARTMENT],
                    CLEAN_SALARY: elem[CLEAN_SALARY]
                }
                for elem
                in data
            ]

            # This is where new data needs to be inserted.  We are going to want to have raw data for each time stamp
            new_table.index_wait().run()
            new_table.insert(to_insert).run()


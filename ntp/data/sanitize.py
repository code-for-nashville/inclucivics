import os
from include.sanitize.functions import lazy_read
from include.rethinkdb.vars import IMPORT_PATH
from include.sanitize.vars import DIRTY_SALARY, CLEAN_SALARY, GENDER, DEPARTMENT, ETHNICITY
from include.rethinkdb.tables import RdbTableRawData


path = os.path.join(os.path.dirname(__file__), IMPORT_PATH, "data.csv")
DATA = [elem for elem in lazy_read(path, delimiter="|")]

DATA = [
    elem for elem in DATA
    if DIRTY_SALARY in elem
    and len(elem[DIRTY_SALARY]) != 0
]

for document in DATA:
    if isinstance(document[DIRTY_SALARY], str):
        document[CLEAN_SALARY] = int(
            document[DIRTY_SALARY]
            .replace(",", "")
            .split(".")[0]
        )
        del document[DIRTY_SALARY]
    elif isinstance(document[DIRTY_SALARY], float):
        del document[DIRTY_SALARY]



TO_INSERT = [
    {
        GENDER: elem[GENDER],
        ETHNICITY: elem[ETHNICITY],
        DEPARTMENT: elem[DEPARTMENT],
        CLEAN_SALARY: elem[CLEAN_SALARY]
    }
    for elem
    in DATA
]

RdbTableRawData.insert(TO_INSERT).run()


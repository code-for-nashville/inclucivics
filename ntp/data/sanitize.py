from ntp.project.common.io import load_csv
from include.rethinkdb.vars import IMPORT_PATH
from include.sanitize.vars import DIRTY_SALARY, CLEAN_SALARY, GENDER, DEPARTMENT, ETHNICITY
from include.rethinkdb.tables import RdbTableRawData

DATA = load_csv(
    IMPORT_PATH + "data.csv",
    sep="|"
).to_dict(
    orient="records"
)

DATA = [
    elem
    for elem
    in DATA
    if DIRTY_SALARY
    in elem.keys()
    and not isinstance(
        elem[DIRTY_SALARY],
        float
    )
]

for document in DATA:
    if isinstance(document[DIRTY_SALARY], unicode):
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


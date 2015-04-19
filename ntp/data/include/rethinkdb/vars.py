from ..sanitize.vars import CLEAN_SALARY, NAME

INCLUCIVICS_DB = "INCLUCIVICS"
RAW_DB = "raw"

TABLE_RAW = "raw_data"
TABLE_GROUPED = "department_employees"

TABLES = [
    TABLE_RAW,
    TABLE_GROUPED
]

IMPORT_STRING = "%s.%s" % (INCLUCIVICS_DB, TABLE_RAW)
IMPORT_PATH = "files/input/"

INDEXES = [
    dict(
        table=TABLE_RAW,
        index=CLEAN_SALARY
    ),
    dict(
        table=TABLE_GROUPED,
        index=NAME
    )
]
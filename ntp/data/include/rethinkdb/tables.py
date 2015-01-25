from init_db import IncluvicsDb
from vars import TABLE_RAW, TABLE_GROUPED

RdbTableRawData = IncluvicsDb.table(TABLE_RAW)
RdbTableEmployeesByDepartment = IncluvicsDb.table(TABLE_GROUPED)
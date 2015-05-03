from init_db import ParsedDb
from ..aggregate.functions import most_recent
from vars import TABLE_RAW, TABLE_GROUPED

#RdbTableRawData = IncluvicsDb.table(TABLE_RAW)
#RdbTableEmployeesByDepartment = IncluvicsDb.table(TABLE_GROUPED)

RdbMostRecent = most_recent(ParsedDb)
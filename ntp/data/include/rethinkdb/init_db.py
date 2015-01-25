from ntp.project.rethinkdb.classes import RdbInitialize
from vars import INCLUCIVICS_DB, TABLES, INDEXES

RdbInitialize.validate_tables(INCLUCIVICS_DB, TABLES)
RdbInitialize.validate_indexes(INDEXES)

IncluvicsDb = RdbInitialize.db


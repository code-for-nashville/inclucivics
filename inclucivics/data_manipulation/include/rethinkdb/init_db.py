from inclucivics.project.rethinkdb.classes import RdbInitialize
from vars import INCLUCIVICS_DB, TABLES

RdbInitialize.validate_tables(INCLUCIVICS_DB, TABLES)
IncluvicsDb = RdbInitialize.db


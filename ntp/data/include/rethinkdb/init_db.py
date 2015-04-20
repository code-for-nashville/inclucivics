from ntp.project.rethinkdb.classes import RethinkValidator
from vars import INCLUCIVICS_DB, TABLES, INDEXES, RAW_DB

Cleaned = RethinkValidator()
Cleaned.validate_tables(INCLUCIVICS_DB, TABLES)
Cleaned.validate_indexes(INDEXES)
IncluvicsDb = Cleaned.db

Raw = RethinkValidator()
Raw.validate_databases([RAW_DB])
RawDb = Raw.r.db(RAW_DB)

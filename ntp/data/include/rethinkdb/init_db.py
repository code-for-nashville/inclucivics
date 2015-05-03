from ntp.project.rethinkdb.classes import RethinkValidator
from vars import PARSED_DB, TABLES, INDEXES, RAW_DB

Parsed = RethinkValidator()
#Cleaned.validate_tables(INCLUCIVICS_DB, TABLES)
#Cleaned.validate_indexes(INDEXES)
Parsed.validate_databases([PARSED_DB])
ParsedDb = Parsed.r.db(PARSED_DB)

Raw = RethinkValidator()
Raw.validate_databases([RAW_DB])
RawDb = Raw.r.db(RAW_DB)

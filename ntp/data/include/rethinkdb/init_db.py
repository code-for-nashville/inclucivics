from ntp.project.rethinkdb.classes import RethinkValidator
from vars import PARSED_DB, INCLUCIVICS_DB, TABLES, RAW_DB

Parsed = RethinkValidator()
Parsed.validate_databases([PARSED_DB])
ParsedDb = Parsed.r.db(PARSED_DB)

Raw = RethinkValidator()
Raw.validate_databases([RAW_DB])
RawDb = Raw.r.db(RAW_DB)

ChiSq = RethinkValidator()
ChiSq.validate_tables(INCLUCIVICS_DB, TABLES)
ChiSqDb = ChiSq.db

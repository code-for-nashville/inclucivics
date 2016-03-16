from ntp.project.rethinkdb.classes import RethinkValidator
import rethinkdb as r

# DB
db_name = "hrc"

# Tables

dates = "dates"
data = "data"

db = r.db(db_name)
rdb_data = db.table(data)
rdb_timestamps = db.table(dates)

init_db = RethinkValidator()
init_db.validate_databases(db_name)
init_db.validate_tables(db_name, [dates, data])



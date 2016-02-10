from ntp.project.rethinkdb.classes import RethinkValidator

# DB
db_name = "hrc"

# Tables

dates = "dates"
data = "data"

init_db = RethinkValidator()
init_db.validate_databases(db_name)
init_db.validate_tables(db_name, [dates, data])
db = init_db.db

rdb_data = db.table(data)
rdb_timestamps = db.table(dates)

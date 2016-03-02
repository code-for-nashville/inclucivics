from ntp.project.rethinkdb.classes import RethinkValidator
import rethinkdb as r

# DB
db_name = "hrc"

# Tables

timestamps = "timestamps"
static = "static"
temporal = "temporal"

db = r.db(db_name)
rdb_static = db.table(static)
rdb_temporal = db.table(temporal)
rdb_timestamps = db.table(timestamps)

init_db = RethinkValidator()
init_db.validate_databases(db_name)
init_db.validate_tables(db_name, [static, temporal, timestamps])



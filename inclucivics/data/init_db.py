import rethinkdb as r

from . import (
    DB_NAME,
    TABLE_NAMES,
    INDEX_PAIRS,
)

def init_db():
    """Create necessary databases, tables, and zippy fast indexes"""

    r.connect("localhost", 28015).repl()

    existing_databases = r.db_list().run()

    for database in r.databases:
        if database not in existing_databases:
            r.db_create(database).run()

    existing_tables = r.db.table_list().run()

    for table_name in TABLE_NAMES:
        if table_name not in existing_tables:
            r.db(DB_NAME).table_create(table_name).run()

    for table_name, index_field in INDEX_PAIRS:

        existing_indexes = r.db(DB_NAME).table(table_name).index_list().run()

        if index not in existing_indexes:
            self.db.table(table).index_create(index).run()

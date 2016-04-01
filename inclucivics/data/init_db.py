import rethinkdb as r
from inclucivics.data import config


class RethinkValidator(object):

    def __init__(self, server="localhost", port=28015):
        self.server = server 
        self.port = port 
        self.r = None

        try:
            import rethinkdb as r
        except ImportError:
            from sys import exit
            print "The rethinkdb client driver is required for this object"
            exit()

        if server:
            self.server = server

        if port:
            self.port = port

        try:
            # Top level objects
            r.connect(self.server, self.port).repl()
            self.r = r

        except r.errors.RqlDriverError:
            from sys import exit
            print "WARNING.  Could not connect to %s port %s" % (self.server, self.port)
            exit()


        self.database = None
        self.databases = None
        self.tables = None
        self.db = None

    def validate_databases(self, databases):

        if not isinstance(databases, list):
            self.databases = [databases]
        else:
            self.databases = databases

        existing_databases = self.r.db_list().run()

        for database in self.databases:
            if database not in existing_databases:
                self.r.db_create(database).run()
        return self

    def validate_tables(self, database, tables):
        self.database = database
        self.db = self.r.db(database)
        self.tables = tables
        self.validate_databases([self.database])

        existing_tables = self.db.table_list().run()

        for table in self.tables:
            if table not in existing_tables:
                self.db.table_create(table).run()

    def validate_indexes(self, indexes_object):

        for index_table_pairs in indexes_object:
            table = index_table_pairs['table']
            index = index_table_pairs['index']

            existing_indexes = self.db.table(table).index_list().run()

            if index not in existing_indexes:
                self.db.table(table).index_create(index).run()


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

init_db = RethinkValidator(server=config.RETHINK_HOST, port=config.RETHINK_PORT)
init_db.validate_databases(db_name)
init_db.validate_tables(db_name, [static, temporal, timestamps])



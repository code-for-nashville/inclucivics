
# These are the base initilizers for rethinkdb.  RethinkBase handles the highest level client connection
# While RethinkValidator does database and table checking
# RethinkValidator is a child of RethinkBase and inherits the basic rethinkdb connection object.


class RethinkBase(object):

    def __init__(self, server=None, port=None):

        self.server = "localhost"
        self.port = 28015
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


class RethinkValidator(RethinkBase):

    def __init__(self):
        RethinkBase.__init__(self)
        self.database = None
        self.db_list = None
        self.tables = None
        self.db = None

    def validate_databases(self, databases):
        self.db_list = databases
        existing_databases = self.r.db_list().run()

        for database in self.db_list:
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


RdbInitialize = RethinkValidator()
import os
RETHINK_PORT = os.environ.get("RETHINKDB_PORT_8080_TCP_PORT", 28015)
RETHINK_HOST = os.environ.get("RETHINKDB_PORT_8080_TCP_ADDR", "localhost")

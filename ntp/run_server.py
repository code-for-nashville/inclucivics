from project.cherrypy.classes import CherryFlask
from data.load import table_check

if __name__ == "__main__":

	# Make sure to not import anything from data.include.rethinkdb.tables
	# inside of table_check
	# tables.py has initialization that rely on a populated database
	# to define the vars RdbMostRecent, RdbChiSquare, and RdbChiMerged correctly
    table_check()

    from app import app
    CherryFlask().run_server(app)

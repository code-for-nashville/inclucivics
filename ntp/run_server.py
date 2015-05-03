from app import app
from project.cherrypy.classes import CherryFlask
from data.load import table_check


if __name__ == "__main__":
    table_check()
    CherryFlask().run_server(app)

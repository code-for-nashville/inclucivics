from app import app
from project.cherrypy.classes import CherryFlask

if __name__ == "__main__":
    CherryFlask().run_server(app)

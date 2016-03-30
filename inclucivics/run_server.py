from project.cherrypy.classes import CherryFlask

if __name__ == "__main__":

    from app import app
    CherryFlask().run_server(app)

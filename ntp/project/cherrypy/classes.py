
class CherryFlask(object):

    def __init__(self, port=None, host=None):

        self.port = 5000
        self.host = "0.0.0.0"

        if port:
            self.port = port

        if host:
            self.host = host

    def run_server(self, app):
        try:
            import cherrypy
            from paste.translogger import TransLogger

        except ImportError:
            print "Cherrypy and paste are required."
            return

        # Enable WSGI access logging via Paste
        app_logged = TransLogger(app)

        # Mount the WSGI callable object (app) on the root directory
        cherrypy.tree.graft(app_logged, '/')
        cherrypy.tree.mount(
            None,
            '/static',
                {
                    '/': {
                        'tools.staticdir.dir': app.static_folder,
                        'tools.staticdir.on': True,
                    }
                }
        )

        # Set the configuration of the web server
        cherrypy.config.update({
            'engine.autoreload.on': True,
            'log.screen': True,
            'server.socket_port': self.port,
            'server.socket_host': self.host
        })

        # Start the CherryPy WSGI web server

        cherrypy.engine.start()
        cherrypy.engine.block()





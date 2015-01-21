import cherrypy
from paste.translogger import TransLogger


class MainHandler(object):

    def __init__(self, templates=None, template_vars=None, report_template=None, port=None, socket_host=None):
        from jinja2 import Environment, FileSystemLoader
        import json

        self.env = Environment(loader=FileSystemLoader(templates))
        self.env.filters['jsonify'] = json.dumps
        self.template_vars = template_vars
        self.report_template = report_template
        self.port = 8082
        self.socket_host = '0.0.0.0'
        self.conf = None
        if port:
            self.port = port
        if socket_host:
            self.port = socket_host

    @cherrypy.expose
    def index(self):
        template = self.env.get_template(self.report_template)
        return template.render(self.template_vars)

    def configure_static(self, images_dir=None, css_dir=None, js_dir=None):
        from os import path as os_path

        current_dir = os_path.abspath('.')

        conf = dict()

        if images_dir:
            images = {
                "/images": {
                    "tools.staticdir.on": True,
                    "tools.staticdir.dir": os_path.join(current_dir, images_dir)
                }
            }
            conf["images"] = images

        if css_dir:
            css = {'/css': {
                    "tools.staticdir.on": True,
                    "tools.staticdir.dir": os_path.join(current_dir, css_dir)
                }
            }
            conf["css"] = css
        if js_dir:

            js = {
                "/js": {
                    "tools.staticdir.on": True,
                    "tools.staticdir.dir": os_path.join(current_dir, js_dir)
                }
            }

            conf["js"] = js

        self.conf = conf

    def run_server(self, app):
        # Enable WSGI access logging via Paste
        app_logged = TransLogger(app)

        # Mount the WSGI callable object (app) on the root directory
        cherrypy.tree.graft(app_logged, '/')

        # Set the configuration of the web server
        cherrypy.config.update({
            'engine.autoreload_on': True,
            'log.screen': True,
            'server.socket_port': self.port,
            'server.socket_host': self.socket_host
        })

        if self.conf:
            cherrypy.quickstart(self, "/", config=self.conf)
        else:
            cherrypy.engine.start()
            cherrypy.engine.block()








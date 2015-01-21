from flask import Flask, render_template, request, jsonify
from api.include.functions import rdb_get_data_by_department, rdb_get_department_names
from ntp.data_preparation.include.sanitize.vars import NAME
import cherrypy
from paste.translogger import TransLogger



app = Flask(__name__)
app.debug = True


@app.route('/api/data', methods=["GET", "POST"])
def data():

    if request.method == "POST":

        request_params = request.json.keys()
        if "attribute" not in request_params or NAME not in request_params:

            return jsonify(
            {
                "error": "Required key not found",
                "keys_found": request.json.keys()

            }
        )

        attribute = request.json["attribute"]
        output = rdb_get_data_by_department(
            request.json[NAME],
            NAME
        )
        response = output[attribute]

        return jsonify(
            {
                attribute: response
            }
        )

    if request.method == "GET":

        return jsonify(
            {
                "status": "good"
            }
        )

@app.route('/api/departments', methods=["GET"])
def departments():

    response = sorted(rdb_get_department_names(NAME))
    return jsonify(
        {
            "departments": response
        }
    )


@app.route("/")
def hello():
    return render_template("test.html")


def run_server():
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
        'server.socket_port': 5001,
        'server.socket_host': '0.0.0.0'
    })

    # Start the CherryPy WSGI web server
    cherrypy.engine.start()
    cherrypy.engine.block()

if __name__ == "__main__":
    run_server()


from . import app
from flask import request, jsonify
from include.functions import rdb_get_data_by_department, rdb_get_department_names

DEPARTMENT_NAME_KEY = "name"


@app.route('/api/data', methods=["GET", "POST"])
def data():

    if request.method == "POST":
        request_params = request.json.keys()
        if "attribute" not in request_params or DEPARTMENT_NAME_KEY not in request_params:

            return jsonify({"error": "Required key not found", "keys_found": request.json.keys()})

        attribute = request.json["attribute"]
        output = rdb_get_data_by_department(
            request.json[DEPARTMENT_NAME_KEY],
            DEPARTMENT_NAME_KEY
        )
        response = output[attribute]
        return jsonify({"attribute": response})

    if request.method == "GET":
        return jsonify({"status": "good"})


@app.route('/api/departments', methods=["GET"])
def departments():
    response = sorted(rdb_get_department_names(DEPARTMENT_NAME_KEY))
    return jsonify({"departments": response})

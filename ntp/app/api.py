from app import app
from flask import request, jsonify
from include.functions import rdb_get_data_by_department, rdb_get_department_names, rdb_get_temporal_values
from ntp.data.include.sanitize.vars import NAME

@app.route('/api/data', methods=["GET", "POST"])
def data():

    if request.method == "POST":
        request_params = request.json.keys()
        if "attribute" not in request_params or NAME not in request_params:

            return jsonify({"error": "Required key not found", "keys_found": request.json.keys()})

        attribute = request.json["attribute"]
        output = rdb_get_data_by_department(
            request.json[NAME],
            NAME
        )
        response = output[attribute]

        return jsonify({"attribute": response})

    if request.method == "GET":

        return jsonify({"status": "good"})

@app.route('/api/departments', methods=["GET"])
def departments():

    response = sorted(rdb_get_department_names(NAME))

    return jsonify({"departments": response})


@app.route('/api/temporal', methods=["GET"])
def temporal():

    response = rdb_get_temporal_values()

    return jsonify({"temporal": response})


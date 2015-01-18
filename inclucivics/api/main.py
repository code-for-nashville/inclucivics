from flask import Flask, jsonify, request, abort
from inclucivics.data_manipulation.include.rethinkdb.tables import RdbTableEmployeesByDepartment
from inclucivics.data_manipulation.include.sanitize.vars import NAME

app = Flask(__name__)

@app.route('/api/', methods=["POST"])
def eth():

    if not request.json:
        abort(400)

    output = [
        elem
        for elem
        in
        RdbTableEmployeesByDepartment.get_all(
            request.json[NAME],
            index=NAME
        ).run()
    ][0]

    attribute = request.json["attribute"]
    response = output[attribute]

    return jsonify(
        {
            attribute: response
        }
    )

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")



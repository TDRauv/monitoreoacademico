from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def inicio():
    return jsonify({
        "mensaje": "API de monitoreo ambiental funcionando",
        "estado": "OK"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )
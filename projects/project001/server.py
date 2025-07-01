from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import ssl

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

users = {'test': '1234'}
data_store = {"user_data": {"value": 42}}

@app.route('/login', methods=['POST'])
def login():
    json = request.get_json()
    if users.get(json.get('username')) == json.get('password'):
        return jsonify({"status": "ok", "token": "abcd1234"}), 200
    return jsonify({"status": "fail"}), 401

@app.route('/data', methods=['GET'])
def get_data():
    return jsonify(data_store["user_data"])

@app.route('/data', methods=['PUT'])
def update_data():
    json = request.get_json()
    data_store["user_data"] = json
    return jsonify({"status": "updated"}), 200

@socketio.on('message')
def handle_message(msg):
    print('Received:', msg)
    emit('response', {'message': f"Echo: {msg}"})

if __name__ == '__main__':
    print("Server started at http://localhost:5000 and https://localhost:5443")
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain('cert.pem', 'key.pem')  # self-signed cert
    socketio.run(app, host='0.0.0.0', port=5000)

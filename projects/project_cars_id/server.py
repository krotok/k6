from flask import Flask, jsonify
import re
import random

app = Flask(__name__)

@app.route('/app/car_<car_number>', methods=['GET'])
def car_status(car_number):
    # Проверка, что это число
    if not re.fullmatch(r'\d+', car_number):
        return jsonify({'error': 'Invalid car number'}), 400

    car_number_int = int(car_number)

    status = car_number_int < 1 or car_number_int > 10  # true, если вне диапазона 1–10
    random_id = random.randint(100, 999)
    
    
    return jsonify({
        'car_number': car_number_int,
        'status': status,
        "user": {
        "id": random_id,
        "name": "Alice",
        "roles": ["admin", "user"],
        "profile": {
          "email": "alice@example.com",
          "phones": [
            {"type": "mobile", "number": "123456789"},
            {"type": "home", "number": "987654321"}
          ]
        }
      }
    })

# Обработка всех остальных путей
@app.route('/', defaults={'path': ''}, methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'])
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'])
def catch_all(path):
    return "OK", 200

if __name__ == '__main__':
    app.run(port=8000)

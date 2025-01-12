from flask import Flask, jsonify , request
import json
from flask_cors import CORS
import os
from main import import_all_csv , match_data


app = Flask(__name__)
CORS(app) 

def read_json(file_path):
    try:
        with open(file_path, "r") as file:
            return json.load(file)
    except FileNotFoundError:
        return None
    except json.JSONDecodeError:
        return None

def write_json(file_path, data):
    try:
        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)
        return True
    except Exception as e:
        return False

@app.route("/transactions", methods=["GET"])
def get_transactions():
    year = request.args.get("year")
    initalise = match_data(year)

    if not year:
        return jsonify({"error": "Year parameter is required"}), 400

    file_path = f"data/{year}/{year}_transactions.json"
    data = read_json(file_path)
    if data is None:
        return jsonify({"error": "File not found or invalid JSON"}), 404

    return jsonify(data), 200


@app.route("/transactions", methods=["PUT"])
def update_transaction():

    update_data = request.json

    if not update_data:
        return jsonify({"error": "No data provided"}), 400

    year = update_data.get("year")
    if not year:
        return jsonify({"error": "Year is required"}), 400

    file_path = f"data/{year}/{year}_transactions.json"
    data = read_json(file_path)
    if data is None:
        return jsonify({"error": "File not found or invalid JSON"}), 404
    
    update_category = update_data.get("category")
    update_value = update_data.get("value")
    transaction_id = update_data.get("key")

    for transaction in data:
        if transaction.get("key") == transaction_id:
            transaction[update_category] = update_value
            if not write_json(file_path, data):
                return jsonify({"error": "Failed to write data"}), 500
            return jsonify({"message": "Transaction updated", "data": transaction}), 200

    return jsonify({"error": "Transaction not found"}), 404



@app.route("/overview", methods=["GET"])
def get_overview():

    data = read_json("data/overview.json")
    if data is None:
        return jsonify({"error": "File not found or invalid JSON"}), 404

    return jsonify(data), 200

@app.route("/overview", methods=["PUT"])
def update_overview():
    update_data = request.json
    if not update_data:
        return jsonify({"error": "No data provided"}), 400

    name = update_data.get("name")
    amount = update_data.get("amount")
    if not name or amount is None:
        return jsonify({"error": "Name and amount are required"}), 400

    data = read_json("data/overview.json")
    if data is None:
        return jsonify({"error": "File not found or invalid JSON"}), 404

    for item in data:
        if item["name"] == name:
            item["amount"] = amount
            if not write_json("data/overview.json", data):
                return jsonify({"error": "Failed to write data"}), 500
            return jsonify({"message": "Overview updated", "data": item}), 200

    return jsonify({"error": "Item not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=1000)
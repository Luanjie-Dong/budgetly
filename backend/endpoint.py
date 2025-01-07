from flask import Flask, jsonify , request
import json
from flask_cors import CORS
import os
from main import import_all_csv , match_data


app = Flask(__name__)
CORS(app) 

@app.route("/get-transactions", methods=["GET"])
def transactions():
    year = request.args.get('year')  # Use request.args to get query parameters
    if not year:
        return jsonify({"error": "Year parameter is required"}), 400

    file_path = f"data/{year}/{year}_transactions.json"
    
    update = match_data(year)
    try:
        with open(file_path, "r") as file:
            data = json.load(file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400

@app.route("/get-overview", methods=["GET"])
def overview():
    try:
        with open("data/overview.json", "r") as file:
            data = json.load(file)
        return jsonify(data)
    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400
    
@app.route("/modify-overview", methods=["POST"])
def modify_overview():
    update_data = request.json  
    update_name = update_data.get("name")
    update_amount = update_data.get("amount")

    if not update_name or update_amount is None:
        return jsonify({"error": "Name and amount are required"}), 400

    try:
        with open("data/overview.json", "r") as file:
            data = json.load(file)
        
        
        for finance in data:
            if finance['name'] == update_name:
                finance['amount'] = update_amount

        with open("data/overview.json", "w") as file:
            json.dump(data, file, indent=4)

        return jsonify({"message": "Data updated successfully", "data": data}), 200

    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except json.JSONDecodeError:
        return jsonify({"error": "Invalid JSON format"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/modify-transactions", methods=["POST"])
def modify_transactions():
    update_data = request.json  
    update_name = update_data.get("key")
    update_category = update_data.get("category")
    update_value = update_data.get("value")
    update_year = update_data.get('year')

    # Validate inputs
    if not update_name or update_category is None or update_value is None:
        return jsonify({"error": "Name, Category, and Value are required"}), 400

    try:
        # Ensure directory exists
        file_path = f"data/{update_year}/{update_year}_transactions.json"
        if not os.path.exists(os.path.dirname(file_path)):
            return jsonify({"error": "Year directory does not exist"}), 404

        with open(file_path, "r") as file:
            data = json.load(file)

        key_found = False
        for finance in data:
            if finance['key'] == update_name:
                finance[update_category] = update_value
                key_found = True
                break  

        if not key_found:
            return jsonify({"error": "Transaction key not found"}), 404

        with open(file_path, "w") as file:
            json.dump(data, file, indent=4)

        return jsonify({"message": "Data updated successfully", "data": data}), 200

    except FileNotFoundError:
        return jsonify({"error": "File not found"}), 404
    except json.JSONDecodeError as e:
        return jsonify({"error": f"Invalid JSON format: {str(e)}"}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=1000)

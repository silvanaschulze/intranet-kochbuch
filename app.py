from flask import Flask, jsonify
from flask_cors import CORS
from routes.benutzer_routes import benutzer_bp
import os

app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')

# Registrar blueprint
app.register_blueprint(benutzer_bp, url_prefix='/api/benutzer')

@app.route("/")
def home():
    return jsonify({"nachricht": "Willkommen im Intranet-Kochbuch!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


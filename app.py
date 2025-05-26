from flask import Flask, jsonify
from flask_cors import CORS
import os
from routes.benutzer_routes import benutzer_bp
from routes.rezept_routes import rezept_bp

app = Flask(__name__)

# Configuração CORS mais específica
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Type", "Authorization"],
        "supports_credentials": True
    }
})

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')

# Registrar blueprint
app.register_blueprint(benutzer_bp, url_prefix='/api/benutzer')
app.register_blueprint(rezept_bp, url_prefix='/api/rezepte')

@app.route("/")
def home():
    return jsonify({"nachricht": "Willkommen im Intranet-Kochbuch!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

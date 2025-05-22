from flask import Flask, jsonify
from flask_cors import CORS
import os
from routes.benutzer_routes import benutzer_bp
from routes.rezept_routes import rezept_bp  # Adicione esta linha


app = Flask(__name__)
CORS(app)

app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')

# Registrar blueprint

app.register_blueprint(benutzer_bp, url_prefix='/api/benutzer')
app.register_blueprint(rezept_bp, url_prefix='/api/rezepte')  # Adicione esta linha


@app.route("/")
def home():
    return jsonify({"nachricht": "Willkommen im Intranet-Kochbuch!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


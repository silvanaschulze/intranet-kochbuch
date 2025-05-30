"""
@fileoverview Hauptanwendungsmodul für das Intranet-Kochbuch Backend
@module app

Dieses Modul initialisiert die Flask-Anwendung und konfiguriert:
- CORS für Cross-Origin-Anfragen
- Statische Datei-Uploads
- API-Routen für Benutzer und Rezepte
"""

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os
from routes.benutzer_routes import benutzer_bp
from routes.rezept_routes import rezept_bp

app = Flask(__name__, static_folder='static')

# Configuração da chave secreta para JWT
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'seu-secret-key-seguro')  # Em produção, use variável de ambiente

# Configuração CORS mais permissiva para desenvolvimento
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000", "http://192.168.64.1:3000", "http://192.168.64.3:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"],
        "expose_headers": ["Content-Range", "X-Content-Range"],
        "supports_credentials": True
    }
})

# Configuração da pasta de uploads
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'static', 'uploads')
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Rota para servir arquivos estáticos da pasta uploads
@app.route('/static/uploads/<path:filename>')
def serve_upload(filename):
    """
    Serve arquivos estáticos da pasta uploads
    """
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

# Registrar blueprint
app.register_blueprint(benutzer_bp, url_prefix='/api/benutzer')
app.register_blueprint(rezept_bp, url_prefix='/api/rezepte')

@app.route("/")
def home():
    """
    Hauptendpunkt der API
    
    @return {dict} Willkommensnachricht
    """
    return jsonify({"nachricht": "Willkommen im Intranet-Kochbuch!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)


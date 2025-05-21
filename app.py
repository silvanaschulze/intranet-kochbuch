from flask import Flask, request, jsonify   # Importa funções essenciais do Flask
from flask_cors import CORS
from models.user import benutzer_registrieren  # função já adaptada para alemão
from routes.benutzer_routes import benutzer_bp
import os

app = Flask(__name__)  # cria a aplicação Flask
CORS(app)  # Libera acesso do Frontend (React) à API

# Configuração para uploads
app.config['UPLOAD_FOLDER'] = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'static/uploads')


# Registrar blueprint
app.register_blueprint(benutzer_bp, url_prefix='/api/benutzer')

@app.route("/")
def home():
    return jsonify({"nachricht": "Willkommen im Intranet-Kochbuch!"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

@app.route("/register", methods=["POST"])
def register():
    daten = request.get_json()
    name = daten.get("name")
    email = daten.get("email")
    passwort = daten.get("passwort")

    if benutzer_registrieren(name, email, passwort):  # <- FUNÇÃO CERTA AQUI
        return jsonify({"nachricht": "Benutzer erfolgreich registriert."}), 201
    else:
        return jsonify({"fehler": "Registrierung fehlgeschlagen."}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

from flask import Flask, request, jsonify   # Importa funções essenciais do Flask
from flask_cors import CORS
from models.user import benutzer_registrieren  # função já adaptada para alemão

app = Flask(__name__)  # cria a aplicação Flask
CORS(app)  # Libera acesso do Frontend (React) à API

@app.route("/")
def home():
    return jsonify({"nachricht": "Willkommen im Intranet-Kochbuch!"})  # JSON de boas-vindas

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

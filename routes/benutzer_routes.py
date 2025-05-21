from flask import Blueprint, request, jsonify
from models.user import benutzer_registrieren
from utils.validators import email_validieren, passwort_validieren

benutzer_bp = Blueprint('benutzer', __name__)

@benutzer_bp.route("/register", methods=["POST"])
def register():
    daten = request.get_json()
    name = daten.get("name")
    email = daten.get("email")
    passwort = daten.get("passwort")
    
    # Validação de dados
    if not name or len(name) < 3:
        return jsonify({"fehler": "Name muss mindestens 3 Zeichen haben."}), 400
        
    if not email or not email_validieren(email):
        return jsonify({"fehler": "Ungültige E-Mail-Adresse."}), 400
        
    if not passwort or not passwort_validieren(passwort):
        return jsonify({"fehler": "Passwort muss mindestens 8 Zeichen, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten."}), 400

    if benutzer_registrieren(name, email, passwort):
        return jsonify({"nachricht": "Benutzer erfolgreich registriert."}), 201
    else:
        return jsonify({"fehler": "Registrierung fehlgeschlagen."}), 500

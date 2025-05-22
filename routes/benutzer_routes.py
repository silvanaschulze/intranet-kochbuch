from flask import Blueprint, request, jsonify
from models.user import benutzer_registrieren, benutzer_anmelden
from utils.validators import email_validieren, passwort_validieren
from utils.token import token_generieren, token_erforderlich  # Adicione token_erforderlich aqui


benutzer_bp = Blueprint('benutzer', __name__)

@benutzer_bp.route("/register", methods=["POST"])
def register():
    daten = request.get_json()
    name = daten.get("name")
    email = daten.get("email")
    passwort = daten.get("passwort")

    # Verificações básicas
    if not name or len(name) < 3:
        return jsonify({"fehler": "Name muss mindestens 3 Zeichen haben."}), 400

    if not email or not email_validieren(email):
        return jsonify({"fehler": "Ungültige E-Mail-Adresse."}), 400

    if not passwort or not passwort_validieren(passwort):
        return jsonify({"fehler": "Passwort muss mindestens 8 Zeichen, einen Großbuchstaben, eine Zahl und ein Sonderzeichen enthalten."}), 400

    erfolg = benutzer_registrieren(name, email, passwort)
    if erfolg:
        return jsonify({"nachricht": "Benutzer erfolgreich registriert."}), 201
    else:
        return jsonify({"fehler": "Registrierung fehlgeschlagen."}), 500

@benutzer_bp.route("/login", methods=["POST"]) # Esta é a nova rota que você precisa adicionar
def login():
    daten = request.get_json()
    email = daten.get("email")
    passwort = daten.get("passwort")

    # Verificação de entrada básica (pode adicionar validação de email aqui também se quiser)
    if not email or not passwort:
        return jsonify({"fehler": "E-Mail und Passwort sind erforderlich."}), 400

    benutzer = benutzer_anmelden(email, passwort) # Chama a função de login do modelo de usuário

    if benutzer:
        # Se o login for bem-sucedido, gera um token JWT
        # A função benutzer_anmelden retorna um dicionário com o id do usuário.
        # Certifique-se de que seu user.py retorna o 'id' do usuário.
        token = token_generieren(benutzer['id'], benutzer['email']) #
        return jsonify({"nachricht": "Login erfolgreich", "token": token}), 200
    else:
        return jsonify({"fehler": "Ungültige E-Mail oder Passwort."}), 401

@benutzer_bp.route("/profil", methods=["GET"])
@token_erforderlich
def profil(token_daten):
    """
    Rota protegida que requer autenticação JWT.
    O decorador token_erforderlich adiciona token_daten aos argumentos da função.
    """
    return jsonify({
        "nachricht": "Zugriff erlaubt",
        "benutzer_id": token_daten["benutzer_id"],
        "email": token_daten["email"]
    })

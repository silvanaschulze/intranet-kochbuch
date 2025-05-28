"""
@fileoverview Benutzerrouten für das Intranet-Kochbuch
@module benutzer_routes

Dieses Modul implementiert die API-Endpunkte für Benutzerverwaltung:
- Registrierung
- Anmeldung
- Profilzugriff
- Token-Refresh
- Logout
"""

from flask import Blueprint, request, jsonify
from models.user import benutzer_registrieren, benutzer_anmelden
from utils.validators import email_validieren, passwort_validieren
from utils.token import (
    generate_tokens, 
    token_erforderlich, 
    token_blacklisten,
    token_verifizieren
)

benutzer_bp = Blueprint('benutzer', __name__)

@benutzer_bp.route("/register", methods=["POST"])
def register():
    """
    Endpunkt für die Benutzerregistrierung.
    
    @route POST /api/benutzer/register
    
    @body {Object} request_body
    @body {string} request_body.name - Benutzername (min. 3 Zeichen)
    @body {string} request_body.email - E-Mail-Adresse
    @body {string} request_body.passwort - Passwort (min. 8 Zeichen)
    
    @return {Object} response
    @return {string} response.nachricht - Erfolgsmeldung
    @return {string} [response.fehler] - Fehlermeldung bei Misserfolg
    
    @throws {400} - Bei ungültigen Eingabedaten
    @throws {500} - Bei Serverfehler
    """
    daten = request.get_json()
    name = daten.get("name")
    email = daten.get("email")
    passwort = daten.get("passwort")

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

@benutzer_bp.route("/login", methods=["POST"])
def login():
    """
    Endpunkt für die Benutzeranmeldung.
    
    @route POST /api/benutzer/login
    
    @body {Object} request_body
    @body {string} request_body.email - E-Mail-Adresse
    @body {string} request_body.passwort - Passwort
    
    @return {Object} response
    @return {string} response.nachricht - Erfolgsmeldung
    @return {string} response.access_token - JWT Access Token
    @return {string} response.refresh_token - JWT Refresh Token
    @return {Object} response.benutzer - Benutzerdaten
    @return {string} [response.fehler] - Fehlermeldung bei Misserfolg
    
    @throws {400} - Bei fehlenden Anmeldedaten
    @throws {401} - Bei ungültigen Anmeldedaten
    """
    daten = request.get_json()
    email = daten.get("email")
    passwort = daten.get("passwort")

    if not email or not passwort:
        return jsonify({"fehler": "E-Mail und Passwort sind erforderlich."}), 400

    benutzer = benutzer_anmelden(email, passwort)

    if benutzer:
        # Remove o hash da senha antes de enviar
        benutzer_daten = {
            'id': benutzer['id'],
            'name': benutzer['name'],
            'email': benutzer['email']
        }
        access_token, refresh_token = generate_tokens(benutzer['id'], benutzer['email'])
        return jsonify({
            "nachricht": "Login erfolgreich", 
            "access_token": access_token,
            "refresh_token": refresh_token,
            "benutzer": benutzer_daten
        }), 200
    else:
        return jsonify({"fehler": "Ungültige E-Mail oder Passwort."}), 401

@benutzer_bp.route("/refresh", methods=["POST"])
def refresh():
    """
    Endpunkt zum Erneuern des Access Tokens mittels Refresh Token.
    
    @route POST /api/benutzer/refresh
    
    @body {Object} request_body
    @body {string} request_body.refresh_token - Gültiger Refresh Token
    
    @return {Object} response
    @return {string} response.access_token - Neuer Access Token
    @return {string} [response.fehler] - Fehlermeldung bei Misserfolg
    
    @throws {401} - Bei ungültigem Refresh Token
    """
    refresh_token = request.json.get('refresh_token')
    if not refresh_token:
        return jsonify({"fehler": "Refresh Token erforderlich"}), 401

    token_data = token_verifizieren(refresh_token)
    if not token_data or token_data.get('type') != 'refresh':
        return jsonify({"fehler": "Ungültiger Refresh Token"}), 401

    # Gerar novo access token
    access_token, _ = generate_tokens(token_data['benutzer_id'], token_data['email'])
    
    return jsonify({
        "access_token": access_token
    }), 200

@benutzer_bp.route("/logout", methods=["POST"])
@token_erforderlich
def logout(token_daten):
    """
    Endpunkt für das Ausloggen eines Benutzers.
    
    @route POST /api/benutzer/logout
    
    @auth Erfordert gültigen JWT-Token
    
    @return {Object} response
    @return {string} response.nachricht - Erfolgsmeldung
    
    @throws {401} - Bei fehlendem oder ungültigem Token
    """
    token = request.headers.get('Authorization').split(' ')[1]
    token_blacklisten(token)
    
    return jsonify({
        "nachricht": "Erfolgreich ausgeloggt"
    }), 200

@benutzer_bp.route("/profil", methods=["GET"])
@token_erforderlich
def profil(token_daten):
    """
    Geschützter Endpunkt für den Profilzugriff.
    Erfordert einen gültigen JWT-Token.
    
    @route GET /api/benutzer/profil
    
    @param {Object} token_daten - Vom JWT-Token extrahierte Benutzerdaten
    @param {string} token_daten.benutzer_id - ID des Benutzers
    @param {string} token_daten.email - E-Mail des Benutzers
    
    @return {Object} response
    @return {string} response.nachricht - Erfolgsmeldung
    @return {string} response.benutzer_id - ID des Benutzers
    @return {string} response.email - E-Mail des Benutzers
    
    @throws {401} - Bei fehlendem oder ungültigem Token
    """
    return jsonify({
        "nachricht": "Zugriff erlaubt",
        "benutzer_id": token_daten["benutzer_id"],
        "email": token_daten["email"]
    })

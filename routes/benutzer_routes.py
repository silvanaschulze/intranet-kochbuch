"""
@fileoverview Benutzerrouten für das Intranet-Kochbuch
@module benutzer_routes

Dieses Modul implementiert die API-Endpunkte für Benutzerverwaltung:
- Registrierung
- Anmeldung
- Profilzugriff
"""

from flask import Blueprint, request, jsonify
from models.user import benutzer_registrieren, benutzer_anmelden
from utils.validators import email_validieren, passwort_validieren
from utils.token import token_generieren, token_erforderlich

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
    @return {string} response.token - JWT-Token bei erfolgreicher Anmeldung
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
        token = token_generieren(benutzer['id'], benutzer['email'])
        return jsonify({"nachricht": "Login erfolgreich", "token": token}), 200
    else:
        return jsonify({"fehler": "Ungültige E-Mail oder Passwort."}), 401

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

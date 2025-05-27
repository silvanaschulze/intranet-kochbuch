"""
@fileoverview Token-Utilitäten für das Intranet-Kochbuch
@module token

Dieses Modul stellt Funktionen für die JWT-Token-Verwaltung bereit:
- Token-Generierung
- Token-Verifizierung
- Geschützte Routen mit Token-Authentifizierung
"""

import jwt
import datetime
from functools import wraps
from flask import request, jsonify

# Geheimer Schlüssel für Token-Signierung
# TODO: In Produktionsumgebung durch Umgebungsvariable ersetzen
SECRET_KEY = "mein_geheimer_schluessel"

def token_generieren(benutzer_id, email):
    """
    Generiert einen JWT-Token für einen authentifizierten Benutzer.
    
    @param {int} benutzer_id - ID des Benutzers
    @param {string} email - E-Mail-Adresse des Benutzers
    
    @return {string} Der generierte JWT-Token
    
    @throws {TypeError} Bei ungültigen Parametern
    """
    payload = {
        'benutzer_id': benutzer_id,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_verifizieren(token):
    """
    Verifiziert und dekodiert einen JWT-Token.
    
    @param {string} token - Der zu verifizierende JWT-Token
    
    @return {dict|None} Die dekodierten Token-Daten oder None bei ungültigem Token
    @return {int} return.benutzer_id - ID des Benutzers
    @return {string} return.email - E-Mail-Adresse des Benutzers
    @return {datetime} return.exp - Ablaufzeitpunkt
    
    @throws {jwt.ExpiredSignatureError} Bei abgelaufenem Token
    @throws {jwt.InvalidTokenError} Bei ungültigem Token
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def token_erforderlich(f):
    """
    Dekorator für geschützte Routen, die einen gültigen JWT-Token erfordern.
    
    @decorator
    @param {function} f - Die zu schützende Route
    
    @return {function} Die geschützte Route
    
    @throws {403} Wenn kein Token vorhanden ist
    @throws {401} Bei ungültigem oder abgelaufenem Token
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            bearer = request.headers['Authorization']
            if bearer.startswith('Bearer '):
                token = bearer.replace('Bearer ', '', 1)

        if not token:
            return jsonify({'nachricht': 'Token erforderlich'}), 403

        daten = token_verifizieren(token)
        if daten is None:
            return jsonify({'nachricht': 'Ungültiger oder abgelaufener Token'}), 401

        kwargs['token_daten'] = daten
        return f(*args, **kwargs)
    return decorated

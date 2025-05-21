import jwt
import datetime
from functools import wraps
from flask import request, jsonify

# Chave secreta usada para codificar e decodificar o token
# Dica: depois troque essa chave por uma variável de ambiente para mais segurança
SECRET_KEY = "mein_geheimer_schluessel"

def token_generieren(benutzer_id, email):
    """
    Gera um token JWT com o ID e email do usuário e expiração de 2 horas
    """
    payload = {
        'benutzer_id': benutzer_id,
        'email': email,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=2)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def token_verifizieren(token):
    """
    Verifica e decodifica o token JWT
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
    Decorador que protege rotas exigindo um token válido no cabeçalho Authorization
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

        # Armazena as informações do token nos kwargs
        kwargs['token_daten'] = daten
        return f(*args, **kwargs)
    return decorated

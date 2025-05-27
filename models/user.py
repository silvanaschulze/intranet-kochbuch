"""
@fileoverview Benutzermodell für das Intranet-Kochbuch
@module user

Dieses Modul implementiert die Datenbankoperationen für Benutzer:
- Registrierung neuer Benutzer
- Benutzerauthentifizierung
"""

from db import verbinden, verbindung_schliessen
# Alterar esta linha:
# from utils.security import passwort_hashen
# Para esta:
from utils.security import passwort_hashen, passwort_verifizieren # [cite: 3]
# Remover: import bcrypt # [cite: 3]

def benutzer_registrieren(name, email, passwort):
    """
    Registriert einen neuen Benutzer in der Datenbank.
    
    @param {string} name - Name des Benutzers
    @param {string} email - E-Mail-Adresse des Benutzers
    @param {string} passwort - Unverschlüsseltes Passwort des Benutzers
    
    @return {boolean} True bei erfolgreicher Registrierung, False bei Fehler
    
    @throws {Exception} Bei Datenbankfehlern
    """
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return False
            
        cursor = verbindung.cursor()
        passwort_hash = passwort_hashen(passwort)
        # Alterar nome da tabela para 'user' (conforme as diretrizes do projeto)
        sql = "INSERT INTO user (name, email, passwort) VALUES (%s, %s, %s)" # [cite: 18, 33, 43]
        werte = (name, email, passwort_hash)
        cursor.execute(sql, werte)
        verbindung.commit()
        return True
    except Exception as fehler:
        print(f"Fehler beim Registrieren des Benutzers: {fehler}")
        return False
    finally:
        if cursor:
            cursor.close()
        if verbindung:
            verbindung_schliessen(verbindung)


def benutzer_anmelden(email, passwort):
    """
    Authentifiziert einen Benutzer anhand von E-Mail und Passwort.
    
    @param {string} email - E-Mail-Adresse des Benutzers
    @param {string} passwort - Unverschlüsseltes Passwort des Benutzers
    
    @return {dict|None} Benutzerdaten bei erfolgreicher Anmeldung, None bei Fehler
    @return {int} return.id - Benutzer-ID
    @return {string} return.name - Benutzername
    @return {string} return.email - E-Mail-Adresse
    
    @throws {Exception} Bei Datenbankfehlern
    """
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return None

        cursor = verbindung.cursor(dictionary=True) # dictionary=True retorna resultados como dicionários, o que é mais fácil de acessar.
        # Alterar nome da tabela para 'user'
        sql = "SELECT id, name, email, passwort FROM user WHERE email = %s" # [cite: 18, 33, 43] # Selecionar ID também, você vai precisar para gerar o token.
        cursor.execute(sql, (email,))
        benutzer = cursor.fetchone()

        # A MAIOR MUDANÇA É AQUI: usar a função passwort_verifizieren que você criou
        if benutzer and passwort_verifizieren(passwort, benutzer['passwort']): # [cite: 3]
            # Se a senha for válida, retornar os dados do usuário
            return benutzer

        return None # Credenciais inválidas
    except Exception as fehler:
        print(f" Fehler beim Anmelden des Benutzers: {fehler}")
        return None
    finally:
        if cursor:
            cursor.close()
        if verbindung:
            verbindung_schliessen(verbindung)
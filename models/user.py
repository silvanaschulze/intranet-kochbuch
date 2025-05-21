from db import verbinden, verbindung_schliessen
from utils.security import passwort_hashen

def benutzer_registrieren(name, email, passwort):
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return False
            
        cursor = verbindung.cursor()
        passwort_hash = passwort_hashen(passwort)
        sql = "INSERT INTO benutzer (name, email, passwort) VALUES (%s, %s, %s)"
        werte = (name, email, passwort_hash)
        cursor.execute(sql, werte)
        verbindung.commit()
        return True
    except Exception as fehler:
        print(f"❌ Fehler beim Registrieren des Benutzers: {fehler}")
        return False
    finally:
        if cursor:
            cursor.close()
        if verbindung:
            verbindung_schliessen(verbindung)

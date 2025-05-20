import mysql.connector
import os
from dotenv import load_dotenv
from utils.security import passwort_hashen

load_dotenv()

def benutzer_registrieren(name, email, passwort):
    try:
        verbindung = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        cursor = verbindung.cursor()
        passwort_hash = passwort_hashen(passwort)
        sql = "INSERT INTO benutzer (name, email, passwort) VALUES (%s, %s, %s)"
        werte = (name, email, passwort_hash)
        cursor.execute(sql, werte)
        verbindung.commit()
        return True
    except mysql.connector.Error as fehler:
        print(f"❌ Fehler beim Registrieren des Benutzers: {fehler}")
        return False

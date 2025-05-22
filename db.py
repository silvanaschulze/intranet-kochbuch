import os
import mysql.connector
from dotenv import load_dotenv

# Carregar variáveis do arquivo .env
load_dotenv()

def verbinden():
    try:
        verbindung = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        print("Verbindung zur Datenbank erfolgreich hergestellt.")
        return verbindung
    except mysql.connector.Error as fehler:
        print(f" Fehler bei der Verbindung zur Datenbank: {fehler}")
        return None

def verbindung_schliessen(verbindung):
    """Fecha a conexão com o banco de dados de forma segura."""
    if verbindung and verbindung.is_connected():
        verbindung.close()
        print("Datenbankverbindung sicher geschlossen.")

if __name__ == "__main__":
    conn = verbinden()
    if conn:
        verbindung_schliessen(conn)


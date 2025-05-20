import os
import mysql.connector
from dotenv import load_dotenv

# Carregar variáveis do arquivo .env
load_dotenv()

# Conexao sefura ao banco MySQL
def verbinden():
    try:
        verbindung = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )
        print("✅ Verbindung zur Datenbank erfolgreich hergestellt.")
        return verbindung
    except mysql.connector.Error as fehler:
        print(f"❌ Fehler bei der Verbindung zur Datenbank: {fehler}")
        return None

if __name__ == "__main__":
    verbinden()

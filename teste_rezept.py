from models.rezept import rezept_erstellen, rezept_abrufen, rezepte_auflisten

# Criar uma receita
rezept_id = rezept_erstellen(
    titel="Apfelkuchen",
    zutaten=[
        {"name": "Äpfel", "menge": "500g"},
        {"name": "Mehl", "menge": "300g"},
        {"name": "Zucker", "menge": "150g"}
    ],
    zubereitung="Äpfel schälen und in Stücke schneiden...",
    benutzer_id=1  # ID eines existierenden Benutzers
)

print(f"Neue Rezept-ID: {rezept_id}")

# Rezept abrufen
rezept = rezept_abrufen(rezept_id)
print(f"Rezeptdetails: {rezept}")

# Alle Rezepte auflisten
rezepte = rezepte_auflisten()
print(f"Anzahl der Rezepte: {len(rezepte)}")

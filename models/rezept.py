from db import verbinden, verbindung_schliessen
import json

def rezept_erstellen(titel, zutaten, zubereitung, benutzer_id, bild_pfad=None, kategorie_id=None):
    """
    Erstellt ein neues Rezept in der Datenbank.
    
    Args:
        titel (str): Titel des Rezepts
        zutaten (list): Liste der Zutaten als JSON-String oder Python-Liste
        zubereitung (str): Zubereitungsanleitung
        benutzer_id (int): ID des Benutzers, der das Rezept erstellt
        bild_pfad (str, optional): Pfad zum Bild des Rezepts
        kategorie_id (int, optional): ID der Kategorie des Rezepts
        
    Returns:
        int: ID des erstellten Rezepts bei Erfolg, None bei Fehler
    """
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return None
            
        cursor = verbindung.cursor()
        
        # Zutaten als JSON-String speichern, falls sie als Liste übergeben wurden
        if isinstance(zutaten, list):
            zutaten = json.dumps(zutaten)
        
        sql = """
        INSERT INTO rezept (titel, zutaten, zubereitung, benutzer_id, bild_pfad, kategorie_id)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        werte = (titel, zutaten, zubereitung, benutzer_id, bild_pfad, kategorie_id)
        
        cursor.execute(sql, werte)
        verbindung.commit()
        
        # ID des erstellten Rezepts zurückgeben
        return cursor.lastrowid
    except Exception as fehler:
        print(f" Fehler beim Erstellen des Rezepts: {fehler}")
    if verbindung:
        verbindung.rollback()  # Adicione isso para reverter a transação em caso de erro
    return None  # Mantenha como está ou altere para (False, str(fehler)) se a rota espera isso

def rezept_abrufen(rezept_id):
    """
    Ruft ein einzelnes Rezept anhand seiner ID ab.
    
    Args:
        rezept_id (int): Die ID des abzurufenden Rezepts
        
    Returns:
        dict: Ein Dictionary mit den Rezeptdaten oder None, wenn das Rezept nicht gefunden wurde
    """
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return None
            
        cursor = verbindung.cursor(dictionary=True)
        
        sql = """
        SELECT r.*, u.name as benutzer_name
        FROM rezept r
        JOIN user u ON r.benutzer_id = u.id
        WHERE r.id = %s
        """
        cursor.execute(sql, (rezept_id,))
        rezept = cursor.fetchone()
        
        if rezept:
            # Zutaten von JSON-String in Liste umwandeln
            try:
                rezept['zutaten'] = json.loads(rezept['zutaten'])
            except:
                # Falls die Zutaten nicht als gültiger JSON-String gespeichert sind
                pass
                
        return rezept
    except Exception as fehler:
        print(f" Fehler beim Abrufen des Rezepts: {fehler}")
        return None
    finally:
        if cursor:
            cursor.close()
        if verbindung:
            verbindung_schliessen(verbindung)

def rezepte_auflisten(limit=10, offset=0, benutzer_id=None, kategorie_id=None):
    """
    Listet Rezepte mit optionaler Filterung und Paginierung auf.
    
    Args:
        limit (int, optional): Maximale Anzahl der zurückzugebenden Rezepte
        offset (int, optional): Anzahl der zu überspringenden Rezepte (für Paginierung)
        benutzer_id (int, optional): Filtert nach Rezepten eines bestimmten Benutzers
        kategorie_id (int, optional): Filtert nach Rezepten einer bestimmten Kategorie
        
    Returns:
        list: Liste von Rezept-Dictionaries
    """
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return []
            
        cursor = verbindung.cursor(dictionary=True)
        
        # Basis-SQL-Abfrage
        sql = """
        SELECT r.*, u.name as benutzer_name
        FROM rezept r
        JOIN user u ON r.benutzer_id = u.id
        """
        
        # Filter hinzufügen
        bedingungen = []
        parameter = []
        
        if benutzer_id is not None:
            bedingungen.append("r.benutzer_id = %s")
            parameter.append(benutzer_id)
            
        if kategorie_id is not None:
            bedingungen.append("r.kategorie_id = %s")
            parameter.append(kategorie_id)
            
        if bedingungen:
            sql += " WHERE " + " AND ".join(bedingungen)
            
        # Sortierung und Paginierung
        sql += " ORDER BY r.erstellungsdatum DESC LIMIT %s OFFSET %s"
        parameter.extend([limit, offset])
        
        cursor.execute(sql, parameter)
        rezepte = cursor.fetchall()
        
        # Zutaten für jedes Rezept von JSON-String in Liste umwandeln
        for rezept in rezepte:
            try:
                rezept['zutaten'] = json.loads(rezept['zutaten'])
            except:
                pass
                
        return rezepte
    except Exception as fehler:
        print(f" Fehler beim Auflisten der Rezepte: {fehler}")
        return []
    finally:
        if cursor:
            cursor.close()
        if verbindung:
            verbindung_schliessen(verbindung)

def rezept_aktualisieren(rezept_id, titel=None, zutaten=None, zubereitung=None, bild_pfad=None, kategorie_id=None, benutzer_id=None):
    """
    Aktualisiert ein bestehendes Rezept.
    
    Args:
        rezept_id (int): ID des zu aktualisierenden Rezepts
        titel (str, optional): Neuer Titel des Rezepts
        zutaten (list, optional): Neue Liste der Zutaten
        zubereitung (str, optional): Neue Zubereitungsanleitung
        bild_pfad (str, optional): Neuer Pfad zum Bild des Rezepts
        kategorie_id (int, optional): Neue Kategorie-ID
        benutzer_id (int, optional): ID des Benutzers, der das Rezept aktualisieren darf
        
    Returns:
        bool: True bei Erfolg, False bei Fehler
    """
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return False
            
        cursor = verbindung.cursor()
        
        # Prüfen, ob der Benutzer berechtigt ist, das Rezept zu aktualisieren
        if benutzer_id is not None:
            cursor.execute("SELECT benutzer_id FROM rezept WHERE id = %s", (rezept_id,))
            rezept = cursor.fetchone()
            if not rezept or rezept[0] != benutzer_id:
                return False
        
        # Zu aktualisierende Felder sammeln
        update_felder = []
        parameter = []
        
        if titel is not None:
            update_felder.append("titel = %s")
            parameter.append(titel)
            
        if zutaten is not None:
            # Zutaten als JSON-String speichern, falls sie als Liste übergeben wurden
            if isinstance(zutaten, list):
                zutaten = json.dumps(zutaten)
            update_felder.append("zutaten = %s")
            parameter.append(zutaten)
            
        if zubereitung is not None:
            update_felder.append("zubereitung = %s")
            parameter.append(zubereitung)
            
        if bild_pfad is not None:
            update_felder.append("bild_pfad = %s")
            parameter.append(bild_pfad)
            
        if kategorie_id is not None:
            update_felder.append("kategorie_id = %s")
            parameter.append(kategorie_id)
            
        # Wenn keine Felder aktualisiert werden sollen
        if not update_felder:
            return True
            
        # SQL-Abfrage erstellen
        sql = f"UPDATE rezept SET {', '.join(update_felder)} WHERE id = %s"
        parameter.append(rezept_id)
        
        cursor.execute(sql, parameter)
        verbindung.commit()
        
        return cursor.rowcount > 0
    except Exception as fehler:
        print(f" Fehler beim Aktualisieren des Rezepts: {fehler}")
        return False
    finally:
        if cursor:
            cursor.close()
        if verbindung:
            verbindung_schliessen(verbindung)

def rezept_loeschen(rezept_id, benutzer_id=None):
    """
    Löscht ein Rezept aus der Datenbank.
    
    Args:
        rezept_id (int): ID des zu löschenden Rezepts
        benutzer_id (int, optional): ID des Benutzers, der das Rezept löschen darf
        
    Returns:
        bool: True bei Erfolg, False bei Fehler
    """
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return False
            
        cursor = verbindung.cursor()
        
        # Prüfen, ob der Benutzer berechtigt ist, das Rezept zu löschen
        if benutzer_id is not None:
            cursor.execute("SELECT benutzer_id FROM rezept WHERE id = %s", (rezept_id,))
            rezept = cursor.fetchone()
            if not rezept or rezept[0] != benutzer_id:
                return False
        
        cursor.execute("DELETE FROM rezept WHERE id = %s", (rezept_id,))
        verbindung.commit()
        
        return cursor.rowcount > 0
    except Exception as fehler:
        print(f"Fehler beim Löschen des Rezepts: {fehler}")
        return False
    finally:
        if cursor:
            cursor.close()
        if verbindung:
            verbindung_schliessen(verbindung)

def rezepte_suchen(suchbegriff, limit=10, offset=0):
    """
    Sucht nach Rezepten, die den Suchbegriff im Titel oder in den Zutaten enthalten.
    
    Args:
        suchbegriff (str): Der Suchbegriff
        limit (int, optional): Maximale Anzahl der zurückzugebenden Rezepte
        offset (int, optional): Anzahl der zu überspringenden Rezepte (für Paginierung)
        
    Returns:
        list: Liste von Rezept-Dictionaries, die dem Suchbegriff entsprechen
    """
    verbindung = None
    cursor = None
    try:
        verbindung = verbinden()
        if not verbindung:
            return []
            
        cursor = verbindung.cursor(dictionary=True)
        
        # Suchbegriff für LIKE-Abfrage vorbereiten
        such_param = f"%{suchbegriff}%"
        
        sql = """
        SELECT r.*, u.name as benutzer_name
        FROM rezept r
        JOIN user u ON r.benutzer_id = u.id
        WHERE r.titel LIKE %s OR r.zutaten LIKE %s
        ORDER BY r.erstellungsdatum DESC
        LIMIT %s OFFSET %s
        """
        
        cursor.execute(sql, (such_param, such_param, limit, offset))
        rezepte = cursor.fetchall()
        
        # Zutaten für jedes Rezept von JSON-String in Liste umwandeln
        for rezept in rezepte:
            try:
                rezept['zutaten'] = json.loads(rezept['zutaten'])
            except:
                pass
                
        return rezepte
    except Exception as fehler:
        print(f" Fehler bei der Suche nach Rezepten: {fehler}")
        return []
    finally:
        if cursor:
            cursor.close()
        if verbindung:
            verbindung_schliessen(verbindung)

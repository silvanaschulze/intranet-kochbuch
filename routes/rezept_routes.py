import os
import uuid
import imghdr
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from models.rezept import (rezept_erstellen, rezept_abrufen, rezepte_auflisten,
                          rezept_aktualisieren, rezept_loeschen, rezepte_suchen)
from utils.token import token_erforderlich
import json

# Blueprint für Rezepte erstellen
rezept_bp = Blueprint('rezept', __name__)

# Definir explicitamente as extensões permitidas
ERLAUBTE_ERWEITERUNGEN = {'png', 'jpg', 'jpeg', 'gif'}
# Definir tamanho máximo de arquivo (5 MB)
MAX_BILD_GROESSE_MB = 5

def datei_erlaubt(dateiname):
    """Überprüft, ob die Dateierweiterung erlaubt ist"""
    return '.' in dateiname and \
           dateiname.rsplit('.', 1)[1].lower() in ERLAUBTE_ERWEITERUNGEN

def ist_bild(file_stream):
    """Überprüft, ob der Dateiinhalt tatsächlich ein Bild ist"""
    try:
        # Lesen Sie die ersten Bytes, um den Dateityp zu überprüfen
        header = file_stream.read(512)
        file_stream.seek(0)  # Zurück zum Anfang
        
        # Überprüfen Sie den Dateiheader auf gängige Bildformate
        return bool(imghdr.what(None, header))
    except Exception:
        return False

def bild_speichern(bild):
    """Speichert ein hochgeladenes Bild und gibt den Dateipfad zurück"""
    if not bild or not bild.filename:
        return None
        
    if not datei_erlaubt(bild.filename):
        return None
        
    try:
        # Sicheren Dateinamen erstellen
        dateiname = secure_filename(bild.filename)
        # Eindeutigen Dateinamen generieren
        eindeutiger_dateiname = f"{uuid.uuid4()}_{dateiname}"
        # Pfad zum Speichern
        upload_ordner = os.path.join('static', 'uploads')
        # Sicherstellen, dass der Ordner existiert
        os.makedirs(upload_ordner, exist_ok=True)
        # Vollständiger Pfad
        pfad = os.path.join(upload_ordner, eindeutiger_dateiname)
        # Bild speichern
        bild.save(pfad)
        return pfad
    except Exception as e:
        print(f"Fehler beim Speichern des Bildes: {e}")
        return None




@rezept_bp.route('', methods=['GET'])
def rezepte_liste():
    """
    Listet alle Rezepte auf, mit optionaler Paginierung und Filterung
    
    Query-Parameter:
    - limit: Maximale Anzahl der zurückzugebenden Rezepte (Standard: 10)
    - offset: Anzahl der zu überspringenden Rezepte (Standard: 0)
    - benutzer_id: Filtert nach Rezepten eines bestimmten Benutzers
    - kategorie_id: Filtert nach Rezepten einer bestimmten Kategorie
    - suchbegriff: Sucht nach Rezepten, die den Suchbegriff enthalten
    """
    try:
        # Parameter aus der Anfrage extrahieren
        limit = request.args.get('limit', default=10, type=int)
        offset = request.args.get('offset', default=0, type=int)
        benutzer_id = request.args.get('benutzer_id', default=None, type=int)
        kategorie_id = request.args.get('kategorie_id', default=None, type=int)
        suchbegriff = request.args.get('suchbegriff', default=None, type=str)
        
        # Rezepte abrufen
        if suchbegriff:
            rezepte = rezepte_suchen(suchbegriff, limit, offset)
        else:
            rezepte = rezepte_auflisten(limit, offset, benutzer_id, kategorie_id)
        
        # Metadaten für Paginierung
        metadaten = {
            'anzahl': len(rezepte),
            'limit': limit,
            'offset': offset
        }
        
        return jsonify({
            'rezepte': rezepte,
            'meta': metadaten
        }), 200
    except Exception as fehler:
        print(f"Fehler beim Auflisten der Rezepte: {fehler}")
        return jsonify({'fehler': 'Interner Serverfehler'}), 500

@rezept_bp.route('/<int:rezept_id>', methods=['GET'])
def rezept_details(rezept_id):
    """
    Gibt die Details eines bestimmten Rezepts zurück
    
    Path-Parameter:
    - rezept_id: ID des abzurufenden Rezepts
    """
    try:
        rezept = rezept_abrufen(rezept_id)
        
        if rezept:
            return jsonify(rezept), 200
        else:
            return jsonify({'fehler': 'Rezept nicht gefunden'}), 404
    except Exception as fehler:
        print(f"Fehler beim Abrufen des Rezepts: {fehler}")
        return jsonify({'fehler': 'Interner Serverfehler'}), 500

@rezept_bp.route('', methods=['POST'])
@token_erforderlich

def rezept_erstellen_route(token_daten):
    """
    Erstellt ein neues Rezept
    
    Erfordert einen gültigen JWT-Token
    
    Request-Body:
    - titel: Titel des Rezepts
    - zutaten: Liste der Zutaten
    - zubereitung: Zubereitungsanleitung
    - kategorie_id: (Optional) ID der Kategorie
    
    Request-Files:
    - bild: (Optional) Bild des Rezepts
    """
    try:
        # Daten aus der Anfrage extrahieren
        daten  = request.get_json()

        
        # Pflichtfelder überprüfen
        if not daten or 'titel' not in daten or 'zubereitung' not in daten:
            return jsonify({'fehler': 'Titel und Zubereitung sind erforderlich'}), 400

        
        # Zutaten aus JSON-String extrahieren, falls vorhanden
        zutaten = []
        if 'zutaten' in daten:
            if isinstance(daten['zutaten'], list):
                zutaten = daten['zutaten']
    # Wenn zutaten ein String ist, versuchen wir, ihn als JSON zu parsen
            elif isinstance(daten['zutaten'], str):
                try:
                    zutaten = json.loads(daten['zutaten'])
                except json.JSONDecodeError:
                    return jsonify({'fehler': 'Ungültiges JSON-Format für Zutaten'}), 400
        
        # Bild verarbeiten, falls vorhanden
        bild_pfad = None
        if 'bild' in request.files:
            bild = request.files['bild']
            bild_pfad, fehler = bild_speichern(bild)
            if fehler:
                return jsonify({'fehler': fehler}), 400

        
        # Kategorie-ID extrahieren, falls vorhanden
        kategorie_id = daten.get('kategorie_id')
        if kategorie_id:
            try:
                kategorie_id = int(kategorie_id)
            except ValueError:
                kategorie_id = None
        
        # Benutzer-ID aus Token extrahieren
        benutzer_id = token_daten['benutzer_id']
        
        # Rezept erstellen
        rezept_id = rezept_erstellen(
            titel=daten['titel'],
            zutaten=zutaten,
            zubereitung=daten['zubereitung'],
            benutzer_id=benutzer_id,
            bild_pfad=bild_pfad,
            kategorie_id=kategorie_id
        )
        
        if rezept_id:
            # Neu erstelltes Rezept abrufen
            neues_rezept = rezept_abrufen(rezept_id)
            return jsonify({
                'nachricht': 'Rezept erfolgreich erstellt',
                'rezept': neues_rezept
            }), 201
        else:
            return jsonify({'fehler': 'Fehler beim Erstellen des Rezepts'}), 500
    except Exception as fehler:
        print(f"Fehler beim Erstellen des Rezepts: {fehler}")
        return jsonify({'fehler': 'Interner Serverfehler'}), 500

@rezept_bp.route('/<int:rezept_id>', methods=['PUT'])
@token_erforderlich
def rezept_aktualisieren_route(token_daten, rezept_id):
    """
    Aktualisiert ein bestehendes Rezept
    
    Erfordert einen gültigen JWT-Token
    Der Benutzer muss der Ersteller des Rezepts sein
    
    Path-Parameter:
    - rezept_id: ID des zu aktualisierenden Rezepts
    
    Request-Body:
    - titel: (Optional) Neuer Titel des Rezepts
    - zutaten: (Optional) Neue Liste der Zutaten
    - zubereitung: (Optional) Neue Zubereitungsanleitung
    - kategorie_id: (Optional) Neue ID der Kategorie
    
    Request-Files:
    - bild: (Optional) Neues Bild des Rezepts
    """
    try:
        # Benutzer-ID aus Token extrahieren
        benutzer_id = token_daten['benutzer_id']
        
        # Überprüfen, ob das Rezept existiert und dem Benutzer gehört
        rezept = rezept_abrufen(rezept_id)
        if not rezept:
            return jsonify({'fehler': 'Rezept nicht gefunden'}), 404
        
        if rezept['benutzer_id'] != benutzer_id:
            return jsonify({'fehler': 'Keine Berechtigung zum Aktualisieren dieses Rezepts'}), 403
        
        # Daten aus der Anfrage extrahieren
        daten = request.form.to_dict()
        
        # Zu aktualisierende Felder vorbereiten
        update_felder = {}
        
        # Titel aktualisieren, falls vorhanden
        if 'titel' in daten:
            update_felder['titel'] = daten['titel']
        
        # Zubereitung aktualisieren, falls vorhanden
        if 'zubereitung' in daten:
            update_felder['zubereitung'] = daten['zubereitung']
        
        # Zutaten aktualisieren, falls vorhanden
        if 'zutaten' in daten:
            try:
                update_felder['zutaten'] = json.loads(daten['zutaten'])
            except json.JSONDecodeError:
                return jsonify({'fehler': 'Ungültiges JSON-Format für Zutaten'}), 400
        
        # Kategorie-ID aktualisieren, falls vorhanden
        if 'kategorie_id' in daten:
            try:
                update_felder['kategorie_id'] = int(daten['kategorie_id'])
            except ValueError:
                update_felder['kategorie_id'] = None
        
        # Bild aktualisieren, falls vorhanden
        if 'bild' in request.files:
            bild = request.files['bild']
            bild_pfad = bild_speichern(bild)
            if bild and not bild_pfad:
                return jsonify({'fehler': 'Ungültiger Dateityp für Bild'}), 400
            update_felder['bild_pfad'] = bild_pfad
        
        # Rezept aktualisieren
        erfolg = rezept_aktualisieren(
            rezept_id=rezept_id,
            benutzer_id=benutzer_id,
            **update_felder
        )
        
        if erfolg:
            # Aktualisiertes Rezept abrufen
            aktualisiertes_rezept = rezept_abrufen(rezept_id)
            return jsonify({
                'nachricht': 'Rezept erfolgreich aktualisiert',
                'rezept': aktualisiertes_rezept
            }), 200
        else:
            return jsonify({'fehler': 'Fehler beim Aktualisieren des Rezepts'}), 500
    except Exception as fehler:
        print(f"Fehler beim Aktualisieren des Rezepts: {fehler}")
        return jsonify({'fehler': 'Interner Serverfehler'}), 500

@rezept_bp.route('/<int:rezept_id>', methods=['DELETE'])
@token_erforderlich
def rezept_loeschen_route(token_daten, rezept_id):
    """
    Löscht ein bestehendes Rezept
    
    Erfordert einen gültigen JWT-Token
    Der Benutzer muss der Ersteller des Rezepts sein
    
    Path-Parameter:
    - rezept_id: ID des zu löschenden Rezepts
    """
    try:
        # Benutzer-ID aus Token extrahieren
        benutzer_id = token_daten['benutzer_id']
        
        # Überprüfen, ob das Rezept existiert und dem Benutzer gehört
        rezept = rezept_abrufen(rezept_id)
        if not rezept:
            return jsonify({'fehler': 'Rezept nicht gefunden'}), 404
        
        if rezept['benutzer_id'] != benutzer_id:
            return jsonify({'fehler': 'Keine Berechtigung zum Löschen dieses Rezepts'}), 403
        
        # Rezept löschen
        erfolg = rezept_loeschen(rezept_id, benutzer_id)
        
        if erfolg:
            return jsonify({'nachricht': 'Rezept erfolgreich gelöscht'}), 200
        else:
            return jsonify({'fehler': 'Fehler beim Löschen des Rezepts'}), 500
    except Exception as fehler:
        print(f"Fehler beim Löschen des Rezepts: {fehler}")
        return jsonify({'fehler': 'Interner Serverfehler'}), 500

@rezept_bp.route('/suche', methods=['GET'])
def rezepte_suchen_route():
    """
    Sucht nach Rezepten, die den Suchbegriff enthalten
    
    Query-Parameter:
    - suchbegriff: Der Suchbegriff
    - limit: Maximale Anzahl der zurückzugebenden Rezepte (Standard: 10)
    - offset: Anzahl der zu überspringenden Rezepte (Standard: 0)
    """
    try:
        # Parameter aus der Anfrage extrahieren
        suchbegriff = request.args.get('suchbegriff', default='', type=str)
        limit = request.args.get('limit', default=10, type=int)
        offset = request.args.get('offset', default=0, type=int)
        
        if not suchbegriff:
            return jsonify({'fehler': 'Suchbegriff ist erforderlich'}), 400
        
        # Rezepte suchen
        rezepte = rezepte_suchen(suchbegriff, limit, offset)
        
        # Metadaten für Paginierung
        metadaten = {
            'anzahl': len(rezepte),
            'limit': limit,
            'offset': offset,
            'suchbegriff': suchbegriff
        }
        
        return jsonify({
            'rezepte': rezepte,
            'meta': metadaten
        }), 200
    except Exception as fehler:
        print(f"Fehler bei der Suche nach Rezepten: {fehler}")
        return jsonify({'fehler': 'Interner Serverfehler'}), 500
/**
 * @fileoverview Service für die Verwaltung von Rezepten
 * @module recipeService
 */

import api from './api';

/**
 * @typedef {Object} Zutat
 * @property {string} name - Name der Zutat
 * @property {string} menge - Menge der Zutat
 * @property {string} einheit - Einheit der Menge (z.B. g, ml, Stück)
 */

/**
 * @typedef {Object} Rezept
 * @property {string} titel - Titel des Rezepts
 * @property {Zutat[]} zutaten - Liste der Zutaten
 * @property {string} zubereitung - Zubereitungsanleitung
 * @property {string} zubereitungszeit - Geschätzte Zubereitungszeit
 * @property {string} schwierigkeitsgrad - Schwierigkeitsgrad des Rezepts
 * @property {File} [bild] - Optionales Bild des Rezepts
 */

/**
 * @typedef {Object} RezeptListe
 * @property {Rezept[]} rezepte - Liste der Rezepte
 * @property {number} total - Gesamtanzahl der Rezepte
 */

/**
 * Ruft eine Liste von Rezepten ab
 * @async
 * @param {number} [page=1] - Aktuelle Seite
 * @param {number} [limit=10] - Anzahl der Rezepte pro Seite
 * @param {string} [search=''] - Suchbegriff für Rezepte
 * @returns {Promise<RezeptListe>} Liste der Rezepte mit Paginierungsinformationen
 */
export const getRecipes = async (page = 1, limit = 10, search = '') => {
  try {
    const response = await api.get('/api/rezepte', {
      params: { page, limit, search }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ruft ein einzelnes Rezept ab
 * @async
 * @param {string} id - ID des Rezepts
 * @returns {Promise<Rezept>} Das abgerufene Rezept
 */
export const getRecipe = async (id) => {
  try {
    const response = await api.get(`/api/rezepte/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Erstellt ein neues Rezept
 * @async
 * @param {Rezept} recipeData - Daten des neuen Rezepts
 * @returns {Promise<Rezept>} Das erstellte Rezept
 */
export const createRecipe = async (recipeData) => {
  try {
    const formData = new FormData();
    
    // Textfelder hinzufügen
    formData.append('titel', recipeData.titel);
    formData.append('zubereitung', recipeData.zubereitung);
    formData.append('zubereitungszeit', recipeData.zubereitungszeit);
    formData.append('schwierigkeitsgrad', recipeData.schwierigkeitsgrad);
    
    // Zutaten als JSON-String hinzufügen
    formData.append('zutaten', JSON.stringify(recipeData.zutaten));
    
    // Bild hinzufügen, falls vorhanden
    if (recipeData.bild) {
      formData.append('bild', recipeData.bild);
    }
    
    const response = await api.post('/api/rezepte', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Aktualisiert ein bestehendes Rezept
 * @async
 * @param {string} id - ID des zu aktualisierenden Rezepts
 * @param {Rezept} recipeData - Neue Daten des Rezepts
 * @returns {Promise<Rezept>} Das aktualisierte Rezept
 */
export const updateRecipe = async (id, recipeData) => {
  try {
    const formData = new FormData();
    
    formData.append('titel', recipeData.titel);
    formData.append('zubereitung', recipeData.zubereitung);
    formData.append('zubereitungszeit', recipeData.zubereitungszeit);
    formData.append('schwierigkeitsgrad', recipeData.schwierigkeitsgrad);
    formData.append('zutaten', JSON.stringify(recipeData.zutaten));
    
    if (recipeData.bild) {
      formData.append('bild', recipeData.bild);
    }
    
    const response = await api.put(`/api/rezepte/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Löscht ein Rezept
 * @async
 * @param {string} id - ID des zu löschenden Rezepts
 * @returns {Promise<void>}
 */
export const deleteRecipe = async (id) => {
  try {
    const response = await api.delete(`/api/rezepte/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Sucht nach Rezepten
 * @async
 * @param {string} searchTerm - Suchbegriff
 * @returns {Promise<Rezept[]>} Liste der gefundenen Rezepte
 */
export const searchRecipes = async (searchTerm) => {
  try {
    const response = await api.get(`/api/rezepte/suche?q=${searchTerm}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
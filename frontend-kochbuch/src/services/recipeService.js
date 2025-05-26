// src/services/recipeService.js

import api from './api';

// Alle Rezepte abrufen (mit Paginierung)
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

// Ein einzelnes Rezept abrufen
export const getRecipe = async (id) => {
  try {
    const response = await api.get(`/api/rezepte/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Neues Rezept erstellen
export const createRecipe = async (recipeData) => {
  try {
    // FormData für Datei-Upload verwenden
    const formData = new FormData();
    
    // Textfelder hinzufügen
    formData.append('titel', recipeData.titel);
    formData.append('zubereitung', recipeData.zubereitung);
    
    // Zutaten als JSON-String hinzufügen
    formData.append('zutaten', JSON.stringify(recipeData.zutaten));
    
    // Kategorie hinzufügen, falls vorhanden
    if (recipeData.kategorie_id) {
      formData.append('kategorie_id', recipeData.kategorie_id);
    }
    
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

// Rezept aktualisieren
export const updateRecipe = async (id, recipeData) => {
  try {
    // FormData für Datei-Upload verwenden
    const formData = new FormData();
    
    // Textfelder hinzufügen
    formData.append('titel', recipeData.titel);
    formData.append('zubereitung', recipeData.zubereitung);
    
    // Zutaten als JSON-String hinzufügen
    formData.append('zutaten', JSON.stringify(recipeData.zutaten));
    
    // Kategorie hinzufügen, falls vorhanden
    if (recipeData.kategorie_id) {
      formData.append('kategorie_id', recipeData.kategorie_id);
    }
    
    // Bild hinzufügen, falls vorhanden
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

// Rezept löschen
export const deleteRecipe = async (id) => {
  try {
    const response = await api.delete(`/api/rezepte/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Rezepte suchen
export const searchRecipes = async (searchTerm) => {
  try {
    const response = await api.get(`/api/rezepte/suche?q=${searchTerm}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
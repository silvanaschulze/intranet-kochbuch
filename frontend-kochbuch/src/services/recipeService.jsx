/**
 * @fileoverview Service für die Verwaltung von Rezepten
 * @module recipeService
 */

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Configuração do axios com interceptor para token
const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    
    // Adicionar dados básicos
    Object.keys(recipeData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, recipeData[key]);
      }
    });

    // Adicionar imagem se existir
    if (recipeData.image) {
      formData.append('image', recipeData.image);
    }

    const response = await api.post('/api/rezepte', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
    
    // Adicionar dados básicos
    Object.keys(recipeData).forEach(key => {
      if (key !== 'image') {
        formData.append(key, recipeData[key]);
      }
    });

    // Adicionar imagem se existir
    if (recipeData.image) {
      formData.append('image', recipeData.image);
    }

    const response = await api.put(`/api/rezepte/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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

/**
 * Ruft die Rezepte des eingeloggten Benutzers ab
 * @async
 * @returns {Promise<Rezept[]>} Liste der Rezepte des Benutzers
 */
export const getUserRecipes = async () => {
  try {
    const response = await api.get('/api/rezepte/benutzer');
    return response.data.rezepte || [];
  } catch (error) {
    throw error;
  }
};

const recipeService = {
  // Buscar todas as receitas
  getAllRecipes: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/recipes?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar uma receita específica
  getRecipeById: async (id) => {
    try {
      const response = await api.get(`/recipes/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar receitas por categoria
  getRecipesByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/recipes/category/${category}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar receitas por termo de busca
  searchRecipes: async (searchTerm, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/recipes/search?q=${searchTerm}&page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Favoritar/desfavoritar uma receita
  toggleFavorite: async (recipeId) => {
    try {
      const response = await api.post(`/recipes/${recipeId}/favorite`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar receitas favoritas do usuário
  getFavoriteRecipes: async (page = 1, limit = 10) => {
    try {
      const response = await api.get(`/recipes/favorites?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default recipeService;
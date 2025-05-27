/**
 * @fileoverview Service für Authentifizierung und Benutzerverwaltung
 * @module authService
 */

import api from './api';

/**
 * @typedef {Object} LoginResponse
 * @property {string} token - JWT Token für die Authentifizierung
 * @property {Object} benutzer - Benutzerinformationen
 */

/**
 * Führt den Login-Prozess durch
 * @async
 * @param {string} email - E-Mail-Adresse des Benutzers
 * @param {string} password - Passwort des Benutzers
 * @returns {Promise<LoginResponse>} Login-Antwort mit Token und Benutzerinformationen
 * @throws {Error} Bei ungültigen Anmeldeinformationen oder Netzwerkfehlern
 */
export const login = async (email, password) => {
  try {
    const response = await api.post('/api/benutzer/login', {
      email,
      passwort: password
    });
    
    // Se o login for bem-sucedido, armazena o token
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Registriert einen neuen Benutzer
 * @async
 * @param {string} name - Name des Benutzers
 * @param {string} email - E-Mail-Adresse des Benutzers
 * @param {string} password - Passwort des Benutzers
 * @returns {Promise<Object>} Registrierungsantwort
 * @throws {Error} Bei Validierungsfehlern oder Netzwerkfehlern
 */
export const register = async (name, email, password) => {
  try {
    const response = await api.post('/api/benutzer/register', {
      name,
      email,
      passwort: password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Ruft das Benutzerprofil ab
 * @async
 * @returns {Promise<Object>} Benutzerprofilinformationen
 * @throws {Error} Bei fehlender Authentifizierung oder Netzwerkfehlern
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/benutzer/profil');
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Prüft, ob ein Benutzer eingeloggt ist
 * @returns {boolean} True wenn ein Token vorhanden ist
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Loggt den aktuellen Benutzer aus
 */
export const logout = () => {
  localStorage.removeItem('token');
};
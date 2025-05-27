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
 * Validiert die Benutzeranmeldeinformationen
 * @param {string} email - E-Mail-Adresse des Benutzers
 * @param {string} password - Passwort des Benutzers
 * @throws {Error} Bei ungültigen Eingaben
 */
const validateLoginInput = (email, password) => {
  if (!email || !email.includes('@')) {
    throw new Error('E-mail inválido');
  }
  if (!password || password.length < 6) {
    throw new Error('Senha deve ter pelo menos 6 caracteres');
  }
};

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
    // Valida os dados de entrada
    validateLoginInput(email, password);

    const response = await api.post('/api/benutzer/login', {
      email,
      passwort: password
    });
    
    // Valida a resposta do servidor
    if (!response.data || !response.data.token || !response.data.benutzer) {
      throw new Error('Resposta inválida do servidor');
    }

    // Limpa dados antigos antes de salvar os novos
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Salva os novos dados
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.benutzer));
    
    return response.data;
  } catch (error) {
    // Remove dados em caso de erro
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Validiert die Registrierungsdaten
 * @param {string} name - Name des Benutzers
 * @param {string} email - E-Mail-Adresse des Benutzers
 * @param {string} password - Passwort des Benutzers
 * @throws {Error} Bei ungültigen Eingaben
 */
const validateRegisterInput = (name, email, password) => {
  if (!name || name.length < 2) {
    throw new Error('Nome deve ter pelo menos 2 caracteres');
  }
  if (!email || !email.includes('@')) {
    throw new Error('E-mail inválido');
  }
  if (!password || password.length < 6) {
    throw new Error('Senha deve ter pelo menos 6 caracteres');
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
    // Valida os dados de entrada
    validateRegisterInput(name, email, password);

    const response = await api.post('/api/benutzer/register', {
      name,
      email,
      passwort: password
    });

    // Valida a resposta do servidor
    if (!response.data || !response.data.token) {
      throw new Error('Resposta inválida do servidor');
    }

    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const response = await api.get('/api/benutzer/profil');
    
    if (!response.data) {
      throw new Error('Erro ao carregar perfil do usuário');
    }

    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Prüft, ob ein Benutzer eingeloggt ist
 * @returns {boolean} True wenn ein Token e Benutzerdaten vorhanden sind
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Loggt den aktuellen Benutzer aus
 */
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};
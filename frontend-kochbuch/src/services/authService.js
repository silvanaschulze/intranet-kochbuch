// src/services/authService.js

import api from './api';

// Anmeldungsfunktion
export const login = async (email, password) => {
  try {
    const response = await api.post('/benutzer/login', {
      email,
      passwort: password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Registrierungsfunktion
export const register = async (name, email, password) => {
  try {
    const response = await api.post('/benutzer/registrieren', {
      name,
      email,
      passwort: password
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Benutzerprofil abrufen
export const getUserProfile = async () => {
  try {
    const response = await api.get('/benutzer/profil');
    return response.data;
  } catch (error) {
    throw error;
  }
};
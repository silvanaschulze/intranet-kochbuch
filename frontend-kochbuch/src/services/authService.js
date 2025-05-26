// src/services/authService.js

import api from './api';

// Anmeldungsfunktion
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

// Registrierungsfunktion
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

// Benutzerprofil abrufen
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/benutzer/profil');
    return response.data;
  } catch (error) {
    throw error;
  }
};
// src/services/api.js

import axios from 'axios';

// API-Basis-URL konfigurieren
const API_URL = 'http://localhost:5000/api';

// Axios-Instanz erstellen
const api = axios.create({
  baseURL: API_URL
} );

// Interceptor für Anfragen hinzufügen (fügt Token zu Header hinzu)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor für Antworten hinzufügen (behandelt Fehler)
api.interceptors.response.use(
  response => response,
  error => {
    // Bei 401 (Unauthorized) Token entfernen und zur Login-Seite umleiten
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
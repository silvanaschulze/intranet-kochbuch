/**
 * @fileoverview Konfiguration der Axios-Instanz für API-Kommunikation
 * @module api
 */

import axios from 'axios';

/**
 * Basis-URL für alle API-Anfragen
 * @constant {string}
 */
const API_URL = 'http://192.168.64.3:5000';

/**
 * Konfigurierte Axios-Instanz für API-Anfragen
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: API_URL
});

/**
 * Request-Interceptor für automatische Token-Hinzufügung
 * Fügt den JWT-Token aus dem localStorage zu den Authorization-Headers hinzu
 */
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response-Interceptor für Fehlerbehandlung
 * Behandelt 401-Fehler durch Umleitung zur Login-Seite
 */
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API-Fehler:', error.response || error);
    // Bei 401 (Unauthorized) Token entfernen und zur Login-Seite umleiten
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
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
  baseURL: API_URL,
  withCredentials: true,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

/**
 * Request-Interceptor für automatische Token-Hinzufügung
 * Fügt den JWT-Token aus dem localStorage zu den Authorization-Headers hinzu
 */
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);

/**
 * Response-Interceptor für Fehlerbehandlung
 * Behandelt 401-Fehler durch Umleitung zur Login-Seite
 */
api.interceptors.response.use(
  response => {
    // Verifica se a resposta contém dados
    if (!response.data) {
      return Promise.reject(new Error('Resposta vazia do servidor'));
    }
    return response;
  },
  error => {
    console.error('API-Fehler:', error.response || error);

    // Trata erros específicos
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Não autenticado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 403:
          // Não autorizado
          console.error('Acesso não autorizado');
          break;
        case 404:
          // Não encontrado
          console.error('Recurso não encontrado');
          break;
        case 500:
          // Erro do servidor
          console.error('Erro interno do servidor');
          break;
      }
    } else if (error.request) {
      // Erro de conexão
      console.error('Erro de conexão com o servidor');
    }

    return Promise.reject(error);
  }
);

export default api;
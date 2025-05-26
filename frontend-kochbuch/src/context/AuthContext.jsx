// AuthContext.jsx - Verwaltung der Benutzerauthentifizierung

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Erstellen des AuthContext für die Authentifizierungsdaten
export const AuthContext = createContext();

// AuthProvider-Komponente für die Verwaltung des Authentifizierungszustands
export const AuthProvider = ({ children }) => {
  // Zustandsvariablen für die Authentifizierung
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API-Basis-URL
  const API_URL = 'http://192.168.64.3:5000';

  // Benutzerprofil abrufen
  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/benutzer/profil`);
      console.log('Benutzerprofil:', response.data);
      const userData = {
        ...response.data,
        name: response.data.name || response.data.email
      };
      setUser(userData);
      return userData;
    } catch (err) {
      console.error('Fehler beim Abrufen des Benutzerprofils:', err);
      return null;
    }
  };

  // Beim ersten Laden prüfen, ob ein Token vorhanden ist
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Token zu den Axios-Header hinzufügen
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          const userData = await fetchUserProfile();
          if (userData) {
            setIsAuthenticated(true);
          } else {
            // Bei Fehler Token entfernen
            localStorage.removeItem('token');
            delete axios.defaults.headers.common['Authorization'];
          }
        } catch (err) {
          console.error('Fehler bei der Authentifizierungsprüfung:', err);
          localStorage.removeItem('token');
          delete axios.defaults.headers.common['Authorization'];
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Anmeldungsfunktion
  const login = async (email, password) => {
    try {
      console.log('Login-Versuch für:', email);
      const response = await axios.post(`${API_URL}/api/benutzer/login`, {
        email,
        passwort: password
      });

      console.log('Login-Antwort:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        
        // Benutzerdaten aus der Login-Antwort oder vom Profil-Endpoint
         const userData = await fetchUserProfile();

        if (userData) {
          setIsAuthenticated(true);
          setError(null);
          console.log('Benutzer erfolgreich angemeldet:', userData);
          return true;
        }
      }
      return false;
    } catch (err) {
      console.error('Login-Fehler:', err);
      const errorMessage = err.response?.data?.fehler || 'Ungültige E-Mail oder Passwort';
      setError(errorMessage);
      return false;
    }
  };

  // Registrierungsfunktion
  const register = async (name, email, password) => {
    try {
      // Registrierungsanfrage an das Backend senden
      const response = await axios.post(`${API_URL}/api/benutzer/register`, {
        name,
        email,
        passwort: password
      });

      // Bei erfolgreicher Registrierung
      if (response.data.nachricht) {
        setError(null);
        return true;
      }
    } catch (err) {
      // Fehlermeldung anzeigen
      const errorMessage = err.response?.data?.fehler || 'Registrierung fehlgeschlagen';
      setError(errorMessage);
      return false;
    }
  };

  // Abmeldungsfunktion
  const logout = () => {
    // Token entfernen und Authentifizierungszustand zurücksetzen
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
    setError(null);
  };

  // Context-Provider mit allen Authentifizierungswerten
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,  // Authentifizierungsstatus
        user,            // Benutzerdaten
        loading,         // Ladezustand
        error,          // Fehlermeldungen
        login,          // Anmeldungsfunktion
        register,       // Registrierungsfunktion
        logout         // Abmeldungsfunktion
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

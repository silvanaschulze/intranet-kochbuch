// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// AuthContext erstellen
export const AuthContext = createContext();

// AuthProvider Komponente
export const AuthProvider = ({ children }) => {
  // Zustandsvariablen für Authentifizierung
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Beim ersten Laden prüfen, ob ein Token vorhanden ist
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Token zu Axios-Header hinzufügen
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          // Optional: Benutzerinformationen vom Backend abrufen
          // const response = await axios.get('http://localhost:5000/api/benutzer/profil' );
          // setUser(response.data);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Fehler beim Abrufen des Benutzerprofils:', err);
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
      const response = await axios.post('http://localhost:5000/api/benutzer/login', {
        email,
        passwort: password
      } );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setIsAuthenticated(true);
        // Optional: Benutzerinformationen setzen
        // setUser(response.data.benutzer);
        return true;
      }
    } catch (err) {
      setError('Ungültige E-Mail oder Passwort');
      return false;
    }
  };

  // Registrierungsfunktion
  const register = async (name, email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/benutzer/registrieren', {
        name,
        email,
        passwort: password
      } );

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
        setIsAuthenticated(true);
        // Optional: Benutzerinformationen setzen
        // setUser(response.data.benutzer);
        return true;
      }
    } catch (err) {
      setError('Registrierung fehlgeschlagen');
      return false;
    }
  };

  // Abmeldungsfunktion
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  // Kontext-Werte bereitstellen
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

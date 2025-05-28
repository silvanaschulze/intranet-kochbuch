/**
 * @fileoverview Authentifizierungskontext für die Verwaltung des Benutzerstatus
 * @module AuthContext
 */

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginService, register as registerService } from '../services/authService';

/**
 * @typedef {Object} User
 * @property {string} id - Benutzer-ID
 * @property {string} name - Benutzername
 * @property {string} email - E-Mail-Adresse des Benutzers
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user - Aktuell eingeloggter Benutzer
 * @property {boolean} isAuthenticated - Authentifizierungsstatus
 * @property {Function} login - Funktion zum Einloggen
 * @property {Function} register - Funktion zum Registrieren
 * @property {Function} logout - Funktion zum Ausloggen
 */

/**
 * Authentifizierungskontext
 * @type {React.Context<AuthContextType>}
 */
const AuthContext = createContext(null);

/**
 * Hook für den Zugriff auf den Authentifizierungskontext
 * @returns {AuthContextType} Authentifizierungskontext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth muss innerhalb eines AuthProvider verwendet werden');
  }
  return context;
};

/**
 * AuthProvider Komponente
 * Stellt Authentifizierungsfunktionalität für die Anwendung bereit
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {React.ReactNode} props.children - Kindkomponenten
 * @returns {JSX.Element} Die gerenderte AuthProvider Komponente
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });
  
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('token');
  });
  
  const navigate = useNavigate();

  /**
   * Prüft beim Laden der Komponente, ob ein gültiger Token existiert
   * und lädt die Benutzerdaten aus dem localStorage
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && !savedUser) {
      // Se tiver token mas não tiver dados do usuário, fazer logout
      logout();
    } else if (!token && savedUser) {
      // Se tiver dados do usuário mas não tiver token, fazer logout
      logout();
    } else if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        logout();
      }
    }
   }, [logout]);

  /**
   * Führt den Login-Prozess durch
   * @async
   * @param {string} email - E-Mail-Adresse des Benutzers
   * @param {string} password - Passwort des Benutzers
   * @returns {Promise<boolean>} True bei erfolgreicher Anmeldung
   * @throws {Error} Bei ungültigen Anmeldeinformationen
   */
  const login = async (email, password) => {
    try {
      const response = await loginService(email, password);
      
      if (!response || !response.token || !response.benutzer) {
        throw new Error('Ungültige Antwort vom Server');
      }

      const userData = {
        id: response.benutzer.id,
        name: response.benutzer.name,
        email: response.benutzer.email
      };

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      navigate('/rezepte');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  /**
   * Führt den Registrierungsprozess durch
   * @async
   * @param {string} name - Name des Benutzers
   * @param {string} email - E-Mail-Adresse des Benutzers
   * @param {string} password - Passwort des Benutzers
   * @returns {Promise<void>}
   * @throws {Error} Bei Validierungsfehlern
   */
  const register = async (name, email, password) => {
    try {
      const response = await registerService(name, email, password);
      
      if (!response || !response.token) {
        throw new Error('Ungültige Antwort vom Server');
      }

      const userData = {
        name,
        email,
        ...response.user
      };

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setIsAuthenticated(true);
      
      navigate('/rezepte');
    } catch (error) {
      console.error('Register error:', error);
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  };

  /**
   * Führt den Logout-Prozess durch
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

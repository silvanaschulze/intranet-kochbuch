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
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  /**
   * Prüft beim Laden der Komponente, ob ein gültiger Token existiert
   */
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // TODO: Benutzerinformationen vom Server abrufen
    }
  }, []);

  /**
   * Führt den Login-Prozess durch
   * @async
   * @param {string} email - E-Mail-Adresse des Benutzers
   * @param {string} password - Passwort des Benutzers
   * @returns {Promise<void>}
   * @throws {Error} Bei ungültigen Anmeldeinformationen
   */
  const login = async (email, password) => {
    try {
      const response = await loginService(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      navigate('/rezepte');
    } catch (error) {
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
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setIsAuthenticated(true);
      navigate('/rezepte');
    } catch (error) {
      throw error;
    }
  };

  /**
   * Führt den Logout-Prozess durch
   */
  const logout = () => {
    localStorage.removeItem('token');
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

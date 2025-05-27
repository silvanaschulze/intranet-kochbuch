/**
 * @fileoverview Hauptkomponente der Anwendung mit Routing-Konfiguration
 * @component App
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './context/AuthContext';

// Seitenkomponenten importieren
import HomePage from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeListPage from './pages/RecipeListPage';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipes from './pages/CreateRecipes';
import Profile from './pages/Profile';
import MyRecipes from './components/Recipe/MyRecipes';

/**
 * Hauptkomponente der Anwendung
 * Konfiguriert das Routing und den Authentifizierungskontext
 * @returns {JSX.Element} Die gerenderte App Komponente
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/rezepte" element={<RecipeListPage />} />
            <Route path="/rezepte/:id" element={<RecipeDetail />} />
            <Route path="/rezept-erstellen" element={<CreateRecipes />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profil" element={<Profile />} />
            <Route path="/meine-rezepte" element={<MyRecipes />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;

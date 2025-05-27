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
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeList from './pages/RecipeList';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';

/**
 * Startseite Komponente
 * @returns {JSX.Element} Die gerenderte Home Komponente
 */
const Home = () => (
  <div className="text-center py-5">
    <h1>Willkommen beim Intranet-Kochbuch</h1>
    <p className="lead">Entdecken Sie die kulinarische Vielfalt unserer Gemeinschaft</p>
  </div>
);

/**
 * Hauptkomponente der Anwendung
 * Konfiguriert das Routing und den Authentifizierungskontext
 * @returns {JSX.Element} Die gerenderte App Komponente
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rezepte" element={<RecipeList />} />
            <Route path="/rezepte/:id" element={<RecipeDetail />} />
            <Route path="/rezept-erstellen" element={<CreateRecipe />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;

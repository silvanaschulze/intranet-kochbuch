/**
 * @fileoverview Hauptkomponente der Anwendung mit Routing-Konfiguration
 * @component App
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navigation from './components/Layout/Navigation';
import Footer from './components/Layout/Footer';

// Auth Components
import PrivateRoute from './components/Auth/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RecipeList from './pages/RecipeListPage';
import RecipeDetail from './pages/RecipeDetail';
import CreateRecipe from './pages/CreateRecipe';
import Profile from './pages/Profile';
import MyRecipes from './pages/MyRecipes';

/**
 * Hauptkomponente der Anwendung
 * Konfiguriert das Routing und den Authentifizierungskontext
 * @returns {JSX.Element} Die gerenderte App Komponente
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="d-flex flex-column min-vh-100">
          <Navigation />
          
          <Container className="flex-grow-1 py-4">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rezepte" element={<RecipeList />} />
              <Route path="/rezepte/:id" element={<RecipeDetail />} />
              
              {/* Protected Routes */}
              <Route
                path="/rezept-erstellen"
                element={
                  <PrivateRoute>
                    <CreateRecipe />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profil"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/meine-rezepte"
                element={
                  <PrivateRoute>
                    <MyRecipes />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Container>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from './components/Layout/Layout';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateRecipe from './pages/CreateRecipe';

// Páginas
import RecipeListPage from './pages/RecipeList';

// Página Home temporária
const Home = () => (
  <div className="text-center py-5">
    <h1>Willkommen bei Intranet-Kochbuch</h1>
    <p className="lead">Ihr Online-Kochbuch</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rezepte" element={<RecipeListPage />} />
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

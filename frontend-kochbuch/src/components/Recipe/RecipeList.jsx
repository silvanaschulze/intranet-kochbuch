import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import RecipeCard from './RecipeCard';
import { getRecipes, searchRecipes } from '../../services/recipeService';

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const limit = 9; // Número de receitas por página

  // Função para carregar as receitas
  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      if (searchTerm) {
        response = await searchRecipes(searchTerm);
      } else {
        response = await getRecipes(page, limit);
      }

      if (response && response.rezepte) {
        setRecipes(response.rezepte);
      } else {
        setRecipes([]);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Rezepte:', err);
      setError('Die Rezepte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  // Laden der Rezepte beim ersten Render und bei Änderungen der Suchparameter
  useEffect(() => {
    loadRecipes();
  }, [page, searchTerm, category]);

  // Handler für die Suche
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1); // Zurück zur ersten Seite bei neuer Suche
    loadRecipes();
  };

  // Handler für Kategorieänderung
  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  // Handler für Sortierungsänderung
  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setPage(1);
  };

  return (
    <div>
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Rezepte suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Select value={category} onChange={handleCategoryChange}>
              <option value="">Alle Kategorien</option>
              <option value="vorspeisen">Vorspeisen</option>
              <option value="hauptgerichte">Hauptgerichte</option>
              <option value="desserts">Desserts</option>
              <option value="getranke">Getränke</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={sortBy} onChange={handleSortChange}>
              <option value="newest">Neueste zuerst</option>
              <option value="popular">Beliebteste</option>
              <option value="easy">Einfachste</option>
            </Form.Select>
          </Col>
        </Row>
      </Form>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Laden...</span>
          </div>
        </div>
      ) : recipes.length > 0 ? (
        <Row xs={1} md={2} lg={3} className="g-4">
          {recipes.map(recipe => (
            <Col key={recipe.id}>
              <RecipeCard recipe={recipe} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <p className="text-muted">Keine Rezepte gefunden.</p>
        </div>
      )}

      <div className="d-flex justify-content-center mt-4">
        <Button 
          variant="outline-primary" 
          className="mx-1"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
        >
          Vorherige
        </Button>
        <Button variant="primary" className="mx-1">{page}</Button>
        <Button 
          variant="outline-primary" 
          className="mx-1"
          onClick={() => setPage(p => p + 1)}
          disabled={recipes.length < limit || loading}
        >
          Nächste
        </Button>
      </div>
    </div>
  );
};

export default RecipeList;

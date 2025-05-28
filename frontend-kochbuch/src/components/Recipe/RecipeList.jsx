/**
 * @fileoverview Komponente zur Anzeige einer Liste von Rezepten
 * @component RecipeList
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Form, Button, Alert, Container, Card, Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import RecipeCard from './RecipeCard';
import recipeService from '../../services/recipeService.jsx';
import { Link } from 'react-router-dom';

/**
 * RecipeList Komponente
 * Zeigt eine Liste von Rezepten in einem Raster an
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {Array<Object>} props.recipes - Liste der anzuzeigenden Rezepte
 * @param {boolean} [props.loading=false] - Gibt an, ob die Rezepte geladen werden
 * @returns {JSX.Element} Die gerenderte RecipeList Komponente
 */
const RecipeList = ({ recipes, loading = false }) => {
  const [recipesState, setRecipesState] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const limit = 9; // Número de receitas por página

   // Função para carregar as receitas usando useCallback
  const loadRecipes = useCallback(async () => {
    try {
      setError(null);
      
      let response;
      if (searchTerm) {
        response = await recipeService.searchRecipes(searchTerm);
      } else {
        response = await recipeService.getAllRecipes(page, limit);
      }

      if (response && response.rezepte) {
        setRecipesState(response.rezepte);
      } else {
        setRecipesState([]);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Rezepte:', err);
      setError('Die Rezepte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    }
   }, [page, searchTerm, limit]);

  // Laden der Rezepte beim ersten Render und bei Änderungen der Suchparameter
  useEffect(() => {
    loadRecipes();
  }, [page, searchTerm, category, loadRecipes]);

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

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!recipesState || recipesState.length === 0) {
    return (
      <div className="text-center mt-5 text-danger">
        <p>{error || 'Keine Rezepte gefunden.'}</p>
      </div>
    );
  }

  return (
    <Container>
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

      <Row xs={1} md={2} lg={3} className="g-4">
        {recipesState.map((recipe) => (
          <Col key={recipe.id}>
            <Card className="h-100">
              {recipe.image && (
                <Card.Img
                  variant="top"
                  src={`${process.env.REACT_APP_API_URL}/static/uploads/${recipe.image}`}
                  alt={recipe.title}
                />
              )}
              <Card.Body>
                <Card.Title>{recipe.title}</Card.Title>
                <Card.Text>
                  {recipe.description?.substring(0, 100)}...
                </Card.Text>
                <Button
                  as={Link}
                  to={`/recipes/${recipe.id}`}
                  variant="primary"
                >
                  View Recipe
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

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
          disabled={recipesState.length < limit || loading}
        >
          Nächste
        </Button>
      </div>
    </Container>
  );
};

RecipeList.propTypes = {
  recipes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]).isRequired,
      titel: PropTypes.string.isRequired,
      bild_pfad: PropTypes.string,
      zubereitungszeit: PropTypes.string,
      schwierigkeitsgrad: PropTypes.string,
      bewertung: PropTypes.number
    })
  ).isRequired,
  loading: PropTypes.bool
};

export default RecipeList;

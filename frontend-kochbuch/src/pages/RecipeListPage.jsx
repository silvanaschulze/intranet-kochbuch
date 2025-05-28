/**
 * @fileoverview Seite zur Anzeige und Suche von Rezepten
 * @component RecipeListPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, Alert, Pagination } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getRecipes, searchRecipes } from '../services/recipeService.jsx';
import RecipeList from '../components/Recipe/RecipeList';

/**
 * @typedef {Object} Recipe
 * @property {number} id - Die eindeutige ID des Rezepts
 * @property {string} titel - Der Titel des Rezepts
 * @property {string} zubereitungszeit - Die Zubereitungszeit des Rezepts
 * @property {string} schwierigkeitsgrad - Der Schwierigkeitsgrad des Rezepts
 * @property {string} [bild_url] - Die URL zum Bild des Rezepts (optional)
 */

/**
 * RecipeListPage Komponente
 * Zeigt eine durchsuchbare, paginierte Liste von Rezepten an
 * @returns {JSX.Element} Die gerenderte RecipeListPage Komponente
 */
const RecipeListPage = () => {
  const navigate = useNavigate();
  
  // State-Verwaltung
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(9); // Anzahl der Rezepte pro Seite

  /**
   * Lädt die Rezepte von der API
   * @async
   */
  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await getRecipes(page, limit);
      
      if (response && response.rezepte) {
        setRecipes(response.rezepte);
        setTotalPages(Math.ceil(response.total / limit));
      } else {
        setRecipes([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Fehler beim Laden der Rezepte:', err);
      setError('Die Rezepte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  /**
   * Lädt die Rezepte beim ersten Render und bei Seitenänderungen
   */
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  /**
   * Verarbeitet die Rezeptsuche
   * @param {React.FormEvent<HTMLFormElement>} e - Das Submit-Event
   */
  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      loadRecipes();
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const results = await searchRecipes(searchTerm);
      setRecipes(results);
      setPage(1);
    } catch (err) {
      console.error('Fehler bei der Suche:', err);
      setError('Bei der Suche ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Erstellt die Paginierungskomponente
   * @returns {JSX.Element} Die Paginierungskomponente
   */
  const renderPagination = () => {
    if (!totalPages || totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= Math.min(totalPages, 10); i++) {
      pages.push(
        <Pagination.Item
          key={i}
          active={i === page}
          onClick={() => setPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.First
          onClick={() => setPage(1)}
          disabled={page === 1}
        />
        <Pagination.Prev
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        />
        
        {pages}
        
        <Pagination.Next
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        />
        <Pagination.Last
          onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
        />
      </Pagination>
    );
  };

  return (
    <Container>
      {/* Header mit Titel und "Neues Rezept" Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Rezeptsammlung</h1>
        <Button 
          variant="primary" 
          onClick={() => navigate('/rezept-erstellen')}
        >
          Neues Rezept erstellen
        </Button>
      </div>

      {/* Suchformular */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={8}>
            <Form.Control
              type="text"
              placeholder="Nach Rezepten suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Suchfeld für Rezepte"
            />
          </Col>
          <Col md={4}>
            <Button 
              type="submit" 
              variant="outline-primary" 
              className="w-100"
            >
              Suchen
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Fehleranzeige */}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Rezeptliste */}
      <RecipeList recipes={recipes} loading={loading} />

      {/* Paginierung */}
      {renderPagination()}
    </Container>
  );
};

export default RecipeListPage; 
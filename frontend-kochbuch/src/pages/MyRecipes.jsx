/**
 * @fileoverview Seite für die Anzeige der eigenen Rezepte
 * @component MyRecipesPage
 */

import React, { useState, useEffect } from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { getUserRecipes } from '../../services/recipeService';
import RecipeList from '../components/Recipe/RecipeList';

/**
 * MyRecipesPage Komponente
 * Zeigt alle Rezepte des eingeloggten Benutzers an
 * @returns {JSX.Element} Die gerenderte MyRecipesPage Komponente
 */
const MyRecipesPage = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserRecipes();
  }, []);

  /**
   * Lädt die Rezepte des Benutzers
   */
  const loadUserRecipes = async () => {
    try {
      setLoading(true);
      const userRecipes = await getUserRecipes();
      setRecipes(userRecipes);
    } catch (err) {
      console.error('Fehler beim Laden der Rezepte:', err);
      setError('Die Rezepte konnten nicht geladen werden. Bitte versuchen Sie es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Meine Rezepte</h1>
        <Button 
          variant="primary" 
          onClick={() => navigate('/rezept-erstellen')}
        >
          Neues Rezept erstellen
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {recipes.length === 0 && !loading ? (
        <Alert variant="info">
          Sie haben noch keine Rezepte erstellt. 
          Klicken Sie auf "Neues Rezept erstellen", um Ihr erstes Rezept zu erstellen!
        </Alert>
      ) : (
        <RecipeList 
          recipes={recipes} 
          loading={loading}
          showEditButton={true}
          showDeleteButton={true}
          onRecipeDeleted={loadUserRecipes}
        />
      )}
    </Container>
  );
};

export default MyRecipesPage; 
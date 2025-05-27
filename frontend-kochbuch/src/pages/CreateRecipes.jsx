/**
 * @fileoverview Komponente für das Erstellen neuer Rezepte
 * @component CreateRecipes
 */

import React from 'react';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../services/recipeService';
import RecipeForm from '../components/Recipe/RecipeForm';

/**
 * CreateRecipes Komponente
 * Ermöglicht das Erstellen eines neuen Rezepts
 * @returns {JSX.Element} Die gerenderte CreateRecipes Komponente
 */
const CreateRecipes = () => {
  const navigate = useNavigate();

  /**
   * Verarbeitet das Absenden des Formulars
   * @param {Object} formData - Die Formulardaten des Rezepts
   */
  const handleSubmit = async (formData) => {
    try {
      await createRecipe(formData);
      navigate('/meine-rezepte');
    } catch (error) {
      console.error('Fehler beim Erstellen des Rezepts:', error);
      throw error;
    }
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Neues Rezept erstellen</h1>
      <RecipeForm
        onSubmit={handleSubmit}
        onCancel={() => navigate('/meine-rezepte')}
      />
    </Container>
  );
};

export default CreateRecipes; 
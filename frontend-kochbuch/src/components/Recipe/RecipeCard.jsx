/**
 * @fileoverview Komponente zur Anzeige einer Rezeptkarte
 * @component RecipeCard
 */

import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * RecipeCard Komponente
 * Zeigt eine Vorschau eines Rezepts in Kartenform an
 * 
 * @param {Object} props - Komponenteneigenschaften
 * @param {Object} props.recipe - Das anzuzeigende Rezept
 * @param {string} props.recipe.id - ID des Rezepts
 * @param {string} props.recipe.titel - Titel des Rezepts
 * @param {string} props.recipe.bild_pfad - URL zum Bild des Rezepts
 * @param {string} props.recipe.zubereitungszeit - Zubereitungszeit des Rezepts
 * @param {string} props.recipe.schwierigkeitsgrad - Schwierigkeitsgrad des Rezepts
 * @param {string} [props.recipe.bewertung] - Bewertung des Rezepts
 * @returns {JSX.Element} Die gerenderte RecipeCard Komponente
 */
const RecipeCard = ({ recipe }) => {
  const {
    id,
    titel: title,
    bild_pfad: image,
    zubereitungszeit: prepTime,
    schwierigkeitsgrad: difficulty,
    bewertung: rating = 0
  } = recipe;

  // URL base para imagens e imagem padrão
  const API_URL = 'http://192.168.64.3:5000';
  const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=Kein+Bild+verfügbar';
  
  // Construir URL da imagem
  const imageUrl = image 
    ? image.startsWith('http') 
      ? image 
      : `${API_URL}/${image.replace(/^\//, '')}`
    : DEFAULT_IMAGE;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img 
        variant="top" 
        src={imageUrl} 
        alt={title}
        style={{ height: '200px', objectFit: 'cover' }}
        onError={(e) => {
          e.target.onerror = null; // Previne loop infinito
          e.target.src = DEFAULT_IMAGE;
        }}
      />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="d-flex justify-content-between align-items-center mb-2">
          {prepTime && <Badge bg="info">{prepTime}</Badge>}
          {difficulty && <Badge bg="warning" text="dark">{difficulty}</Badge>}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {'★'.repeat(Math.floor(rating))}
            {rating % 1 >= 0.5 ? '½' : ''}
            {'☆'.repeat(5 - Math.ceil(rating))}
          </div>
          <Link to={`/rezept/${id}`} className="btn btn-sm btn-outline-primary">
            Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.string.isRequired,
    titel: PropTypes.string.isRequired,
    bild_pfad: PropTypes.string.isRequired,
    zubereitungszeit: PropTypes.string.isRequired,
    schwierigkeitsgrad: PropTypes.string.isRequired,
    bewertung: PropTypes.number
  }).isRequired
};

export default RecipeCard;

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
 * @param {string|number} props.recipe.id - ID des Rezepts
 * @param {string} props.recipe.titel - Titel des Rezepts
 * @param {Object} props.recipe.bild_pfad - URLs zum Bild des Rezepts
 * @param {string} props.recipe.bild_pfad.image_url - URL zum Hauptbild
 * @param {string} props.recipe.bild_pfad.thumb_url - URL zum Thumbnail
 * @param {string} props.recipe.zubereitungszeit - Zubereitungszeit des Rezepts
 * @param {string} props.recipe.schwierigkeitsgrad - Schwierigkeitsgrad des Rezepts
 * @param {string} [props.recipe.bewertung] - Bewertung des Rezepts
 * @returns {JSX.Element} Die gerenderte RecipeCard Komponente
 */
const RecipeCard = ({ recipe }) => {
  const {
    id,
    titel: title,
    bild_pfad: image = null,
    zubereitungszeit: prepTime = 'Nicht angegeben',
    schwierigkeitsgrad: difficulty = 'Nicht angegeben',
    bewertung: rating = 0
  } = recipe;

  // URL base para imagens e imagem padrão
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const DEFAULT_IMAGE = 'https://via.placeholder.com/300x200?text=Kein+Bild+verfügbar';
  
  // Função para construir URL da imagem
  const getImageUrl = (imagePath) => {
    if (!imagePath) return DEFAULT_IMAGE;
    
    // Se for um objeto com thumb_url, use-o
    if (typeof imagePath === 'object' && imagePath.thumb_url) {
      return `${API_URL}/${imagePath.thumb_url.replace(/^\//, '')}`;
    }
    
    // Se for uma string (caminho direto)
    if (typeof imagePath === 'string') {
      return imagePath.startsWith('http') 
        ? imagePath 
        : `${API_URL}/${imagePath.replace(/^\//, '')}`;
    }
    
    return DEFAULT_IMAGE;
  };

  // Construir URL da imagem
  const imageUrl = getImageUrl(image);

  return (
    <Card className="h-100 shadow-sm">
      <div className="card-img-wrapper" style={{ height: '200px', overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={imageUrl} 
          alt={title}
          style={{ 
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          onError={(e) => {
            console.error('Erro ao carregar imagem:', imageUrl);
            e.target.onerror = null; // Previne loop infinito
            e.target.src = DEFAULT_IMAGE;
          }}
          onLoad={() => {
            console.log('Imagem carregada com sucesso:', imageUrl);
          }}
        />
      </div>
      <Card.Body>
        <Card.Title className="text-truncate" title={title}>{title}</Card.Title>
        <div className="d-flex justify-content-between align-items-center mb-2">
          {prepTime && <Badge bg="info">{prepTime}</Badge>}
          {difficulty && <Badge bg="warning" text="dark">{difficulty}</Badge>}
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="recipe-rating">
            {'★'.repeat(Math.floor(rating))}
            {rating % 1 >= 0.5 ? '½' : ''}
            {'☆'.repeat(5 - Math.ceil(rating))}
          </div>
          <Link 
            to={`/rezept/${id}`} 
            className="btn btn-sm btn-outline-primary"
            aria-label={`Details für ${title} anzeigen`}
          >
            Details
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]).isRequired,
    titel: PropTypes.string.isRequired,
    bild_pfad: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        image_url: PropTypes.string,
        thumb_url: PropTypes.string
      })
    ]),
    zubereitungszeit: PropTypes.string,
    schwierigkeitsgrad: PropTypes.string,
    bewertung: PropTypes.number
  }).isRequired
};

export default RecipeCard;
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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

export default RecipeCard;

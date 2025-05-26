import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
  // Em um ambiente real, recipe seria um objeto com dados da receita
  // Por enquanto, usamos dados de exemplo se nenhum for fornecido
  const defaultRecipe = {
    id: 1,
    title: 'Título da Receita',
    image: 'https://via.placeholder.com/300x200',
    prepTime: '30 min',
    difficulty: 'Médio',
    rating: 4.5
  };

  const { id, title, image, prepTime, difficulty, rating } = recipe || defaultRecipe;

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={image} alt={title} />
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <Badge bg="info">{prepTime}</Badge>
          <Badge bg="warning" text="dark">{difficulty}</Badge>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            {'★'.repeat(Math.floor(rating ))}
            {rating % 1 >= 0.5 ? '½' : ''}
            {'☆'.repeat(5 - Math.ceil(rating))}
          </div>
          <Link to={`/receitas/${id}`} className="btn btn-sm btn-outline-primary">
            Ver Detalhes
          </Link>
        </div>
      </Card.Body>
    </Card>
  );
};

export default RecipeCard;

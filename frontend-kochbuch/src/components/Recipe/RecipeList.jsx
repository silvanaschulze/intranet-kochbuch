import React from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import RecipeCard from './RecipeCard';

const RecipeList = ({ recipes }) => {
  // Em um ambiente real, recipes seria um array com dados das receitas
  // Por enquanto, usamos dados de exemplo
  const defaultRecipes = [
    {
      id: 1,
      title: 'Lasanha à Bolonhesa',
      image: 'https://via.placeholder.com/300x200',
      prepTime: '45 min',
      difficulty: 'Médio',
      rating: 4.8
    },
    {
      id: 2,
      title: 'Risoto de Cogumelos',
      image: 'https://via.placeholder.com/300x200',
      prepTime: '30 min',
      difficulty: 'Médio',
      rating: 4.5
    },
    {
      id: 3,
      title: 'Salada Caesar',
      image: 'https://via.placeholder.com/300x200',
      prepTime: '15 min',
      difficulty: 'Fácil',
      rating: 4.2
    }
  ];

  const recipeList = recipes || defaultRecipes;

  return (
    <div>
      <div className="mb-4">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Control type="text" placeholder="Buscar receitas..." />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Select>
              <option>Todas as categorias</option>
              <option>Entradas</option>
              <option>Pratos Principais</option>
              <option>Sobremesas</option>
              <option>Bebidas</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select>
              <option>Mais recentes</option>
              <option>Mais populares</option>
              <option>Mais fáceis</option>
            </Form.Select>
          </Col>
        </Row>
      </div>

      <Row xs={1} md={2} lg={3} className="g-4">
        {recipeList.map(recipe => (
          <Col key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </Col>
         ))}
      </Row>

      <div className="d-flex justify-content-center mt-4">
        <Button variant="outline-primary" className="mx-1">Anterior</Button>
        <Button variant="primary" className="mx-1">1</Button>
        <Button variant="outline-primary" className="mx-1">2</Button>
        <Button variant="outline-primary" className="mx-1">3</Button>
        <Button variant="outline-primary" className="mx-1">Próximo</Button>
      </div>
    </div>
  );
};

export default RecipeList;

import React from 'react';
import RecipeList from '../components/Recipe/RecipeList';

const RecipeListPage = () => {
  return (
    <div>
      <h1 className="mb-4">Todas as Receitas</h1>
      <RecipeList />
    </div>
  );
};

export default RecipeListPage;

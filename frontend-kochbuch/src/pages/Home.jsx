import React from 'react';
import { login } from '../services/authService';

const Home = () => {
  const handleTestLogin = async () => {
    try {
      const response = await login('test@example.com', 'Test1234!');
      console.log('Login bem-sucedido:', response);
      alert('Login bem-sucedido! Verifique o console.');
    } catch (error) {
      console.error('Erro no login:', error);
      alert('Erro no login: ' + (error.response?.data?.fehler || error.message));
    }
  };

  return (
    <div className="text-center py-5">
      <h1>Willkommen bei Intranet-Kochbuch</h1>
      <p className="lead">Ihr Online-Kochbuch</p>
      <button 
        className="btn btn-primary mt-3" 
        onClick={handleTestLogin}
      >
        Test Login
      </button>
    </div>
  );
};

export default Home;
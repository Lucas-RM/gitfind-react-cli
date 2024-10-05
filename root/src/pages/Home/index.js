import React from 'react';
import { Link } from 'react-router-dom'; // Importa o componente Link para navegação
import './styles.css';

const Home = () => {
  return (
    <div className="home">
      <h1>Página Inicial</h1>
      <p>Bem-vindo à página inicial!</p>
      
      {/* Links para navegar entre as páginas */}
      <nav>
        <Link to="/">Home</Link> | <Link to="/gitfind">GitFind</Link>
      </nav>
    </div>
  );
};

export default Home;
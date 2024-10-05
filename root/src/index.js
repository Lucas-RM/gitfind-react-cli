import React from 'react';
import ReactDOM from 'react-dom/client';
import "./styles.css";
import AppRoutes from './Routes';  // Importa o arquivo de rotas

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
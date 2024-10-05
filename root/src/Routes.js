import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home'; // Página principal
import App from './pages/App'; // Página GitFind

const AppRoutes = () => {
  return (
    <Router basename="/gitfind-react-cli">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gitfind" element={<App />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

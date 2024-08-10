import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import './stylesheets/index.css';
import { useEffect } from 'react';
import Dashboard from './pages/Dashboard';

const App = () => {
  useEffect(() => {
    //console.log('App component mounted');
  }, []);
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
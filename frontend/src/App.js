import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import ChessboardComponent from './components/Chessboard';
import Home from './components/Home';
import './App.css'
const App = () => {
  return (
    <Router>
      <div>
        <h1>ArkaChess</h1>
        <Routes>
        <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chess" element={<ChessboardComponent />} />
          <Route path="/" element={<Home />} /> {/* Assuming Home is defined */}
        </Routes>
      </div>
    </Router>
  );
};


export default App;

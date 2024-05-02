import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import Home from './Home.js'
import Assignment1 from './pages/Assignment1';
import Assignment2 from './pages/Assignment2';
import Assignment3 from './pages/Assignment3';
import Final from './pages/Final';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>CS4808 Data Vizualization</h1>
      <nav>
        <ul>
          <li><Link to="/home">Home</Link></li>
          <li><Link to="/assignment1">Assignment 1</Link></li>
          <li><Link to="/assignment2">Assignment 2</Link></li>
          <li><Link to="/assignment3">Assignment 3</Link></li>
          <li><Link to="/final">Final</Link></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/assignment1" element={<Assignment1 />} />
        <Route path="/assignment2" element={<Assignment2 />} />
        <Route path="/assignment3" element={<Assignment3 />} />
        <Route path="/final" element={<Final />} />
        <Route path="/" element={<div>Home Page</div>} />
      </Routes>
    </div>
  );
}

export default App;

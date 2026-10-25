import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout/Layout';
import Ringkasan from './pages/Ringkasan/Ringkasan';
import Pesanan from './pages/Pesanan/Pesanan';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <Layout>
              <Ringkasan />
            </Layout>
          } 
        />
        <Route 
          path="/pesanan" 
          element={
            <Layout>
              <Pesanan />
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
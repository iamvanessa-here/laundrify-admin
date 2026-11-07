import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './pages/Login/Login';
import Pesanan from './pages/Pesanan/Pesanan';
import Pelanggan from './pages/Pelanggan/Pelanggan';
import Layanan from './pages/Layanan/Layanan';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Layout>
                <Pesanan />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pesanan" 
          element={
            <ProtectedRoute>
              <Layout>
                <Pesanan />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pelanggan" 
          element={
            <ProtectedRoute>
              <Layout>
                <Pelanggan />
              </Layout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/layanan" 
          element={
            <ProtectedRoute>
              <Layout>
                <Layanan />
              </Layout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminDashboard from './components/AdminDashboard';
import TutorLogin from './components/TutorLogin';
import TutorDashboard from './components/TutorDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

function AppContent() {
  const { user, userType } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <TutorLogin /> : <Navigate to={userType === 'admin' ? '/admin' : '/tutor'} />} 
        />
        <Route 
          path="/admin" 
          element={user && userType === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/tutor" 
          element={user && userType === 'tutor' ? <TutorDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? (userType === 'admin' ? '/admin' : '/tutor') : '/login'} />} 
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <AppContent />
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
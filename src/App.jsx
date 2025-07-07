import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import TutorLogin from './components/TutorLogin';
import TutorDashboard from './components/TutorDashboard';
import ParentDashboard from './components/ParentDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';

function AppContent() {
  const { user, userType, loading: authLoading } = useAuth();
  const { loading: dataLoading } = useData();

  const getRedirectPath = () => {
    switch (userType) {
      case 'admin': return '/admin';
      case 'tutor': return '/tutor';
      case 'parent': return '/parent';
      default: return '/login';
    }
  };

  if (authLoading || dataLoading) {
    return <LoadingSpinner message="Initializing DGTutor..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <TutorLogin /> : <Navigate to={getRedirectPath()} />} 
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
          path="/parent" 
          element={user && userType === 'parent' ? <ParentDashboard /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={<Navigate to={user ? getRedirectPath() : '/login'} />} 
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
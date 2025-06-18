import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login/Login.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';

const App: React.FC = () => {
  const isAuthenticated = !!(localStorage.getItem('token') || sessionStorage.getItem('token'));

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
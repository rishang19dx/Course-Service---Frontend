import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateStudent from './components/CreateStudent';
import StudentSearch from './components/StudentSearch';        // NEW
import UpdateStudent from './components/UpdateStudent';        // NEW
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/api';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={isAuthenticated() ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/create-student" 
            element={
              <ProtectedRoute>
                <CreateStudent />
              </ProtectedRoute>
            } 
          />
          {/* NEW ROUTES */}
          <Route 
            path="/student-search" 
            element={
              <ProtectedRoute>
                <StudentSearch />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/update-student/:studentId" 
            element={
              <ProtectedRoute>
                <UpdateStudent />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateStudent from './components/CreateStudent';
import StudentSearch from './components/StudentSearch';
import UpdateStudent from './components/UpdateStudent';
import CreateAnnouncement from './components/CreateAnnouncement'; 
import ProtectedRoute from './components/ProtectedRoute';
import { isAuthenticated } from './utils/api';
import CreateCourse from './components/CreateCourse';
import UpdateCourse from './components/UpdateCourse';
import EditCourseHelpers from './components/EditCourseHelper';
import UpdateCourseList from './components/UpdateCourseList';
import EditCourse from './components/EditCourse';
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
            path="/create-announcement" 
            element={
              <ProtectedRoute>
                <CreateAnnouncement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
        <Route path="/create-course" element={<ProtectedRoute><CreateCourse /></ProtectedRoute>} />
        <Route path="/update-course" element={<ProtectedRoute><UpdateCourse /></ProtectedRoute>} />
        <Route path="/edit-course-helpers" element={
        <ProtectedRoute>
          <EditCourseHelpers />
        </ProtectedRoute>
      } />
        <Route path="/update-course" element={<ProtectedRoute><UpdateCourse /></ProtectedRoute>} />
        <Route path="/update-course-list/:courseCode" element={<ProtectedRoute><UpdateCourseList /></ProtectedRoute>} />
        <Route path="/edit-course/:courseId" element={<ProtectedRoute><EditCourse /></ProtectedRoute>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import FacultyDashboard from './pages/FacultyDashboard';
import NotFound from './pages/NotFound';
import theme from './theme';
import LoginPage from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';

function App() {
  const { isAuthenticated, userRole } = useAuthStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/faculty" 
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/" 
            element={
              isAuthenticated ? <Navigate to={`/${userRole}`} /> : <Navigate to="/login" />
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;

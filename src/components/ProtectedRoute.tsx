import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: Array<'admin' | 'faculty' | 'student'>;
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    // Redirect to a 'not-authorized' page or back to a default page
    // For now, let's redirect to login. A better UX would be a specific page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 
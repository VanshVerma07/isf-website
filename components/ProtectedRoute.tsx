import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    // Redirect them to the home page if they are not an admin
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

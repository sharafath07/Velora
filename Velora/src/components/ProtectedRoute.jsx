import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // ensure correct import path
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while authentication state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Redirect to login if no user is logged in
  if (!user) {
    return <Navigate to="/Velora/login" state={{ from: location }} replace />;
  }

  // Redirect to unauthorized page if user doesn’t have the right role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/Velora/unauthorized" replace />;
  }

  // Otherwise, render the child route
  return children;
};

export default ProtectedRoute;

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { authState } = useAuth();

  const userHasRequiredRole = authState.user?.roles?.some(role => allowedRoles.includes(role.name));

  if (!authState.user || !userHasRequiredRole) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
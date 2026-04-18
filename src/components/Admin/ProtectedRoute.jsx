import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import Loader from '../Loader/Loader';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAdminAuth();

  if (loading) return <Loader />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedRoute;

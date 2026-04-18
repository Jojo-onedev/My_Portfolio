import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_token');
    // Basic verification: check if token exists and has expected format (e.g., prefix_...)
    if (adminSession && adminSession.startsWith('sk_admin_')) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (password) => {
    const securePassword = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
    if (password === securePassword) {
      // Generate an opaque token instead of a simple boolean
      const token = `sk_admin_${Math.random().toString(36).substr(2)}${Date.now().toString(36)}`;
      localStorage.setItem('admin_token', token);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);

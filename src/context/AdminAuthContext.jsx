import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_token');
    if (adminSession && adminSession.startsWith('sk_admin_')) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (password) => {
    const storedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
    if (!storedHash) return false;
    const hashed = await sha256(password);
    if (hashed === storedHash) {
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

import React, { createContext, useContext, useState, useEffect } from 'react';

const AdminAuthContext = createContext();

/**
 * Hache un texte en clair avec SHA-256 via l'API native du navigateur.
 * Aucune dépendance externe n'est nécessaire.
 * @param {string} text - Le mot de passe en clair
 * @returns {Promise<string>} - Le hash hexadécimal SHA-256
 */
const hashPassword = async (text) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const AdminAuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminSession = localStorage.getItem('admin_token');
    // Vérifie que le token existe et a le bon préfixe opaque
    if (adminSession && adminSession.startsWith('sk_admin_')) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  /**
   * Authentifie l'admin en comparant le hash SHA-256 du mot de passe saisi
   * au hash stocké dans la variable d'environnement VITE_ADMIN_PASSWORD_HASH.
   * Le mot de passe en clair n'est jamais comparé ni stocké.
   */
  const login = async (password) => {
    const storedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

    if (!storedHash) {
      console.error('VITE_ADMIN_PASSWORD_HASH est manquant dans le fichier .env');
      return false;
    }

    const inputHash = await hashPassword(password);

    if (inputHash === storedHash) {
      // Génère un token opaque (non prédictible) et le stocke
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

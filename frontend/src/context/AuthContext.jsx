import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('ncrb_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('ncrb_auth_token');
      if (token) {
        try {
          const res = await api.getProfile();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('ncrb_user', JSON.stringify(res.user));
          }
        } catch (e) {
          console.warn('Session expired or invalid token');
          setUser(null);
          localStorage.removeItem('ncrb_auth_token');
          localStorage.removeItem('ncrb_user');
        }
      }
      setLoading(false);
    }

    checkAuth();

    const handleAuthChange = () => {
      const saved = localStorage.getItem('ncrb_user');
      setUser(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener('ncrb_auth_change', handleAuthChange);
    return () => window.removeEventListener('ncrb_auth_change', handleAuthChange);
  }, []);

  const login = async (email, password, mfaCode) => {
    const res = await api.login(email, password, mfaCode);
    if (res.success && res.token) {
      localStorage.setItem('ncrb_auth_token', res.token);
      localStorage.setItem('ncrb_user', JSON.stringify(res.user));
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Login failed');
  };

  const switchDemoRole = async (role) => {
    const res = await api.switchDemoRole(role);
    if (res.success && res.token) {
      localStorage.setItem('ncrb_auth_token', res.token);
      localStorage.setItem('ncrb_user', JSON.stringify(res.user));
      setUser(res.user);
      return res;
    }
    throw new Error(res.message || 'Demo role switch failed');
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore logout network error
    }
    localStorage.removeItem('ncrb_auth_token');
    localStorage.removeItem('ncrb_user');
    setUser(null);
  };

  // RBAC Permission Evaluator
  const hasRole = (...roles) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return roles.includes(user.role);
  };

  const can = (action) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;

    switch (action) {
      case 'CREATE_CASE':
      case 'UPLOAD':
        return ['INVESTIGATING_OFFICER'].includes(user.role);
      case 'SIGN':
        return ['LEGAL_OFFICER', 'INVESTIGATING_OFFICER'].includes(user.role);
      case 'APPROVE_ACCESS':
      case 'REVIEW':
        return ['REVIEWER'].includes(user.role);
      case 'AUDIT':
        return ['AUDITOR', 'LEGAL_OFFICER'].includes(user.role);
      case 'RESOLVE_SECURITY':
        return ['SUPER_ADMIN', 'AUDITOR'].includes(user.role);
      default:
        return true;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        switchDemoRole,
        logout,
        hasRole,
        can,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

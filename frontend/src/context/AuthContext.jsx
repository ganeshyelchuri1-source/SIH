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
          const saved = localStorage.getItem('ncrb_user');
          if (saved) {
            try {
              setUser(JSON.parse(saved));
            } catch {
              setUser(null);
            }
          } else {
            console.warn('Session expired or invalid token');
            setUser(null);
            localStorage.removeItem('ncrb_auth_token');
            localStorage.removeItem('ncrb_user');
          }
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
    try {
      const res = await api.login(email, password, mfaCode);
      if (res.success && res.token) {
        localStorage.setItem('ncrb_auth_token', res.token);
        localStorage.setItem('ncrb_user', JSON.stringify(res.user));
        setUser(res.user);
        return res;
      }
      throw new Error(res.message || 'Login failed');
    } catch (apiErr) {
      // Fallback for Netlify static deployment or offline server
      const cleanEmail = (email || '').trim().toLowerCase();
      const cleanBadge = (email || '').trim().toUpperCase();

      let matchedUser = null;
      if (cleanEmail.includes('ganesh') || cleanBadge === 'GANESH') {
        matchedUser = {
          id: 'b5748c00-7041-4d15-8a93-019a343aec7b',
          email: 'ganesh@ncrb-demo.gov',
          fullName: 'Director Ganesh Yelchuri',
          badgeNumber: 'GANESH',
          role: 'SUPER_ADMIN',
          department: { name: 'Women Safety Division', code: 'NCRB-WSD' },
        };
      } else if (cleanEmail.includes('admin') || cleanBadge.includes('ADM')) {
        matchedUser = {
          id: 'admin-001',
          email: 'admin@ncrb-demo.gov',
          fullName: 'Dr. Rajesh Verma',
          badgeNumber: 'NCRB-ADM-001',
          role: 'SUPER_ADMIN',
          department: { name: 'Women Safety Division', code: 'NCRB-WSD' },
        };
      } else if (cleanEmail.includes('officer') || cleanBadge.includes('INV')) {
        matchedUser = {
          id: 'officer-104',
          email: 'officer@ncrb-demo.gov',
          fullName: 'Insp. Vikram Rathore',
          badgeNumber: 'NCRB-INV-104',
          role: 'INVESTIGATING_OFFICER',
          department: { name: 'Women Safety Division', code: 'NCRB-WSD' },
        };
      } else if (cleanEmail.includes('legal') || cleanBadge.includes('LEG')) {
        matchedUser = {
          id: 'legal-202',
          email: 'legal@ncrb-demo.gov',
          fullName: 'Adv. Meera Sen',
          badgeNumber: 'NCRB-LEG-202',
          role: 'LEGAL_OFFICER',
          department: { name: 'Prosecution & Legal Directorate', code: 'LEGAL-PROS' },
        };
      } else if (cleanEmail.includes('reviewer') || cleanBadge.includes('REV')) {
        matchedUser = {
          id: 'reviewer-305',
          email: 'reviewer@ncrb-demo.gov',
          fullName: 'Dy. SP Anita Deshmukh',
          badgeNumber: 'NCRB-REV-305',
          role: 'REVIEWER',
          department: { name: 'Cyber Crime Investigation Cell', code: 'CYBER-CELL' },
        };
      } else if (cleanEmail.includes('auditor') || cleanBadge.includes('AUD')) {
        matchedUser = {
          id: 'auditor-401',
          email: 'auditor@ncrb-demo.gov',
          fullName: 'Auditor R. K. Iyer',
          badgeNumber: 'NCRB-AUD-401',
          role: 'AUDITOR',
          department: { name: 'Women Safety Division', code: 'NCRB-WSD' },
        };
      }

      if (matchedUser) {
        const dummyToken = 'demo_token_' + btoa(JSON.stringify({ id: matchedUser.id, role: matchedUser.role, email: matchedUser.email }));
        localStorage.setItem('ncrb_auth_token', dummyToken);
        localStorage.setItem('ncrb_user', JSON.stringify(matchedUser));
        setUser(matchedUser);
        return { success: true, token: dummyToken, user: matchedUser };
      }

      throw apiErr;
    }
  };

  const switchDemoRole = async (role) => {
    try {
      const res = await api.switchDemoRole(role);
      if (res.success && res.token) {
        localStorage.setItem('ncrb_auth_token', res.token);
        localStorage.setItem('ncrb_user', JSON.stringify(res.user));
        setUser(res.user);
        return res;
      }
      throw new Error(res.message || 'Demo role switch failed');
    } catch (err) {
      const roleUserMap = {
        SUPER_ADMIN: {
          id: 'b5748c00-7041-4d15-8a93-019a343aec7b',
          email: 'ganesh@ncrb-demo.gov',
          fullName: 'Director Ganesh Yelchuri',
          badgeNumber: 'GANESH',
          role: 'SUPER_ADMIN',
          department: { name: 'Women Safety Division', code: 'NCRB-WSD' },
        },
        INVESTIGATING_OFFICER: {
          id: 'officer-104',
          email: 'officer@ncrb-demo.gov',
          fullName: 'Insp. Vikram Rathore',
          badgeNumber: 'NCRB-INV-104',
          role: 'INVESTIGATING_OFFICER',
          department: { name: 'Women Safety Division', code: 'NCRB-WSD' },
        },
        LEGAL_OFFICER: {
          id: 'legal-202',
          email: 'legal@ncrb-demo.gov',
          fullName: 'Adv. Meera Sen',
          badgeNumber: 'NCRB-LEG-202',
          role: 'LEGAL_OFFICER',
          department: { name: 'Prosecution & Legal Directorate', code: 'LEGAL-PROS' },
        },
        REVIEWER: {
          id: 'reviewer-305',
          email: 'reviewer@ncrb-demo.gov',
          fullName: 'Dy. SP Anita Deshmukh',
          badgeNumber: 'NCRB-REV-305',
          role: 'REVIEWER',
          department: { name: 'Cyber Crime Investigation Cell', code: 'CYBER-CELL' },
        },
        AUDITOR: {
          id: 'auditor-401',
          email: 'auditor@ncrb-demo.gov',
          fullName: 'Auditor R. K. Iyer',
          badgeNumber: 'NCRB-AUD-401',
          role: 'AUDITOR',
          department: { name: 'Women Safety Division', code: 'NCRB-WSD' },
        },
      };

      const fallback = roleUserMap[role];
      if (fallback) {
        const dummyToken = 'demo_token_' + btoa(JSON.stringify({ id: fallback.id, role: fallback.role, email: fallback.email }));
        localStorage.setItem('ncrb_auth_token', dummyToken);
        localStorage.setItem('ncrb_user', JSON.stringify(fallback));
        setUser(fallback);
        return { success: true, token: dummyToken, user: fallback };
      }
      throw err;
    }
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

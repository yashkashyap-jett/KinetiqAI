import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const handleUnauthorized = () => {
      localStorage.removeItem('kinetiq_token');
      setUser(null);
      setLoading(false);
    };

    window.addEventListener('auth_unauthorized', handleUnauthorized);

    const token = localStorage.getItem('kinetiq_token');
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('auth_unauthorized', handleUnauthorized);
    };
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data.user);
    } catch (error) {
      localStorage.removeItem('kinetiq_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('kinetiq_token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    localStorage.setItem('kinetiq_token', data.data.token);
    setUser(data.data.user);
    return data.data.user;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('kinetiq_token');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, fetchUser }}>
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

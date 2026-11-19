import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Restore user session synchronously from localStorage on page reload
  const getStoredUser = () => {
    try {
      const stored = localStorage.getItem('neuroml_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  };

  const getStoredToken = () => {
    try {
      return localStorage.getItem('neuroml_token');
    } catch {
      return null;
    }
  };

  const initialUser = getStoredUser();
  const initialToken = getStoredToken();

  const [user, setUser] = useState(initialUser);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!(initialToken || initialUser));
  // If we already have stored credentials, don't block the UI with an initializing spinner
  const [isInitializing, setIsInitializing] = useState(() => !(initialToken || initialUser));
  const [demoMode, setDemoMode] = useState(false);

  const toggleDemoMode = () => {
    setDemoMode((prev) => !prev);
  };

  // Verify and refresh session with backend
  useEffect(() => {
    const checkAuthSession = async () => {
      const hasStoredToken = !!localStorage.getItem('neuroml_token');
      try {
        const userData = await authService.getMe();
        if (userData && userData.id) {
          setUser(userData);
          setIsAuthenticated(true);
          try {
            localStorage.setItem('neuroml_user', JSON.stringify(userData));
          } catch (e) {}
        } else if (!hasStoredToken) {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        // If 401 Unauthorized, session has genuinely expired
        if (err.status === 401) {
          try {
            localStorage.removeItem('neuroml_token');
            localStorage.removeItem('neuroml_user');
          } catch (e) {}
          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setIsInitializing(false);
      }
    };

    checkAuthSession();
  }, []);

  const login = async (credentialsOrEmail, password) => {
    const creds = typeof credentialsOrEmail === 'object' && credentialsOrEmail !== null
      ? credentialsOrEmail
      : { email: credentialsOrEmail, password };
    const response = await authService.login(creds);
    const loggedUser = response.user || response;
    const token = response.access_token;

    if (token) {
      try {
        localStorage.setItem('neuroml_token', token);
      } catch (e) {}
    }
    if (loggedUser) {
      try {
        localStorage.setItem('neuroml_user', JSON.stringify(loggedUser));
      } catch (e) {}
    }

    setUser(loggedUser);
    setIsAuthenticated(true);
    return loggedUser;
  };

  const register = async (credentialsOrUsername, email, password) => {
    const creds = typeof credentialsOrUsername === 'object' && credentialsOrUsername !== null
      ? credentialsOrUsername
      : { username: credentialsOrUsername, email, password };
    const response = await authService.register(creds);
    const registeredUser = response.user || response;
    const token = response.access_token;

    if (token) {
      try {
        localStorage.setItem('neuroml_token', token);
      } catch (e) {}
    }
    if (registeredUser) {
      try {
        localStorage.setItem('neuroml_user', JSON.stringify(registeredUser));
      } catch (e) {}
    }

    setUser(registeredUser);
    setIsAuthenticated(true);
    return registeredUser;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.warn('Logout API call failed:', err);
    } finally {
      try {
        localStorage.removeItem('neuroml_token');
        localStorage.removeItem('neuroml_user');
      } catch (e) {}
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const updateProfile = (data) => {
    setUser((prev) => {
      const updated = { ...prev, ...data };
      try {
        localStorage.setItem('neuroml_user', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isInitializing,
        login,
        register,
        logout,
        updateProfile,
        demoMode,
        toggleDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

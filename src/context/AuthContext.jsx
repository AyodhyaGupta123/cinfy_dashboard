import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * AuthProvider component that provides user state and auth actions.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Demo user data
  const DEMO_USER = {
    id: 'user-123',
    name: 'Ankit Jatav',
    email: 'ankit.jatav@cinfy.io',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Ankit',
    role: 'Admin',
    company: 'Cinfy Dashboard Inc.'
  };

  useEffect(() => {
    // Check for existing session on mount
    const token = localStorage.getItem('auth_token');
    if (token) {
      // In a real app, you would fetch user data from an API here
      setUser(DEMO_USER);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo authentication logic
    if (email === 'ankit.jatav@cinfy.io' && password === 'cinfy@123') {
      localStorage.setItem('auth_token', 'demo-token-123');
      setUser(DEMO_USER);
      setLoading(false);
      return { success: true };
    } else {
      setLoading(false);
      return { success: false, message: 'Invalid email or password' };
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to easily access AuthContext
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;

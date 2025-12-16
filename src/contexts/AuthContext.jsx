// File: src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cek jika user sudah login (dari localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('financeTrackerUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Simulasi login - di production ini akan panggil API
    const mockUser = {
      id: 1,
      email,
      name: email.split('@')[0],
      avatar: '👤',
      level: 1,
      xp: 0,
      joinDate: new Date().toISOString()
    };
    
    setUser(mockUser);
    localStorage.setItem('financeTrackerUser', JSON.stringify(mockUser));
    return { success: true, user: mockUser };
  };

  const signup = (email, password, name) => {
    // Simulasi signup
    const newUser = {
      id: Date.now(),
      email,
      name,
      avatar: '👤',
      level: 1,
      xp: 0,
      joinDate: new Date().toISOString(),
      preferences: {
        currency: 'IDR',
        monthlyIncome: 0
      }
    };
    
    setUser(newUser);
    localStorage.setItem('financeTrackerUser', JSON.stringify(newUser));
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('financeTrackerUser');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('financeTrackerUser', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      updateUser,
      loading,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
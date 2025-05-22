import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user_data')) || null,
  });

  const login = (token, userData) => {
    setAuthState({
      token: token,
      user: userData,
    });
    localStorage.setItem('token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = () => {
    setAuthState({
      token: null,
      user: null,
    });
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

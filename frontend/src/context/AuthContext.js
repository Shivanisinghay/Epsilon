import { createContext, useContext, useState, useEffect } from 'react';
import { login as loginService, register as registerService } from '../services/auth';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        localStorage.clear(); // Clear corrupted data
    } finally {
        setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await loginService(email, password);
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password) => {
    return await registerService(name, email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // This function is the single source of truth for updating the user state.
  const updateUserInContext = (updatedUserData) => {
    setUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };


  const value = {
    user,
    setUser: updateUserInContext, // Pass our new function as setUser
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
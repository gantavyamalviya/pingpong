import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import type { User, AuthResponse } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token and set user on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const currentUser = authService.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
            // If we're on the login/register page, redirect to dashboard
            if (window.location.pathname === '/login' || window.location.pathname === '/register') {
              navigate('/dashboard');
            }
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService.login({ username, password });
      // Create a user object from the response
      const userData: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        profilePicture: response.profilePicture,
        bio: response.bio
      };
      setUser(userData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, email: string, password: string, fullName: string) => {
    try {
      const response = await authService.register({ username, email, password, fullName });
      // Create a user object from the response
      const userData: User = {
        id: response.id,
        username: response.username,
        email: response.email,
        fullName: response.fullName,
        profilePicture: response.profilePicture,
        bio: response.bio
      };
      setUser(userData);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate('/', { replace: true });
  };

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
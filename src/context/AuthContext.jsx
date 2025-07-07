import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    console.log('Attempting login with:', username);
    
    try {
      // Authenticate with Supabase database
      const { data, error } = await supabase
        .from('users_dgtutor_2024')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('status', 'active')
        .single();

      if (error) {
        console.error('Database query error:', error);
        return {
          success: false,
          message: 'Invalid username or password. Please check your credentials.'
        };
      }

      if (data && data.password_hash === password) {
        const userSession = {
          id: data.id,
          username: data.username,
          name: data.name,
          role: data.role,
          email: data.email
        };

        setUser(userSession);
        setUserType(data.role);
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        localStorage.setItem('userType', data.role);

        console.log('Login successful:', data.name);
        return {
          success: true,
          userType: data.role,
          message: `Welcome back, ${data.name}!`
        };
      } else {
        return {
          success: false,
          message: 'Invalid username or password. Please check your credentials.'
        };
      }

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.'
      };
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
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
      // Try to authenticate with Supabase first
      const { data, error } = await supabase
        .from('users_dgtutor_2024')
        .select('*')
        .eq('username', username.toLowerCase())
        .eq('status', 'active')
        .single();

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
      }

      // Fallback to hardcoded users if database login fails
      return fallbackLogin(username, password);

    } catch (error) {
      console.error('Database login error:', error);
      return fallbackLogin(username, password);
    }
  };

  const fallbackLogin = (username, password) => {
    console.log('Using fallback login for:', username);
    
    const defaultUsers = [
      { 
        id: 'admin-1', 
        name: 'Administrator', 
        username: 'admin@gmail.com', 
        password: '1234', 
        role: 'admin', 
        status: 'active' 
      },
      { 
        id: 'tutor-1', 
        name: 'Wazid', 
        username: 'wazid', 
        password: 'tutor123', 
        role: 'tutor', 
        status: 'active' 
      },
      { 
        id: 'tutor-2', 
        name: 'Rahman', 
        username: 'rahman', 
        password: 'tutor123', 
        role: 'tutor', 
        status: 'active' 
      },
      { 
        id: 'parent-1', 
        name: 'John Smith', 
        username: 'johnsmith', 
        password: 'parent123', 
        role: 'parent', 
        status: 'active' 
      }
    ];

    const foundUser = defaultUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      u.status === 'active'
    );

    if (foundUser && foundUser.password === password) {
      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        name: foundUser.name,
        role: foundUser.role
      };

      setUser(userSession);
      setUserType(foundUser.role);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      localStorage.setItem('userType', foundUser.role);

      console.log('Fallback login successful:', foundUser.name);
      return {
        success: true,
        userType: foundUser.role,
        message: `Welcome back, ${foundUser.name}!`
      };
    }

    console.log('Login failed for:', username);
    return {
      success: false,
      message: 'Invalid username or password. Please check your credentials.'
    };
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
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    if (savedUser && savedUserType) {
      setUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
  }, []);

  const login = (username, password) => {
    // Admin login
    if (username === 'admin' && password === 'admin123') {
      const adminUser = { username: 'admin', name: 'Administrator' };
      setUser(adminUser);
      setUserType('admin');
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      localStorage.setItem('userType', 'admin');
      return { success: true, userType: 'admin' };
    }

    // Tutor login
    const tutors = ['Wazid', 'Rahman'];
    const tutorName = tutors.find(t => t.toLowerCase() === username.toLowerCase());
    
    if (tutorName && password === 'tutor123') {
      const tutorUser = { username: tutorName.toLowerCase(), name: tutorName };
      setUser(tutorUser);
      setUserType('tutor');
      localStorage.setItem('currentUser', JSON.stringify(tutorUser));
      localStorage.setItem('userType', 'tutor');
      return { success: true, userType: 'tutor' };
    }

    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
  };

  return (
    <AuthContext.Provider value={{ user, userType, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
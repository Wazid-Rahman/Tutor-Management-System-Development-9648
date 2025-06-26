import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState({});
  const [subjects, setSubjects] = useState([
    'Math',
    'Science', 
    'English',
    'AP Subjects',
    'College Subjects',
    'Physics',
    'Chemistry',
    'Biology',
    'History',
    'Computer Science'
  ]);
  const [users, setUsers] = useState([
    {
      id: 'admin-1',
      name: 'Administrator',
      username: 'admin',
      email: 'admin@tutorsystem.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: {
        canViewStudents: true,
        canEditStudents: true,
        canDeleteStudents: true,
        canManageSessions: true,
        canViewReports: true,
        canManageUsers: true,
      }
    },
    {
      id: 'tutor-1',
      name: 'Wazid',
      username: 'wazid',
      email: 'wazid@tutorsystem.com',
      role: 'tutor',
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: {
        canViewStudents: true,
        canEditStudents: false,
        canDeleteStudents: false,
        canManageSessions: true,
        canViewReports: false,
        canManageUsers: false,
      }
    },
    {
      id: 'tutor-2',
      name: 'Rahman',
      username: 'rahman',
      email: 'rahman@tutorsystem.com',
      role: 'tutor',
      status: 'active',
      createdAt: new Date().toISOString(),
      permissions: {
        canViewStudents: true,
        canEditStudents: false,
        canDeleteStudents: false,
        canManageSessions: true,
        canViewReports: false,
        canManageUsers: false,
      }
    }
  ]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedStudents = localStorage.getItem('students');
    const savedSessions = localStorage.getItem('sessions');
    const savedUsers = localStorage.getItem('users');
    const savedSubjects = localStorage.getItem('subjects');
    
    if (savedStudents) {
      setStudents(JSON.parse(savedStudents));
    }
    
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const addStudent = (student) => {
    const newStudent = {
      ...student,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setStudents(prev => [...prev, newStudent]);
  };

  const updateStudent = (id, updatedStudent) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, ...updatedStudent } : student
    ));
  };

  const deleteStudent = (id) => {
    setStudents(prev => prev.filter(student => student.id !== id));
    // Also remove sessions for this student
    setSessions(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const updateSessions = (studentId, month, dates) => {
    setSessions(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [month]: dates
      }
    }));
  };

  const markSessionAsPaid = (studentId, month, date, isPaid = true) => {
    setSessions(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [month]: (prev[studentId]?.[month] || []).map(sessionDate => 
          sessionDate === date || (typeof sessionDate === 'object' && sessionDate.date === date)
            ? { date: typeof sessionDate === 'string' ? sessionDate : sessionDate.date, paid: isPaid }
            : sessionDate
        )
      }
    }));
  };

  const getStudentSessions = (studentId) => {
    return sessions[studentId] || {};
  };

  const getTotalSessions = (studentId) => {
    const studentSessions = sessions[studentId] || {};
    return Object.values(studentSessions).reduce((total, dates) => {
      return total + dates.length;
    }, 0);
  };

  const getPaidSessions = (studentId) => {
    const studentSessions = sessions[studentId] || {};
    return Object.values(studentSessions).reduce((total, dates) => {
      return total + dates.filter(session => 
        typeof session === 'object' && session.paid
      ).length;
    }, 0);
  };

  const getUnpaidSessions = (studentId) => {
    const studentSessions = sessions[studentId] || {};
    return Object.values(studentSessions).reduce((total, dates) => {
      return total + dates.filter(session => 
        typeof session === 'string' || (typeof session === 'object' && !session.paid)
      ).length;
    }, 0);
  };

  // User management functions
  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id, updatedUser) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updatedUser } : user
    ));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(user => user.id !== id));
  };

  const getTutors = () => {
    return users.filter(user => user.role === 'tutor' && user.status === 'active');
  };

  // Subject management functions
  const addSubject = (subject) => {
    if (!subjects.includes(subject)) {
      setSubjects(prev => [...prev, subject].sort());
    }
  };

  const deleteSubject = (subject) => {
    setSubjects(prev => prev.filter(s => s !== subject));
  };

  const updateSubject = (oldSubject, newSubject) => {
    setSubjects(prev => prev.map(s => s === oldSubject ? newSubject : s).sort());
    // Update students who have this subject
    setStudents(prev => prev.map(student => 
      student.subject === oldSubject ? { ...student, subject: newSubject } : student
    ));
  };

  return (
    <DataContext.Provider value={{
      students,
      sessions,
      users,
      subjects,
      addStudent,
      updateStudent,
      deleteStudent,
      updateSessions,
      markSessionAsPaid,
      getStudentSessions,
      getTotalSessions,
      getPaidSessions,
      getUnpaidSessions,
      addUser,
      updateUser,
      deleteUser,
      getTutors,
      addSubject,
      deleteSubject,
      updateSubject
    }}>
      {children}
    </DataContext.Provider>
  );
};
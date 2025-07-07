import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../lib/supabase';

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
  const [currency, setCurrency] = useState('USD');
  const [subjects, setSubjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setLoading(true);
      console.log('Initializing data...');
      
      // Load data from Supabase
      await Promise.all([
        loadUsers(),
        loadSubjects(),
        loadStudents(),
        loadSessions(),
        loadCurrencySettings()
      ]);
      
      console.log('Data initialized successfully');
    } catch (error) {
      console.error('Error initializing data:', error);
      // Fallback to default data
      setDefaultData();
    } finally {
      setLoading(false);
    }
  };

  const setDefaultData = () => {
    console.log('Setting default data...');
    
    // Set default users
    setUsers([
      { 
        id: 'admin-1', 
        name: 'Administrator', 
        username: 'admin@gmail.com', 
        email: 'admin@gmail.com',
        password_hash: '1234', 
        role: 'admin', 
        status: 'active',
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
        email: 'wazid@dgtutor.com',
        password_hash: 'tutor123', 
        role: 'tutor', 
        status: 'active',
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
        email: 'rahman@dgtutor.com',
        password_hash: 'tutor123', 
        role: 'tutor', 
        status: 'active',
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
        id: 'parent-1', 
        name: 'John Smith', 
        username: 'johnsmith', 
        email: 'john.smith@email.com',
        password_hash: 'parent123', 
        role: 'parent', 
        status: 'active',
        permissions: {
          canViewStudents: true,
          canEditStudents: false,
          canDeleteStudents: false,
          canManageSessions: false,
          canViewReports: true,
          canManageUsers: false,
        }
      }
    ]);

    // Set default subjects
    setSubjects([
      'Math', 'Science', 'English', 'AP Subjects', 'College Subjects',
      'Physics', 'Chemistry', 'Biology', 'History', 'Computer Science'
    ]);

    // Set default currency
    setCurrency('USD');
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users_dgtutor_2024')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data && data.length > 0) {
        setUsers(data);
        console.log('Users loaded from database:', data.length);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects_dgtutor_2024')
        .select('*')
        .order('name');

      if (error) throw error;
      if (data && data.length > 0) {
        setSubjects(data.map(subject => subject.name));
        console.log('Subjects loaded from database:', data.length);
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const loadStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students_dgtutor_2024')
        .select(`
          *,
          subject:subjects_dgtutor_2024(name),
          tutor:users_dgtutor_2024(name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (data) {
        const formattedStudents = data.map(student => ({
          ...student,
          subject: student.subject?.name || '',
          tutor: student.tutor?.name || '',
          studentName: student.student_name,
          parentName: student.parent_name,
          parentUsername: student.parent_username,
          feePerSession: student.fee_per_session,
          lastPaid: student.last_paid
        }));
        setStudents(formattedStudents);
        console.log('Students loaded from database:', formattedStudents.length);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions_dgtutor_2024')
        .select('*')
        .order('session_date', { ascending: false });

      if (error) throw error;

      if (data) {
        const groupedSessions = {};
        data.forEach(session => {
          if (!groupedSessions[session.student_id]) {
            groupedSessions[session.student_id] = {};
          }
          if (!groupedSessions[session.student_id][session.month_name]) {
            groupedSessions[session.student_id][session.month_name] = [];
          }
          
          groupedSessions[session.student_id][session.month_name].push(
            session.is_paid 
              ? { date: session.session_date, paid: true }
              : session.session_date
          );
        });
        setSessions(groupedSessions);
        console.log('Sessions loaded from database:', data.length);
      }
    } catch (error) {
      console.error('Error loading sessions:', error);
    }
  };

  const loadCurrencySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_settings_dgtutor_2024')
        .select('currency_code')
        .single();

      if (error) throw error;
      if (data) {
        setCurrency(data.currency_code);
        console.log('Currency loaded from database:', data.currency_code);
      }
    } catch (error) {
      console.error('Error loading currency settings:', error);
    }
  };

  // Currency functions
  const getCurrencySymbol = () => {
    return currency === 'USD' ? '$' : '₹';
  };

  const convertCurrency = (amount, fromCurrency = 'USD') => {
    const usdAmount = parseFloat(amount) || 0;
    if (currency === 'INR' && fromCurrency === 'USD') {
      return usdAmount * 83;
    }
    if (currency === 'USD' && fromCurrency === 'INR') {
      return usdAmount / 83;
    }
    return usdAmount;
  };

  const formatCurrency = (amount) => {
    const symbol = getCurrencySymbol();
    const convertedAmount = convertCurrency(amount);
    return `${symbol}${convertedAmount.toFixed(2)}`;
  };

  const updateCurrencyInDB = async (newCurrency) => {
    try {
      const { error } = await supabase
        .from('currency_settings_dgtutor_2024')
        .update({ currency_code: newCurrency })
        .eq('currency_code', currency);

      if (error) throw error;
      setCurrency(newCurrency);
    } catch (error) {
      console.error('Error updating currency:', error);
      setCurrency(newCurrency);
    }
  };

  // Student functions
  const addStudent = async (studentData) => {
    try {
      const { data: subjectData } = await supabase
        .from('subjects_dgtutor_2024')
        .select('id')
        .eq('name', studentData.subject)
        .single();

      const { data: tutorData } = await supabase
        .from('users_dgtutor_2024')
        .select('id')
        .eq('name', studentData.tutor)
        .single();

      const newStudent = {
        student_name: studentData.studentName,
        parent_name: studentData.parentName,
        parent_username: studentData.parentUsername,
        grade: studentData.grade,
        subject_id: subjectData?.id,
        tutor_id: tutorData?.id,
        status: studentData.status,
        fee_per_session: parseFloat(studentData.feePerSession) || 0,
        last_paid: studentData.lastPaid || null,
        remarks: studentData.remarks
      };

      const { data, error } = await supabase
        .from('students_dgtutor_2024')
        .insert([newStudent])
        .select(`
          *,
          subject:subjects_dgtutor_2024(name),
          tutor:users_dgtutor_2024(name)
        `)
        .single();

      if (error) throw error;

      const formattedStudent = {
        ...data,
        subject: data.subject?.name || '',
        tutor: data.tutor?.name || '',
        studentName: data.student_name,
        parentName: data.parent_name,
        parentUsername: data.parent_username,
        feePerSession: data.fee_per_session,
        lastPaid: data.last_paid
      };

      setStudents(prev => [formattedStudent, ...prev]);
    } catch (error) {
      console.error('Error adding student:', error);
      const newStudent = {
        ...studentData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      setStudents(prev => [...prev, newStudent]);
    }
  };

  const updateStudent = async (id, updatedData) => {
    try {
      const { data: subjectData } = await supabase
        .from('subjects_dgtutor_2024')
        .select('id')
        .eq('name', updatedData.subject)
        .single();

      const { data: tutorData } = await supabase
        .from('users_dgtutor_2024')
        .select('id')
        .eq('name', updatedData.tutor)
        .single();

      const updatePayload = {
        student_name: updatedData.studentName,
        parent_name: updatedData.parentName,
        parent_username: updatedData.parentUsername,
        grade: updatedData.grade,
        subject_id: subjectData?.id,
        tutor_id: tutorData?.id,
        status: updatedData.status,
        fee_per_session: parseFloat(updatedData.feePerSession) || 0,
        last_paid: updatedData.lastPaid || null,
        remarks: updatedData.remarks
      };

      const { error } = await supabase
        .from('students_dgtutor_2024')
        .update(updatePayload)
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, ...updatedData } : student
      ));
    } catch (error) {
      console.error('Error updating student:', error);
      setStudents(prev => prev.map(student => 
        student.id === id ? { ...student, ...updatedData } : student
      ));
    }
  };

  const deleteStudent = async (id) => {
    try {
      const { error } = await supabase
        .from('students_dgtutor_2024')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setStudents(prev => prev.filter(student => student.id !== id));
      setSessions(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      setStudents(prev => prev.filter(student => student.id !== id));
      setSessions(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
    }
  };

  // Session functions
  const updateSessions = async (studentId, month, dates) => {
    try {
      await supabase
        .from('sessions_dgtutor_2024')
        .delete()
        .eq('student_id', studentId)
        .eq('month_name', month);

      const sessionInserts = dates.map(date => {
        const isObject = typeof date === 'object';
        return {
          student_id: studentId,
          session_date: isObject ? date.date : date,
          month_name: month,
          is_paid: isObject ? date.paid : false
        };
      });

      if (sessionInserts.length > 0) {
        const { error } = await supabase
          .from('sessions_dgtutor_2024')
          .insert(sessionInserts);

        if (error) throw error;
      }

      setSessions(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [month]: dates
        }
      }));
    } catch (error) {
      console.error('Error updating sessions:', error);
      setSessions(prev => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [month]: dates
        }
      }));
    }
  };

  const markSessionAsPaid = async (studentId, month, date, isPaid = true) => {
    try {
      const { error } = await supabase
        .from('sessions_dgtutor_2024')
        .update({ is_paid: isPaid })
        .eq('student_id', studentId)
        .eq('month_name', month)
        .eq('session_date', date);

      if (error) throw error;

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
    } catch (error) {
      console.error('Error marking session as paid:', error);
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
    }
  };

  // User management functions
  const addUser = async (userData) => {
    try {
      const { data, error } = await supabase
        .from('users_dgtutor_2024')
        .insert([{
          ...userData,
          password_hash: userData.password
        }])
        .select()
        .single();

      if (error) throw error;

      setUsers(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding user:', error);
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };
      setUsers(prev => [...prev, newUser]);
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      const updateData = { ...updatedUser };
      if (updateData.password) {
        updateData.password_hash = updateData.password;
        delete updateData.password;
      }

      const { error } = await supabase
        .from('users_dgtutor_2024')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...updatedUser } : user
      ));
    } catch (error) {
      console.error('Error updating user:', error);
      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...updatedUser } : user
      ));
    }
  };

  const deleteUser = async (id) => {
    try {
      const { error } = await supabase
        .from('users_dgtutor_2024')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (error) {
      console.error('Error deleting user:', error);
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  // Subject management functions
  const addSubject = async (subject) => {
    try {
      const { error } = await supabase
        .from('subjects_dgtutor_2024')
        .insert([{ name: subject }]);

      if (error) throw error;

      setSubjects(prev => [...prev, subject].sort());
    } catch (error) {
      console.error('Error adding subject:', error);
      if (!subjects.includes(subject)) {
        setSubjects(prev => [...prev, subject].sort());
      }
    }
  };

  const deleteSubject = async (subject) => {
    try {
      const { error } = await supabase
        .from('subjects_dgtutor_2024')
        .delete()
        .eq('name', subject);

      if (error) throw error;

      setSubjects(prev => prev.filter(s => s !== subject));
    } catch (error) {
      console.error('Error deleting subject:', error);
      setSubjects(prev => prev.filter(s => s !== subject));
    }
  };

  const updateSubject = async (oldSubject, newSubject) => {
    try {
      const { error } = await supabase
        .from('subjects_dgtutor_2024')
        .update({ name: newSubject })
        .eq('name', oldSubject);

      if (error) throw error;

      setSubjects(prev => prev.map(s => s === oldSubject ? newSubject : s).sort());
      setStudents(prev => prev.map(student => 
        student.subject === oldSubject ? { ...student, subject: newSubject } : student
      ));
    } catch (error) {
      console.error('Error updating subject:', error);
      setSubjects(prev => prev.map(s => s === oldSubject ? newSubject : s).sort());
      setStudents(prev => prev.map(student => 
        student.subject === oldSubject ? { ...student, subject: newSubject } : student
      ));
    }
  };

  // Helper functions
  const getStudentSessions = (studentId) => {
    return sessions[studentId] || {};
  };

  const getTotalSessions = (studentId) => {
    const studentSessions = sessions[studentId] || {};
    return Object.values(studentSessions).reduce((total, dates) => total + dates.length, 0);
  };

  const getPaidSessions = (studentId) => {
    const studentSessions = sessions[studentId] || {};
    return Object.values(studentSessions).reduce((total, dates) => {
      return total + dates.filter(session => typeof session === 'object' && session.paid).length;
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

  const getTutors = () => {
    return users.filter(user => user.role === 'tutor' && user.status === 'active');
  };

  const getParents = () => {
    return users.filter(user => user.role === 'parent' && user.status === 'active');
  };

  const getMyChildren = (parentUsername) => {
    return students.filter(student => 
      student.parentUsername && 
      student.parentUsername.toLowerCase() === parentUsername.toLowerCase()
    );
  };

  const getChildProgress = (studentId) => {
    const totalSessions = getTotalSessions(studentId);
    const paidSessions = getPaidSessions(studentId);
    const unpaidSessions = getUnpaidSessions(studentId);
    const student = students.find(s => s.id === studentId);

    return {
      totalSessions,
      paidSessions,
      unpaidSessions,
      totalFee: totalSessions * (parseFloat(student?.feePerSession) || 0),
      paidAmount: paidSessions * (parseFloat(student?.feePerSession) || 0),
      unpaidAmount: unpaidSessions * (parseFloat(student?.feePerSession) || 0)
    };
  };

  return (
    <DataContext.Provider value={{
      students,
      sessions,
      users,
      subjects,
      currency,
      loading,
      setCurrency: updateCurrencyInDB,
      getCurrencySymbol,
      convertCurrency,
      formatCurrency,
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
      getParents,
      addSubject,
      deleteSubject,
      updateSubject,
      getMyChildren,
      getChildProgress
    }}>
      {children}
    </DataContext.Provider>
  );
};
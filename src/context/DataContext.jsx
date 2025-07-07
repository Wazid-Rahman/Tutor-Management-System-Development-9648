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
      console.log('Initializing data from database...');
      
      // Load all data from Supabase
      await Promise.all([
        loadUsers(),
        loadSubjects(),
        loadStudents(),
        loadSessions(),
        loadCurrencySettings()
      ]);
      
      console.log('Data initialized successfully from database');
    } catch (error) {
      console.error('Error initializing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users_dgtutor_2024')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setUsers(data || []);
      console.log('Users loaded from database:', data?.length || 0);
    } catch (error) {
      console.error('Error loading users:', error);
      setUsers([]);
    }
  };

  const loadSubjects = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects_dgtutor_2024')
        .select('*')
        .order('name');

      if (error) throw error;
      
      setSubjects(data?.map(subject => subject.name) || []);
      console.log('Subjects loaded from database:', data?.length || 0);
    } catch (error) {
      console.error('Error loading subjects:', error);
      setSubjects([]);
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
      
      const formattedStudents = data?.map(student => ({
        ...student,
        subject: student.subject?.name || '',
        tutor: student.tutor?.name || '',
        studentName: student.student_name,
        parentName: student.parent_name,
        parentUsername: student.parent_username,
        feePerSession: student.fee_per_session,
        lastPaid: student.last_paid
      })) || [];
      
      setStudents(formattedStudents);
      console.log('Students loaded from database:', formattedStudents.length);
    } catch (error) {
      console.error('Error loading students:', error);
      setStudents([]);
    }
  };

  const loadSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions_dgtutor_2024')
        .select('*')
        .order('session_date', { ascending: false });

      if (error) throw error;

      const groupedSessions = {};
      data?.forEach(session => {
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
      console.log('Sessions loaded from database:', data?.length || 0);
    } catch (error) {
      console.error('Error loading sessions:', error);
      setSessions({});
    }
  };

  const loadCurrencySettings = async () => {
    try {
      const { data, error } = await supabase
        .from('currency_settings_dgtutor_2024')
        .select('currency_code')
        .single();

      if (error) throw error;
      
      setCurrency(data?.currency_code || 'USD');
      console.log('Currency loaded from database:', data?.currency_code || 'USD');
    } catch (error) {
      console.error('Error loading currency settings:', error);
      setCurrency('USD');
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
      console.log('Currency updated in database:', newCurrency);
    } catch (error) {
      console.error('Error updating currency:', error);
      throw error;
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
      console.log('Student added to database:', formattedStudent.studentName);
      return formattedStudent;
    } catch (error) {
      console.error('Error adding student:', error);
      throw error;
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
      console.log('Student updated in database:', updatedData.studentName);
      return { ...updatedData, id };
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
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
      console.log('Student deleted from database:', id);
      return id;
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  };

  // Session functions
  const updateSessions = async (studentId, month, dates) => {
    try {
      // Delete existing sessions for this student and month
      await supabase
        .from('sessions_dgtutor_2024')
        .delete()
        .eq('student_id', studentId)
        .eq('month_name', month);

      // Insert new sessions
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
      console.log('Sessions updated in database:', studentId, month, dates.length);
      return { studentId, month, dates };
    } catch (error) {
      console.error('Error updating sessions:', error);
      throw error;
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
      
      // If marking as paid, also update the student's last_paid date
      if (isPaid) {
        const studentToUpdate = students.find(s => s.id === studentId);
        if (studentToUpdate) {
          await supabase
            .from('students_dgtutor_2024')
            .update({ last_paid: date })
            .eq('id', studentId);
            
          setStudents(prev => prev.map(student => 
            student.id === studentId ? { ...student, lastPaid: date } : student
          ));
        }
      }
      
      console.log('Session payment status updated:', studentId, month, date, isPaid);
      return { studentId, month, date, isPaid };
    } catch (error) {
      console.error('Error marking session as paid:', error);
      throw error;
    }
  };

  // User management functions
  const addUser = async (userData) => {
    try {
      // First, check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('users_dgtutor_2024')
        .select('id')
        .eq('username', userData.username.toLowerCase())
        .single();
        
      if (existingUser) {
        throw new Error(`Username "${userData.username}" is already taken. Please choose another username.`);
      }
      
      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is what we want
        throw checkError;
      }
      
      const newUserData = {
        name: userData.name,
        username: userData.username.toLowerCase(),
        email: userData.email || null,
        password_hash: userData.password,
        role: userData.role,
        status: userData.status,
        permissions: userData.permissions || {}
      };
      
      const { data, error } = await supabase
        .from('users_dgtutor_2024')
        .insert([newUserData])
        .select()
        .single();

      if (error) throw error;

      setUsers(prev => [...prev, data]);
      console.log('User added to database:', data.name);
      return data;
    } catch (error) {
      console.error('Error adding user:', error);
      throw error;
    }
  };

  const updateUser = async (id, updatedUser) => {
    try {
      // Check if username is being changed and if it's already taken
      if (updatedUser.username) {
        const currentUser = users.find(u => u.id === id);
        
        if (currentUser && currentUser.username !== updatedUser.username.toLowerCase()) {
          const { data: existingUser, error: checkError } = await supabase
            .from('users_dgtutor_2024')
            .select('id')
            .eq('username', updatedUser.username.toLowerCase())
            .single();
            
          if (existingUser) {
            throw new Error(`Username "${updatedUser.username}" is already taken. Please choose another username.`);
          }
          
          if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned" which is what we want
            throw checkError;
          }
        }
      }
      
      const updateData = { 
        name: updatedUser.name,
        username: updatedUser.username?.toLowerCase(),
        email: updatedUser.email || null,
        role: updatedUser.role,
        status: updatedUser.status,
        permissions: updatedUser.permissions || {}
      };
      
      if (updatedUser.password) {
        updateData.password_hash = updatedUser.password;
      }

      const { error } = await supabase
        .from('users_dgtutor_2024')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      setUsers(prev => prev.map(user => 
        user.id === id ? { ...user, ...updatedUser, username: updatedUser.username?.toLowerCase() } : user
      ));
      console.log('User updated in database:', updatedUser.name);
      return { ...updatedUser, id };
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };

  const deleteUser = async (id) => {
    try {
      // First check if this user is assigned as a tutor to any students
      const assignedStudents = students.filter(student => {
        const tutor = users.find(u => u.id === id);
        return student.tutor === tutor?.name;
      });
      
      if (assignedStudents.length > 0) {
        const studentNames = assignedStudents.map(s => s.studentName).join(', ');
        throw new Error(`Cannot delete this user because they are assigned as a tutor to: ${studentNames}`);
      }

      const { error } = await supabase
        .from('users_dgtutor_2024')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setUsers(prev => prev.filter(user => user.id !== id));
      console.log('User deleted from database:', id);
      return id;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

  // Subject management functions
  const addSubject = async (subject) => {
    try {
      // Check if subject already exists
      const { data: existingSubject, error: checkError } = await supabase
        .from('subjects_dgtutor_2024')
        .select('id')
        .eq('name', subject)
        .single();
        
      if (existingSubject) {
        throw new Error(`Subject "${subject}" already exists.`);
      }
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      const { data, error } = await supabase
        .from('subjects_dgtutor_2024')
        .insert([{ name: subject }])
        .select()
        .single();

      if (error) throw error;

      setSubjects(prev => [...prev, subject].sort());
      console.log('Subject added to database:', subject);
      return data;
    } catch (error) {
      console.error('Error adding subject:', error);
      throw error;
    }
  };

  const deleteSubject = async (subject) => {
    try {
      // Check if subject is used by any students
      const studentsWithSubject = students.filter(s => s.subject === subject);
      if (studentsWithSubject.length > 0) {
        const studentNames = studentsWithSubject.map(s => s.studentName).join(', ');
        throw new Error(`Cannot delete "${subject}" because it's assigned to: ${studentNames}`);
      }

      const { error } = await supabase
        .from('subjects_dgtutor_2024')
        .delete()
        .eq('name', subject);

      if (error) throw error;

      setSubjects(prev => prev.filter(s => s !== subject));
      console.log('Subject deleted from database:', subject);
      return subject;
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  };

  const updateSubject = async (oldSubject, newSubject) => {
    try {
      // Check if new subject name already exists
      if (oldSubject !== newSubject) {
        const { data: existingSubject, error: checkError } = await supabase
          .from('subjects_dgtutor_2024')
          .select('id')
          .eq('name', newSubject)
          .single();
          
        if (existingSubject) {
          throw new Error(`Subject "${newSubject}" already exists.`);
        }
        
        if (checkError && checkError.code !== 'PGRST116') {
          throw checkError;
        }
      }
      
      const { error } = await supabase
        .from('subjects_dgtutor_2024')
        .update({ name: newSubject })
        .eq('name', oldSubject);

      if (error) throw error;

      setSubjects(prev => prev.map(s => s === oldSubject ? newSubject : s).sort());
      
      // Update subject name in students
      const studentsToUpdate = students.filter(student => student.subject === oldSubject);
      for (const student of studentsToUpdate) {
        await updateStudent(student.id, { ...student, subject: newSubject });
      }
      
      console.log('Subject updated in database:', oldSubject, '->', newSubject);
      return { oldSubject, newSubject };
    } catch (error) {
      console.error('Error updating subject:', error);
      throw error;
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
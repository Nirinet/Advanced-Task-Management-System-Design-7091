import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
  setDoc
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  deleteUser as deleteAuthUser 
} from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useAuth } from './AuthContext';

const UserContext = createContext();

export const useUsers = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin, isEmployee } = useAuth();

  useEffect(() => {
    if (!user) {
      setUsers([]);
      setLoading(false);
      return;
    }

    // רק מנהלים ועובדים יכולים לראות את רשימת המשתמשים המלאה
    if (!isAdmin() && !isEmployee()) {
      setLoading(false);
      return;
    }

    const usersQuery = query(collection(db, 'profiles'));

    const unsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading users:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, isAdmin, isEmployee]);

  const getUsersByRole = (role) => {
    return users.filter(u => u.role === role);
  };

  const getEmployeesAndAdmins = () => {
    return users.filter(u => u.role === 'employee' || u.role === 'admin');
  };

  const getClients = () => {
    return users.filter(u => u.role === 'client');
  };

  const getUserById = (userId) => {
    return users.find(u => u.id === userId) || null;
  };

  const createUser = async (userData) => {
    try {
      // רק מנהלים יכולים ליצור עובדים
      if (userData.role === 'employee' && !isAdmin()) {
        throw new Error('Only administrators can create employees');
      }

      // יצירת המשתמש ב-Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password || Math.random().toString(36).slice(2, 10)
      );

      // יצירת פרופיל ב-Firestore
      const profileData = {
        email: userData.email,
        name: userData.name,
        role: userData.role,
        phone: userData.phone || null,
        createdAt: new Date()
      };

      await setDoc(doc(db, 'profiles', userCredential.user.uid), profileData);

      return { success: true, data: { id: userCredential.user.uid, ...profileData } };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, error: error.message };
    }
  };

  const updateUser = async (userId, updateData) => {
    try {
      const userRef = doc(db, 'profiles', userId);
      await updateDoc(userRef, updateData);

      return { success: true, data: updateData };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteUser = async (userId) => {
    try {
      // רק מנהלים יכולים למחוק משתמשים
      if (!isAdmin()) {
        throw new Error('Only administrators can delete users');
      }

      // מחיקת הפרופיל מ-Firestore
      await deleteDoc(doc(db, 'profiles', userId));

      // הערה: מחיקת המשתמש מ-Firebase Auth דורשת הרשאות Admin SDK
      // בסביבת פרודקשן תצטרך להגדיר Cloud Function למחיקה

      return { success: true };
    } catch (error) {
      console.error('Error deleting user:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    users,
    loading,
    getUsersByRole,
    getEmployeesAndAdmins,
    getClients,
    getUserById,
    createUser,
    updateUser,
    deleteUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
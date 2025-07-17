import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

const PriorityContext = createContext();

export const usePriorities = () => useContext(PriorityContext);

export const PriorityProvider = ({ children }) => {
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();

  useEffect(() => {
    if (!user) {
      setPriorities([]);
      setLoading(false);
      return;
    }

    const prioritiesQuery = query(
      collection(db, 'taskPriorities'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(prioritiesQuery, (snapshot) => {
      const prioritiesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPriorities(prioritiesData);
      setLoading(false);
    }, (error) => {
      console.error('Error loading priorities:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const createPriority = async (priorityData) => {
    try {
      // רק מנהלים יכולים ליצור עדיפויות
      if (!isAdmin()) {
        throw new Error('Only administrators can create priorities');
      }

      const docData = {
        ...priorityData,
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'taskPriorities'), docData);
      
      return { success: true, data: { id: docRef.id, ...docData } };
    } catch (error) {
      console.error('Error creating priority:', error);
      return { success: false, error: error.message };
    }
  };

  const updatePriority = async (priorityId, updateData) => {
    try {
      // רק מנהלים יכולים לעדכן עדיפויות
      if (!isAdmin()) {
        throw new Error('Only administrators can update priorities');
      }

      const priorityRef = doc(db, 'taskPriorities', priorityId);
      await updateDoc(priorityRef, updateData);

      return { success: true, data: updateData };
    } catch (error) {
      console.error('Error updating priority:', error);
      return { success: false, error: error.message };
    }
  };

  const deletePriority = async (priorityId) => {
    try {
      // רק מנהלים יכולים למחוק עדיפויות
      if (!isAdmin()) {
        throw new Error('Only administrators can delete priorities');
      }

      await deleteDoc(doc(db, 'taskPriorities', priorityId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting priority:', error);
      return { success: false, error: error.message };
    }
  };

  const getPriorityById = (priorityId) => {
    return priorities.find(priority => priority.id === priorityId) || null;
  };

  const value = {
    priorities,
    loading,
    createPriority,
    updatePriority,
    deletePriority,
    getPriorityById
  };

  return (
    <PriorityContext.Provider value={value}>
      {children}
    </PriorityContext.Provider>
  );
};
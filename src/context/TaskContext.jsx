import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTask, setCurrentTask] = useState(null);
  const { user, userRole, isAdmin, isEmployee, isClient } = useAuth();

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setCurrentTask(null);
      setLoading(false);
      return;
    }

    // נתונים מדומים למשימות
    const allMockTasks = [
      {
        id: '1',
        title: 'עיצוב ממשק משתמש',
        description: 'עיצוב ממשק משתמש מודרני למערכת ניהול המשימות',
        status: 'in_progress',
        priority: { id: '1', name: 'גבוהה', color: '#EF4444' },
        project: { id: '1', name: 'מערכת ניהול משימות' },
        project_id: '1',
        created_at: new Date().toISOString(),
        created_by: user.uid,
        task_assignees: [{ user_id: user.uid }]
      },
      {
        id: '2',
        title: 'פיתוח API',
        description: 'יצירת API לתקשורת בין הלקוח לשרת',
        status: 'new',
        priority: { id: '2', name: 'בינונית', color: '#F59E0B' },
        project: { id: '1', name: 'מערכת ניהול משימות' },
        project_id: '1',
        created_at: new Date().toISOString(),
        created_by: 'admin-123',
        task_assignees: [{ user_id: user.uid }]
      },
      {
        id: '3',
        title: 'בדיקות מערכת',
        description: 'ביצוע בדיקות מקיפות למערכת',
        status: 'completed',
        priority: { id: '3', name: 'נמוכה', color: '#10B981' },
        project: { id: '2', name: 'אתר תדמית' },
        project_id: '2',
        created_at: new Date().toISOString(),
        created_by: 'admin-123',
        task_assignees: [{ user_id: 'other-user' }]
      },
      {
        id: '4',
        title: 'תיעוד מערכת',
        description: 'כתיבת תיעוד טכני למערכת',
        status: 'in_progress',
        priority: { id: '2', name: 'בינונית', color: '#F59E0B' },
        project: { id: '3', name: 'מערכת CRM' },
        project_id: '3',
        created_at: new Date().toISOString(),
        created_by: user.uid,
        task_assignees: [{ user_id: user.uid }]
      }
    ];

    let filteredTasks;

    if (isAdmin() || isEmployee()) {
      // מנהלים ועובדים רואים את כל המשימות
      filteredTasks = allMockTasks;
    } else if (isClient()) {
      // לקוחות רואים רק משימות שמשוייכות לפרויקטים שלהם או שהם מוקצים אליהן
      filteredTasks = allMockTasks.filter(task => {
        // בדיקה אם המשימה שייכת לפרויקט של הלקוח
        const isProjectOwner = ['1', '3'].includes(task.project_id); // הפרויקטים של המשתמש הנוכחי
        // בדיקה אם הלקוח מוקצה למשימה
        const isAssigned = task.task_assignees?.some(assignee => assignee.user_id === user.uid);
        
        return isProjectOwner || isAssigned;
      });
    } else {
      filteredTasks = [];
    }

    setTasks(filteredTasks);
    setLoading(false);
  }, [user, userRole, isAdmin, isEmployee, isClient]);

  const createTask = async (taskData) => {
    try {
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTasks(prev => [newTask, ...prev]);
      return { success: true, data: newTask };
    } catch (error) {
      console.error('Error creating task:', error);
      return { success: false, error: error.message };
    }
  };

  const updateTask = async (taskId, updateData) => {
    try {
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId
            ? { ...task, ...updateData, updatedAt: new Date().toISOString() }
            : task
        )
      );

      if (currentTask?.id === taskId) {
        setCurrentTask(prev => ({ ...prev, ...updateData }));
      }

      return { success: true, data: updateData };
    } catch (error) {
      console.error('Error updating task:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteTask = async (taskId) => {
    try {
      // רק מנהלים ועובדים יכולים למחוק משימות
      if (!isAdmin() && !isEmployee()) {
        throw new Error('Only administrators and employees can delete tasks');
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));

      if (currentTask?.id === taskId) {
        setCurrentTask(null);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      return { success: false, error: error.message };
    }
  };

  const getTaskById = (taskId) => {
    const task = tasks.find(task => task.id === taskId);
    
    // לקוחות יכולים לראות רק משימות שמשוייכות לפרויקטים שלהם או שהם מוקצים אליהן
    if (isClient() && task) {
      const isProjectOwner = ['1', '3'].includes(task.project_id);
      const isAssigned = task.task_assignees?.some(assignee => assignee.user_id === user.uid);
      
      if (!isProjectOwner && !isAssigned) {
        return null;
      }
    }
    
    return task || null;
  };

  const setActiveTask = (taskId) => {
    const task = getTaskById(taskId);
    setCurrentTask(task);
    return task;
  };

  const loadTasks = async (projectId = null) => {
    // פונקציה זו כבר מטופלת ב-useEffect
    return () => {};
  };

  const value = {
    tasks,
    loading,
    currentTask,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    getTaskById,
    setActiveTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};
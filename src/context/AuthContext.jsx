import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // בדיקה אם יש משתמש בלוקל סטורג'
    const storedUser = localStorage.getItem('mockUser');
    
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setUserRole(parsedUser.role || 'client');
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      console.log('Mock sign in:', email);
      
      // בדיקה אם זה המנהל הראשי
      let role = 'client'; // ברירת מחדל
      
      if (email === 'admin@taskmaster.com') {
        role = 'admin';
      } else if (email === 'employee@taskmaster.com') {
        role = 'employee';
      }
      
      // יצירת משתמש מדומה
      const mockUser = {
        uid: email === 'admin@taskmaster.com' ? 'admin-123' : Date.now().toString(),
        email: email,
        role: role,
        name: email === 'admin@taskmaster.com' ? 'מנהל מערכת' : 
              email === 'employee@taskmaster.com' ? 'עובד מערכת' : 'לקוח',
        emailVerified: true
      };
      
      // שמירה בלוקל סטורג'
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setUserRole(role);
      
      return { success: true, data: mockUser };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'שגיאה בהתחברות' };
    }
  };

  const signUp = async (email, password, role = 'client') => {
    try {
      console.log('Mock sign up:', email, role);
      
      // יצירת משתמש מדומה
      const mockUser = {
        uid: Date.now().toString(),
        email: email,
        role: role,
        name: email,
        emailVerified: true
      };
      
      // שמירה בלוקל סטורג'
      localStorage.setItem('mockUser', JSON.stringify(mockUser));
      
      setUser(mockUser);
      setUserRole(role);
      
      return { success: true, data: mockUser };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'שגיאה בהרשמה' };
    }
  };

  const signOut = async () => {
    try {
      console.log('Mock sign out');
      
      // מחיקה מהלוקל סטורג'
      localStorage.removeItem('mockUser');
      
      setUser(null);
      setUserRole(null);
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  };

  // פונקציה לשינוי תפקיד (רק למנהלים)
  const changeUserRole = async (newRole) => {
    try {
      if (!isAdmin()) {
        throw new Error('Only administrators can change roles');
      }
      
      const updatedUser = { ...user, role: newRole };
      localStorage.setItem('mockUser', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      setUserRole(newRole);
      
      return { success: true };
    } catch (error) {
      console.error('Change role error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    changeUserRole,
    isAuthenticated: !!user,
    isAdmin: () => userRole === 'admin',
    isEmployee: () => userRole === 'employee',
    isClient: () => userRole === 'client'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
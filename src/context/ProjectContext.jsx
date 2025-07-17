import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const useProjects = () => useContext(ProjectContext);

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentProject, setCurrentProject] = useState(null);
  const { user, userRole, isAdmin, isEmployee, isClient } = useAuth();

  useEffect(() => {
    if (!user) {
      setProjects([]);
      setCurrentProject(null);
      setLoading(false);
      return;
    }

    // נתונים מדומים לפרויקטים
    const allMockProjects = [
      {
        id: '1',
        name: 'מערכת ניהול משימות',
        description: 'פיתוח מערכת לניהול משימות ופרויקטים',
        status: 'active',
        client_id: user.uid, // משוייך למשתמש הנוכחי
        client: { name: user.name || user.email, email: user.email },
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'admin-123'
      },
      {
        id: '2',
        name: 'אתר תדמית',
        description: 'עיצוב ופיתוח אתר תדמית לחברה',
        status: 'completed',
        client_id: 'other-client-456',
        client: { name: 'חברת XYZ', email: 'client2@example.com' },
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'admin-123'
      },
      {
        id: '3',
        name: 'מערכת CRM',
        description: 'פיתוח מערכת ניהול לקוחות',
        status: 'active',
        client_id: user.uid, // משוייך למשתמש הנוכחי
        client: { name: user.name || user.email, email: user.email },
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        created_by: 'admin-123'
      }
    ];

    let filteredProjects;

    if (isAdmin() || isEmployee()) {
      // מנהלים ועובדים רואים את כל הפרויקטים
      filteredProjects = allMockProjects;
    } else if (isClient()) {
      // לקוחות רואים רק את הפרויקטים שמשוייכים אליהם
      filteredProjects = allMockProjects.filter(project => project.client_id === user.uid);
    } else {
      filteredProjects = [];
    }

    setProjects(filteredProjects);
    setLoading(false);
  }, [user, userRole, isAdmin, isEmployee, isClient]);

  const createProject = async (projectData) => {
    try {
      // רק מנהלים ועובדים יכולים ליצור פרויקטים
      if (!isAdmin() && !isEmployee()) {
        throw new Error('Only administrators and employees can create projects');
      }

      const newProject = {
        id: Date.now().toString(),
        ...projectData,
        createdBy: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setProjects(prev => [newProject, ...prev]);
      return { success: true, data: newProject };
    } catch (error) {
      console.error('Error creating project:', error);
      return { success: false, error: error.message };
    }
  };

  const updateProject = async (projectId, updateData) => {
    try {
      // רק מנהלים ועובדים יכולים לעדכן פרויקטים
      if (!isAdmin() && !isEmployee()) {
        throw new Error('Only administrators and employees can update projects');
      }

      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString()
      };

      setProjects(prev =>
        prev.map(project =>
          project.id === projectId ? { ...project, ...updatedData } : project
        )
      );

      if (currentProject?.id === projectId) {
        setCurrentProject(prev => ({ ...prev, ...updatedData }));
      }

      return { success: true, data: updatedData };
    } catch (error) {
      console.error('Error updating project:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteProject = async (projectId) => {
    try {
      // רק מנהלים יכולים למחוק פרויקטים
      if (!isAdmin()) {
        throw new Error('Only administrators can delete projects');
      }

      setProjects(prev => prev.filter(project => project.id !== projectId));

      if (currentProject?.id === projectId) {
        setCurrentProject(null);
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting project:', error);
      return { success: false, error: error.message };
    }
  };

  const getProjectById = (projectId) => {
    const project = projects.find(project => project.id === projectId);
    
    // לקוחות יכולים לראות רק פרויקטים שמשוייכים אליהם
    if (isClient() && project && project.client_id !== user.uid) {
      return null;
    }
    
    return project || null;
  };

  const setActiveProject = (projectId) => {
    const project = getProjectById(projectId);
    setCurrentProject(project);
    return project;
  };

  const value = {
    projects,
    loading,
    currentProject,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
    setActiveProject,
  };

  return (
    <ProjectContext.Provider value={value}>
      {children}
    </ProjectContext.Provider>
  );
};
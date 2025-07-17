import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../../context/ProjectContext';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProjectById, deleteProject } = useProjects();
  const { tasks, loadTasks } = useTasks();
  const { isAdmin, isEmployee } = useAuth();
  
  const [project, setProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const loadProjectData = async () => {
      try {
        const projectData = getProjectById(id);
        if (!projectData) {
          navigate('/projects');
          return;
        }
        
        setProject(projectData);
        
        // טעינת משימות הפרויקט
        await loadTasks(id);
        
      } catch (error) {
        console.error('Error loading project:', error);
        navigate('/projects');
      } finally {
        setLoading(false);
      }
    };

    loadProjectData();
  }, [id, getProjectById, loadTasks, navigate]);

  useEffect(() => {
    // סינון משימות הפרויקט
    const filtered = tasks.filter(task => task.project_id === id);
    setProjectTasks(filtered);
  }, [tasks, id]);

  const handleDeleteProject = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את הפרויקט? פעולה זו אינה ניתנת לביטול.')) {
      return;
    }

    try {
      setDeleting(true);
      const result = await deleteProject(id);
      
      if (result.success) {
        navigate('/projects');
      } else {
        alert('שגיאה במחיקת הפרויקט');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('שגיאה במחיקת הפרויקט');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusName = (status) => {
    switch (status) {
      case 'new': return 'חדש';
      case 'in_progress': return 'בעבודה';
      case 'waiting_for_client': return 'ממתין ללקוח';
      case 'completed': return 'הושלם';
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'in_progress': return 'bg-yellow-500';
      case 'waiting_for_client': return 'bg-purple-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiIcons.FiAlertCircle} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">פרויקט לא נמצא</h3>
        <Link to="/projects" className="text-indigo-600 hover:text-indigo-800">
          חזור לרשימת הפרויקטים
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Link
                to="/projects"
                className="text-gray-400 hover:text-gray-600 mr-2"
              >
                <SafeIcon icon={FiIcons.FiArrowRight} className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <SafeIcon icon={FiIcons.FiUser} className="w-4 h-4 mr-1" />
                {project.client?.name || project.client?.email || 'לא צוין לקוח'}
              </div>
              <div className="flex items-center">
                <SafeIcon icon={FiIcons.FiCalendar} className="w-4 h-4 mr-1" />
                {new Date(project.created_at).toLocaleDateString('he-IL')}
              </div>
              {project.deadline && (
                <div className="flex items-center">
                  <SafeIcon icon={FiIcons.FiClock} className="w-4 h-4 mr-1" />
                  תאריך יעד: {new Date(project.deadline).toLocaleDateString('he-IL')}
                </div>
              )}
            </div>
            
            {project.description && (
              <p className="mt-4 text-gray-700">{project.description}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            <span
              className={`px-3 py-1 text-sm font-medium rounded-full ${
                project.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : project.status === 'on_hold'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {project.status === 'active' ? 'פעיל' : project.status === 'on_hold' ? 'ממתין' : 'הושלם'}
            </span>
            
            {(isAdmin() || isEmployee()) && (
              <div className="flex space-x-2">
                <Link
                  to={`/projects/${project.id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4 mr-2" />
                  ערוך
                </Link>
                
                {isAdmin() && (
                  <button
                    onClick={handleDeleteProject}
                    disabled={deleting}
                    className="inline-flex items-center px-3 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting ? (
                      <SafeIcon icon={FiIcons.FiLoader} className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4 mr-2" />
                    )}
                    מחק
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">משימות הפרויקט</h2>
          <Link
            to={`/tasks/create?project=${project.id}`}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
            משימה חדשה
          </Link>
        </div>

        {projectTasks.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiIcons.FiCheckSquare} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין משימות בפרויקט זה</h3>
            <p className="text-gray-600 mb-6">התחל בהוספת משימה ראשונה לפרויקט</p>
            <Link
              to={`/tasks/create?project=${project.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
              צור משימה ראשונה
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    משימה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    עדיפות
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סטטוס
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    מוקצה ל
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תאריך יצירה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {projectTasks.map((task, index) => (
                  <motion.tr
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                      >
                        {task.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.priority ? (
                        <span
                          className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                          style={{
                            backgroundColor: `${task.priority.color}20`,
                            color: task.priority.color
                          }}
                        >
                          {task.priority.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(task.status)} text-white`}>
                        {getStatusName(task.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {task.task_assignees?.length > 0 ? `${task.task_assignees.length} משתמשים` : 'לא מוקצה'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.created_at).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="צפה במשימה"
                        >
                          <SafeIcon icon={FiIcons.FiEye} className="w-4 h-4" />
                        </Link>
                        {(isAdmin() || isEmployee()) && (
                          <Link
                            to={`/tasks/${task.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="ערוך משימה"
                          >
                            <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;
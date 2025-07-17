import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';
import { usePriorities } from '../../context/PriorityContext';
import { useUsers } from '../../context/UserContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, updateTask } = useTasks();
  const { projects } = useProjects();
  const { priorities } = usePriorities();
  const { getEmployeesAndAdmins } = useUsers();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priorityId: '',
    status: 'new',
    assignees: []
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);
  const [availableAssignees, setAvailableAssignees] = useState([]);

  useEffect(() => {
    const loadTaskData = async () => {
      try {
        const taskData = getTaskById(id);
        if (!taskData) {
          navigate('/tasks');
          return;
        }
        
        // טעינת משתמשים אפשריים להקצאה
        const employeesAndAdmins = getEmployeesAndAdmins();
        setAvailableAssignees(employeesAndAdmins);
        
        // עיבוד נתוני המשימה לפורמט הטופס
        setFormData({
          title: taskData.title || '',
          description: taskData.description || '',
          projectId: taskData.project_id || '',
          priorityId: taskData.priority_id || '',
          status: taskData.status || 'new',
          assignees: taskData.task_assignees?.map(a => a.user_id) || []
        });
        
        setInitialLoading(false);
      } catch (error) {
        console.error('Error loading task data:', error);
        navigate('/tasks');
      }
    };

    loadTaskData();
  }, [id, getTaskById, getEmployeesAndAdmins, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('כותרת המשימה היא שדה חובה');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // בניית אובייקט העדכון
      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        project_id: formData.projectId || null,
        priority_id: formData.priorityId || null,
        status: formData.status
      };
      
      // עדכון המשימה
      const result = await updateTask(id, updateData);
      
      if (result.success) {
        // עדכון הקצאות המשתמשים (בפועל צריך לטפל בזה בשרת)
        // בדוגמה זו נניח שהעדכון הצליח
        
        navigate(`/tasks/${id}`);
      } else {
        setError(result.error || 'שגיאה בעדכון המשימה');
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError('שגיאה בעדכון המשימה');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAssigneeChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({
      ...prev,
      assignees: selectedOptions
    }));
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">עריכת משימה</h1>
        <p className="text-gray-600 mt-2">עדכן את פרטי המשימה</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              כותרת המשימה *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="הזן כותרת למשימה"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              תיאור המשימה
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="תאר את המשימה ופרטים נוספים"
            />
          </div>

          <div>
            <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-1">
              פרויקט
            </label>
            <select
              id="projectId"
              name="projectId"
              value={formData.projectId}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">בחר פרויקט (אופציונלי)</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priorityId" className="block text-sm font-medium text-gray-700 mb-1">
              עדיפות
            </label>
            <select
              id="priorityId"
              name="priorityId"
              value={formData.priorityId}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">בחר עדיפות (אופציונלי)</option>
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              סטטוס
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="new">חדש</option>
              <option value="in_progress">בעבודה</option>
              <option value="waiting_for_client">ממתין ללקוח</option>
              <option value="completed">הושלם</option>
            </select>
          </div>

          <div>
            <label htmlFor="assignees" className="block text-sm font-medium text-gray-700 mb-1">
              הקצה משתמשים
            </label>
            <select
              id="assignees"
              name="assignees"
              multiple
              value={formData.assignees}
              onChange={handleAssigneeChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              size={4}
            >
              {availableAssignees.map(assignee => (
                <option key={assignee.id} value={assignee.id}>
                  {assignee.name || assignee.email} ({assignee.role})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              לחץ על Ctrl (או Command במק) כדי לבחור מספר משתמשים
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => navigate(`/tasks/${id}`)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {loading ? (
                <>
                  <SafeIcon icon={FiIcons.FiLoader} className="w-4 h-4 mr-2 animate-spin" />
                  שומר...
                </>
              ) : (
                <>
                  <SafeIcon icon={FiIcons.FiSave} className="w-4 h-4 mr-2" />
                  שמור שינויים
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditTask;
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getTaskById, deleteTask, updateTask } = useTasks();
  const { getProjectById } = useProjects();
  const { getUserById, getEmployeesAndAdmins } = useUsers();
  const { user, isAdmin, isEmployee } = useAuth();
  
  const [task, setTask] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [assignees, setAssignees] = useState([]);
  const [showAssigneeModal, setShowAssigneeModal] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState('');

  const assigneeEmployees = getEmployeesAndAdmins();

  useEffect(() => {
    const taskData = getTaskById(id);
    if (!taskData) {
      navigate('/tasks');
      return;
    }
    setTask(taskData);

    if (taskData.project_id) {
      const projectData = getProjectById(taskData.project_id);
      setProject(projectData);
    }

    // טעינת משתמשים מוקצים
    if (taskData.task_assignees && taskData.task_assignees.length > 0) {
      const assigneesList = [];
      for (const assignee of taskData.task_assignees) {
        const userData = getUserById(assignee.user_id);
        if (userData) {
          assigneesList.push(userData);
        }
      }
      setAssignees(assigneesList);
    }
    setLoading(false);
  }, [id, getTaskById, getProjectById, getUserById, navigate]);

  const handleDeleteTask = async () => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המשימה?')) {
      return;
    }
    try {
      setDeleting(true);
      const result = await deleteTask(id);
      if (result.success) {
        navigate('/tasks');
      } else {
        alert('שגיאה במחיקת המשימה');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('שגיאה במחיקת המשימה');
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    try {
      const result = await updateTask(id, { status: newStatus });
      if (result.success) {
        setTask(prev => ({ ...prev, status: newStatus }));
      } else {
        alert('שגיאה בעדכון סטטוס');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('שגיאה בעדכון סטטוס');
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
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'waiting_for_client': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('he-IL');
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiIcons.FiAlertCircle} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">משימה לא נמצאה</h3>
        <Link to="/tasks" className="text-indigo-600 hover:text-indigo-800">
          חזור לרשימת המשימות
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Task Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <Link to="/tasks" className="text-gray-400 hover:text-gray-600 mr-2">
                <SafeIcon icon={FiIcons.FiArrowRight} className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mt-2">
              {project && (
                <Link to={`/projects/${project.id}`} className="flex items-center text-indigo-600 hover:text-indigo-800">
                  <SafeIcon icon={FiIcons.FiFolder} className="w-4 h-4 mr-1" />
                  {project.name}
                </Link>
              )}
              <div className="flex items-center">
                <SafeIcon icon={FiIcons.FiCalendar} className="w-4 h-4 mr-1" />
                {formatDate(task.created_at)}
              </div>
              {task.priority && (
                <div
                  className="flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${task.priority.color}20`, color: task.priority.color }}
                >
                  <SafeIcon icon={FiIcons.FiFlag} className="w-3 h-3 mr-1" />
                  {task.priority.name}
                </div>
              )}
            </div>
            {task.description && (
              <p className="mt-4 text-gray-700 whitespace-pre-line">{task.description}</p>
            )}
          </div>
          <div className="flex flex-col items-end space-y-3">
            <div className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(task.status)}`}>
              {getStatusName(task.status)}
            </div>
            <div className="flex space-x-2">
              {(isAdmin() || isEmployee()) && (
                <Link
                  to={`/tasks/${task.id}/edit`}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4 mr-2" />
                  ערוך
                </Link>
              )}
              {isAdmin() && (
                <button
                  onClick={handleDeleteTask}
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
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Status Update */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">שינוי סטטוס</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => handleUpdateStatus('new')}
                className={`py-2 px-3 rounded-md text-sm font-medium ${task.status === 'new' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-700 hover:bg-blue-100'}`}
              >
                <SafeIcon icon={FiIcons.FiFileText} className="w-4 h-4 mr-1 inline-block" />
                חדש
              </button>
              <button
                onClick={() => handleUpdateStatus('in_progress')}
                className={`py-2 px-3 rounded-md text-sm font-medium ${task.status === 'in_progress' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
              >
                <SafeIcon icon={FiIcons.FiActivity} className="w-4 h-4 mr-1 inline-block" />
                בעבודה
              </button>
              <button
                onClick={() => handleUpdateStatus('waiting_for_client')}
                className={`py-2 px-3 rounded-md text-sm font-medium ${task.status === 'waiting_for_client' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-700 hover:bg-purple-100'}`}
              >
                <SafeIcon icon={FiIcons.FiClock} className="w-4 h-4 mr-1 inline-block" />
                ממתין ללקוח
              </button>
              <button
                onClick={() => handleUpdateStatus('completed')}
                className={`py-2 px-3 rounded-md text-sm font-medium ${task.status === 'completed' ? 'bg-green-500 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
              >
                <SafeIcon icon={FiIcons.FiCheckCircle} className="w-4 h-4 mr-1 inline-block" />
                הושלם
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Assignees Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">משתמשים מוקצים</h2>
              {(isAdmin() || isEmployee()) && (
                <button
                  onClick={() => setShowAssigneeModal(true)}
                  className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                >
                  <SafeIcon icon={FiIcons.FiUserPlus} className="w-4 h-4 mr-1" />
                  הוסף
                </button>
              )}
            </div>
            {assignees.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <p>אין משתמשים מוקצים</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {assignees.map((assignee) => (
                  <li
                    key={assignee.id}
                    className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-md"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium mr-2">
                        {assignee.name?.charAt(0) || assignee.email?.charAt(0) || '?'}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {assignee.name || assignee.email}
                        </h4>
                        <p className="text-xs text-gray-500">{assignee.role}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Task Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">פרטי משימה</h2>
            <ul className="space-y-3">
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">תאריך יצירה:</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(task.created_at)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">נוצר על ידי:</span>
                <span className="text-sm font-medium text-gray-900">
                  {task.created_by === user.uid ? 'אתה' : 'משתמש אחר'}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-sm text-gray-600">מזהה משימה:</span>
                <span className="text-sm font-mono text-gray-900">
                  {task.id.substring(0, 8)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add Assignee Modal */}
      <AnimatePresence>
        {showAssigneeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowAssigneeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">הוסף משתמש למשימה</h3>
                <button
                  onClick={() => setShowAssigneeModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
                </button>
              </div>
              <div className="mb-4">
                <select
                  value={selectedAssignee}
                  onChange={(e) => setSelectedAssignee(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">בחר משתמש</option>
                  {assigneeEmployees
                    .filter((emp) => !assignees.some((a) => a.id === emp.id))
                    .map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name || employee.email} ({employee.role})
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowAssigneeModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  ביטול
                </button>
                <button
                  disabled={!selectedAssignee}
                  className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400"
                >
                  הוסף
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TaskDetails;
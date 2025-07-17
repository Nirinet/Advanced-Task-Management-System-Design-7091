import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import { useProjects } from '../../context/ProjectContext';
import { usePriorities } from '../../context/PriorityContext';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Tasks = () => {
  const { tasks, loading } = useTasks();
  const { projects } = useProjects();
  const { priorities } = usePriorities();
  const { user, isAdmin, isEmployee } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [filteredTasks, setFilteredTasks] = useState([]);
  
  // פילטור המשימות בהתאם לסינונים
  useEffect(() => {
    let filtered = [...tasks];
    
    // חיפוש לפי כותרת או תיאור
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // סינון לפי סטטוס
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    // סינון לפי עדיפות
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority_id === priorityFilter);
    }
    
    // סינון לפי פרויקט
    if (projectFilter !== 'all') {
      filtered = filtered.filter(task => task.project_id === projectFilter);
    }
    
    // סינון לפי משתמש מוקצה
    if (assigneeFilter === 'me') {
      filtered = filtered.filter(task => 
        task.task_assignees && task.task_assignees.some(a => a.user_id === user.id)
      );
    } else if (assigneeFilter === 'unassigned') {
      filtered = filtered.filter(task => 
        !task.task_assignees || task.task_assignees.length === 0
      );
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, priorityFilter, projectFilter, assigneeFilter, user.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

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

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">משימות</h1>
          <p className="text-gray-600 mt-2">נהל את כל המשימות שלך במקום אחד</p>
        </div>
        
        <Link
          to="/tasks/create"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
          משימה חדשה
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              חיפוש
            </label>
            <div className="relative">
              <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חפש משימות..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              סטטוס
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">כל הסטטוסים</option>
              <option value="new">חדש</option>
              <option value="in_progress">בעבודה</option>
              <option value="waiting_for_client">ממתין ללקוח</option>
              <option value="completed">הושלם</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              עדיפות
            </label>
            <select
              id="priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">כל העדיפויות</option>
              {priorities.map(priority => (
                <option key={priority.id} value={priority.id}>
                  {priority.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              פרויקט
            </label>
            <select
              id="project"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">כל הפרויקטים</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
              מוקצה ל
            </label>
            <select
              id="assignee"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">הכל</option>
              <option value="me">המשימות שלי</option>
              <option value="unassigned">לא מוקצה</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiIcons.FiCheckSquare} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין משימות להצגה</h3>
          <p className="text-gray-600 mb-6">
            {tasks.length === 0 ? 'עדיין לא נוצרו משימות במערכת' : 'לא נמצאו משימות התואמות לחיפוש'}
          </p>
          {tasks.length === 0 && (
            <Link
              to="/tasks/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
              צור משימה ראשונה
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    משימה
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פרויקט
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
                {filteredTasks.map((task, index) => (
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
                      {task.description && (
                        <p className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                          {task.description}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {task.project ? (
                        <Link
                          to={`/projects/${task.project.id}`}
                          className="text-sm text-gray-600 hover:text-gray-900"
                        >
                          {task.project.name}
                        </Link>
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
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
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          task.status
                        )} text-white`}
                      >
                        {getStatusName(task.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {task.task_assignees?.length > 0
                        ? `${task.task_assignees.length} משתמשים`
                        : 'לא מוקצה'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(task.created_at).toLocaleDateString('he-IL')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/tasks/${task.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="צפה במשימה"
                        >
                          <SafeIcon icon={FiIcons.FiEye} className="w-5 h-5" />
                        </Link>
                        
                        {(isAdmin() || isEmployee() || task.created_by === user.id) && (
                          <Link
                            to={`/tasks/${task.id}/edit`}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="ערוך משימה"
                          >
                            <SafeIcon icon={FiIcons.FiEdit} className="w-5 h-5" />
                          </Link>
                        )}
                        
                        {(isAdmin() || isEmployee()) && (
                          <Link
                            to={`/tasks/${task.id}`}
                            className="text-green-600 hover:text-green-900"
                            title="התחל טיימר"
                          >
                            <SafeIcon icon={FiIcons.FiClock} className="w-5 h-5" />
                          </Link>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
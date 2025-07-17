import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../../context/ProjectContext';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Projects = () => {
  const { projects, loading } = useProjects();
  const { isAdmin, isEmployee, isClient } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredProjects, setFilteredProjects] = useState([]);

  useEffect(() => {
    let filtered = projects;

    // חיפוש
    if (searchTerm) {
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // סינון לפי סטטוס
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    setFilteredProjects(filtered);
  }, [projects, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isClient() ? 'הפרויקטים שלי' : 'פרויקטים'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isClient() 
              ? 'צפה בפרויקטים שמשוייכים אליך' 
              : 'נהל את כל הפרויקטים במקום אחד'
            }
          </p>
        </div>
        
        {/* רק מנהלים ועובדים יכולים ליצור פרויקטים */}
        {(isAdmin() || isEmployee()) && (
          <Link
            to="/projects/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
            פרויקט חדש
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                placeholder="חפש פרויקטים..."
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
              <option value="active">פעיל</option>
              <option value="on_hold">ממתין</option>
              <option value="completed">הושלם</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiIcons.FiFolder} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין פרויקטים להצגה</h3>
          <p className="text-gray-600 mb-6">
            {projects.length === 0 
              ? (isClient() 
                  ? 'עדיין לא שוייכו אליך פרויקטים' 
                  : 'עדיין לא נוצרו פרויקטים במערכת'
                )
              : 'לא נמצאו פרויקטים התואמים לחיפוש'
            }
          </p>
          {(isAdmin() || isEmployee()) && projects.length === 0 && (
            <Link
              to="/projects/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
              צור פרויקט ראשון
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <Link
                      to={`/projects/${project.id}`}
                      className="text-lg font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                    >
                      {project.name}
                    </Link>
                    <p className="text-sm text-gray-600 mt-1">
                      {project.client?.name || project.client?.email || 'לא צוין לקוח'}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      project.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : project.status === 'on_hold'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {project.status === 'active' ? 'פעיל' : project.status === 'on_hold' ? 'ממתין' : 'הושלם'}
                  </span>
                </div>

                {project.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <SafeIcon icon={FiIcons.FiCalendar} className="w-4 h-4 mr-1" />
                    {new Date(project.createdAt).toLocaleDateString('he-IL')}
                  </div>
                  {project.deadline && (
                    <div className="flex items-center">
                      <SafeIcon icon={FiIcons.FiClock} className="w-4 h-4 mr-1" />
                      {new Date(project.deadline).toLocaleDateString('he-IL')}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Link
                    to={`/projects/${project.id}`}
                    className="text-indigo-600 hover:text-indigo-900 font-medium text-sm"
                  >
                    צפה בפרויקט
                  </Link>
                  
                  {/* רק מנהלים ועובדים יכולים לערוך */}
                  {(isAdmin() || isEmployee()) && (
                    <div className="flex space-x-2">
                      <Link
                        to={`/projects/${project.id}/edit`}
                        className="text-gray-400 hover:text-gray-600"
                        title="ערוך פרויקט"
                      >
                        <SafeIcon icon={FiIcons.FiEdit} className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
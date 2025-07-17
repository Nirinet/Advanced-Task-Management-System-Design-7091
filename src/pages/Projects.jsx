import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiFolder, FiCalendar, FiUser } from 'react-icons/fi';

const Projects = () => {
  const mockProjects = [
    {
      id: 1,
      name: 'אתר החברה החדש',
      description: 'פיתוח אתר תדמיתי מודרני עם עיצוב רספונסיבי',
      status: 'פעיל',
      progress: 75,
      client: 'חברת ABC',
      startDate: '2024-01-01',
      endDate: '2024-03-01',
      teamSize: 4
    },
    {
      id: 2,
      name: 'מערכת CRM',
      description: 'בניית מערכת ניהול לקוחות מתקדמת',
      status: 'פעיל',
      progress: 45,
      client: 'חברת XYZ',
      startDate: '2023-12-15',
      endDate: '2024-04-15',
      teamSize: 6
    },
    {
      id: 3,
      name: 'אפליקציית מובייל',
      description: 'פיתוח אפליקציה לניהול משימות אישיות',
      status: 'הושלם',
      progress: 100,
      client: 'פרויקט פנימי',
      startDate: '2023-10-01',
      endDate: '2023-12-31',
      teamSize: 3
    },
    {
      id: 4,
      name: 'מערכת BI',
      description: 'פיתוח דשבורדים לניתוח נתונים עסקיים',
      status: 'בהמתנה',
      progress: 15,
      client: 'חברת DEF',
      startDate: '2024-02-01',
      endDate: '2024-06-01',
      teamSize: 5
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'פעיל': return 'bg-green-100 text-green-800';
      case 'הושלם': return 'bg-blue-100 text-blue-800';
      case 'בהמתנה': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">פרויקטים</h1>
          <p className="text-gray-600 mt-2">נהל את כל הפרויקטים שלך במקום אחד</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <FiPlus className="w-4 h-4 mr-2" />
          פרויקט חדש
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <FiFolder className="w-8 h-8 text-indigo-600 ml-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.name}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>
            
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">התקדמות</span>
                <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FiUser className="w-4 h-4 ml-1" />
                  <span>לקוח:</span>
                </div>
                <span className="font-medium text-gray-900">{project.client}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FiCalendar className="w-4 h-4 ml-1" />
                  <span>תאריך יעד:</span>
                </div>
                <span className="font-medium text-gray-900">{project.endDate}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FiUser className="w-4 h-4 ml-1" />
                  <span>חברי צוות:</span>
                </div>
                <span className="font-medium text-gray-900">{project.teamSize}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button className="w-full px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors">
                צפה בפרויקט
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
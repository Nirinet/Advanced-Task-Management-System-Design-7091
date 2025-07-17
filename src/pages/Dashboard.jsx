import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';

const Dashboard = () => {
  // מידע מדומה למשימות אחרונות
  const mockRecentTasks = [
    {
      id: 1,
      title: 'עיצוב דף הבית',
      project: { name: 'אתר החברה' },
      status: 'בעבודה'
    },
    {
      id: 2,
      title: 'פיתוח API',
      project: { name: 'מערכת CRM' },
      status: 'חדש'
    },
    {
      id: 3,
      title: 'בדיקות איכות',
      project: { name: 'אפליקציה' },
      status: 'הושלם'
    },
    {
      id: 4,
      title: 'תיעוד מערכת',
      project: { name: 'פרויקט A' },
      status: 'בעבודה'
    }
  ];

  // נתונים סטטיסטיים מדומים
  const stats = [
    {
      icon: FiIcons.FiFolder,
      label: 'פרויקטים פעילים',
      value: '3',
      color: 'bg-blue-500'
    },
    {
      icon: FiIcons.FiCheckSquare,
      label: 'משימות פתוחות',
      value: '12',
      color: 'bg-green-500'
    },
    {
      icon: FiIcons.FiClock,
      label: 'משימות לשבוע',
      value: '7',
      color: 'bg-purple-500'
    },
    {
      icon: FiIcons.FiTrendingUp,
      label: 'השלמות',
      value: '65%',
      color: 'bg-orange-500'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'חדש':
        return 'bg-blue-100 text-blue-800';
      case 'בעבודה':
        return 'bg-yellow-100 text-yellow-800';
      case 'הושלם':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">דשבורד</h1>
        <p className="text-gray-600 mt-2">סקירה כללית של המשימות והפרויקטים שלך</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">משימות אחרונות</h2>
          <Link to="/tasks" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
            <span>כל המשימות</span>
            <FiIcons.FiArrowLeft className="w-4 h-4 mr-1" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-500">משימה</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">פרויקט</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">סטטוס</th>
                <th className="text-right py-3 px-4 font-medium text-gray-500">פעולות</th>
              </tr>
            </thead>
            <tbody>
              {mockRecentTasks.map((task) => (
                <tr key={task.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{task.title}</td>
                  <td className="py-3 px-4 text-gray-600">{task.project?.name || '-'}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <Link to={`/tasks/${task.id}`} className="text-indigo-600 hover:text-indigo-800">
                      <FiIcons.FiEye className="w-5 h-5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">פעולות מהירות</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/tasks/create" className="flex flex-col items-center p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors">
            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-2">
              <FiIcons.FiPlus className="w-6 h-6 text-indigo-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">משימה חדשה</span>
          </Link>
          
          <Link to="/projects/create" className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
              <FiIcons.FiFolder className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">פרויקט חדש</span>
          </Link>
          
          <Link to="/reports" className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
              <FiIcons.FiBarChart2 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">צפה בדוחות</span>
          </Link>
          
          <Link to="/settings" className="flex flex-col items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
              <FiIcons.FiSettings className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-900">הגדרות</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
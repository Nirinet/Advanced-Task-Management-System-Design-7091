import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Reports = () => {
  const reportTypes = [
    {
      id: 'tasks',
      title: 'דוח משימות',
      description: 'מצב משימות וזמני השלמה',
      icon: FiIcons.FiCheckSquare,
      color: 'bg-orange-500',
      link: '/dashboard'
    },
    {
      id: 'project',
      title: 'דוח פרויקטים',
      description: 'סטטיסטיקות והתקדמות פרויקטים',
      icon: FiIcons.FiFolder,
      color: 'bg-green-500',
      link: '/projects'
    },
    {
      id: 'users',
      title: 'דוח משתמשים',
      description: 'ביצועי משתמשים ופעילות',
      icon: FiIcons.FiUsers,
      color: 'bg-purple-500',
      link: '/users'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">דוחות ואנליטיקה</h1>
        <p className="text-gray-600 mt-2">צפה בדוחות מפורטים וסטטיסטיקות של המערכת</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              to={report.link}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 h-full"
            >
              <div className="flex items-center mb-4">
                <div className={`${report.color} p-3 rounded-lg`}>
                  <SafeIcon icon={report.icon} className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {report.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                {report.description}
              </p>
              <div className="flex items-center text-indigo-600 text-sm font-medium">
                <span>צפה בדוח</span>
                <SafeIcon icon={FiIcons.FiArrowLeft} className="w-4 h-4 mr-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">סטטיסטיקות מהירות</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-lg">
                <SafeIcon icon={FiIcons.FiTrendingUp} className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="mr-4">
                <h4 className="text-sm font-medium text-gray-500">משימות השבוע</h4>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-lg">
                <SafeIcon icon={FiIcons.FiCheckCircle} className="w-6 h-6 text-green-600" />
              </div>
              <div className="mr-4">
                <h4 className="text-sm font-medium text-gray-500">הושלמו השבוע</h4>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-lg">
                <SafeIcon icon={FiIcons.FiFolder} className="w-6 h-6 text-blue-600" />
              </div>
              <div className="mr-4">
                <h4 className="text-sm font-medium text-gray-500">פרויקטים פעילים</h4>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <SafeIcon icon={FiIcons.FiUsers} className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="mr-4">
                <h4 className="text-sm font-medium text-gray-500">צוות פעיל</h4>
                <p className="text-2xl font-bold text-gray-900">8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
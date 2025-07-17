import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center"
      >
        <SafeIcon icon={FiIcons.FiAlertCircle} className="mx-auto h-24 w-24 text-gray-400" />
        <h1 className="mt-6 text-6xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-700">
          הדף לא נמצא
        </h2>
        <p className="mt-2 text-gray-600">
          הדף שחיפשת לא קיים או שהוסר
        </p>
        <div className="mt-8 space-x-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SafeIcon icon={isAuthenticated ? FiIcons.FiHome : FiIcons.FiLogIn} className="w-4 h-4 mr-2" />
            {isAuthenticated ? 'חזור לדשבורד' : 'התחבר למערכת'}
          </Link>
          
          {isAuthenticated && (
            <Link
              to="/projects"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <SafeIcon icon={FiIcons.FiFolder} className="w-4 h-4 mr-2" />
              פרויקטים
            </Link>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
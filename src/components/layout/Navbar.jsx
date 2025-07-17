import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Navbar = ({ toggleSidebar }) => {
  const { user, userRole, signOut } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed top-0 left-0 right-0 z-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 focus:outline-none p-2"
          >
            <SafeIcon icon={FiIcons.FiMenu} className="w-6 h-6" />
          </button>
          
          <div className="flex items-center ml-2 lg:ml-4">
            <Link to="/dashboard" className="flex items-center">
              <SafeIcon icon={FiIcons.FiCheckSquare} className="text-indigo-600 h-8 w-8" />
              <span className="text-xl font-semibold text-gray-800 ml-2 hidden md:block">TaskMaster</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* User Menu */}
          <div className="relative ml-3">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center text-sm rounded-full focus:outline-none"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span className="hidden md:block ml-2 text-sm text-gray-700">
                {user?.email || 'משתמש'}
              </span>
              <SafeIcon icon={FiIcons.FiChevronDown} className="ml-1 w-4 h-4 text-gray-500" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
              >
                <div className="px-4 py-2 text-xs text-gray-500">
                  מחובר כ-{' '}
                  <span className="font-medium">
                    {userRole === 'admin'
                      ? 'מנהל מערכת'
                      : userRole === 'employee'
                      ? 'עובד'
                      : 'לקוח'}
                  </span>
                </div>
                
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  הגדרות
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  התנתק
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
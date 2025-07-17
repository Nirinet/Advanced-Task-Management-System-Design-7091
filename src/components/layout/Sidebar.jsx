import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { isAdmin, isEmployee, isClient } = useAuth();
  const sidebarRef = useRef(null);

  // סגירת הסיידבר בלחיצה מחוץ לו במסכים קטנים
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        window.innerWidth < 768
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  const sidebarVariants = {
    open: {
      x: 0,
      width: '240px',
      transition: { duration: 0.3 }
    },
    closed: {
      x: 0,
      width: '80px',
      transition: { duration: 0.3 }
    },
    mobileOpen: {
      x: 0,
      transition: { duration: 0.3 }
    },
    mobileClosed: {
      x: '-100%',
      transition: { duration: 0.3 }
    }
  };

  const textVariants = {
    open: {
      opacity: 1,
      display: 'block',
      transition: { delay: 0.1 }
    },
    closed: {
      opacity: 0,
      display: 'none',
      transition: { duration: 0.1 }
    }
  };

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const currentVariant = isMobile
    ? (isOpen ? 'mobileOpen' : 'mobileClosed')
    : (isOpen ? 'open' : 'closed');

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <motion.aside
        ref={sidebarRef}
        variants={sidebarVariants}
        initial={false}
        animate={currentVariant}
        className={`fixed top-0 left-0 h-full bg-indigo-800 text-white z-30 pt-16 overflow-hidden ${
          isMobile ? 'w-64 shadow-lg' : ''
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="overflow-y-auto flex-grow">
            <nav className="px-3 py-4">
              <ul className="space-y-1">
                {/* Dashboard */}
                <li>
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg ${
                        isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
                      }`
                    }
                  >
                    <SafeIcon icon={FiIcons.FiHome} className="w-5 h-5" />
                    <motion.span
                      variants={textVariants}
                      animate={isOpen ? 'open' : 'closed'}
                      className="ml-3 font-medium"
                    >
                      דשבורד
                    </motion.span>
                  </NavLink>
                </li>

                {/* Projects */}
                <li>
                  <NavLink
                    to="/projects"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg ${
                        isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
                      }`
                    }
                  >
                    <SafeIcon icon={FiIcons.FiFolder} className="w-5 h-5" />
                    <motion.span
                      variants={textVariants}
                      animate={isOpen ? 'open' : 'closed'}
                      className="ml-3 font-medium"
                    >
                      {isClient() ? 'הפרויקטים שלי' : 'פרויקטים'}
                    </motion.span>
                  </NavLink>
                </li>

                {/* Tasks */}
                <li>
                  <NavLink
                    to="/tasks"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg ${
                        isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
                      }`
                    }
                  >
                    <SafeIcon icon={FiIcons.FiCheckSquare} className="w-5 h-5" />
                    <motion.span
                      variants={textVariants}
                      animate={isOpen ? 'open' : 'closed'}
                      className="ml-3 font-medium"
                    >
                      {isClient() ? 'המשימות שלי' : 'משימות'}
                    </motion.span>
                  </NavLink>
                </li>

                {/* Users (Admin & Employee Only) */}
                {(isAdmin() || isEmployee()) && (
                  <li>
                    <NavLink
                      to="/users"
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-lg ${
                          isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
                        }`
                      }
                    >
                      <SafeIcon icon={FiIcons.FiUsers} className="w-5 h-5" />
                      <motion.span
                        variants={textVariants}
                        animate={isOpen ? 'open' : 'closed'}
                        className="ml-3 font-medium"
                      >
                        משתמשים
                      </motion.span>
                    </NavLink>
                  </li>
                )}

                {/* Reports */}
                <li>
                  <NavLink
                    to="/reports"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg ${
                        isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
                      }`
                    }
                  >
                    <SafeIcon icon={FiIcons.FiBarChart2} className="w-5 h-5" />
                    <motion.span
                      variants={textVariants}
                      animate={isOpen ? 'open' : 'closed'}
                      className="ml-3 font-medium"
                    >
                      דוחות
                    </motion.span>
                  </NavLink>
                </li>

                {/* Settings */}
                <li>
                  <NavLink
                    to="/settings"
                    className={({ isActive }) =>
                      `flex items-center px-3 py-2.5 rounded-lg ${
                        isActive ? 'bg-indigo-700 text-white' : 'text-indigo-100 hover:bg-indigo-700'
                      }`
                    }
                  >
                    <SafeIcon icon={FiIcons.FiSettings} className="w-5 h-5" />
                    <motion.span
                      variants={textVariants}
                      animate={isOpen ? 'open' : 'closed'}
                      className="ml-3 font-medium"
                    >
                      הגדרות
                    </motion.span>
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>

          {/* Footer */}
          <div className="mt-auto border-t border-indigo-700 p-3">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center md:justify-start px-3 py-2 text-indigo-100 hover:bg-indigo-700 rounded-lg"
            >
              <SafeIcon
                icon={isOpen ? FiIcons.FiChevronsLeft : FiIcons.FiChevronsRight}
                className="w-5 h-5"
              />
              <motion.span
                variants={textVariants}
                animate={isOpen ? 'open' : 'closed'}
                className="ml-3 font-medium"
              >
                כווץ תפריט
              </motion.span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiCheckSquare, FiFolder, FiBarChart2, FiSettings } from 'react-icons/fi';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  
  const menuItems = [
    { icon: FiHome, label: 'דשבורד', path: '/dashboard' },
    { icon: FiCheckSquare, label: 'משימות', path: '/tasks' },
    { icon: FiFolder, label: 'פרויקטים', path: '/projects' },
    { icon: FiBarChart2, label: 'דוחות', path: '/reports' },
    { icon: FiSettings, label: 'הגדרות', path: '/settings' }
  ];

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 80 }}
      transition={{ duration: 0.3 }}
      className="bg-indigo-800 text-white h-full overflow-hidden"
    >
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-indigo-700 text-white' 
                    : 'text-indigo-100 hover:bg-indigo-700'
                }`}
              >
                <Icon className="w-5 h-5" />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="ml-3 font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
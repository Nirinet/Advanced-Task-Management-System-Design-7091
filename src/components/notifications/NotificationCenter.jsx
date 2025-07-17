import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '../../context/NotificationContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const NotificationCenter = () => {
  const { notifications, markAsRead, deleteNotification } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [recentNotification, setRecentNotification] = useState(null);
  const [showToast, setShowToast] = useState(false);

  // בדיקה אם יש התראה חדשה להצגה כטוסט
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter(n => !n.read);
      
      if (unreadNotifications.length > 0 && !showToast) {
        setRecentNotification(unreadNotifications[0]);
        setShowToast(true);
        
        // הסתרת הטוסט אחרי 5 שניות
        const timer = setTimeout(() => {
          setShowToast(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [notifications, showToast]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (id) => {
    await markAsRead(id);
  };

  const handleDelete = async (id) => {
    await deleteNotification(id);
  };

  return (
    <>
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && recentNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-50 max-w-md w-full"
          >
            <div className="flex items-start">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-2">
                <SafeIcon icon={FiIcons.FiBell} className="w-5 h-5 text-indigo-600" />
              </div>
              <div className="mr-3 flex-1">
                <p className="text-sm font-medium text-gray-900">{recentNotification.title}</p>
                <p className="mt-1 text-sm text-gray-500">{recentNotification.content}</p>
                <div className="mt-2 flex">
                  <Link
                    to={recentNotification.link || '#'}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() => {
                      handleMarkAsRead(recentNotification.id);
                      setShowToast(false);
                    }}
                  >
                    צפה
                  </Link>
                  <button
                    onClick={() => setShowToast(false)}
                    className="mr-3 text-sm font-medium text-gray-500 hover:text-gray-600"
                  >
                    סגור
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600"
              >
                <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={handleToggle}
        className="fixed bottom-5 right-5 bg-indigo-600 text-white rounded-full p-3 shadow-lg hover:bg-indigo-700 focus:outline-none z-40"
      >
        <SafeIcon
          icon={isOpen ? FiIcons.FiX : FiIcons.FiBell}
          className="w-6 h-6"
        />
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed top-16 bottom-0 right-0 w-80 bg-white shadow-lg z-30 overflow-hidden flex flex-col"
          >
            <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
              <h2 className="text-lg font-medium">התראות</h2>
              <button onClick={handleToggle}>
                <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <SafeIcon icon={FiIcons.FiBell} className="w-12 h-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">אין התראות להצגה</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="relative">
                      <Link
                        to={notification.link || '#'}
                        className={`block p-4 hover:bg-gray-50 ${
                          !notification.read ? 'bg-indigo-50' : ''
                        }`}
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">{notification.content}</p>
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                      >
                        <SafeIcon icon={FiIcons.FiTrash2} className="w-4 h-4" />
                      </button>
                      
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="absolute bottom-4 right-4 text-indigo-500 hover:text-indigo-700 text-xs"
                        >
                          סמן כנקרא
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NotificationCenter;
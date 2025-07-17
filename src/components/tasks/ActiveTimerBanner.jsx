import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTasks } from '../../context/TaskContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const ActiveTimerBanner = () => {
  const { getActiveTimer, stopTimer } = useTasks();
  const [activeTimer, setActiveTimer] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkActiveTimer = async () => {
      const { data } = await getActiveTimer();
      setActiveTimer(data);
      
      if (data) {
        const startTime = new Date(data.start_time).getTime();
        const currentTime = new Date().getTime();
        setElapsedTime(Math.floor((currentTime - startTime) / 1000));
      }
    };
    
    checkActiveTimer();
    
    // בדיקה תקופתית לטיימר פעיל
    const interval = setInterval(checkActiveTimer, 60000); // בדיקה כל דקה
    
    return () => clearInterval(interval);
  }, [getActiveTimer]);
  
  useEffect(() => {
    // עדכון שניות שחלפו
    if (activeTimer) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [activeTimer]);
  
  const handleStopTimer = async () => {
    setLoading(true);
    try {
      await stopTimer();
      setActiveTimer(null);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error stopping timer:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // המרת שניות לפורמט HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };
  
  if (!activeTimer) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="bg-indigo-500 text-white p-2 flex items-center justify-between"
    >
      <div className="flex items-center">
        <SafeIcon icon={FiIcons.FiClock} className="w-5 h-5 mr-2" />
        <div>
          <span className="text-sm font-medium">עובד על: </span>
          <Link 
            to={`/tasks/${activeTimer.task?.id}`}
            className="text-white font-medium hover:underline"
          >
            {activeTimer.task?.title || 'משימה'}
          </Link>
        </div>
      </div>
      
      <div className="flex items-center">
        <div className="bg-indigo-600 px-3 py-1 rounded-md font-mono text-lg">
          {formatTime(elapsedTime)}
        </div>
        <button
          onClick={handleStopTimer}
          disabled={loading}
          className="ml-3 bg-white text-indigo-600 rounded-full p-2 hover:bg-indigo-100 focus:outline-none"
        >
          {loading ? (
            <SafeIcon icon={FiIcons.FiLoader} className="w-5 h-5 animate-spin" />
          ) : (
            <SafeIcon icon={FiIcons.FiStopCircle} className="w-5 h-5" />
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ActiveTimerBanner;
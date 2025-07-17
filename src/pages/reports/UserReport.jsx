import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const UserReport = () => {
  const { id } = useParams();
  const [selectedUser, setSelectedUser] = useState(id || 'all');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      const mockData = {
        name: 'יוסי כהן',
        email: 'yossi@example.com',
        role: 'employee',
        totalTasks: 45,
        completedTasks: 38,
        inProgressTasks: 5,
        pendingTasks: 2,
        totalHours: 180.5,
        thisWeekHours: 35.5,
        avgTaskTime: 4.2,
        projects: ['פרויקט A', 'פרויקט B', 'פרויקט C'],
        weeklyHours: [
          { week: 'שבוע 1', hours: 40 },
          { week: 'שבוע 2', hours: 38 },
          { week: 'שבוע 3', hours: 42 },
          { week: 'שבוע 4', hours: 35.5 }
        ]
      };
      setUserData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedUser]);

  // Tasks Chart
  const tasksOption = {
    title: {
      text: 'התפלגות משימות',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        data: userData ? [
          { value: userData.completedTasks, name: 'הושלמו', itemStyle: { color: '#10B981' } },
          { value: userData.inProgressTasks, name: 'בעבודה', itemStyle: { color: '#F59E0B' } },
          { value: userData.pendingTasks, name: 'ממתינות', itemStyle: { color: '#EF4444' } }
        ] : []
      }
    ]
  };

  // Weekly Hours Chart
  const hoursOption = {
    title: {
      text: 'שעות שבועיות',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: userData?.weeklyHours.map(item => item.week) || []
    },
    yAxis: {
      type: 'value',
      name: 'שעות'
    },
    series: [
      {
        data: userData?.weeklyHours.map(item => item.hours) || [],
        type: 'bar',
        itemStyle: {
          color: '#4F46E5'
        }
      }
    ]
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const completionRate = userData ? 
    Math.round((userData.completedTasks / userData.totalTasks) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">דוח משתמש</h1>
        <p className="text-gray-600 mt-2">מעקב אחר ביצועי ופעילות המשתמש</p>
      </div>

      {/* User Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
              בחר משתמש
            </label>
            <select
              id="user"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">כל המשתמשים</option>
              <option value="user1">יוסי כהן</option>
              <option value="user2">שרה לוי</option>
              <option value="user3">דוד אברהם</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <SafeIcon icon={FiIcons.FiDownload} className="w-4 h-4 mr-2 inline" />
              ייצא דוח
            </button>
          </div>
        </div>
      </div>

      {/* User Overview */}
      {userData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
              {userData.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{userData.name}</h2>
              <p className="text-gray-600">{userData.email}</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                {userData.role === 'employee' ? 'עובד' : userData.role === 'admin' ? 'מנהל' : 'לקוח'}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-1">{userData.totalTasks}</div>
              <div className="text-sm text-gray-500">סה"כ משימות</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">{completionRate}%</div>
              <div className="text-sm text-gray-500">שיעור השלמה</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">{userData.totalHours}</div>
              <div className="text-sm text-gray-500">סה"כ שעות</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">{userData.avgTaskTime}</div>
              <div className="text-sm text-gray-500">ממוצע שעות למשימה</div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <SafeIcon icon={FiIcons.FiCheckCircle} className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <h3 className="text-sm font-medium text-gray-500">הושלמו השבוע</h3>
              <p className="text-2xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <SafeIcon icon={FiIcons.FiClock} className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <h3 className="text-sm font-medium text-gray-500">שעות השבוע</h3>
              <p className="text-2xl font-bold text-gray-900">{userData?.thisWeekHours}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <SafeIcon icon={FiIcons.FiFolder} className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <h3 className="text-sm font-medium text-gray-500">פרויקטים פעילים</h3>
              <p className="text-2xl font-bold text-gray-900">{userData?.projects.length}</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <SafeIcon icon={FiIcons.FiActivity} className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="mr-4">
              <h3 className="text-sm font-medium text-gray-500">משימות בעבודה</h3>
              <p className="text-2xl font-bold text-gray-900">{userData?.inProgressTasks}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="h-80">
            <ReactECharts option={tasksOption} style={{ height: '100%' }} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="h-80">
            <ReactECharts option={hoursOption} style={{ height: '100%' }} />
          </div>
        </motion.div>
      </div>

      {/* Active Projects */}
      {userData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">פרויקטים פעילים</h2>
          
          <div className="space-y-3">
            {userData.projects.map((project, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm font-medium mr-3">
                    {project.charAt(0)}
                  </div>
                  <span className="font-medium text-gray-900">{project}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <SafeIcon icon={FiIcons.FiActivity} className="w-4 h-4 mr-1" />
                  פעיל
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserReport;
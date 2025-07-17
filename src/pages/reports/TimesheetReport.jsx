import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { format, startOfWeek, endOfWeek, addDays, subDays } from 'date-fns';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const TimesheetReport = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedUser, setSelectedUser] = useState('all');
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      const mockData = [
        { date: '2024-01-15', user: 'יוסי כהן', hours: 8.5, project: 'פרויקט A' },
        { date: '2024-01-16', user: 'יוסי כהן', hours: 7.0, project: 'פרויקט A' },
        { date: '2024-01-17', user: 'יוסי כהן', hours: 6.5, project: 'פרויקט B' },
        { date: '2024-01-18', user: 'שרה לוי', hours: 8.0, project: 'פרויקט A' },
        { date: '2024-01-19', user: 'שרה לוי', hours: 7.5, project: 'פרויקט C' },
      ];
      setTimeData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedPeriod, selectedUser]);

  // Chart configuration
  const chartOption = {
    title: {
      text: 'שעות עבודה יומיות',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'category',
      data: timeData.map(item => format(new Date(item.date), 'dd/MM'))
    },
    yAxis: {
      type: 'value',
      name: 'שעות'
    },
    series: [
      {
        data: timeData.map(item => item.hours),
        type: 'bar',
        itemStyle: {
          color: '#4F46E5'
        }
      }
    ]
  };

  const totalHours = timeData.reduce((sum, item) => sum + item.hours, 0);
  const averageHours = timeData.length > 0 ? (totalHours / timeData.length).toFixed(1) : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">דוח שעות עבודה</h1>
        <p className="text-gray-600 mt-2">מעקב אחר שעות העבודה של הצוות</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
              תקופה
            </label>
            <select
              id="period"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="week">השבוע הנוכחי</option>
              <option value="month">החודש הנוכחי</option>
              <option value="quarter">הרבעון הנוכחי</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="user" className="block text-sm font-medium text-gray-700 mb-1">
              משתמש
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
            </select>
          </div>
          
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <SafeIcon icon={FiIcons.FiDownload} className="w-4 h-4 mr-2 inline" />
              ייצא לאקסל
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <SafeIcon icon={FiIcons.FiClock} className="w-6 h-6 text-blue-600" />
            </div>
            <div className="mr-4">
              <h3 className="text-sm font-medium text-gray-500">סה"כ שעות</h3>
              <p className="text-2xl font-bold text-gray-900">{totalHours}</p>
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
            <div className="bg-green-100 p-3 rounded-lg">
              <SafeIcon icon={FiIcons.FiTrendingUp} className="w-6 h-6 text-green-600" />
            </div>
            <div className="mr-4">
              <h3 className="text-sm font-medium text-gray-500">ממוצע יומי</h3>
              <p className="text-2xl font-bold text-gray-900">{averageHours}</p>
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
              <SafeIcon icon={FiIcons.FiCalendar} className="w-6 h-6 text-purple-600" />
            </div>
            <div className="mr-4">
              <h3 className="text-sm font-medium text-gray-500">ימי עבודה</h3>
              <p className="text-2xl font-bold text-gray-900">{timeData.length}</p>
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
            <div className="bg-orange-100 p-3 rounded-lg">
              <SafeIcon icon={FiIcons.FiUsers} className="w-6 h-6 text-orange-600" />
            </div>
            <div className="mr-4">
              <h3 className="text-sm font-medium text-gray-500">עובדים פעילים</h3>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm p-6 mb-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">גרף שעות עבודה</h2>
        <div className="h-96">
          <ReactECharts option={chartOption} style={{ height: '100%' }} />
        </div>
      </motion.div>

      {/* Time Entries Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">רישומי זמן מפורטים</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  תאריך
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  משתמש
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  פרויקט
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  שעות
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeData.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {format(new Date(entry.date), 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.user}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entry.hours} שעות
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default TimesheetReport;
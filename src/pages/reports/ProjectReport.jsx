import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const ProjectReport = () => {
  const { id } = useParams();
  const [selectedProject, setSelectedProject] = useState(id || 'all');
  const [projectData, setProjectData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    setTimeout(() => {
      const mockData = {
        name: 'פרויקט דוגמה',
        status: 'active',
        totalTasks: 25,
        completedTasks: 18,
        inProgressTasks: 5,
        pendingTasks: 2,
        totalHours: 120.5,
        budget: 50000,
        spent: 35000,
        team: ['יוסי כהן', 'שרה לוי', 'דוד אברהם'],
        timeline: [
          { date: '2024-01-01', completed: 0 },
          { date: '2024-01-15', completed: 5 },
          { date: '2024-02-01', completed: 12 },
          { date: '2024-02-15', completed: 18 }
        ]
      };
      setProjectData(mockData);
      setLoading(false);
    }, 1000);
  }, [selectedProject]);

  // Progress Chart
  const progressOption = {
    title: {
      text: 'התקדמות משימות',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: projectData ? [
          { value: projectData.completedTasks, name: 'הושלמו', itemStyle: { color: '#10B981' } },
          { value: projectData.inProgressTasks, name: 'בעבודה', itemStyle: { color: '#F59E0B' } },
          { value: projectData.pendingTasks, name: 'ממתינות', itemStyle: { color: '#EF4444' } }
        ] : []
      }
    ]
  };

  // Timeline Chart
  const timelineOption = {
    title: {
      text: 'התקדמות לאורך זמן',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: projectData?.timeline.map(item => new Date(item.date).toLocaleDateString('he-IL')) || []
    },
    yAxis: {
      type: 'value',
      name: 'משימות שהושלמו'
    },
    series: [
      {
        data: projectData?.timeline.map(item => item.completed) || [],
        type: 'line',
        smooth: true,
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

  const completionPercentage = projectData ? 
    Math.round((projectData.completedTasks / projectData.totalTasks) * 100) : 0;
  
  const budgetPercentage = projectData ? 
    Math.round((projectData.spent / projectData.budget) * 100) : 0;

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">דוח פרויקט</h1>
        <p className="text-gray-600 mt-2">מעקב אחר התקדמות וביצועי הפרויקט</p>
      </div>

      {/* Project Selector */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700 mb-1">
              בחר פרויקט
            </label>
            <select
              id="project"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">כל הפרויקטים</option>
              <option value="project1">פרויקט A</option>
              <option value="project2">פרויקט B</option>
              <option value="project3">פרויקט C</option>
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

      {/* Project Overview */}
      {projectData && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">{projectData.name}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">התקדמות</h3>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {projectData.completedTasks} מתוך {projectData.totalTasks} משימות
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">תקציב</h3>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${budgetPercentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-900">{budgetPercentage}%</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ₪{projectData.spent.toLocaleString()} מתוך ₪{projectData.budget.toLocaleString()}
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">שעות עבודה</h3>
              <p className="text-2xl font-bold text-gray-900">{projectData.totalHours}</p>
              <p className="text-xs text-gray-500">סה"כ שעות</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">חברי צוות</h3>
              <p className="text-2xl font-bold text-gray-900">{projectData.team.length}</p>
              <p className="text-xs text-gray-500">משתתפים פעילים</p>
            </div>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="h-80">
            <ReactECharts option={progressOption} style={{ height: '100%' }} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="h-80">
            <ReactECharts option={timelineOption} style={{ height: '100%' }} />
          </div>
        </motion.div>
      </div>

      {/* Team Members */}
      {projectData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">חברי הצוות</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectData.team.map((member, index) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium mr-3">
                  {member.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{member}</h4>
                  <p className="text-xs text-gray-500">חבר צוות</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectReport;
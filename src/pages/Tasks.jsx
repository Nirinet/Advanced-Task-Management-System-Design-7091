import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiFilter } from 'react-icons/fi';

const Tasks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockTasks = [
    { 
      id: 1, 
      title: 'עיצוב דף הבית החדש', 
      description: 'יצירת עיצוב מודרני ומותאם לנייד',
      priority: 'גבוהה', 
      status: 'בעבודה', 
      project: 'אתר החברה',
      assignee: 'יוסי כהן',
      dueDate: '2024-01-25'
    },
    { 
      id: 2, 
      title: 'פיתוח API למערכת CRM', 
      description: 'בניית API RESTful עבור ניהול לקוחות',
      priority: 'בינונית', 
      status: 'חדש', 
      project: 'מערכת CRM',
      assignee: 'שרה לוי',
      dueDate: '2024-01-30'
    },
    { 
      id: 3, 
      title: 'בדיקות איכות לאפליקציה', 
      description: 'ביצוע בדיקות מקיפות לפני השקה',
      priority: 'גבוהה', 
      status: 'הושלם', 
      project: 'אפליקציית מובייל',
      assignee: 'דוד אברהם',
      dueDate: '2024-01-20'
    },
    { 
      id: 4, 
      title: 'כתיבת תיעוד טכני', 
      description: 'הכנת תיעוד מפורט למערכת',
      priority: 'נמוכה', 
      status: 'בעבודה', 
      project: 'פרויקט A',
      assignee: 'מיכל רוזן',
      dueDate: '2024-02-05'
    }
  ];

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'גבוהה': return 'bg-red-100 text-red-800';
      case 'בינונית': return 'bg-yellow-100 text-yellow-800';
      case 'נמוכה': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'הושלם': return 'bg-green-100 text-green-800';
      case 'בעבודה': return 'bg-blue-100 text-blue-800';
      case 'חדש': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">משימות</h1>
          <p className="text-gray-600 mt-2">נהל את כל המשימות שלך במקום אחד</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <FiPlus className="w-4 h-4 mr-2" />
          משימה חדשה
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="חפש משימות..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">כל הסטטוסים</option>
            <option value="חדש">חדש</option>
            <option value="בעבודה">בעבודה</option>
            <option value="הושלם">הושלם</option>
          </select>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {task.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {task.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">פרויקט:</span>
                <span className="text-sm font-medium text-gray-900">{task.project}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">מוקצה ל:</span>
                <span className="text-sm font-medium text-gray-900">{task.assignee}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">תאריך יעד:</span>
                <span className="text-sm font-medium text-gray-900">{task.dueDate}</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <FiSearch className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין משימות להצגה</h3>
          <p className="text-gray-600">נסה לשנות את הפילטרים או צור משימה חדשה</p>
        </div>
      )}
    </div>
  );
};

export default Tasks;
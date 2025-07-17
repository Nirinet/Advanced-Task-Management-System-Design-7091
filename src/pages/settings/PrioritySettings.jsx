import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePriorities } from '../../context/PriorityContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const PrioritySettings = () => {
  const { priorities, loading, createPriority, updatePriority, deletePriority } = usePriorities();
  const [showModal, setShowModal] = useState(false);
  const [editingPriority, setEditingPriority] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#4F46E5',
    order: 1
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#3B82F6', // Blue
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6B7280', // Gray
    '#4F46E5'  // Indigo
  ];

  const handleOpenModal = (priority = null) => {
    if (priority) {
      setEditingPriority(priority);
      setFormData({
        name: priority.name,
        color: priority.color,
        order: priority.order
      });
    } else {
      setEditingPriority(null);
      setFormData({
        name: '',
        color: '#4F46E5',
        order: priorities.length + 1
      });
    }
    setShowModal(true);
    setError('');
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPriority(null);
    setFormData({ name: '', color: '#4F46E5', order: 1 });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('שם העדיפות הוא שדה חובה');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      let result;
      if (editingPriority) {
        result = await updatePriority(editingPriority.id, formData);
      } else {
        result = await createPriority(formData);
      }

      if (result.success) {
        handleCloseModal();
      } else {
        setError(result.error || 'שגיאה בשמירת העדיפות');
      }
    } catch (err) {
      console.error('Error saving priority:', err);
      setError('שגיאה בשמירת העדיפות');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (priority) => {
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את העדיפות "${priority.name}"?`)) {
      return;
    }

    try {
      const result = await deletePriority(priority.id);
      if (!result.success) {
        alert('שגיאה במחיקת העדיפות');
      }
    } catch (error) {
      console.error('Error deleting priority:', error);
      alert('שגיאה במחיקת העדיפות');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">ניהול עדיפויות</h1>
          <p className="text-gray-600 mt-2">נהל את רמות העדיפות של המשימות במערכת</p>
        </div>
        
        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
          עדיפות חדשה
        </button>
      </div>

      {/* Priorities List */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {priorities.length === 0 ? (
          <div className="text-center py-12">
            <SafeIcon icon={FiIcons.FiFlag} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">אין עדיפויות במערכת</h3>
            <p className="text-gray-600 mb-6">התחל בהוספת רמות עדיפות למשימות</p>
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <SafeIcon icon={FiIcons.FiPlus} className="w-4 h-4 mr-2" />
              צור עדיפות ראשונה
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    עדיפות
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    צבע
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    סדר
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {priorities.map((priority, index) => (
                  <motion.tr
                    key={priority.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: priority.color }}
                        />
                        <span className="text-sm font-medium text-gray-900">
                          {priority.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                        style={{ backgroundColor: priority.color }}
                      >
                        {priority.color}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {priority.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleOpenModal(priority)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="ערוך עדיפות"
                        >
                          <SafeIcon icon={FiIcons.FiEdit} className="w-5 h-5" />
                        </button>
                        
                        <button
                          onClick={() => handleDelete(priority)}
                          className="text-red-600 hover:text-red-900"
                          title="מחק עדיפות"
                        >
                          <SafeIcon icon={FiIcons.FiTrash2} className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-lg max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingPriority ? 'ערוך עדיפות' : 'עדיפות חדשה'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <SafeIcon icon={FiIcons.FiX} className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    שם העדיפות *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="הזן שם העדיפות"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    צבע
                  </label>
                  <div className="grid grid-cols-8 gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={`w-8 h-8 rounded-full border-2 ${
                          formData.color === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <input
                    type="color"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="mt-2 w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                    סדר (1 = הגבוה ביותר)
                  </label>
                  <input
                    type="number"
                    id="order"
                    name="order"
                    min="1"
                    value={formData.order}
                    onChange={handleChange}
                    required
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    ביטול
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                  >
                    {submitting ? (
                      <>
                        <SafeIcon icon={FiIcons.FiLoader} className="w-4 h-4 mr-2 animate-spin" />
                        שומר...
                      </>
                    ) : (
                      <>
                        <SafeIcon icon={FiIcons.FiSave} className="w-4 h-4 mr-2" />
                        {editingPriority ? 'עדכן' : 'צור'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PrioritySettings;
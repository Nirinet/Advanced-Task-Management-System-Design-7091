import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUsers } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Users = () => {
  const { users, loading, deleteUser } = useUsers();
  const { isAdmin, isEmployee } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    let filtered = users;

    // חיפוש לפי שם או אימייל
    if (searchTerm) {
      filtered = filtered.filter(user =>
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // סינון לפי תפקיד
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, roleFilter]);

  const handleDeleteUser = async (userId, userEmail) => {
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש ${userEmail}? פעולה זו אינה ניתנת לביטול.`)) {
      return;
    }

    try {
      setDeleting(userId);
      const result = await deleteUser(userId);
      
      if (!result.success) {
        alert('שגיאה במחיקת המשתמש');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('שגיאה במחיקת המשתמש');
    } finally {
      setDeleting(null);
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'מנהל מערכת';
      case 'employee': return 'עובד';
      case 'client': return 'לקוח';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'employee': return 'bg-blue-100 text-blue-800';
      case 'client': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">משתמשים</h1>
          <p className="text-gray-600 mt-2">נהל את כל המשתמשים במערכת</p>
        </div>
        
        {isAdmin() && (
          <Link
            to="/users/create"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SafeIcon icon={FiIcons.FiUserPlus} className="w-4 h-4 mr-2" />
            משתמש חדש
          </Link>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              חיפוש
            </label>
            <div className="relative">
              <SafeIcon icon={FiIcons.FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="חפש לפי שם או אימייל..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              תפקיד
            </label>
            <select
              id="role"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="all">כל התפקידים</option>
              <option value="admin">מנהל מערכת</option>
              <option value="employee">עובד</option>
              <option value="client">לקוח</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12">
          <SafeIcon icon={FiIcons.FiUsers} className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">אין משתמשים להצגה</h3>
          <p className="text-gray-600 mb-6">
            {users.length === 0 ? 'עדיין לא נוצרו משתמשים במערכת' : 'לא נמצאו משתמשים התואמים לחיפוש'}
          </p>
          {isAdmin() && users.length === 0 && (
            <Link
              to="/users/create"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <SafeIcon icon={FiIcons.FiUserPlus} className="w-4 h-4 mr-2" />
              צור משתמש ראשון
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    משתמש
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תפקיד
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    טלפון
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    תאריך הצטרפות
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    פעולות
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium">
                          {user.name?.charAt(0) || user.email?.charAt(0) || '?'}
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name || 'לא צוין שם'}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleName(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.phone || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString('he-IL') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-3">
                        <Link
                          to={`/reports/user/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="דוח משתמש"
                        >
                          <SafeIcon icon={FiIcons.FiBarChart2} className="w-5 h-5" />
                        </Link>
                        
                        {isAdmin() && (
                          <>
                            <Link
                              to={`/users/${user.id}/edit`}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="ערוך משתמש"
                            >
                              <SafeIcon icon={FiIcons.FiEdit} className="w-5 h-5" />
                            </Link>
                            
                            <button
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              disabled={deleting === user.id}
                              className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              title="מחק משתמש"
                            >
                              {deleting === user.id ? (
                                <SafeIcon icon={FiIcons.FiLoader} className="w-5 h-5 animate-spin" />
                              ) : (
                                <SafeIcon icon={FiIcons.FiTrash2} className="w-5 h-5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
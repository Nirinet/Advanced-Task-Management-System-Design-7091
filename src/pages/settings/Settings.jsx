import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const Settings = () => {
  const { user, userRole, isAdmin, changeUserRole } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'פרופיל אישי', icon: FiIcons.FiUser },
    { id: 'notifications', name: 'התראות', icon: FiIcons.FiBell },
    { id: 'security', name: 'אבטחה', icon: FiIcons.FiShield }
  ];

  if (isAdmin()) {
    tabs.push({ id: 'system', name: 'הגדרות מערכת', icon: FiIcons.FiSettings });
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">הגדרות</h1>
        <p className="text-gray-600 mt-2">נהל את ההגדרות האישיות והמערכת שלך</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <SafeIcon icon={tab.icon} className="w-5 h-5 mr-3" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'profile' && <ProfileSettings />}
            {activeTab === 'notifications' && <NotificationSettings />}
            {activeTab === 'security' && <SecuritySettings />}
            {activeTab === 'system' && isAdmin() && <SystemSettings />}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSettings = () => {
  const { user, userRole, isAdmin, changeUserRole } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    bio: ''
  });
  const [roleChangeLoading, setRoleChangeLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle profile update
    console.log('Profile update:', formData);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = async (newRole) => {
    setRoleChangeLoading(true);
    try {
      const result = await changeUserRole(newRole);
      if (result.success) {
        alert(`התפקיד שונה בהצלחה ל: ${newRole === 'admin' ? 'מנהל מערכת' : newRole === 'employee' ? 'עובד' : 'לקוח'}`);
        // רענון הדף כדי לעדכן את הממשק
        window.location.reload();
      } else {
        alert('שגיאה בשינוי התפקיד');
      }
    } catch (error) {
      console.error('Error changing role:', error);
      alert('שגיאה בשינוי התפקיד');
    } finally {
      setRoleChangeLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">פרופיל אישי</h2>
      
      {/* Current Role Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <h3 className="text-sm font-medium text-blue-800 mb-2">תפקיד נוכחי</h3>
        <div className="flex items-center justify-between">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${
            userRole === 'admin' ? 'bg-red-100 text-red-800' :
            userRole === 'employee' ? 'bg-blue-100 text-blue-800' :
            'bg-green-100 text-green-800'
          }`}>
            {userRole === 'admin' ? 'מנהל מערכת' : 
             userRole === 'employee' ? 'עובד' : 'לקוח'}
          </span>
          
          {/* Role Change Buttons for Demo */}
          <div className="flex space-x-2">
            {userRole !== 'admin' && (
              <button
                onClick={() => handleRoleChange('admin')}
                disabled={roleChangeLoading}
                className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                שנה למנהל
              </button>
            )}
            {userRole !== 'employee' && (
              <button
                onClick={() => handleRoleChange('employee')}
                disabled={roleChangeLoading}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                שנה לעובד
              </button>
            )}
            {userRole !== 'client' && (
              <button
                onClick={() => handleRoleChange('client')}
                disabled={roleChangeLoading}
                className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                שנה للקוח
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          בסביבת הדגמה - ניתן לשנות תפקיד באמצעות הכפתורים למעלה
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              שם מלא
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              אימייל
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              טלפון
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            אודות
          </label>
          <textarea
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="ספר קצת על עצמך..."
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            שמור שינויים
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    taskUpdates: true,
    projectUpdates: false,
    weeklyReports: true,
    systemAlerts: true
  });

  const handleToggle = (setting) => {
    setSettings({ ...settings, [setting]: !settings[setting] });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">הגדרות התראות</h2>
      
      <div className="space-y-4">
        {[
          { key: 'emailNotifications', label: 'התראות במייל', desc: 'קבל התראות חשובות במייל' },
          { key: 'taskUpdates', label: 'עדכוני משימות', desc: 'התראות על שינויים במשימות שלך' },
          { key: 'projectUpdates', label: 'עדכוני פרויקטים', desc: 'התראות על התקדמות פרויקטים' },
          { key: 'weeklyReports', label: 'דוחות שבועיים', desc: 'קבל סיכום שבועי של הפעילות שלך' },
          { key: 'systemAlerts', label: 'התראות מערכת', desc: 'התראות על עדכוני מערכת וגיבויים' }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="text-sm font-medium text-gray-900">{item.label}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
            <button
              onClick={() => handleToggle(item.key)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                settings[item.key] ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings[item.key] ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const SecuritySettings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Password change:', passwordData);
  };

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">אבטחה</h2>
      
      <div className="space-y-8">
        {/* Password Change */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">שינוי סיסמה</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סיסמה נוכחית
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                סיסמה חדשה
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                אימות סיסמה חדשה
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              עדכן סיסמה
            </button>
          </form>
        </div>

        {/* Two Factor Auth */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">אימות דו-שלבי</h3>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">הפעל אימות דו-שלבי</h4>
              <p className="text-sm text-gray-500">הוסף שכבת אבטחה נוספת לחשבון שלך</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              הפעל
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SystemSettings = () => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">הגדרות מערכת</h2>
      
      <div className="space-y-6">
        {/* Priority Management */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">ניהול עדיפויות</h3>
              <p className="text-sm text-gray-500">נהל את רמות העדיפות של המשימות</p>
            </div>
            <Link
              to="/settings/priorities"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              נהל עדיפויות
            </Link>
          </div>
        </div>

        {/* System Backup */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">גיבוי מערכת</h3>
              <p className="text-sm text-gray-500">בצע גיבוי של נתוני המערכת</p>
            </div>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              בצע גיבוי
            </button>
          </div>
        </div>

        {/* System Logs */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">יומני מערכת</h3>
              <p className="text-sm text-gray-500">צפה ביומני הפעילות של המערכת</p>
            </div>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500">
              צפה ביומנים
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Settings;
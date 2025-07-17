import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import * as FiIcons from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // כל סיסמה תתקבל במערכת הדמו
      const result = await signIn(email, password || 'demo123');
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'שגיאה בהתחברות');
      }
    } catch (err) {
      setError('שגיאה בהתחברות. אנא נסה שנית.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail) => {
    setEmail(demoEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">TaskMaster</h1>
          <p className="text-gray-600">מערכת ניהול משימות ופרויקטים</p>
        </div>

        {/* Demo Login Info */}
        <div className="mb-6 space-y-2">
          <p className="text-sm text-gray-600 text-center mb-3">פרטי התחברות לדוגמה:</p>
          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => fillDemoCredentials('admin@taskmaster.com')}
              className="w-full py-2 px-4 bg-red-100 text-red-800 rounded-md hover:bg-red-200 text-sm"
            >
              מנהל מערכת: admin@taskmaster.com
            </button>
            <button
              onClick={() => fillDemoCredentials('employee@taskmaster.com')}
              className="w-full py-2 px-4 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 text-sm"
            >
              עובד: employee@taskmaster.com
            </button>
            <button
              onClick={() => fillDemoCredentials('client@taskmaster.com')}
              className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-md hover:bg-green-200 text-sm"
            >
              לקוח: client@taskmaster.com
            </button>
          </div>
          <p className="text-xs text-gray-500 text-center mt-2">
            הסיסמה לכל המשתמשים: demo123
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">התחברות</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              אימייל
            </label>
            <div className="relative">
              <FiIcons.FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="הכנס את האימייל שלך"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה
            </label>
            <div className="relative">
              <FiIcons.FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-10 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="הכנס את הסיסמה שלך"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <FiIcons.FiEyeOff className="w-5 h-5" /> : <FiIcons.FiEye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <span className="ml-2 text-sm text-gray-600">זכור אותי</span>
            </label>
            <a href="#" className="text-sm text-indigo-600 hover:text-indigo-500">
              שכחת סיסמה?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <FiIcons.FiLoader className="animate-spin w-5 h-5 mr-2" />
                מתחבר...
              </div>
            ) : (
              'התחבר'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            אין לך חשבון?{' '}
            <a href="#" className="text-indigo-600 hover:text-indigo-500 font-medium">
              הירשם כאן
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
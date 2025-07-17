import { motion } from 'framer-motion';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-indigo-50 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <SafeIcon icon={FiIcons.FiLoader} className="w-12 h-12 text-indigo-600" />
        </motion.div>
        <h2 className="mt-4 text-xl font-semibold text-indigo-800">טוען...</h2>
        <p className="mt-2 text-gray-600">אנא המתן בזמן שהמערכת מתחברת</p>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
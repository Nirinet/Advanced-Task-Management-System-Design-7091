import { FiMenu, FiBell, FiUser } from 'react-icons/fi';

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={toggleSidebar}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-md"
          >
            <FiMenu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold text-gray-800 ml-3">TaskMaster</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-full text-gray-600 hover:bg-gray-100">
            <FiBell className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
              <FiUser className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Demo User</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
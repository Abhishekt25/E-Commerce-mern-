import { Link } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  return (
    <div className={`fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 z-20 transition-all duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-xl font-bold">E-Commerce Dashboard</h1>
      </div>
      
      <nav>
        <ul className="space-y-2">
        <li>
            <Link 
              to="/admin" 
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <span className="ml-3">Home</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/orders" 
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <span className="ml-3">Orders</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/inventory" 
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <span className="ml-3">Inventory</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/analytics" 
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <span className="ml-3">Analytics</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/setting" 
              className="flex items-center p-2 rounded hover:bg-gray-700"
            >
              <span className="ml-3">Settings</span>
            </Link>
          </li>
          {/* Other menu items remain the same */}
        </ul>
      </nav>
      
      <div className="absolute bottom-4 left-4 right-4">
        <div className="p-2 text-center text-gray-400 text-sm">
          Abhishek Tiwari
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState<string | null>(null);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    // Fetch admin details from localStorage
    const storedName = localStorage.getItem('adminName');
    const storedToken = localStorage.getItem('adminToken');

    if (storedName && storedToken) {
      setAdminName(storedName);
      // optional: decode email from token (if you store it)
      // for now, use a placeholder or omit
      setAdminEmail("admin@shopab.com");
    }
  }, []);

  const handleLogout = () => {
    // Remove admin data
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen w-64 bg-gray-800 text-white p-4 z-20 transition-all duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-center mb-8">
        <h1 className="text-xl font-bold">E-Commerce Dashboard</h1>
      </div>

      {/* Navigation */}
      <nav>
        <ul className="space-y-2">
          <li><Link to="/admin" className="flex items-center p-2 rounded hover:bg-gray-700"><span className="ml-3">Home</span></Link></li>
          <li><Link to="/admin/orders" className="flex items-center p-2 rounded hover:bg-gray-700"><span className="ml-3">Orders</span></Link></li>
          <li><Link to="/admin/inventory" className="flex items-center p-2 rounded hover:bg-gray-700"><span className="ml-3">Inventory</span></Link></li>
          <li><Link to="/admin/analytics" className="flex items-center p-2 rounded hover:bg-gray-700"><span className="ml-3">Analytics</span></Link></li>
          <li><Link to="/admin/setting" className="flex items-center p-2 rounded hover:bg-gray-700"><span className="ml-3">Settings</span></Link></li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="absolute bottom-4 left-4 right-4 text-center">
        {adminName ? (
          <div className="p-2 text-gray-300 text-sm">
            <p className="font-semibold">{adminName}</p>
            {adminEmail && <p className="text-xs text-gray-400">{adminEmail}</p>}
          </div>
        ) : (
          <p className="text-gray-400 text-sm italic">Admin not logged in</p>
        )}

        <button
          onClick={handleLogout}
          className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition-all duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

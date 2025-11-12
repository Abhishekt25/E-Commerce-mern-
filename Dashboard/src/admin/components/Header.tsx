import { useLocation } from 'react-router-dom';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header = ({ onToggleSidebar, isSidebarOpen }: HeaderProps) => {
  const location = useLocation();
  const path = location.pathname.split('/').pop();

  return (
    <div className={`fixed top-0 ${isSidebarOpen ? 'left-64' : 'left-0'} right-0 bg-white shadow-sm z-10 p-4 border-b`}>
      <div className="flex items-center">
        <button 
          onClick={onToggleSidebar}
          className="mr-4 text-gray-600 hover:text-gray-900"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 20 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18v16H3V4zm6 0v16" />
            </svg>
          
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18v16H3V4zm6 0v16" />
            </svg>
          )}
        </button>
        <h1 className="text-xl font-semibold">
          Multi-Platform Store Manager | {path || 'Home'}
        </h1>
      </div>
    </div>
  );
};

export default Header;
import { Link } from "react-router-dom";
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gray-800">ShopLogo</Link>
          </div>

          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900">Products</Link>
            <Link to="/about" className="text-gray-700 hover:text-gray-900">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
          </nav>

          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search products..."
              className="hidden sm:block border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button className="flex items-center space-x-1 text-gray-700 hover:text-gray-900">
              <UserIcon className="h-6 w-6" />
              <span className="hidden sm:inline">Login</span>
            </button>
            <button className="relative flex items-center text-gray-700 hover:text-gray-900">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">3</span>
            </button>
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/" className="block text-gray-700 hover:text-gray-900">Home</Link>
          <Link to="/products" className="block text-gray-700 hover:text-gray-900">Products</Link>
          <Link to="/about" className="block text-gray-700 hover:text-gray-900">About</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-gray-900">Contact</Link>
        </div>
      )}
    </header>
  );
};

export default Header;

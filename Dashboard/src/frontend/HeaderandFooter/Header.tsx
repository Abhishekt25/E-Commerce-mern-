import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import SignIn from "../pages/Auth/SignIn";

// Global typing timer (outside component)
let typingTimer: ReturnType<typeof setTimeout>;

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const backendURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2507";

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Check login on load
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await fetch(`${backendURL}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("User not found");
        const data = await response.json();

        setIsLoggedIn(true);
        setUserName(data.name || "User");
      } catch (error) {
        console.error("Error fetching user info:", error);
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    fetchUser();
  }, [backendURL]);

  // 🔹 Update cart count from localStorage + events
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const totalQuantity = cart.reduce(
        (sum: number, item: { quantity: number }) => sum + (item.quantity || 0),
        0
      );
      setCartCount(totalQuantity);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // 🔹 Keep search text synced with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search") || "";
    setSearchQuery(q);
  }, [location.search]);

  // 🔹 Debounced Search Handler
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    clearTimeout(typingTimer);

    typingTimer = setTimeout(() => {
      navigate(`/products?search=${encodeURIComponent(value)}`);
    }, 500);
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setIsLoggedIn(false);
    setUserName("");
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img 
                src="/shopab.jpeg" 
                alt="Shop Logo" 
                className="h-10 w-auto object-contain"
              />
            </Link>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-gray-900">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-gray-900">Products</Link>
            <Link to="/contact" className="text-gray-700 hover:text-gray-900">Contact</Link>
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="hidden sm:block border border-gray-300 rounded-md px-3 py-1 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Login / User */}
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-gray-700 hover:text-gray-900">
                Hello, {userName} (Logout)
              </button>
            ) : (
              <button onClick={() => setShowLoginModal(true)} className="text-gray-700 hover:text-gray-900">
                <UserIcon className="h-6 w-6 inline-block" /> <span className="hidden sm:inline">Login</span>
              </button>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative text-gray-700 hover:text-gray-900">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          <Link to="/" className="block text-gray-700 hover:text-gray-900">Home</Link>
          <Link to="/products" className="block text-gray-700 hover:text-gray-900">Products</Link>
          <Link to="/contact" className="block text-gray-700 hover:text-gray-900">Contact</Link>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-96 relative">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              X
            </button>
            <SignIn onLoginSuccess={(user) => {
              setIsLoggedIn(true);
              setUserName(user?.name || "User");
              setShowLoginModal(false);
            }} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

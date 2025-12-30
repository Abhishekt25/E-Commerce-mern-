import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

// Global typing timer
let typingTimer: ReturnType<typeof setTimeout>;

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [cartCount, setCartCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const backendURL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:2507";

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Check login
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${backendURL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("User not found");
        const data = await res.json();

        setIsLoggedIn(true);
        setUserName(data.name || "User");
      } catch {
        setIsLoggedIn(false);
        setUserName("");
      }
    };

    fetchUser();
  }, [backendURL]);

  // 🔹 Cart count
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const total = cart.reduce(
        (sum: number, item: { quantity: number }) =>
          sum + (item.quantity || 0),
        0
      );
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  // 🔹 Sync search with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setSearchQuery(params.get("search") || "");
  }, [location.search]);

  // 🔹 Debounced search
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
    navigate("/");
  };

  return (
    <header className="bg-gray-900 text-gray-300 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 items-center">

          {/* Logo */}
          <Link to="/">
            <img
              src="/shopab.jpeg"
              alt="Shop Logo"
              className="h-12 w-auto object-contain bg-white px-2 rounded"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 text-lg">
            <Link to="/" className="hover:text-white transition">Home</Link>
            <Link to="/products" className="hover:text-white transition">Products</Link>
            <Link to="/contact" className="hover:text-white transition">Contact</Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-5">

            {/* Search */}
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search products..."
              className="hidden sm:block bg-gray-800 border border-gray-700 text-gray-200
                         rounded-md px-4 py-2 text-sm placeholder-gray-400
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            {/* Login / User */}
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hover:text-white transition text-sm"
              >
                Hello, {userName} (Logout)
              </button>
            ) : (
              <Link
                to="/login"
                className="hover:text-white transition flex items-center gap-1"
              >
                <UserIcon className="h-6 w-6" />
                <span className="hidden sm:inline">Login</span>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative hover:text-white transition">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden hover:text-white"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 px-6 pb-6 space-y-3 text-lg">
          <Link to="/" className="block hover:text-white transition">Home</Link>
          <Link to="/products" className="block hover:text-white transition">Products</Link>
          <Link to="/contact" className="block hover:text-white transition">Contact</Link>
          {!isLoggedIn && (
            <Link to="/login" className="block hover:text-white transition">
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;

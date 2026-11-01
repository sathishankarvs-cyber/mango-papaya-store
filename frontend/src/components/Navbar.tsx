import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  User as UserIcon,
  Search,
  Menu,
  X,
  LogOut,
  Package,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { itemCount, fetchCart } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-amber-200/60 transition-all duration-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <span className="text-3xl transform group-hover:scale-110 transition-transform duration-200">🥭</span>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent">
                PSN Farm
              </span>
              <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-orange-600 uppercase">
                Pure Mango & Papaya
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-medium text-stone-700">
            <Link to="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <Link to="/products" className="hover:text-amber-600 transition-colors">
              All Fruits
            </Link>
            <Link
              to="/mango"
              className="flex items-center space-x-1 hover:text-amber-600 text-amber-700 font-semibold transition-colors"
            >
              <span>🥭</span>
              <span>Mangoes</span>
            </Link>
            <Link
              to="/papaya"
              className="flex items-center space-x-1 hover:text-orange-600 text-orange-700 font-semibold transition-colors"
            >
              <span>🍈</span>
              <span>Papayas</span>
            </Link>
            <Link to="/about" className="hover:text-amber-600 transition-colors">
              Our Orchard
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center relative w-72">
            <input
              type="text"
              placeholder="Search fruits, e.g. sweet for shakes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white/80 border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent placeholder-stone-400 transition-all shadow-inner"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5" />
          </form>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Live Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 text-stone-700 hover:text-amber-600 hover:bg-amber-100/50 rounded-full transition-all"
              aria-label="View shopping cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce shadow-md">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Profile / Auth */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-amber-100/50 transition-all border border-amber-200/80"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-stone-800 pr-2 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-amber-100 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-amber-50">
                      <p className="text-xs text-stone-500">Signed in as</p>
                      <p className="text-sm font-bold text-stone-900 truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/addresses"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-sm text-stone-700 hover:bg-amber-50 hover:text-amber-700"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Saved Addresses</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left border-t border-amber-50 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-full shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-amber-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-amber-100 py-4 space-y-3">
            <form onSubmit={handleSearch} className="relative px-2">
              <input
                type="text"
                placeholder="Search fruits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-5 top-3" />
            </form>
            <div className="flex flex-col space-y-2 px-2 font-medium">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/50"
              >
                Home
              </Link>
              <Link
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/50"
              >
                All Fruits
              </Link>
              <Link
                to="/mango"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/50 text-amber-700 font-bold"
              >
                🥭 Mangoes
              </Link>
              <Link
                to="/papaya"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/50 text-orange-700 font-bold"
              >
                🍈 Papayas
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/50"
              >
                About Our Orchard
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-amber-100/50"
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

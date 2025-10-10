// src/components/AppNavbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { Menu, X, LogOut, User, ChevronDown, Home, MapPin, Info, Phone, Bolt } from "lucide-react";

export default function AppNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuVisible, setMenuVisible] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);


  // --- logout ---
  const handleSignOut = () => {
    [
      "accessToken",
      "accessTokenExpiresAtUtc",
      "refreshToken",
      "refreshTokenExpiresAtUtc",
      "email",
      "fullName",
      "roles",
    ].forEach((key) => Cookies.remove(key));

    setCurrentUser(null);
    setMenuVisible(false);
    navigate("/login");
  };

  // --- navigation links ---
  const baseLinks = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "Stations", path: "/stations", icon: <MapPin size={16} /> },
    { name: "About", path: "/about", icon: <Info size={16} /> },
    { name: "Contact", path: "/contact", icon: <Phone size={16} /> },
  ];

  const userLinks =
    currentUser?.role === "ev_owner"
      ? [...baseLinks, { name: "My Bookings", path: "/bookings/my" }]
      : baseLinks;

  const renderNavLink = (item) => (
    <Link
      key={item.name}
      to={item.path}
      onClick={() => setMobileOpen(false)}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
        location.pathname === item.path
          ? "bg-sky-50 text-sky-600"
          : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"
      }`}
    >
      <span className="flex items-center gap-2">
        {item.icon}
        {item.name}
      </span>
    </Link>
  );

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-bold bg-gradient-to-r from-sky-600 to-emerald-400 bg-clip-text text-transparent"
        >
          <Bolt size={22} className="text-sky-500" />
          <span>EVChargeHub</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {userLinks.map(renderNavLink)}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-md text-gray-600 hover:text-sky-600 hover:bg-sky-50 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {currentUser ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setMenuVisible((p) => !p)}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 bg-sky-500 rounded-full text-white flex items-center justify-center font-semibold">
                  {currentUser.name?.charAt(0).toUpperCase() ?? "U"}
                </div>
                <ChevronDown size={16} className="text-gray-600" />
              </button>

              {menuVisible && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-2 text-xs text-gray-700 border-b">
                    <div className="font-semibold">{currentUser.name}</div>
                    <div>{currentUser.email}</div>
                    <div className="capitalize text-gray-500">
                      {currentUser.role}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setMenuVisible(false)}
                    className="block px-4 py-2 hover:bg-sky-50 text-gray-700"
                  >
                    My Profile
                  </Link>

                  {currentUser.role === "backoffice" && (
                    <Link
                      to="/dashboard/view-ev-owners"
                      onClick={() => setMenuVisible(false)}
                      className="block px-4 py-2 hover:bg-sky-50 text-gray-700"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {currentUser.role === "station_operator" && (
                    <Link
                      to="/operator/dashboard"
                      onClick={() => setMenuVisible(false)}
                      className="block px-4 py-2 hover:bg-sky-50 text-gray-700"
                    >
                      Operator Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left hover:bg-sky-50 text-gray-700"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden md:flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                <User size={16} /> Sign In
              </Link>
              <Link
                to="/login"
                className="md:hidden bg-sky-600 p-2 rounded-md text-white"
              >
                <User size={16} />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 pt-3 pb-4">
          <div className="px-4 flex flex-col gap-1">{userLinks.map(renderNavLink)}</div>

          {currentUser && (
            <div className="px-4 mt-3 border-t border-gray-200 pt-3 space-y-1">
              <Link
                to="/profile"
                onClick={() => setMobileOpen(false)}
                className="block text-sm text-gray-700 hover:bg-sky-50 rounded-md px-3 py-2"
              >
                My Profile
              </Link>

              {currentUser.role === "backoffice" && (
                <Link
                  to="/dashboard/view-ev-owners"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-gray-700 hover:bg-sky-50 rounded-md px-3 py-2"
                >
                  Admin Dashboard
                </Link>
              )}

              {currentUser.role === "station_operator" && (
                <Link
                  to="/operator/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-gray-700 hover:bg-sky-50 rounded-md px-3 py-2"
                >
                  Operator Dashboard
                </Link>
              )}

              <button
                onClick={() => {
                  handleSignOut();
                  setMobileOpen(false);
                }}
                className="w-full text-left text-sm text-gray-700 hover:bg-sky-50 rounded-md px-3 py-2 flex items-center gap-2"
              >
                <LogOut size={15} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

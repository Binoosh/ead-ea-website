import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { MdAssignmentAdd } from "react-icons/md";
import { FcPlanner, FcChargeBattery, FcAddDatabase } from "react-icons/fc";
import { useNavigate, useLocation } from "react-router-dom";
import { FcContacts } from "react-icons/fc";
import { MdAddBusiness, MdPersonAdd } from "react-icons/md";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import { USER_ROLES } from "../../constants/user-roles";

export default function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedRole = Cookies.get("roles");
    if (storedRole) {
      try {
        const parsedRoles = JSON.parse(storedRole);
        const firstRole = Array.isArray(parsedRoles)
          ? parsedRoles[0]
          : parsedRoles;
        const normalizedRole =
          firstRole.toLowerCase() === "backoffice"
            ? USER_ROLES.BACKOFFICE
            : USER_ROLES.STATION_OPERATOR;
        setRole(normalizedRole);
      } catch (err) {
        console.error("Failed to parse user role from cookies", err);
      }
    }
  }, []);

  const allMenuItems = [
    {
      name: "Register EV Drivers",
      path: "/dashboard/add-ev-owners",
      icon: MdPersonAdd,
      roles: [USER_ROLES.BACKOFFICE],
    },
    {
      name: "Driver Directory",
      path: "/dashboard/view-ev-owners",
      icon: FcContacts,
      roles: [USER_ROLES.BACKOFFICE],
    },
    {
      name: "Charger Network",
      path: "/dashboard/view-charging-station",
      icon: FcChargeBattery,
      roles: [USER_ROLES.BACKOFFICE],
    },
    {
      name: "Schedule Sessions",
      path: "/dashboard/add-reservations",
      icon: MdAssignmentAdd,
      roles: [USER_ROLES.BACKOFFICE],
    },
    {
      name: "Session Calendar",
      path: "/dashboard/view-reservations",
      icon: FcPlanner,
      roles: [USER_ROLES.BACKOFFICE],
    },
    {
      name: "Deploy Charger",
      path: "/dashboard/add-charging-station",
      icon: MdAddBusiness,
      roles: [USER_ROLES.STATION_OPERATOR],
    },
    {
      name: "My Chargers",
      path: "/dashboard/view-my-charging-station",
      icon: FcChargeBattery,
      roles: [USER_ROLES.STATION_OPERATOR],
    },
    {
      name: "My Sessions",
      path: "/dashboard/view-my-reservations",
      icon: FcPlanner,
      roles: [USER_ROLES.STATION_OPERATOR],
    },
  ];

  // Filter menu items based on role
  const menuItems = role
    ? allMenuItems.filter((item) => item.roles.includes(role))
    : [];

  // common sidebar classes
  const baseClasses = `
    fixed inset-y-0 left-0 z-20 transform bg-gray-800 shadow-2xl border-r border-purple-500/20
    transition-all duration-300
    md:static md:shadow-none
  `;

  return (
    <>
      {/* Mobile hamburger */}
      <button
        className="p-3 m-3 text-2xl rounded-xl md:hidden fixed top-0 left-0 z-30 bg-gray-800 text-amber-400 border border-amber-500/30"
        onClick={() => setIsOpen(true)}
        aria-label="Open sidebar"
      >
        <HiMenu />
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${baseClasses}
          ${collapsed ? "w-20" : "w-72"}
          ${isOpen ? "translate-x-0" : "-translate-x-full"}  
          md:translate-x-0
        `}
      >
        {/* Mobile close */}
        <div className="flex items-center justify-between p-4 md:hidden border-b border-purple-500/20">
          <h2 className="text-lg font-bold text-white">Navigation</h2>
          <button
            className="p-2 text-2xl rounded-lg bg-gray-700 text-amber-400 border border-amber-500/30"
            onClick={() => setIsOpen(false)}
            aria-label="Close sidebar"
          >
            <HiX />
          </button>
        </div>

        {/* Desktop collapse toggle */}
        <div className="flex-1 px-3 space-y-1 min-w-72 mt-4">
          {collapsed ? (
            <div className="flex justify-start">
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
              >
                <HiChevronDoubleRight />
              </button>
            </div>
          ) : (
            <div className="flex justify-end">
              <button
                onClick={() => setCollapsed((c) => !c)}
                className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 w-full flex justify-end transition-colors"
              >
                <HiChevronDoubleLeft />
              </button>
            </div>
          )}
        </div>

        {/* Menu Items */}
        <nav className="flex-1 px-3 space-y-2 mt-6">
          {menuItems.length > 0 ? (
            menuItems.map(({ name, path, icon: Icon }) => {
              const active = location.pathname === path;
              return (
                <button
                  key={path}
                  onClick={() => {
                    navigate(path);
                    setIsOpen(false);
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${
                      active
                        ? "bg-gradient-to-r from-purple-600/30 to-amber-600/30 text-white font-bold border border-amber-500/50 shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white border border-transparent hover:border-amber-500/30"
                    }
                  `}
                >
                  <Icon className="mr-4 text-xl flex-shrink-0 text-amber-400" />
                  {/* hide text when collapsed */}
                  <span className={`${collapsed ? "hidden" : "block"} flex-1 font-medium`}>
                    {name}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-4 text-center text-gray-400 bg-gray-700/50 rounded-xl border border-gray-600">
              Loading navigation...
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-purple-500/20 mt-8">
            <div className="text-xs text-gray-400 text-center">
              Powering the Future of Mobility
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
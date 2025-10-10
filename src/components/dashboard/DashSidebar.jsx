import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { USER_ROLES } from "../../constants/user-roles";
import { GiElectric, GiCharging, GiOfficeChair, GiNotebook } from "react-icons/gi";
import { BsPeopleFill, BsFillCalendarCheckFill } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { HiOutlineMenuAlt2, HiOutlineX, HiChevronLeft, HiChevronRight } from "react-icons/hi";

export default function DashSidebar() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const roleCookie = Cookies.get("roles");
    if (!roleCookie) return;
    try {
      const parsed = JSON.parse(roleCookie);
      const mainRole = Array.isArray(parsed) ? parsed[0] : parsed;
      const normalized =
        mainRole.toLowerCase() === "backoffice"
          ? USER_ROLES.BACKOFFICE
          : USER_ROLES.STATION_OPERATOR;
      setUserRole(normalized);
    } catch {
      setUserRole(null);
    }
  }, []);

  const allItems = [
    {
      label: "Add EV Owners",
      route: "/dashboard/add-ev-owners",
      icon: BsPeopleFill,
      access: [USER_ROLES.BACKOFFICE],
    },
    {
      label: "EV Owners List",
      route: "/dashboard/view-ev-owners",
      icon: GiOfficeChair,
      access: [USER_ROLES.BACKOFFICE],
    },
    {
      label: "Add Charge Station",
      route: "/dashboard/add-charging-station",
      icon: IoMdAddCircle,
      access: [USER_ROLES.BACKOFFICE],
    },
    {
      label: "View Charge Station",
      route: "/dashboard/view-charging-station",
      icon: GiElectric,
      access: [USER_ROLES.BACKOFFICE],
    },
    {
      label: "Add Reservations",
      route: "/dashboard/add-reservations",
      icon: GiNotebook,
      access: [USER_ROLES.BACKOFFICE],
    },
    {
      label: "View Reservations",
      route: "/dashboard/view-reservations",
      icon: BsFillCalendarCheckFill,
      access: [USER_ROLES.BACKOFFICE],
    },
    {
      label: "View Reservations",
      route: "/dashboard/view-reservations",
      icon: GiCharging,
      access: [USER_ROLES.STATION_OPERATOR],
    },
  ];

  const filteredItems = userRole
    ? allItems.filter((item) => item.access.includes(userRole))
    : [];

  return (
    <>
      <button
        onClick={() => setVisible(true)}
        className="md:hidden fixed top-3 left-3 z-30 bg-white text-2xl p-2 rounded-lg shadow-lg text-emerald-700"
      >
        <HiOutlineMenuAlt2 />
      </button>

      {visible && (
        <div
          onClick={() => setVisible(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static z-30 bg-emerald-800 text-white h-full flex flex-col transition-all duration-300 ease-in-out shadow-xl
        ${collapsed ? "w-20" : "w-64"} ${visible ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="flex items-center justify-between px-4 py-3 md:hidden">
          <h2 className="text-lg font-semibold">Navigation</h2>
          <button
            onClick={() => setVisible(false)}
            className="text-white text-2xl bg-emerald-900 p-2 rounded-md"
          >
            <HiOutlineX />
          </button>
        </div>

        <div className="px-2 py-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center justify-center w-full p-2 bg-emerald-900 rounded-md hover:bg-emerald-700"
          >
            {collapsed ? <HiChevronRight /> : <HiChevronLeft />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 space-y-2">
          {filteredItems.length ? (
            filteredItems.map(({ label, route, icon: Icon }) => {
              const active = location.pathname === route;
              return (
                <button
                  key={route}
                  onClick={() => {
                    navigate(route);
                    setVisible(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left ${
                    active
                      ? "bg-emerald-600 text-white font-medium"
                      : "hover:bg-emerald-700"
                  }`}
                >
                  <Icon className="text-xl flex-shrink-0" />
                  <span className={`${collapsed ? "hidden" : "block"} flex-1`}>
                    {label}
                  </span>
                </button>
              );
            })
          ) : (
            <div className="text-center text-emerald-200 py-6 text-sm">
              Loading menu...
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

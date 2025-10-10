import { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";

export default function DashboardLayout({ title, loading, children }) {
  const [selectedSection, setSelectedSection] = useState(null);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar
        activeSection={selectedSection}
        setActiveSection={setSelectedSection}
      />

      <main className="flex-1 m-4 p-6 bg-white rounded-2xl shadow-md">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-semibold text-sky-700">
            {title || "Dashboard"}
          </h2>
          <div className="hidden sm:block text-gray-500 text-sm">
            <span className="px-3 py-1 bg-gray-100 rounded-md">
              Status: Active
            </span>
          </div>
        </header>

        <div className="border-b-2 border-sky-600 mb-6"></div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-[70vh]">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-sky-300 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4 h-4 bg-sky-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="mt-5 text-sky-600 text-lg font-medium animate-pulse">
              Please wait...
            </p>
          </div>
        ) : (
          <section className="transition-opacity duration-300 ease-in-out">
            {children}
          </section>
        )}
      </main>
    </div>
  );
}

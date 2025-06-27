// src/components/AdminLayout.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white font-sans">
      {/* Sidebar */}
      <aside className={`bg-white dark:bg-gray-800 w-64 p-6 space-y-4 shadow-md transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed md:static z-30`}>
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block hover:text-indigo-600">Dashboard</Link>
        </nav>
      </aside>

      {/* Content */}
      <div className="flex-1 ml-0 md:ml-64">
        <header className="flex items-center justify-between p-4 shadow bg-white dark:bg-gray-800 sticky top-0 z-20">
          <button className="md:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <span className="text-2xl">☰</span>
          </button>
          <button
            onClick={() => document.documentElement.classList.toggle("dark")}
            className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            Toggle Theme
          </button>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}

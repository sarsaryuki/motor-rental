import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="w-full bg-white dark:bg-gray-900 shadow-md px-8 py-3 flex justify-between items-center">
      {/* Left side - navigation */}
      <nav className="flex space-x-8">
        <Link
          to="/"
          className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 font-semibold"
        >
          Home
        </Link>
        <Link
          to="/book"
          className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 font-semibold"
        >
          Book
        </Link>
        <Link
          to="/dashboard"
          className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 font-semibold"
        >
          Dashboard
        </Link>
        <Link
          to="/login"
          className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 font-semibold"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="text-gray-700 dark:text-gray-300 hover:text-yellow-500 dark:hover:text-yellow-400 font-semibold"
        >
          Register
        </Link>
      </nav>

      {/* Right side - logo text */}
      <div className="text-yellow-600 dark:text-yellow-400 font-bold text-xl cursor-pointer select-none">
        Motorcycle Booking
      </div>
    </header>
  )
}

export default Header

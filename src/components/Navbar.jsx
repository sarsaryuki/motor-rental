import { Link } from "react-router-dom";

export default function Navbar({ isAuthenticated, handleLogout }) {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between">
      <Link to="/" className="text-2xl font-bold text-yellow-400">MotorBike</Link>
      <div className="space-x-4">
        <Link to="/" className="hover:text-yellow-400">Home</Link>
        <Link to="/book" className="hover:text-yellow-400">Book</Link>
        <Link to="/booking-history" className="hover:text-yellow-400">History</Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:text-yellow-400">Dashboard</Link>
            <button onClick={handleLogout} className="hover:text-red-400">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-yellow-400">Login</Link>
            <Link to="/register" className="hover:text-yellow-400">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

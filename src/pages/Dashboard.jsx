import React, { useState, useEffect, useRef } from "react";
import { FaMoon, FaSun, FaMotorcycle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserDashboard() {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [bikes, setBikes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("available");
  const [history, setHistory] = useState([]);

  const menuRef = useRef(null);
  const availableRef = useRef(null);
  const historyRef = useRef(null);
  const favoritesRef = useRef(null);
  const profileRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
  const fetchBikes = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/bikes/public");
      setBikes(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch bikes:", err);
    }
  };
  fetchBikes();
}, []);


useEffect(() => {
  const fetchBookingHistory = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3001/api/bookings/history", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHistory(res.data); // Make sure your backend returns array of booking records
    } catch (err) {
      console.error("❌ Failed to fetch booking history:", err);
    }
  };
  fetchBookingHistory();
}, []);


  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleBook = (bike) => {
    navigate(`/book/${bike.id}`, { state: { bike } });
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleMenuClick = (section) => {
    const sectionMap = {
      available: availableRef,
      history: historyRef,
      favorites: favoritesRef,
      profile: profileRef,
    };

    sectionMap[section]?.current?.scrollIntoView({ behavior: "smooth" });

    setTimeout(() => {
      setActiveSection(section);
      setMenuOpen(false);
    }, 300);
  };

  const filteredBikes = bikes.filter((bike) => {
    const term = searchTerm.toLowerCase();
    return (
      bike.status === "Available" &&
      (bike.name.toLowerCase().includes(term) ||
        bike.location.toLowerCase().includes(term) ||
        bike.barangay.toLowerCase().includes(term) ||
        bike.owner.toLowerCase().includes(term) ||
        bike.pricePerDay.toString().includes(term) ||
        bike.pricePerHour.toString().includes(term))
    );
  });

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300">
        <div
          className="relative z-50 p-4 flex justify-between items-center gap-4"
          ref={menuRef}
        >
          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <FaMotorcycle className="text-indigo-700 text-3xl group-hover:scale-110 transition-transform" />
            <div className="text-2xl font-bold flex items-center space-x-1">
              <span className="text-indigo-700 dark:text-indigo-400">
                Sakay
              </span>
              <span className="text-yellow-500 dark:text-yellow-300">Ko</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-grow flex justify-center">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
                  />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search by city, owner, price..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Theme + Menu */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-2xl hover:scale-110 transition-transform"
              title="Toggle Theme"
            >
              {darkMode ? (
                <FaSun className="text-yellow-400" />
              ) : (
                <FaMoon className="text-indigo-700" />
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Menu
            </button>
          </div>

          {/* Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 text-gray-800 dark:text-gray-200">
              {[
                { key: "available", label: "Available" },
                { key: "history", label: "Booking History" },
                { key: "favorites", label: "Favorites" },
                { key: "profile", label: "Profile" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleMenuClick(key)}
                  className="block w-full text-left px-4 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-600 rounded transition"
                >
                  {label}
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 hover:bg-red-100 dark:hover:bg-red-600 text-red-600 dark:text-red-300 rounded transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main className="px-6 md:px-10 py-10 max-w-7xl mx-auto space-y-20">
          {/* Available Bikes */}
          {activeSection === "available" && (
            <section ref={availableRef}>
              <h2 className="text-3xl font-semibold mb-6 border-b pb-2">
                Available Bikes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {filteredBikes.length > 0 ? (
                  filteredBikes.map((bike) => {
                    const isFavorite = favorites.includes(bike.id);
                    return (
                      <div
                        key={bike.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-xl transition"
                      >
                        <img
                          src={`http://localhost:3001${bike.image}`}
                          alt={bike.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold text-indigo-600">
                          {bike.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {bike.specs}
                        </p>
                        <p className="font-semibold">
                          ₱{bike.pricePerDay}/day | ₱{bike.pricePerHour}/hour
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {bike.location}, {bike.barangay}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Owner: {bike.owner}
                        </p>
                        <div className="mt-2 text-sm text-green-600 font-semibold">
                          Available
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <button
                            onClick={() => toggleFavorite(bike.id)}
                            className={`text-2xl ${
                              isFavorite
                                ? "text-yellow-400"
                                : "text-gray-400 hover:text-yellow-400"
                            } transition`}
                          >
                            {isFavorite ? "★" : "☆"}
                          </button>
                          <button
                            onClick={() => handleBook(bike)}
                            className="px-4 py-2 text-white font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-lg transition"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 col-span-full text-center">
                    No bikes matched your search.
                  </p>
                )}
              </div>
            </section>
          )}

          {/* Booking History */}
          {activeSection === "history" && (
            <section ref={historyRef}>
              <h2 className="text-3xl font-semibold mb-6 border-b pb-2">
                Booking History
              </h2>
              {history.length === 0 ? (
                <p>No booking history found.</p>
              ) : (
                <table className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
                  <thead>
                    <tr className="text-left border-b border-gray-300 dark:border-gray-700">
                      <th className="px-6 py-3">Bike</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3">From</th>
                      <th className="px-6 py-3">To</th>
                      <th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr
                        key={h.id}
                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-700"
                      >
                         <td className="px-6 py-4">{h.bikeName}</td>
  <td className="px-6 py-4">{h.location}</td>
  <td className="px-6 py-4">{new Date(h.pickupDate).toLocaleString()}</td>
  <td className="px-6 py-4">{new Date(h.returnDate).toLocaleString()}</td>
  <td className="px-6 py-4">{h.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>
          )}

          {/* Favorites Section */}
          {activeSection === "favorites" && (
            <section ref={favoritesRef}>
              <h2 className="text-3xl font-semibold mb-6 border-b pb-2">
                Favorites
              </h2>
              {favorites.length === 0 ? (
                <p>No favorites yet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {bikes
                    .filter((b) => favorites.includes(b.id))
                    .map((bike) => (
                      <div
                        key={bike.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 hover:shadow-xl transition"
                      >
                        <img
                          src={`http://localhost:3001${bike.image}`}
                          alt={bike.name}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                        <h3 className="text-xl font-semibold text-indigo-600">
                          {bike.name}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                          {bike.specs}
                        </p>
                        <p className="font-semibold">
                          ₱{bike.pricePerDay}/day | ₱{bike.pricePerHour}/hour
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Location: {bike.location}
                        </p>
                        <div className="mt-4 flex justify-between items-center">
                          <button
                            onClick={() => toggleFavorite(bike.id)}
                            className="text-2xl text-yellow-400"
                          >
                            ★
                          </button>
                          <button
                            onClick={() => handleBook(bike)}
                            className="px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </section>
          )}

          {/* Profile Section */}
          {activeSection === "profile" && (
            <section ref={profileRef}>
              <h2 className="text-3xl font-semibold mb-6 border-b pb-2">
                Profile
              </h2>
              <p>
                This is the user profile section. (Add your user details here.)
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

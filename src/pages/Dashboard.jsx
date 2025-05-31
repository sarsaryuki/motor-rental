import React, { useState } from 'react'; 

const bikesData = [
  {
    id: 1,
    name: 'Honda Click 125i Black Edition',
    specs: '125cc, Automatic',
    priceDisplay: '₱300/day',
    location: 'Davao City',
    status: 'Available',
    availableTime: '',
    image: '/Honda Click 125i Black Edition.jpg',
  },
  {
    id: 2,
    name: 'Yamaha NMAX Connected',
    specs: '155cc, Automatic',
    priceDisplay: '₱400/day',
    location: 'Bislig City',
    status: 'Booked',
    availableTime: '3 PM',
    image: '/Yamaha NMAX Connected.jpg',
  },
  {
    id: 3,
    name: 'Suzuki Raider R150 FI',
    specs: '150cc, Manual',
    priceDisplay: '₱350/day',
    location: 'Davao City',
    status: 'Available',
    availableTime: '',
    image: '/Suzuki Raider R150 FI.jpg',
  },
  {
    id: 4,
    name: 'Kawasaki Ninja 400 ABS',
    specs: '250cc, Manual',
    priceDisplay: '₱600/day',
    location: 'Bislig City',
    status: 'Booked',
    availableTime: '5 PM',
    image: '/Kawasaki Ninja 400 ABS.jpg',
  },
  {
    id: 5,
    name: 'Rusi 125cc',
    specs: '125cc, Automatic',
    priceDisplay: '₱250/day',
    location: 'Bislig City',
    status: 'Available',
    availableTime: '',
    image: '/Rusi 125cc.png',
  },
  {
    id: 6,
    name: 'KTM Duke 200 Adventure',
    specs: '200cc, Manual',
    priceDisplay: '₱500/day',
    location: 'Davao City',
    status: 'Booked',
    availableTime: '7 PM',
    image: '/KTM Duke 200 Adventure.jpg',
  },
  {
    id: 7,
    name: 'Honda Wave 110 Alpha',
    specs: '110cc, Manual',
    priceDisplay: '₱200/day',
    location: 'Bislig City',
    status: 'Available',
    availableTime: '',
    image: '/Honda Wave 110 Alpha.jpg',
  },
  {
    id: 8,
    name: 'Yamaha Mio Sporty',
    specs: '115cc, Automatic',
    priceDisplay: '₱280/day',
    location: 'Davao City',
    status: 'Available',
    availableTime: '',
    image: '/Yamaha Mio Sporty.png',
  },
  {
    id: 9,
    name: 'Suzuki Smash 115',
    specs: '115cc, Manual',
    priceDisplay: '₱230/day',
    location: 'Bislig City',
    status: 'Booked',
    availableTime: '6 PM',
    image: '/Suzuki Smash 115.png',
  },
  {
    id: 10,
    name: 'Yamaha Aerox',
    specs: '155cc, Automatic',
    priceDisplay: '₱420/day',
    location: 'Davao City',
    status: 'Available',
    availableTime: '',
    image: '/aerox.jpg',
  },
];


// Sample bookings for user
const sampleBookings = [
  {
    id: 101,
    bikeName: 'Honda Click 125i',
    location: 'Davao City',
    fromDate: '2025-06-01',
    toDate: '2025-06-05',
    status: 'Confirmed',
    returnDeadline: '2025-06-05T18:00:00',
  },
  {
    id: 102,
    bikeName: 'Yamaha NMAX',
    location: 'Bislig City',
    fromDate: '2025-06-10',
    toDate: '2025-06-12',
    status: 'Pending',
    returnDeadline: '2025-06-12T15:00:00',
  },
];

// Sample history
const sampleHistory = [
  {
    id: 201,
    bikeName: 'Suzuki Raider',
    location: 'Bislig City',
    fromDate: '2025-04-01',
    toDate: '2025-04-03',
    status: 'Completed',
  },
];

function getReturnCountdown(returnDeadline) {
  const now = new Date();
  const deadline = new Date(returnDeadline);
  const diffMs = deadline - now;
  if (diffMs <= 0) return 'Due now';

  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMin = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${diffHrs}h ${diffMin}m`;
}

export default function UserDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favorites, setFavorites] = useState([1, 3]);
  const [bookings] = useState(sampleBookings);
  const [history] = useState(sampleHistory);
  const [filteredBikes, setFilteredBikes] = useState(bikesData);

  // State to control which section to show
  // 'available' by default; can be 'history' or 'favorites'
  const [activeSection, setActiveSection] = useState('available');

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const handleBook = (bike) => {
    alert(`Booking bike: ${bike.name} at ${bike.location}`);
    // Implement booking logic here
  };

  // Menu click handler
  const handleMenuClick = (section) => {
    setActiveSection(section);
    setMenuOpen(false); // Close menu on selection
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
      } transition-colors duration-500`}
    >
      <header className="flex items-center justify-between px-8 py-4 bg-white dark:bg-gray-800 shadow-md sticky top-0 z-20">
        <h1 className="text-2xl font-semibold tracking-wide text-indigo-600 dark:text-indigo-400">
          MotorBike
        </h1>
        <div className="flex items-center space-x-4 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300 text-2xl"
            aria-label="Toggle dark mode"
            title="Toggle Dark Mode"
          >
            {darkMode ? '🌙' : '☀️'}
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Menu
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 rounded-lg shadow-lg py-2 text-gray-800 dark:text-gray-200">
              <button
                onClick={() => handleMenuClick('profile')}
                className="block w-full text-left px-4 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-600 rounded transition"
              >
                Profile
              </button>
              <button
                onClick={() => handleMenuClick('history')}
                className="block w-full text-left px-4 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-600 rounded transition"
              >
                Booking History
              </button>
              <button
                onClick={() => handleMenuClick('favorites')}
                className="block w-full text-left px-4 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-600 rounded transition"
              >
                Favorites
              </button>
              <button
                onClick={() => alert('Logging out...')}
                className="block w-full text-left px-4 py-2 hover:bg-indigo-100 dark:hover:bg-indigo-600 rounded transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="px-8 py-10 max-w-7xl mx-auto space-y-16">
        {/* Show Available Bikes always */}
        {activeSection === 'available' && (
          <section>
            <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
              Available Bikes for Rent
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {filteredBikes.map((bike) => {
                const isFavorite = favorites.includes(bike.id);
                return (
                  <div
                    key={bike.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 relative"
                  >
                    <img
                      src={bike.image}
                      alt={bike.name}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-xl font-semibold text-indigo-600">{bike.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-1">{bike.specs}</p>
                    <p className="font-semibold mb-1">{bike.priceDisplay}</p>
                    <p className="text-gray-500 dark:text-gray-400">Location: {bike.location}</p>
                    <p className="mt-2 text-sm">
                      Status:{' '}
                      {bike.status === 'Available' ? (
                        <span className="text-green-600 font-semibold">Available</span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Booked until {bike.availableTime}
                        </span>
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-4">
                      <button
                        onClick={() => toggleFavorite(bike.id)}
                        className={`text-2xl ${
                          isFavorite ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                        } transition-colors duration-300`}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        {isFavorite ? '★' : '☆'}
                      </button>

                      <button
                        onClick={() => handleBook(bike)}
                        disabled={bike.status !== 'Available'}
                        className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                          bike.status === 'Available'
                            ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {bike.status === 'Available' ? 'Book Now' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Booking History Section */}
        {activeSection === 'history' && (
          <section>
            <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
              Booking History
            </h2>
            {history.length === 0 ? (
              <p>No booking history found.</p>
            ) : (
              <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md">
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
                      <td className="px-6 py-4">{h.fromDate}</td>
                      <td className="px-6 py-4">{h.toDate}</td>
                      <td className="px-6 py-4">{h.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* Favorites Section */}
        {activeSection === 'favorites' && (
          <section>
            <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
              Favorites
            </h2>
            {favorites.length === 0 ? (
              <p>You have no favorite bikes yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {bikesData
                  .filter((bike) => favorites.includes(bike.id))
                  .map((bike) => (
                    <div
                      key={bike.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-xl transition-shadow duration-300 relative"
                    >
                      <img
                        src={bike.image}
                        alt={bike.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h3 className="text-xl font-semibold text-indigo-600">{bike.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-1">{bike.specs}</p>
                      <p className="font-semibold mb-1">{bike.priceDisplay}</p>
                      <p className="text-gray-500 dark:text-gray-400">Location: {bike.location}</p>
                      <p className="mt-2 text-sm">
                        Status:{' '}
                        {bike.status === 'Available' ? (
                          <span className="text-green-600 font-semibold">Available</span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Booked until {bike.availableTime}
                          </span>
                        )}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <button
                          onClick={() => toggleFavorite(bike.id)}
                          className="text-2xl text-yellow-400 hover:text-yellow-500 transition-colors duration-300"
                          aria-label="Remove from favorites"
                          title="Remove from favorites"
                        >
                          ★
                        </button>

                        <button
                          onClick={() => handleBook(bike)}
                          disabled={bike.status !== 'Available'}
                          className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                            bike.status === 'Available'
                              ? 'bg-indigo-600 hover:bg-indigo-700 cursor-pointer'
                              : 'bg-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {bike.status === 'Available' ? 'Book Now' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </section>
        )}

        {/* Profile Section placeholder */}
        {activeSection === 'profile' && (
          <section>
            <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">
              Profile
            </h2>
            <p>This is the user profile section (implement as needed).</p>
          </section>
        )}
      </main>
    </div>
  );
}

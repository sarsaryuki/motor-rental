  import React, { useState, useEffect, useRef } from "react";
  import { useNavigate } from "react-router-dom";
  import toast, { Toaster } from "react-hot-toast";
  import { Moon, Sun, Menu, X, Power } from "lucide-react";
  import axios from "axios";

  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  export default function AdminDashboard() {
    const navigate = useNavigate();
    const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [bikes, setBikes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [editingBikeId, setEditingBikeId] = useState(null);
    const [lightboxImage, setLightboxImage] = useState(null);
    const [lightboxLabel, setLightboxLabel] = useState("");

    const addBikeRef = useRef(null);
    const allBikesRef = useRef(null);
    const bookingsRef = useRef(null);

    const [newBike, setNewBike] = useState({
      name: "",
      specs: "",
      pricePerDay: "",
      pricePerHour: "",
      location: "",
      barangay: "",
      status: "Available",
      availableTime: "",
      image: null,
    });

    const getAuthHeaders = (isFormData = false) => {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      if (!isFormData) headers["Content-Type"] = "application/json";
      return { headers };
    };

    useEffect(() => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");
      if (!token || role !== "owner") {
        toast.error("Unauthorized access. Please log in.");
        navigate("/admin-login");
      }
    }, [navigate]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const [bikeRes, bookingRes] = await Promise.all([
            axios.get("http://localhost:3001/api/bikes/my-bikes", getAuthHeaders()),
            axios.get("http://localhost:3001/api/bookings", getAuthHeaders()),
          ]);
          setBikes(bikeRes.data);
          setBookings(bookingRes.data);

          if (bikeRes.data.length === 0) {
            setTimeout(() => scrollToRef(addBikeRef), 300);
            toast("No bikes yet. Add your first one!");
          }
        } catch (err) {
          if (err.response?.status === 401) {
            toast.error("Session expired. Please log in.");
            localStorage.clear();
            navigate("/admin-login");
          } else {
            toast.error("Failed to load data.");
            console.error("❌ Fetch error:", err);
          }
        }
      };

      fetchData();
    }, [navigate]);

    useEffect(() => {
      document.documentElement.classList.toggle("dark", darkMode);
      localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewBike((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
      setNewBike((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleAddBike = async () => {
      try {
        const formData = new FormData();
        Object.entries(newBike).forEach(([key, value]) => {
          formData.append(key, value);
        });

        const url = editingBikeId
          ? `http://localhost:3001/api/bikes/${editingBikeId}`
        : `http://localhost:3001/api/bikes/upload`;

        const method = editingBikeId ? axios.put : axios.post;

        const res = await method(url, formData, getAuthHeaders(true));

        if (editingBikeId) {
          setBikes((prev) => prev.map((b) => (b.id === editingBikeId ? res.data : b)));
          toast.success("Bike updated");
        } else {
          setBikes((prev) => [...prev, res.data]);
          toast.success("Bike added");
        }

        setNewBike({
          name: "",
          specs: "",
          pricePerDay: "",
          pricePerHour: "",
          location: "",
          barangay: "",
          status: "Available",
          availableTime: "",
          image: null,
        });
        setEditingBikeId(null);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in.");
          localStorage.clear();
          navigate("/admin-login");
        } else {
          console.error("❌ Add/Update bike error:", err);
          toast.error("Failed to save bike.");
        }
      }
    };

    const handleEdit = (bike) => {
      setEditingBikeId(bike.id);
      setNewBike({
        name: bike.name,
        specs: bike.specs,
        pricePerDay: bike.pricePerDay,
        pricePerHour: bike.pricePerHour,
        location: bike.location,
        barangay: bike.barangay,
        status: bike.status,
        availableTime: bike.availableTime,
        image: null,
      });
      scrollToRef(addBikeRef);
    };

    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:3001/api/bikes/${id}`, getAuthHeaders());
        setBikes((prev) => prev.filter((b) => b.id !== id));
        toast.success("Bike deleted");
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in.");
          localStorage.clear();
          navigate("/admin-login");
        } else {
          console.error("❌ Delete error:", err);
          toast.error("Failed to delete bike.");
        }
      }
    };

    const handleBookingStatus = async (id, newStatus) => {
      try {
        await axios.patch(
          `http://localhost:3001/api/bookings/${id}`,
          { status: newStatus },
          getAuthHeaders()
        );
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
        );
        toast.success(`Booking ${newStatus}`);
      } catch (err) {
        if (err.response?.status === 401) {
          toast.error("Session expired. Please log in.");
          localStorage.clear();
          navigate("/admin-login");
        } else {
          console.error("❌ Status update failed:", err);
          toast.error("Failed to update booking status");
        }
      }
    };


    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white flex">
        <Toaster />

        {/* Sidebar */}
        <aside
          className={`fixed z-40 inset-y-0 left-0 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out bg-gradient-to-b from-indigo-600 via-indigo-700 to-indigo-800 text-white w-72 shadow-2xl px-6 py-8 space-y-8 lg:translate-x-0 lg:static lg:block lg:w-20 hover:lg:w-72 group rounded-tr-3xl rounded-br-3xl overflow-hidden`}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white transition-all duration-300 ease-in-out group-hover:inline hidden lg:group-hover:inline">
              Admin
            </h2>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <ul className="space-y-4 text-base font-medium">
            <li
              className="cursor-pointer transition hover:text-yellow-300 hover:translate-x-1"
              onClick={() => scrollToRef(addBikeRef)}
            >
              ➕ <span className="hidden lg:group-hover:inline">Add Bike</span>
            </li>
            <li
              className="cursor-pointer transition hover:text-yellow-300 hover:translate-x-1"
              onClick={() => scrollToRef(allBikesRef)}
            >
              🚲 <span className="hidden lg:group-hover:inline">All Bikes</span>
            </li>
            <li
              className="cursor-pointer transition hover:text-yellow-300 hover:translate-x-1"
              onClick={() => scrollToRef(bookingsRef)}
            >
              📅 <span className="hidden lg:group-hover:inline">Bookings</span>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <div className="flex-1 lg:ml-60 px-4 sm:px-8 py-6">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl mb-10 px-8 py-6 flex items-center justify-between border border-indigo-100 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-600 dark:text-gray-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-300 tracking-wide">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                {darkMode ? (
                  <Sun className="w-6 h-6 text-yellow-400" />
                ) : (
                  <Moon className="w-6 h-6 text-gray-700" />
                )}
              </button>

              {/* 🚪 Logout Button */}
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("role");
                  navigate("/");
                  toast.success("Logged out");
                }}
                className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800 transition"
                title="Logout"
              >
                <Power className="w-6 h-6 text-red-500" />
              </button>

              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg">
                A
              </div>
            </div>
          </header>

          {/* Add Bike Section */}
          <section className="mb-16">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-3xl p-10 border border-indigo-100 dark:border-gray-700">
              <h2 className="text-3xl font-bold mb-8 text-indigo-600 dark:text-indigo-300">
                🚲 Add New Bike
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  name="name"
                  placeholder="Bike Name"
                  value={newBike.name}
                  onChange={handleInputChange}
                  className="input-style"
                />
                <input
                  name="specs"
                  placeholder="Specifications"
                  value={newBike.specs}
                  onChange={handleInputChange}
                  className="input-style"
                />
                <input
                  name="pricePerDay"
                  placeholder="₱ Price per Day"
                  value={newBike.pricePerDay}
                  onChange={handleInputChange}
                  className="input-style"
                />
                <input
                  name="pricePerHour"
                  placeholder="₱ Price per Hour"
                  value={newBike.pricePerHour}
                  onChange={handleInputChange}
                  className="input-style"
                />
                <input
                  name="location"
                  placeholder="City"
                  value={newBike.location}
                  onChange={handleInputChange}
                  className="input-style"
                />
                <input
                  name="barangay"
                  placeholder="Barangay"
                  value={newBike.barangay}
                  onChange={handleInputChange}
                  className="input-style"
                />
                <input
                  name="availableTime"
                  placeholder="Available Time"
                  value={newBike.availableTime}
                  onChange={handleInputChange}
                  className="input-style"
                />
              
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="input-style file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                <select
                  name="status"
                  value={newBike.status}
                  onChange={handleInputChange}
                  className="input-style"
                >
                  <option value="Available">Available</option>
                  <option value="Booked">Booked</option>
                </select>
              </div>
              <button
                onClick={handleAddBike}
                className="w-full mt-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-2xl shadow transition duration-300 ease-in-out transform hover:scale-105"
              >
                + Add Bike
              </button>
            </div>
          </section>

          {/* All Uploaded Bikes Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-6 text-indigo-600 dark:text-indigo-300">
              All Uploaded Bikes
            </h2>
            {bikes.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400">
                No bikes uploaded yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {bikes.map((bike) => (
                  <div
                    key={bike.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
                  >
                    {bike.image && (
                      <img
                        src={`http://localhost:3001${bike.image}`}
                        alt={bike.name}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4 space-y-2">
                      <h3 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                        {bike.name}
                      </h3>
                      <p className="text-sm">{bike.specs}</p>
                      <p className="text-sm">
                        ₱{bike.pricePerDay}/day | ₱{bike.pricePerHour}/hour
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {bike.location}, {bike.barangay}
                      </p>
                    
                      <p className="text-sm">
                        {bike.status === "Available" ? (
                          <span className="text-green-600 font-semibold">
                            Available
                          </span>
                        ) : (
                          <span className="text-red-600 font-semibold">
                            Booked until {bike.availableTime}
                          </span>
                        )}
                      </p>

                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleEdit(bike)}
                          className="w-1/2 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bike.id)}
                          className="w-1/2 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Booking Requests Section */}
          <section ref={bookingsRef} className="mt-20 px-4">
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white mb-12">
              Booking Requests
            </h2>

            {/* Lightbox Image Viewer */}
            {lightboxImage && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-2xl">
                  <button
                    onClick={() => setLightboxImage(null)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-red-500 text-xl font-bold"
                  >
                    ×
                  </button>
                  <img
                    src={lightboxImage}
                    alt="Preview"
                    className="w-full max-h-[75vh] object-contain rounded-xl"
                  />
                  <p className="mt-3 text-sm text-center text-slate-600 dark:text-slate-300">
                    {lightboxLabel}
                  </p>
                </div>
              </div>
            )}

            {bookings.length === 0 ? (
              <div className="text-center text-slate-400 py-24">
                No booking requests available.
              </div>
            ) : (
              <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 max-w-7xl mx-auto">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-slate-500 font-medium">User</p>
                        <p className="text-base font-semibold text-slate-800 dark:text-white">
                          {b.user}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${
                          b.status === "Pending"
                            ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                            : b.status === "Accepted"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-slate-700 dark:text-slate-300 mb-4">
                      <p>
                        <span className="font-medium">Bike:</span> {b.bikeName}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span>{" "}
                        {b.type || "N/A"}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {b.location}
                      </p>
                      <p>
                        <span className="font-medium">From:</span>{" "}
                        {new Date(b.pickupDate).toLocaleTimeString("en-PH", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                      <p>
                        <span className="font-medium">To:</span>{" "}
                        {new Date(b.returnDate).toLocaleTimeString("en-PH", {
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span>{" "}
                        {b.paymentStatus}
                      </p>
                    </div>

                    {/* Media */}
                    <div className="flex gap-6 mt-4">
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Valid ID</p>
                        {b.validId ? (
                          <img
                            src={`http://localhost:3001/uploads/${b.validId}`}
                            alt="Valid ID"
                            className="w-16 h-16 rounded-md object-cover border hover:ring-2 hover:ring-indigo-400 cursor-pointer transition"
                            onClick={() => {
                              setLightboxImage(
                                `http://localhost:3001/uploads/${b.validId}`
                              );
                              setLightboxLabel("Valid ID");
                            }}
                          />
                        ) : (
                          <p className="text-xs text-slate-400">N/A</p>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 mb-1">Selfie</p>
                        {b.selfie ? (
                          <img
                            src={`http://localhost:3001/uploads/${b.selfie}`}
                            alt="Selfie"
                            className="w-16 h-16 rounded-full object-cover border hover:ring-2 hover:ring-indigo-400 cursor-pointer transition"
                            onClick={() => {
                              setLightboxImage(
                                `http://localhost:3001/uploads/${b.selfie}`
                              );
                              setLightboxLabel("Selfie");
                            }}
                          />
                        ) : (
                          <p className="text-xs text-slate-400">N/A</p>
                        )}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                      <button
                        onClick={() => handleBookingStatus(b.id, "Accepted")}
                        className="text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleBookingStatus(b.id, "Declined")}
                        className="text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

import React, { useState } from 'react';

const Book = () => {
  const [formData, setFormData] = useState({
    name: '',
    motorcycleModel: '',
    date: '',
    time: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Booking confirmed for ${formData.name} on ${formData.date} at ${formData.time} for ${formData.motorcycleModel}`);
    setFormData({ name: '', motorcycleModel: '', date: '', time: '' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl px-10 py-12"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Motorcycle Booking
        </h2>

        {/* Input Fields */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-gray-600 font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">Motorcycle Model</label>
            <input
              type="text"
              name="motorcycleModel"
              value={formData.motorcycleModel}
              onChange={handleChange}
              required
              placeholder="e.g., Honda CB500X"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-2">Time</label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-md"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default Book;

const BookingForm = () => {
  return (
    <form className="bg-white shadow-lg rounded-xl p-6 max-w-xl mx-auto space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Book Your Ride</h2>
      
      <input type="text" placeholder="Full Name" className="w-full border p-2 rounded-lg" />
      <input type="tel" placeholder="Phone Number" className="w-full border p-2 rounded-lg" />
      <input type="date" className="w-full border p-2 rounded-lg" />
      <input type="time" className="w-full border p-2 rounded-lg" />
      
      <select className="w-full border p-2 rounded-lg">
        <option>Select Motorcycle</option>
        <option>Yamaha MT-15</option>
        <option>Honda CBR500R</option>
      </select>
      
      <button type="submit" className="bg-yellow-600 hover:bg-yellow-700 text-white w-full py-2 px-4 rounded-lg">
        Submit Booking
      </button>
    </form>
  );
};

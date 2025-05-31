const dummyHistory = [
  { id: 1, model: "Yamaha YZF-R3", date: "2025-05-25", time: "10:00 AM" },
  { id: 2, model: "Honda CBR500R", date: "2025-05-20", time: "2:00 PM" },
]

export default function BookingHistory() {
  return (
    <div className="max-w-3xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Booking History</h2>
      <ul className="space-y-3">
        {dummyHistory.map(item => (
          <li key={item.id} className="border p-3 rounded">
            <p><strong>Model:</strong> {item.model}</p>
            <p><strong>Date:</strong> {item.date}</p>
            <p><strong>Time:</strong> {item.time}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

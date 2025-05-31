const motorcycles = [
  { id: 1, model: "Yamaha YZF-R3", image: "https://via.placeholder.com/300", price: "₱800/day" },
  { id: 2, model: "Honda CBR500R", image: "https://via.placeholder.com/300", price: "₱1,000/day" },
  { id: 3, model: "Kawasaki Ninja 400", image: "https://via.placeholder.com/300", price: "₱950/day" },
]

export default function MotorcycleList() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {motorcycles.map((bike) => (
        <div key={bike.id} className="bg-white rounded-lg shadow p-4">
          <img src={bike.image} alt={bike.model} className="rounded mb-3 w-full h-48 object-cover" />
          <h2 className="text-xl font-semibold">{bike.model}</h2>
          <p className="text-gray-600">{bike.price}</p>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Book Now</button>
        </div>
      ))}
    </div>
  )
}

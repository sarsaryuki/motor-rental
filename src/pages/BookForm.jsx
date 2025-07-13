import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BookForm({ bike }) {
  const navigate = useNavigate();
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [type, setType] = useState("day");
  const [validIdFile, setValidIdFile] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [validIdPreview, setValidIdPreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [modalImage, setModalImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [agree, setAgree] = useState(false);

  const imageUrl = `http://localhost:3001${bike.image}`;

  useEffect(() => {
    if (!pickupDate || !returnDate) return;
    const pickup = new Date(pickupDate);
    const returnTime = new Date(returnDate);
    const diffHours = (returnTime - pickup) / (1000 * 60 * 60);
    if (diffHours <= 0) {
      setError("Return date must be after pickup date.");
      setTotal(0);
      return;
    }
    if (type === "hour") {
      if (diffHours < 2) {
        setError("Minimum of 2 hours required for hourly booking.");
        setTotal(0);
        return;
      }
      setTotal(Math.ceil(diffHours) * bike.pricePerHour);
      setError("");
    } else {
      const days = Math.ceil(diffHours / 24);
      setTotal(days * bike.pricePerDay);
      setError("");
    }
  }, [pickupDate, returnDate, type, bike]);
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validIdFile || !selfieFile)
    return setError("Upload both Valid ID and Selfie.");
  if (!agree) return setError("Agree to terms and policies before booking.");

  const token = localStorage.getItem("token");
  if (!token) return navigate("/login");

  const formData = new FormData();
  formData.append("bikeId", bike.id);
  formData.append("type", type);
  formData.append("pickupDate", pickupDate);
  formData.append("returnDate", returnDate);
  formData.append("totalPrice", total);
  formData.append("validId", validIdFile);
  formData.append("selfie", selfieFile);

  try {
    await axios.post("http://localhost:3001/api/bookings/upload", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    alert("Booking submitted successfully!");
    navigate("/dashboard");
  } catch (err) {
    alert("Booking failed.");
    console.error("❌ Booking error:", err);
  }
};


  const handleClose = () => {
    navigate("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl p-8 relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-2xl text-gray-700 hover:text-black"
        >
          &times;
        </button>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Bike Info */}
          <div className="lg:w-1/2 w-full space-y-3">
            <div className="w-full aspect-video overflow-hidden rounded-xl">
              <img
                src={imageUrl}
                alt={bike.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <h2 className="text-3xl font-bold text-indigo-700">{bike.name}</h2>
            <p className="text-gray-600 text-sm italic">{bike.specs}</p>
            <p className="text-sm text-gray-500">
              {bike.location}, {bike.barangay}
            </p>
            <p className="text-sm text-gray-400">Owner: {bike.owner}</p>
            <p className="text-sm text-gray-400">
              Status:{" "}
              <span
                className={
                  bike.status === "Available"
                    ? "text-green-600 font-semibold"
                    : "text-red-500 font-semibold"
                }
              >
                {bike.status}
              </span>
            </p>
            <p className="text-base mt-1 font-semibold text-indigo-600">
              ₱{bike.pricePerHour}/hr • ₱{bike.pricePerDay}/day
            </p>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="lg:w-1/2 w-full space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Booking Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="day">Per Day</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Pickup Date
                </label>
                <input
                  type="datetime-local"
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Return Date
                </label>
                <input
                  type="datetime-local"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>

            {total > 0 && (
              <div className="text-green-600 font-semibold">
                Total: ₱{total.toLocaleString()}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Valid ID
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setValidIdFile(e.target.files[0]);
                    setValidIdPreview(URL.createObjectURL(e.target.files[0]));
                  }}
                  className="w-full border rounded px-3 py-1.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Upload Selfie
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    setSelfieFile(e.target.files[0]);
                    setSelfiePreview(URL.createObjectURL(e.target.files[0]));
                  }}
                  className="w-full border rounded px-3 py-1.5"
                />
              </div>
            </div>

            <div className="flex gap-4">
              {validIdPreview && (
                <img
                  src={validIdPreview}
                  alt="Valid ID"
                  className="w-20 h-20 rounded border object-cover"
                />
              )}
              {selfiePreview && (
                <img
                  src={selfiePreview}
                  alt="Selfie"
                  className="w-20 h-20 rounded border object-cover"
                />
              )}
            </div>

            <div className="bg-gray-50 p-4 rounded-md border text-sm text-gray-700">
              <p className="font-semibold mb-2">Agreement Terms:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Late returns will incur a ₱200/hour penalty.</li>
                <li>
                  Bookings canceled within 24 hours of pickup are
                  non-refundable.
                </li>
                <li>
                  All submissions are subject to verification and may be
                  canceled if invalid.
                </li>
              </ul>
              <label className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mr-2"
                />
                I agree to the terms and policies
              </label>
            </div>

            {error && (
              <p className="text-red-600 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

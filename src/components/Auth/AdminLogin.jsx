import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🧪 Login response:", data);

      if (!response.ok || !data.token || !data.role) {
        alert(data.message || "❌ Invalid login response.");
        return;
      }

      const role = data.role.trim().toLowerCase();
      console.log("🧪 Role received:", role);

      if (role !== "owner") {
        alert("❌ Access denied. You are not authorized as an owner.");
        return;
      }

      // ✅ Store session securely
      localStorage.clear();
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", role);
      localStorage.setItem("email", data.email); // Optional: store user email

      alert("✅ Admin login successful!");
      navigate("/admin");
    } catch (err) {
      console.error("❌ Login Error:", err);
      alert("❌ Server error. Check the console for more details.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-100 to-indigo-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="text-center mb-6">
          <ShieldCheck className="w-12 h-12 mx-auto text-red-600 mb-2" />
          <h2 className="text-3xl font-bold text-red-700">Admin Login</h2>
          <p className="text-sm text-gray-500">Sign in to manage your rentals</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-gray-600">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don’t have an admin account?{" "}
          <Link to="/admin-register" className="text-red-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

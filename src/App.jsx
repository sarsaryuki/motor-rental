import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import BookFormWrapper from "./pages/BookFormWrapper"; // ✅ Wrapper for passing bike state

// Auth Components
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import AdminLogin from "./components/Auth/AdminLogin";
import AdminRegister from "./components/Auth/AdminRegister";

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin-register" element={<AdminRegister />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminDashboard />} />

      {/* Dynamic Booking Route (with bike info via state) */}
      <Route path="/book/:id" element={<BookFormWrapper />} />

      {/* Optional: Not Found route */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

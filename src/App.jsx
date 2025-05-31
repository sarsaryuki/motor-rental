import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Book from "./pages/Book";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PrivateRoute from "./components/Auth/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/book" element={<Book />} />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Optionally, add 404 page */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
}

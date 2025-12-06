import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // <-- tunggu localStorage

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setUser(storedUser);
    setLoading(false); // selesai cek
  }, []);

  if (loading) return null; // atau loader

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />}
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard setUser={setUser} /> : <Navigate to="/" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

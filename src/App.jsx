import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Wallet from "./pages/Wallet";
import ChartPage from "./pages/Chart";
import Settings from "./pages/Settings";
import Sidebar from "./components/Sidebar"; // import Sidebar

export default function App() {
  const [user, setUser] = useState(null);

  const handleAdd = () => {
    console.log("Add clicked");
  };

  return (
    <Router>
      {/* Sidebar muncul hanya jika user login */}
      {user && <Sidebar onAdd={handleAdd} onLogout={() => setUser(null)} />}

      <Routes>
        {/* Route login */}
        <Route
          path="/"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" replace />}
        />

        {/* Route signup */}
        <Route path="/signup" element={<SignUp />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/" replace />}
        />
        <Route
          path="/wallet"
          element={user ? <Wallet /> : <Navigate to="/" replace />}
        />
        <Route
          path="/chart"
          element={user ? <ChartPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate to="/" replace />}
        />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

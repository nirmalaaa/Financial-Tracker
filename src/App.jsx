import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Dashboard";      
import Wallet from "./pages/Wallet";
import ChartPage from "./pages/Chart";
import Settings from "./pages/Settings";

export default function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>

        {/* Jika belum login → hanya bisa akses Login & SignUp */}
        {!user && (
          <>
            <Route path="/" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<SignUp />} />
          </>
        )}

        {/* Jika sudah login → semua page bisa dibuka */}
        {user && (
          <>
            <Route path="/" element={<Dashboard />} />     
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/chart" element={<ChartPage />} />
            <Route path="/settings" element={<Settings />} />
          </>
        )}

      </Routes>
    </Router>
  );
}

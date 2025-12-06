import { FaHome, FaUser, FaPlus, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ onAdd, onLogout }) {
  const [hoverUser, setHoverUser] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

  const username = "Nirmala"; // bisa diambil dari auth
  const email = "nirmala@example.com";

  const handleLogout = () => {
    setShowLogoutModal(false);
    onLogout && onLogout(); // reset user di App.jsx
    navigate("/");           // redirect ke login
  };

  return (
    <>
      <div className="fixed top-1/2 left-6 -translate-y-1/2 flex flex-col items-center gap-6
                      bg-white/5 backdrop-blur-xl border border-white/20
                      p-5 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.08)] z-50">
        {/* Logo */}
        <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 via-orange-400 to-purple-500
                        rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold
                        shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-110 transition-all duration-300">
          F
        </div>

        {/* Home */}
        <button className="text-black text-2xl p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
          <FaHome className="text-black" />
        </button>

        {/* USER PROFILE HOVER */}
        <div className="relative" onMouseEnter={() => setHoverUser(true)} onMouseLeave={() => setHoverUser(false)}>
          <button className="text-black text-2xl p-3 rounded-xl hover:bg-white/10 transition-all duration-300">
            <FaUser className="text-black" />
          </button>

          {hoverUser && (
            <div
              className="absolute left-16 top-1/2 -translate-y-1/2 w-60 p-4 rounded-2xl
                        backdrop-blur-lg bg-black/30 shadow-xl z-[99]"
              style={{
                backgroundImage: "linear-gradient(to bottom right, #340e57, #9b7c32)"
              }}
            >
              <p className="font-bold text-white text-lg">{username}</p>
              <p className="text-white/90 text-sm">{email}</p>
            </div>
          )}
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => setShowLogoutModal(true)}
          className="mt-2 w-14 p-3 rounded-xl bg-red-600 shadow-[0_0_25px_rgba(255,0,0,0.4)]
                     hover:bg-red-700 hover:scale-110 transition-all duration-300 flex items-center justify-center text-black"
        >
          <FaSignOutAlt />
        </button>

        {/* ADD BUTTON */}
        <button
          onClick={onAdd}
          className="mt-4 bg-yellow-400 p-4 rounded-2xl shadow-[0_0_25px_rgba(255,193,7,0.4)]
                     hover:bg-yellow-500 hover:scale-110 transition-all duration-300"
        >
          <FaPlus className="text-black text-xl" />
        </button>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-lg w-80 flex flex-col gap-4">
            <p className="text-white text-center text-lg font-semibold">Apakah Anda mau log out?</p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-gray-600/60 p-3 rounded-xl hover:bg-gray-700/70 text-black transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600/80 p-3 rounded-xl hover:bg-red-700/90 text-black transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

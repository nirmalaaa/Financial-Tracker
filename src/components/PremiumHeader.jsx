// src/components/PremiumHeader.jsx
import { useState, useEffect } from "react";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";

export default function PremiumHeader({ user, onLogout }) {
  const [open, setOpen] = useState(false);

  // Tutup dropdown ketika klik luar
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-menu")) setOpen(false);
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  const initial = user?.nama?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="
      w-full sticky top-0 z-50
      bg-white/10 backdrop-blur-2xl
      border-b border-white/10
      shadow-[0_0_25px_rgba(255,255,255,0.06)]
    ">
      <div className="max-w-[1400px] mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo Gradient */}
        <div className="
          px-4 py-2 rounded-xl text-2xl font-extrabold
          bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-300
          text-transparent bg-clip-text
          drop-shadow-[0_0_8px_rgba(255,200,255,0.5)]
        ">
          FinanceFlow
        </div>

        {/* PROFILE */}
        <div className="relative profile-menu">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 group"
          >
            {/* Avatar Glow */}
            <div className="
              w-12 h-12 rounded-full flex items-center justify-center
              text-lg font-bold
              bg-gradient-to-br from-purple-500 via-pink-400 to-yellow-400
              shadow-[0_0_15px_rgba(255,200,255,0.55)]
              text-black border border-white/20
            ">
              {initial}
            </div>

            {/* Name + Dropdown icon */}
            <div className="text-white font-medium text-left">
              <div className="flex items-center gap-2">
                <span className="opacity-90">{user?.nama}</span>
                <FaChevronDown
                  className={`text-sm transition-transform ${
                    open ? "rotate-180" : ""
                  }`}
                />
              </div>
              <span className="text-xs opacity-60">{user?.username}</span>
            </div>
          </button>

          {/* DROPDOWN */}
          {open && (
            <div
              className="
                absolute right-0 mt-3 w-60 p-4 rounded-2xl
                bg-white/10 backdrop-blur-xl border border-white/20
                animate-slideDown origin-top
                shadow-[0_10px_40px_rgba(0,0,0,0.35)]
              "
            >
              {/* Profil */}
              <div className="pb-3 border-b border-white/20">
                <p className="text-white font-semibold text-lg">{user?.nama}</p>
                <p className="text-white/70 text-sm mt-1">{user?.username}</p>
                <p className="text-white/70 text-sm">{user?.email}</p>
              </div>

              {/* Logout button */}
              <button
                onClick={onLogout}
                className="
                  mt-3 w-full flex items-center gap-2 justify-center
                  bg-red-500/80 hover:bg-red-500
                  p-2 rounded-xl text-white font-semibold
                  transition
                "
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

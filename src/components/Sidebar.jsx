import { FaHome, FaWallet, FaChartPie, FaCog, FaPlus } from "react-icons/fa";
import { useState } from "react";

export default function Sidebar({ onAdd }) {
  const [hovered, setHovered] = useState(null);

  const menu = [
    { icon: <FaHome />, label: "Home" },
    { icon: <FaWallet />, label: "Wallet" },
    { icon: <FaChartPie />, label: "Stats" },
    { icon: <FaCog />, label: "Settings" },
  ];

  return (
    <div
      className="
        fixed top-1/2 left-6 -translate-y-1/2 flex flex-col items-center gap-6
        bg-white/10 backdrop-blur-xl border border-white/20
        p-5 rounded-3xl shadow-[0_0_50px_rgba(255,255,255,0.08)]
      "
    >
      {/* Logo */}
<div
  className="
    w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500
    rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold
    shadow-[0_0_30px_rgba(255,255,255,0.5)]
    hover:scale-110 transition-all duration-300
  "
>
  F
</div>
{/* Menu */}
{menu.map((item, idx) => (
  <button
    key={idx}
    onMouseEnter={() => setHovered(idx)}
    onMouseLeave={() => setHovered(null)}
    className={`
      text-black text-2xl p-3 rounded-xl transition-all duration-300
      ${
        hovered === idx
          ? "bg-white/20 border border-white/30 scale-110 shadow-[0_0_20px_rgba(255,255,255,0.25)]"
          : "hover:bg-white/10 hover:border hover:border-white/20"
      }
    `}
  >
    {/* Icon forced to black */}
    <span className="text-black">{item.icon}</span>
  </button>
))}

{/* Add Button */}
<button
  onClick={onAdd}
  className="
    mt-4 bg-yellow-400 p-4 rounded-2xl shadow-[0_0_25px_rgba(255,193,7,0.4)]
    hover:bg-yellow-500 hover:scale-110 transition-all duration-300
  "
>
  <FaPlus className="text-black text-xl" />
</button>

    </div>
  );
}

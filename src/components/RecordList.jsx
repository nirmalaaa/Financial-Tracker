import { useState } from "react";
import {
  FaMoneyBill,
  FaShoppingCart,
  FaBus,
  FaFilm,
  FaGift,
  FaUtensils,
  FaHeart,
  FaBook,
  FaShoppingBasket,
  FaChartLine,
  FaUserClock
} from "react-icons/fa";

// ICON SESUAI KATEGORI
const categoryIcons = {
  Gaji: <FaMoneyBill />,
  Bonus: <FaGift />,
  Investasi: <FaChartLine />,
  "Part-Time": <FaUserClock />,
  Makanan: <FaUtensils />,
  Transportasi: <FaBus />,
  Belanja: <FaShoppingCart />,
  Hiburan: <FaFilm />,
  Kesehatan: <FaHeart />,
  Hadiah: <FaGift />,
  Edukasi: <FaBook />,
  Groceries: <FaShoppingBasket />,
};

// WARNA SESUAI KATEGORI
const categoryColors = {
  Gaji: "bg-green-500/20 border-green-400/40",
  Bonus: "bg-yellow-500/20 border-yellow-400/40",
  Investasi: "bg-pink-500/20 border-pink-400/40",
  "Part-Time": "bg-purple-500/20 border-purple-400/40",
  Makanan: "bg-orange-500/20 border-orange-400/40",
  Transportasi: "bg-blue-500/20 border-blue-400/40",
  Belanja: "bg-red-500/20 border-red-400/40",
  Hiburan: "bg-purple-500/20 border-purple-400/40",
  Kesehatan: "bg-green-500/20 border-green-400/40",
  Hadiah: "bg-pink-500/20 border-pink-400/40",
  Edukasi: "bg-yellow-500/20 border-yellow-400/40",
  Groceries: "bg-lime-500/20 border-lime-400/40",
};

export default function RecordList({ records }) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      {/* LIST RECORD */}
      <div
        className="overflow-y-auto space-y-2 pr-2"
        style={{ maxHeight: "100%" }}
      >
        {records.length === 0 && (
          <p className="text-white/50 text-center mt-4">Belum ada record</p>
        )}

        {records.map((r, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedRecord(r)}
            className="flex items-center gap-3 p-3 rounded-xl 
                       bg-white/10 backdrop-blur-xl border border-white/10 
                       shadow-[0_0_10px_rgba(255,255,255,0.05)] cursor-pointer
                       transition-all duration-200 hover:shadow-[0_0_18px_rgba(255,255,255,0.25)]
                       hover:border-white/20"
          >
            {/* Icon */}
            <div
              className={`w-10 h-10 flex items-center justify-center rounded-full border text-white text-lg ${categoryColors[r.category]}`}
            >
              {categoryIcons[r.category]}
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="font-semibold text-white text-sm">{r.title}</p>
              <p className="text-white/60 text-xs">{r.category}</p>
              <p className="text-white/40 text-[10px] mt-0.5">
                {r.date ? new Date(r.date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric"
                }) : today}
              </p>
            </div>

            {/* Amount */}
            <div className={`font-semibold text-sm ${r.type === "Income" ? "text-green-400" : "text-red-400"}`}>
              {r.type === "Income" ? "+" : "-"} Rp {Number(r.amount).toLocaleString("id-ID")}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETAIL */}
      {selectedRecord && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-96 max-h-[80vh] overflow-hidden text-white relative flex flex-col">

            {/* Close Button */}
            <button
              onClick={() => setSelectedRecord(null)}
              className="absolute top-4 right-4 text-white bg-black/20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="font-bold text-lg mb-1">{selectedRecord.title}</h2>
            <p className="text-white/60 mb-3">{selectedRecord.category}</p>

            {/* Amount */}
            <p className="font-semibold text-sm mb-4">
              {selectedRecord.type === "Income" ? "+" : "-"} Rp {Number(selectedRecord.amount).toLocaleString("id-ID")}
            </p>

            {/* Optional Sub Items */}
            {selectedRecord.subItems && selectedRecord.subItems.length > 0 && (
              <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                {selectedRecord.subItems.map((sub, idx) => (
                  <div key={idx} className="flex justify-between text-sm bg-white/5 p-2 rounded-xl">
                    <span>{sub.subtitle}</span>
                    <span className={selectedRecord.type === "Income" ? "text-green-400" : "text-red-400"}>
                      {selectedRecord.type === "Income" ? "+" : "-"} Rp {Number(sub.amount).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}

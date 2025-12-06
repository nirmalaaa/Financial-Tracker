import { useState } from "react";
import { FaMoneyBill, FaShoppingCart, FaBus, FaFilm, FaGift } from "react-icons/fa";

const categoryIcons = {
  Salary: <FaMoneyBill />,
  Bonus: <FaGift />,
  Food: <FaShoppingCart />,
  Transport: <FaBus />,
  Entertainment: <FaFilm />,
};

const categoryColors = {
  Salary: "bg-green-500/20 border-green-400/40",
  Bonus: "bg-yellow-500/20 border-yellow-400/40",
  Food: "bg-orange-500/20 border-orange-400/40",
  Transport: "bg-blue-500/20 border-blue-400/40",
  Entertainment: "bg-pink-500/20 border-pink-400/40",
};

export default function RecordList({ records }) {
  const [selectedRecord, setSelectedRecord] = useState(null);

  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Gabungkan sub-items berdasarkan title
  const groupedRecords = records.reduce((acc, r) => {
    const key = r.title;
    if (!acc[key]) acc[key] = { ...r, subItems: [] };
    acc[key].subItems.push({ subtitle: r.subtitle || r.title, amount: r.amount });
    return acc;
  }, {});

  return (
    <>
      {/* RECORD LIST */}
      <div className="overflow-y-auto flex-1 space-y-2 pr-2 max-h-[calc(100vh-150px)]">
        {records.length === 0 && (
          <p className="text-white/50 text-center mt-4">Belum ada record</p>
        )}

        {Object.values(groupedRecords).map((r, idx) => {
          const totalAmount = r.subItems.reduce((sum, item) => sum + item.amount, 0);
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_0_10px_rgba(255,255,255,0.05)] cursor-pointer transition-all duration-150"
              onClick={() => setSelectedRecord(r)}
            >
              {/* Icon */}
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full border ${
                  categoryColors[r.category]
                } text-white text-lg`}
              >
                {categoryIcons[r.category] || <FaMoneyBill />}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-white text-sm">{r.title}</p>
                <p className="text-white/60 text-xs">{r.category}</p>
                <p className="text-white/40 text-xxs mt-0.5">{today}</p>
              </div>

              {/* Total Amount */}
              <div
                className={`font-semibold text-sm ${
                  r.type === "Income" ? "text-green-400" : "text-red-400"
                }`}
              >
                {r.type === "Income" ? "+" : "-"} Rp {Number(totalAmount).toLocaleString("id-ID")}
              </div>
            </div>
          );
        })}
      </div>

        {/* MODAL DETAIL */}
        {selectedRecord && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-96 max-h-[80vh] overflow-hidden text-white relative">

              {/* Close Button */}
              <button
                onClick={() => setSelectedRecord(null)}
                className="absolute top-4 right-4 text-white bg-black/20 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/20 transition-all"
              >
                ✕
              </button>

              {/* Record Title & Category */}
              <h2 className="font-bold text-lg mb-1">{selectedRecord.title}</h2>
              <p className="text-white/60 mb-3">{selectedRecord.category}</p>
              <p className="font-semibold text-sm mb-4">
                Total: {selectedRecord.type === "Income" ? "+" : "-"} Rp{" "}
                {Number(
                  selectedRecord.subItems.reduce((sum, item) => sum + item.amount, 0)
                ).toLocaleString("id-ID")}
              </p>

              {/* Sub-items Scrollable */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                {selectedRecord.subItems.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between text-sm bg-white/5 p-2 rounded-xl"
                  >
                    <span>{sub.subtitle}</span>
                    <span
                      className={
                        selectedRecord.type === "Income" ? "text-green-400" : "text-red-400"
                      }
                    >
                      {selectedRecord.type === "Income" ? "+" : "-"} Rp{" "}
                      {Number(sub.amount).toLocaleString("id-ID")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

    </>
  );
}

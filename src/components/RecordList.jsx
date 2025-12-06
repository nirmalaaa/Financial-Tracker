import { 
  FaMoneyBill, 
  FaShoppingCart, 
  FaBus, 
  FaFilm, 
  FaGift 
} from "react-icons/fa";

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
  // Hari ini buat setiap record
  const today = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="overflow-y-auto flex-1 space-y-3 pr-2 max-h-[calc(100vh-150px)]">
      {records.length === 0 && (
        <p className="text-white/50 text-center mt-4">Belum ada record</p>
      )}

      {records.map((r, idx) => (
        <div
          key={idx}
          className="
            flex items-center gap-4 p-4 rounded-2xl
            bg-white/10 backdrop-blur-xl border border-white/10
            shadow-[0_0_20px_rgba(255,255,255,0.05)]
            hover:scale-105 transition-all duration-200
          "
        >
          {/* Icon */}
          <div
            className={`
              w-12 h-12 flex items-center justify-center rounded-full 
              border ${categoryColors[r.category]}
              text-white text-lg
            `}
          >
            {categoryIcons[r.category] || <FaMoneyBill />}
          </div>

          {/* Info */}
          <div className="flex-1">
            <p className="font-semibold text-white">{r.title}</p>
            <p className="text-white/60 text-sm">{r.category}</p>
            <p className="text-white/40 text-xs mt-1">{today}</p>
          </div>

          {/* Amount */}
          <div className={`font-semibold ${r.type === "Income" ? "text-green-300" : "text-red-400"}`}>
            Rp {Number(r.amount).toLocaleString("id-ID")}
          </div>
        </div>
      ))}
    </div>
  );
}

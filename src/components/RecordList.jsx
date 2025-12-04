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
  return (
    <div className="overflow-y-auto flex-1 space-y-3 pr-2">
      {records.map((r, idx) => (
        <div
          key={idx}
          className="
            flex items-center gap-4 p-4 rounded-2xl
            bg-white/10 backdrop-blur-xl border border-white/10
            shadow-[0_0_20px_rgba(255,255,255,0.05)]
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

          {/* Title + Category */}
          <div className="flex-1">
            <p className="font-semibold text-white">{r.title}</p>
            <p className="text-white/60 text-sm">{r.category}</p>
          </div>

          {/* Amount */}
          <div className="font-semibold text-yellow-300">
            Rp {Number(r.amount).toLocaleString("id-ID")}
          </div>
        </div>
      ))}
    </div>
  );
}

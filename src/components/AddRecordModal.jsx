import { useState } from "react";
import {
  FaTimes,
  FaMoneyBillWave,
  FaShoppingCart,
  FaCar,
  FaGift,
  FaUtensils,
  FaGamepad,
  FaHeart,
  FaBook,
  FaShoppingBasket,
} from "react-icons/fa";


const incomeCategories = [
  { name: "Salary", color: "#34d399", icon: <FaMoneyBillWave /> },
  { name: "Bonus", color: "#facc15", icon: <FaGift /> },
];

const expenseCategories = [
  { name: "Food", color: "#fbbf24", icon: <FaUtensils /> },
  { name: "Transport", color: "#60a5fa", icon: <FaCar /> },
  { name: "Shopping", color: "#f87171", icon: <FaShoppingCart /> },
  { name: "Entertainment", color: "#f472b6", icon: <FaGamepad /> },

  // NEW Categories Below
  { name: "Health", color: "#34d399", icon: <FaHeart /> },
  { name: "Bills", color: "#a78bfa", icon: <FaMoneyBillWave /> },
  { name: "Education", color: "#fcd34d", icon: <FaBook /> },
  { name: "Groceries", color: "#86efac", icon: <FaShoppingBasket /> },
];


export default function AddRecordModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(null);

  const handleAdd = () => {
    if (!title || !amount || !category) return;
    onAdd({ title, amount: parseInt(amount), category: category.name });
    setTitle("");
    setAmount("");
    setCategory(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className="
          bg-white/10 backdrop-blur-xl border border-white/10
          p-6 rounded-3xl w-96 shadow-[0_0_40px_rgba(255,255,255,0.08)]
          relative animate-fade-in text-white
        "
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="
            absolute top-3 right-3 text-white/60 hover:text-white transition
          "
        >
          <FaTimes size={20} />
        </button>

        <h3 className="text-2xl font-bold mb-5 text-center">
          Add Record
        </h3>

        {/* Title Input */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="
            w-full mb-3 p-3 rounded-xl bg-white/5 border border-white/10
            placeholder-white/40 text-white
            focus:outline-none focus:ring-2 focus:ring-yellow-400/50
          "
        />

        {/* Amount Input */}
        <input
          type="number"
          placeholder="Amount (Rp)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="
            w-full mb-4 p-3 rounded-xl bg-white/5 border border-white/10
            placeholder-white/40 text-white
            focus:outline-none focus:ring-2 focus:ring-yellow-400/50
          "
        />

        {/* INCOME */}
        <p className="text-white/80 mb-2 font-semibold">Income</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {incomeCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-white font-semibold
                transition-all backdrop-blur-md border
                ${
                  category?.name === cat.name
                    ? "border-white/40 bg-white/20 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }
              `}
              style={{ color: cat.color }}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* EXPENSES */}
        <p className="text-white/80 mb-2 font-semibold">Expenses</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {expenseCategories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setCategory(cat)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-xl text-white font-semibold
                transition-all backdrop-blur-md border
                ${
                  category?.name === cat.name
                    ? "border-white/40 bg-white/20 scale-110 shadow-[0_0_15px_rgba(255,255,255,0.25)]"
                    : "border-white/10 bg-white/5 hover:bg-white/10"
                }
              `}
              style={{ color: cat.color }}
            >
              {cat.icon}
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleAdd}
          className="
            w-full bg-yellow-400 text-black p-3 rounded-2xl font-bold
            shadow-[0_0_25px_rgba(255,193,7,0.5)]
            hover:bg-yellow-500 hover:scale-[1.02] transition-all
          "
        >
          Add Record
        </button>
      </div>
    </div>
  );
}

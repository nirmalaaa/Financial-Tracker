import { useState } from "react";
import {
  FaMoneyBillWave,
  FaShoppingCart,
  FaCar,
  FaGift,
  FaUtensils,
  FaGamepad,
  FaHeart,
  FaBook,
  FaShoppingBasket,
  FaUserClock,
  FaMoneyCheckAlt,
  FaChartLine
} from "react-icons/fa";

export default function AddRecordModal({ isOpen, onClose, onAdd }) {
  const [tab, setTab] = useState("expenses");
  const [step, setStep] = useState("category");

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mainTitle, setMainTitle] = useState("");
  const [amount, setAmount] = useState(""); // income
  const [subItems, setSubItems] = useState([{ subtitle: "", amount: "" }]); // expenses

  const today = new Date().toISOString().split("T")[0];

  const incomeCategories = [
    { name: "Gaji", color: "#34d399", icon: <FaMoneyBillWave />, sfx: "/sfx/coin.mp3" },
    { name: "Bonus", color: "#facc15", icon: <FaMoneyCheckAlt />, sfx: "/sfx/coin-recieved.mp3" },
    { name: "Investasi", color: "#fb4774", icon: <FaChartLine />, sfx: "/sfx/coin.mp3" },
    { name: "Part-Time", color: "#d04eff", icon: <FaUserClock />, sfx: "/sfx/coin.mp3" },
  ];

  const expenseCategories = [
    { name: "Makanan", color: "#fbbf24", icon: <FaUtensils />, sfx: "/sfx/food.mp3" },
    { name: "Transportasi", color: "#60a5fa", icon: <FaCar />, sfx: "/sfx/transport.mp3" },
    { name: "Belanja", color: "#f87171", icon: <FaShoppingCart />, sfx: "/sfx/shopping.mp3" },
    { name: "Hiburan", color: "#f472b6", icon: <FaGamepad />, sfx: "/sfx/fun.mp3" },
    { name: "Kesehatan", color: "#34d399", icon: <FaHeart />, sfx: "/sfx/health.mp3" },
    { name: "Hadiah", color: "#a78bfa", icon: <FaGift />, sfx: "/sfx/gift.mp3" },
    { name: "Edukasi", color: "#fcd34d", icon: <FaBook />, sfx: "/sfx/education.mp3" },
    { name: "Groceries", color: "#86efac", icon: <FaShoppingBasket />, sfx: "/sfx/groceries.mp3" },
  ];

  if (!isOpen) return null;

  const categories = tab === "income" ? incomeCategories : expenseCategories;
  const glassColor = (hex) => `${hex}33`;

  const reset = () => {
    setStep("category");
    setSelectedCategory(null);
    setMainTitle("");
    setAmount("");
    setSubItems([{ subtitle: "", amount: "" }]);
  };

  const handleDone = () => {
    if (!selectedCategory || !mainTitle) return;

    const audio = new Audio(selectedCategory.sfx);
    audio.currentTime = 0;
    audio.play();

    if (tab === "income") {
      onAdd({
        title: mainTitle,
        subtitle: "",
        amount: parseInt(amount) || 0,
        category: selectedCategory.name,
        date: today,
        type: "Income",
      });
    } else {
      subItems.forEach((sub) => {
        if (sub.amount) {
          onAdd({
            title: mainTitle,
            subtitle: sub.subtitle,
            amount: parseInt(sub.amount),
            category: selectedCategory.name,
            date: today,
            type: "Expense",
          });
        }
      });
    }

    reset();
    onClose();
  };


  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-50">

      <button
        onClick={onClose}
        className="absolute top-10 right-10 text-black text-lg bg-black/20 hover:bg-black/30 border border-black/30 backdrop-blur-xl w-9 h-9 flex items-center justify-center rounded-full shadow-lg z-50"
      >
        ✕
      </button>

      <div className="relative w-[480px] min-h-[450px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-xl text-white overflow-hidden">

        {/* Tabs */}
        <div className="flex mb-6 bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-white/10">
          {["income", "expenses"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                reset();
              }}
              className={`flex-1 py-2 rounded-xl font-bold border border-white/20 backdrop-blur-lg transition-all shadow ${
                tab === t
                  ? "bg-purple/30 text-black shadow-lg"
                  : "bg-yellow/5 text-black/60 hover:bg-black/10"
              }`}
            >
              {t === "income" ? "Pemasukan" : "Pengeluaran"}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="relative w-full h-[400px] overflow-hidden">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform:
                step === "category"
                  ? "translateX(0%)"
                  : step === "title"
                  ? "translateX(-100%)"
                  : "translateX(-200%)",
            }}
          >
            {/* Category */}
            <div className="min-w-full">
              <h3 className="text-xl font-bold mb-4 text-center">
                {tab === "income" ? "Pilih Kategori Pemasukan" : "Pilih Kategori Pengeluaran"}
              </h3>
              <div className="grid grid-cols-2 gap-4 max-h-[240px] overflow-y-auto pr-1 mb-6">
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat)}
                    style={{ backgroundColor: glassColor(cat.color), borderColor: cat.color }}
                    className={`flex items-center gap-3 p-4 rounded-2xl font-semibold border backdrop-blur-lg transition-all ${
                      selectedCategory?.name === cat.name ? "ring-2 ring-white" : ""
                    }`}
                  >
                    <div className="text-2xl">{cat.icon}</div>
                    {cat.name}
                  </button>
                ))}
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setStep("title")}
                  className="w-full p-3 bg-yellow-400 rounded-xl text-black font-bold hover:bg-yellow-500"
                >
                  Berikutnya
                </button>
              )}
            </div>

            {/* Title / Income Amount */}
            <div className="min-w-full flex flex-col gap-4">
              <input
                placeholder="Judul"
                value={mainTitle}
                onChange={(e) => setMainTitle(e.target.value)}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
              />
              {tab === "income" && (
                <>
                  <input
                    placeholder="Harga (Rp)"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10"
                  />
                  <button
                    onClick={handleDone}
                    className="w-full p-3 bg-green-400 rounded-xl text-black font-bold hover:bg-green-500"
                  >
                    Selesai
                  </button>
                </>
              )}
              {tab === "expenses" && mainTitle && (
                <button
                  onClick={() => setStep("subItems")}
                  className="w-full p-3 bg-yellow-400 rounded-xl text-black font-bold hover:bg-yellow-500"
                >
                  Berikutnya
                </button>
              )}
            </div>

            {/* SubItems → Expenses */}
            <div className="min-w-full flex flex-col gap-4 relative h-full">

              {/* Scroll Wrapper */}
              <div className="flex flex-col gap-4 max-h-[400px] overflow-y-auto pr-1 pb-24">
                {subItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      placeholder="Keterangan"
                      value={item.subtitle}
                      onChange={(e) => {
                        const newItems = [...subItems];
                        newItems[idx].subtitle = e.target.value;
                        setSubItems(newItems);
                      }}
                      className="flex-1 p-3 rounded-xl bg-white/5 border border-white/10"
                    />
                    <input
                      placeholder="Harga (Rp)"
                      type="number"
                      value={item.amount}
                      onChange={(e) => {
                        const newItems = [...subItems];
                        newItems[idx].amount = e.target.value;
                        setSubItems(newItems);
                      }}
                      className="w-32 p-3 rounded-xl bg-white/5 border border-white/10"
                    />
                  </div>
                ))}
              </div>

              {/* Floating Buttons (Elegan, bukan FAB) */}
              <div className="absolute bottom-0 left-0 w-full px-4 pb-4 bg-gradient-to-t from-black/20 to-transparent pt-4">
                <div className="flex gap-3">

                  <button
                    onClick={() => setSubItems([...subItems, { subtitle: "", amount: "" }])}
                    className="flex-1 py-3 rounded-2xl font-bold text-black
                    bg-yellow-400 shadow-md shadow-yellow-300/30 border border-yellow-500/30
                    hover:bg-yellow-500 hover:shadow-yellow-400/40 transition-all"
                  >
                    + Tambah
                  </button>

                  <button
                    onClick={handleDone}
                    className="flex-1 py-3 rounded-2xl font-bold text-black
                    bg-green-400 shadow-md shadow-green-300/30 border border-green-500/30
                    hover:bg-green-500 hover:shadow-green-400/40 transition-all"
                  >
                    Selesai
                  </button>

                </div>
              </div>

            </div>


          </div>
        </div>

      </div>
    </div>
  );
}

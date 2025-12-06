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
  FaCloudUploadAlt,
} from "react-icons/fa";

export default function AddRecordModal({ isOpen, onClose, onAdd }) {
  const [tab, setTab] = useState("expenses");
  const [step, setStep] = useState("category");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [manualItems, setManualItems] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");

  const [billImage, setBillImage] = useState(null);

  const today = new Date().toISOString().split("T")[0];

  const incomeCategories = [
    { name: "Salary", color: "#34d399", icon: <FaMoneyBillWave /> },
    { name: "Bonus", color: "#facc15", icon: <FaGift /> },
  ];

  const expenseCategories = [
    { name: "Food", color: "#fbbf24", icon: <FaUtensils /> },
    { name: "Transport", color: "#60a5fa", icon: <FaCar /> },
    { name: "Shopping", color: "#f87171", icon: <FaShoppingCart /> },
    { name: "Entertainment", color: "#f472b6", icon: <FaGamepad /> },
    { name: "Health", color: "#34d399", icon: <FaHeart /> },
    { name: "Bills", color: "#a78bfa", icon: <FaMoneyBillWave /> },
    { name: "Education", color: "#fcd34d", icon: <FaBook /> },
    { name: "Groceries", color: "#86efac", icon: <FaShoppingBasket /> },
  ];

  if (!isOpen) return null;

  const categories = tab === "income" ? incomeCategories : expenseCategories;
  const glassColor = (hex) => `${hex}33`;

  // Add manual item into list
  const addManualTemp = () => {
    if (!currentTitle || !currentAmount) return;
    setManualItems((prev) => [
      ...prev,
      {
        title: currentTitle,
        amount: parseInt(currentAmount),
        category: selectedCategory.name,
        date: today,
      },
    ]);
    setCurrentTitle("");
    setCurrentAmount("");
  };

  // Submit all manual items to dashboard
  const submitManual = () => {
    manualItems.forEach((item) => onAdd(item));
    setManualItems([]);
    setStep("category");
    setSelectedCategory(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-xl z-50">

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute top-10 right-10 text-black text-lg bg-black/20 hover:bg-white/30 border border-black/30 backdrop-blur-xl w-9 h-9 flex items-center justify-center rounded-full shadow-lg z-50"
      >
        ✕
      </button>

      {/* CARD */}
      {/* <div className="relative w-[480px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-xl text-white overflow-hidden"> */}
      <div className="relative w-[480px] min-h-[450px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-xl text-white overflow-hidden">

      {/* <div className="relative w-[480px] min-h-[600px] bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 shadow-xl text-white overflow-hidden"> */}


        {/* TABS */}
        <div className="flex mb-6 bg-white/5 p-1 rounded-2xl backdrop-blur-md border border-white/10">
          {["income", "expenses"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setTab(t);
                setStep("category");
                setSelectedCategory(null);
              }}
              className={`flex-1 py-2 rounded-xl font-bold border border-white/20 backdrop-blur-lg transition-all shadow ${
                tab === t
                  ? "bg-purple/30 text-black shadow-lg"
                  : "bg-yellow/5 text-black/60 hover:bg-black/10"
              }`}
            >
              {t === "income" ? "Income" : "Expenses"}
            </button>
          ))}
        </div>

        {/* SLIDER */}
        <div className="w-full overflow-hidden relative h-[500px]">
          <div
            className="flex transition-transform duration-500"
            style={{
              transform:
                step === "category"
                  ? "translateX(0%)"
                  : step === "manual"
                  ? "translateX(-100%)"
                  : "translateX(-200%)",
            }}
          >

            {/* CATEGORY SCREEN */}
            <div className="min-w-full pr-2">
              <h3 className="text-xl font-bold mb-4 text-center">
                {tab === "income" ? "Select Income Category" : "Select Expense Category"}
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

              {/* ADD MANUAL & UPLOAD BILL UNDER CATEGORY */}
              {selectedCategory && (
                <div className="flex flex-col gap-3 mt-2">
                  {/* Manual always available */}
                  <button
                    onClick={() => setStep("manual")}
                    className="p-3 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-500"
                  >
                    Add Manual
                  </button>

                  {/* Upload bill only for EXPENSE */}
                  {tab === "expenses" && (
                    <label className="p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl backdrop-blur-lg flex items-center justify-center gap-3 font-bold cursor-pointer">
                      <FaCloudUploadAlt /> Upload Bill
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          setBillImage(e.target.files[0]);
                          setStep("ai");
                        }}
                      />
                    </label>
                  )}
                </div>
              )}
            </div>

            {/* MANUAL INPUT SCREEN */}
            <div className="min-w-full px-4">
              <h3 className="text-xl font-bold mb-4 text-center">Add Manual Item</h3>

              <input
                placeholder="Title"
                value={currentTitle}
                onChange={(e) => setCurrentTitle(e.target.value)}
                className="w-full p-3 mb-3 rounded-xl bg-white/5 border border-white/10"
              />

              <input
                placeholder="Amount (Rp)"
                value={currentAmount}
                type="number"
                onChange={(e) => setCurrentAmount(e.target.value)}
                className="w-full p-3 mb-4 rounded-xl bg-white/5 border border-white/10"
              />

              {/* Add item to list */}
              <button
                onClick={addManualTemp}
                className="w-full p-3 rounded-xl bg-yellow-400 text-black font-bold mb-4"
              >
                + Add
              </button>

              {/* DONE BUTTON */}
              {manualItems.length > 0 && (
                <button
                  onClick={submitManual}
                  className="w-full p-3 rounded-xl bg-green-400 text-black font-bold"
                >
                  Done ({manualItems.length})
                </button>
              )}
            </div>

            {/* AI SCREEN */}
            <div className="min-w-full flex flex-col items-center justify-center px-4">
              <p className="text-center text-white/80 mb-6">
                <FaCloudUploadAlt className="text-4xl mx-auto mb-4" /> Bill uploaded.
                AI scanning will run here.
              </p>

              <button
                className="px-6 py-3 rounded-xl bg-yellow-400 text-black font-bold"
              >
                Continue
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

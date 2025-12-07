import { FaSmile, FaMeh, FaAngry } from "react-icons/fa"; 

export default function IncomeExpensesCard({ totalIncome = 40, totalExpense = 60 }) {
  const totalAll = totalIncome + totalExpense;
  const balancePercent = totalAll ? Math.round((totalIncome / totalAll) * 100) : 0;

  // Tentuin emot aktif
  let activeEmot = "";
  if (balancePercent >= 70) activeEmot = "happy";
  else if (balancePercent >= 50) activeEmot = "neutral";
  else activeEmot = "angry"; 

  return (
    <div className="bg-white/10 p-5 rounded-2xl shadow-md flex flex-col justify-center">
      <h3 className="text-center font-medium mb-4 text-white">Expenses and Income</h3>

      {/* Persentase */}
      <div className="flex justify-around text-center text-white mb-4">
        <div>
          <p className="text-2xl font-bold">{totalExpense}%</p>
          <p className="text-sm">Expenses</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{totalIncome}%</p>
          <p className="text-sm">Income</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative w-full h-4 bg-white/20 rounded-full mb-4">
        <div
          className="absolute left-0 top-0 h-4 bg-red-400 rounded-full"
          style={{ width: `${totalExpense}%` }}
        />
        <div
          className="absolute left-0 top-0 h-4 bg-green-400 rounded-full"
          style={{ width: `${totalIncome}%` }}
        />
      </div>

      {/* Emot dengan animasi scale */}
      <div className="flex justify-around mt-2 text-4xl"> {/* besarin teks */}
        <FaSmile
          className={`transition-transform duration-300 ${
            activeEmot === "happy" ? "text-yellow-400 scale-125" : "text-white/30 scale-100"
          }`}
        />
        <FaMeh
          className={`transition-transform duration-300 ${
            activeEmot === "neutral" ? "text-yellow-400 scale-125" : "text-white/30 scale-100"
          }`}
        />
        <FaAngry
          className={`transition-transform duration-300 ${
            activeEmot === "angry" ? "text-red-500 scale-125" : "text-white/30 scale-100"
          }`}
        />
      </div>
    </div>
  );
}

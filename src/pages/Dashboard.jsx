import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import RecordList from "../components/RecordList";
import AddRecordModal from "../components/AddRecordModal";
import LineChartCard from "../components/LineChartCard";
import RingChartCard from "../components/RingChartCard";

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddRecord = (rec) => setRecords((prev) => [...prev, rec]);

  const totalIncome = records
    .filter((r) => ["Salary", "Bonus"].includes(r.category))
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter((r) => !["Salary", "Bonus"].includes(r.category))
    .reduce((sum, r) => sum + r.amount, 0);

  const totalAll = totalIncome + totalExpense;
  const incomePercent = totalAll ? Math.round((totalIncome / totalAll) * 100) : 0;
  const expensePercent = totalAll ? Math.round((totalExpense / totalAll) * 100) : 0;

  return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-[#0a0a0d] via-[#0f0f12] to-[#151518] relative overflow-hidden">

      {/* Ambient Glow */}
      <div className="absolute -top-32 left-10 w-[500px] h-[500px] bg-purple-600/20 blur-[150px]"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-500/10 blur-[200px]"></div>

      {/* Sidebar */}
      <Sidebar onAdd={() => setIsModalOpen(true)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-28 relative z-10">

        {/* Header - Minimal Glass */}
        <div
        className="
            w-full px-6 py-4 mb-6
            bg-white/10 backdrop-blur-xl
            border border-white/10
            rounded-2xl
            shadow-[0_0_25px_rgba(255,255,255,0.12)]
            flex items-center justify-between
        "
        >
        <h2 className="text-2xl font-semibold text-white tracking-wide">
            Dashboard
        </h2>

        <div className="text-right">
            <p className="text-sm text-gray-300">Welcome back,</p>
            <p className="text-white font-medium">User</p>
        </div>
        </div>


        {/* Grid Layout */}
        <div className="grid grid-cols-2 grid-rows-2 gap-6 p-6 flex-1 overflow-auto">

          {/* Line Chart */}
          <div className="
            bg-white/10 backdrop-blur-xl 
            rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)]
            border border-white/10 
            p-5 flex flex-col
          ">
            <h3 className="text-white font-semibold mb-3">Expenses Over Time</h3>
            <LineChartCard records={records} />
          </div>

          {/* Ring Chart */}
          <div className="
            bg-white/10 backdrop-blur-xl 
            rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)]
            border border-white/10 
            p-5 flex flex-col items-center
          ">
            <h3 className="text-white font-semibold mb-3">Category Breakdown</h3>
            <RingChartCard records={records} />
          </div>

          {/* Records */}
          <div className="
            bg-white/10 backdrop-blur-xl 
            rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)]
            border border-white/10 
            p-5 flex flex-col overflow-auto
          ">
            <h3 className="text-white font-semibold mb-3">Records</h3>
            <RecordList records={records} />
          </div>

          {/* Income / Expense Breakdown */}
          <div className="
            bg-white/10 backdrop-blur-xl 
            rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)]
            border border-white/10 
            p-5 flex flex-col gap-6
          ">
            <div className="flex justify-between items-center">
              <p className="text-white font-medium">Income</p>
              <p className="text-white font-medium">{incomePercent}%</p>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full">
              <div
                className="bg-green-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${incomePercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-white font-medium">Expense</p>
              <p className="text-white font-medium">{expensePercent}%</p>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full">
              <div
                className="bg-red-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${expensePercent}%` }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Modal */}
      <AddRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddRecord}
      />
    </div>
  );
}

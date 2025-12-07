import { useState } from "react";
import Sidebar from "../components/Sidebar";
import RecordList from "../components/RecordList";
import AddRecordModal from "../components/AddRecordModal";
import LineChartCard from "../components/LineChartCard";
import RingChartCard from "../components/RingChartCard";
import IncomeExpensesCard from "../components/IncomeExpensesCard";

export default function Dashboard() {
  const [records, setRecords] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleAddRecord = (rec) => setRecords((prev) => [...prev, rec]);

  const incomeCategories = ["Gaji", "Bonus", "Investasi", "Part-Time"];
  const totalIncome = records
    .filter((r) => incomeCategories.includes(r.category))
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpense = records
    .filter((r) => !incomeCategories.includes(r.category))
    .reduce((sum, r) => sum + r.amount, 0);

  const totalAll = totalIncome + totalExpense;
  const incomePercent = totalAll ? Math.round((totalIncome / totalAll) * 100) : 0;
  const expensePercent = totalAll ? Math.round((totalExpense / totalAll) * 100) : 0;

  return (
    <div className="flex min-h-screen w-screen bg-gradient-to-br from-[#0a0a0d] via-[#0f0f12] to-[#151518] relative overflow-hidden">

      {/* Ambient Glow */}
      <div className="absolute -top-32 left-10 w-[500px] h-[500px] bg-purple-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-yellow-500/10 blur-[200px] pointer-events-none" />

      {/* MOBILE SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR MOBILE */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 z-50 p-6
          bg-white/10 backdrop-blur-xl border-r border-white/10 shadow-xl
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:hidden
        `}
      >
        <Sidebar
          onAdd={() => {
            setSidebarOpen(false);
            setIsModalOpen(true);
          }}
          onLogout={() => {
            localStorage.removeItem("currentUser");
            window.location.reload();
          }}
        />
      </div>

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:flex">
        <Sidebar
          onAdd={() => setIsModalOpen(true)}
          onLogout={() => {
            localStorage.removeItem("currentUser");
            window.location.reload();
          }}
        />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col md:ml-28 relative z-10">

        {/* HEADER */}
        <div className="
          w-full px-6 py-4 mb-6
          bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl
          shadow-[0_0_25px_rgba(255,255,255,0.12)]
          flex items-center justify-between
        ">
          <button
            className="md:hidden text-white text-2xl mr-2"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>

          <h2 className="text-2xl font-semibold text-white tracking-wide">
            Dashboard
          </h2>

          <div className="text-right">
            <p className="text-sm text-gray-300">Welcome back,</p>
            <p className="text-white font-medium">User</p>
          </div>
        </div>

        {/* GRID */}
        <div className="
          grid grid-cols-1 md:grid-cols-2 gap-6
          p-4 md:p-6 flex-1 overflow-auto
        ">

          {/* LINE CHART */}
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-white/10 flex flex-col h-[300px] md:h-auto">
            <h3 className="text-white font-semibold mb-3">Expenses Over Time</h3>
            <LineChartCard records={records} />
          </div>

          {/* RING CHART */}
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-white/10 flex flex-col items-center h-[300px] md:h-auto">
            <h3 className="text-white font-semibold mb-3">Category Breakdown</h3>
            <RingChartCard records={records} />
          </div>

          {/* RECORD LIST */}
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-white/10 flex flex-col h-[400px]">
            <h3 className="text-white font-semibold mb-3">Records</h3>
            <div className="flex-1 overflow-y-auto">
              <RecordList records={records} />
            </div>
          </div>

          {/* INCOME & EXPENSE CARD */}
          <div className="bg-white/10 backdrop-blur-xl p-5 rounded-2xl shadow-[0_0_25px_rgba(255,255,255,0.1)] border border-white/10 flex flex-col h-[300px] md:h-auto">
            <IncomeExpensesCard
              totalIncome={incomePercent}
              totalExpense={expensePercent}
            />
          </div>

        </div>
      </div>

      {/* ADD RECORD MODAL */}
      <AddRecordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddRecord}
      />
    </div>
  );
}

export default function ChartPage() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Charts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="
          bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10
        ">
          <h2 className="text-lg mb-3">Spending Breakdown</h2>
          <div className="flex justify-center items-center h-60">
            {/* Masukkan <RingChartCard /> di sini */}
          </div>
        </div>

        <div className="
          bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10
        ">
          <h2 className="text-lg mb-3">Monthly Overview</h2>
          <div className="flex justify-center items-center h-60">
            {/* Masukkan bar chart di sini */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Wallet() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Wallet</h1>

      <div className="
        bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 
        shadow-[0_0_30px_rgba(255,255,255,0.08)]
      ">
        <p className="text-gray-200 mb-4">Your wallet balance:</p>

        <p className="text-4xl font-bold text-green-400 mb-4">$1,280.50</p>

        <button className="
          w-full py-3 rounded-xl bg-white/20 hover:bg-white/30 
          transition font-medium text-white
        ">
          Add Funds
        </button>
      </div>
    </div>
  );
}

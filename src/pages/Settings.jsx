export default function Settings() {
  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Settings</h1>

      <div className="
        bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/10 
        shadow-[0_0_30px_rgba(255,255,255,0.08)]
      ">
        <p className="text-gray-300 mb-3">User Preferences</p>

        <div className="space-y-4">
          <div>
            <label className="text-gray-300 block mb-1">Display Name</label>
            <input
              type="text"
              className="
                w-full p-3 rounded-xl bg-white/20 border border-white/10
                text-white focus:outline-none
              "
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-1">Theme</label>
            <select
              className="
                w-full p-3 rounded-xl bg-white/20 border border-white/10
                text-white focus:outline-none
              "
            >
              <option className="text-black">Light</option>
              <option className="text-black">Dark</option>
              <option className="text-black">Gold Glow</option>
            </select>
          </div>

          <button className="
            w-full mt-4 py-3 rounded-xl bg-black/60 hover:bg-black 
            text-white font-medium transition
          ">
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

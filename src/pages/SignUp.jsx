import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function SignUp() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirm) {
      alert("Password tidak sama!");
      return;
    }

    console.log("User registered:", form);
    nav("/login");
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#050506] via-[#0a0a0d] to-[#141416] flex items-center justify-center relative overflow-hidden">

      {/* Ambient Neon Glow */}
      <div className="absolute -top-20 left-20 w-[450px] h-[450px] bg-purple-600/20 blur-[140px]"></div>
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-yellow-500/20 blur-[160px]"></div>

      {/* Glassy Card */}
      <div
        className="
          relative w-[420px] p-10 rounded-[28px]
          bg-white/10 backdrop-blur-2xl
          border border-white/20
          shadow-[0_0_60px_rgba(255,255,255,0.10)]
          hover:scale-[1.02] transition-transform duration-500
        "
      >

        {/* Shine Animation */}
        <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
          <div className="
            absolute -top-40 -left-40 w-[500px] h-[500px]
            bg-gradient-to-br from-white/20 to-transparent
            opacity-10 rotate-45 animate-shine
          "></div>
        </div>

        {/* Upper Reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent rounded-t-[28px] pointer-events-none"></div>

        <h2 className="text-3xl font-semibold text-center text-white drop-shadow-glow mb-8">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="
              w-full p-4 mb-4 rounded-xl text-white
              bg-white/10 border border-white/20
              placeholder-gray-300
              focus:ring-2 focus:ring-yellow-400 focus:bg-white/20
              transition-all duration-300
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="
              w-full p-4 mb-4 rounded-xl text-white
              bg-white/10 border border-white/20
              placeholder-gray-300
              focus:ring-2 focus:ring-yellow-400 focus:bg-white/20
              transition-all duration-300
            "
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            className="
              w-full p-4 mb-6 rounded-xl text-white
              bg-white/10 border border-white/20
              placeholder-gray-300
              focus:ring-2 focus:ring-yellow-400 focus:bg-white/20
              transition-all duration-300
            "
          />

          <button
            type="submit"
            className="
              w-full p-4 rounded-xl font-bold text-black
              bg-yellow-400 hover:bg-yellow-500
              shadow-lg shadow-yellow-500/30
              transition-all duration-300
            "
          >
            Sign Up
          </button>
        </form>

        {/* FIXED SECTION */}
        <p className="text-gray-300 text-center mt-6">
          Sudah punya akun?{" "}
          <Link to="/" className="text-yellow-300 hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}

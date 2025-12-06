import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({ setUser }) {
  const nav = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

const handleLogin = (e) => {
  e.preventDefault();
  const users = JSON.parse(localStorage.getItem("users")) || [];

  // Cek field kosong
  if (!form.email || !form.password) {
    setError("Email dan password harus diisi!");
    return;
  }

  // Cari user berdasarkan email
  const user = users.find(u => u.email === form.email);
  if (!user) {
    setError("Belum punya akun, silakan daftar!");
    return;
  }

  // Cek password
  if (user.password !== form.password) {
    setError("Kata sandi salah!");
    return;
  }

  // Login sukses
  localStorage.setItem("currentUser", JSON.stringify(user)); // simpan currentUser
  setError("");
  setUser(user); // update state global di App.jsx kalau ada
  nav("/dashboard"); // redirect ke dashboard
};

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#050506] via-[#0a0a0d] to-[#141416] flex items-center justify-center relative overflow-hidden">
      {/* Neon Glow */}
      <div className="absolute -top-20 left-20 w-[450px] h-[450px] bg-purple-600/20 blur-[140px]"></div>
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-yellow-500/20 blur-[160px]"></div>

      <div className="relative w-[420px] p-12 rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.10)] hover:scale-[1.02] transition-transform duration-500">
        <h2 className="text-3xl font-semibold text-center text-white drop-shadow-glow mb-10">Masuk Akun</h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full p-4 rounded-xl text-white bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 transition-all duration-300"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Kata Sandi"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-4 rounded-xl text-white bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 transition-all duration-300"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>}

          <button
            type="submit"
            className="w-full p-4 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-500/30 transition-all duration-300"
          >
            Log In
          </button>
        </form>

        <p className="text-gray-300 text-center mt-6">
          Belum punya akun?{" "}
          <Link to="/signup" className="text-yellow-300 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = (e) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!form.username || !form.email || !form.password || !form.confirm) {
      setError("Semua field harus diisi!");
      return;
    }

    if (form.password.length < 8) {
      setError("Password minimal 8 karakter!");
      return;
    }

    if (form.password !== form.confirm) {
      setError("Password tidak sama!");
      return;
    }

    if (users.find(u => u.email === form.email)) {
      setError("Email sudah digunakan!");
      return;
    }


    // Simpan user ke localStorage
    const newUser = { 
      username: form.username, 
      email: form.email, 
      password: form.password 
    };
    users.push({ username: form.username, email: form.email, password: form.password });
    localStorage.setItem("users", JSON.stringify(users));

    setError("");
    nav("/"); // redirect ke login
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-[#050506] via-[#0a0a0d] to-[#141416] flex items-center justify-center relative overflow-hidden">
      {/* Neon Glow */}
      <div className="absolute -top-20 left-20 w-[450px] h-[450px] bg-purple-600/20 blur-[140px]"></div>
      <div className="absolute bottom-0 right-10 w-[500px] h-[500px] bg-yellow-500/20 blur-[160px]"></div>

      <div className="relative w-[420px] p-12 rounded-[28px] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_0_60px_rgba(255,255,255,0.10)] hover:scale-[1.02] transition-transform duration-500">
        <h2 className="text-3xl font-semibold text-center text-white drop-shadow-glow mb-10">Buat Akun</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            className="w-full p-4 rounded-xl text-white bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 transition-all duration-300"
          />

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

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Konfirmasi Kata Sandi"
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              className="w-full p-4 rounded-xl text-white bg-white/10 border border-white/20 placeholder-gray-300 focus:ring-2 focus:ring-yellow-400 focus:bg-white/20 transition-all duration-300"
            />
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p className="text-red-400 text-sm text-center animate-fade-in">{error}</p>}

          <button
            type="submit"
            className="w-full p-4 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-500 shadow-lg shadow-yellow-500/30 transition-all duration-300"
          >
            Sign Up
          </button>
        </form>

        <p className="text-gray-300 text-center mt-6">
          Sudah punya akun?{" "}
          <Link to="/" className="text-yellow-300 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}

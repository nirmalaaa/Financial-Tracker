import { useEffect, useState } from "react";

export default function Header() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
  }, []);

  const username =
    currentUser?.username ||
    currentUser?.email?.split("@")[0] ||
    "Guest";

  return (
    <div
      className="
        w-fit mx-auto mt-6 px-7 py-3
        bg-white/10
        backdrop-blur-2xl
        border border-white/20
        rounded-full

        shadow-[0_4px_30px_rgba(255,255,255,0.04)]
        hover:shadow-[0_6px_40px_rgba(255,255,255,0.07)]
        transition-shadow duration-300

        flex items-center gap-3
      "
    >
      <div className="w-1.5 h-6 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-full"></div>

      <h1 className="text-gray-100 font-medium tracking-wide text-base md:text-lg">
        Welcome, {username}
      </h1>
    </div>
  );
}

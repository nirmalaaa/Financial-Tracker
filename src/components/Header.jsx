export default function Header({ title }) {
  return (
    <div className="w-fit mx-auto mt-4 px-6 py-2
      bg-white/10 backdrop-blur-xl
      border border-white/20
      rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)]
      flex items-center gap-2">

      {/* Accent gold line */}
      <div className="w-1 h-6 bg-yellow-400 rounded-full"></div>

      <h1 className="text-gray-100 font-semibold tracking-wide text-lg">
        {title}
      </h1>
    </div>
  );
}

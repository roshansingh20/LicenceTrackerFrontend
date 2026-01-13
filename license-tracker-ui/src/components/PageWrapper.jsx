export default function PageWrapper({ title, children }) {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50 to-purple-100 p-8 overflow-hidden">

      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <h1 className="text-[120px] font-extrabold text-indigo-200/20 tracking-widest rotate-[-20deg]">
          {title}
        </h1>
      </div>

      {/* Content Card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 animate-fadeIn">

        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-6 text-indigo-800">
          {title}
        </h1>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}

export default function AppBackground({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 relative overflow-hidden">

      {/* Floating Blobs */}
      <div className="absolute w-[400px] h-[400px] bg-indigo-500/30 rounded-full blur-3xl top-10 left-10 animate-pulse"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-3xl bottom-10 right-10 animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-cyan-400/20 rounded-full blur-3xl top-1/3 right-1/4 animate-pulse"></div>

      {/* Page Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

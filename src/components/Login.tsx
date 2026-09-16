import React, { useState, useEffect } from "react";
import logo from "@/imports/ChatGPT_Image_Sep_16__2026__02_42_11_AM-removebg-preview.png";

interface LoginProps {
  onLogin: (role: "faculty" | "student", user: {name: string, email: string}) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"faculty" | "student">("student");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoZoomed, setIsLogoZoomed] = useState(false);

  // Initialize demo accounts if empty
  useEffect(() => {
    const existingUsers = localStorage.getItem("sermax_users");
    if (!existingUsers) {
      const defaultUsers = [
        { email: "faculty@demo.com", password: "password", name: "Dr. Maria Santos", role: "faculty" },
        { email: "student@demo.com", password: "password", name: "Juan Dela Cruz", role: "student" }
      ];
      localStorage.setItem("sermax_users", JSON.stringify(defaultUsers));
    }
  }, []);

  // Pre-fill demo accounts when toggling
  const useDemoAccount = (demoRole: "faculty" | "student") => {
    setIsLogin(true);
    setEmail(`${demoRole}@demo.com`);
    setPassword("password");
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      if (!email || !password || (!isLogin && !name)) {
        setError("Please fill in all required fields.");
        setIsLoading(false);
        return;
      }

      const usersStr = localStorage.getItem("sermax_users");
      const users = usersStr ? JSON.parse(usersStr) : [];

      if (!isLogin) {
        // Sign Up Logic
        const existingUser = users.find((u: any) => u.email === email);
        if (existingUser) {
          setError("An account with this email already exists.");
          setIsLoading(false);
          return;
        }
        
        const newUser = { email, password, name, role };
        users.push(newUser);
        localStorage.setItem("sermax_users", JSON.stringify(users));
        
        onLogin(role, { name, email });
      } else {
        // Sign In Logic
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          onLogin(user.role, { name: user.name, email: user.email });
        } else {
          setError("Invalid email or password.");
        }
      }
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #0d4f3c 100%)" }}>
      {/* Background decorative blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{ position: "absolute", top: "-10%", left: "-10%", width: 480, height: 480, borderRadius: "50%", background: "rgba(29,78,216,0.18)", filter: "blur(60px)" }} />
        <div style={{ position: "absolute", bottom: "-10%", right: "-10%", width: 520, height: 520, borderRadius: "50%", background: "rgba(5,150,105,0.15)", filter: "blur(80px)" }} />
        <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", width: 300, height: 300, borderRadius: "50%", background: "rgba(99,102,241,0.08)", filter: "blur(60px)" }} />
      </div>
      
      {/* Logo Zoom Overlay */}
      {isLogoZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm fade-in"
          onClick={() => setIsLogoZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-screen p-4 flex flex-col items-center">
            <button 
              className="absolute top-0 right-0 m-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={() => setIsLogoZoomed(false)}
            >
              ✕
            </button>
            <div className="bg-white rounded-full p-8 shadow-[0_0_80px_rgba(255,255,255,0.2)]">
              <img 
                src={logo} 
                alt="SerMax SYNAPSE Logo Enlarged" 
                className="w-[300px] h-[300px] md:w-[500px] md:h-[500px] object-contain transition-transform duration-300 hover:scale-105" 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <div className="mt-8 text-center" onClick={(e) => e.stopPropagation()}>
              <div className="font-logo text-white text-3xl md:text-5xl" style={{ letterSpacing: -0.5 }}>
                <span style={{ color: "#dbeafe" }}>SERMAX</span>{" "}
                <span style={{ color: "#6ee7b7" }}>SYNAPSE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center w-full max-w-md px-4">
        {/* Logo Header */}
        <div className="mb-6 flex flex-col items-center group cursor-pointer" onClick={() => setIsLogoZoomed(true)}>
          <div className="bg-white rounded-full p-4 mb-3 shadow-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] relative" style={{ width: 120, height: 120 }}>
            <img src={logo} alt="SerMax SYNAPSE" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
            </div>
          </div>
          <div className="text-center">
            <div className="font-logo text-white transition-all group-hover:text-blue-100" style={{ fontSize: 24, letterSpacing: -0.5 }}>
              <span style={{ color: "#dbeafe" }}>SERMAX</span>{" "}
              <span style={{ color: "#6ee7b7" }}>SYNAPSE</span>
            </div>
          </div>
        </div>

        {/* Authentication Card */}
        <div className="w-full rounded-2xl p-8" style={{ background: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.12)" }}>
          <h2 className="text-white font-heading text-2xl mb-1 text-center">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-white/50 text-sm text-center mb-6">
            {isLogin ? "Sign in to access your dashboard" : "Join SerMax Synapse today"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div>
                <label className="block text-white/70 text-xs mb-1.5 ml-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Juan Dela Cruz"
                />
              </div>
            )}

            <div>
              <label className="block text-white/70 text-xs mb-1.5 ml-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="you@unor.edu.ph"
              />
            </div>

            <div>
              <label className="block text-white/70 text-xs mb-1.5 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-white/70 text-xs mb-1.5 ml-1">I am a...</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("student")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${role === "student" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50" : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"}`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("faculty")}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${role === "faculty" ? "bg-blue-500/20 text-blue-400 border border-blue-500/50" : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"}`}
                  >
                    Faculty
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mt-2">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 rounded-xl font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 flex justify-center items-center h-12"
              style={{ background: isLogin ? "linear-gradient(135deg, #2563eb, #4f46e5)" : "linear-gradient(135deg, #059669, #10b981)" }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                isLogin ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-white/50">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
            </span>
            <button
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </div>
          
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-white/40 text-xs text-center mb-3">Quick Demo Login</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => useDemoAccount("student")} className="text-xs bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                  Demo Student
                </button>
                <button onClick={() => useDemoAccount("faculty")} className="text-xs bg-white/5 hover:bg-white/10 text-white/70 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
                  Demo Faculty
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-white/30 text-xs">University of Negros Occidental – Recoletos, Inc.</p>
          <p className="text-white/30 text-xs">College of Information Technology</p>
        </div>
      </div>
    </div>
  );
}

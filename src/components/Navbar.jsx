import React from "react";

export default function Navbar({ role, setRole }) {
  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3.5 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-[#0033a0] rounded-md flex items-center justify-center font-bold text-white text-xs tracking-wider">
          JLK
        </div>
        <span className="font-semibold text-slate-900 tracking-tight">
          Finance{" "}
          <span className="text-slate-400 font-normal">| LOS System</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-slate-500 hidden md:block">
          Active Role:
        </span>
        <select
          className="bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-lg focus:ring-2 focus:ring-[#0033a0] focus:border-transparent block py-1.5 px-3 cursor-pointer outline-none transition-all font-medium"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="Sales">Dealer Sales</option>
          <option value="Manager">Marketing Manager</option>
          <option value="Admin">Backoffice Admin</option>
        </select>
      </div>
    </nav>
  );
}

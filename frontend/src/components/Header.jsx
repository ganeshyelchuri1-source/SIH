import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Bell, LogOut, CheckCircle2, AlertTriangle, UserCheck, ChevronDown, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header({ onOpenNotifications }) {
  const { user, logout, switchDemoRole } = useAuth();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const roles = [
    { key: 'SUPER_ADMIN', label: 'Super Admin', badge: 'NCRB-ADM-001' },
    { key: 'INVESTIGATING_OFFICER', label: 'Investigating Officer', badge: 'NCRB-INV-104' },
    { key: 'LEGAL_OFFICER', label: 'Legal Officer', badge: 'NCRB-LEG-202' },
    { key: 'REVIEWER', label: 'Reviewer / Dy. SP', badge: 'NCRB-REV-305' },
    { key: 'AUDITOR', label: 'Compliance Auditor', badge: 'NCRB-AUD-401' },
  ];

  const handleRoleSwitch = async (roleKey) => {
    setRoleMenuOpen(false);
    try {
      await switchDemoRole(roleKey);
    } catch (e) {
      alert('Role switch failed: ' + e.message);
    }
  };

  return (
    <header className="h-16 bg-[#0B1120] border-b border-[#1E293B] px-4 lg:px-6 flex items-center justify-between z-30 sticky top-0">
      {/* Left: Emblem & Agency Title */}
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/10">
          <Shield className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">NCRB • MHA</span>
            <span className="text-[10px] bg-cyan-900/60 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-500/30">SIH26190</span>
          </div>
          <h1 className="text-sm font-semibold tracking-tight text-white hidden sm:block">
            Secure Digital Custody & Investigation Platform
          </h1>
        </div>
      </div>

      {/* Center: System Status Badges */}
      <div className="hidden xl:flex items-center space-x-2 text-xs">
        <Link
          to="/"
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/50 transition"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">System: Operational</span>
        </Link>
        <Link
          to="/integrity"
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/50 transition"
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-medium">Blockchain: Verified</span>
        </Link>
        <Link
          to="/security"
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-950/50 border border-rose-500/40 text-rose-400 hover:bg-rose-900/50 transition"
          title="Open Dedicated Security Center"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span className="font-semibold">Threat Risk: 60/100 (HIGH RISK)</span>
        </Link>
      </div>

      {/* Right: Demo Role Switcher & User Profile */}
      <div className="flex items-center space-x-3">
        {/* Quick Demo Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center space-x-2 px-2.5 py-1.5 rounded bg-slate-900 border border-cyan-500/40 text-xs text-cyan-300 hover:bg-slate-800 transition"
            title="Fast switch identity for Hackathon Demo presentation"
          >
            <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline font-medium">Demo Switcher:</span>
            <span className="font-semibold text-white">{user?.role?.replace('_', ' ')}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-[#0F172A] border border-[#334155] rounded-lg shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-1.5 border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Hackathon Demo: Switch Identity
              </div>
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => handleRoleSwitch(r.key)}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-cyan-950/50 hover:text-cyan-300 transition ${
                    user?.role === r.key ? 'bg-cyan-900/30 text-cyan-300 font-semibold' : 'text-slate-300'
                  }`}
                >
                  <div>
                    <div>{r.label}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{r.badge}</div>
                  </div>
                  {user?.role === r.key && <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User Card */}
        <div className="hidden lg:flex items-center space-x-2 border-l border-slate-800 pl-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
            {user?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2) || 'OF'}
          </div>
          <div className="text-left text-xs">
            <div className="font-semibold text-slate-200 leading-tight">{user?.fullName}</div>
            <div className="text-[10px] text-slate-400 font-mono">{user?.badgeNumber}</div>
          </div>
        </div>

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
        </button>

        {/* Logout */}
        <button
          onClick={logout}
          className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition"
          title="Secure Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderLock,
  FileText,
  Sparkles,
  Link2,
  KeyRound,
  History,
  ShieldAlert,
  FileSpreadsheet,
  Settings,
  Upload,
  SearchCheck,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ onOpenUpload, onOpenVerify }) {
  const { user, hasRole, can } = useAuth();

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/cases', label: 'Case Management', icon: FolderLock },
    { to: '/documents', label: 'Document Vault', icon: FileText },
    { to: '/ai-intelligence', label: 'AI Intelligence', icon: Sparkles, badge: 'AI' },
    { to: '/integrity', label: 'Integrity Ledger', icon: Link2, badge: 'BC' },
    { to: '/access-requests', label: 'Access Requests', icon: KeyRound },
    { to: '/audit', label: 'Audit Trail', icon: History },
    { to: '/security', label: 'Security Center', icon: ShieldAlert },
    { to: '/reports', label: 'Official Reports', icon: FileSpreadsheet },
  ];

  if (hasRole('SUPER_ADMIN')) {
    navItems.push({ to: '/admin', label: 'Administration', icon: Settings });
  }

  return (
    <aside className="w-64 bg-[#0B1120] border-r border-[#1E293B] flex flex-col flex-shrink-0 h-[calc(100vh-4rem)] select-none">
      {/* Quick Action Buttons */}
      <div className="p-3 border-b border-[#1E293B] space-y-2">
        {can('UPLOAD') && (
          <button
            onClick={onOpenUpload}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-lg shadow-cyan-900/20 transition group"
          >
            <Upload className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span>Upload Document</span>
          </button>
        )}
        <button
          onClick={onOpenVerify}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition"
        >
          <SearchCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>Verify Document</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 py-1">
          Operational Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? 'bg-cyan-950/70 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <div className="flex items-center space-x-2.5">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] bg-cyan-900/50 text-cyan-300 px-1.5 py-0.2 rounded font-mono border border-cyan-500/20">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Security Badge */}
      <div className="p-3 border-t border-[#1E293B] bg-[#080D18]">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Security Protocol</span>
          <span className="font-mono text-emerald-400 text-[10px]">FIPS 180-4</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
          <span>Integrity Chain</span>
          <span className="text-cyan-400 font-mono">SHA-256</span>
        </div>
      </div>
    </aside>
  );
}

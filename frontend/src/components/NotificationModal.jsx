import React from 'react';
import { X, Bell, CheckCircle2, ShieldAlert, KeyRound, Info } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotificationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const mockNotifications = [
    {
      id: '1',
      title: 'Access Authorization Request Pending',
      message: 'Adv. Meera Sen submitted clearance request for RESTRICTED wiretap brief.',
      time: '12 mins ago',
      type: 'ACCESS',
      link: '/access-requests',
    },
    {
      id: '2',
      title: 'Cryptographic Ledger Re-anchored',
      message: 'Block #5 validated across NCRB and CFSL consensus nodes.',
      time: '1 hour ago',
      type: 'SUCCESS',
      link: '/integrity',
    },
    {
      id: '3',
      title: 'Threat Shield Advisory',
      message: 'Auditor R. K. Iyer clearance check flagged on Case #CASE-2026-001.',
      time: '3 hours ago',
      type: 'SECURITY',
      link: '/security',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl w-full max-w-sm shadow-2xl overflow-hidden mt-2">
        <div className="p-3 border-b border-[#1E293B] flex items-center justify-between bg-[#0B1120]">
          <div className="flex items-center space-x-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Operational Notifications
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-80 overflow-y-auto">
          {mockNotifications.map((n) => (
            <div key={n.id} className="p-3 hover:bg-slate-850/50 transition flex items-start space-x-3">
              {n.type === 'ACCESS' && <KeyRound className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />}
              {n.type === 'SUCCESS' && <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />}
              {n.type === 'SECURITY' && <ShieldAlert className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />}
              <div className="space-y-1 text-xs">
                <Link
                  to={n.link}
                  onClick={onClose}
                  className="font-medium text-slate-200 hover:text-cyan-300 block"
                >
                  {n.title}
                </Link>
                <p className="text-[11px] text-slate-400">{n.message}</p>
                <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="text-[11px] text-cyan-400 hover:underline font-medium"
          >
            Mark all acknowledged
          </button>
        </div>
      </div>
    </div>
  );
}

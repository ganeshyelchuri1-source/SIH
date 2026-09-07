import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Lock,
  UserX,
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Eye,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function SecurityCenter() {
  const { user, can } = useAuth();
  const [overview, setOverview] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState(null);
  const [message, setMessage] = useState('');

  const loadSecurityData = async () => {
    setLoading(true);
    try {
      const [ovRes, evRes] = await Promise.all([
        api.getSecurityOverview(),
        api.getSecurityEvents({ limit: 25 }),
      ]);

      if (ovRes.success) setOverview(ovRes);
      if (evRes.success) setEvents(evRes.events);
    } catch (err) {
      console.warn('Load security data error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityData();
  }, []);

  const handleResolve = async (id) => {
    setResolvingId(id);
    setMessage('');
    try {
      const res = await api.resolveSecurityEvent(id, 'Threat verified and cleared by cybersecurity team');
      if (res.success) {
        setMessage('Incident marked as mitigated and resolved');
        loadSecurityData();
      }
    } catch (err) {
      setMessage('Resolution failed: ' + err.message);
    } finally {
      setResolvingId(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-400">
              NATIONAL CYBER THREAT MONITORING
            </span>
            <span className="text-[10px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded font-mono border border-rose-500/30">
              LIVE DEFENSE ACTIVE
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Cybersecurity & Threat Center</h1>
          <p className="text-xs text-slate-400">
            Real-time brute-force mitigation, unauthorized access tracking, and cryptographic audit monitoring
          </p>
        </div>

        <button
          onClick={loadSecurityData}
          className="p-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Threat Feed</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center space-x-2">
          <span>✓</span>
          <span>{message}</span>
        </div>
      )}

      {/* Threat Metrics & Risk Score Meter */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Risk Score Meter */}
        <div className="bg-[#0F172A] border border-cyan-500/30 rounded-xl p-5 shadow-sm space-y-2 relative overflow-hidden">
          <span className="text-xs font-semibold text-slate-400">Security Risk Score</span>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-cyan-400">{overview?.riskScore || 12}</span>
            <span className="text-xs text-slate-500 font-mono">/ 100</span>
          </div>
          <div className="text-xs font-bold text-emerald-400">
            {overview?.riskLevel || 'LOW RISK'}
          </div>
        </div>

        {/* Unresolved Threats */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400">Active Threats</span>
          <div className="text-3xl font-bold text-rose-400">
            {overview?.totalUnresolvedThreats || 0}
          </div>
          <div className="text-xs text-slate-400">Requiring supervisory action</div>
        </div>

        {/* Failed Login Attempts */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400">Failed Logins Monitored</span>
          <div className="text-3xl font-bold text-amber-400">
            {overview?.failedLoginsCount || 0}
          </div>
          <div className="text-xs text-slate-400">Locked after 5 attempts</div>
        </div>

        {/* Account Lockouts */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-2">
          <span className="text-xs font-semibold text-slate-400">Locked Consoles</span>
          <div className="text-3xl font-bold text-white">
            {overview?.lockedUsersCount || 0}
          </div>
          <div className="text-xs text-emerald-400">Lockout auto-expires in 15m</div>
        </div>
      </div>

      {/* AI Anomaly Insights Banner */}
      {overview?.anomalies && overview.anomalies.length > 0 && (
        <div className="bg-rose-950/30 border border-rose-500/40 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4" />
            <span>Automated Behavioral Anomaly Alerts</span>
          </div>
          <div className="space-y-1.5">
            {overview.anomalies.map((a, i) => (
              <div key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{a.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Incident Log Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-sm overflow-hidden space-y-3">
        <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Security Incident Log</h2>
            <p className="text-xs text-slate-400">Audit of security flags, unauthorized attempts, and threat detections</p>
          </div>
          <span className="text-xs font-mono text-slate-400">{events.length} Incidents</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Scanning security logs...</span>
          </div>
        ) : events.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">No security incidents recorded.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1120] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Incident Type</th>
                  <th className="p-3">Description</th>
                  <th className="p-3">User & IP</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ev.severity === 'CRITICAL'
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            : ev.severity === 'HIGH'
                            ? 'bg-orange-950 text-orange-400 border border-orange-500/30'
                            : ev.severity === 'MEDIUM'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {ev.severity}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-white font-bold whitespace-nowrap">
                      {ev.eventType}
                    </td>
                    <td className="p-3 text-slate-300 max-w-sm">
                      {ev.description}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="text-white">{ev.userName || 'Unauthenticated'}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{ev.ipAddress}</div>
                    </td>
                    <td className="p-3 text-slate-400 whitespace-nowrap text-[10px] font-mono">
                      {new Date(ev.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {ev.resolved ? (
                        <span className="text-emerald-400 flex items-center space-x-1 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Resolved</span>
                        </span>
                      ) : (
                        <span className="text-rose-400 text-[10px] font-bold">● Active</span>
                      )}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      {!ev.resolved && can('RESOLVE_SECURITY') ? (
                        <button
                          onClick={() => handleResolve(ev.id)}
                          disabled={resolvingId === ev.id}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 rounded font-semibold text-[11px] transition"
                        >
                          {resolvingId === ev.id ? 'Mitigating...' : 'Mitigate & Resolve'}
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

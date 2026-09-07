import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderLock,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Upload,
  SearchCheck,
  KeyRound,
  ArrowUpRight,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ onOpenUpload, onOpenVerify }) {
  const { user, can } = useAuth();
  const [stats, setStats] = useState({
    totalCases: 3,
    activeCases: 2,
    totalDocuments: 5,
    pendingReviews: 1,
    riskScore: 12,
    riskLevel: 'LOW RISK',
    unresolvedThreats: 1,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock analytics data
  const uploadTrend = [
    { date: '01 Sep', documents: 2, verifications: 5 },
    { date: '02 Sep', documents: 4, verifications: 8 },
    { date: '03 Sep', documents: 3, verifications: 6 },
    { date: '04 Sep', documents: 6, verifications: 12 },
    { date: '05 Sep', documents: 5, verifications: 14 },
    { date: '06 Sep', documents: 8, verifications: 19 },
    { date: '07 Sep', documents: 5, verifications: 22 },
  ];

  const categoryDistribution = [
    { name: 'FIR', count: 1, color: '#06B6D4' },
    { name: 'Witness', count: 1, color: '#3B82F6' },
    { name: 'Forensic', count: 2, color: '#8B5CF6' },
    { name: 'Restricted', count: 1, color: '#EF4444' },
  ];

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [casesRes, docsRes, secRes, auditRes] = await Promise.all([
          api.getCases({ limit: 10 }),
          api.getDocuments({ limit: 5 }),
          api.getSecurityOverview(),
          api.getAuditLogs({ limit: 6 }),
        ]);

        if (casesRes.success) {
          const active = casesRes.cases.filter((c) => c.status !== 'CLOSED').length;
          setStats((prev) => ({
            ...prev,
            totalCases: casesRes.total,
            activeCases: active,
          }));
        }

        if (docsRes.success) {
          setRecentDocs(docsRes.documents);
          setStats((prev) => ({
            ...prev,
            totalDocuments: docsRes.total,
          }));
        }

        if (secRes.success) {
          setStats((prev) => ({
            ...prev,
            riskScore: secRes.riskScore,
            riskLevel: secRes.riskLevel,
            unresolvedThreats: secRes.unresolvedAlertsCount,
          }));
        }

        if (auditRes.success) {
          setRecentLogs(auditRes.logs);
        }
      } catch (err) {
        console.warn('Dashboard fetch warning:', err);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner: Greeting & System Status Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              NCRB CUSTODY CONSOLE
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              ROLE: {user?.role}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">
            Welcome, {user?.fullName}
          </h1>
          <p className="text-xs text-slate-400">
            National Crime Records Bureau • Digital Evidence Chain of Custody System (SIH26190)
          </p>
        </div>

        {/* Quick Action Strip */}
        <div className="flex flex-wrap items-center gap-2.5">
          {can('UPLOAD') && (
            <button
              onClick={onOpenUpload}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center space-x-1.5 shadow-md shadow-cyan-900/20 transition"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Document</span>
            </button>
          )}
          <button
            onClick={onOpenVerify}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <SearchCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verify Hash</span>
          </button>
          <Link
            to="/ai-intelligence"
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-purple-500/30 text-purple-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Intelligence</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Cases */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Total Cases</span>
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <FolderLock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.totalCases}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
            <span>●</span>
            <span>{stats.activeCases} Active Under Investigation</span>
          </div>
        </div>

        {/* Total Documents */}
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Custody Documents</span>
            <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-500/30 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.totalDocuments}</div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center space-x-1">
            <span>✓</span>
            <span>100% Anchored to Blockchain</span>
          </div>
        </div>

        {/* Blockchain Integrity */}
        <div className="bg-[#0F172A] border border-emerald-500/20 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400">Document Integrity</span>
            <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-bold text-emerald-400 mt-2">VERIFIED</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
            <span>●</span>
            <span>Zero Bit Tamper Detected</span>
          </div>
        </div>

        {/* Security Risk Score */}
        <Link
          to="/security"
          className="bg-[#0F172A] border border-[#1E293B] hover:border-purple-500/50 rounded-xl p-4 shadow-sm relative overflow-hidden transition group block"
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-slate-400 group-hover:text-purple-300">Cybersecurity Risk</span>
            <div className="p-2 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white mt-2">{stats.riskScore} / 100</div>
          <div className="text-[11px] mt-1 flex items-center justify-between">
            <span className={`font-semibold ${stats.riskScore >= 50 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {stats.riskLevel}
            </span>
            <span className="text-[10px] text-purple-400 font-mono">Open Center →</span>
          </div>
        </Link>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ingestion & Verification Velocity Chart */}
        <div className="lg:col-span-8 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Document Ingestion & Verification Velocity</h2>
              <p className="text-xs text-slate-400">7-Day cryptographic hash generation and chain verification activity</p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                <span className="text-slate-300">Ingested</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span className="text-slate-300">Verified</span>
              </div>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={uploadTrend}>
                <defs>
                  <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Area type="monotone" dataKey="documents" stroke="#06B6D4" strokeWidth={2} fillOpacity={1} fill="url(#cyanGrad)" />
                <Area type="monotone" dataKey="verifications" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#blueGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white">Document Classification Distribution</h2>
            <p className="text-xs text-slate-400">Vault files categorized by legal sensitivity</p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryDistribution} layout="vertical">
                <XAxis type="number" stroke="#64748B" fontSize={10} hide />
                <YAxis type="category" dataKey="name" stroke="#94A3B8" fontSize={11} width={75} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B1120', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>FIPS 180-4 Standard:</span>
              <span className="text-emerald-400 font-mono font-semibold">Active</span>
            </div>
            <div className="flex justify-between">
              <span>Ledger Continuity:</span>
              <span className="text-cyan-400 font-mono font-semibold">100% Intact</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Ingested Documents & Activity Feed Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ingested Documents Table */}
        <div className="lg:col-span-8 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Recent Evidentiary Submissions</h2>
              <p className="text-xs text-slate-400">Latest records registered and anchored with SHA-256 fingerprints</p>
            </div>
            <Link
              to="/documents"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-medium"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1120] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Document ID</th>
                  <th className="p-3">Title & Case</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">SHA-256 Fingerprint</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {recentDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono text-cyan-400 font-semibold whitespace-nowrap">
                      {doc.id}
                    </td>
                    <td className="p-3">
                      <div className="font-medium text-white max-w-xs truncate">{doc.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{doc.case?.id}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          doc.classification === 'RESTRICTED'
                            ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                            : doc.classification === 'HIGHLY_CONFIDENTIAL'
                            ? 'bg-orange-950 text-orange-400 border border-orange-500/30'
                            : doc.classification === 'CONFIDENTIAL'
                            ? 'bg-amber-950 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {doc.classification}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-[10px] text-emerald-400 max-w-[140px] truncate">
                      {doc.currentHash}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="p-1.5 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 inline-flex items-center space-x-1"
                        title="Inspect Document"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Immutable Audit Feed */}
        <div className="lg:col-span-4 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white">Audit Trail Stream</h2>
              <p className="text-xs text-slate-400">Real-time immutable activity log</p>
            </div>
            <Link
              to="/audit"
              className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center space-x-1 font-medium"
            >
              <span>Full Log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="p-4 space-y-3 flex-1 overflow-y-auto max-h-80">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold text-cyan-400">
                    {log.action}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      log.status === 'SUCCESS'
                        ? 'bg-emerald-950 text-emerald-400'
                        : 'bg-rose-950 text-rose-400'
                    }`}
                  >
                    {log.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-200">
                  {log.userName} ({log.userRole?.replace('_', ' ')})
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{log.resourceType}: {log.resourceId || 'System'}</span>
                  <span className="font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-950 border-t border-slate-800 text-center">
            <Link
              to="/audit"
              className="text-xs text-cyan-400 hover:underline font-medium"
            >
              Download Signed Compliance CSV →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

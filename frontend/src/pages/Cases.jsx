import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderLock,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Shield,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  X,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Cases() {
  const { user, can } = useAuth();
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Create Case Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [caseType, setCaseType] = useState('WOMEN_SAFETY');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [firNumber, setFirNumber] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  const loadCases = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const res = await api.getCases(params);
      if (res.success) {
        setCases(res.cases);
      }
    } catch (err) {
      console.warn('Load cases error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, [statusFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadCases();
  };

  const handleCreateCase = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      setError('Title and description are required.');
      return;
    }
    setCreating(true);
    setError('');

    try {
      const res = await api.createCase({
        title,
        caseType,
        description,
        priority,
        firNumber,
      });

      if (res.success) {
        setIsModalOpen(false);
        setTitle('');
        setDescription('');
        setFirNumber('');
        loadCases();
      } else {
        setError(res.message || 'Failed to create case');
      }
    } catch (err) {
      setError(err.message || 'Error communicating with server');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              CRIMINAL DOSSIER REGISTRY
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              TOTAL: {cases.length}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Case Management Vault</h1>
          <p className="text-xs text-slate-400">
            Secure multi-agency investigation files and evidentiary repositories
          </p>
        </div>

        {can('CREATE_CASE') && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-cyan-900/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Initialize New Case</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Case ID, title, FIR..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Case Statuses</option>
            <option value="OPEN">Open</option>
            <option value="UNDER_INVESTIGATION">Under Investigation</option>
            <option value="LEGAL_REVIEW">Under Legal Review</option>
            <option value="COURT_SUBMITTED">Submitted to Court</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical Priority</option>
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Cases Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
          <span>Retrieving encrypted case dossiers...</span>
        </div>
      ) : cases.length === 0 ? (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-12 text-center text-xs text-slate-400 space-y-2">
          <FolderLock className="w-8 h-8 text-slate-600 mx-auto" />
          <div className="font-semibold text-white">No Case Records Found</div>
          <p>No dossiers match the selected query criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cases.map((c) => (
            <div
              key={c.id}
              className="bg-[#0F172A] border border-[#1E293B] hover:border-cyan-500/40 rounded-xl p-5 shadow-sm transition flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/20">
                    {c.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.priority === 'CRITICAL'
                        ? 'bg-rose-950 text-rose-400 border border-rose-500/30'
                        : c.priority === 'HIGH'
                        ? 'bg-orange-950 text-orange-400 border border-orange-500/30'
                        : 'bg-blue-950 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {c.priority}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-3 leading-relaxed">
                    {c.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>FIR Reference:</span>
                  <span className="font-mono text-white text-[11px]">{c.firNumber || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Assigned Officer:</span>
                  <span className="text-slate-200">{c.assignedOfficer?.fullName || 'Unassigned'}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Documents In Vault:</span>
                  <span className="font-mono text-cyan-400 font-semibold">{c._count?.documents || 0}</span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      c.status === 'UNDER_INVESTIGATION'
                        ? 'bg-amber-950 text-amber-400'
                        : c.status === 'LEGAL_REVIEW'
                        ? 'bg-purple-950 text-purple-400'
                        : c.status === 'COURT_SUBMITTED'
                        ? 'bg-blue-950 text-blue-400'
                        : 'bg-emerald-950 text-emerald-400'
                    }`}
                  >
                    ● {c.status.replace(/_/g, ' ')}
                  </span>

                  <Link
                    to={`/cases/${c.id}`}
                    className="p-1.5 px-3 rounded-lg bg-slate-800 hover:bg-cyan-900/60 hover:text-cyan-300 text-slate-300 flex items-center space-x-1 text-xs font-medium transition"
                  >
                    <span>Open Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Case Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0B1120]">
              <div className="flex items-center space-x-2.5">
                <FolderLock className="w-5 h-5 text-cyan-400" />
                <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
                  Initialize New Investigation Dossier
                </h2>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="p-6 space-y-4">
              {error && (
                <div className="p-3 rounded bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Investigation Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cyber Extortion and Non-Consensual Media Distribution"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Specialized Crime Domain *
                  </label>
                  <select
                    value={caseType}
                    onChange={(e) => setCaseType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="WOMEN_SAFETY">Women Safety & Harassment</option>
                    <option value="CYBER_CRIME">Cyber Forensics & Fraud</option>
                    <option value="FINANCIAL_FRAUD">Financial Syndicate</option>
                    <option value="NARCOTICS">Narcotics & Smuggling</option>
                    <option value="SPECIAL_INVESTIGATION">Special Investigation Unit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Priority Level *
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  FIR Registration Number (Optional)
                </label>
                <input
                  type="text"
                  value={firNumber}
                  onChange={(e) => setFirNumber(e.target.value)}
                  placeholder="e.g. FIR-2026-DL-00994"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Investigation Summary & Incident Facts *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Describe the complaint circumstances, key suspects, and jurisdictional parameters..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center space-x-2 disabled:opacity-50"
                >
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Case Dossier</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

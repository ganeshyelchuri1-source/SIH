import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Filter,
  Download,
  ShieldCheck,
  CheckCircle2,
  Upload,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Documents({ onOpenUpload, onOpenVerify }) {
  const { user, can } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [classificationFilter, setClassificationFilter] = useState('');

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (classificationFilter) params.classification = classificationFilter;

      const res = await api.getDocuments(params);
      if (res.success) {
        setDocuments(res.documents);
      }
    } catch (err) {
      console.warn('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [categoryFilter, classificationFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadDocuments();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              NATIONAL EVIDENTIARY REPOSITORY
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              RECORDS: {documents.length}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Classified Document Vault</h1>
          <p className="text-xs text-slate-400">
            Cryptographically anchored investigation records, forensic reports, and court filings
          </p>
        </div>

        <div className="flex items-center space-x-3">
          {can('UPLOAD') && (
            <button
              onClick={() => onOpenUpload && onOpenUpload()}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-cyan-900/20 transition"
            >
              <Upload className="w-4 h-4" />
              <span>Ingest Document</span>
            </button>
          )}
          <button
            onClick={onOpenVerify}
            className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Verify Fingerprint</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Document ID, Title, Hash..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Categories</option>
            <option value="FIR">First Information Report (FIR)</option>
            <option value="WITNESS_STATEMENT">Witness Statement</option>
            <option value="FORENSIC_REPORT">Forensic Report</option>
            <option value="CHARGE_SHEET">Charge Sheet</option>
            <option value="COURT_FILING">Court Filing</option>
            <option value="EVIDENCE_RECORD">Evidence Record</option>
            <option value="INVESTIGATION_RECORD">Investigation Record</option>
          </select>

          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:border-cyan-500 focus:outline-none"
          >
            <option value="">All Classifications</option>
            <option value="PUBLIC">Public</option>
            <option value="INTERNAL">Internal Law Enforcement</option>
            <option value="CONFIDENTIAL">Confidential</option>
            <option value="HIGHLY_CONFIDENTIAL">Highly Confidential</option>
            <option value="RESTRICTED">Restricted</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Scanning cryptographic registry...</span>
          </div>
        ) : documents.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 space-y-2">
            <FileText className="w-8 h-8 text-slate-600 mx-auto" />
            <div className="font-semibold text-white">No Custody Records Found</div>
            <p>Try clearing filters or search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B1120] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Doc ID</th>
                  <th className="p-3">Title & File</th>
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Classification</th>
                  <th className="p-3">SHA-256 Fingerprint</th>
                  <th className="p-3">Version</th>
                  <th className="p-3">Signature</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-mono text-cyan-400 font-bold whitespace-nowrap">
                      {doc.id}
                    </td>
                    <td className="p-3">
                      <div className="font-semibold text-white max-w-xs truncate">{doc.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{doc.fileName}</div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <Link
                        to={`/cases/${doc.caseId}`}
                        className="font-mono text-slate-300 hover:text-cyan-400 text-xs font-medium"
                      >
                        {doc.caseId}
                      </Link>
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
                    <td className="p-3 font-mono text-[10px] text-emerald-400 max-w-[130px] truncate">
                      {doc.currentHash}
                    </td>
                    <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                      v{doc.currentVersion}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {doc.digitalSignatures && doc.digitalSignatures.length > 0 ? (
                        <span className="text-[10px] text-emerald-400 flex items-center space-x-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Signed</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500">Unsigned</span>
                      )}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link
                        to={`/documents/${doc.id}`}
                        className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 text-slate-300 inline-flex items-center space-x-1 font-semibold text-xs transition"
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
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

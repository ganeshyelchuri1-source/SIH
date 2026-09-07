import React, { useState, useEffect } from 'react';
import { X, UploadCloud, FileText, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function UploadModal({ isOpen, onClose, onSuccess }) {
  const [cases, setCases] = useState([]);
  const [caseId, setCaseId] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('FIR');
  const [classification, setClassification] = useState('CONFIDENTIAL');
  const [file, setFile] = useState(null);
  const [clientHash, setClientHash] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const categories = [
    { value: 'FIR', label: 'First Information Report (FIR)' },
    { value: 'POLICE_REPORT', label: 'Police Report' },
    { value: 'INVESTIGATION_RECORD', label: 'Investigation Record' },
    { value: 'WITNESS_STATEMENT', label: 'Witness Statement' },
    { value: 'CHARGE_SHEET', label: 'Charge Sheet' },
    { value: 'COURT_FILING', label: 'Court Filing' },
    { value: 'EVIDENCE_RECORD', label: 'Evidence Record' },
    { value: 'FORENSIC_REPORT', label: 'Forensic Report' },
    { value: 'LEGAL_NOTICE', label: 'Legal Notice' },
    { value: 'JUDGMENT', label: 'Judgment' },
    { value: 'OTHER', label: 'Other Official Document' },
  ];

  const classifications = [
    { value: 'PUBLIC', label: 'Public', color: 'text-slate-400' },
    { value: 'INTERNAL', label: 'Internal Law Enforcement', color: 'text-blue-400' },
    { value: 'CONFIDENTIAL', label: 'Confidential (Standard)', color: 'text-amber-400' },
    { value: 'HIGHLY_CONFIDENTIAL', label: 'Highly Confidential', color: 'text-orange-400' },
    { value: 'RESTRICTED', label: 'Restricted (Need-To-Know Only)', color: 'text-rose-400' },
  ];

  useEffect(() => {
    if (isOpen) {
      api.getCases().then((res) => {
        if (res.success && res.cases) {
          setCases(res.cases);
          if (res.cases.length > 0 && !caseId) {
            setCaseId(res.cases[0].id);
          }
        }
      });
      // Reset
      setResult(null);
      setError('');
      setFile(null);
      setClientHash('');
      setTitle('');
    }
  }, [isOpen]);

  // Compute SHA-256 client-side as soon as file is chosen
  const handleFileChange = async (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    if (!title) {
      setTitle(selected.name.replace(/\.[^/.]+$/, ''));
    }

    try {
      const buffer = await selected.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      setClientHash(hashHex);
    } catch (err) {
      console.warn('Could not compute client-side SHA256:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !caseId || !title) {
      setError('Please provide all mandatory fields and select a file.');
      return;
    }

    setError('');
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caseId', caseId);
    formData.append('title', title);
    formData.append('category', category);
    formData.append('classification', classification);

    try {
      const res = await api.uploadDocument(formData);
      if (res.success) {
        setResult(res.document);
        if (onSuccess) onSuccess(res.document);
      } else {
        setError(res.message || 'Upload failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during secure upload');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0B1120]">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              Secure Document Ingestion & Fingerprinting
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {result ? (
            /* Success confirmation showing generated SHA-256 and blockchain block */
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start space-x-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-emerald-300">
                    DOCUMENT REGISTERED & ANCHORED TO LEDGER
                  </h3>
                  <p className="text-xs text-slate-300">
                    Cryptographic fingerprint registered on NCRB Blockchain Block #{result.ledgerBlockIndex}.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/80 rounded-lg p-4 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Document ID:</span>
                  <span className="font-mono font-semibold text-cyan-400">{result.id}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Case Dossier:</span>
                  <span className="font-semibold text-white">{result.caseId}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800">
                  <span className="text-slate-400">Classification:</span>
                  <span className="font-semibold text-amber-400">{result.classification}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-400 block mb-1">SHA-256 Fingerprint:</span>
                  <div className="font-mono text-[11px] text-emerald-400 bg-slate-950 p-2 rounded break-all border border-emerald-500/20">
                    {result.sha256}
                  </div>
                </div>
                <div className="flex justify-between py-1 border-t border-slate-800">
                  <span className="text-slate-400">Ledger Block Hash:</span>
                  <span className="font-mono text-[11px] text-slate-300 truncate max-w-xs">{result.ledgerBlockHash}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
                >
                  Close & View in Repository
                </button>
              </div>
            </div>
          ) : (
            /* Upload Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Case Selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Associate Case Dossier *
                  </label>
                  <select
                    value={caseId}
                    onChange={(e) => setCaseId(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    required
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Document Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Document Title */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Document Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Certified Witness Statement of S. K. Nambiar"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                {/* Security Classification */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Security Classification *
                  </label>
                  <select
                    value={classification}
                    onChange={(e) => setClassification(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                    required
                  >
                    {classifications.map((cl) => (
                      <option key={cl.value} value={cl.value}>
                        {cl.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Drag & Drop File Zone */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Upload Evidentiary File (PDF, Images, Word, Text) *
                </label>
                <label className="border-2 border-dashed border-slate-700 hover:border-cyan-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-900/50 transition">
                  <UploadCloud className="w-8 h-8 text-cyan-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-200">
                    {file ? file.name : 'Click or Drag file to ingest'}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-1">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'FIPS 180-4 SHA-256 auto-calculated upon selection'}
                  </span>
                  <input type="file" onChange={handleFileChange} className="hidden" />
                </label>
              </div>

              {/* Real-time Client-side SHA-256 Indicator */}
              {clientHash && (
                <div className="p-3 bg-slate-950 border border-cyan-500/30 rounded-lg space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-cyan-400 font-semibold flex items-center space-x-1">
                      <span>✓</span>
                      <span>Real-time SHA-256 Calculated:</span>
                    </span>
                    <span className="text-slate-500 font-mono text-[10px]">Pre-ingestion Check</span>
                  </div>
                  <div className="font-mono text-[11px] text-emerald-400 break-all">{clientHash}</div>
                </div>
              )}

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold flex items-center space-x-2 disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Ingesting & Anchoring...</span>
                    </>
                  ) : (
                    <>
                      <span>Register & Anchor</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

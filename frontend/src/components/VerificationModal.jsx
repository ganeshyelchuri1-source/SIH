import React, { useState } from 'react';
import { X, SearchCheck, CheckCircle2, AlertTriangle, ShieldCheck, FileCheck, Loader2 } from 'lucide-react';
import { api } from '../services/api';

export default function VerificationModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'hash'
  const [file, setFile] = useState(null);
  const [rawHash, setRawHash] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleVerify = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setError('');
    setResult(null);

    try {
      let res;
      if (activeTab === 'file') {
        if (!file) {
          setError('Please select a file to verify');
          setVerifying(false);
          return;
        }
        const formData = new FormData();
        formData.append('file', file);
        res = await api.verifyRawHash(formData);
      } else {
        if (!rawHash) {
          setError('Please enter a SHA-256 hash');
          setVerifying(false);
          return;
        }
        res = await api.verifyRawHash(rawHash);
      }

      setResult(res);
    } catch (err) {
      setError(err.message || 'Verification check failed');
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#0B1120]">
          <div className="flex items-center space-x-2.5">
            <SearchCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-semibold tracking-wide text-white uppercase">
              Blockchain Document Integrity Verifier
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-900/60">
          <button
            onClick={() => { setActiveTab('file'); setResult(null); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${
              activeTab === 'file'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Verify Physical File
          </button>
          <button
            onClick={() => { setActiveTab('hash'); setResult(null); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-semibold text-center border-b-2 transition ${
              activeTab === 'hash'
                ? 'border-cyan-400 text-cyan-300 bg-cyan-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Verify by SHA-256 Hash
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            {activeTab === 'file' ? (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Select File from Computer to Recalculate & Test
                </label>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="w-full text-xs text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-950 file:text-cyan-300 hover:file:bg-cyan-900 cursor-pointer"
                />
              </div>
            ) : (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Input 64-Character SHA-256 Hash
                </label>
                <input
                  type="text"
                  value={rawHash}
                  onChange={(e) => setRawHash(e.target.value)}
                  placeholder="e.g. 9b88c42a5bf8f090b841a129d5b512015037d26e4760a927a4d55fb2c80c2f6d"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {verifying ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Computing Cryptographic Proof...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>VERIFY DOCUMENT INTEGRITY</span>
                </>
              )}
            </button>
          </form>

          {/* Verification Result Display */}
          {result && (
            <div
              className={`p-4 rounded-xl border space-y-3 animate-in fade-in ${
                result.verified
                  ? 'bg-emerald-950/40 border-emerald-500/40'
                  : 'bg-rose-950/40 border-rose-500/40'
              }`}
            >
              <div className="flex items-start space-x-3">
                {result.verified ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0" />
                )}
                <div>
                  <h3
                    className={`text-sm font-bold tracking-wide ${
                      result.verified ? 'text-emerald-300' : 'text-rose-300'
                    }`}
                  >
                    {result.verified
                      ? '✓ DOCUMENT INTEGRITY VERIFIED'
                      : '⚠ DOCUMENT INTEGRITY UNCONFIRMED / COMPROMISED'}
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">{result.message}</p>
                </div>
              </div>

              {result.verified && result.block && (
                <div className="bg-slate-950/80 rounded-lg p-3 text-[11px] font-mono space-y-1.5 border border-slate-800">
                  <div className="text-slate-400">
                    Anchored In: <span className="text-cyan-400 font-bold">Ledger Block #{result.block.blockIndex}</span>
                  </div>
                  {result.block.document && (
                    <div className="text-slate-400">
                      Associated File: <span className="text-white">{result.block.document.title} ({result.block.document.id})</span>
                    </div>
                  )}
                  <div className="text-slate-400">
                    Validator Node: <span className="text-slate-200">{result.block.validator}</span>
                  </div>
                  <div className="text-slate-400">
                    Registered Hash:{' '}
                    <span className="text-emerald-400 break-all">{result.block.documentHash}</span>
                  </div>
                  <div className="text-slate-400">
                    Block Hash:{' '}
                    <span className="text-slate-300 break-all">{result.block.blockHash}</span>
                  </div>
                  <div className="text-slate-500 text-[10px] pt-1">
                    Timestamp: {new Date(result.block.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Layers,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Search,
  Link as LinkIcon,
  RefreshCw,
  ArrowRight,
  ChevronDown,
  Loader2,
  FileCheck,
} from 'lucide-react';
import { api } from '../services/api';

export default function IntegrityLedger({ onOpenVerify }) {
  const [blocks, setBlocks] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Full chain validation state
  const [validatingChain, setValidatingChain] = useState(false);
  const [chainValidationResult, setChainValidationResult] = useState(null);

  const loadLedger = async () => {
    setLoading(true);
    try {
      const res = await api.getLedger({ page, limit: 15, search });
      if (res.success) {
        setBlocks(res.blocks);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      }
    } catch (err) {
      console.warn('Failed to load ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, [page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadLedger();
  };

  const handleValidateChain = async () => {
    setValidatingChain(true);
    setChainValidationResult(null);
    try {
      const res = await api.validateChain();
      if (res.success) {
        setChainValidationResult(res);
      }
    } catch (err) {
      setChainValidationResult({
        isValid: false,
        message: 'Chain validation request failed: ' + err.message,
      });
    } finally {
      setValidatingChain(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              BLOCKCHAIN CONSENSUS LEDGER
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              BLOCKS: {total}
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">Tamper-Evident Integrity Ledger</h1>
          <p className="text-xs text-slate-400">
            Immutable SHA-256 hash chaining designed for Hyperledger Fabric / permissioned consortium integration
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleValidateChain}
            disabled={validatingChain}
            className="px-4 py-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-950/30 transition"
          >
            {validatingChain ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
            <span>Validate Entire Chain</span>
          </button>

          <button
            onClick={onOpenVerify}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <FileCheck className="w-4 h-4 text-cyan-400" />
            <span>Verify Document</span>
          </button>
        </div>
      </div>

      {/* Chain Validation Result Banner */}
      {chainValidationResult && (
        <div
          className={`p-4 rounded-xl border flex items-start space-x-3 animate-in fade-in ${
            chainValidationResult.isValid
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : 'bg-rose-950/40 border-rose-500/40'
          }`}
        >
          {chainValidationResult.isValid ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-6 h-6 text-rose-400 flex-shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <h3
              className={`font-bold uppercase tracking-wider ${
                chainValidationResult.isValid ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {chainValidationResult.isValid
                ? '✓ BLOCKCHAIN LEDGER IS 100% INTACT & VERIFIED'
                : '⚠ INTEGRITY COMPROMISED: CHAIN INCONSISTENCY DETECTED'}
            </h3>
            <p className="text-slate-300">{chainValidationResult.message}</p>
            <div className="text-[10px] font-mono text-slate-400 pt-1">
              Total Validated Blocks: {chainValidationResult.totalBlocks} • Consensus Nodes: NCRB-NODE-01, NCRB-NODE-02, MHA-AUDIT
            </div>
          </div>
        </div>
      )}

      {/* Blockchain Chaining Architecture Visualizer Strip */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Cryptographic Hash-Chaining Sequence</span>
          </span>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20">
            SHA-256(BlockIndex || DocHash || PrevHash || Time)
          </span>
        </div>

        {/* Chaining Strip */}
        <div className="flex items-center space-x-3 overflow-x-auto py-2">
          {blocks.slice(0, 4).reverse().map((b, idx) => (
            <React.Fragment key={b.id}>
              <div className="flex-shrink-0 w-64 bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs space-y-1.5 font-mono">
                <div className="flex justify-between items-center text-[11px] pb-1 border-b border-slate-800">
                  <span className="text-cyan-400 font-bold">
                    {b.blockIndex === 0 ? 'GENESIS BLOCK #0' : `BLOCK #${b.blockIndex}`}
                  </span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                    OK
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Document Hash:</span>
                  <span className="text-emerald-400 text-[10px] truncate block">{b.documentHash}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Prev Block Hash:</span>
                  <span className="text-slate-400 text-[10px] truncate block">{b.previousHash}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">Block Hash:</span>
                  <span className="text-cyan-300 text-[10px] truncate block font-bold">{b.blockHash}</span>
                </div>
              </div>

              {idx < 3 && idx < blocks.length - 1 && (
                <div className="text-cyan-400 flex-shrink-0 animate-pulse">
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-4 shadow-sm flex items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search block by Document ID or Hash string..."
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
          />
        </form>

        <button
          onClick={loadLedger}
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white"
          title="Refresh Ledger"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Ledger Blocks Table */}
      <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
            <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
            <span>Verifying ledger chain state...</span>
          </div>
        ) : blocks.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No blockchain ledger blocks found matching query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#0B1120] text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Block #</th>
                  <th className="p-3">Document Record</th>
                  <th className="p-3">Document Hash (SHA-256)</th>
                  <th className="p-3">Previous Block Hash</th>
                  <th className="p-3">Current Block Hash</th>
                  <th className="p-3">Validator</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {blocks.map((block) => (
                  <tr key={block.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3 font-bold text-cyan-400 whitespace-nowrap">
                      #{block.blockIndex}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      {block.document ? (
                        <div>
                          <div className="font-semibold text-white truncate max-w-[180px]">
                            {block.document.title}
                          </div>
                          <div className="text-[10px] text-cyan-400 font-mono">
                            {block.document.id}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-sans italic text-[11px]">
                          Genesis / Anchor
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-emerald-400 max-w-[130px] truncate text-[10px]">
                      {block.documentHash}
                    </td>
                    <td className="p-3 text-slate-400 max-w-[130px] truncate text-[10px]">
                      {block.previousHash}
                    </td>
                    <td className="p-3 text-cyan-300 font-bold max-w-[130px] truncate text-[10px]">
                      {block.blockHash}
                    </td>
                    <td className="p-3 text-slate-300 text-[10px] whitespace-nowrap">
                      {block.validator}
                    </td>
                    <td className="p-3 text-slate-500 text-[10px] whitespace-nowrap">
                      {new Date(block.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-400">
              Page {page} of {totalPages}
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

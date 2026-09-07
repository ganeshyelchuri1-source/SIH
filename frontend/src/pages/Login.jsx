import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, KeyRound, AlertTriangle, ShieldCheck, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('849201');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const demoAccounts = [
    {
      role: 'Super Admin',
      email: 'admin@ncrb-demo.gov',
      name: 'Dr. Rajesh Verma',
      badge: 'NCRB-ADM-001',
      desc: 'System settings, user management, global oversight',
      color: 'border-purple-500/40 text-purple-400 bg-purple-950/20',
    },
    {
      role: 'Investigating Officer',
      email: 'officer@ncrb-demo.gov',
      name: 'Insp. Vikram Rathore',
      badge: 'NCRB-INV-104',
      desc: 'Create cases, upload FIRs, versioning, evidence handling',
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20',
    },
    {
      role: 'Legal Officer',
      email: 'legal@ncrb-demo.gov',
      name: 'Adv. Meera Sen',
      badge: 'NCRB-LEG-202',
      desc: 'Review legal briefs, court filings, digital signature',
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/20',
    },
    {
      role: 'Reviewer / Dy. SP',
      email: 'reviewer@ncrb-demo.gov',
      name: 'Dy. SP Anita Deshmukh',
      badge: 'NCRB-REV-305',
      desc: 'Supervisory review, approve/reject access requests',
      color: 'border-amber-500/40 text-amber-400 bg-amber-950/20',
    },
    {
      role: 'Auditor',
      email: 'auditor@ncrb-demo.gov',
      name: 'Auditor R. K. Iyer',
      badge: 'NCRB-AUD-401',
      desc: 'Verify blockchain integrity, immutable audit trails, export CSV',
      color: 'border-blue-500/40 text-blue-400 bg-blue-950/20',
    },
  ];

  const handleQuickLogin = async (demoEmail) => {
    setEmail(demoEmail);
    setPassword('Demo@2026');
    setLoading(true);
    setError('');
    try {
      await login(demoEmail, 'Demo@2026', mfaCode);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password, mfaCode);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Cyber Grid Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none"></div>

      {/* Official Government Header Banner */}
      <div className="w-full max-w-4xl text-center mb-6 space-y-2 z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
          <Shield className="w-3.5 h-3.5" />
          <span>MINISTRY OF HOME AFFAIRS • GOVERNMENT OF INDIA</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          National Crime Records Bureau (NCRB)
        </h1>
        <p className="text-xs sm:text-sm text-cyan-400 font-medium">
          Women Safety Division • Secure Digital Document Custody & Blockchain Verification Platform
        </p>
      </div>

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 gap-6 z-10 items-stretch">
        {/* Left Column: Login Form */}
        <div className="lg:col-span-6 bg-[#0F172A]/90 backdrop-blur-md border border-[#1E293B] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Law Enforcement Portal Login</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enter authorized agency credentials with cryptographic MFA
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Official Email / Badge Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. officer@ncrb-demo.gov or NCRB-INV-104"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* MFA Simulation */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Cryptographic OTP / Token
                </label>
                <span className="text-[10px] text-cyan-400 font-mono">FIPS 140-2 Token</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  maxLength={6}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-cyan-300 font-mono tracking-widest focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-slate-400">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                />
                <span>Remember console</span>
              </label>
              <span className="text-slate-500 hover:text-slate-400 cursor-pointer">
                Reset credentials?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-cyan-950/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials & Session...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>AUTHENTICATE & ENTER VAULT</span>
                </>
              )}
            </button>
          </form>

          {/* Legal Notice */}
          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-500 text-center">
            ⚠ Warning: Unauthorized access attempt is a punishable offense under Information Technology Act 2000 & BNS 2023. All terminal sessions logged.
          </div>
        </div>

        {/* Right Column: Hackathon Demo Role Switcher */}
        <div className="lg:col-span-6 bg-[#0B1120]/90 border border-[#1E293B] rounded-2xl p-6 shadow-2xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Smart India Hackathon • One-Click Evaluation Roles
              </h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Click any role to auto-populate credentials and test end-to-end RBAC permissions across police, courts, reviewers, and auditors:
            </p>
          </div>

          <div className="space-y-2.5">
            {demoAccounts.map((acc) => (
              <button
                key={acc.role}
                onClick={() => handleQuickLogin(acc.email)}
                disabled={loading}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center justify-between hover:scale-[1.01] ${acc.color}`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-white">{acc.role}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-300">
                      {acc.badge}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300">{acc.name}</div>
                  <div className="text-[10px] text-slate-400">{acc.desc}</div>
                </div>
                <div className="p-1.5 rounded-lg bg-black/30 text-white flex-shrink-0 ml-2">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Universal Demo Password:</span>
            <span className="font-mono text-cyan-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-cyan-500/20">
              Demo@2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

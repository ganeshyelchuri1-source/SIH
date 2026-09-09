import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, KeyRound, AlertTriangle, ShieldCheck, ArrowRight, Loader2, Sparkles, ExternalLink, Globe, FileCheck } from 'lucide-react';
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
      role: 'Chief Super Admin (Master)',
      email: 'ganesh@ncrb-demo.gov',
      name: 'Director Ganesh Yelchuri',
      badge: 'GANESH',
      desc: 'Master Command Access: All cases, blockchain ledger, AI studio, threat center',
      color: 'border-cyan-400/80 text-cyan-300 bg-cyan-950/40 ring-1 ring-cyan-500/40',
    },
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
    const pwd = demoEmail.includes('ganesh') ? 'Ganesh@2026' : 'Demo@2026';
    setPassword(pwd);
    setLoading(true);
    setError('');
    try {
      await login(demoEmail, pwd, mfaCode);
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

      {/* Official Government Header Banner & Links */}
      <div className="w-full max-w-4xl text-center mb-6 space-y-3 z-10">
        {/* Top Government Official Links Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-slate-400 font-sans pb-1">
          <a
            href="https://www.mha.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            title="Ministry of Home Affairs, Government of India"
            className="hover:text-cyan-300 flex items-center space-x-1 transition"
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span>Ministry of Home Affairs</span>
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://ncrb.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            title="National Crime Records Bureau Official Portal"
            className="hover:text-cyan-300 flex items-center space-x-1 transition"
          >
            <span>National Crime Records Bureau</span>
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            title="National Cyber Crime Reporting Portal"
            className="hover:text-cyan-300 flex items-center space-x-1 transition"
          >
            <span>National Cyber Crime Portal</span>
          </a>
          <span className="text-slate-700">•</span>
          <a
            href="https://www.digitalindia.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            title="Digital India E-Governance Initiative"
            className="hover:text-cyan-300 flex items-center space-x-1 transition"
          >
            <span>Digital India Portal</span>
          </a>
        </div>

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
                  placeholder="e.g. ganesh or ganesh@ncrb-demo.gov or NCRB-INV-104"
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
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                title="Contact National Cyber Crime Help Desk for Credential Assistance"
                className="text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                Officer Support & Help Desk
              </a>
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

      {/* Official Government Portal Comprehensive Links Footer for Crawlers and Auditors */}
      <footer className="w-full max-w-4xl mt-8 pt-6 border-t border-slate-800 text-xs text-slate-400 z-10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Column 1: Operational Platform Modules */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Platform Custody Modules</span>
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li>
                <Link to="/" title="Access Central Custody Dashboard" className="hover:text-cyan-300 transition">
                  Central Custody Dashboard
                </Link>
              </li>
              <li>
                <Link to="/cases" title="Browse Criminal Investigation Case Dossiers" className="hover:text-cyan-300 transition">
                  Investigation Case Vault
                </Link>
              </li>
              <li>
                <Link to="/documents" title="Search Classified Legal Documents" className="hover:text-cyan-300 transition">
                  Classified Document Repository
                </Link>
              </li>
              <li>
                <Link to="/integrity" title="Verify Document Provenance and Blockchain Ledger" className="hover:text-cyan-300 transition">
                  Blockchain Integrity Ledger
                </Link>
              </li>
              <li>
                <Link to="/ai-intelligence" title="AI Document Intelligence and Search" className="hover:text-cyan-300 transition">
                  AI Legal Intelligence Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Governance & Security Monitoring */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Governance & Security</span>
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li>
                <Link to="/security" title="Monitor System Security and Threat Incidents" className="hover:text-cyan-300 transition">
                  Threat Monitoring & Risk Score
                </Link>
              </li>
              <li>
                <Link to="/access-requests" title="Classified Record Access Authorization Queue" className="hover:text-cyan-300 transition">
                  Clearance Authorization Queue
                </Link>
              </li>
              <li>
                <Link to="/audit" title="Examine Immutable Forensic Audit Log" className="hover:text-cyan-300 transition">
                  Forensic Audit Trail & CSV
                </Link>
              </li>
              <li>
                <Link to="/reports" title="Generate Form 65B BNSS Electronic Evidence Certificates" className="hover:text-cyan-300 transition">
                  Official Compliance Reports
                </Link>
              </li>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Official Citizen Cybercrime Reporting Portal"
                  className="hover:text-cyan-300 flex items-center space-x-1 transition"
                >
                  <span>National Cybercrime Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Statutory Authority & Legal Frameworks */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Statutory Compliance</span>
            </h4>
            <ul className="space-y-1 text-[11px]">
              <li>
                <a
                  href="https://www.mha.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Ministry of Home Affairs Official Website"
                  className="hover:text-cyan-300 flex items-center space-x-1 transition"
                >
                  <span>Ministry of Home Affairs (MHA)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://ncrb.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="National Crime Records Bureau Official Portal"
                  className="hover:text-cyan-300 flex items-center space-x-1 transition"
                >
                  <span>National Crime Records Bureau (NCRB)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.indiacode.nic.in/handle/123456789/21431"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Section 63 of Bharatiya Nagarik Suraksha Sanhita 2023 Electronic Evidence"
                  className="hover:text-cyan-300 flex items-center space-x-1 transition"
                >
                  <span>Section 63 BNSS Electronic Evidence</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.cert-in.org.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Indian Computer Emergency Response Team Official Portal"
                  className="hover:text-cyan-300 flex items-center space-x-1 transition"
                >
                  <span>CERT-In National Cyber Defense</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.digitalindia.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Digital India National E-Governance Division"
                  className="hover:text-cyan-300 flex items-center space-x-1 transition"
                >
                  <span>Digital India E-Governance</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
          <div>
            © 2026 National Crime Records Bureau • Ministry of Home Affairs, Government of India. All rights reserved.
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-cyan-500 font-mono">FIPS 180-4 SHA-256</span>
            <span>•</span>
            <span className="text-emerald-500 font-mono">Blockchain Anchored</span>
            <span>•</span>
            <span className="text-purple-500 font-mono">SIH26190</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

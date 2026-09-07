import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Building,
  Shield,
  Unlock,
  UserCheck,
  UserX,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [settings, setSettings] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // users, departments, settings
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [usersRes, deptsRes, setRes] = await Promise.all([
        api.getUsers(),
        api.getDepartments(),
        api.getSystemSettings(),
      ]);

      if (usersRes.success) setUsers(usersRes.users);
      if (deptsRes.success) setDepartments(deptsRes.departments);
      if (setRes.success) setSettings(setRes.settings);
    } catch (err) {
      console.warn('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const res = await api.toggleUserStatus(id, !currentStatus);
      if (res.success) {
        setMessage(`User status updated to ${!currentStatus ? 'Active' : 'Inactive'}`);
        loadAdminData();
      }
    } catch (err) {
      setMessage('Status update failed: ' + err.message);
    }
  };

  const handleResetLockout = async (id) => {
    try {
      const res = await api.resetLockout(id);
      if (res.success) {
        setMessage(res.message);
        loadAdminData();
      }
    } catch (err) {
      setMessage('Reset lockout failed: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400">
              CENTRAL ADMINISTRATOR CONSOLE
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              ROOT CLEARANCE
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mt-1">System Administration & RBAC</h1>
          <p className="text-xs text-slate-400">
            Manage law enforcement personnel, departmental divisions, and system security thresholds
          </p>
        </div>

        <button
          onClick={loadAdminData}
          className="p-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center space-x-1.5 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Records</span>
        </button>
      </div>

      {message && (
        <div className="p-3 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center space-x-2">
          <span>✓</span>
          <span>{message}</span>
        </div>
      )}

      {/* Tab Nav */}
      <div className="flex border-b border-slate-800 space-x-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'users'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Personnel Directory ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('departments')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'departments'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Departmental Divisions ({departments.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`pb-3 flex items-center space-x-2 border-b-2 transition ${
            activeTab === 'settings'
              ? 'border-cyan-400 text-cyan-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Security & Blockchain Settings</span>
        </button>
      </div>

      {/* TAB 1: Users */}
      {activeTab === 'users' && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span>Loading personnel directory...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0B1120] text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Personnel Name</th>
                    <th className="p-3">Official Email</th>
                    <th className="p-3">Badge ID</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Lockout Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3 font-semibold text-white whitespace-nowrap">
                        {u.fullName}
                      </td>
                      <td className="p-3 font-mono text-slate-300 whitespace-nowrap">
                        {u.email}
                      </td>
                      <td className="p-3 font-mono text-cyan-400 whitespace-nowrap">
                        {u.badgeNumber}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span className="text-[10px] font-mono text-slate-200 bg-slate-800 px-2 py-0.5 rounded">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap text-slate-300">
                        {u.department?.name || 'NCRB HQ'}
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            u.isActive
                              ? 'bg-emerald-950 text-emerald-400'
                              : 'bg-rose-950 text-rose-400'
                          }`}
                        >
                          {u.isActive ? 'Active' : 'Revoked'}
                        </span>
                      </td>
                      <td className="p-3 whitespace-nowrap">
                        {u.isLocked ? (
                          <span className="text-rose-400 font-bold text-[10px] flex items-center space-x-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>LOCKED (5 Failed Attempts)</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[10px]">Normal ({u.failedLoginAttempts}/5)</span>
                        )}
                      </td>
                      <td className="p-3 text-right whitespace-nowrap space-x-2">
                        {u.isLocked && (
                          <button
                            onClick={() => handleResetLockout(u.id)}
                            className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 hover:bg-amber-900 font-semibold text-[11px]"
                            title="Clear lockout"
                          >
                            Unlock Console
                          </button>
                        )}
                        <button
                          onClick={() => handleToggleStatus(u.id, u.isActive)}
                          className={`px-2.5 py-1 rounded font-semibold text-[11px] transition ${
                            u.isActive
                              ? 'bg-slate-800 hover:bg-rose-950 hover:text-rose-300 text-slate-300'
                              : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                          }`}
                        >
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Departments */}
      {activeTab === 'departments' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {departments.map((d) => (
            <div
              key={d.id}
              className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex justify-between items-start">
                <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/20">
                  {d.code}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {d._count?.users || 0} Officers Assigned
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{d.name}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{d.description}</p>
              </div>
              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800 flex justify-between">
                <span>Active Cases: {d._count?.cases || 0}</span>
                <span className="text-emerald-400">Jurisdiction Operational</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: System Settings */}
      {activeTab === 'settings' && settings && (
        <div className="bg-[#0F172A] border border-[#1E293B] rounded-xl p-6 shadow-sm max-w-2xl mx-auto space-y-4 text-xs">
          <h2 className="text-sm font-bold text-white">System Security Policies</h2>

          <div className="space-y-3 font-mono">
            <div className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400">Standard Hashing Algorithm:</span>
              <span className="text-emerald-400 font-semibold">{settings.hashingAlgorithm}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400">Blockchain Protocol:</span>
              <span className="text-cyan-400 font-semibold">{settings.blockchainProtocol}</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400">Max Failed Logins Before Lockout:</span>
              <span className="text-white font-semibold">{settings.maxFailedLogins} Attempts</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400">Lockout Timeout Duration:</span>
              <span className="text-white font-semibold">{settings.lockoutDurationMinutes} Minutes</span>
            </div>
            <div className="flex justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
              <span className="text-slate-400">Storage Architecture:</span>
              <span className="text-white font-semibold">{settings.storageEngine}</span>
            </div>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1">
              <span className="text-slate-400 block">Consensus Network Validator Nodes:</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {settings.activeNodes?.map((node, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/20 text-[10px]"
                  >
                    ● {node}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

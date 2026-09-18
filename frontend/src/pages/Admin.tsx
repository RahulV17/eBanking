import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  RiShieldCheckFill, 
  RiGroupLine, 
  RiUserFollowLine, 
  RiTimeLine, 
  RiCloseCircleLine, 
  RiCheckboxCircleLine, 
  RiSearch2Line, 
  RiEyeLine, 
  RiServerLine,
  RiCheckDoubleLine,
  RiBuilding4Line,
  RiArrowRightUpLine
} from 'react-icons/ri';
import { useAdmin } from '../hooks';
import type { AdminStats, AdminUser } from '../types';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'pending' | 'system'>('stats');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingAccounts, setPendingAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { getStats, getUsers, searchUsers, getPendingAccounts, approveAccount, getTransactions } = useAdmin();

  useEffect(() => {
    if (activeTab === 'stats') fetchStats();
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'pending') fetchPending();
  }, [activeTab]);

  const fetchStats = async () => {
    setLoading(true);
    const data = await getStats();
    setStats(data);
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const data = await getUsers();
    setUsers(data);
    setLoading(false);
  };

  const fetchPending = async () => {
    setLoading(true);
    const data = await getPendingAccounts();
    setPendingAccounts(data);
    setLoading(false);
  };

  const handleApprove = async (accountNumber: string) => {
    await approveAccount(accountNumber);
    toast.success('Account approved successfully!');
    fetchPending();
  };

  const handleViewTransactions = async (accountNumber: string) => {
    try {
      const txns = await getTransactions(accountNumber);
      toast.success(`${txns.length} transactions audited`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Access denied');
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) { fetchUsers(); return; }
    setLoading(true);
    const results = await searchUsers(search);
    setUsers(results);
    setLoading(false);
  };

  interface AdminTab {
    id: 'stats' | 'users' | 'pending' | 'system';
    label: string;
    icon: any;
    count?: number;
  }

  const tabs: AdminTab[] = [
    { id: 'stats', label: 'System Overview', icon: RiShieldCheckFill },
    { id: 'users', label: 'Client Accounts', icon: RiGroupLine },
    { id: 'pending', label: 'Approval Queue', icon: RiTimeLine, count: pendingAccounts.length },
    { id: 'system', label: 'Infrastructure', icon: RiServerLine },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9067A7] to-[#5F3A76] flex items-center justify-center text-white shadow-md border border-white/20">
            <RiShieldCheckFill className="text-xl" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Admin Control Center</h1>
            <p className="text-xs text-text-tertiary">Centralized client auditing, account verification, and system status</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-surface-muted/60 rounded-2xl border border-border overflow-x-auto">
        {tabs.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === id
                ? 'bg-surface-elevated text-text-primary shadow-xs border border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon className={`text-base ${activeTab === id ? 'text-[#9067A7]' : 'text-text-tertiary'}`} />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500/20 text-amber-400 font-mono">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-tertiary uppercase">Registered Users</span>
              <RiGroupLine className="text-lg text-[#9067A7]" />
            </div>
            <p className="text-2xl font-bold font-mono text-text-primary">{stats.totalUsers}</p>
          </div>

          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-tertiary uppercase">Operational</span>
              <RiCheckboxCircleLine className="text-lg text-emerald-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-500">{stats.activeUsers}</p>
          </div>

          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-tertiary uppercase">Pending Review</span>
              <RiTimeLine className="text-lg text-amber-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-amber-500">{stats.pendingAccounts}</p>
          </div>

          <div className="card p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-text-tertiary uppercase">Restricted / Blocked</span>
              <RiCloseCircleLine className="text-lg text-rose-500" />
            </div>
            <p className="text-2xl font-bold font-mono text-rose-500">{stats.blockedAccounts}</p>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="card p-3.5 flex items-center gap-3">
            <div className="relative flex-1">
              <RiSearch2Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-base" />
              <input
                type="text"
                placeholder="Search clients by name, email, or account number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-10 py-2 text-xs"
              />
            </div>
            <button onClick={handleSearch} className="btn-primary text-xs px-4 py-2 cursor-pointer">
              Search
            </button>
          </div>

          <div className="card p-0 overflow-hidden border-border/80">
            {loading ? (
              <div className="p-6 space-y-3 animate-pulse">
                {[1, 2, 3].map(i => <div key={i} className="h-12 bg-surface-muted rounded-xl" />)}
              </div>
            ) : users.length === 0 ? (
              <div className="p-12 text-center text-text-secondary text-sm">No clients located</div>
            ) : (
              <div className="divide-y divide-border/60">
                {users.map((u) => (
                  <div key={u.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-surface-muted/40 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#9067A7]/20 to-[#5F3A76]/20 border border-[#9067A7]/30 text-[#CF9CCD] flex items-center justify-center text-xs font-bold">
                        {u.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm font-semibold text-text-primary">{u.name}</p>
                        <p className="text-[11px] text-text-tertiary">{u.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        u.accountActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}>
                        {u.accountActive ? 'Active Account' : 'Pending Verification'}
                      </span>

                      {u.consentToViewTransactions && u.hasBankAccount && (
                        <button
                          onClick={() => handleViewTransactions(u.accountNumber || '')}
                          className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1 cursor-pointer"
                        >
                          <RiEyeLine className="text-xs" />
                          <span>Audit</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending Queue Tab */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {loading ? (
            <div className="card p-6 space-y-3 animate-pulse">
              {[1, 2].map(i => <div key={i} className="h-14 bg-surface-muted rounded-xl" />)}
            </div>
          ) : pendingAccounts.length === 0 ? (
            <div className="card p-12 text-center text-text-secondary">
              <RiCheckboxCircleLine className="mx-auto text-emerald-500 text-3xl mb-2" />
              <p className="text-sm font-semibold text-text-primary">Approval queue is empty</p>
              <p className="text-xs text-text-tertiary mt-0.5">All customer account applications have been cleared.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingAccounts.map((acc) => (
                <div key={acc.accountNumber} className="card p-5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-text-primary">{acc.fullName}</p>
                    <p className="text-xs text-text-tertiary font-mono">Account No: {acc.accountNumber} • Branch: {acc.branch || 'Bengaluru'}</p>
                  </div>
                  <button
                    onClick={() => handleApprove(String(acc.accountNumber))}
                    className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer"
                  >
                    <RiUserFollowLine className="text-sm" />
                    <span>Approve Account</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* System Infrastructure Tab */}
      {activeTab === 'system' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Service Health Telemetry</h3>
            <div className="space-y-3">
              {[
                { name: 'Spring Boot Application Gateway', port: ':8080' },
                { name: 'MySQL Relational Data Engine', port: ':3306' },
                { name: 'Redis Cache & Pub/Sub Layer', port: ':6379' },
                { name: 'Razorpay UPI Test Gateway', port: 'HTTPS TLS' },
                { name: 'OpenRouter Spring AI Chat Engine', port: 'NVIDIA Nemotron' },
              ].map((svc) => (
                <div key={svc.name} className="flex items-center justify-between py-1.5 border-b border-border/50 text-xs">
                  <div>
                    <span className="font-medium text-text-primary">{svc.name}</span>
                    <span className="text-[10px] text-text-tertiary ml-2 font-mono">{svc.port}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Operational
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6 space-y-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Security & Compliance Badges</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-surface-muted/40 border border-border">
                <p className="font-semibold text-text-primary">RBI Master Directions Compliance</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">Strict adherence to digital payment settlement guidelines and user data localization.</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-muted/40 border border-border">
                <p className="font-semibold text-text-primary">Explicit GDPR & Consent Auditing</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">All AI third-party processing requires verified opt-in prior to payload transmission.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

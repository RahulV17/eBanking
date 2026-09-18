import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  RiUser3Line, 
  RiMailLine, 
  RiPhoneLine, 
  RiCalendarLine, 
  RiLockPasswordLine, 
  RiNotification3Line, 
  RiShieldCheckFill, 
  RiBuilding4Line, 
  RiAddCircleLine, 
  RiEyeLine, 
  RiCheckDoubleLine,
  RiArrowRightLine,
  RiFileCopyLine,
  RiCheckboxCircleFill
} from 'react-icons/ri';
import { useBankAccount, useConsent } from '../hooks';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../lib/utils';
import type { BankAccount } from '../types';

function PrivacySettings({ userEmail }: { userEmail: string }) {
  const [consent, setConsent] = useState({
    adminViewTransactions: false,
    adminViewDocuments: false,
    marketingConsent: false,
    dataSharingConsent: false,
  });
  const [loading, setLoading] = useState(true);
  const { getConsent, updateConsent } = useConsent();

  useEffect(() => {
    const fetch = async () => {
      const data = await getConsent(userEmail);
      if (data) setConsent(data);
      setLoading(false);
    };
    fetch();
  }, [userEmail]);

  const handleToggle = async (field: keyof typeof consent) => {
    const updated = { ...consent, [field]: !consent[field] };
    setConsent(updated);
    try {
      await updateConsent(userEmail, updated);
      toast.success('Privacy policy authorization updated');
    } catch {
      toast.error('Failed to update consent preferences');
      setConsent(consent);
    }
  };

  if (loading) return <div className="card p-8 text-center text-text-tertiary">Loading privacy records...</div>;

  return (
    <div className="card p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-3 pb-3 border-b border-border">
        <div className="w-9 h-9 rounded-xl bg-[#9067A7]/15 border border-[#9067A7]/30 flex items-center justify-center text-[#CF9CCD]">
          <RiShieldCheckFill className="text-xl" />
        </div>
        <div>
          <h2 className="text-base font-bold text-text-primary">Data Governance & Privacy Controls</h2>
          <p className="text-xs text-text-tertiary">
            Under GDPR & RBI guidelines, you maintain sovereign control over access to your banking metadata.
          </p>
        </div>
      </div>

      <div className="divide-y divide-border/60">
        {[
          { key: 'dataSharingConsent', label: 'AI Banking Assistant & Third-Party AI Models', desc: 'Authorizes Spring AI & OpenRouter LLMs to analyze balances and transactions for natural-language inquiries.' },
          { key: 'adminViewTransactions', label: 'Administrative Transaction Auditing', desc: 'Allows compliance administrators to review ledger activity during compliance audits.' },
          { key: 'adminViewDocuments', label: 'KYC Document Access', desc: 'Permits bank verification officers to view uploaded PAN & Aadhaar identification files.' },
          { key: 'marketingConsent', label: 'Account Insights & Security Bulletins', desc: 'Receive high-priority advisories, fraud threat warnings, and monthly financial summaries.' },
        ].map((item) => (
          <div key={item.key} className="flex items-start justify-between py-4 gap-4">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-text-primary">{item.label}</p>
              <p className="text-xs text-text-tertiary max-w-lg leading-relaxed">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={consent[item.key as keyof typeof consent]}
                onChange={() => handleToggle(item.key as keyof typeof consent)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#9067A7] border border-border"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuthStore();
  const [activeSection, setActiveSection] = useState<'profile' | 'account' | 'security' | 'notifications' | 'privacy'>('profile');
  const [bankAccount, setBankAccount] = useState<BankAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const { getAccount } = useBankAccount();

  useEffect(() => {
    if (activeSection === 'account') fetchBankAccount();
  }, [activeSection]);

  const fetchBankAccount = async () => {
    setLoading(true);
    const data = await getAccount();
    setBankAccount(data);
    setLoading(false);
  };

  const sections = [
    { id: 'profile', label: 'Personal Details', icon: RiUser3Line },
    { id: 'account', label: 'Bank Account', icon: RiBuilding4Line },
    { id: 'security', label: 'Security & Auth', icon: RiLockPasswordLine },
    { id: 'notifications', label: 'Alerts', icon: RiNotification3Line },
    { id: 'privacy', label: 'Privacy & AI Consent', icon: RiEyeLine },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Profile & Preferences
        </h1>
        <p className="text-xs sm:text-sm text-text-tertiary mt-0.5">
          Manage your identity credentials, linked accounts, and privacy permissions
        </p>
      </div>

      {/* Modern Navigation Tabs */}
      <div className="flex gap-1.5 p-1 bg-surface-muted/60 rounded-2xl border border-border overflow-x-auto">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
              activeSection === id
                ? 'bg-surface-elevated text-text-primary shadow-xs border border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Icon className={`text-base ${activeSection === id ? 'text-[#9067A7]' : 'text-text-tertiary'}`} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Section: Profile Details */}
      {activeSection === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8 space-y-6">
          {/* User Hero Banner */}
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#9067A7] to-[#5F3A76] flex items-center justify-center text-white text-2xl font-bold shadow-md border border-white/20">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-text-primary">{user?.name}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#9067A7]/15 text-[#CF9CCD] border border-[#9067A7]/30">
                  <RiCheckboxCircleFill className="text-[#CF9CCD]" />
                  {user?.role === 'ADMIN' ? 'System Administrator' : 'Retail Banking Member'}
                </span>
              </div>
              <p className="text-xs text-text-tertiary mt-0.5">{user?.email}</p>
            </div>
          </div>

          {/* Details Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Full Legal Name
              </label>
              <div className="relative">
                <RiUser3Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-base" />
                <input type="text" defaultValue={user?.name} className="input-field pl-10 text-sm" readOnly />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Registered Email Address
              </label>
              <div className="relative">
                <RiMailLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-base" />
                <input type="email" defaultValue={user?.email} className="input-field pl-10 text-sm" readOnly />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Primary Mobile Number
              </label>
              <div className="relative">
                <RiPhoneLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-base" />
                <input type="tel" defaultValue={user?.mobile} className="input-field pl-10 text-sm" readOnly />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                Date of Birth
              </label>
              <div className="relative">
                <RiCalendarLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-base" />
                <input type="text" defaultValue={user?.dob || 'Not provided'} className="input-field pl-10 text-sm" readOnly />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Section: Account Overview */}
      {activeSection === 'account' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {loading ? (
            <div className="card p-8 text-center text-text-tertiary">Loading account details...</div>
          ) : bankAccount ? (
            <div className="card p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#9067A7]/15 border border-[#9067A7]/30 flex items-center justify-center text-[#CF9CCD]">
                    <RiBuilding4Line className="text-xl" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text-primary">Primary Savings Account</h3>
                    <p className="text-xs text-text-tertiary">Official banking identity</p>
                  </div>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  bankAccount.active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  {bankAccount.active ? 'Operational' : 'Pending Approval'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border">
                  <span className="text-[10px] uppercase font-semibold text-text-tertiary block">Account Number</span>
                  <p className="font-mono font-bold text-sm text-text-primary mt-0.5">{bankAccount.accountNumber}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border">
                  <span className="text-[10px] uppercase font-semibold text-text-tertiary block">Available Balance</span>
                  <p className="font-mono font-bold text-sm text-emerald-500 mt-0.5">{formatCurrency(bankAccount.balance)}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border">
                  <span className="text-[10px] uppercase font-semibold text-text-tertiary block">IFSC Code</span>
                  <p className="font-mono font-medium text-sm text-text-primary mt-0.5">{bankAccount.ifscCode}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border">
                  <span className="text-[10px] uppercase font-semibold text-text-tertiary block">Registered Branch</span>
                  <p className="font-medium text-sm text-text-primary mt-0.5">{bankAccount.branch}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center p-8">
              <RiBuilding4Line className="mx-auto text-text-tertiary text-4xl mb-2 opacity-60" />
              <p className="text-sm font-semibold text-text-primary">No savings account registered</p>
              <p className="text-xs text-text-tertiary mt-1 mb-4">You can set up an account on the Accounts tab.</p>
              <a href="/accounts" className="btn-primary text-xs px-4 py-2 inline-block">Go to Accounts</a>
            </div>
          )}
        </motion.div>
      )}

      {/* Section: Security */}
      {activeSection === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-[#9067A7]/15 border border-[#9067A7]/30 flex items-center justify-center text-[#CF9CCD]">
              <RiLockPasswordLine className="text-xl" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Authentication Credentials</h2>
              <p className="text-xs text-text-tertiary">Password and session security controls</p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-surface-muted/40 border border-border">
            <div>
              <p className="text-xs font-semibold text-text-primary">Account Password</p>
              <p className="text-[11px] text-text-tertiary mt-0.5">
                We recommend changing your password every 90 days.
              </p>
            </div>
            <a href="/forgot-password" className="btn-secondary text-xs px-4 py-2">
              Update Password
            </a>
          </div>
        </motion.div>
      )}

      {/* Section: Alerts */}
      {activeSection === 'notifications' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-9 h-9 rounded-xl bg-[#9067A7]/15 border border-[#9067A7]/30 flex items-center justify-center text-[#CF9CCD]">
              <RiNotification3Line className="text-xl" />
            </div>
            <div>
              <h2 className="text-base font-bold text-text-primary">Notification Channels</h2>
              <p className="text-xs text-text-tertiary">Instant transactional and security alert routing</p>
            </div>
          </div>

          <div className="divide-y divide-border/60">
            {['Real-Time Transaction Push Alerts', 'Security Login Advisories', 'Fraud Detection Notifications'].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-3.5">
                <span className="text-xs font-medium text-text-primary">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-10 h-5.5 bg-surface-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-[#9067A7] border border-border"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Section: Privacy */}
      {activeSection === 'privacy' && <PrivacySettings userEmail={user?.email || ''} />}
    </div>
  );
}

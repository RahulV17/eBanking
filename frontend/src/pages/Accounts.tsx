import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  RiBankCardLine, 
  RiAddCircleLine, 
  RiFileCopyLine, 
  RiCheckLine, 
  RiShieldCheckFill, 
  RiBuilding4Line, 
  RiInformationLine,
  RiTimeLine,
  RiCloseCircleLine,
  RiLockPasswordLine,
  RiSmartphoneLine,
  RiGlobalLine
} from 'react-icons/ri';
import { useBankAccount } from '../hooks';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../lib/utils';
import VirtualCard from '../components/VirtualCard';
import type { BankAccount } from '../types';

export default function Accounts() {
  const { user } = useAuthStore();
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [accountForm, setAccountForm] = useState({ fullName: '', address: '', pan: '', aadhar: '' });
  const { getAccount, createAccount } = useBankAccount();

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const data = await getAccount();
      if (data) {
        setAccounts([data]);
      }
    } catch (err) {
      console.error('Failed to fetch accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    toast.success(`${fieldName} copied to clipboard`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCreateAccount = async () => {
    if (!accountForm.fullName || !accountForm.address || !accountForm.pan || !accountForm.aadhar) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      await createAccount(accountForm);
      toast.success('Savings account created! Awaiting administrative approval.');
      setShowCreateForm(false);
      fetchAccounts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (loading && accounts.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 bg-surface-muted rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="h-64 lg:col-span-5 bg-surface-muted rounded-2xl" />
          <div className="h-64 lg:col-span-7 bg-surface-muted rounded-2xl" />
        </div>
      </div>
    );
  }

  const primaryAccount = accounts[0];

  return (
    <div className="space-y-8">
      {/* Top Title & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Bank Accounts & Cards
          </h1>
          <p className="text-xs sm:text-sm text-text-tertiary mt-1">
            Manage your savings accounts, cards, and daily transaction limits
          </p>
        </div>

        {accounts.length === 0 && !showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-2 cursor-pointer self-start"
          >
            <RiAddCircleLine className="text-base" />
            <span>Open Savings Account</span>
          </button>
        )}
      </div>

      {/* Role & Regulatory Context Badge */}
      <div className="p-3.5 rounded-xl border border-border/80 bg-surface-elevated/60 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#9067A7]/15 border border-[#9067A7]/30 flex items-center justify-center text-[#CF9CCD] shrink-0">
            <RiShieldCheckFill className="text-base" />
          </div>
          <p className="text-xs text-text-secondary">
            <strong className="text-text-primary">Tier 1 Banking Profile:</strong> {user?.role === 'ADMIN' ? 'System Administrator' : 'Verified Retail Client'} • DICGC Insured up to ₹5,00,000
          </p>
        </div>
        <span className="text-[11px] font-mono text-text-tertiary">RBI Regulated</span>
      </div>

      {/* Create Account Modal / Form Section */}
      {showCreateForm && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="card p-6 sm:p-8 border-[#9067A7]/30 shadow-lg relative"
        >
          <div className="flex items-start justify-between pb-4 mb-6 border-b border-border">
            <div>
              <h2 className="text-lg font-bold text-text-primary">Open a High-Interest Savings Account</h2>
              <p className="text-xs text-text-tertiary mt-1">
                Enter your KYC documentation details. Accounts are verified within minutes.
              </p>
            </div>
            <button 
              onClick={() => setShowCreateForm(false)}
              className="text-text-tertiary hover:text-text-primary text-sm p-1 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                Full Legal Name *
              </label>
              <input
                value={accountForm.fullName}
                onChange={(e) => setAccountForm({ ...accountForm, fullName: e.target.value })}
                className="input-field text-sm"
                placeholder="As per Government ID (Aadhaar/PAN)"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                PAN Number *
              </label>
              <input
                value={accountForm.pan}
                onChange={(e) => setAccountForm({ ...accountForm, pan: e.target.value.toUpperCase() })}
                maxLength={10}
                className="input-field text-sm uppercase font-mono"
                placeholder="ABCDE1234F"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                Permanent Residential Address *
              </label>
              <textarea
                value={accountForm.address}
                onChange={(e) => setAccountForm({ ...accountForm, address: e.target.value })}
                className="input-field text-sm"
                placeholder="Flat/House No., Street, City, State, PIN Code"
                rows={2}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
                Aadhaar Number (12 Digits) *
              </label>
              <input
                value={accountForm.aadhar}
                onChange={(e) => setAccountForm({ ...accountForm, aadhar: e.target.value.replace(/\D/g, '') })}
                maxLength={12}
                className="input-field text-sm font-mono"
                placeholder="1234 5678 9012"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 pt-4 border-t border-border">
            <button
              type="button"
              disabled={loading}
              onClick={handleCreateAccount}
              className="btn-primary text-xs px-6 py-2.5 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Processing Verification...' : 'Submit Application'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreateForm(false)}
              className="btn-secondary text-xs px-5 py-2.5 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}

      {/* Account Details & Card Hub */}
      {accounts.length === 0 && !showCreateForm ? (
        <div className="card text-center p-12 max-w-lg mx-auto">
          <RiBuilding4Line className="mx-auto text-text-tertiary text-4xl mb-3" />
          <h2 className="text-xl font-bold text-text-primary">No Active Account Registered</h2>
          <p className="text-xs text-text-secondary mt-1.5 mb-6 max-w-sm mx-auto">
            Open a high-yield savings account in under 2 minutes to start transacting and managing funds.
          </p>
          <button 
            onClick={() => setShowCreateForm(true)}
            className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-2 cursor-pointer"
          >
            <RiAddCircleLine className="text-base" />
            <span>Open Savings Account Now</span>
          </button>
        </div>
      ) : primaryAccount && (
        <div className="space-y-6">
          {/* Main Showcase: Physical Card + Banking Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Card Render */}
            <div className="lg:col-span-5 flex justify-center lg:justify-start">
              <VirtualCard
                cardHolderName={primaryAccount.fullName || user?.name}
                accountNumber={primaryAccount.accountNumber}
                balance={primaryAccount.balance}
                isActive={primaryAccount.active}
                isBlocked={primaryAccount.blocked}
              />
            </div>

            {/* Right Account Official Details */}
            <div className="lg:col-span-7 card p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-text-primary">Primary Savings Account</h2>
                  <span className="text-xs text-text-tertiary">eBanking High-Yield Retail</span>
                </div>
                
                {/* Status Pill */}
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                  primaryAccount.blocked
                    ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                    : primaryAccount.active
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    primaryAccount.blocked ? 'bg-rose-400' : primaryAccount.active ? 'bg-emerald-400' : 'bg-amber-400'
                  }`} />
                  {primaryAccount.blocked ? 'Frozen / Blocked' : primaryAccount.active ? 'Active & Operational' : 'Pending Verification'}
                </span>
              </div>

              {/* Data Grid with Copy Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Account Number */}
                <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary block">
                      Account Number
                    </span>
                    <p className="font-mono font-bold text-sm text-text-primary mt-0.5">
                      {primaryAccount.accountNumber}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(String(primaryAccount.accountNumber), 'Account Number')}
                    className="p-1.5 rounded-lg hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    title="Copy Account Number"
                  >
                    {copiedField === 'Account Number' ? <RiCheckLine className="text-emerald-500 text-base" /> : <RiFileCopyLine className="text-base" />}
                  </button>
                </div>

                {/* IFSC Code */}
                <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border/70 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary block">
                      IFSC Code
                    </span>
                    <p className="font-mono font-bold text-sm text-text-primary mt-0.5">
                      {primaryAccount.ifscCode}
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy(primaryAccount.ifscCode, 'IFSC Code')}
                    className="p-1.5 rounded-lg hover:bg-surface-elevated text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                    title="Copy IFSC Code"
                  >
                    {copiedField === 'IFSC Code' ? <RiCheckLine className="text-emerald-500 text-base" /> : <RiFileCopyLine className="text-base" />}
                  </button>
                </div>

                {/* Branch */}
                <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border/70">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary block">
                    Branch Name
                  </span>
                  <p className="font-medium text-sm text-text-primary mt-0.5">
                    {primaryAccount.branch}
                  </p>
                </div>

                {/* Account Holder */}
                <div className="p-3.5 rounded-xl bg-surface-muted/50 border border-border/70">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-text-tertiary block">
                    Account Holder
                  </span>
                  <p className="font-medium text-sm text-text-primary mt-0.5">
                    {primaryAccount.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Transfer Limits & Channel Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Limit Card 1 */}
            <div className="card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">UPI Daily Limit</span>
                <RiSmartphoneLine className="text-base text-[#9067A7]" />
              </div>
              <p className="text-xl font-bold font-mono text-text-primary">₹1,00,000</p>
              <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#9067A7] to-emerald-500 h-full w-[24%]" />
              </div>
              <p className="text-[11px] text-text-tertiary">24% utilized today</p>
            </div>

            {/* Limit Card 2 */}
            <div className="card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">NEFT / RTGS Limit</span>
                <RiBuilding4Line className="text-base text-[#9067A7]" />
              </div>
              <p className="text-xl font-bold font-mono text-text-primary">₹10,00,000</p>
              <div className="w-full bg-surface-muted h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#9067A7] to-emerald-500 h-full w-[8%]" />
              </div>
              <p className="text-[11px] text-text-tertiary">Instant 24x7 settlements</p>
            </div>

            {/* Security Card 3 */}
            <div className="card p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-text-secondary">Security Protocol</span>
                <RiLockPasswordLine className="text-base text-emerald-500" />
              </div>
              <p className="text-xl font-bold text-text-primary">2FA Protected</p>
              <p className="text-[11px] text-text-tertiary leading-relaxed">
                Hardware token & biometric validation active for all high-value outbound payments.
              </p>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

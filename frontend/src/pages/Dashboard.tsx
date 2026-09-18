import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  RiSendPlane2Line, 
  RiAddCircleLine, 
  RiFileTextLine, 
  RiRobot2Line,
  RiArrowRightUpLine, 
  RiArrowLeftDownLine, 
  RiShieldCheckLine,
  RiBuilding4Line,
  RiExchangeDollarLine,
  RiInformationLine,
  RiSparklingFill
} from 'react-icons/ri';
import { useBankAccount } from '../hooks';
import { useAuthStore } from '../stores/authStore';
import { formatCurrency } from '../lib/utils';
import VirtualCard from '../components/VirtualCard';
import type { Transaction } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number | null>(null);
  const [accountNumber, setAccountNumber] = useState<string | number | null>(null);
  const [accountData, setAccountData] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'ALL' | 'INFLOW' | 'OUTFLOW'>('ALL');
  const { getAccount } = useBankAccount();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const account = await getAccount();
        if (account) {
          setAccountData(account);
          setBalance(account.balance);
          setAccountNumber(account.accountNumber);
          setTransactions(account.bankTransactions || []);
        } else {
          setBalance(null);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load account data');
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <div className="h-7 w-48 bg-surface-muted rounded-xl" />
            <div className="h-4 w-32 bg-surface-muted rounded-lg" />
          </div>
          <div className="h-10 w-40 bg-surface-muted rounded-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-64 lg:col-span-1 bg-surface-muted rounded-2xl" />
          <div className="h-64 lg:col-span-2 bg-surface-muted rounded-2xl" />
        </div>
        <div className="h-80 bg-surface-muted rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-8 text-center max-w-xl mx-auto">
          <RiInformationLine className="mx-auto text-rose-500 mb-3 text-3xl" />
          <h2 className="text-lg font-semibold text-text-primary mb-1">Account Sync Issue</h2>
          <p className="text-sm text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary text-xs px-5 py-2.5 mx-auto"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (balance === null) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center p-8 sm:p-12 relative overflow-hidden"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#9067A7]/15 border border-[#9067A7]/30 flex items-center justify-center mx-auto mb-5 text-[#CF9CCD] shadow-md">
            <RiBuilding4Line className="text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary tracking-tight mb-2">
            No Active Bank Account
          </h2>
          <p className="text-sm text-text-secondary max-w-md mx-auto mb-6 leading-relaxed">
            Welcome to eBanking. To enable real-time transfers, Razorpay deposits, and our AI financial assistant, please establish your savings account.
          </p>
          <button 
            onClick={() => navigate('/accounts')}
            className="btn-primary inline-flex items-center gap-2 mx-auto cursor-pointer"
          >
            <RiAddCircleLine className="text-lg" />
            <span>Open Savings Account</span>
          </button>
        </motion.div>
      </div>
    );
  }

  // Financial calculations
  const totalInflow = transactions
    .filter(t => t.type === 'CREDIT' || t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const netCashflow = totalInflow - totalOutflow;

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'INFLOW') return t.type === 'CREDIT' || t.type === 'DEPOSIT';
    if (filterType === 'OUTFLOW') return t.type === 'DEBIT';
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Top Header & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
              {getGreeting()}, {user?.name?.split(' ')[0]}
            </h1>
            <span className="hidden sm:inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          <p className="text-xs sm:text-sm text-text-tertiary mt-1">
            {currentDateFormatted} • Portfolio Overview
          </p>
        </div>

        {/* Quick Action Pill Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigate('/transfers')}
            className="btn-primary text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <RiSendPlane2Line className="text-sm" />
            <span>Send Money</span>
          </button>
          <button
            onClick={() => navigate('/deposits')}
            className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-1.5 cursor-pointer"
          >
            <RiAddCircleLine className="text-sm text-[#9067A7]" />
            <span>Add Funds</span>
          </button>
          <button
            onClick={() => navigate('/ai-chat')}
            className="btn-secondary text-xs px-3.5 py-2.5 flex items-center gap-1.5 cursor-pointer hover:border-[#9067A7]/50"
            title="Ask AI Banking Assistant"
          >
            <RiSparklingFill className="text-xs text-[#CF9CCD]" />
            <span>AI Copilot</span>
          </button>
        </div>
      </div>

      {/* Main Bento Grid: Card + Cash Flow Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Virtual Luxury Card Widget */}
        <div className="lg:col-span-5 flex justify-center lg:justify-start">
          <VirtualCard
            cardHolderName={accountData?.fullName || user?.name || 'Valued Member'}
            accountNumber={accountNumber}
            balance={balance}
            isActive={accountData?.active ?? true}
            isBlocked={accountData?.blocked ?? false}
          />
        </div>

        {/* Cash Flow Analytics & Banking Metadata */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Total Inflow Card */}
          <div className="card p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block">
                  Total Inflow
                </span>
                <p className="text-2xl font-bold font-mono text-emerald-500 mt-2 tracking-tight">
                  +{formatCurrency(totalInflow)}
                </p>
                <p className="text-[11px] text-text-tertiary mt-1">Credits & Gateway Deposits</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <RiArrowLeftDownLine className="text-xl" />
              </div>
            </div>
          </div>

          {/* Total Outflow Card */}
          <div className="card p-5 relative overflow-hidden group hover:border-rose-500/30 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block">
                  Total Outflow
                </span>
                <p className="text-2xl font-bold font-mono text-rose-500 mt-2 tracking-tight">
                  -{formatCurrency(totalOutflow)}
                </p>
                <p className="text-[11px] text-text-tertiary mt-1">Transfers & Debits</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <RiArrowRightUpLine className="text-xl" />
              </div>
            </div>
          </div>

          {/* Net Cash Flow Banner (Spans 2 columns) */}
          <div className="sm:col-span-2 card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-surface-elevated/80 border-border/80">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">Net Position</span>
              <p className="text-lg font-bold text-text-primary flex items-center gap-2">
                <span>{formatCurrency(netCashflow)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  netCashflow >= 0 
                    ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                }`}>
                  {netCashflow >= 0 ? 'Surplus' : 'Deficit'}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <div>
                <span className="text-text-tertiary block text-[10px] uppercase font-semibold">IFSC Code</span>
                <span className="font-mono font-medium text-text-primary">{accountData?.ifscCode || 'EBANK00012'}</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div>
                <span className="text-text-tertiary block text-[10px] uppercase font-semibold">Branch</span>
                <span className="font-medium text-text-primary">{accountData?.branch || 'Bengaluru HQ'}</span>
              </div>
              <div className="w-px h-6 bg-border" />
              <div>
                <span className="text-text-tertiary block text-[10px] uppercase font-semibold">Security</span>
                <span className="inline-flex items-center gap-1 text-emerald-500 font-medium">
                  <RiShieldCheckLine className="text-sm" /> 256-Bit
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Recent Ledger Activity */}
      <div className="card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/70">
          <div>
            <h2 className="text-lg font-bold text-text-primary tracking-tight">Recent Activity</h2>
            <p className="text-xs text-text-tertiary">Real-time ledger entries and settlements</p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1 bg-surface-muted/60 p-1 rounded-xl border border-border/60">
            {(['ALL', 'INFLOW', 'OUTFLOW'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilterType(mode)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterType === mode
                    ? 'bg-surface-elevated text-text-primary shadow-xs border border-border/60'
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {mode === 'ALL' ? 'All Activity' : mode === 'INFLOW' ? 'Money In' : 'Money Out'}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <RiExchangeDollarLine className="mx-auto text-text-tertiary text-3xl opacity-60" />
            <p className="text-sm font-medium text-text-secondary">No matching transactions</p>
            <p className="text-xs text-text-tertiary">Transfers or deposits will appear in real time.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/60">
            {filteredTransactions.slice(0, 6).map((txn, index) => {
              const isCredit = txn.type === 'CREDIT' || txn.type === 'DEPOSIT';
              const dateStr = new Date(txn.createdTime).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div 
                  key={txn.id || index}
                  className="flex items-center justify-between py-3.5 px-2 hover:bg-surface-muted/40 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 border ${
                      isCredit 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {isCredit ? <RiArrowLeftDownLine /> : <RiArrowRightUpLine />}
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-text-primary leading-snug">
                        {txn.type === 'DEPOSIT' ? 'Deposit via Razorpay' : txn.type === 'CREDIT' ? 'Inward Transfer' : 'Direct Account Transfer'}
                      </p>
                      <p className="text-[11px] text-text-tertiary font-mono">{dateStr}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm font-mono font-bold tracking-tight ${
                      isCredit ? 'text-emerald-500' : 'text-text-primary'
                    }`}>
                      {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                    <span className="text-[10px] text-text-tertiary font-medium">Settled</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All Footer */}
        <div className="pt-2 text-center">
          <button
            onClick={() => navigate('/transactions')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9067A7] hover:text-[#7A4F94] transition-colors cursor-pointer"
          >
            <span>View Complete Ledger & Statements</span>
            <RiArrowRightUpLine className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );
}

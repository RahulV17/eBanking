import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  RiHistoryLine, 
  RiArrowRightUpLine, 
  RiArrowLeftDownLine, 
  RiDownload2Line, 
  RiSearch2Line, 
  RiFilter3Line, 
  RiCheckDoubleLine,
  RiExchangeDollarLine
} from 'react-icons/ri';
import { useBankAccount } from '../hooks';
import { formatCurrency } from '../lib/utils';
import type { Transaction } from '../types';

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [account, setAccount] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'CREDIT' | 'DEBIT' | 'DEPOSIT'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const { getAccount } = useBankAccount();

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const acc = await getAccount();
      setAccount(acc);
      if (acc?.bankTransactions) {
        setTransactions([...acc.bankTransactions].reverse());
      }
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search
  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filter === 'all' || t.type === filter;
    const matchesSearch = searchQuery === '' || 
      (t.payment_id && t.payment_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.type && t.type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.amount && String(t.amount).includes(searchQuery));
    return matchesType && matchesSearch;
  });

  // Calculate totals
  const totalInflow = transactions
    .filter(t => t.type === 'CREDIT' || t.type === 'DEPOSIT')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.type === 'DEBIT')
    .reduce((sum, t) => sum + t.amount, 0);

  // CSV Export
  const handleDownloadCSV = () => {
    if (transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['Transaction ID', 'Date', 'Type', 'Amount (INR)', 'Balance After (INR)'];
    const rows = transactions.map(t => [
      t.payment_id || 'N/A',
      new Date(t.createdTime).toISOString(),
      t.type,
      t.amount,
      t.balanceAfterTransaction ?? '',
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `eBanking_Statement_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Account statement (.CSV) downloaded');
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Transaction Ledger
          </h1>
          <p className="text-xs sm:text-sm text-text-tertiary mt-0.5">
            Audit-ready statement and settlement history
          </p>
        </div>

        <button
          onClick={handleDownloadCSV}
          className="btn-secondary text-xs px-4 py-2.5 flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <RiDownload2Line className="text-base text-[#9067A7]" />
          <span>Export Statement (.CSV)</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4">
          <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block">
            Total Inflow
          </span>
          <p className="text-xl font-bold font-mono text-emerald-500 mt-1">
            +{formatCurrency(totalInflow)}
          </p>
        </div>

        <div className="card p-4">
          <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block">
            Total Outflow
          </span>
          <p className="text-xl font-bold font-mono text-rose-500 mt-1">
            -{formatCurrency(totalOutflow)}
          </p>
        </div>

        <div className="card p-4">
          <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider block">
            Recorded Transactions
          </span>
          <p className="text-xl font-bold font-mono text-text-primary mt-1">
            {transactions.length} Entries
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <RiSearch2Line className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-tertiary text-base" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID or amount..."
            className="input-field pl-10 py-2 text-xs"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'CREDIT', 'DEBIT', 'DEPOSIT'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilter(mode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                filter === mode
                  ? 'bg-[#9067A7]/20 border border-[#9067A7]/50 text-[#CF9CCD] shadow-xs'
                  : 'bg-surface-muted text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {mode === 'all' ? 'All Activity' : mode === 'CREDIT' ? 'Credits' : mode === 'DEBIT' ? 'Debits' : 'Deposits'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="card p-6 space-y-3 animate-pulse">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-surface-muted rounded-xl" />
          ))}
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="card text-center py-16">
          <RiExchangeDollarLine className="mx-auto text-text-tertiary text-4xl mb-3 opacity-60" />
          <h3 className="text-base font-semibold text-text-primary">No Transactions Located</h3>
          <p className="text-xs text-text-tertiary mt-1">
            {searchQuery ? 'Try adjusting your search criteria.' : 'Your transactions will appear here as soon as you begin transacting.'}
          </p>
        </div>
      ) : (
        <div className="card p-0 overflow-hidden border-border/80">
          <div className="divide-y divide-border/60">
            {filteredTransactions.map((txn, index) => {
              const isCredit = txn.type === 'CREDIT' || txn.type === 'DEPOSIT';
              const dateObj = new Date(txn.createdTime);
              const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const formattedTime = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={txn.id || index}
                  className="p-4 sm:px-6 flex items-center justify-between hover:bg-surface-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                      isCredit
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {isCredit ? <RiArrowLeftDownLine /> : <RiArrowRightUpLine />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs sm:text-sm font-semibold text-text-primary">
                          {txn.type === 'DEPOSIT' ? 'Razorpay Deposit' : txn.type === 'CREDIT' ? 'Account Credit' : 'Funds Transfer'}
                        </p>
                        <span className="text-[10px] px-2 py-0.2 rounded-full font-mono bg-surface-muted text-text-secondary border border-border/70">
                          {txn.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-text-tertiary font-mono mt-0.5">
                        {formattedDate} • {formattedTime} {txn.payment_id ? `• Ref: ${txn.payment_id}` : ''}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm sm:text-base font-mono font-bold tracking-tight ${
                      isCredit ? 'text-emerald-500' : 'text-text-primary'
                    }`}>
                      {isCredit ? '+' : '-'}{formatCurrency(txn.amount)}
                    </p>
                    {txn.balanceAfterTransaction !== undefined && txn.balanceAfterTransaction !== null && (
                      <p className="text-[10px] text-text-tertiary font-mono">
                        Bal: {formatCurrency(txn.balanceAfterTransaction)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

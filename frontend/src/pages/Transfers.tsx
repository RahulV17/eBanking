import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  RiSendPlane2Line, 
  RiSmartphoneLine, 
  RiBankCardLine, 
  RiShieldCheckLine, 
  RiInformationLine,
  RiCheckDoubleLine,
  RiArrowRightLine,
  RiCloseLine,
  RiLockLine
} from 'react-icons/ri';
import { useTransfer, useBankAccount } from '../hooks';
import { formatCurrency } from '../lib/utils';
import type { BankAccount } from '../types';

export default function Transfers() {
  const [transferType, setTransferType] = useState<'mobile' | 'account'>('mobile');
  const [myAccount, setMyAccount] = useState<BankAccount | null>(null);
  const [isCheckingAccount, setIsCheckingAccount] = useState(true);
  const [form, setForm] = useState({
    toAccountNumber: '',
    recipientName: '',
    amount: '',
    description: '',
    bankName: '',
    ifscCode: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | 'mobile' | 'account'>(null);
  const { transfer, createTransferOrder, confirmTransfer } = useTransfer();
  const { getAccount } = useBankAccount();

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const acc = await getAccount();
        setMyAccount(acc);
      } catch (err) {
        console.error('Error fetching account:', err);
      } finally {
        setIsCheckingAccount(false);
      }
    };
    fetchAccount();
  }, []);

  const parsedAmount = parseFloat(form.amount) || 0;
  const currentBalance = myAccount?.balance ?? 0;
  const remainingBalance = currentBalance - parsedAmount;
  const isOverBalance = parsedAmount > currentBalance;

  const quickAmounts = [500, 1000, 2500, 5000];

  const handleQuickAdd = (addVal: number) => {
    setForm(prev => ({
      ...prev,
      amount: String((parseFloat(prev.amount) || 0) + addVal),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myAccount || !myAccount.active) {
      toast.error('You need an active savings account to transfer funds.');
      return;
    }
    if (!form.toAccountNumber || !form.amount || parsedAmount <= 0) {
      toast.error('Please enter a valid destination and transfer amount.');
      return;
    }
    if (isOverBalance) {
      toast.error('Transfer amount exceeds available account balance.');
      return;
    }
    setPendingAction(transferType);
    setConfirmOpen(true);
  };

  const executeConfirmed = async () => {
    setConfirmOpen(false);
    setIsLoading(true);
    try {
      if (pendingAction === 'mobile') {
        await handleMobileTransfer();
      } else {
        await handleAccountTransfer();
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Transfer failed';
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
      setPendingAction(null);
    }
  };

  const handleMobileTransfer = async () => {
    const order = await createTransferOrder({
      amount: parseFloat(form.amount),
      toAccountNumber: form.toAccountNumber,
      description: form.description || 'Instant Transfer',
    });

    const options = {
      key: order.key,
      amount: order.amount,
      currency: order.currency,
      name: 'eBanking',
      description: `Transfer ₹${form.amount} to ${form.toAccountNumber}`,
      order_id: order.orderId,
      method: { upi: true },
      upi: { vpa: 'test@razorpay' },
      handler: async (response: any) => {
        try {
          const paymentId = response?.razorpay_payment_id || response?.paymentId;
          const orderId = response?.razorpay_order_id || order.orderId;
          const signature = response?.razorpay_signature;

          if (!paymentId || !signature) {
            toast.error('Payment authorization cancelled.');
            return;
          }

          await confirmTransfer({
            amount: parseFloat(form.amount),
            toAccountNumber: form.toAccountNumber,
            description: form.description,
            razorpay_order_id: orderId,
            razorpay_payment_id: paymentId,
            razorpay_signature: signature,
          });

          toast.success('Transfer executed successfully!');
          setForm({ toAccountNumber: '', recipientName: '', amount: '', description: '', bankName: '', ifscCode: '' });
          const updated = await getAccount();
          setMyAccount(updated);
        } catch (err: any) {
          toast.error(err.response?.data?.message || 'Transfer confirmation failed');
        }
      },
      prefill: {
        name: form.recipientName || '',
        email: '',
      },
      theme: {
        color: '#9067A7',
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      alert('Payment Gateway Error: ' + e.message);
    }
  };

  const handleAccountTransfer = async () => {
    await transfer({
      toAccountNumber: form.toAccountNumber,
      amount: parseFloat(form.amount),
      description: form.description,
    });
    toast.success('Direct transfer completed!');
    setForm({ toAccountNumber: '', recipientName: '', amount: '', description: '', bankName: '', ifscCode: '' });
    const updated = await getAccount();
    setMyAccount(updated);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            Transfer Funds
          </h1>
          <p className="text-xs sm:text-sm text-text-tertiary mt-0.5">
            Instant 24x7 settlements via UPI and direct bank network
          </p>
        </div>

        {myAccount && (
          <div className="px-3.5 py-1.5 rounded-full bg-surface-elevated border border-border flex items-center gap-2 self-start sm:self-auto">
            <span className="text-[10px] uppercase font-semibold text-text-tertiary">Available</span>
            <span className="font-mono font-bold text-sm text-emerald-500">
              {formatCurrency(currentBalance)}
            </span>
          </div>
        )}
      </div>

      {/* Main Transfer Form Card */}
      <div className="card p-6 sm:p-8 space-y-6">
        {/* Segmented Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-surface-muted/70 rounded-2xl border border-border">
          <button
            type="button"
            onClick={() => setTransferType('mobile')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              transferType === 'mobile'
                ? 'bg-surface-elevated text-text-primary shadow-xs border border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <RiSmartphoneLine className="text-base text-[#9067A7]" />
            <span>UPI / Instant Mobile</span>
          </button>

          <button
            type="button"
            onClick={() => setTransferType('account')}
            className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              transferType === 'account'
                ? 'bg-surface-elevated text-text-primary shadow-xs border border-border'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <RiBankCardLine className="text-base text-[#9067A7]" />
            <span>Direct Account (NEFT)</span>
          </button>
        </div>

        {/* Transfer Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Recipient Destination Input */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
              {transferType === 'mobile' ? 'Recipient Mobile or UPI ID *' : 'Destination Account Number *'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                {transferType === 'mobile' ? <RiSmartphoneLine /> : <RiBankCardLine />}
              </div>
              <input
                value={form.toAccountNumber}
                onChange={(e) => setForm({ ...form, toAccountNumber: e.target.value })}
                placeholder={transferType === 'mobile' ? 'e.g. 9876543210 or user@okhdfcbank' : 'e.g. 100120249876'}
                className="input-field pl-10 font-mono text-sm"
                required
              />
            </div>
          </div>

          {/* Amount Input with Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Transfer Amount (INR) *
              </label>
              <span className="text-[11px] text-text-tertiary">Zero Transfer Fee</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-secondary font-bold">
                ₹
              </div>
              <input
                type="number"
                step="any"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                placeholder="0.00"
                className="input-field pl-9 font-mono text-base font-bold text-text-primary"
                required
              />
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-[10px] text-text-tertiary uppercase font-medium mr-1">Quick Add:</span>
              {quickAmounts.map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => handleQuickAdd(amt)}
                  className="px-2.5 py-1 rounded-lg bg-surface-muted hover:bg-surface-muted/80 text-text-secondary hover:text-text-primary text-xs font-mono font-medium border border-border transition-colors cursor-pointer"
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>

          {/* Description & Note */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-1.5 uppercase tracking-wider">
              Payment Remarks (Optional)
            </label>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g. Rent, Dinner split, Invoice #102"
              className="input-field text-sm"
            />
          </div>

          {/* Real-time Settlement Strip */}
          {parsedAmount > 0 && (
            <div className="p-3.5 rounded-xl border border-border bg-surface-muted/40 space-y-1.5 text-xs">
              <div className="flex justify-between text-text-secondary">
                <span>Transfer Amount:</span>
                <span className="font-mono font-bold text-text-primary">{formatCurrency(parsedAmount)}</span>
              </div>
              <div className="flex justify-between text-text-secondary">
                <span>Remaining Balance:</span>
                <span className={`font-mono font-bold ${isOverBalance ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {formatCurrency(remainingBalance)}
                </span>
              </div>
              {isOverBalance && (
                <p className="text-rose-500 text-[11px] font-medium pt-1">
                  * Warning: Amount exceeds available account balance.
                </p>
              )}
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading || isOverBalance}
            className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
          >
            <RiSendPlane2Line className="text-base" />
            <span>{isLoading ? 'Processing...' : `Review & Transfer ${parsedAmount > 0 ? formatCurrency(parsedAmount) : ''}`}</span>
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setConfirmOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md card p-6 bg-surface-elevated border-border shadow-2xl space-y-5 z-10"
            >
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2 text-text-primary font-bold text-base">
                  <RiShieldCheckLine className="text-emerald-500 text-xl" />
                  <span>Authorize Transfer</span>
                </div>
                <button 
                  onClick={() => setConfirmOpen(false)}
                  className="p-1 rounded-lg hover:bg-surface-muted text-text-tertiary hover:text-text-primary cursor-pointer"
                >
                  <RiCloseLine className="text-lg" />
                </button>
              </div>

              <div className="p-4 rounded-xl bg-surface-muted/50 border border-border space-y-3">
                <div className="text-center py-2">
                  <span className="text-xs text-text-tertiary uppercase tracking-wider block">Transferring</span>
                  <p className="text-3xl font-bold font-mono text-text-primary mt-1">
                    {formatCurrency(parsedAmount)}
                  </p>
                </div>
                <div className="space-y-1.5 text-xs text-text-secondary pt-2 border-t border-border">
                  <div className="flex justify-between">
                    <span>Beneficiary:</span>
                    <span className="font-mono font-medium text-text-primary">{form.toAccountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transfer Channel:</span>
                    <span className="font-medium text-text-primary">
                      {transferType === 'mobile' ? 'UPI Instant' : 'Direct NEFT'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Remarks:</span>
                    <span className="text-text-primary">{form.description || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={executeConfirmed}
                  className="btn-primary flex-1 py-3 text-xs font-semibold cursor-pointer"
                >
                  Confirm & Send
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmOpen(false)}
                  className="btn-secondary px-5 py-3 text-xs font-semibold cursor-pointer"
                >
                  Back
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

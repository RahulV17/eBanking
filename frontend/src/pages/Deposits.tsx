import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { 
  RiAddCircleLine, 
  RiShieldCheckFill, 
  RiSmartphoneLine, 
  RiBankCardLine, 
  RiBuilding4Line, 
  RiCheckDoubleLine,
  RiInformationLine,
  RiCopperCoinLine,
  RiArrowRightLine
} from 'react-icons/ri';
import { api } from '../api/client';
import { formatCurrency } from '../lib/utils';

export default function Deposits() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastSuccess, setLastSuccess] = useState<number | null>(null);

  const presets = [500, 1000, 2500, 5000, 10000];

  const handleInitiateDeposit = async (depositAmt?: string) => {
    const val = depositAmt || amount;
    const num = parseFloat(val);
    if (!val || isNaN(num) || num <= 0 || num > 100000) {
      toast.error('Enter a valid deposit amount between ₹1.00 and ₹1,00,000');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/v1/user/deposit', { amount: num });
      const orderDetails = res.data.data;
      openRazorpay(orderDetails, num);
    } catch (err: any) {
      console.error('[Deposit] Init error:', err);
      toast.error(err.response?.data?.message || 'Failed to initialize payment gateway');
      setLoading(false);
    }
  };

  const openRazorpay = (orderDetails: any, numAmount: number) => {
    const options = {
      key: orderDetails.key,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: 'eBanking Digital Services',
      description: `Deposit ${formatCurrency(numAmount)} to Savings Account`,
      order_id: orderDetails.orderId,
      method: { upi: true },
      upi: { vpa: 'test@razorpay' },
      handler: async (response: any) => {
        try {
          const paymentId = response?.razorpay_payment_id || response?.paymentId;
          const orderId = response?.razorpay_order_id || orderDetails.orderId;
          const signature = response?.razorpay_signature;

          if (!paymentId || !signature) {
            toast.error('Payment authorization was incomplete.');
            setLoading(false);
            return;
          }

          await api.post('/v1/user/confirm-deposit', null, {
            params: {
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature,
            },
          });

          toast.success(`Successfully deposited ${formatCurrency(numAmount)}!`);
          setLastSuccess(numAmount);
          setAmount('');
        } catch (err: any) {
          const msg = err.response?.data?.message || err.message || 'Payment confirmation failed';
          toast.error('Deposit confirmation error: ' + msg);
        } finally {
          setLoading(false);
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
        },
      },
      prefill: {
        name: '',
        email: '',
      },
      theme: {
        color: '#9067A7', // Royal Amethyst Brand Tone
      },
    };

    try {
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (e: any) {
      setLoading(false);
      alert('Razorpay Checkout failed to initialize: ' + e.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
          Add Funds
        </h1>
        <p className="text-xs sm:text-sm text-text-tertiary mt-0.5">
          Top up your savings account instantly via UPI, NetBanking, or Cards
        </p>
      </div>

      {/* Success Notification Banner if just deposited */}
      {lastSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <RiCheckDoubleLine className="text-emerald-500 text-xl" />
            <div>
              <p className="text-xs sm:text-sm font-semibold text-emerald-400">
                Deposit of {formatCurrency(lastSuccess)} Confirmed
              </p>
              <p className="text-[11px] text-text-tertiary">
                Your available account balance has been updated in real time.
              </p>
            </div>
          </div>
          <button
            onClick={() => setLastSuccess(null)}
            className="text-text-tertiary hover:text-text-primary text-xs"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Main Deposit Card */}
      <div className="card p-6 sm:p-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Enter Deposit Amount (INR)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-text-secondary font-bold text-lg">
              ₹
            </div>
            <input
              type="number"
              min="1"
              max="100000"
              step="any"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5,000"
              className="input-field pl-10 font-mono text-xl font-bold text-text-primary"
            />
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <span className="text-[10px] text-text-tertiary uppercase font-medium mr-1">Suggested:</span>
            {presets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(String(preset))}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all cursor-pointer ${
                  amount === String(preset)
                    ? 'bg-[#9067A7]/20 border-[#9067A7] text-[#CF9CCD] shadow-xs'
                    : 'bg-surface-muted border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                ₹{preset.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        {/* Deposit CTA */}
        <button
          onClick={() => handleInitiateDeposit()}
          disabled={loading || !amount || parseFloat(amount) <= 0}
          className="btn-primary w-full py-3.5 text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
        >
          <RiAddCircleLine className="text-base" />
          <span>{loading ? 'Initializing Gateway...' : `Proceed to Deposit ${amount ? formatCurrency(parseFloat(amount) || 0) : ''}`}</span>
        </button>

        {/* Supported Channels Strip */}
        <div className="pt-4 border-t border-border">
          <p className="text-[10px] text-text-tertiary uppercase font-semibold tracking-wider mb-3">
            Supported Payment Gateways & Channels
          </p>
          <div className="grid grid-cols-3 gap-3 text-center text-xs text-text-secondary">
            <div className="p-3 rounded-xl bg-surface-muted/50 border border-border/70 flex flex-col items-center gap-1">
              <RiSmartphoneLine className="text-lg text-[#9067A7]" />
              <span className="font-medium text-[11px]">Instant UPI</span>
              <span className="text-[9px] text-text-tertiary">GPay / PhonePe / Paytm</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted/50 border border-border/70 flex flex-col items-center gap-1">
              <RiBuilding4Line className="text-lg text-[#9067A7]" />
              <span className="font-medium text-[11px]">NetBanking</span>
              <span className="text-[9px] text-text-tertiary">50+ Indian Banks</span>
            </div>

            <div className="p-3 rounded-xl bg-surface-muted/50 border border-border/70 flex flex-col items-center gap-1">
              <RiBankCardLine className="text-lg text-[#9067A7]" />
              <span className="font-medium text-[11px]">Debit & Credit</span>
              <span className="text-[9px] text-text-tertiary">RuPay / Visa / MC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Assurance Card */}
      <div className="p-4 rounded-xl border border-border/80 bg-surface-elevated/50 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center text-emerald-500 shrink-0">
          <RiShieldCheckFill className="text-lg" />
        </div>
        <div>
          <p className="text-xs font-semibold text-text-primary">Secured via Razorpay Payment Gateway</p>
          <p className="text-[11px] text-text-tertiary">
            End-to-end 256-bit SSL encryption. All transactions comply with RBI guidelines and PCI DSS Tier-1 standards.
          </p>
        </div>
      </div>
    </div>
  );
}

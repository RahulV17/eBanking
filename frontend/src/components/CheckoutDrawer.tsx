import { useState } from 'react';
import { X, Check, Shield, CreditCard, Smartphone } from 'lucide-react';

interface CheckoutDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTier?: string;
}

export default function CheckoutDrawer({ isOpen, onClose, defaultTier = 'premium' }: CheckoutDrawerProps) {
  const [tier, setTier] = useState(defaultTier);
  const tiers = [
    { id: 'basic', name: 'Basic', price: 'Free', features: ['Savings account', 'UPI transfers', 'Email support'] },
    { id: 'premium', name: 'Premium', price: '₹199/mo', features: ['All Basic features', 'AI assistant', 'Priority support', 'Virtual card'] },
    { id: 'enterprise', name: 'Enterprise', price: '₹499/mo', features: ['All Premium features', 'API access', 'Dedicated manager', 'Custom branding'] },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="ml-auto relative w-full max-w-md bg-white h-full shadow-2xl overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Choose your plan</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <X size={20} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {tiers.map((t) => (
            <button
              key={t.id}
              onClick={() => setTier(t.id)}
              className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                tier === t.id ? 'border-violet-500 bg-violet-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{t.name}</span>
                <span className="text-sm text-gray-500">{t.price}</span>
              </div>
              <ul className="space-y-1">
                {t.features.map((f) => (
                  <li key={f} className="text-sm text-gray-600 flex items-center gap-2">
                    <Check size={14} className="text-emerald-500" />{f}
                  </li>
                ))}
              </ul>
            </button>
          ))}
          <button className="w-full py-4 bg-violet-600 text-white font-semibold rounded-2xl hover:bg-violet-700 transition-colors mt-6">
            Subscribe Now
          </button>
        </div>
      </div>
    </div>
  );
}

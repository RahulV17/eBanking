import React from 'react';
import { CreditCard, Wifi, ShieldCheck } from 'lucide-react';

interface VirtualCardProps {
  cardHolderName?: string;
  accountNumber?: string | number | null;
  balance?: number | null;
  isActive?: boolean;
  isBlocked?: boolean;
}

export default function VirtualCard({ 
  cardHolderName = 'Valued Member', 
  accountNumber = null, 
  balance = null,
  isActive = true,
  isBlocked = false
}: VirtualCardProps) {
  const formatBalance = (bal: number | null) => {
    if (bal === null) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(bal);
  };

  const maskAccount = (acc: string | number | null) => {
    if (!acc) return '**** **** **** ****';
    const str = String(acc);
    return `**** **** **** ${str.slice(-4)}`;
  };

  return (
    <div className="relative w-[340px] h-[210px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-6 flex flex-col justify-between">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#FF5C00] rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FF7A29] rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold tracking-wider text-white/70">eBanking</span>
          <Wifi className="text-white/70" size={20} />
        </div>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="text-lg font-mono tracking-widest">
          {maskAccount(accountNumber)}
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-white/50 mb-1">Card Holder</p>
            <p className="text-sm font-semibold">{cardHolderName}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50 mb-1">Balance</p>
            <p className="text-lg font-bold">{formatBalance(balance)}</p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex items-center gap-2">
          {isBlocked && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <ShieldCheck size={10} /> BLOCKED
            </span>
          )}
          {!isActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
              PENDING
            </span>
          )}
          {isActive && !isBlocked && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck size={10} /> ACTIVE
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

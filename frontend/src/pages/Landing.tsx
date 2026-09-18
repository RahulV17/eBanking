import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Landmark, ArrowRightLeft, MessageSquare, ShieldCheck, KeyRound, Eye,
  UserPlus, Send, Lock, Timer, Sun, Moon, Menu, X, Check, ChevronDown,
  IndianRupee, FileCheck, UserCheck, TrendingUp, CreditCard, PiggyBank
} from 'lucide-react';
import { useUIStore } from '../stores/uiStore';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.45, ease: 'easeOut' as const },
};

function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const dark = theme === 'dark';
  return (
    <button
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="w-10 h-10 rounded-full border border-border bg-surface flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-border-strong transition-colors"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

function SiteNav() {
  const [open, setOpen] = useState(false);
  const links = [
    { href: '#features', label: 'Features' },
    { href: '#security', label: 'Security' },
    { href: '#faq', label: 'FAQ' },
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-elevated">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
            <Landmark className="text-white" size={20} />
          </span>
          <span className="text-lg font-bold text-text-primary">eBanking</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
              {l.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link to="/register" className="btn-primary text-sm">Open account</Link>
        </div>
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-text-primary">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-surface-elevated px-4 py-4 space-y-1">
          {links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary">
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="btn-ghost text-sm flex-1 text-center">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm flex-1 text-center">Open account</Link>
          </div>
        </div>
      )}
    </header>
  );
}

const features = [
  { icon: TrendingUp, tint: 'bg-accent-50 text-accent-600', title: 'Instant Transfers', body: 'Send money by mobile or account number with Razorpay-backed verification.', large: true },
  { icon: MessageSquare, tint: 'bg-success-50 text-success-600', title: 'AI Assistant', body: 'Ask about balances and transactions. Only sees data you explicitly allow.', large: true },
  { icon: PiggyBank, tint: 'bg-warning-50 text-warning-600', title: 'Smart Savings', body: 'Set goals, track progress, and watch your savings grow automatically.' },
  { icon: KeyRound, tint: 'bg-primary-50 text-primary-600', title: 'OTP Armor', body: '6-digit codes, 5-minute expiry, brute-force lockouts on every sensitive endpoint.' },
  { icon: UserCheck, tint: 'bg-success-50 text-success-600', title: 'Human Approvals', body: 'New savings accounts reviewed before activation. No silent auto-provisioning.' },
  { icon: Eye, tint: 'bg-warning-50 text-warning-600', title: 'Privacy Controls', body: 'Per-user consent for admin visibility, documents, and data sharing.' },
];

const security = [
  { icon: KeyRound, title: 'OTP on every action', body: 'Signup, password resets, and high-risk flows gated behind single-use codes.' },
  { icon: Lock, title: 'Revocable sessions', body: 'JWT access with server-side blocklist - logging out actually logs you out everywhere.' },
  { icon: Timer, title: 'Brute-force lockouts', body: 'Five wrong attempts earns a 15-minute cooldown on logins, OTPs, and resets.' },
  { icon: FileCheck, title: 'Consent-gated AI', body: 'The AI assistant receives zero banking context until you opt in from Profile privacy settings.' },
];

const faqs = [
  { q: 'Is this real money?', a: 'No. Deposits and transfers run through Razorpay in test mode, so no real funds ever move.' },
  { q: 'Why does my account need approval?', a: 'New savings accounts start as pending and an administrator approves them - mirroring how real banks do KYC-gated onboarding.' },
  { q: 'What does the AI assistant see?', a: 'Nothing, until you allow it. Hard-blocked behind the "Data Sharing" toggle in Profile privacy settings.' },
  { q: 'What if I get locked out?', a: 'Five failed logins or OTP attempts trigger a 15-minute cooldown. Wait it out, or reset your password via OTP.' },
];

function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="max-w-3xl mx-auto divide-y divide-border rounded-2xl border border-border bg-surface-elevated px-6">
      {faqs.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="w-full flex items-center justify-between gap-4 py-5 text-left"
          >
            <span className="font-semibold text-text-primary">{f.q}</span>
            <ChevronDown size={18} className={`shrink-0 text-text-tertiary transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && <p className="pb-5 text-sm leading-relaxed text-text-secondary">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-surface text-text-primary">
      <SiteNav />
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-50/50 via-transparent to-primary-50/30 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-20 lg:pt-24 lg:pb-28 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <span className="badge badge-accent">Demo build - Spring Boot + React</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.05 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance"
            >
              Banking that moves at <span className="text-accent-600">your speed.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.12 }}
              className="mt-6 text-lg text-text-secondary leading-relaxed max-w-xl"
            >
              Open a savings account in minutes, move money instantly, and ask an AI assistant that only sees what you allow.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/register" className="btn-primary px-8 py-3.5 text-sm font-semibold">Open free account</Link>
              <Link to="/login" className="btn-secondary px-8 py-3.5 text-sm font-semibold">Sign in</Link>
            </motion.div>
            <motion.ul
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.45, delay: 0.28 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary"
            >
              {['OTP-verified signup', 'Consent-first AI', 'Test-mode Razorpay', 'Lockout protection'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <Check size={15} className="text-success-600" />{t}
                </li>
              ))}
            </motion.ul>
          </div>
          <ProductMock />
        </div>
      </section>
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28 scroll-mt-16">
        <motion.div {...fadeUp} className="max-w-2xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything a bank app should do.</h2>
          <p className="mt-3 text-text-secondary text-lg">Six capabilities, each one wired to a real backend - no mock screens, no dead buttons.</p>
        </motion.div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className={`card-interactive ${f.large ? 'sm:col-span-2 lg:col-span-1' : ''}`}
            >
              <span className={`w-12 h-12 rounded-2xl ${f.tint} flex items-center justify-center`}>
                <f.icon size={24} />
              </span>
              <h3 className="mt-5 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </section>
      <section id="security" className="scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 lg:py-28">
          <motion.div {...fadeUp} className="rounded-3xl bg-text-primary text-white px-8 py-16 sm:p-16 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-accent-500/20 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl pointer-events-none" aria-hidden="true" />
            <div className="relative max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Paranoid where it counts. Invisible everywhere else.</h2>
              <p className="mt-3 text-white/70 text-lg">Protection that never makes you solve a puzzle to move your own money.</p>
            </div>
            <div className="relative mt-12 grid sm:grid-cols-2 gap-6">
              {security.map((s) => (
                <div key={s.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <s.icon size={22} className="text-accent-300" />
                  </span>
                  <h3 className="mt-4 font-semibold text-lg">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{s.body}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
      <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 lg:pb-28 scroll-mt-16">
        <motion.div {...fadeUp} className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Straight answers.</h2>
        </motion.div>
        <motion.div {...fadeUp} className="mt-10">
          <Faq />
        </motion.div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 lg:pb-28">
        <motion.div {...fadeUp} className="rounded-3xl bg-gradient-to-br from-accent-600 to-accent-800 px-8 py-16 sm:p-20 text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJILTEweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNhKSIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIvPjwvc3ZnPg==')] opacity-50" />
          <h2 className="relative text-3xl sm:text-4xl font-bold tracking-tight">Ready when you are.</h2>
          <p className="relative mt-3 text-white/80 text-lg">Two minutes to an account. Fifteen to full access.</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-white">Open free account</Link>
            <Link to="/login" className="rounded-full border border-white/30 px-8 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors">Sign in</Link>
          </div>
        </motion.div>
      </section>
      <footer className="border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-700 flex items-center justify-center">
                <Landmark className="text-white" size={20} />
              </span>
              <span className="text-lg font-bold">eBanking</span>
            </div>
            <p className="mt-3 text-sm text-text-secondary max-w-sm leading-relaxed">
              A full-stack internet banking demo - real authentication, test-mode payments, and an AI assistant with genuine privacy controls.
            </p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Product</p>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li><Link to="/register" className="hover:text-text-primary transition-colors">Open account</Link></li>
              <li><Link to="/login" className="hover:text-text-primary transition-colors">Sign in</Link></li>
              <li><Link to="/forgot-password" className="hover:text-text-primary transition-colors">Reset password</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">Explore</p>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              <li><a href="#features" className="hover:text-text-primary transition-colors">Features</a></li>
              <li><a href="#security" className="hover:text-text-primary transition-colors">Security</a></li>
              <li><a href="#faq" className="hover:text-text-primary transition-colors">FAQ</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-text-tertiary">
            <span>Demo project for educational purposes - Not a licensed bank - No real money moves here</span>
            <span>Protected with 256-bit SSL - Never share your OTP</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductMock() {
  const bars = [38, 55, 42, 70, 58, 82, 64, 90, 74, 62, 86, 96];
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="relative"
    >
      <div className="rounded-3xl border border-border bg-surface-elevated shadow-xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-surface-muted">
          <span className="w-3 h-3 rounded-full bg-danger-400" />
          <span className="w-3 h-3 rounded-full bg-warning-400" />
          <span className="w-3 h-3 rounded-full bg-success-400" />
          <span className="ml-3 text-xs text-text-tertiary font-mono">app.ebanking.io/dashboard</span>
        </div>
        <div className="p-6">
          <p className="text-xs font-medium text-text-tertiary">Total balance</p>
          <p className="text-3xl sm:text-4xl font-bold text-text-primary tracking-tight mt-1">₹48,250.75</p>
          <p className="text-xs text-success-600 font-medium mt-1">+ ₹4,120 this month</p>
          <div className="flex items-end gap-1.5 h-24 mt-5" aria-hidden="true">
            {bars.map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 0.4 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                className={`flex-1 rounded-t-lg ${i === bars.length - 1 ? 'bg-accent-500' : 'bg-accent-100'}`}
              />
            ))}
          </div>
          <div className="mt-5 space-y-2.5">
            {[
              { label: 'UPI transfer - Raman', amount: '- ₹2,500', negative: true },
              { label: 'Deposit via Razorpay', amount: '+ ₹10,000', negative: false },
              { label: 'NEFT - Salary credit', amount: '+ ₹42,000', negative: false },
            ].map((t) => (
              <div key={t.label} className="flex items-center justify-between rounded-xl border border-border px-4 py-2.5">
                <span className="text-sm text-text-secondary">{t.label}</span>
                <span className={`text-sm font-semibold ${t.negative ? 'text-danger-500' : 'text-success-600'}`}>{t.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="absolute -left-4 top-16 rounded-2xl border border-border bg-surface-elevated shadow-lg px-4 py-3 flex items-center gap-2.5"
      >
        <span className="w-8 h-8 rounded-full bg-success-50 flex items-center justify-center">
          <Check size={16} className="text-success-600" />
        </span>
        <div>
          <p className="text-xs font-semibold text-text-primary">Transfer successful</p>
          <p className="text-[11px] text-text-tertiary">Verified in 1.2s</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

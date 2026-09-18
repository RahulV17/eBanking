import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ArrowRight,
  Sparkles,
  Check,
  CreditCard,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  Zap,
  TrendingUp,
  Percent,
  Layers,
  RotateCcw,
  ChevronDown,
  HelpCircle,
  Award,
  Send,
  Lock,
  Bot,
  MessageSquare,
  Globe,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useSmoothScroll } from '../hooks/useSmoothScroll';
import FloatingReal3DCard from '../components/FloatingReal3DCard';
import CheckoutDrawer from '../components/CheckoutDrawer';

export default function HomePage() {
  // Initialize buttery smooth scroll inertia
  useSmoothScroll();

  // Navigation and interactive states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Video player controls
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Feature 1: Interactive Transfer Simulator
  const [transferAmount, setTransferAmount] = useState<number>(25000);
  const [transferRail, setTransferRail] = useState<'upi' | 'imps' | 'wire'>('upi');

  // Feature 2: Interactive Deposit & Compounding Calculator
  const [depositPrincipal, setDepositPrincipal] = useState<number>(100000);
  const [depositTenure, setDepositTenure] = useState<number>(3); // years

  // Deposit APY rates mapping
  const tenureRates: Record<number, number> = {
    1: 7.2,
    2: 7.8,
    3: 8.2,
    5: 8.5
  };

  const currentRate = tenureRates[depositTenure] || 8.2;
  const maturityAmount = Math.round(depositPrincipal * Math.pow(1 + currentRate / 100, depositTenure));
  const interestEarned = maturityAmount - depositPrincipal;

  // Feature 3: Interactive AI Prompts
  const [activeAiPrompt, setActiveAiPrompt] = useState<number>(0);

  const aiConversations = [
    {
      q: "How much did I spend on dining and delivery this month?",
      a: "You spent ₹14,280 across 18 transactions. That is 12.4% lower than last month, putting you on track to save ₹6,500 towards your emergency fund target.",
      category: "Spend Analytics",
      savings: "-12.4% vs last month"
    },
    {
      q: "Forecast my liquid runway and projected savings for next quarter",
      a: "Based on recurring salary inflows and your median burn rate of ₹48,000/mo, your projected balance on July 31 is ₹4,22,500 (+18.2% net liquidity growth).",
      category: "Cash-Flow Forecast",
      savings: "+₹65,000 projected surplus"
    },
    {
      q: "Audit my recurring subscriptions and detect unused services",
      a: "Identified 4 active recurring mandates. 2 streaming services (totaling ₹1,499/mo) had zero activity in the last 45 days. Would you like me to pause them?",
      category: "Subscription Shield",
      savings: "Save ₹17,988 annually"
    },
    {
      q: "Move idle checking surplus into High-Yield Fixed Deposit",
      a: "Identified ₹45,000 in idle cash above your safety threshold. Queued allocation to a 3-Year Fixed Deposit earning 8.2% APY with compound interest.",
      category: "Autonomous Wealth",
      savings: "+₹11,920 guaranteed yield"
    }
  ];

  // Apply Modal state
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  // Checkout Drawer & Customization state
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string>('obsidian');

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Mobile Sticky Conversion Bar
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowStickyBar(window.scrollY > 420);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenDrawer = (tier: string = 'obsidian') => {
    setSelectedTier(tier);
    setCheckoutDrawerOpen(true);
  };

  // Video toggle handlers
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    toast.success('Account verification link sent to your mobile. Instant digital approval in 3 minutes.');
    setApplyModalOpen(false);
    setPhoneNumber('');
  };

  return (
    <div className="relative min-h-screen bg-[#090B0E] text-white selection:bg-[#9067A7]/30 selection:text-white font-sans antialiased overflow-x-hidden">
      
      {/* ===================================================================== */}
      {/* 1. FIXED NAVIGATION HEADER (eBanking Identity)                        */}
      {/* ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20 sm:h-24 bg-[#090B0E]/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="flex items-center justify-between w-full h-full max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Brand Logo: eBanking */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9067A7] via-[#CF9CCD] to-white p-0.5 shadow-[0_0_20px_rgba(144,103,167,0.4)] group-hover:scale-105 transition-all">
              <div className="w-full h-full bg-[#0E1013] rounded-[14px] flex items-center justify-center">
                <ShieldCheck size={20} className="text-white group-hover:text-[#CF9CCD] transition-colors" />
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-bricolage font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-none">
                eBanking
              </span>
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#CF9CCD] uppercase mt-0.5">
                Digital Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Pills (Frosted Slate Style) */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link 
              to="/accounts" 
              className="px-4 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all shadow-sm"
            >
              Accounts
            </Link>
            <Link 
              to="/transfers" 
              className="px-4 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all shadow-sm"
            >
              Transfers & UPI
            </Link>
            <Link 
              to="/deposits" 
              className="px-4 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all shadow-sm"
            >
              Fixed Deposits
            </Link>
            <Link 
              to="/ai-chat" 
              className="px-4 py-2 rounded-full text-xs font-semibold text-[#FFEBFE] bg-[#9067A7]/15 hover:bg-[#9067A7]/25 border border-[#9067A7]/40 transition-all shadow-sm flex items-center gap-1.5"
            >
              <Bot size={13} className="text-[#CF9CCD]" />
              <span>AI Co-Pilot</span>
            </Link>
            <a 
              href="#card-editions" 
              className="px-4 py-2 rounded-full text-xs font-semibold text-white/80 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all shadow-sm flex items-center gap-1"
            >
              <span>Card Studio</span>
              <ChevronRight size={13} className="text-white/40" />
            </a>
          </div>

          {/* Right Action: Auth / Open Account */}
          <div className="flex items-center gap-3">
            <Link 
              to="/login" 
              className="hidden sm:inline-block text-xs font-semibold px-4 py-2 rounded-full text-white/80 hover:text-white hover:bg-white/5 transition-all"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-bold bg-white text-black hover:bg-[#F7F5FF] transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95"
            >
              Open Account
            </Link>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-full bg-white/10 text-white"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-[#0A0D10]/98 border-b border-white/10 px-6 py-6 space-y-3 backdrop-blur-2xl"
            >
              <Link to="/accounts" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-white/90">
                Accounts & Savings
              </Link>
              <Link to="/transfers" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-white/90">
                Transfers & UPI
              </Link>
              <Link to="/deposits" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-white/90">
                Fixed Deposits (8.5% APY)
              </Link>
              <Link to="/ai-chat" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-[#FFEBFE]">
                AI Financial Co-Pilot
              </Link>
              <a href="#card-editions" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm font-semibold text-white/90">
                Bespoke 3D Metal Cards
              </a>
              <div className="pt-4 border-t border-white/10 flex gap-3">
                <a href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2.5 text-center text-xs font-semibold rounded-full bg-white/10 text-white">
                  Sign In
                </a>
                <a href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1 py-2.5 text-center text-xs font-bold rounded-full bg-white text-black">
                  Open Account
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ===================================================================== */}
      {/* 2. HERO SECTION: INTERACTIVE 3D WEBGL CARD & METRICS                  */}
      {/* ===================================================================== */}
      <section 
        id="hero"
        className="relative w-full min-h-[92vh] sm:min-h-screen pt-28 sm:pt-36 pb-20 flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Ambient Ethereal Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[900px] sm:h-[900px] bg-[#9067A7]/20 rounded-full blur-[140px] pointer-events-none z-0" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-[#FFEBFE]/10 rounded-full blur-[120px] pointer-events-none z-0" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-[#CF9CCD]/12 rounded-full blur-[150px] pointer-events-none z-0" />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col items-center text-center">
          
          {/* Eyebrow Pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl text-xs font-semibold mb-6 shadow-sm"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#FFEBFE] uppercase tracking-wider text-[11px] font-bold">
              Autonomous Digital Banking • Institutional Security
            </span>
          </motion.div>

          {/* Main Hero Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-bricolage font-extrabold text-4xl sm:text-6xl md:text-7xl lg:text-[82px] leading-[1.05] tracking-[-2px] sm:tracking-[-3px] max-w-5xl mx-auto slice-title-gradient"
          >
            Banking reimagined for the modern era.
          </motion.h1>

          {/* Subtitle Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-base sm:text-xl md:text-2xl font-normal leading-relaxed max-w-3xl mx-auto slice-sub-gradient mt-6"
          >
            Seamless real-time fund transfers, high-yield deposits up to 8.5% APY, conversational AI co-pilot, and bespoke 3D metal instruments. All secured by 256-bit bank encryption.
          </motion.p>

          {/* Hero Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 z-20"
          >
            <Link
              to="/register"
              className="px-8 py-3.5 rounded-full bg-white text-black font-bold text-sm hover:bg-[#F7F5FF] transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-95 flex items-center gap-2"
            >
              <span>Open Free Account</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/dashboard"
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-sm backdrop-blur-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <TrendingUp size={15} className="text-[#CF9CCD]" />
              <span>Explore Live Dashboard</span>
            </Link>
          </motion.div>

          {/* Centerpiece 3D Card Studio with Floating Live Telemetry */}
          <div className="relative w-full max-w-4xl my-12 sm:my-16 flex items-center justify-center min-h-[420px] sm:min-h-[500px]">
            
            {/* Real Three.js WebGL 3D Card with 360° Drag */}
            <div className="w-full flex items-center justify-center relative z-10">
              <FloatingReal3DCard />
            </div>

            {/* Floating Live Telemetry Badge: Top Left */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -left-4 top-16 z-20 p-4 rounded-2xl bg-[#0E1013]/90 backdrop-blur-xl border border-white/15 shadow-2xl items-center gap-3 text-left max-w-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                <TrendingUp size={20} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Liquid Portfolio</div>
                <div className="text-base font-bricolage font-extrabold text-white">₹14,85,200</div>
                <div className="text-[11px] text-emerald-400 font-semibold">+18.4% YTD Growth</div>
              </div>
            </motion.div>

            {/* Floating Live Telemetry Badge: Top Right */}
            <motion.div
              animate={{ y: [6, -6, 6] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -right-4 top-16 z-20 p-4 rounded-2xl bg-[#0E1013]/90 backdrop-blur-xl border border-white/15 shadow-2xl items-center gap-3 text-left max-w-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-[#9067A7]/25 text-[#FFEBFE] flex items-center justify-center border border-[#9067A7]/40 shrink-0">
                <Percent size={20} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold">Guaranteed Yield</div>
                <div className="text-base font-bricolage font-extrabold text-white">8.5% p.a.</div>
                <div className="text-[11px] text-[#CF9CCD] font-semibold">Fixed Deposit Compound</div>
              </div>
            </motion.div>

            {/* Floating Live Telemetry Badge: Bottom Left */}
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -left-2 bottom-12 z-20 p-3.5 rounded-2xl bg-[#0E1013]/90 backdrop-blur-xl border border-white/15 shadow-2xl items-center gap-3 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 shrink-0">
                <Zap size={18} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold">UPI Settlement</div>
                <div className="text-xs font-bold text-white">Sub-second Speed • ₹0 Fee</div>
              </div>
            </motion.div>

            {/* Floating Live Telemetry Badge: Bottom Right */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
              className="hidden lg:flex absolute -right-2 bottom-12 z-20 p-3.5 rounded-2xl bg-[#0E1013]/90 backdrop-blur-xl border border-white/15 shadow-2xl items-center gap-3 text-left"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-[#CF9CCD] flex items-center justify-center border border-purple-500/30 shrink-0">
                <Bot size={18} />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-white/50 font-bold">AI Financial Co-Pilot</div>
                <div className="text-xs font-bold text-white">24/7 Smart Shield Active</div>
              </div>
            </motion.div>
          </div>

          {/* Quick Metrics Ticker */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-6 border-t border-white/[0.08]">
            <div className="text-center p-3">
              <span className="text-2xl sm:text-3xl font-bricolage font-extrabold text-white">₹0</span>
              <span className="text-xs text-white/60 block mt-0.5">Account Maintenance Fee</span>
            </div>
            <div className="text-center p-3">
              <span className="text-2xl sm:text-3xl font-bricolage font-extrabold text-emerald-400">8.5%</span>
              <span className="text-xs text-white/60 block mt-0.5">Max Fixed Deposit APY</span>
            </div>
            <div className="text-center p-3">
              <span className="text-2xl sm:text-3xl font-bricolage font-extrabold text-white">&lt; 3 mins</span>
              <span className="text-xs text-white/60 block mt-0.5">Digital KYC Onboarding</span>
            </div>
            <div className="text-center p-3">
              <span className="text-2xl sm:text-3xl font-bricolage font-extrabold text-[#CF9CCD]">₹5,00,000</span>
              <span className="text-xs text-white/60 block mt-0.5">DICGC Deposit Insurance</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 3. CORE BANKING PILLARS: INTERACTIVE CALCULATORS & STORIES            */}
      {/* ===================================================================== */}
      <section id="features" className="relative w-full py-28 sm:py-36 border-t border-white/[0.08] overflow-hidden">
        
        {/* Background Glows */}
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[#9067A7]/15 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[#CF9CCD]/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 space-y-36 sm:space-y-44">
          
          {/* ----------------------------------------------------------------- */}
          {/* PILLAR 1: INSTANT CAPITAL MOVEMENT (Transfers & UPI Rail)         */}
          {/* ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Copy & Live Interactive Transfer Calculator */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Send size={12} />
                <span>Seamless Capital Movement</span>
              </div>

              <h2 className="font-bricolage font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight slice-title-gradient">
                Send money anywhere. Instantly, with zero fees.
              </h2>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed font-normal">
                Direct integration with NPCI Instant UPI, IMPS, and global SWIFT wire clearing. Transfer funds between bank accounts in under two seconds with complete ledger integrity.
              </p>

              {/* Interactive Transfer Rail Simulator */}
              <div className="p-6 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/10 space-y-5 shadow-2xl">
                <div className="flex items-center justify-between text-xs font-bold text-white/70">
                  <span>TRANSFER AMOUNT</span>
                  <span className="text-emerald-400">ZERO HIDDEN CHARGES</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-bricolage font-extrabold text-white">
                    ₹{transferAmount.toLocaleString('en-IN')}
                  </span>
                  <div className="text-right">
                    <span className="text-xs text-white/50 block font-medium">Processing Fee</span>
                    <span className="text-sm font-bold text-emerald-400">₹0.00 (FREE)</span>
                  </div>
                </div>

                {/* Transfer Rail Selector */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { id: 'upi', name: 'Instant UPI', speed: 'Sub-second' },
                    { id: 'imps', name: 'IMPS Rail', speed: 'Immediate' },
                    { id: 'wire', name: 'Global Wire', speed: 'Real-time FX' },
                  ].map((rail) => (
                    <button
                      key={rail.id}
                      type="button"
                      onClick={() => setTransferRail(rail.id as any)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        transferRail === rail.id
                          ? 'bg-white/15 border-[#9067A7] shadow-[0_0_15px_rgba(144,103,167,0.3)]'
                          : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-xs font-bold text-white">{rail.name}</div>
                      <div className="text-[10px] text-white/50 mt-0.5">{rail.speed}</div>
                    </button>
                  ))}
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[5000, 25000, 50000, 100000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setTransferAmount(val)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        transferAmount === val
                          ? 'bg-white text-black font-bold'
                          : 'bg-white/10 text-white hover:bg-white/15'
                      }`}
                    >
                      ₹{(val / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>

                <Link
                  to="/transfers"
                  className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-xs hover:bg-[#F7F5FF] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 mt-2"
                >
                  <span>Execute Transfer on eBanking</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Right: Live Simulated Transaction Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              <div className="w-full max-w-md p-8 rounded-[36px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] backdrop-blur-2xl border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#9067A7]/20 border border-[#9067A7]/40 flex items-center justify-center text-[#FFEBFE] font-bold">
                      VC
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">Valerie Chen</div>
                      <div className="text-xs text-white/50">valerie@ebanking • HDFC0001234</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Verified
                  </span>
                </div>

                {/* Amount Display */}
                <div className="text-center py-4 space-y-1">
                  <div className="text-xs uppercase tracking-widest text-white/50 font-bold">Initiated Amount</div>
                  <div className="text-4xl font-bricolage font-extrabold text-white">
                    ₹{transferAmount.toLocaleString('en-IN')}.00
                  </div>
                  <div className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1 pt-1">
                    <CheckCircle2 size={13} />
                    <span>Instant Clearance Guaranteed</span>
                  </div>
                </div>

                {/* Transaction Receipt Details */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2.5 text-xs">
                  <div className="flex justify-between text-white/60">
                    <span>Transfer Channel</span>
                    <span className="font-semibold text-white uppercase">{transferRail} Settlement</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Reference ID</span>
                    <span className="font-mono text-white">EBK-2026-981240</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Security Verification</span>
                    <span className="text-emerald-400 font-semibold">256-Bit Cryptographic Hash</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-white/50 justify-center">
                  <Lock size={12} className="text-[#CF9CCD]" />
                  <span>Settled via eBanking High-Velocity Banking Rail</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* PILLAR 2: HIGH-YIELD FIXED DEPOSITS & COMPOUND GROWTH             */}
          {/* ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Interactive Compound Growth Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 order-2 lg:order-1 relative flex items-center justify-center"
            >
              <div className="w-full max-w-md p-8 rounded-[36px] bg-gradient-to-b from-[#1E122B]/80 to-[#100A17]/80 backdrop-blur-2xl border border-[#9067A7]/40 shadow-[0_20px_50px_rgba(144,103,167,0.2)] space-y-6">
                
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-[#FFEBFE] block">
                      Compound Growth Projection
                    </span>
                    <h4 className="font-bricolage font-extrabold text-xl text-white mt-1">
                      Fixed Deposit Certificate
                    </h4>
                  </div>
                  <div className="px-3 py-1.5 rounded-full bg-[#9067A7]/30 border border-[#9067A7]/50 text-white font-bold text-xs">
                    {currentRate}% APY
                  </div>
                </div>

                {/* Growth Payout Highlight */}
                <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-white/60">Initial Deposit</span>
                    <span className="text-sm font-bold text-white">₹{depositPrincipal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-white/60">Interest Profit ({depositTenure} Yrs)</span>
                    <span className="text-base font-bold text-emerald-400 font-bricolage">
                      +₹{interestEarned.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
                    <div>
                      <span className="text-xs font-bold text-white block">Total Maturity Value</span>
                      <span className="text-[10px] text-white/50">Compounded Annually</span>
                    </div>
                    <span className="text-2xl font-bricolage font-extrabold text-[#FFEBFE]">
                      ₹{maturityAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* DICGC Insurance Guarantee */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/10 text-xs text-white/70">
                  <ShieldCheck size={20} className="text-emerald-400 shrink-0" />
                  <span>Principal and interest guaranteed & insured up to ₹5,00,000 under DICGC (RBI).</span>
                </div>

                <Link
                  to="/deposits"
                  className="w-full py-3.5 rounded-2xl bg-white text-black font-bold text-xs hover:bg-[#F7F5FF] transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>Open Fixed Deposit Now</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Right: Copy & Deposit Calculator Sliders */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 order-1 lg:order-2 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9067A7]/20 border border-[#9067A7]/40 text-[#FFEBFE] text-xs font-bold uppercase tracking-wider">
                <Percent size={12} />
                <span>Guaranteed Wealth Acceleration</span>
              </div>

              <h2 className="font-bricolage font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight slice-title-gradient">
                Grow your wealth with up to 8.5% annual yield.
              </h2>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed font-normal">
                Lock in institutional interest rates with flexible lock-in periods from 1 to 5 years. Auto-renewal, monthly interest payout options, and emergency instant liquidity without excessive penalties.
              </p>

              {/* Tenure Selector */}
              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                  Select Investment Tenure
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 5].map((yrs) => (
                    <button
                      key={yrs}
                      type="button"
                      onClick={() => setDepositTenure(yrs)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        depositTenure === yrs
                          ? 'bg-white text-black font-bold border-white'
                          : 'bg-white/[0.04] text-white/80 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-sm font-bricolage font-bold">{yrs} Year{yrs > 1 ? 's' : ''}</div>
                      <div className={`text-[11px] mt-0.5 ${depositTenure === yrs ? 'text-black/70' : 'text-[#CF9CCD]'}`}>
                        {tenureRates[yrs]}% APY
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Principal Selector Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/70 block">
                  Deposit Principal Amount
                </label>
                <div className="flex flex-wrap gap-2">
                  {[25000, 50000, 100000, 250000, 500000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setDepositPrincipal(amt)}
                      className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                        depositPrincipal === amt
                          ? 'bg-white text-black font-bold'
                          : 'bg-white/10 text-white hover:bg-white/15'
                      }`}
                    >
                      ₹{(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* ----------------------------------------------------------------- */}
          {/* PILLAR 3: AUTONOMOUS AI FINANCIAL CO-PILOT                        */}
          {/* ----------------------------------------------------------------- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Copy & Explanation */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-[#FFEBFE] text-xs font-bold uppercase tracking-wider">
                <Bot size={13} />
                <span>Intelligent Wealth Companion</span>
              </div>

              <h2 className="font-bricolage font-extrabold text-3xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight slice-title-gradient">
                An AI that actively watches over your capital.
              </h2>
              <p className="text-base sm:text-lg text-white/70 leading-relaxed font-normal">
                Ask questions in conversational English. eBanking AI classifies every transaction, projects upcoming cash flow, alerts you to hidden recurring charges, and executes balance transfers on command.
              </p>

              {/* Clickable AI Query Prompts */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-white/60 block">
                  Interactive Live Prompts (Click to Preview)
                </span>
                {aiConversations.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveAiPrompt(idx)}
                    className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
                      activeAiPrompt === idx
                        ? 'bg-white/15 border-[#9067A7] text-white font-semibold'
                        : 'bg-white/[0.03] border-white/10 text-white/70 hover:border-white/20'
                    }`}
                  >
                    <span className="text-xs truncate pr-3">{c.q}</span>
                    <span className="text-[10px] font-bold text-[#CF9CCD] bg-[#9067A7]/20 px-2 py-0.5 rounded-full shrink-0">
                      {c.category}
                    </span>
                  </button>
                ))}
              </div>

              <Link
                to="/ai-chat"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-[#F7F5FF] transition-all shadow-lg active:scale-95"
              >
                <Bot size={15} />
                <span>Launch eBanking AI Assistant</span>
              </Link>
            </motion.div>

            {/* Right: Interactive AI Assistant Terminal Window */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >
              <div className="w-full max-w-md p-6 sm:p-8 rounded-[36px] bg-[#0E1013] border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.8)] space-y-6">
                
                {/* Chat Terminal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9067A7] to-[#CF9CCD] p-0.5">
                      <div className="w-full h-full bg-[#0E1013] rounded-[14px] flex items-center justify-center">
                        <Bot size={18} className="text-[#FFEBFE]" />
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">eBanking Co-Pilot</div>
                      <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Online • Active Telemetry</span>
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/50 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                    v2.4 Neural Model
                  </span>
                </div>

                {/* User Message Bubble */}
                <div className="flex justify-end">
                  <div className="max-w-[85%] p-4 rounded-2xl rounded-tr-sm bg-white/10 text-white text-xs font-medium leading-relaxed border border-white/15">
                    {aiConversations[activeAiPrompt].q}
                  </div>
                </div>

                {/* AI Response Bubble */}
                <div className="flex justify-start">
                  <div className="max-w-[90%] p-4 rounded-2xl rounded-tl-sm bg-[#181524] border border-[#9067A7]/40 text-white text-xs leading-relaxed space-y-3">
                    <p>{aiConversations[activeAiPrompt].a}</p>
                    <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between text-[11px]">
                      <span className="text-white/60">Calculated Impact:</span>
                      <span className="text-emerald-400 font-bold">{aiConversations[activeAiPrompt].savings}</span>
                    </div>
                  </div>
                </div>

                {/* Chat Input Box Mockup */}
                <div className="pt-2">
                  <div className="flex items-center rounded-2xl bg-white/[0.05] border border-white/15 px-4 py-3 text-xs text-white/40 justify-between">
                    <span>Ask eBanking AI anything about your money...</span>
                    <Send size={14} className="text-white/60" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 4. DEFENSE-GRADE INSTITUTIONAL SECURITY PILLARS                       */}
      {/* ===================================================================== */}
      <section className="relative w-full py-28 sm:py-36 border-t border-white/[0.08] overflow-hidden bg-black/40">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col items-center">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFEBFE] block">
              Institutional Grade Security
            </span>
            <h2 className="font-bricolage font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.08] slice-title-gradient">
              Defense-grade protection for every rupee.
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
              We engineer our security infrastructure to the highest regulatory standards, ensuring your funds and identity remain safeguarded around the clock.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {[
              {
                icon: ShieldCheck,
                title: 'DICGC Deposit Insurance',
                desc: 'Client deposits are held in scheduled banks and insured up to ₹5,00,000 per depositor by DICGC (RBI).',
                tag: 'Insured Safety'
              },
              {
                icon: Lock,
                title: '256-Bit Bank Encryption',
                desc: 'All communications, ledger syncs, and authentication flows use military-grade end-to-end cryptographic TLS 1.3.',
                tag: 'Cryptographic'
              },
              {
                icon: Smartphone,
                title: 'Dynamic CVV & Limits',
                desc: 'Rotating security codes for digital transactions and 1-tap card lock for ATM and international payment channels.',
                tag: 'Instant Controls'
              },
              {
                icon: Zap,
                title: 'Zero Account Penalty',
                desc: 'Radical transparency with zero non-maintenance penalties, zero surprise renewal fees, and zero hidden ledger deductions.',
                tag: 'Zero Penalties'
              },
            ].map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="p-8 rounded-[32px] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#9067A7]/20 border border-[#9067A7]/40 flex items-center justify-center text-[#FFEBFE] group-hover:scale-105 transition-transform">
                    <p.icon size={22} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#CF9CCD] block">
                      {p.tag}
                    </span>
                    <h3 className="font-bricolage font-bold text-xl text-white mt-1">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-normal">
                    {p.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 5. BESPOKE INSTRUMENTS: 3D CARD CINEMA SHOWCASE                       */}
      {/* ===================================================================== */}
      <section id="video-section" className="relative w-full py-28 sm:py-36 border-t border-white/[0.08] overflow-hidden">
        
        {/* Glow blooms */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#9067A7]/20 rounded-full blur-[160px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 flex flex-col items-center">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFEBFE] block">
              Bespoke Instruments
            </span>
            <h2 className="font-bricolage font-extrabold text-4xl sm:text-6xl md:text-7xl leading-[1.08] tracking-tight slice-title-gradient">
              Engineered with aerospace precision.
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
              Milled from solid aerospace titanium and stainless steel. Contactless EMV chip, tactile matte finish, and custom laser-engraved signatures.
            </p>
          </div>

          {/* 3D Super Card Video Player */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.8 }}
            className="relative w-full max-w-4xl aspect-[16/9] max-h-[560px] rounded-[32px] overflow-hidden border border-white/15 shadow-[0_30px_90px_rgba(144,103,167,0.35)] bg-black group flex items-center justify-center"
          >
            {/* Ambient blurred backdrop of the video */}
            <video
              src="/assets/ebanking_metal_card.mp4"
              className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-50 scale-125 pointer-events-none select-none"
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/40 pointer-events-none z-10" />

            {/* Main crisp video */}
            <video
              ref={videoRef}
              src="/assets/ebanking_metal_card.mp4"
              className="relative z-10 h-full w-auto max-w-full object-contain py-3 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] select-none"
              autoPlay
              loop
              muted
              playsInline
            />

            {/* Top Video Overlay Controls */}
            <div className="absolute top-4 left-6 right-6 flex items-center justify-between z-20 pointer-events-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-xs font-bold text-white">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>eBanking Metal Card Experience</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all active:scale-95"
                  aria-label="Toggle mute"
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
                <button
                  onClick={handleFullscreen}
                  className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all active:scale-95"
                  aria-label="Fullscreen"
                >
                  <Maximize2 size={16} />
                </button>
              </div>
            </div>

            {/* Bottom Play/Pause Bar */}
            <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-20 pointer-events-auto">
              <button
                onClick={togglePlay}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-black text-xs font-bold transition-all shadow-md active:scale-95"
              >
                {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-black" />}
                <span>{isPlaying ? 'Pause' : 'Play 3D Loop'}</span>
              </button>

              <span className="text-[11px] font-semibold text-white/70 hidden sm:inline-block bg-black/50 px-3 py-1 rounded-full backdrop-blur-md">
                Cinema Quality 3D Render • Macro Edition
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 6. CARD EDITIONS COMPARISON MATRIX                                    */}
      {/* ===================================================================== */}
      <section id="card-editions" className="relative w-full py-28 sm:py-36 border-t border-white/[0.08] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#9067A7]/10 rounded-full blur-[160px] pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFEBFE] block">
              Card Editions
            </span>
            <h2 className="font-bricolage font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.08] slice-title-gradient">
              Tailored for how you spend.
            </h2>
            <p className="text-sm sm:text-base text-white/70 max-w-2xl mx-auto leading-relaxed">
              No hidden asterisks, no deceptive maintenance fees. Pick the eBanking edition crafted for your lifestyle and customize your finish.
            </p>
          </div>

          {/* Cards Tier Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* TIER 1: eBanking UPI Virtual */}
            <div className="rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 flex flex-col justify-between relative hover:border-white/20 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    Digital Instant
                  </span>
                  <Smartphone size={20} className="text-white/60" />
                </div>

                <div>
                  <h3 className="font-bricolage font-extrabold text-2xl sm:text-3xl text-white">eBanking Digital Virtual</h3>
                  <p className="text-xs text-white/60 mt-1">Instant digital debit card for phone & online payments</p>
                </div>

                <div className="pt-2 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bricolage font-extrabold text-white">₹0</span>
                    <span className="text-xs text-white/50 font-medium">/ Lifetime Free</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                    Zero joining & annual maintenance charges
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs text-white/80">
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-emerald-400 shrink-0" />
                    <span>Instant virtual issuance in under 60 seconds</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-emerald-400 shrink-0" />
                    <span>Unlimited domestic UPI & QR scan payments</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-emerald-400 shrink-0" />
                    <span>Dynamic CVV rotation for e-commerce security</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-emerald-400 shrink-0" />
                    <span>In-app card freeze and channel controls</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenDrawer('frost')}
                className="w-full mt-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all shadow-sm active:scale-95"
              >
                Select Virtual Card
              </button>
            </div>

            {/* TIER 2: eBanking Super Card Obsidian (Featured) */}
            <div className="rounded-[32px] bg-gradient-to-b from-[#1C1726]/90 to-[#100E17]/90 backdrop-blur-2xl border-2 border-[#9067A7]/60 p-8 sm:p-9 flex flex-col justify-between relative shadow-[0_0_50px_rgba(144,103,167,0.25)] scale-100 lg:scale-[1.04] z-20">
              {/* Featured Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#9067A7] to-[#CF9CCD] text-black text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
                <Sparkles size={11} className="fill-black" />
                <span>Most Popular Edition</span>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFEBFE] bg-[#9067A7]/20 px-3 py-1 rounded-full border border-[#9067A7]/30">
                    Signature Physical
                  </span>
                  <Award size={20} className="text-[#FFEBFE]" />
                </div>

                <div>
                  <h3 className="font-bricolage font-extrabold text-2xl sm:text-3xl text-white">Super Card Obsidian</h3>
                  <p className="text-xs text-white/70 mt-1">Tactile matte titanium finish with EMV microchip</p>
                </div>

                <div className="pt-2 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bricolage font-extrabold text-white">₹0</span>
                    <span className="text-xs text-white/50 font-medium line-through">₹499</span>
                    <span className="text-xs text-[#FFEBFE] font-bold">Introductory Offer</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                    Free doorstep delivery with custom laser embossing
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs text-white/90">
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-[#CF9CCD] shrink-0" />
                    <span className="font-semibold text-white">Earn upto 3% real cashback on all transactions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-[#CF9CCD] shrink-0" />
                    <span>Zero foreign exchange markup on global transactions</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-[#CF9CCD] shrink-0" />
                    <span>Laser-embossed personalized card face</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-[#CF9CCD] shrink-0" />
                    <span>Complimentary airport lounge & dining pass</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-[#CF9CCD] shrink-0" />
                    <span>24/7 dedicated priority banking assistance</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenDrawer('obsidian')}
                className="w-full mt-8 py-4 rounded-full bg-white text-black font-bold text-xs hover:bg-[#F7F5FF] transition-all shadow-[0_0_24px_rgba(255,255,255,0.4)] active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Customize & Order Obsidian</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* TIER 3: eBanking Infinite Metal */}
            <div className="rounded-[32px] bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-8 flex flex-col justify-between relative hover:border-white/20 transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    Aerospace Steel
                  </span>
                  <Layers size={20} className="text-white/60" />
                </div>

                <div>
                  <h3 className="font-bricolage font-extrabold text-2xl sm:text-3xl text-white">Infinite Metal</h3>
                  <p className="text-xs text-white/60 mt-1">18g heavy solid stainless steel card</p>
                </div>

                <div className="pt-2 pb-4 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bricolage font-extrabold text-white">By Invite</span>
                    <span className="text-xs text-white/50 font-medium">/ High Volume</span>
                  </div>
                  <span className="text-[11px] text-[#CF9CCD] font-semibold block mt-1">
                    Exclusive concierge & global lounge network
                  </span>
                </div>

                <ul className="space-y-3.5 text-xs text-white/80">
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-emerald-400 shrink-0" />
                    <span>Flat 3.5% unlimited rewards on all categories</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-emerald-400 shrink-0" />
                    <span>8 complimentary domestic & international airport lounges</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-emerald-400 shrink-0" />
                    <span>24/7 dedicated lifestyle & travel concierge</span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check size={15} className="text-emerald-400 shrink-0" />
                    <span>₹10 Lakhs cyber fraud & travel insurance</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleOpenDrawer('velvet')}
                className="w-full mt-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all shadow-sm active:scale-95"
              >
                Request Invite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 7. TRANSPARENT FINANCIAL FAQ ACCORDION                                */}
      {/* ===================================================================== */}
      <section id="faq" className="relative w-full py-28 sm:py-36 border-t border-white/[0.08] overflow-hidden bg-black/40">
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#FFEBFE] block">
              Financial Transparency
            </span>
            <h2 className="font-bricolage font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight slice-title-gradient">
              Questions? We have answers.
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed">
              No hidden traps or fine print. Radical clarity is at the core of how eBanking operates.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {[
              {
                q: "How secure are my funds deposited with eBanking?",
                a: "All deposits are held in regulated banking institutions and are insured up to ₹5,00,000 per account holder under the Deposit Insurance and Credit Guarantee Corporation (DICGC), a wholly owned subsidiary of the Reserve Bank of India. Your account data is guarded by bank-grade 256-bit encryption."
              },
              {
                q: "How fast can I open an account and begin transacting?",
                a: "Account onboarding takes under 3 minutes through paperless digital verification. Once verified, your virtual debit card and UPI handle are instantly active, enabling you to receive and send money immediately."
              },
              {
                q: "Are there any hidden account maintenance charges?",
                a: "None. We have zero account opening fees, zero monthly maintenance fees, and zero minimum balance penalties for standard accounts. You only pay for what you use, with total transparency."
              },
              {
                q: "How does the high-yield Fixed Deposit program work?",
                a: "You can lock in rates up to 8.5% APY directly from your dashboard with terms ranging from 3 months to 5 years. Interest compounds annually, and you can liquidate funds early during emergencies directly through your app."
              },
              {
                q: "Can I customize the embossed name and finish on my physical card?",
                a: "Yes. From our Card Studio or drawer checkout, you can choose your finish (Titanium Obsidian, Royal Velvet, or Platinum Frost) and type your name to see a live preview of how it will be laser-etched onto your card before dispatch."
              }
            ].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left gap-4"
                  >
                    <span className="font-bricolage font-bold text-base sm:text-lg text-white">
                      {faq.q}
                    </span>
                    <div className={`p-1.5 rounded-full bg-white/5 text-white/70 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-white/15 text-white' : ''}`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/[0.06]">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 8. ONBOARDING CTA BANNER & COMPREHENSIVE REGULATORY FOOTER             */}
      {/* ===================================================================== */}
      <footer className="relative w-full border-t border-white/[0.08] pt-24 pb-16 bg-[#07080A] overflow-hidden">
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Onboarding Call to Action Banner */}
          <div className="p-8 sm:p-14 rounded-[36px] bg-gradient-to-r from-white/[0.05] to-white/[0.02] backdrop-blur-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 mb-20">
            <div className="space-y-4 max-w-xl text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFEBFE] block">
                Get Started Today
              </span>
              <h3 className="font-bricolage font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Experience modern banking in minutes.
              </h3>
              <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                Complete paperless digital verification and unlock your high-yield savings, instant UPI transfers, and 3D metal card.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
                <Link 
                  to="/register"
                  className="px-6 py-3.5 rounded-full bg-white text-black font-bold text-xs hover:bg-[#F7F5FF] transition-all shadow-lg active:scale-95"
                >
                  Open Free Account
                </Link>
                <Link
                  to="/login"
                  className="px-6 py-3.5 rounded-full bg-white/10 text-white font-bold text-xs hover:bg-white/15 transition-all"
                >
                  Sign In to Banking
                </Link>
              </div>
            </div>

            {/* Quick Feature Metric Box */}
            <div className="p-6 rounded-3xl bg-black/60 border border-white/15 shadow-xl space-y-3 text-center min-w-[220px]">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <ShieldCheck size={24} />
              </div>
              <div className="text-sm font-bold text-white">Bank Grade Protection</div>
              <div className="text-xs text-white/50">Insured up to ₹5 Lakhs by DICGC</div>
              <div className="pt-2 border-t border-white/10 text-[11px] text-[#CF9CCD] font-semibold">
                100% Digital • 0 Paperwork
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-16 border-b border-white/[0.08] text-xs">
            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Banking Services</h4>
              <ul className="space-y-2 text-white/60 font-medium">
                <li><Link to="/accounts" className="hover:text-white transition-colors">Savings & Checking</Link></li>
                <li><Link to="/transfers" className="hover:text-white transition-colors">Instant UPI & Wire</Link></li>
                <li><Link to="/deposits" className="hover:text-white transition-colors">Fixed Deposits (8.5% APY)</Link></li>
                <li><a href="#card-editions" className="hover:text-white transition-colors">3D Metal Cards</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Platform</h4>
              <ul className="space-y-2 text-white/60 font-medium">
                <li><Link to="/ai-chat" className="hover:text-white transition-colors">AI Financial Co-Pilot</Link></li>
                <li><Link to="/dashboard" className="hover:text-white transition-colors">Live Dashboard</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Online Portal</Link></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Digital Onboarding</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Compliance & Legal</h4>
              <ul className="space-y-2 text-white/60 font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Regulatory Disclosures</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Grievance Redressal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">Institutional Trust</h4>
              <p className="text-white/60 leading-relaxed font-normal">
                eBanking Technologies Ltd. partners with scheduled commercial banks regulated by the Reserve Bank of India. Deposits are insured up to ₹5,00,000 under DICGC.
              </p>
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs pt-1">
                <ShieldCheck size={16} />
                <span>256-Bit Bank Grade Encryption</span>
              </div>
            </div>
          </div>

          {/* Bottom Copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
            <p>© {new Date().getFullYear()} eBanking Technologies Ltd. All rights reserved.</p>
            <p className="flex items-center gap-4">
              <span>Next-Generation Autonomous Banking</span>
              <span>•</span>
              <span>Zero Account Fees</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ===================================================================== */}
      {/* 9. MOBILE STICKY CONVERSION BAR                                       */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#0A0D0E]/95 backdrop-blur-2xl border-t border-white/10 px-5 py-3.5 flex items-center justify-between shadow-[0_-10px_35px_rgba(0,0,0,0.85)]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#9067A7] to-[#CF9CCD] p-0.5 flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-[#121417] rounded-[10px] flex items-center justify-center">
                  <CreditCard size={18} className="text-[#FFEBFE]" />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-white leading-tight">eBanking Super Card</div>
                <div className="text-[10px] text-emerald-400 font-medium">₹0 Fee • Instant Approval</div>
              </div>
            </div>

            <button
              onClick={() => handleOpenDrawer('obsidian')}
              className="px-5 py-2.5 rounded-full bg-white text-black font-bold text-xs hover:bg-[#F7F5FF] shadow-lg active:scale-95 transition-all shrink-0"
            >
              Order Card
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 10. SLIDE-OVER CHECKOUT & FINISH CUSTOMIZATION DRAWER                 */}
      {/* ===================================================================== */}
      <CheckoutDrawer
        isOpen={checkoutDrawerOpen}
        onClose={() => setCheckoutDrawerOpen(false)}
        defaultTier={selectedTier}
      />
    </div>
  );
}

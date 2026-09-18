import { useState } from 'react';
import { Outlet, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RiDashboard3Line, 
  RiBankCardLine, 
  RiExchangeDollarLine, 
  RiAddCircleLine, 
  RiHistoryLine, 
  RiRobot2Line, 
  RiShieldCheckLine,
  RiSunLine,
  RiMoonLine,
  RiUser3Line,
  RiLogoutBoxRLine,
  RiMenu4Line,
  RiCloseLine,
  RiArrowDownSLine,
  RiWifiOffLine,
  RiSparklingFill,
  RiCheckboxCircleFill
} from 'react-icons/ri';
import { useAuthStore } from '../../stores/authStore';
import { useUIStore } from '../../stores/uiStore';
import { useBackendHealth } from '../../hooks/useBackendHealth';
import { useLogout } from '../../hooks/useLogout';

const navItems = [
  { to: '/dashboard', icon: RiDashboard3Line, label: 'Dashboard' },
  { to: '/accounts', icon: RiBankCardLine, label: 'Accounts' },
  { to: '/transfers', icon: RiExchangeDollarLine, label: 'Transfers' },
  { to: '/deposits', icon: RiAddCircleLine, label: 'Deposits' },
  { to: '/transactions', icon: RiHistoryLine, label: 'Transactions' },
  { to: '/ai-chat', icon: RiRobot2Line, label: 'AI Assistant', badge: 'AI' },
];

function ThemeToggle() {
  const { theme, setTheme } = useUIStore();
  const dark = theme === 'dark';
  return (
    <button
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-9 h-9 rounded-full border border-border bg-surface-elevated/70 hover:bg-surface-muted flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={dark ? 'dark' : 'light'}
          initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
          transition={{ duration: 0.15 }}
        >
          {dark ? <RiSunLine className="text-amber-400 text-lg" /> : <RiMoonLine className="text-text-primary text-lg" />}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}

function AccountMenu({ onNavigate }: { onNavigate: () => void }) {
  const { user } = useAuthStore();
  const handleLogout = useLogout();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full border border-border bg-surface-elevated/70 pl-1.5 pr-2.5 py-1 hover:border-border-strong hover:bg-surface-muted transition-all cursor-pointer"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#9067A7] to-[#5F3A76] flex items-center justify-center text-white text-xs font-bold shadow-sm">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <span className="hidden md:inline text-xs font-medium text-text-primary max-w-[100px] truncate">
          {user?.name?.split(' ')[0] || 'Account'}
        </span>
        <RiArrowDownSLine className={`text-text-tertiary transition-transform duration-200 text-base ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} aria-hidden="true" />
          <motion.div 
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-68 rounded-2xl border border-border bg-surface-elevated/95 backdrop-blur-md shadow-xl z-50 overflow-hidden"
          >
            <div className="px-4 py-3.5 border-b border-border bg-surface-muted/40">
              <p className="text-sm font-semibold truncate text-text-primary">{user?.name}</p>
              <p className="text-xs text-text-tertiary truncate">{user?.email}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#9067A7]/15 text-[#CF9CCD] border border-[#9067A7]/30">
                  <RiCheckboxCircleFill className="text-[#CF9CCD]" />
                  {user?.role === 'ADMIN' ? 'Administrator' : 'Verified Client'}
                </span>
              </div>
            </div>

            <div className="p-1.5 space-y-0.5">
              <Link
                to="/profile"
                onClick={() => { setOpen(false); onNavigate(); }}
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                <RiUser3Line className="text-base text-text-tertiary" />
                <span>Profile & Privacy Settings</span>
              </Link>
              <button
                onClick={() => { setOpen(false); handleLogout(); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
              >
                <RiLogoutBoxRLine className="text-base" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

export default function Layout() {
  const { user } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const { isOnline, isChecking } = useBackendHealth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';
  const links = isAdmin
    ? [...navItems, { to: '/admin', icon: RiShieldCheckLine, label: 'Admin Portal' }]
    : navItems;
  const closeMobile = () => setMobileOpen(false);

  return (
    <div className="min-h-screen bg-surface flex flex-col antialiased">
      {/* Backend offline warning banner */}
      {!isChecking && !isOnline && (
        <div className="bg-rose-600 text-white text-xs font-medium text-center py-2 px-4 flex items-center justify-center gap-2 shadow-sm">
          <RiWifiOffLine className="text-sm shrink-0" />
          <span>Backend service offline. Please ensure Spring Boot is running on port 8080.</span>
        </div>
      )}

      {/* Modern Top Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <button 
            onClick={() => navigate('/dashboard')} 
            className="flex items-center gap-3 shrink-0 group cursor-pointer focus:outline-none" 
            aria-label="eBanking home"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#9067A7] via-[#7A4F94] to-[#5F3A76] flex items-center justify-center border border-white/20 shadow-[0_2px_10px_rgba(144,103,167,0.35)] group-hover:scale-105 transition-transform duration-200">
              <RiShieldCheckLine className="text-white text-lg" />
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 border border-surface shadow-xs" />
            </div>
            <div className="text-left hidden sm:block">
              <span className="text-base font-bold text-text-primary tracking-tight block leading-tight">eBanking</span>
              <span className="text-[10px] font-medium text-text-tertiary tracking-widest uppercase block">Next-Gen FinTech</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-surface-elevated/60 p-1 rounded-full border border-border/80 shadow-xs" aria-label="Primary">
            {links.map(({ to, icon: Icon, label, badge }) => {
              const isActive = location.pathname === to;
              return (
                <NavLink
                  key={to}
                  to={to}
                  className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-muted/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavTab"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#9067A7] to-[#7A4F94] shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <Icon className={`text-base ${isActive ? 'text-white' : 'text-text-tertiary'}`} />
                    <span>{label}</span>
                    {badge && (
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase flex items-center gap-0.5 ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#9067A7]/15 text-[#CF9CCD] border border-[#9067A7]/30'
                      }`}>
                        <RiSparklingFill className="text-[8px]" />
                        {badge}
                      </span>
                    )}
                  </span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Action Icons: Theme & User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <div className="w-px h-5 bg-border" />
            <AccountMenu onNavigate={closeMobile} />
          </div>

          {/* Mobile Hamburger Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              className="w-9 h-9 rounded-full border border-border bg-surface-elevated flex items-center justify-center text-text-primary cursor-pointer hover:bg-surface-muted transition-colors"
            >
              {mobileOpen ? <RiCloseLine className="text-xl" /> : <RiMenu4Line className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Animated Drawer Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden border-t border-border bg-surface-elevated/95 backdrop-blur-md"
              aria-label="Mobile"
            >
              <div className="px-4 py-3 space-y-1">
                {links.map(({ to, icon: Icon, label, badge }) => {
                  const isActive = location.pathname === to;
                  return (
                    <NavLink
                      key={to}
                      to={to}
                      onClick={closeMobile}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-[#9067A7]/20 to-[#7A4F94]/20 text-[#CF9CCD] font-semibold border border-[#9067A7]/30'
                          : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-lg" />
                        <span>{label}</span>
                      </div>
                      {badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9067A7]/20 text-[#CF9CCD] border border-[#9067A7]/30">
                          {badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
                <div className="pt-2 border-t border-border mt-2">
                  <NavLink
                    to="/profile"
                    onClick={closeMobile}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                  >
                    <RiUser3Line className="text-lg" />
                    <span>Profile & Privacy</span>
                  </NavLink>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-8 flex-1 w-full">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}

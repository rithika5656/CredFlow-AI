import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, FileText, BarChart3, LogOut, Shield, Brain,
  Briefcase, FileSearch, Users, FileCheck2, Bell, History, TrendingUp,
  PanelLeftClose, PanelLeftOpen, ChevronRight
} from 'lucide-react';

const applicantLinks = [
  { to: '/applicant/dashboard', label: 'Dashboard',         icon: LayoutDashboard },
  { to: '/applicant/apply',     label: 'New Application',   icon: FileText },
  { to: '/applicant/applications', label: 'My Applications',icon: BarChart3 },
];

const officerLinks = [
  { to: '/officer/dashboard',       label: 'Dashboard',              icon: LayoutDashboard },
  { to: '/officer/pipeline',        label: 'Loan Pipeline',          icon: Briefcase },
  { to: '/officer/applications',    label: 'Applications',           icon: FileText },
  { to: '/officer/documents',       label: 'Document Intelligence',  icon: FileSearch },
  { to: '/officer/risk-intelligence', label: 'Risk Intelligence',    icon: Brain },
  { to: '/officer/fraud',           label: 'Fraud Detection',        icon: Shield },
  { to: '/officer/whatif',          label: 'What-If Simulator',      icon: TrendingUp },
  { to: '/officer/network',         label: 'Borrower Network',       icon: Users },
  { to: '/officer/cam',             label: 'CAM Reports',            icon: FileCheck2 },
  { to: '/officer/alerts',          label: 'Analytics',              icon: BarChart3 },
  { to: '/officer/logs',            label: 'Notifications',          icon: Bell },
];

/* ── colour tokens ── */
const NAV  = '#050e1f';          // sidebar bg
const MAIN = '#071020';          // main page bg
const CARD = '#0d1c35';          // card surface
const LINE = 'rgba(255,255,255,0.06)';
const BLUE = '#2563eb';
const BLUE_LT = '#3b82f6';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const links = user?.role === 'bank_officer' ? officerLinks : applicantLinks;

  return (
    <div className="min-h-screen flex" style={{ background: MAIN, fontFamily: "'Inter',system-ui,sans-serif" }}>

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="flex flex-col flex-shrink-0 relative transition-all duration-500 z-30"
        style={{ 
          width: collapsed ? 80 : 260, 
          background: `linear-gradient(180deg, ${NAV} 0%, #030a16 100%)`, 
          borderRight: `1px solid ${LINE}`,
          boxShadow: '20px 0 50px rgba(0,0,0,0.2)' 
        }}>

        {/* collapse pill */}
        <button onClick={() => setCollapsed(c => !c)}
          className="absolute -right-3 top-8 z-40 w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ background: BLUE, boxShadow: '0 4px 15px rgba(37,99,235,0.6)' }}>
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-white" /> : <PanelLeftClose className="w-3 h-3 text-white" />}
        </button>

        {/* brand */}
        <div className="flex items-center gap-4 px-6 py-6" style={{ height: 80 }}>
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 group transition-transform duration-500 hover:rotate-[360deg]"
            style={{ 
              background: `linear-gradient(135deg,${BLUE},#4f46e5)`, 
              boxShadow: '0 8px 20px rgba(37,99,235,0.4)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
            <Shield className="w-5.5 h-5.5 text-white" />
          </div>
          {!collapsed && (
            <div className="animate-in fade-in slide-in-from-left-2 duration-500">
              <p className="text-lg font-black text-white leading-none tracking-tighter uppercase">Intelli-Credit</p>
              <p className="text-[9px] font-black tracking-[0.3em] uppercase mt-1.5 opacity-40 text-blue-400">Underwriting OS</p>
            </div>
          )}
        </div>

        {/* nav */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {!collapsed && (
            <p className="px-4 pb-3 text-[9px] font-black tracking-[0.3em] uppercase opacity-20 text-white">Main Deck</p>
          )}
          {links.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} title={collapsed ? label : undefined}
                className="flex items-center gap-4 rounded-2xl transition-all duration-300 relative group"
                style={{
                  padding: collapsed ? '0.8rem 0' : '0.75rem 1rem',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: active ? 'rgba(37,99,235,0.1)' : 'transparent',
                  border: active ? '1px solid rgba(37,99,235,0.2)' : '1px solid transparent',
                }}
              >
                {active && (
                  <div className="absolute left-0 w-1 h-5 bg-blue-500 rounded-r-full shadow-[4px_0_15px_rgba(37,99,235,1)]" />
                )}
                <Icon style={{ 
                  width: 18, height: 18, 
                  color: active ? '#60a5fa' : '#4b5563', 
                  flexShrink: 0,
                  transition: 'all 0.3s'
                }} className={active ? 'drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'group-hover:text-blue-400'} />
                {!collapsed && (
                  <span className={`text-[13px] font-black uppercase tracking-widest transition-colors duration-300 ${active ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`}>
                    {label}
                  </span>
                )}
                {!collapsed && active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_#2563eb]" />}
              </Link>
            );
          })}
        </nav>

        {/* user footer */}
        <div className="px-4 pb-8 pt-4" style={{ borderTop: `1px solid ${LINE}` }}>
          {!collapsed && (
            <div className="flex items-center gap-4 px-4 py-4 rounded-[24px] mb-4 group transition-all"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xl border border-white/10"
                style={{ background: `linear-gradient(135deg,${BLUE},#1e40af)` }}>
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black text-white truncate leading-tight tracking-tight uppercase">{user?.full_name}</p>
                <p className="text-[9px] tracking-[0.25em] font-black uppercase mt-1 opacity-40 text-blue-400">
                  {user?.role === 'bank_officer' ? 'Strategic Lead' : 'Partner'}
                </p>
              </div>
            </div>
          )}
          <button onClick={() => { logout(); navigate('/login'); }} title={collapsed ? 'Sign Out' : undefined}
            className="flex items-center gap-4 w-full rounded-2xl px-4 py-3 transition-all group"
            style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <LogOut className="w-4.5 h-4.5 shrink-0 transition-colors text-slate-600 group-hover:text-red-400" />
            {!collapsed && <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 group-hover:text-red-400">System Exit</span>}
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN AREA ══════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* top bar */}
        <header className="flex items-center justify-between px-10 py-4 shrink-0 shadow-lg relative z-20"
          style={{ background: '#050e1f', borderBottom: `1px solid ${LINE}`, height: 80 }}>
          <div className="flex items-center gap-4">
             <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_#2563eb]" />
             <p className="text-[10px] font-black tracking-[0.4em] uppercase text-white opacity-40">
               Operational Core · Live Sequence
             </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group p-2 cursor-pointer rounded-xl hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-500 border-2"
                style={{ borderColor: '#050e1f' }}></span>
            </div>
            <div className="h-8 w-[1px] bg-white/5" />
            <div className="flex items-center gap-4">
               {!collapsed && (
                 <div className="text-right hidden sm:block">
                   <p className="text-[11px] font-black text-white uppercase tracking-tight">{user?.full_name}</p>
                   <p className="text-[9px] font-black uppercase text-blue-500 tracking-widest">Authorized Session</p>
                 </div>
               )}
               <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black text-white border border-white/10 shadow-2xl transition-transform hover:scale-110 active:scale-95 cursor-pointer"
                style={{ background: `linear-gradient(135deg,${BLUE},#1e40af)` }}>
                {user?.full_name?.charAt(0) || 'U'}
               </div>
            </div>
          </div>
        </header>

        {/* scrollable page body */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-10 custom-scrollbar relative" style={{ background: MAIN }}>
          {/* Subtle radial glow background for depth */}
          <div className="absolute top-0 left-0 w-full h-[800px] pointer-events-none opacity-20" 
            style={{ background: 'radial-gradient(circle at 50% 0%, #1e40af 0%, transparent 70%)' }} />
          
          <div className="max-w-screen-2xl mx-auto relative z-10">{children}</div>
        </main>
      </div>
    </div>
  );
}

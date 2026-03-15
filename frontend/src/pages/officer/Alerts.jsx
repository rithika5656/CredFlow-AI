import React from 'react';
import Layout from '../../components/Layout';
import { Bell, ShieldAlert, BadgeDollarSign, CreditCard, Activity, Clock, MoreVertical } from 'lucide-react';

const alerts = [
  { id: 1, type: 'critical', title: 'Suspicious Document Alert', desc: 'Application #942 contains a potentially forged GST certificate. OCR Verification score: 12%. Immediate officer review required.', time: '10 mins ago', icon: ShieldAlert },
  { id: 2, type: 'warning', title: 'Large Exposure Limit Approaching', desc: 'Real Estate sector portfolio exposure is currently at 18%, nearing the 20% systemic compliance limit.', time: '1 hour ago', icon: Activity },
  { id: 3, type: 'success', title: 'High-Value Loan Approved', desc: 'Application #938 (₹5.5Cr) has been successfully disbursed by the treasury department following risk clearance.', time: '3 hours ago', icon: BadgeDollarSign },
  { id: 4, type: 'info', title: 'Bureau Report Updated', desc: 'CIBIL report for Nexus Corp is now available. System risk score has increased by 15 points based on trend.', time: 'Yesterday', icon: CreditCard },
];

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

export default function Alerts() {
  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-8 h-8 text-amber-500 fill-amber-500/10" />
            <h1 className="text-3xl font-black text-white tracking-tight">Systemic Operations Hub</h1>
          </div>
          <p style={{ color: MUTED }} className="font-medium text-sm">Real-time systemic notifications, compliance warnings, and credit workflow updates.</p>
        </div>
        <button className="px-6 py-2.5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-xl hover:bg-white/10 transition-all">
          Acknowledge All
        </button>
      </div>

      <div className="space-y-4 max-w-5xl">
        {alerts.map((alert) => {
          const Icon = alert.icon;
          const colorMap = {
            critical: { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    glow: 'rgba(239,68,68,0.2)' },
            warning:  { text: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/30',  glow: 'rgba(245,158,11,0.2)' },
            success:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  glow: 'rgba(16,185,129,0.2)' },
            info:     { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   glow: 'rgba(37,99,235,0.2)' },
          };
          const style = colorMap[alert.type];
          
          return (
            <div key={alert.id} className="group p-6 rounded-3xl transition-all duration-300 relative border overflow-hidden hover:scale-[1.01] hover:shadow-2xl"
              style={{ background: CARD, border: `1px solid ${LINE}` }}>
              
              {/* status glow */}
              <div className="absolute left-0 top-0 w-1 h-full" style={{ background: style.glow.replace('0.2','0.8') }} />

              <div className="flex items-start gap-6 relative z-10">
                <div className={`p-3.5 rounded-2xl border ${style.bg} ${style.border} ${style.text} group-hover:scale-110 transition-transform shadow-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-white text-base uppercase tracking-tight">{alert.title}</h3>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }}>
                        <Clock className="w-3.5 h-3.5" /> {alert.time}
                      </span>
                      <button className="text-white/20 hover:text-white transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-sm font-medium leading-relaxed max-w-2xl" style={{ color: MUTED }}>{alert.desc}</p>
                  
                  <div className="mt-5 flex items-center gap-6">
                    <button className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-colors underline-offset-4 hover:underline">
                      Investigate Origin
                    </button>
                    <button className="text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = DIM}>
                      Dismiss Record
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

import React from 'react';
import Layout from '../../components/Layout';
import { Users, AlertTriangle, ShieldAlert, Fingerprint } from 'lucide-react';

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(0,0,0,0.08)';
const CARD_DARK = '#0d1c35';

export default function BorrowerNetwork() {
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Users className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-black text-white tracking-tight uppercase">Borrower Network Analysis</h1>
        </div>
        <p style={{ color: MUTED }} className="font-medium text-sm ml-1">AI-powered forensic visualization of hidden entity relationships and risk chains.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 rounded-[40px] p-2 relative h-[650px] overflow-hidden flex items-center justify-center shadow-2xl transition-all duration-500"
          style={{ background: '#ffffff', border: `1px solid #e2e8f0` }}>
          
          {/* subtle Grid Background for white theme */}
          <div className="absolute inset-0 opacity-40" 
            style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          {/* Graph using SVG */}
          <svg className="absolute inset-0 w-full h-full relative z-10">
            <defs>
              <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.1)"/>
              </filter>
              <filter id="glowBlue">
                <feGaussianBlur stdDeviation="3" result="blur"/>
                <feMerge>
                    <feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Edges */}
            <line x1="30%" y1="40%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="3" />
            <line x1="70%" y1="30%" x2="50%" y2="50%" stroke="#e2e8f0" strokeWidth="3" />
            <line x1="50%" y1="50%" x2="40%" y2="80%" stroke="#ef4444" strokeWidth="2" strokeDasharray="8,6" opacity="0.4" />
            <line x1="50%" y1="50%" x2="65%" y2="70%" stroke="#e2e8f0" strokeWidth="3" />
            
            {/* Main Node */}
            <circle cx="50%" cy="50%" r="40" fill="#2563eb" stroke="#ffffff" strokeWidth="4" filter="url(#nodeShadow)" />
            <text x="50%" y="45" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="900" style={{ textTransform: 'uppercase' }}>TechVision</text>
            <text x="50%" y="54%" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="black" tracking="1px">TARGET</text>

            {/* Sub Nodes */}
            <circle cx="30%" cy="40%" r="25" fill="#0d1c35" stroke="#ffffff" strokeWidth="3" filter="url(#nodeShadow)" />
            <text x="30%" y="35%" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="900" style={{ textTransform: 'uppercase' }}>Director A</text>
            <text x="30%" y="42%" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">MGMT</text>
            
            <circle cx="70%" cy="30%" r="30" fill="#1e293b" stroke="#ffffff" strokeWidth="3" filter="url(#nodeShadow)" />
            <text x="70%" y="24%" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="900" style={{ textTransform: 'uppercase' }}>Parent Co.</text>
            <text x="70%" y="32%" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">HOLDING</text>
            
            <circle cx="65%" cy="70%" r="24" fill="#334155" stroke="#ffffff" strokeWidth="3" filter="url(#nodeShadow)" />
            <text x="65%" y="64%" textAnchor="middle" fill="#1e293b" fontSize="9" fontWeight="900" style={{ textTransform: 'uppercase' }}>Guarantor</text>
            <text x="65%" y="72%" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">SECURE</text>

            {/* High Risk Node */}
            <circle cx="40%" cy="80%" r="35" fill="rgba(239,68,68,0.1)" stroke="#ef4444" strokeWidth="3" filter="url(#nodeShadow)" />
            <circle cx="40%" cy="80%" r="5" fill="#ef4444" className="animate-pulse" />
            <text x="40%" y="74%" textAnchor="middle" fill="#1e293b" fontSize="10" fontWeight="900">NEXUS CORP</text>
            <text x="40%" y="85%" textAnchor="middle" fill="#ef4444" fontSize="9" fontWeight="black" opacity="0.9">DEFAULTER</text>
          </svg>
          
          {/* Legend */}
          <div className="absolute top-8 left-8 p-6 rounded-[32px] shadow-2xl z-20 backdrop-blur-xl" 
            style={{ background: 'rgba(255,255,255,0.9)', border: `1px solid #e2e8f0` }}>
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-800 tracking-widest">
                 <div className="w-3.5 h-3.5 rounded-full bg-blue-600 shadow-lg" /> Target Core
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-800 tracking-widest">
                 <div className="w-3.5 h-3.5 rounded-full bg-slate-800 shadow-md" /> Affiliate
               </div>
               <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-800 tracking-widest">
                 <div className="w-3.5 h-3.5 rounded-full bg-red-500 shadow-lg animate-pulse" /> Threat Node
               </div>
            </div>
          </div>

          <div className="absolute bottom-8 right-8 px-6 py-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-20">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Nodes Synced: 42</p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-[32px] p-8 relative overflow-hidden shadow-2xl" 
            style={{ background: CARD_DARK, border: `1px solid ${LINE}`, borderLeft: '6px solid #ef4444' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <ShieldAlert className="text-red-500 w-6 h-6" />
              </div>
              <h3 className="font-black text-white uppercase tracking-[0.2em] text-[10px]">Intelligence Alert</h3>
            </div>
            <p className="text-sm font-medium leading-relaxed" style={{ color: MUTED }}>
              <span className="text-white font-black tracking-tight uppercase">TechVision Inc</span> demonstrates high-relational proximity to <span className="text-red-400 font-black uppercase">Nexus Corp</span> (Defaulted).
            </p>
            <div className="mt-6 flex gap-2">
               <div className="flex-1 h-1 bg-red-500 rounded-full" />
               <div className="flex-1 h-1 bg-red-500/20 rounded-full" />
               <div className="flex-1 h-1 bg-red-500/20 rounded-full" />
            </div>
            <button className="w-full mt-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all bg-red-500 text-white shadow-xl hover:scale-105 active:scale-95">
              Deep Trace Chain
            </button>
          </div>

          <div className="rounded-[32px] p-8 shadow-2xl" style={{ background: CARD_DARK, border: `1px solid ${LINE}` }}>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 flex items-center gap-3 opacity-40 text-white">
              <Fingerprint className="w-4 h-4 text-blue-400" /> Forensic Metrics
            </h3>
            <ul className="space-y-6">
              {[
                { l: 'Network Entities', v: '42' },
                { l: 'Adjacency Degree', v: '3nd' },
                { l: 'Internal Loops', v: '02' },
                { l: 'Shared Identity', v: '01', bad: true }
              ].map((item, idx) => (
                <li key={idx} className="flex justify-between items-center group">
                  <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: MUTED }}>{item.l}</span>
                  <span className={`text-xs font-black px-4 py-1.5 rounded-xl bg-white/5 border border-white/5 ${item.bad ? 'text-red-400' : 'text-white'}`}>
                    {item.v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { ShieldAlert, AlertTriangle, ShieldCheck, Search, Filter, Shield, Activity } from 'lucide-react';

const mockFrauds = [
  { id: 'FR-1049', type: 'Identity Theft', applicant: 'Rahul Sharma', severity: 'High', status: 'Under Investigation', match: '98%', date: '2026-03-14' },
  { id: 'FR-1048', type: 'Document Forgery', applicant: 'TechVision Inc', severity: 'Critical', status: 'Blocked', match: '99%', date: '2026-03-13' },
  { id: 'FR-1045', type: 'Synthetic Identity', applicant: 'Priya Desai', severity: 'Medium', status: 'Flagged', match: '75%', date: '2026-03-12' },
  { id: 'FR-1042', type: 'Income Exaggeration', applicant: 'Nexus Corp', severity: 'High', status: 'Under Investigation', match: '88%', date: '2026-03-10' },
];

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';

export default function FraudDetection() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <ShieldAlert className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-black text-white tracking-tight">Fraud Detection Network</h1>
        </div>
        <p style={{ color: MUTED }} className="font-medium text-sm">Real-time AI monitoring for identity, document, and transactional fraud indicators.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Critical Alerts', val: '12', icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
          { label: 'Suspicious Flags', val: '34', icon: Shield, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
          { label: 'Prevented Loss', val: '₹ 8.5Cr', icon: ShieldCheck, color: '#10b981', bg: 'rgba(16,185,129,0.1)' }
        ].map((item, idx) => (
          <div key={idx} className="rounded-2xl p-6 relative overflow-hidden" 
            style={{ background: '#0d1c35', border: `1px solid ${LINE}`, borderLeft: `4px solid ${item.color}`, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <div className="flex items-center gap-5 relative z-10">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5" style={{ background: item.bg }}>
                <item.icon className="w-6 h-6" style={{ color: item.color }} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: DIM }}>{item.label}</p>
                <h3 className="text-2xl font-black text-white">{item.val}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: '#0d1c35', border: `1px solid ${LINE}`, boxShadow: '0 4px 25px rgba(0,0,0,0.4)' }}>
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
          <h2 className="text-base font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-500" /> Recent Investigative Hits
          </h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
              <input 
                type="text" 
                placeholder="Search cases..." 
                className="pl-10 pr-4 py-2 text-sm font-bold rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = LINE}
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="border-b border-white/5">
                {['Case ID', 'Applicant Entity', 'Fraud Type', 'Confidence', 'Date', 'Status'].map(h => (
                   <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockFrauds.filter(f => f.applicant.toLowerCase().includes(searchTerm.toLowerCase())).map((fraud) => (
                <tr key={fraud.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs font-bold text-blue-400">{fraud.id}</td>
                  <td className="px-6 py-4 font-black text-sm text-white">{fraud.applicant}</td>
                  <td className="px-6 py-4 text-xs font-bold text-white flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" /> {fraud.type}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/30">
                      {fraud.match} Match
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold font-mono" style={{ color: MUTED }}>{fraud.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-lg border ${
                      fraud.status === 'Blocked' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 
                      fraud.status === 'Flagged' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' : 
                      'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}>
                      {fraud.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

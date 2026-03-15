import React from 'react';
import Layout from '../../components/Layout';
import { History, UserCheck, FileText, CheckCircle2, ShieldCheck, Search, Filter } from 'lucide-react';

const mockLogs = [
  { id: 'LOG-449', user: 'Admin Officer', action: 'Approved Application #941', ip: '192.168.1.104', time: '10:45 AM, Today', icon: CheckCircle2, success: true },
  { id: 'LOG-448', user: 'Risk Analyst', action: 'Requested Document Re-verification for #942', ip: '192.168.1.55', time: '09:30 AM, Today', icon: FileText, success: true },
  { id: 'LOG-447', user: 'Admin Officer', action: 'Generated CAM Report for TechVision Inc', ip: '192.168.1.104', time: 'Yesterday', icon: FileText, success: true },
  { id: 'LOG-446', user: 'System', action: 'Ran Automated KYC check on batch 44', ip: 'Internal', time: 'Yesterday', icon: ShieldCheck, success: true },
  { id: 'LOG-445', user: 'Admin Officer', action: 'Logged In Successfully', ip: '192.168.1.104', time: 'Yesterday', icon: UserCheck, success: true },
];

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

export default function ActivityLogs() {
  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <History className="w-8 h-8 text-teal-400" />
          <h1 className="text-3xl font-black text-white tracking-tight">Audit Trail & Logs</h1>
        </div>
        <p style={{ color: MUTED }} className="font-medium text-sm">Immutable ledger of all actions performed by officers and systemic agents on the platform.</p>
      </div>

      <div className="rounded-3xl overflow-hidden shadow-2xl" 
        style={{ background: CARD, border: `1px solid ${LINE}`, boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}>
        
        <div className="p-6 bg-white/5 border-b border-white/5 flex flex-col sm:flex-row gap-4">
           <div className="relative flex-1">
             <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
             <input 
               type="text" 
               placeholder="Search by officer, action, or context..." 
               className="w-full pl-10 pr-4 py-2.5 text-sm font-bold rounded-xl outline-none transition-all"
               style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
               onFocus={e => e.target.style.borderColor = '#2563eb'}
               onBlur={e => e.target.style.borderColor = LINE}
             />
           </div>
           <div className="relative">
             <Filter className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
             <input 
               type="date" 
               className="pl-10 pr-4 py-2.5 text-sm font-bold rounded-xl outline-none"
               style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
             />
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-white/2">
                {['Timestamp', 'Strategic Actor', 'Activity Detail', 'IP/Origin'].map(h => (
                   <th key={h} className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: DIM }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {mockLogs.map((log) => {
                const Icon = log.icon;
                return (
                  <tr key={log.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-5 text-sm font-bold font-mono" style={{ color: MUTED }}>{log.time}</td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-widest border border-blue-500/20 shadow-lg">
                        {log.user}
                      </span>
                    </td>
                    <td className="px-8 py-5 flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                        <Icon className="w-4 h-4 text-white/40 group-hover:text-blue-400" />
                      </div>
                      <span className="text-sm font-black text-white uppercase tracking-tight">{log.action}</span>
                    </td>
                    <td className="px-8 py-5 text-[10px] font-black font-mono tracking-tighter" style={{ color: DIM }}>{log.ip}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

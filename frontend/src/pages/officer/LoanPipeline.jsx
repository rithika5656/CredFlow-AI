import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { getAllApplications } from '../../services/api';
import { LoadingSpinner, formatCurrency } from '../../components/UI';
import { Briefcase, ChevronRight, Clock, ShieldAlert, CheckCircle2, Clock3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

export default function LoanPipeline() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllApplications()
      .then(res => setApps(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  const columns = [
    { id: 'submitted', title: 'Intake Logic', icon: Clock3, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' },
    { id: 'under_review', title: 'AI Analysis', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    { id: 'approved', title: 'Funded Assets', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' },
    { id: 'rejected', title: 'Risk Terminated', icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' }
  ];

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight uppercase flex items-center gap-4">
          <Briefcase className="w-10 h-10 text-blue-500" /> Operational Pipeline
        </h1>
        <p style={{ color: MUTED }} className="mt-2 text-sm font-medium ml-1">Strategic overview of kinetic asset flow through the credit underwriting lifecycle.</p>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-8 min-h-[70vh] snap-x scrollbar-hide">
        {columns.map(col => {
          const colApps = apps.filter(app => app.status === col.id);
          const ColIcon = col.icon;
          return (
            <div key={col.id} className="flex-none w-85 flex flex-col rounded-[32px] overflow-hidden snap-center transition-all shadow-2xl"
              style={{ background: CARD, border: `1px solid ${LINE}` }}>
              
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
                <div className="flex items-center gap-3 font-black text-[11px] uppercase tracking-[0.2em] text-white">
                  <div className={`p-2.5 rounded-xl border ${col.bg} ${col.border}`}>
                    <ColIcon className={`w-5 h-5 ${col.color}`} />
                  </div>
                  {col.title}
                </div>
                <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black text-blue-400 shadow-xl">
                  {colApps.length}
                </div>
              </div>

              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                {colApps.map(app => (
                   <div key={app.id} className="group p-5 rounded-2xl transition-all duration-300 relative border border-white/5 bg-white/2 hover:bg-white/5 hover:border-blue-500/30 hover:-translate-y-1 shadow-sm">
                     <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="w-4 h-4 text-blue-400" />
                     </div>
                     
                     <div className="flex justify-between items-start mb-4">
                        <span className="text-[10px] font-black tracking-widest uppercase opacity-20 text-white font-mono group-hover:opacity-40 transition-opacity">#{app.id}</span>
                        <div className={`px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest 
                          ${app.risk_score >= 70 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                            app.risk_score >= 40 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                            app.risk_score ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                            'bg-white/5 text-white/30 border-white/5'}`}>
                          Risk: {app.risk_score || 'N/A'}
                        </div>
                     </div>

                     <h3 className="font-black text-white text-base leading-tight uppercase tracking-tight mb-1">{app.company_name}</h3>
                     <p className="text-[10px] font-bold uppercase tracking-wider mb-5" style={{ color: DIM }}>{app.industry_sector}</p>
                     
                     <div className="flex items-end justify-between">
                        <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] font-black font-mono shadow-lg">
                           {formatCurrency(app.requested_loan_amount)}
                        </div>
                        <div className="p-2 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-all">
                           <ShieldAlert className="w-3.5 h-3.5 text-blue-400" />
                        </div>
                     </div>
                     
                     <Link to={`/officer/applications/${app.id}`} className="absolute inset-0 z-10" />
                   </div>
                ))}

                {colApps.length === 0 && (
                  <div className="h-40 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl opacity-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em]">Queue Idle</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Layout>
  );
}

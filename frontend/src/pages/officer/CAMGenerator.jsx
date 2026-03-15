import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { FileCheck2, Download, Printer, Settings, RefreshCcw, FileText, CheckCircle2, Zap } from 'lucide-react';

const mockReports = [
  { id: 'CAM-941', appName: 'TechVision Inc', type: 'Comprehensive', status: 'Generated', date: '2 hours ago' },
  { id: 'CAM-940', appName: 'Global Logistics', type: 'Summary', status: 'Generating...', date: 'Just now' },
  { id: 'CAM-938', appName: 'Apex Construct', type: 'Comprehensive', status: 'Generated', date: 'Yesterday' },
];

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

export default function CAMGenerator() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const generate = () => {
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FileCheck2 className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-black text-white tracking-tight">Credit Appraisal Memo Engine</h1>
        </div>
        <p style={{ color: MUTED }} className="font-medium text-sm">Instantly generate deeply analytical Credit Appraisal Memos (CAM) from unified application datasets.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-3xl p-8 border-t-4 border-blue-600 relative overflow-hidden shadow-2xl"
          style={{ background: CARD, border: `1px solid ${LINE}`, borderTop: '4px solid #2563eb' }}>
          
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] mb-8 flex items-center gap-2" style={{ color: DIM }}>
            <Settings className="w-4 h-4" /> Report Configuration
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: DIM }}>Application Ref ID</label>
              <input 
                type="text" 
                placeholder="Enter ID (e.g. 1)" 
                className="w-full px-4 py-3 text-sm font-bold rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = LINE}
              />
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: DIM }}>Strategic Format</label>
              <select 
                className="w-full px-4 py-3 text-sm font-bold rounded-xl outline-none appearance-none cursor-pointer"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
              >
                <option style={{ background: '#0d1c35' }}>Comprehensive (Full Analysis + Appendices)</option>
                <option style={{ background: '#0d1c35' }}>Executive Summary (Top Management)</option>
                <option style={{ background: '#0d1c35' }}>Risk Matrix Only</option>
              </select>
            </div>

            <div className="pt-4 flex gap-4">
              <button 
                onClick={generate} 
                disabled={loading}
                className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] text-white rounded-2xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', boxShadow: '0 8px 30px rgba(37,99,235,0.4)' }}
              >
                {loading ? <RefreshCcw className="w-4 h-4 animate-spin text-white" /> : <Zap className="w-4 h-4 fill-white/20" />}
                {loading ? 'Synthesizing Intelligence...' : 'Generate New CAM'}
              </button>
            </div>

            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 text-green-400 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                CAM successfully generated! Available in the vault below.
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-[10px] font-black uppercase tracking-[0.25em] mb-8 flex items-center gap-2" style={{ color: DIM }}>
            <FileText className="w-4 h-4" /> Global CAM Repository
          </h2>
          <div className="space-y-4">
            {mockReports.map((rp) => (
              <div key={rp.id} className="p-5 rounded-2xl flex items-center justify-between border transition-all hover:bg-white/2 group"
                style={{ background: CARD, border: `1px solid ${LINE}` }}>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl border ${rp.status === 'Generated' ? 'bg-blue-500/10 border-blue-500/30 text-blue-400' : 'bg-white/5 border-white/10 text-white/20'}`}>
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-sm tracking-tight group-hover:text-blue-400 transition-colors uppercase">{rp.appName} <span className="text-white/20 font-mono text-[10px]">#{rp.id}</span></h4>
                    <p className="text-[10px] font-bold mt-1 uppercase tracking-widest" style={{ color: MUTED }}>{rp.type} · {rp.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {rp.status === 'Generated' ? (
                    <>
                      <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all">
                        <Download className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-2.5 text-white/40 hover:text-white hover:bg-white/5 rounded-xl border border-transparent hover:border-white/10 transition-all">
                        <Printer className="w-4.5 h-4.5" />
                      </button>
                    </>
                  ) : (
                    <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-lg animate-pulse">Running OCR</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

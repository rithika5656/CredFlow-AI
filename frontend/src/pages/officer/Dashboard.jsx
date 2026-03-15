import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboardStats, getAllApplications } from '../../services/api';
import Layout from '../../components/Layout';
import { LoadingSpinner, formatCurrency, StatusBadge, RiskBadge } from '../../components/UI';
import {
  FileText, Activity, ShieldAlert, CheckCircle2,
  Clock, ArrowUpRight, ArrowDownRight, Briefcase, ChevronRight, Zap
} from 'lucide-react';

/* ── design tokens ─────────────────────────────────────────────────────────── */
const BLUE  = '#2563eb';
const BLUE2 = '#3b82f6';
const TEXT  = '#ffffff';
const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';

/* ── charts ────────────────────────────────────────────────────────────── */
const LineChartSVG = () => (
  <svg viewBox="0 0 420 130" className="w-full h-40 overflow-visible">
    <defs>
      <linearGradient id="lg1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={BLUE2} stopOpacity="0.4" />
        <stop offset="100%" stopColor={BLUE2} stopOpacity="0" />
      </linearGradient>
    </defs>
    {[25,65,100].map(y => (
      <line key={y} x1="0" y1={y} x2="420" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="8,8" />
    ))}
    <path d="M0 110 C60 96,110 52,160 66 C210 80,260 34,310 40 C360 46,390 16,420 6 L420 130 L0 130Z" fill="url(#lg1)" />
    <path d="M0 110 C60 96,110 52,160 66 C210 80,260 34,310 40 C360 46,390 16,420 6" fill="none" stroke={BLUE} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const BarChartSVG = () => (
  <svg viewBox="0 0 220 110" className="w-full h-32">
    {[['#1e3a6e',72,48],['#2a5298',44,76],['#2563eb',12,108],['#3b82f6',56,64]].map(([fill,y,h],i) => (
      <rect key={i} x={20+i*48} y={y} width="32" height={h} fill={fill} rx="8" />
    ))}
  </svg>
);

const GaugeSVG = ({ value = 12.4 }) => {
  const pct = Math.min(value / 100, 1);
  const r = 75, cx = 100, cy = 100;
  const arc = pct * Math.PI;
  const x = cx + r * Math.cos(Math.PI - arc);
  const y = cy - r * Math.sin(Math.PI - arc);
  return (
    <svg viewBox="0 20 200 80" className="w-full max-w-[220px] h-32 mx-auto overflow-visible">
      <path d={`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${cx+r} ${cy}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="18" strokeLinecap="round" />
      <path d={`M${cx-r} ${cy} A${r} ${r} 0 0 1 ${x} ${y}`} fill="none" stroke={BLUE} strokeWidth="18" strokeLinecap="round" />
      <text x={cx} y={cy-15} textAnchor="middle" fill={TEXT} fontSize="24" fontWeight="900" className="font-mono tracking-tighter">{value}%</text>
      <text x={cx} y={cy} textAnchor="middle" fill={MUTED} fontSize="8" fontWeight="black" className="uppercase tracking-[0.2em]">Loss Index</text>
    </svg>
  );
};

/* ── KPI Card ──────────────────────────────────────────────────────────── */
const KPICard = ({ title, value, trend, icon: Icon, accent }) => (
  <div className="card group p-8 flex flex-col gap-6 relative overflow-hidden">
    <div className={`absolute top-0 right-0 w-32 h-32 blur-[80px] opacity-10 transition-opacity group-hover:opacity-20`} style={{ background: accent }} />
    <div className="flex justify-between items-start">
      <div className="p-4 rounded-2xl border transition-all" style={{ background: `${accent}15`, borderColor: `${accent}30` }}>
        <Icon className="w-6 h-6" style={{ color: accent }} />
      </div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 shadow-xl">
         <Zap className="w-3 h-3 text-amber-400" />
         <span className="text-[10px] font-black text-white font-mono">{trend}</span>
      </div>
    </div>
    <div>
      <h3 className="text-4xl font-black tracking-tighter text-white uppercase">{value}</h3>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-3" style={{ color: MUTED }}>{title}</p>
    </div>
  </div>
);

/* ── main ──────────────────────────────────────────────────────────────── */
export default function OfficerDashboard() {
  const [stats, setStats]   = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getAllApplications()])
      .then(([s, a]) => { setStats(s.data); setRecent(a.data.slice(0, 8)); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><LoadingSpinner /></Layout>;

  return (
    <Layout>
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-[2px] bg-blue-500 rounded-full" />
             <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-blue-400">Tactical Control Center</p>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">Operational <br/> Intelligence</h1>
          <p className="text-sm font-medium mt-4 max-w-xl leading-relaxed" style={{ color: MUTED }}>
            Strategic orchestration of institutional credit risk. Monitor global intake, analyze systemic stability, and authorize capital deployments.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all border border-white/5 bg-white/2 text-white hover:bg-white/5 hover:border-white/10 shadow-2xl">
            Export Audit
          </button>
          <button className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl"
            style={{ background: `linear-gradient(135deg,${BLUE},#1e40af)`, boxShadow: '0 15px 35px rgba(37,99,235,0.4)' }}>
            Compose Memo
          </button>
        </div>
      </div>

      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <KPICard title="Total Intake"    value={stats.total_applications} trend="+14%" icon={Briefcase}    accent={BLUE}    />
            <KPICard title="Funding Ready"   value={stats.approved}           trend="+5.2" icon={CheckCircle2} accent="#10b981"  />
            <KPICard title="Risk Signals"    value={stats.high_risk}          trend="-2.1" icon={ShieldAlert} accent="#ef4444" />
            <KPICard title="Active Review"   value={stats.under_review}       trend="+8.0" icon={Clock}        accent="#f59e0b"  />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 card p-10 flex flex-col justify-between">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Capital Velocity Trend</h3>
                  <p className="text-[10px] font-black mt-2 uppercase tracking-widest" style={{ color: DIM }}>Institutional volume · 30D projection</p>
                </div>
                <div className="text-right">
                   <p className="text-3xl font-black text-white font-mono tracking-tighter">₹ 14.2Cr</p>
                   <p className="text-[9px] font-black text-green-400 uppercase tracking-widest">+12.4% ADJ.</p>
                </div>
              </div>
              <LineChartSVG />
              <div className="flex justify-between mt-8 px-2 border-t border-white/5 pt-6">
                {['JAN','FEB','MAR','APR','MAY','JUN','JUL'].map(m => (
                  <span key={m} className="text-[9px] font-black tracking-[0.2em] opacity-30 text-white">{m}</span>
                ))}
              </div>
            </div>

            <div className="card p-10 flex flex-col justify-between">
              <div>
                <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em] mb-2">Exposure Profile</h3>
                <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }}>Asset distribution by risk tier</p>
              </div>
              <div className="my-10"><BarChartSVG /></div>
              <div className="flex justify-between px-2 text-[9px] font-black uppercase tracking-[0.2em] opacity-30 text-white">
                 <span>Low</span><span>Med</span><span>High</span><span>Crit</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="card p-10 flex items-center justify-between gap-10">
              <div className="flex-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 opacity-30 text-white">
                  Sector Concentration
                </h3>
                <div className="space-y-6">
                  {[
                    [BLUE,   'Tech Integration', '45%'],
                    [BLUE2,  'Industrial Hubs',  '30%'],
                    ['#93c5fd','Capital Goods',    '15%'],
                    [DIM,    'Unclassified',     '10%'],
                  ].map(([c,l,v]) => (
                    <div key={l} className="flex items-center justify-between group cursor-pointer">
                      <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                        <div className="w-2.5 h-2.5 rounded-sm shadow-lg shadow-black/40" style={{ background: c }}></div>{l}
                      </div>
                      <span className="text-xs font-black text-white font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="w-40 h-40 shrink-0 relative flex items-center justify-center">
                 <div className="absolute inset-0 border-[16px] border-white/5 rounded-full" />
                 <div className="absolute inset-0 border-[16px] border-blue-500 rounded-full" style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)' }} />
                 <div className="text-center z-10">
                    <p className="text-sm font-black text-white font-mono">100%</p>
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1">Total</p>
                 </div>
              </div>
            </div>

            <div className="card p-10 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Integrity Baseline</h3>
                  <p className="text-[10px] font-black mt-2 uppercase tracking-widest" style={{ color: DIM }}>AI-Synthesized systemic risk</p>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                   <Activity className="w-5 h-5 text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="flex-1 flex items-center pt-4"><GaugeSVG value={12.4} /></div>
            </div>
          </div>
        </>
      )}

      <div className="card overflow-hidden mb-20 shadow-[-20px_20px_60px_rgba(0,0,0,0.5)]">
        <div className="px-10 py-8 flex items-center justify-between bg-white/2 border-b border-white/5">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Operational Sequence</h2>
            <p className="text-[10px] font-black mt-2 uppercase tracking-[0.2em] opacity-30 text-white">Global underwriting priority queue</p>
          </div>
          <Link to="/officer/applications" className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 hover:text-white transition-all">
            Universal View <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-32 text-center opacity-5">
             <Briefcase className="w-20 h-20 mx-auto" />
             <p className="mt-8 text-[11px] font-black uppercase tracking-widest text-white">Queue Empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-white/2" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                  {['Institutional Applicant','Net Exposure','Risk Matrix','Sequence Status',''].map(h => (
                    <th key={h} className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.25em]"
                      style={{ color: DIM }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recent.map(app => (
                  <tr key={app.id} className="group hover:bg-blue-500/2 transition-all cursor-pointer">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xs font-black text-white shrink-0 shadow-2xl transition-transform group-hover:scale-110"
                          style={{ background: `linear-gradient(135deg,${BLUE},#1e40af)`, border: '1px solid rgba(255,255,255,0.1)' }}>
                          {app.company_name?.substring(0,2).toUpperCase() || 'NA'}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors">{app.company_name}</p>
                          <p className="text-[9px] font-black uppercase tracking-widest font-mono opacity-30 text-white mt-1">NODE: {app.id} // {app.industry_sector}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-white font-mono tracking-tighter">
                      {formatCurrency(app.requested_loan_amount)}
                    </td>
                    <td className="px-10 py-6">
                      {app.risk_score ? (
                        <div className="flex flex-col gap-2">
                           <div className="flex items-center justify-between w-32">
                              <span className="text-[10px] font-black text-white font-mono">{app.risk_score}%</span>
                              <span className="text-[8px] font-black text-white/20 uppercase tracking-widest">Score</span>
                           </div>
                           <div className="w-32 h-1.5 rounded-full overflow-hidden bg-white/5 p-0.5 border border-white/5">
                            <div style={{
                              width: `${app.risk_score}%`, height: '100%', borderRadius: 9999,
                              background: app.risk_score >= 70 ? '#10b981' : app.risk_score >= 40 ? '#f59e0b' : '#ef4444',
                              boxShadow: `0 0 10px ${app.risk_score >= 70 ? '#10b981' : app.risk_score >= 40 ? '#f59e0b' : '#ef4444'}50`
                            }} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Awaiting Signal</span>
                      )}
                    </td>
                    <td className="px-10 py-6"><StatusBadge status={app.status} /></td>
                    <td className="px-10 py-6 text-right">
                      <Link to={`/officer/applications/${app.id}`}
                        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-3 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-2xl transition-all hover:scale-105 shadow-2xl active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}>
                        Analyze Entity
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

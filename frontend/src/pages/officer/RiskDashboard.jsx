import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRiskDashboardSummary } from '../../services/api';
import Layout from '../../components/Layout';
import { LoadingSpinner, formatCurrency } from '../../components/UI';
import {
  Brain, TrendingUp, Shield, BarChart3, Target,
  AlertTriangle, ArrowRight, Building2, Zap,
} from 'lucide-react';
import WhatIfSimulator from '../../components/WhatIfSimulator';

const BLUE  = '#2563eb';
const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

function MiniBar({ value, max = 100, color = 'bg-blue-600' }) {
  return (
    <div className="w-full bg-white/5 rounded-full h-2">
      <div className={`h-2 rounded-full ${color} shadow-[0_0_10px_currentColor]`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 75
    ? 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
    : score >= 50
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
      : 'bg-red-500/10 text-red-400 border-red-500/20';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-black font-mono border ${color}`}>{score}</span>;
}

function DecisionBadge({ decision }) {
  const map = {
    Approve: 'bg-green-500/10 text-green-400 border-green-500/20',
    'Conditional Approval': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Reject: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${map[decision] || 'bg-white/5 text-white/40 border-white/5'}`}>
      {decision}
    </span>
  );
}

export default function RiskDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getRiskDashboardSummary()
      .then((res) => setData(res.data))
      .catch(() => setError('Failed to load risk dashboard data.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (error) return <Layout><div className="p-20 text-center text-red-400 font-bold uppercase tracking-widest">{error}</div></Layout>;

  const d = data;

  return (
    <Layout>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-xl">
               <Brain className="h-6 w-6 text-blue-400" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight uppercase">Strategic Risk Intelligence</h1>
          </div>
          <p style={{ color: MUTED }} className="font-medium text-sm ml-1">Aggregate AI diagnostics and forensic risk exposure across the corporate portfolio.</p>
        </div>
      </div>

      {/* TOP: Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {[
          { label: 'Analysed Nodes', value: d.total_analyzed, icon: Target, color: 'text-blue-400' },
          { label: 'Systemic Risk Index', value: d.avg_risk_score, icon: TrendingUp, color: 'text-amber-400', suffix: '/100', bar: true },
          { label: 'Total Portfolio Exposure', value: formatCurrency(d.total_loan_exposure), icon: Shield, color: 'text-blue-400', mono: true }
        ].map((item, i) => (
          <div key={i} className="rounded-3xl p-8 relative overflow-hidden" 
            style={{ background: CARD, border: `1px solid ${LINE}`, boxShadow: '0 15px 40px rgba(0,0,0,0.3)' }}>
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 blur-[50px] pointer-events-none" />
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-xl">
                 <item.icon className={`h-7 w-7 ${item.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black tracking-[0.25em] uppercase mb-1" style={{ color: DIM }}>{item.label}</p>
                <p className={`text-3xl font-black text-white tracking-tighter ${item.mono ? 'font-mono' : ''}`}>
                  {item.value}<span className="text-xs font-bold ml-1" style={{ color: DIM }}>{item.suffix}</span>
                </p>
              </div>
            </div>
            {item.bar && (
              <div className="mt-6">
                <MiniBar value={d.avg_risk_score} color={d.avg_risk_score >= 70 ? 'bg-green-500' : d.avg_risk_score >= 45 ? 'bg-amber-500' : 'bg-red-500'} />
              </div>
            )}
          </div>
        ))}
      </div>

      {d.total_analyzed === 0 ? (
        <div className="rounded-[40px] p-24 text-center flex flex-col items-center" style={{ background: CARD, border: `1px solid ${LINE}` }}>
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8 shadow-2xl">
            <Brain className="h-10 w-10 text-white/10" />
          </div>
          <h3 className="text-2xl font-black text-white mb-3 uppercase tracking-tight">Database Inactive</h3>
          <p className="text-sm font-medium max-w-sm mb-10" style={{ color: MUTED }}>
            No credit intelligence has been generated. Authorize analysis on pending applications to populate this interface.
          </p>
          <Link to="/officer/applications" className="px-10 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl flex items-center gap-3 transition-all hover:scale-105 shadow-2xl"
            style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', boxShadow: '0 8px 30px rgba(37,99,235,0.4)' }}>
            View Pending Queue <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* MIDDLE: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Risk Distribution */}
            <div className="rounded-3xl p-8" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <h3 className="text-[10px] font-black text-white/40 mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
                <BarChart3 className="h-4 w-4 text-blue-400" /> AI Classification Topology
              </h3>
              <div className="space-y-6">
                {Object.entries(d.risk_distribution).map(([key, count]) => {
                  const total = d.total_analyzed;
                  const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                  const barColor = key === 'Approve' ? 'bg-green-500' : key === 'Conditional Approval' ? 'bg-amber-500' : 'bg-red-500';
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-[10px] font-black mb-3">
                        <span className="text-white uppercase tracking-widest">{key}</span>
                        <span className="font-mono" style={{ color: MUTED }}>{count} U <span className="opacity-40">({pct}%)</span></span>
                      </div>
                      <MiniBar value={count} max={total || 1} color={barColor} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Industry Distribution */}
            <div className="rounded-3xl p-8" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <h3 className="text-[10px] font-black text-white/40 mb-10 uppercase tracking-[0.3em] flex items-center gap-3">
                <Building2 className="h-4 w-4 text-blue-400" /> Port-Sector Concentration
              </h3>
              {Object.keys(d.industry_distribution).length === 0 ? (
                <div className="h-48 flex items-center justify-center opacity-10 font-black uppercase tracking-widest text-xs">No Data Signal</div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(d.industry_distribution)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([sector, count]) => (
                      <div key={sector}>
                        <div className="flex items-center justify-between text-[10px] font-black mb-3">
                          <span className="text-white uppercase tracking-widest">{sector}</span>
                          <span className="font-mono" style={{ color: MUTED }}>{count} Nodes</span>
                        </div>
                        <MiniBar value={count} max={d.total_analyzed || 1} color="bg-blue-600" />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Score Histogram */}
            <div className="rounded-[40px] p-10 lg:col-span-2 shadow-2xl" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <h3 className="text-[10px] font-black text-white/40 mb-12 uppercase tracking-[0.3em] flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-blue-400" /> Risk Score Frequency Distribution
              </h3>
              <div className="flex items-end gap-5 h-48 px-4">
                {d.score_histogram.map((bucket) => {
                  const maxCount = Math.max(...d.score_histogram.map((b) => b.count), 1);
                  const height = (bucket.count / maxCount) * 100;
                  const getColor = (range) => {
                    const start = parseInt(range.split('-')[0]);
                    if (start >= 70) return 'linear-gradient(to top, #059669, #10b981)';
                    if (start >= 40) return 'linear-gradient(to top, #d97706, #f59e0b)';
                    return 'linear-gradient(to top, #dc2626, #ef4444)';
                  };
                  return (
                    <div key={bucket.range} className="flex-1 flex flex-col items-center gap-4 group">
                      <span className="text-[10px] font-black text-white opacity-0 group-hover:opacity-100 transition-opacity font-mono">{bucket.count}</span>
                      <div
                        className="w-full rounded-t-xl transition-all duration-700 relative overflow-hidden group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        style={{
                          height: `${Math.max(height, 5)}%`,
                          background: getColor(bucket.range),
                          boxShadow: '0 8px 15px rgba(0,0,0,0.5)'
                        }}
                      />
                      <span className="text-[9px] font-black tracking-tighter uppercase whitespace-nowrap opacity-40 group-hover:opacity-100 transition-all font-mono" style={{ color: DIM }}>{bucket.range}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM: Applications Table */}
          <div className="rounded-[40px] overflow-hidden mb-12 shadow-2xl"
            style={{ background: CARD, border: `1px solid ${LINE}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div className="px-10 py-8 border-b border-white/5 bg-white/2 flex items-center justify-between">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-4">
                <AlertTriangle className="h-5 w-5 text-amber-500 fill-amber-500/10" /> Intelligence Feed · Corporate Assets
              </h3>
              <span className="text-[10px] font-black px-4 py-1.5 rounded-full bg-white/5 border border-white/5 text-blue-400 uppercase tracking-widest">
                Real-time Sync
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-white/2">
                    {['Identity', 'Corporate Entity', 'Domain', 'Capital', 'AI Matrix', 'Repayment', 'Resilience', 'Decision', ''].map(h => (
                      <th key={h} className="px-10 py-6 text-[9px] font-black uppercase tracking-[0.25em]" style={{ color: DIM }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {d.applications.map((app) => (
                    <tr key={app.id} className="hover:bg-white/5 transition-all group">
                      <td className="px-10 py-6 text-[11px] font-mono font-black text-blue-400">#{app.id}</td>
                      <td className="px-10 py-6 text-sm font-black text-white uppercase tracking-tight">{app.company_name}</td>
                      <td className="px-10 py-6 text-[10px] font-black text-white/30 uppercase tracking-widest">{app.industry_sector}</td>
                      <td className="px-10 py-6 text-sm font-black text-white font-mono">{formatCurrency(app.requested_loan_amount)}</td>
                      <td className="px-10 py-6"><ScoreBadge score={app.ai_risk_score} /></td>
                      <td className="px-10 py-6 font-mono text-sm font-black text-white">{app.repayment_probability}%</td>
                      <td className="px-10 py-6 font-mono text-sm font-black text-white">{app.resilience_score}</td>
                      <td className="px-10 py-6"><DecisionBadge decision={app.decision} /></td>
                      <td className="px-10 py-6 text-right">
                        <Link
                          to={`/officer/applications/${app.id}`}
                          className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-6 py-2 bg-blue-600 text-[10px] font-black text-white uppercase tracking-widest rounded-xl transition-all hover:scale-105 shadow-xl"
                          style={{ background: 'linear-gradient(135deg,#2563eb,#1e40af)' }}
                        >
                          Audit <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* What-If Risk Simulation Module */}
      <div className="mt-16 bg-[#0d1c35] rounded-[40px] p-12 border border-white/5 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0" />
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 rounded-[24px] bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-xl">
             <Zap className="h-8 w-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Extreme Scenario Simulator</h2>
            <p style={{ color: MUTED }} className="font-medium text-sm mt-1">Stress-test hypothetical borrower repayment capacity against system-wide financial shocks and operational collapses.</p>
          </div>
        </div>
        {d.applications.length > 0 ? (
          <WhatIfSimulator
            applicationId={d.applications[0].id}
            loanAmount={d.applications[0].requested_loan_amount}
          />
        ) : (
          <div className="py-20 text-center flex flex-col items-center opacity-30">
            <Zap className="w-16 h-16 mx-auto mb-6 text-white" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Intelligence Signal</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

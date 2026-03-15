import { useState } from 'react';
import { runDigitalTwinSimulation } from '../services/api';
import {
  Activity, RefreshCcw, UserCheck, BarChart2, TrendingDown,
  Briefcase, HeartPulse, Percent, ShieldCheck, AlertTriangle, CloudRain,
  ChevronDown, ChevronUp, DollarSign
} from 'lucide-react';

const BLUE  = '#2563eb';
const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

function formatINR(val) {
  if (val === undefined || val === null) return '—';
  return '₹' + Number(val).toLocaleString('en-IN');
}

export default function DigitalTwinSimulator({ applicationId, loanAmount }) {
  const [form, setForm] = useState({
    monthly_income: '200000',
    monthly_expenses: '80000',
    existing_emi: '30000',
    savings_balance: '500000',
    interest_rate: '10',
    loan_tenure_years: '10',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSimulate = async () => {
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        monthly_income: parseFloat(form.monthly_income),
        monthly_expenses: parseFloat(form.monthly_expenses),
        existing_emi: parseFloat(form.existing_emi),
        savings_balance: parseFloat(form.savings_balance),
        interest_rate: parseFloat(form.interest_rate),
        loan_tenure_years: parseInt(form.loan_tenure_years),
      };
      const { data } = await runDigitalTwinSimulation(applicationId, payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/10 border-green-500/20';
    if (score >= 60) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 40) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  // SVG Line Chart Logic
  const renderSVGChart = (graph) => {
    if (!graph || !graph.datasets) return null;
    
    // Config
    const width = 600;
    const height = 250;
    const padding = 40;
    const chartW = width - padding * 2;
    const chartH = height - padding * 2;
    
    const maxScore = 100;
    
    // Map year index to X coordinate
    const getX = (index) => padding + (index * (chartW / (graph.labels.length - 1 || 1)));
    // Map score to Y coordinate (0 score is bottom, 100 is top)
    const getY = (val) => height - padding - ((val / maxScore) * chartH);

    const colors = {
      base: '#3b82f6', // blue
      job_loss: '#ef4444', // red
      revenue_drop: '#f59e0b', // yellow
      economic_slowdown: '#8b5cf6', // purple
      rate_hike: '#f97316' // orange
    };

    return (
      <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/5">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[500px]">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(yVal => (
            <g key={`grid-${yVal}`}>
              <line x1={padding} y1={getY(yVal)} x2={width - padding} y2={getY(yVal)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={padding - 10} y={getY(yVal) + 4} textAnchor="end" fontSize="10" fontWeight="bold" fill="rgba(255,255,255,0.2)">{yVal}</text>
            </g>
          ))}
          
          {/* Labels (Years) */}
          {graph.labels.map((lbl, idx) => (
            <text key={lbl} x={getX(idx)} y={height - 10} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.3)" fontWeight="900" className="uppercase">
              {lbl}
            </text>
          ))}

          {/* Lines */}
          {graph.datasets.map((ds) => {
            const pathData = ds.data.map((val, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(val)}`).join(' ');
            const color = colors[ds.id] || '#94a3b8';
            return (
              <g key={ds.id}>
                <path d={pathData} fill="none" stroke={color} strokeWidth="3" className="transition-all duration-300" strokeLinecap="round" strokeLinejoin="round" />
                {ds.data.map((val, i) => (
                  <circle key={`${ds.id}-${i}`} cx={getX(i)} cy={getY(val)} r="3" fill="#0d1c35" stroke={color} strokeWidth="2" />
                ))}
              </g>
            );
          })}
        </svg>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {graph.datasets.map((ds) => (
            <div key={ds.id} className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[ds.id] || '#94a3b8' }} />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{ds.name}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-[40px] overflow-hidden" style={{ background: CARD, border: `1px solid ${LINE}`, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-white/2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-xl">
             <Activity className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-black text-xl uppercase tracking-tighter">Digital Twin Simulation</h3>
            <p className="text-xs font-medium" style={{ color: MUTED }}>Generate a multi-variant risk replica and project 5-year stability indices.</p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="p-8 border-b border-white/5 bg-white/2">
        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Foundation Parameters</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
          {[
            { key: 'monthly_income',   label: 'Income (₹)' },
            { key: 'monthly_expenses', label: 'Expenses (₹)' },
            { key: 'existing_emi',     label: 'Current EMI (₹)' },
            { key: 'savings_balance',  label: 'Reserves (₹)' },
            { key: 'interest_rate',    label: 'Rate (%)' },
            { key: 'loan_tenure_years',label: 'Tenure (Y)' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: DIM }}>{label}</label>
              <input
                type="number"
                name={key}
                value={form[key]}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm font-black rounded-2xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = LINE}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 text-red-400 bg-red-900/20 border border-red-500/30 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="flex items-center gap-3 px-10 py-4 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all hover:scale-105 shadow-2xl"
            style={{ 
              background: loading ? 'rgba(37,99,235,0.5)' : 'linear-gradient(135deg, #2563eb, #1e40af)',
              boxShadow: loading ? 'none' : '0 8px 30px rgba(37,99,235,0.4)'
            }}
          >
            {loading ? (
              <><RefreshCcw className="w-4 h-4 animate-spin" /> Synthesizing Twin...</>
            ) : (
              <><UserCheck className="w-5 h-5" /> Generate Digital Twin</>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="p-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Digital Twin Profile */}
            <div className="md:col-span-2 rounded-[32px] p-8 flex items-start gap-6 shadow-2xl relative overflow-hidden" 
              style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${LINE}` }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[60px] pointer-events-none" />
              <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 border border-blue-500/20 shadow-xl">
                <UserCheck className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className="mb-6">
                  <h4 className="text-lg font-black text-white uppercase tracking-tight">Financial Clone Signature</h4>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-30 mt-1 font-mono">{result.digital_twin?.twin_id} // {result.digital_twin?.name}</p>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { l: 'Revenue Node', v: formatINR(result.digital_twin?.base_metrics.monthly_income) },
                    { l: 'Systemic Debt', v: formatINR(result.digital_twin?.base_metrics.total_obligations) },
                    { l: 'Liquid Asset', v: formatINR(result.digital_twin?.base_metrics.disposable_income), accent: true },
                    { l: 'Stability Buffer', v: `${result.digital_twin?.base_metrics.savings_buffer_months} Intervals` }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white/2 p-4 rounded-2xl border border-white/5">
                      <p className="text-[9px] uppercase font-black tracking-widest mb-1.5" style={{ color: DIM }}>{item.l}</p>
                      <p className={`text-sm font-black ${item.accent ? 'text-blue-400' : 'text-white'} font-mono`}>{item.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Financial Stability Score */}
            <div className={`rounded-[32px] border p-8 flex flex-col justify-center items-center text-center shadow-2xl ${getScoreBg(result.financial_stability_score)}`}>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 opacity-60">Baseline Integrity</h4>
              <div className="relative">
                <svg viewBox="0 0 36 36" className="w-28 h-28 stroke-current opacity-5">
                   <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" />
                </svg>
                <svg viewBox="0 0 36 36" className="w-28 h-28 stroke-current absolute inset-0">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" 
                        strokeDasharray={`${result.financial_stability_score}, 100`} 
                        className={getScoreColor(result.financial_stability_score)} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-black tracking-tighter ${getScoreColor(result.financial_stability_score)}`}>
                    {result.financial_stability_score}
                  </span>
                </div>
              </div>
              <p className={`mt-6 font-black text-xs uppercase tracking-[0.2em] ${getScoreColor(result.financial_stability_score)}`}>
                {result.stability_category}
              </p>
            </div>
          </div>

          {/* Line Chart Section */}
          <div className="bg-white/2 rounded-[32px] p-8 border border-white/5">
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h4 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
                  <TrendingDown className="w-5 h-5 text-blue-500" /> 60-Interval Stability Projection
                </h4>
                <p className="text-xs font-medium mt-1" style={{ color: MUTED }}>Long-range solvency forecast across systemic and exogenous shock variants.</p>
              </div>
              <div className="flex gap-2">
                 {[1,2,3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-500/20" />)}
              </div>
            </div>
            
            {renderSVGChart(result.prediction_graph)}
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="p-24 text-center opacity-20">
          <Activity className="w-16 h-16 mx-auto mb-6 text-white" />
          <h4 className="text-[11px] font-black uppercase tracking-[0.4em]">Signal Synchronization Pending</h4>
        </div>
      )}
    </div>
  );
}

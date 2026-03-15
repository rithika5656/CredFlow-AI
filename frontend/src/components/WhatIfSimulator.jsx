import { useState } from 'react';
import { runWhatIfSimulation } from '../services/api';
import {
  Zap, RefreshCcw, AlertTriangle, CheckCircle, TrendingDown,
  Briefcase, HeartPulse, BarChart2, Percent, ChevronDown, ChevronUp,
  Info, ShieldAlert, ShieldCheck,
} from 'lucide-react';

const BLUE  = '#2563eb';
const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';

const SCENARIO_ICONS = {
  job_loss: Briefcase,
  medical_emergency: HeartPulse,
  revenue_drop: TrendingDown,
  rate_hike: Percent,
};

const RISK_STYLES = {
  'Safe':        { bar: 'bg-green-500',  text: 'text-green-400',  bg: 'bg-green-900/20',  border: 'border-green-500/30',  icon: CheckCircle,  iconColor: 'text-green-500' },
  'Medium Risk': { bar: 'bg-yellow-400', text: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30', icon: AlertTriangle, iconColor: 'text-yellow-500' },
  'High Risk':   { bar: 'bg-red-500',    text: 'text-red-400',    bg: 'bg-red-900/20',    border: 'border-red-500/30',    icon: ShieldAlert,  iconColor: 'text-red-500' },
};

function formatINR(val) {
  if (val === undefined || val === null) return '—';
  return '₹' + Number(val).toLocaleString('en-IN');
}

function CapacityBar({ pct }) {
  const clamped = Math.max(0, Math.min(100, pct));
  const color = pct >= 60 ? 'bg-green-500' : pct >= 30 ? 'bg-yellow-400' : 'bg-red-500';
  return (
    <div className="w-full">
      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1.5">
        <span style={{ color: DIM }}>EMI Capacity</span>
        <span className="text-white">{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

function ScenarioCard({ sc }) {
  const [open, setOpen] = useState(false);
  const Icon = SCENARIO_ICONS[sc.scenario_id] || BarChart2;
  const style = RISK_STYLES[sc.risk_level] || RISK_STYLES['Medium Risk'];
  const RiskIcon = style.icon;

  return (
    <div className={`rounded-2xl border ${style.border} ${style.bg} overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-5 flex items-center gap-5 text-left"
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/5 border ${style.border}`}>
          <Icon className={`w-6 h-6 ${style.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className="font-black text-white text-base tracking-tight">{sc.scenario_name}</span>
            <span className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-lg flex items-center gap-1.5 border ${style.text} bg-white/5 ${style.border}`}>
              <RiskIcon className="w-3 h-3" /> {sc.risk_level}
            </span>
          </div>
          <p className="text-sm font-medium truncate" style={{ color: MUTED }}>{sc.description}</p>
        </div>
        <div className="text-right flex-shrink-0 pr-4">
          <div className={`text-3xl font-black ${style.text}`}>{sc.emi_capacity_pct.toFixed(0)}%</div>
          <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: DIM }}>capacity</p>
        </div>
        <div style={{ color: DIM }}>
          {open ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-white/5 mt-0 pt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { l: 'Stressed Income', v: sc.stressed_monthly_income },
              { l: 'Stressed Expenses', v: sc.stressed_monthly_expenses },
              { l: 'EMI Under Stress', v: sc.stressed_emi },
              { l: 'Net Disposable', v: sc.stressed_disposable, bad: sc.stressed_disposable < 0 }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/5 rounded-xl p-3.5 border border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: DIM }}>{item.l}</p>
                <p className={`text-base font-black ${item.bad ? 'text-red-400' : 'text-white'}`}>{formatINR(item.v)}</p>
              </div>
            ))}
          </div>
          <CapacityBar pct={sc.emi_capacity_pct} />
          <p className={`text-sm mt-4 font-bold ${style.text}`}>{sc.risk_description}</p>
        </div>
      )}
    </div>
  );
}

export default function WhatIfSimulator({ applicationId, loanAmount }) {
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
      const { data } = await runWhatIfSimulation(applicationId, payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Simulation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const VULN_STYLES = {
    'Low Vulnerability':      { icon: ShieldCheck,  color: 'text-green-400',  bg: 'bg-green-900/20',  border: 'border-green-500/30'  },
    'Moderate Vulnerability': { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-900/20', border: 'border-yellow-500/30' },
    'High Vulnerability':     { icon: ShieldAlert,   color: 'text-red-400',    bg: 'bg-red-900/20',    border: 'border-red-500/30'    },
  };

  const vulnStyle = result ? (VULN_STYLES[result.aggregate?.overall_vulnerability] || VULN_STYLES['Moderate Vulnerability']) : null;
  const VulnIcon = vulnStyle?.icon;

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: '#0d1c35', border: `1px solid ${LINE}`, boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
      {/* Header */}
      <div className="px-8 py-6 border-b border-white/5 bg-white/5">
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Zap className="w-6 h-6 text-amber-500 fill-amber-500/20" />
          </div>
          <div>
            <h3 className="text-white font-black text-lg tracking-tight">Risk Stress Test Panel</h3>
            <p className="text-xs font-bold" style={{ color: MUTED }}>Analyse repayment sustainability under various macro-economic shocks</p>
          </div>
          {loanAmount && (
            <div className="ml-auto text-right">
              <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: DIM }}>Exposure</p>
              <p className="text-white font-black text-xl tracking-tight">{formatINR(loanAmount)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-8 border-b border-white/5 bg-white/5">
        <p className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500" /> Financial Parameters
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          {[
            { key: 'monthly_income',   label: 'Income (₹)',   placeholder: '2L' },
            { key: 'monthly_expenses', label: 'Expenses (₹)',  placeholder: '80K'  },
            { key: 'existing_emi',     label: 'Current EMI (₹)',      placeholder: '30K'  },
            { key: 'savings_balance',  label: 'Reserves (₹)',   placeholder: '5L' },
            { key: 'interest_rate',    label: 'Rate (%)',     placeholder: '10'     },
            { key: 'loan_tenure_years',label: 'Tenure (Y)',        placeholder: '10'     },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: DIM }}>{label}</label>
              <input
                type="number"
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 text-sm font-bold rounded-xl outline-none transition-all"
                style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
                onFocus={e => e.target.style.borderColor = '#2563eb'}
                onBlur={e => e.target.style.borderColor = LINE}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-3 text-red-400 bg-red-900/20 border border-red-500/30 rounded-xl px-4 py-3 text-sm font-bold">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-3 rounded-2xl text-sm font-black text-white transition-all"
            style={{
              background: loading ? 'rgba(37,99,235,0.5)' : `linear-gradient(135deg,${BLUE},#1e40af)`,
              boxShadow: loading ? 'none' : '0 8px 30px rgba(37,99,235,0.4)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? (
              <><RefreshCcw className="w-4 h-4 animate-spin" /> Simulating Shocks...</>
            ) : (
              <><Zap className="w-5 h-5 fill-white/20" /> Run Simulation</>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="p-8 space-y-8">
          {/* Aggregate Summary */}
          <div className={`rounded-3xl border ${vulnStyle.border} ${vulnStyle.bg} p-6 flex items-center gap-6 shadow-xl`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/10 border ${vulnStyle.border}`}>
              <VulnIcon className={`w-8 h-8 ${vulnStyle.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 flex-wrap mb-2">
                <h4 className={`font-black text-xl tracking-tight ${vulnStyle.color}`}>{result.aggregate.overall_vulnerability}</h4>
                <div className="flex gap-2 text-[10px] font-black uppercase tracking-widest">
                  <span className="bg-green-500/20 text-green-400 px-2.5 py-1 rounded-lg border border-green-500/30">{result.aggregate.safe_scenarios} Safe</span>
                  <span className="bg-yellow-500/20 text-yellow-400 px-2.5 py-1 rounded-lg border border-yellow-500/30">{result.aggregate.medium_risk_scenarios} Mid</span>
                  <span className="bg-red-500/20 text-red-400 px-2.5 py-1 rounded-lg border border-red-500/30">{result.aggregate.high_risk_scenarios} Risk</span>
                </div>
              </div>
              <p className="text-sm font-medium leading-relaxed" style={{ color: MUTED }}>{result.aggregate.overall_recommendation}</p>
            </div>
            <div className="text-right flex-shrink-0 pl-4 border-l border-white/5">
              <p className="text-[10px] font-black tracking-widest uppercase mb-1" style={{ color: DIM }}>Avg Capacity</p>
              <p className={`text-3xl font-black ${vulnStyle.color}`}>{result.aggregate.avg_emi_capacity_pct.toFixed(1)}%</p>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Stress Test Analytics</p>
            </div>

            {/* Baseline */}
            <div className="mb-8 p-6 rounded-3xl bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Current Baseline</span>
                  <p className="text-sm font-bold text-white mt-1">Normal Conditions: {formatINR(result.base_analysis.base_emi)} EMI</p>
                </div>
                <div className="text-right">
                  <span className={`text-3xl font-black ${RISK_STYLES[result.base_analysis.base_risk_level]?.text || 'text-white'}`}>
                    {result.base_analysis.base_capacity_pct.toFixed(1)}%
                  </span>
                  <p className="text-[10px] font-black tracking-widest uppercase" style={{ color: DIM }}>capacity</p>
                </div>
              </div>
              <CapacityBar pct={result.base_analysis.base_capacity_pct} />
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-3xl border border-white/5 mb-8 bg-white/5">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Scenario', 'Stressed Income', 'Revised EMI', 'Capacity', 'Impact'].map(h => (
                      <th key={h} className="px-6 py-4 text-[10px] font-black text-white uppercase tracking-widest" style={{ color: DIM }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {result.scenarios.map((sc) => {
                    const style = RISK_STYLES[sc.risk_level] || RISK_STYLES['Medium Risk'];
                    const SIcon = style.icon;
                    return (
                      <tr key={sc.scenario_id} className="hover:bg-white/5 transition-all">
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-white">{sc.scenario_name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-white font-mono">{formatINR(sc.stressed_monthly_income)}</td>
                        <td className="px-6 py-4 text-sm font-bold text-white font-mono">{formatINR(sc.stressed_emi)}</td>
                        <td className="px-6 py-4 min-w-[120px]">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${style.bar}`}
                                style={{ width: `${Math.max(0, Math.min(100, sc.emi_capacity_pct))}%` }}
                              />
                            </div>
                            <span className={`text-xs font-black w-12 text-right ${style.text}`}>
                              {sc.emi_capacity_pct.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl border ${style.text} bg-white/5 ${style.border}`}>
                            <SIcon className="w-3.5 h-3.5" /> {sc.risk_level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Scenario Cards */}
            <div className="grid grid-cols-1 gap-4">
              {result.scenarios.map((sc, i) => (
                <ScenarioCard key={sc.scenario_id} sc={sc} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="p-20 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <Zap className="w-10 h-10 text-white/10" />
          </div>
          <p className="text-lg font-black text-white tracking-tight">Configure & Run Stress Test</p>
          <p className="text-sm font-medium mt-2 max-w-xs" style={{ color: MUTED }}>Enter the applicant's financial parameters above and click "Run Simulation" to view results.</p>
        </div>
      )}
    </div>
  );
}

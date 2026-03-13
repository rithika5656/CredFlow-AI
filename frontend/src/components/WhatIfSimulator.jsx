import { useState } from 'react';
import { runWhatIfSimulation } from '../../services/api';
import {
  Zap, RefreshCcw, AlertTriangle, CheckCircle, TrendingDown,
  Briefcase, HeartPulse, BarChart2, Percent, ChevronDown, ChevronUp,
  Info, ShieldAlert, ShieldCheck,
} from 'lucide-react';

const SCENARIO_ICONS = {
  job_loss: Briefcase,
  medical_emergency: HeartPulse,
  revenue_drop: TrendingDown,
  rate_hike: Percent,
};

const RISK_STYLES = {
  'Safe':        { bar: 'bg-green-500',  text: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200',  icon: CheckCircle,  iconColor: 'text-green-500' },
  'Medium Risk': { bar: 'bg-yellow-400', text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200', icon: AlertTriangle, iconColor: 'text-yellow-500' },
  'High Risk':   { bar: 'bg-red-500',    text: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200',    icon: ShieldAlert,  iconColor: 'text-red-500' },
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
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>EMI Capacity</span>
        <span className="font-bold">{pct.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}

function ScenarioCard({ sc, index }) {
  const [open, setOpen] = useState(false);
  const Icon = SCENARIO_ICONS[sc.scenario_id] || BarChart2;
  const style = RISK_STYLES[sc.risk_level] || RISK_STYLES['Medium Risk'];
  const RiskIcon = style.icon;

  return (
    <div className={`rounded-xl border ${style.border} ${style.bg} overflow-hidden transition-all duration-300`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 flex items-center gap-4 text-left"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${style.bg} border ${style.border}`}>
          <Icon className={`w-5 h-5 ${style.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-gray-800 text-sm">{sc.scenario_name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${style.text} ${style.bg} border ${style.border}`}>
              <RiskIcon className="w-3 h-3" /> {sc.risk_level}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate">{sc.description}</p>
        </div>
        <div className="text-right flex-shrink-0 w-24">
          <div className={`text-2xl font-extrabold ${style.text}`}>{sc.emi_capacity_pct.toFixed(0)}%</div>
          <p className="text-[10px] text-gray-400">capacity</p>
        </div>
        <div className="text-gray-400 flex-shrink-0">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-dashed border-gray-200 mt-0 pt-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-4">
            <div className="bg-white rounded-lg p-2.5 border border-gray-100">
              <p className="text-gray-400 mb-0.5">Stressed Income</p>
              <p className="font-bold text-gray-700">{formatINR(sc.stressed_monthly_income)}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-gray-100">
              <p className="text-gray-400 mb-0.5">Stressed Expenses</p>
              <p className="font-bold text-gray-700">{formatINR(sc.stressed_monthly_expenses)}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-gray-100">
              <p className="text-gray-400 mb-0.5">EMI Under Stress</p>
              <p className="font-bold text-gray-700">{formatINR(sc.stressed_emi)}</p>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-gray-100">
              <p className="text-gray-400 mb-0.5">Net Disposable</p>
              <p className={`font-bold ${sc.stressed_disposable < 0 ? 'text-red-600' : 'text-gray-700'}`}>
                {formatINR(sc.stressed_disposable)}
              </p>
            </div>
          </div>
          <CapacityBar pct={sc.emi_capacity_pct} />
          <p className={`text-xs mt-2 font-medium ${style.text}`}>{sc.risk_description}</p>
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
    'Low Vulnerability':      { icon: ShieldCheck,  color: 'text-green-700',  bg: 'bg-green-50',  border: 'border-green-200'  },
    'Moderate Vulnerability': { icon: AlertTriangle, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    'High Vulnerability':     { icon: ShieldAlert,   color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200'    },
  };

  const vulnStyle = result ? (VULN_STYLES[result.aggregate?.overall_vulnerability] || VULN_STYLES['Moderate Vulnerability']) : null;
  const VulnIcon = vulnStyle?.icon;

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-primary-950 to-primary-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-white font-bold text-base">What-If Risk Simulator</h3>
            <p className="text-primary-200 text-xs">Stress-test borrower repayment capacity across financial shock scenarios</p>
          </div>
          {loanAmount && (
            <div className="ml-auto text-right">
              <p className="text-primary-300 text-xs">Loan Amount</p>
              <p className="text-white font-bold text-sm">{formatINR(loanAmount)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Applicant Financial Parameters</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { key: 'monthly_income',   label: 'Monthly Income (₹)',   placeholder: '200000' },
            { key: 'monthly_expenses', label: 'Monthly Expenses (₹)',  placeholder: '80000'  },
            { key: 'existing_emi',     label: 'Existing EMI (₹)',      placeholder: '30000'  },
            { key: 'savings_balance',  label: 'Savings Balance (₹)',   placeholder: '500000' },
            { key: 'interest_rate',    label: 'Interest Rate (%)',     placeholder: '10'     },
            { key: 'loan_tenure_years',label: 'Tenure (Years)',        placeholder: '10'     },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
              <input
                type="number"
                name={key}
                value={form[key]}
                onChange={handleChange}
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-white"
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-800 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <><RefreshCcw className="w-4 h-4 animate-spin" /> Running Simulation...</>
            ) : (
              <><Zap className="w-4 h-4" /> Run Stress Simulation</>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="p-6 space-y-6">
          {/* Aggregate Summary */}
          <div className={`rounded-xl border ${vulnStyle.border} ${vulnStyle.bg} p-5 flex items-start gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-white border ${vulnStyle.border}`}>
              <VulnIcon className={`w-6 h-6 ${vulnStyle.color}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h4 className={`font-bold text-sm ${vulnStyle.color}`}>{result.aggregate.overall_vulnerability}</h4>
                <div className="flex gap-2 text-xs">
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">{result.aggregate.safe_scenarios} Safe</span>
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">{result.aggregate.medium_risk_scenarios} Medium</span>
                  <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">{result.aggregate.high_risk_scenarios} High Risk</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">{result.aggregate.overall_recommendation}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-xs text-gray-400">Avg EMI Capacity</p>
              <p className={`text-2xl font-extrabold ${vulnStyle.color}`}>{result.aggregate.avg_emi_capacity_pct.toFixed(1)}%</p>
            </div>
          </div>

          {/* Baseline vs Scenarios */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-4 h-4 text-primary-500" />
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Baseline + 4 Stress Scenarios</p>
            </div>

            {/* Baseline */}
            <div className="mb-4 p-4 rounded-xl bg-primary-50 border border-primary-100">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">Baseline (Normal Conditions)</span>
                  <p className="text-xs text-gray-500 mt-0.5">Base EMI: {formatINR(result.base_analysis.base_emi)} / month</p>
                </div>
                <div className="text-right">
                  <span className={`text-xl font-extrabold ${RISK_STYLES[result.base_analysis.base_risk_level]?.text || 'text-gray-700'}`}>
                    {result.base_analysis.base_capacity_pct.toFixed(1)}%
                  </span>
                  <p className="text-[10px] text-gray-400">capacity</p>
                </div>
              </div>
              <CapacityBar pct={result.base_analysis.base_capacity_pct} />
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-100 mb-5">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Scenario</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Stressed Income</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">New EMI</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Capacity %</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Risk Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.scenarios.map((sc) => {
                    const style = RISK_STYLES[sc.risk_level] || RISK_STYLES['Medium Risk'];
                    const SIcon = style.icon;
                    return (
                      <tr key={sc.scenario_id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-gray-800">{sc.scenario_name}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatINR(sc.stressed_monthly_income)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{formatINR(sc.stressed_emi)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${style.bar}`}
                                style={{ width: `${Math.max(0, Math.min(100, sc.emi_capacity_pct))}%` }}
                              />
                            </div>
                            <span className={`text-xs font-bold w-12 text-right ${style.text}`}>
                              {sc.emi_capacity_pct.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${style.text} ${style.bg} ${style.border}`}>
                            <SIcon className="w-3 h-3" /> {sc.risk_level}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Scenario Cards (expandable) */}
            <div className="space-y-3">
              {result.scenarios.map((sc, i) => (
                <ScenarioCard key={sc.scenario_id} sc={sc} index={i} />
              ))}
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="p-10 text-center text-gray-400">
          <Zap className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm font-medium">Enter applicant financial parameters and run the simulation</p>
          <p className="text-xs mt-1 opacity-60">Results will show EMI capacity across 4 stress scenarios</p>
        </div>
      )}
    </div>
  );
}

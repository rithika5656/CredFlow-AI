import { useState } from 'react';
import { runRiskIntelligence } from '../services/api';
import {
  Brain, TrendingUp, Briefcase, Building2, Zap,
  Shield, Wallet, Eye, Target, ChevronDown, ChevronUp,
  AlertTriangle, CheckCircle2, XCircle, Minus,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */
function ProgressBar({ value, max = 100, color }) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = color || (pct >= 70 ? 'bg-green-500' : pct >= 45 ? 'bg-yellow-500' : 'bg-red-500');
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`h-2 rounded-full transition-all ${barColor}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function LevelBadge({ level }) {
  const map = {
    low: 'bg-green-100 text-green-800', Low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800', Medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800', High: 'bg-red-100 text-red-800',
    Safe: 'bg-green-100 text-green-800',
    'Medium Risk': 'bg-yellow-100 text-yellow-800',
    'High Risk': 'bg-red-100 text-red-800',
    Strong: 'bg-green-100 text-green-800',
    Moderate: 'bg-yellow-100 text-yellow-800',
    Weak: 'bg-red-100 text-red-800',
    Good: 'bg-green-100 text-green-800',
    Average: 'bg-yellow-100 text-yellow-800',
    Poor: 'bg-red-100 text-red-800',
    Approve: 'bg-green-100 text-green-800',
    'Conditional Approval': 'bg-yellow-100 text-yellow-800',
    Conditional: 'bg-yellow-100 text-yellow-800',
    Reject: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[level] || 'bg-gray-100 text-gray-800'}`}>
      {level}
    </span>
  );
}

function ScoreCircle({ score, label, size = 'md' }) {
  const color = score >= 70 ? 'border-green-500 text-green-700'
    : score >= 45 ? 'border-yellow-500 text-yellow-700'
      : 'border-red-500 text-red-700';
  const dim = size === 'lg' ? 'w-24 h-24' : 'w-16 h-16';
  const textSize = size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className="flex flex-col items-center gap-1">
      <div className={`${dim} rounded-full border-4 ${color} flex items-center justify-center`}>
        <span className={`${textSize} font-bold`}>{score}</span>
      </div>
      {label && <span className="text-xs text-gray-500 font-medium">{label}</span>}
    </div>
  );
}

function Section({ icon: Icon, title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6 pt-0">{children}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Input Form                                                          */
/* ------------------------------------------------------------------ */
function AnalysisForm({ applicationId, onResult, loading, setLoading }) {
  const [params, setParams] = useState({
    applicant_age: 35,
    employment_type: 'salaried',
    credit_score: 720,
    monthly_income: 200000,
    existing_emi: 30000,
    monthly_expenses: 80000,
    savings_balance: 500000,
    emergency_funds: 200000,
    dependents: 2,
    insurance_coverage: 2000000,
    cash_flow_net: 120000,
    employment_stability: 0.8,
    loan_tenure_years: 10,
    interest_rate: 10.0,
    gambling_transactions: 0,
    large_withdrawals: 1,
    luxury_spending_ratio: 0.15,
    irregular_income_months: 1,
    total_months_analyzed: 12,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setParams((p) => ({
      ...p,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await runRiskIntelligence(applicationId, params);
      onResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Analysis failed.');
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'number', step, min, max, options }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {options ? (
        <select name={name} value={params[name]} onChange={handleChange} className="input-field text-sm py-1.5">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={type} name={name} value={params[name]}
          onChange={handleChange}
          step={step} min={min} max={max}
          className="input-field text-sm py-1.5"
        />
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Field label="Applicant Age" name="applicant_age" min={18} max={80} />
        <Field label="Employment Type" name="employment_type" options={[
          { value: 'salaried', label: 'Salaried' },
          { value: 'self_employed', label: 'Self Employed' },
          { value: 'business_owner', label: 'Business Owner' },
          { value: 'contract', label: 'Contract' },
          { value: 'freelance', label: 'Freelance' },
        ]} />
        <Field label="Credit Score" name="credit_score" min={300} max={900} />
        <Field label="Monthly Income" name="monthly_income" step={1000} min={0} />
        <Field label="Existing EMI" name="existing_emi" step={1000} min={0} />
        <Field label="Monthly Expenses" name="monthly_expenses" step={1000} min={0} />
        <Field label="Net Cash Flow" name="cash_flow_net" step={1000} />
        <Field label="Employment Stability (0-1)" name="employment_stability" step={0.05} min={0} max={1} />
        <Field label="Savings Balance" name="savings_balance" step={10000} min={0} />
        <Field label="Emergency Funds" name="emergency_funds" step={10000} min={0} />
        <Field label="Insurance Coverage" name="insurance_coverage" step={100000} min={0} />
        <Field label="Dependents" name="dependents" min={0} max={10} />
        <Field label="Loan Tenure (yrs)" name="loan_tenure_years" min={1} max={30} />
        <Field label="Interest Rate (%)" name="interest_rate" step={0.5} min={0} />
        <Field label="Gambling Transactions" name="gambling_transactions" min={0} />
        <Field label="Large Withdrawals" name="large_withdrawals" min={0} />
        <Field label="Luxury Spending Ratio" name="luxury_spending_ratio" step={0.05} min={0} max={1} />
        <Field label="Irregular Income Months" name="irregular_income_months" min={0} />
      </div>

      <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 text-sm">
        <Brain className="h-4 w-4" />
        {loading ? 'Running Intelligence...' : 'Run Advanced Risk Intelligence'}
      </button>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Results Display                                                     */
/* ------------------------------------------------------------------ */
function AnalysisResults({ data }) {
  const rp = data.repayment_prediction;
  const cl = data.career_longevity;
  const ir = data.industry_risk;
  const ss = data.scenario_simulation;
  const fr = data.financial_resilience;
  const ba = data.behavioral_analysis;
  const fd = data.final_decision;

  return (
    <div className="space-y-4 mt-6">
      {/* Final AI Decision -- always visible at top */}
      <div className="card p-6 border-2 border-primary-200">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5 text-primary-600" />
          <h3 className="font-semibold text-gray-800">AI Credit Decision Engine</h3>
        </div>
        <div className="flex items-center gap-6 mb-4">
          <ScoreCircle score={fd.ai_risk_score} label="AI Risk Score" size="lg" />
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <LevelBadge level={fd.decision} />
              {fd.decision === 'Approve' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
              {fd.decision === 'Reject' && <XCircle className="h-5 w-5 text-red-600" />}
              {fd.decision === 'Conditional Approval' && <Minus className="h-5 w-5 text-yellow-600" />}
            </div>
            <p className="text-sm text-gray-600">{fd.decision_detail}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(fd.component_scores).map(([key, val]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] font-medium text-gray-500 uppercase mb-1">
                {key.replace(/_/g, ' ')}
              </p>
              <p className="text-sm font-bold">{val}</p>
              <ProgressBar value={val} />
            </div>
          ))}
        </div>
      </div>

      {/* 1. Future Repayment */}
      <Section icon={TrendingUp} title="Future Repayment Prediction">
        <div className="flex items-center gap-6 mb-4">
          <ScoreCircle score={rp.repayment_probability} label="Repayment %" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-700">Default Risk:</span>
              <LevelBadge level={rp.default_risk_level} />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Recommendation:</span>
              <LevelBadge level={rp.ai_recommendation} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(rp.factors).map(([key, val]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] font-medium text-gray-500 uppercase mb-1">{key.replace(/_/g, ' ')}</p>
              <p className="text-sm font-bold">{val}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 2. Career Longevity */}
      <Section icon={Briefcase} title="Career Longevity Analysis">
        <div className="flex items-center gap-6 mb-4">
          <ScoreCircle score={cl.career_stability_score} label="Stability Score" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Remaining Earning Years</span>
              <span className="font-semibold">{cl.remaining_earning_years} yrs</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Retirement Age</span>
              <span className="font-semibold">{cl.retirement_age}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Safe Earning Window</span>
              <span className="font-semibold">{cl.safe_earning_window} yrs</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Loan Tenure</span>
              <span className="font-semibold">{cl.loan_tenure_years} yrs</span>
            </div>
          </div>
        </div>
        {cl.risk_warning && (
          <div className="flex items-start gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
            <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            {cl.risk_warning}
          </div>
        )}
      </Section>

      {/* 3. Industry Risk */}
      <Section icon={Building2} title="Industry Risk Dashboard">
        <div className="flex items-center gap-6 mb-4">
          <ScoreCircle score={ir.stability_score} label="Stability" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Industry</span>
              <span className="font-semibold capitalize">{ir.industry_sector}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Risk Level</span>
              <LevelBadge level={ir.risk_level} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Market Growth</span>
              <span className="font-semibold">{ir.market_growth_trend}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Layoff Risk Index</span>
              <span className="font-semibold">{ir.layoff_risk_index}%</span>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">{ir.market_trend_summary}</p>
      </Section>

      {/* 4. What-If Simulation */}
      <Section icon={Zap} title="What-If Risk Simulation">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 px-3 font-medium text-gray-600">Scenario</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">EMI Capacity</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600">Risk Level</th>
              </tr>
            </thead>
            <tbody>
              {ss.scenarios.map((s) => (
                <tr key={s.scenario} className="border-b border-gray-100">
                  <td className="py-2.5 px-3 font-medium">{s.scenario}</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold w-12">{s.emi_capacity}%</span>
                      <ProgressBar value={s.emi_capacity} />
                    </div>
                  </td>
                  <td className="py-2.5 px-3"><LevelBadge level={s.risk_level} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
          <span className="text-sm text-gray-600">Overall Scenario Resilience:</span>
          <span className="font-bold">{ss.overall_resilience}</span>
          <ProgressBar value={ss.overall_resilience} />
        </div>
      </Section>

      {/* 5. Financial Resilience */}
      <Section icon={Shield} title="Financial Resilience Score">
        <div className="flex items-center gap-6 mb-4">
          <ScoreCircle score={fr.resilience_score} label="Resilience" />
          <div className="flex-1 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Resilience Level</span>
              <LevelBadge level={fr.resilience_level} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Months of Financial Safety</span>
              <span className="font-semibold">{fr.months_of_safety} months</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Emergency Fund Coverage</span>
              <span className="font-semibold">{fr.emergency_fund_coverage.toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 })}</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(fr.factors).map(([key, val]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] font-medium text-gray-500 uppercase mb-1">{key.replace(/_/g, ' ')}</p>
              <p className="text-sm font-bold">{val}</p>
              <ProgressBar value={val} max={40} />
            </div>
          ))}
        </div>
      </Section>

      {/* 6. Behavioral Banking */}
      <Section icon={Eye} title="Behavioral Banking Analysis">
        <div className="flex items-center gap-6 mb-4">
          <ScoreCircle score={ba.financial_discipline_score} label="Discipline" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-700">Discipline Level:</span>
              <LevelBadge level={ba.discipline_level} />
            </div>
          </div>
        </div>
        {ba.risk_flags.length > 0 && (
          <div className="space-y-2 mb-4">
            {ba.risk_flags.map((flag, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                {flag}
              </div>
            ))}
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(ba.penalties).map(([key, val]) => (
            <div key={key} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-[10px] font-medium text-gray-500 uppercase mb-1">{key.replace(/_/g, ' ')} penalty</p>
              <p className="text-sm font-bold text-red-600">-{val}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Exported Component                                             */
/* ------------------------------------------------------------------ */
export default function RiskIntelligencePanel({ applicationId, existingData }) {
  const [result, setResult] = useState(existingData || null);
  const [loading, setLoading] = useState(false);

  return (
    <div>
      <div className="card p-6 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary-600" />
          <h2 className="text-lg font-semibold">Advanced Risk Intelligence</h2>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Configure applicant parameters and run AI-powered credit risk analysis across 7 modules.
        </p>
        <AnalysisForm
          applicationId={applicationId}
          onResult={setResult}
          loading={loading}
          setLoading={setLoading}
        />
      </div>

      {result && <AnalysisResults data={result} />}
    </div>
  );
}

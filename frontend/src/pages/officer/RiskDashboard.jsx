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


function MiniBar({ value, max = 100, color = 'bg-primary-600' }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`h-2 rounded-full ${color}`} style={{ width: `${Math.min((value / max) * 100, 100)}%` }} />
    </div>
  );
}

function ScoreBadge({ score }) {
  const color = score >= 75
    ? 'bg-green-100 text-green-800'
    : score >= 50
      ? 'bg-yellow-100 text-yellow-800'
      : 'bg-red-100 text-red-800';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>{score}</span>;
}

function DecisionBadge({ decision }) {
  const map = {
    Approve: 'bg-green-100 text-green-800',
    'Conditional Approval': 'bg-yellow-100 text-yellow-800',
    Reject: 'bg-red-100 text-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${map[decision] || 'bg-gray-100 text-gray-800'}`}>
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
  if (error) return <Layout><p className="text-red-600">{error}</p></Layout>;

  const d = data;

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Brain className="h-6 w-6 text-primary-600" />
          <h1 className="text-2xl font-bold">Advanced Risk Intelligence</h1>
        </div>
        <p className="text-gray-500">AI-powered aggregate risk analytics across all analyzed applications</p>
      </div>

      {/* TOP: Key Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Target className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Applications Analyzed</p>
              <p className="text-2xl font-bold">{d.total_analyzed}</p>
            </div>
          </div>
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Average Risk Score</p>
              <p className="text-2xl font-bold">{d.avg_risk_score}<span className="text-sm font-normal text-gray-400">/100</span></p>
            </div>
          </div>
          <MiniBar value={d.avg_risk_score} color={d.avg_risk_score >= 70 ? 'bg-green-500' : d.avg_risk_score >= 45 ? 'bg-yellow-500' : 'bg-red-500'} />
        </div>
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">Total Loan Exposure</p>
              <p className="text-2xl font-bold">{formatCurrency(d.total_loan_exposure)}</p>
            </div>
          </div>
        </div>
      </div>

      {d.total_analyzed === 0 ? (
        <div className="card p-16 text-center">
          <Brain className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-700 mb-2">No analyses performed yet</h3>
          <p className="text-sm text-gray-500 mb-6">
            Run Advanced Risk Intelligence on individual applications to populate this dashboard.
          </p>
          <Link to="/officer/applications" className="btn-primary inline-flex items-center gap-2">
            View Applications <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <>
          {/* MIDDLE: Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Risk Distribution */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary-600" /> AI Decision Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(d.risk_distribution).map(([key, count]) => {
                  const total = d.total_analyzed;
                  const pct = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
                  const barColor = key === 'Approve' ? 'bg-green-500' : key === 'Conditional Approval' ? 'bg-yellow-500' : 'bg-red-500';
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="font-medium">{key}</span>
                        <span className="text-gray-500">{count} ({pct}%)</span>
                      </div>
                      <MiniBar value={count} max={total || 1} color={barColor} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Industry Distribution */}
            <div className="card p-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary-600" /> Industry Distribution
              </h3>
              {Object.keys(d.industry_distribution).length === 0 ? (
                <p className="text-sm text-gray-400">No data available.</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(d.industry_distribution)
                    .sort((a, b) => b[1] - a[1])
                    .map(([sector, count]) => (
                      <div key={sector}>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="font-medium capitalize">{sector}</span>
                          <span className="text-gray-500">{count}</span>
                        </div>
                        <MiniBar value={count} max={d.total_analyzed || 1} color="bg-primary-500" />
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Score Histogram */}
            <div className="card p-6 lg:col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary-600" /> Risk Score Distribution
              </h3>
              <div className="flex items-end gap-2 h-40">
                {d.score_histogram.map((bucket) => {
                  const maxCount = Math.max(...d.score_histogram.map((b) => b.count), 1);
                  const height = (bucket.count / maxCount) * 100;
                  const getColor = (range) => {
                    const start = parseInt(range.split('-')[0]);
                    if (start >= 70) return 'bg-green-500';
                    if (start >= 40) return 'bg-yellow-500';
                    return 'bg-red-500';
                  };
                  return (
                    <div key={bucket.range} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs font-semibold text-gray-600">{bucket.count}</span>
                      <div
                        className={`w-full rounded-t ${getColor(bucket.range)}`}
                        style={{ height: `${Math.max(height, 4)}%` }}
                      />
                      <span className="text-[10px] text-gray-500">{bucket.range}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* BOTTOM: Applications Table */}
          <div className="card overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary-600" /> Loan Applications with AI Risk Scores
              </h3>
            </div>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">ID</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Company</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Industry</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Loan Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">AI Score</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Repayment %</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Resilience</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Decision</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {d.applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono">#{app.id}</td>
                    <td className="px-6 py-4 text-sm font-medium">{app.company_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">{app.industry_sector}</td>
                    <td className="px-6 py-4 text-sm">{formatCurrency(app.requested_loan_amount)}</td>
                    <td className="px-6 py-4"><ScoreBadge score={app.ai_risk_score} /></td>
                    <td className="px-6 py-4 text-sm">{app.repayment_probability}%</td>
                    <td className="px-6 py-4 text-sm">{app.resilience_score}</td>
                    <td className="px-6 py-4"><DecisionBadge decision={app.decision} /></td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/officer/applications/${app.id}`}
                        className="text-primary-600 text-sm font-medium hover:text-primary-700"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* What-If Risk Simulation Module */}
      <div className="mt-8">
        <div className="flex items-center gap-3 mb-4">
          <Zap className="h-5 w-5 text-yellow-500" />
          <div>
            <h2 className="text-lg font-bold text-gray-900">What-If Risk Simulator</h2>
            <p className="text-sm text-gray-500">Select an application from the table above and open its detail page to run a targeted simulation, or use the standalone simulator here.</p>
          </div>
        </div>
        {d.applications.length > 0 ? (
          <WhatIfSimulator
            applicationId={d.applications[0].id}
            loanAmount={d.applications[0].requested_loan_amount}
          />
        ) : (
          <div className="card p-8 text-center text-gray-400">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Run Risk Intelligence on at least one application to enable the simulator here.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

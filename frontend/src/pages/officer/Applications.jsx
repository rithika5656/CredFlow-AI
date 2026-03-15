import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllApplications } from '../../services/api';
import Layout from '../../components/Layout';
import { StatusBadge, RiskBadge, LoadingSpinner, EmptyState, formatCurrency, formatDate } from '../../components/UI';
import { FileText, Search, Filter } from 'lucide-react';

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';

export default function OfficerApplications() {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    getAllApplications()
      .then(({ data }) => {
        setApplications(data);
        setFiltered(data);
      })
      .catch(() => { setApplications([]); setFiltered([]); })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = applications;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.company_name.toLowerCase().includes(q) ||
          a.industry_sector.toLowerCase().includes(q) ||
          String(a.id).includes(q)
      );
    }
    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter);
    }
    setFiltered(result);
  }, [search, statusFilter, applications]);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white tracking-tight">Application Repository</h1>
        <p className="font-medium text-sm mt-1" style={{ color: MUTED }}>Review and analyze corporate loan applications across the portfolio</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: MUTED }} />
          <input
            type="text"
            placeholder="Search by company, industry, or ID..."
            className="w-full pl-10 pr-4 py-2.5 text-sm font-bold rounded-xl outline-none transition-all"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={e => e.target.style.borderColor = '#2563eb'}
            onBlur={e => e.target.style.borderColor = LINE}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" style={{ color: MUTED }} />
          <select
            className="pl-9 pr-8 py-2.5 text-sm font-bold rounded-xl outline-none appearance-none cursor-pointer"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all"           style={{ background: '#0d1c35' }}>All Status</option>
            <option value="submitted"     style={{ background: '#0d1c35' }}>Submitted</option>
            <option value="under_review"  style={{ background: '#0d1c35' }}>Under Review</option>
            <option value="approved"      style={{ background: '#0d1c35' }}>Approved</option>
            <option value="rejected"      style={{ background: '#0d1c35' }}>Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="card p-20 text-center flex flex-col items-center">
           <FileText className="h-12 w-12 opacity-10 mb-4" />
           <p className="text-lg font-bold text-white">No applications found</p>
           <p className="text-sm font-medium mt-1" style={{ color: MUTED }}>Adjust your search or filters to see more results.</p>
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden" 
          style={{ background: '#0d1c35', border: `1px solid ${LINE}`, boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  {['ID', 'Company', 'Industry', 'Amount', 'Risk Score', 'Status', 'Date Filed', ''].map(h => (
                    <th key={h} className="px-6 py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono font-bold text-blue-400">#{app.id}</td>
                    <td className="px-6 py-4 text-sm font-black text-white">{app.company_name}</td>
                    <td className="px-6 py-4 text-xs font-bold capitalize" style={{ color: MUTED }}>{app.industry_sector}</td>
                    <td className="px-6 py-4 text-sm font-black text-white font-mono">{formatCurrency(app.requested_loan_amount)}</td>
                    <td className="px-6 py-4">
                      {app.risk_score != null ? <RiskBadge level={app.risk_level} score={app.risk_score} /> : <span style={{ color: DIM }}>--</span>}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                    <td className="px-6 py-4 text-sm font-medium" style={{ color: MUTED }}>{formatDate(app.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/officer/applications/${app.id}`} 
                        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black text-white rounded-lg transition-all"
                        style={{ background: 'linear-gradient(135deg,#2563eb,#1e40af)', boxShadow: '0 2px 10px rgba(37,99,235,0.4)' }}
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Layout>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyApplications, deleteApplication } from '../../services/api';
import Layout from '../../components/Layout';
import { StatusBadge, LoadingSpinner, formatCurrency, formatDate } from '../../components/UI';
import { FileText, ArrowRight, Trash2 } from 'lucide-react';

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Confirm permanent deletion of this application dataset?')) return;
    setDeletingId(id);
    try {
      await deleteApplication(id);
      setApplications((apps) => apps.filter((a) => a.id !== id));
    } catch (err) {
      alert('Delete operation failed.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Layout>
      <div className="mb-10">
        <h1 className="text-4xl font-black text-white tracking-tight">Portfolio Overview</h1>
        <p style={{ color: MUTED }} className="font-medium text-sm mt-1">Track and manage your submitted credit applications and underwriting progress.</p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : applications.length === 0 ? (
        <div className="rounded-3xl p-20 text-center flex flex-col items-center" style={{ background: CARD, border: `1px solid ${LINE}` }}>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
            <FileText className="h-8 w-8 text-white/20" />
          </div>
          <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">Vault is Empty</h3>
          <p className="text-sm font-medium max-w-sm mb-8" style={{ color: MUTED }}>
            You haven't submitted any applications yet. Start your journey by creating your first corporate profile.
          </p>
          <Link to="/applicant/apply" className="px-8 py-3 bg-blue-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all shadow-xl"
            style={{ background: 'linear-gradient(135deg,#2563eb, #1e40af)', boxShadow: '0 8px 30px rgba(37,99,235,0.4)' }}>
            Submit Application
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl overflow-hidden shadow-2xl" 
          style={{ background: CARD, border: `1px solid ${LINE}`, boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-white/5">
                  {['Identifier', 'Company Entity', 'Strategic Sector', 'Capital Amount', 'Current Status', 'Filed Date', 'Actions'].map(h => (
                    <th key={h} className="px-8 py-5 text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-all group">
                    <td className="px-8 py-5 text-sm font-bold font-mono text-blue-400">#{app.id}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-black text-white uppercase tracking-tight">{app.company_name}</p>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-white/50">{app.industry_sector}</td>
                    <td className="px-8 py-5 text-sm font-black text-white font-mono">{formatCurrency(app.requested_loan_amount)}</td>
                    <td className="px-8 py-5"><StatusBadge status={app.status} /></td>
                    <td className="px-8 py-5 text-xs font-bold" style={{ color: MUTED }}>{formatDate(app.created_at)}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <Link to={`/applicant/applications/${app.id}`} 
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-all">
                          Details <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          className="p-2.5 rounded-xl border border-transparent hover:border-red-500/30 hover:bg-red-500/10 text-white/10 hover:text-red-400 transition-all disabled:opacity-30"
                          onClick={() => handleDelete(app.id)}
                          disabled={deletingId === app.id}
                        >
                          {deletingId === app.id ? <span className="animate-pulse">...</span> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
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

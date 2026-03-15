import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyApplications } from '../../services/api';
import { StatusBadge, LoadingSpinner, formatCurrency, formatDate } from '../../components/UI';
import { FileText, Plus, CheckCircle2, ChevronRight, LayoutDashboard, Wallet, ArrowUpRight } from 'lucide-react';
import Layout from '../../components/Layout';

const BLUE  = '#2563eb';
const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyApplications()
      .then(({ data }) => setApplications(data))
      .catch(() => setApplications([]))
      .finally(() => setLoading(false));
  }, []);

  const totalCapital = applications.reduce((acc, app) => acc + (parseFloat(app.requested_loan_amount) || 0), 0);

  return (
    <Layout>
      {/* ── Page Header ── */}
      <div className="mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-[2px] bg-blue-500 rounded-full" />
             <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-blue-400">Portal Access Authorized</p>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            Welcome, <br/>{(user?.full_name || 'Partner').split(' ')[0]}
          </h1>
          <p className="text-sm font-medium mt-4 max-w-lg leading-relaxed" style={{ color: MUTED }}>
            Strategic partner dashboard for capital management. Track institutional loan requests and verify legal identities in real-time.
          </p>
        </div>
        
        <div className="flex gap-4">
           <div className="card px-8 py-5 flex items-center gap-6 shadow-2xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-xl">
                 <Wallet className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                 <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Exposure Portfolio</p>
                 <p className="text-2xl font-black text-white font-mono tracking-tighter">{formatCurrency(totalCapital)}</p>
              </div>
           </div>
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <Link to="/applicant/verify"
          className="card group flex items-center justify-between p-8 hover:border-blue-500/30">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/2 flex items-center justify-center border border-white/5 shadow-xl transition-all group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:border-blue-500/30">
              <CheckCircle2 className="h-7 w-7 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Identity Node</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-30 text-white">Legal Verification Matrix</p>
            </div>
          </div>
          <ArrowUpRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:text-blue-400 transition-all" />
        </Link>
        
        <Link to="/applicant/apply"
          className="card group flex items-center justify-between p-8 bg-gradient-to-br from-blue-600 to-blue-800 border-none shadow-[0_15px_40px_rgba(37,99,235,0.4)] hover:scale-[1.02]">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shadow-2xl">
              <Plus className="h-7 w-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Initialize Asset</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] mt-1 text-blue-200">Submit New Loan Sequence</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/40 group-hover:text-white transition-all mr-2" />
        </Link>
      </div>

      {/* ── Applications Panel ── */}
      {loading ? (
        <LoadingSpinner />
      ) : applications.length === 0 ? (
        <div className="card p-24 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mb-10 shadow-inner bg-blue-500/5 border border-blue-500/10">
            <FileText className="h-10 w-10 text-white opacity-10" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Zero Kinetic Assets</h3>
          <p className="mt-4 text-sm font-medium opacity-30 text-white max-w-xs mx-auto">
            Initialize your first credit sequence to begin institutional funding analysis.
          </p>
          <Link to="/applicant/apply"
            className="mt-10 px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-white shadow-2xl transition-all hover:scale-105"
            style={{ background: `linear-gradient(135deg,${BLUE},#1e40af)`, boxShadow: '0 10px 30px rgba(37,99,235,0.4)' }}>
            Submit Initial App
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden mb-20 shadow-[-20px_20px_60px_rgba(0,0,0,0.5)]">
          
          {/* table header */}
          <div className="px-10 py-8 flex items-center justify-between bg-white/2 border-b border-white/5">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Institutional Portfolio</h2>
              <p className="text-[10px] font-black mt-2 uppercase tracking-[0.2em] opacity-30 text-white">Live Asset Sequence Tracking</p>
            </div>
            <div className="px-4 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-widest">
              {applications.length} Nodes
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap">
              <thead>
                <tr className="bg-white/2" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                  {['Sequence ID','Entity Target','Asset Exposure','Logic Status','Sync Date',''].map(h => (
                    <th key={h} className="px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em]"
                      style={{ color: DIM }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {applications.map(app => (
                  <tr key={app.id} className="group hover:bg-white/2 transition-all cursor-pointer">
                    <td className="px-10 py-6 text-xs font-black font-mono text-white/30 group-hover:text-blue-500 transition-colors">#{app.id}</td>
                    <td className="px-10 py-6">
                       <p className="text-sm font-black text-white uppercase tracking-tight">{app.company_name}</p>
                       <p className="text-[9px] font-black uppercase opacity-20 text-white tracking-widest mt-1">{app.industry_sector}</p>
                    </td>
                    <td className="px-10 py-6 text-sm font-black text-white font-mono tracking-tighter">{formatCurrency(app.requested_loan_amount)}</td>
                    <td className="px-10 py-6"><StatusBadge status={app.status} /></td>
                    <td className="px-10 py-6 text-[10px] font-black uppercase tracking-widest opacity-40 text-white">{formatDate(app.created_at)}</td>
                    <td className="px-10 py-6 text-right">
                      <Link to={`/applicant/applications/${app.id}`}
                        className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-2 px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-2xl transition-all bg-white/5 border border-white/5 hover:bg-white/10">
                        Details <ChevronRight className="w-3.5 h-3.5" />
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

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getApplication, getDocuments, analyzeApplication,
  generateCAM, decideApplication,
} from '../../services/api';
import Layout from '../../components/Layout';
import { formatCurrency, formatDate } from '../../components/UI';
import {
  ArrowLeft, Download, CheckCircle2, XCircle,
  FileText, Shield, AlertTriangle, Building2,
  ScanLine, FileCheck2, Fingerprint, ChevronRight, Play
} from 'lucide-react';
import DigitalTwinSimulator from '../../components/DigitalTwinSimulator';

const BLUE  = '#2563eb';
const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

const Badge = ({ children, status }) => {
  const map = {
    'approved': 'bg-green-500/10 text-green-400 border-green-500/30',
    'rejected': 'bg-red-500/10 text-red-400 border-red-500/30',
    'under_review': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    'submitted': 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  };
  return (
    <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${map[status] || map.submitted}`}>
      {children}
    </span>
  );
};

export default function OfficerApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [deciding, setDeciding] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [appRes, docsRes] = await Promise.all([
        getApplication(id),
        getDocuments(id),
      ]);
      setApplication(appRes.data);
      setDocuments(docsRes.data);
    } catch (err) {
      setError('Failed to load application data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const { data } = await analyzeApplication(id);
      setAnalysisResult(data);
      await fetchData();
    } catch (err) {
      setError('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleDecision = async (decision) => {
    setDeciding(true);
    setError('');
    try {
      await decideApplication(id, decision);
      await fetchData();
    } catch (err) {
      setError('Decision failed. Please try again.');
    } finally {
      setDeciding(false);
    }
  };

  if (loading) return (
    <Layout>
      <div className="flex h-64 items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
      </div>
    </Layout>
  );

  if (!application) return <Layout><p className="text-white/60">Application not found.</p></Layout>;

  return (
    <Layout>
      {error && (
        <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl text-red-400 font-bold text-sm flex items-center gap-3">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}

      {/* Top Breadcrumb & Title */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link to="/officer/applications" className="inline-flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] hover:text-white transition-all mb-4 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
            <ArrowLeft className="h-3 w-3" /> Underwriting Repository
          </Link>
          <div className="flex items-center gap-5">
             <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-xl bg-gradient-to-br from-blue-600 to-blue-800 border border-blue-400/30">
               {application.company_name.substring(0,2).toUpperCase()}
             </div>
             <div>
               <div className="flex items-center gap-4 mb-1">
                 <h1 className="text-3xl font-black text-white tracking-tight">{application.company_name}</h1>
                 <Badge status={application.status}>{application.status.replace('_', ' ')}</Badge>
               </div>
               <p className="text-sm font-bold tracking-tight uppercase" style={{ color: MUTED }}>
                 App: <span className="text-white">#{application.id}</span> · Sector: <span className="text-white">{application.industry_sector}</span>
               </p>
             </div>
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex flex-wrap items-center gap-3 p-2.5 rounded-2xl shadow-2xl" style={{ background: '#0a1628', border: `1px solid ${LINE}` }}>
          <button onClick={handleAnalyze} disabled={analyzing} 
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/10 group">
            <ScanLine className={`h-4 w-4 ${analyzing ? 'animate-pulse' : 'text-blue-400'}`} /> 
            {analyzing ? 'Analysis in Progress...' : 'Execute Risk AI'}
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all border border-white/10">
            <FileCheck2 className="h-4 w-4" style={{ color: DIM }} /> Generate CAM
          </button>

          {['submitted', 'under_review'].includes(application.status) && (
            <div className="flex items-center gap-2 pl-3 border-l border-white/5">
              <button onClick={() => handleDecision('approve')} disabled={deciding} 
                className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 text-green-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-green-500/20 transition-all border border-green-500/30">
                <CheckCircle2 className="h-4 w-4" /> Approve
              </button>
              <button onClick={() => handleDecision('reject')} disabled={deciding} 
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 text-red-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-500/20 transition-all border border-red-500/30">
                <XCircle className="h-4 w-4" /> Decline
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Applicant Info & Docs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-3xl p-8" style={{ background: CARD, border: `1px solid ${LINE}`, boxShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] mb-8 flex items-center gap-3" style={{ color: DIM }}>
              <div className="w-2 h-2 rounded-full bg-blue-500" /> Corporate Profile
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { l: 'Requested Capital', v: formatCurrency(application.requested_loan_amount), mono: true, big: true },
                { l: 'Reg. Number (CIN)', v: application.cin_number, mono: true },
                { l: 'Tax ID (GSTIN)', v: application.gst_number, mono: true },
                { l: 'Business Stream', v: application.industry_sector, cap: true }
              ].map((item, idx) => (
                <div key={idx}>
                  <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: DIM }}>{item.l}</p>
                  <p className={`font-black text-white ${item.big ? 'text-2xl' : 'text-sm'} ${item.mono ? 'font-mono' : ''} ${item.cap ? 'capitalize' : ''}`}>
                    {item.v}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/5">
              <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: DIM }}>Mission & Operational Description</p>
              <p className="text-sm leading-relaxed font-medium" style={{ color: MUTED }}>{application.business_description || 'No detailed description provided.'}</p>
            </div>
          </div>

          <div className="rounded-3xl p-8" style={{ background: CARD, border: `1px solid ${LINE}` }}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.25em] mb-8 flex items-center gap-3" style={{ color: DIM }}>
              <div className="w-2 h-2 rounded-full bg-blue-500" /> Financial Intelligence Vault
            </h2>
            {documents.length === 0 ? (
               <div className="py-14 text-center rounded-2xl border-2 border-dashed border-white/5 bg-white/2 flex flex-col items-center">
                 <FileText className="w-10 h-10 mb-4 text-white/5" />
                 <p className="text-xs font-black uppercase tracking-widest" style={{ color: DIM }}>No corporate documents detected</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {documents.map(doc => (
                    <div key={doc.id} className="group p-5 rounded-2xl transition-all flex justify-between items-start border border-white/5 bg-white/5 hover:border-blue-500/30 hover:bg-blue-500/5">
                      <div className="flex gap-4 items-start">
                        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-blue-400 group-hover:scale-110 transition-transform">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-white leading-tight mb-1 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{doc.document_type}</p>
                          <p className="text-[10px] font-bold mt-1 break-all" style={{ color: DIM }}>{doc.file_name}</p>
                        </div>
                      </div>
                      <button className="p-2 rounded-lg bg-white/5 border border-white/5 text-white/40 hover:text-white transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                 ))}
               </div>
            )}
          </div>
          
          <DigitalTwinSimulator applicationId={application.id} loanAmount={application.requested_loan_amount} />
          
        </div>

        {/* Right Column: Risk AI */}
        <div className="space-y-8">
          <div className="rounded-3xl p-8 flex flex-col items-center" style={{ background: CARD, border: `1px solid ${LINE}` }}>
             <h2 className="text-[10px] font-black uppercase tracking-[0.25em] w-full mb-8 flex items-center gap-3" style={{ color: DIM }}>
              <Fingerprint className="w-4 h-4 text-blue-400" /> System Risk Score
             </h2>
             
             {application.risk_score ? (
               <div className="flex flex-col items-center w-full">
                 <div className="relative w-40 h-40 flex items-center justify-center">
                   <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                     <circle cx="80" cy="80" r="74" style={{ stroke: 'rgba(255,255,255,0.05)' }} strokeWidth="12" fill="none" />
                     <circle cx="80" cy="80" r="74" 
                       stroke={application.risk_score >= 70 ? '#10b981' : application.risk_score >= 40 ? '#f59e0b' : '#ef4444'} 
                       strokeWidth="12" fill="none" 
                       strokeDasharray={`${(application.risk_score / 100) * 465} 465`} strokeLinecap="round" 
                       className="transition-all duration-1000"
                     />
                   </svg>
                   <div className="text-center">
                     <span className="text-5xl font-black text-white tracking-tighter">{application.risk_score}</span>
                     <p className="text-[10px] font-black tracking-widest uppercase opacity-40">Score</p>
                   </div>
                 </div>
                 <div className="mt-8 w-full rounded-2xl p-4 text-center border border-white/10 bg-white/5 shadow-inner">
                    <p className="text-[9px] font-black uppercase tracking-[0.25em] mb-1" style={{ color: DIM }}>Base Risk Category</p>
                    <p className={`text-base font-black tracking-tight ${application.risk_score >= 70 ? 'text-green-400' : application.risk_score >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                      {application.risk_level.replace('_', ' ').toUpperCase()}
                    </p>
                 </div>
               </div>
             ) : (
               <div className="text-center py-12">
                 <ScanLine className="w-12 h-12 mb-4 mx-auto opacity-10 text-white" />
                 <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }}>Awaiting Underwriting</p>
               </div>
             )}
          </div>

          {(application.ai_recommendation || analysisResult?.recommendation) && (() => {
            const rec = application.ai_recommendation || analysisResult.recommendation;
            return (
              <div className="rounded-3xl p-8 relative overflow-hidden" 
                style={{ background: `linear-gradient(135deg,#0a1525 0%,#0d1c35 100%)`, border: `1px solid ${LINE}`, boxShadow: '0 8px 40px rgba(0,0,0,0.5)' }}>
                
                {/* Accent glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl pointer-events-none" />

                <h2 className="text-[10px] font-black uppercase tracking-[0.25em] mb-8 flex items-center gap-3 relative z-10" style={{ color: DIM }}>
                  <Play className="w-4 h-4 text-blue-500 fill-blue-500/20" /> Strategic Recommendation
                </h2>
                
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl mb-6 bg-white/5 border border-white/10 shadow-lg">
                    {rec.decision === 'approve' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                    <span className="font-black uppercase tracking-[0.1em] text-sm text-white">{rec.decision}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { l: 'Recommended Limit', v: formatCurrency(rec.recommended_loan_limit) },
                      { l: 'Strategic Rate', v: `${rec.suggested_interest_rate}% APR` }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-white/5 p-4 rounded-2xl border border-white/5">
                        <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: DIM }}>{item.l}</span>
                        <p className="text-lg font-black text-white font-mono mt-1 tracking-tight">{item.v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* Timeline Widget */}
          <div className="rounded-3xl p-8 shadow-xl" style={{ background: CARD, border: `1px solid ${LINE}` }}>
             <h2 className="text-[10px] font-black uppercase tracking-[0.25em] mb-8 flex items-center gap-3" style={{ color: DIM }}>
               Underwriting Milestones
             </h2>
             <div className="space-y-8 relative before:absolute before:inset-0 before:ml-2.5 before:h-full before:w-0.5 before:bg-white/5">
                <div className="relative pl-8 group">
                  <div className="absolute left-0 top-1 w-5 h-5 rounded-full border border-blue-500/40 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center justify-center z-10">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] uppercase font-black tracking-widest mb-1" style={{ color: DIM }}>{formatDate(application.created_at)}</div>
                    <div className="text-sm font-black text-white uppercase tracking-tight">Docket Filed</div>
                  </div>
                </div>
                {['approved', 'rejected'].includes(application.status) && (
                  <div className="relative pl-8 group">
                    <div className="absolute left-0 top-1 w-5 h-5 rounded-full border border-green-500/40 bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)] flex items-center justify-center z-10">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <div className="text-[9px] uppercase font-black tracking-widest mb-1" style={{ color: DIM }}>{formatDate(application.updated_at)}</div>
                      <div className="text-sm font-black text-white uppercase tracking-tight">Final Verdict</div>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

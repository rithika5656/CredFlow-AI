import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApplication, getDocuments, uploadDocument } from '../../services/api';
import Layout from '../../components/Layout';
import { StatusBadge, LoadingSpinner, formatCurrency, formatDate } from '../../components/UI';
import { Upload, FileText, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

const DOC_TYPES = [
  { value: 'gst_filing', label: 'GST Filing' },
  { value: 'income_tax_return', label: 'Income Tax Return' },
  { value: 'bank_statement', label: 'Bank Statement' },
  { value: 'annual_report', label: 'Annual Report' },
  { value: 'legal_document', label: 'Legal Document' },
];

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.1)';
const CARD  = '#0d1c35';

export default function ApplicationDetail() {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadType, setUploadType] = useState('gst_filing');
  const [uploadError, setUploadError] = useState('');
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
      setError(err.response?.data?.detail || 'Failed to load application data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadError('');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('application_id', id);
    formData.append('document_type', uploadType);

    try {
      await uploadDocument(formData);
      await fetchData();
    } catch (err) {
      setUploadError(err.response?.data?.detail || 'Upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  if (loading) return <Layout><LoadingSpinner /></Layout>;
  if (error) return <Layout><div className="p-8 text-center text-red-400 font-bold">{error}</div></Layout>;
  if (!application) return <Layout><div className="p-8 text-center text-white/40 font-bold uppercase tracking-widest">Application not found</div></Layout>;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <Link to="/applicant/applications" className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-6 transition-all" style={{ color: DIM }} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = DIM}>
              <ArrowLeft className="h-4 w-4" /> Return to Vault
            </Link>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-black text-white tracking-tight uppercase">Docket #{application.id}</h1>
              <StatusBadge status={application.status} />
            </div>
            <p style={{ color: MUTED }} className="font-medium text-sm mt-1">{application.company_name} · Global Corporate Identity</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl p-8 shadow-2xl relative overflow-hidden" 
              style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-[80px]" />
              <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8" style={{ color: DIM }}>Entity Summary</h2>
              <div className="grid grid-cols-2 gap-y-8 gap-x-12">
                {[
                  { l: 'CIN Validation', v: application.cin_number },
                  { l: 'GST Identity',  v: application.gst_number },
                  { l: 'Strategic Sector', v: application.industry_sector },
                  { l: 'Requested Capital', v: formatCurrency(application.requested_loan_amount), mono: true }
                ].map((item, idx) => (
                  <div key={idx}>
                    <p className="text-[9px] font-black uppercase tracking-widest mb-2 opacity-40 text-white">{item.l}</p>
                    <p className={`text-sm font-black text-white uppercase tracking-tight ${item.mono ? 'font-mono text-blue-400' : ''}`}>{item.v}</p>
                  </div>
                ))}
              </div>
              <div className="mt-10 pt-8 border-t border-white/5">
                <p className="text-[9px] font-black uppercase tracking-widest mb-3 opacity-40 text-white">Business Intelligence Profile</p>
                <p className="text-sm font-medium leading-relaxed" style={{ color: MUTED }}>{application.business_description || 'No strategic overview provided for this entity.'}</p>
              </div>
            </div>

            <div className="rounded-3xl p-8 shadow-2xl" style={{ background: CARD, border: `1px solid ${LINE}` }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: DIM }}>Verified Documents</h2>
                <div className="flex items-center gap-3">
                  <select
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white outline-none cursor-pointer"
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                  >
                    {DOC_TYPES.map(t => <option key={t.value} value={t.value} style={{ background: '#0d1c35' }}>{t.label}</option>)}
                  </select>
                  <label className="px-5 py-2.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all hover:scale-105 cursor-pointer flex items-center gap-2 shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}>
                    <Upload className="h-3.5 w-3.5" /> {uploading ? 'Processing...' : 'Secure Upload'}
                    <input type="file" className="hidden" accept="application/pdf" onChange={handleUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              {uploadError && <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl mb-6">{uploadError}</div>}

              {documents.length === 0 ? (
                <div className="py-12 text-center opacity-20"><FileText className="h-12 w-12 mx-auto mb-4" /><p className="text-[10px] font-black uppercase tracking-widest italic">Vault documentation empty</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left whitespace-nowrap">
                    <thead>
                      <tr className="bg-white/2 border-b border-white/5">
                        {['Class', 'Identity', 'Stamped', 'Status', ''].map(h => (
                          <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="group hover:bg-white/5 transition-all">
                          <td className="px-5 py-4 text-[10px] font-black text-white uppercase tracking-tight">{DOC_TYPES.find((d) => d.value === doc.document_type)?.label || doc.document_type}</td>
                          <td className="px-5 py-4 text-[10px] font-bold text-white/40 truncate max-w-[150px]">{doc.file_name}</td>
                          <td className="px-5 py-4 text-[10px] font-black text-white/30 font-mono tracking-tighter uppercase">{formatDate(doc.created_at)}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${doc.status === 'processed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-white/5 text-white/20 border-white/5'}`}>{doc.status}</span>
                          </td>
                          <td className="px-5 py-4 text-right">
                             <a href={doc.file_path} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-white transition-all underline decoration-blue-500/30">Review Doc</a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl p-8 shadow-2xl" style={{ background: CARD, border: `1px solid ${LINE}` }}>
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8" style={{ color: DIM }}>Decisioning Status</h2>
               <div className="flex flex-col items-center gap-6 py-6 text-center">
                 <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center relative">
                    <ShieldCheck className={`w-10 h-10 ${application.status === 'approved' ? 'text-green-500' : 'text-blue-500'} opacity-20`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                       {application.status === 'approved' ? <CheckCircle2 className="w-12 h-12 text-green-500 shadow-2xl" /> : <AlertTriangle className="w-12 h-12 text-blue-500 shadow-2xl" />}
                    </div>
                 </div>
                 <div>
                   <StatusBadge status={application.status} />
                   <p className="text-[10px] font-black uppercase tracking-widest mt-4 opacity-30 text-white">Application timestamp</p>
                   <p className="text-xs font-black text-white mt-1 uppercase tracking-tight">{formatDate(application.created_at)}</p>
                 </div>
               </div>

               {application.status === 'approved' && (
                 <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                   {[
                     { l: 'Approved Capital', v: formatCurrency(application.approved_loan_amount), blue: true },
                     { l: 'AI Fixed Rate', v: `${application.interest_rate}% p.a.`, blue: true },
                     { l: 'Clearance Date', v: formatDate(application.approval_date) }
                   ].map((item, idx) => (
                      <div key={idx}>
                        <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-40 text-white">{item.l}</p>
                        <p className={`text-sm font-black text-white uppercase tracking-tight ${item.blue ? 'text-blue-400 font-mono' : ''}`}>{item.v}</p>
                      </div>
                   ))}
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

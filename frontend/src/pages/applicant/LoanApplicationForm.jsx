import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createApplication } from '../../services/api';
import Layout from '../../components/Layout';
import { FileText, Send, Building2, Landmark, Zap } from 'lucide-react';

const SECTORS = [
  'Technology', 'Healthcare', 'Manufacturing', 'Real Estate', 'Retail',
  'Agriculture', 'Pharmaceuticals', 'Education', 'Construction', 'Logistics',
  'Textile', 'Automotive', 'FMCG', 'Telecom', 'Media', 'Mining',
  'Oil and Gas', 'Hospitality', 'Banking', 'Insurance', 'Utilities', 'Other',
];

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.06)';
const CARD  = '#0d1c35';

export default function LoanApplicationForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    company_name: '',
    cin_number: '',
    gst_number: '',
    industry_sector: '',
    requested_loan_amount: '',
    business_description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        requested_loan_amount: parseFloat(form.requested_loan_amount),
      };
      const { data } = await createApplication(payload);
      navigate(`/applicant/applications/${data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shadow-2xl">
              <Landmark className="h-8 w-8 text-blue-400" />
            </div>
            <div>
               <div className="flex items-center gap-3 mb-2">
                  <div className="w-6 h-[2px] bg-blue-500 rounded-full" />
                  <p className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40 text-blue-400">Capital intake sequence</p>
               </div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Financial Docket</h1>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest px-8 py-5 rounded-2xl mb-12 animate-in fade-in slide-in-from-top-4">
            <Zap className="w-4 h-4 inline mr-2" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-12 space-y-12 relative overflow-hidden shadow-[-40px_40px_80px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[120px] pointer-events-none" />

          <section>
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3 opacity-30 text-white">
               <Building2 className="w-4 h-4 text-blue-400" /> Entity Parameters
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {[
                { label: 'Registered Entity Name', name: 'company_name', placeholder: 'Strategic Venture Pvt Ltd' },
                { label: 'Corporate Identity (CIN)', name: 'cin_number', placeholder: 'U12345MH2020PTC123456' },
                { label: 'Taxation ID (GSTIN)', name: 'gst_number', placeholder: '27AABCU9603R1ZM' }
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">{f.label}</label>
                  <input
                    type="text"
                    name={f.name}
                    required
                    className="w-full bg-white/5 border border-white/5 px-6 py-4 text-sm font-black text-white rounded-2xl outline-none transition-all placeholder:text-white/10 focus:border-blue-500/50 focus:bg-white/10"
                    value={form[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                  />
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">Market Logic (Sector)</label>
                <div className="relative group">
                  <select
                    name="industry_sector"
                    required
                    className="w-full bg-white/5 border border-white/5 px-6 py-4 text-sm font-black text-white rounded-2xl outline-none appearance-none cursor-pointer focus:border-blue-500/50"
                    value={form.industry_sector}
                    onChange={handleChange}
                  >
                    <option value="" style={{ background: '#0a1628' }}>Select Domain</option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s} style={{ background: '#0a1628' }}>{s}</option>
                    ))}
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                     <FileText className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 bg-blue-600/5 p-8 rounded-[32px] border border-blue-500/10 shadow-inner">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-4 ml-1">Capital Transmission Velocity (₹)</label>
                <div className="relative">
                   <input
                    type="number"
                    name="requested_loan_amount"
                    required
                    min="1"
                    className="w-full bg-transparent border-none p-0 text-5xl font-black text-white outline-none transition-all placeholder:opacity-5 font-mono tracking-tighter"
                    value={form.requested_loan_amount}
                    onChange={handleChange}
                    placeholder="100,00,000"
                  />
                  <div className="absolute right-0 bottom-2 text-[10px] font-black uppercase tracking-widest opacity-20 text-white">Target Currency: INR</div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <label className="block text-[10px] font-black uppercase tracking-[0.4em] mb-4 ml-1 opacity-30 text-white">Mission Statement & Purpose</label>
            <textarea
              name="business_description"
              rows={6}
              className="w-full bg-white/5 border border-white/5 px-8 py-6 text-sm font-medium text-white rounded-[32px] outline-none transition-all placeholder:text-white/10 leading-relaxed shadow-inner focus:border-blue-500/30"
              value={form.business_description}
              onChange={handleChange}
              placeholder="Provide context on core operations, revenue trajectory, and strategic requirement for specified capital..."
            />
          </section>

          <div className="flex justify-end items-center gap-10 pt-10 border-t border-white/5">
            <button type="button" 
              className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all text-slate-500 hover:text-white"
              onClick={() => navigate(-1)}
            >
              Abort sequence
            </button>
            <button type="submit" 
              className="px-12 py-5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-4 shadow-2xl"
              style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', boxShadow: '0 15px 40px rgba(37,99,235,0.4)' }}
              disabled={loading}
            >
              {loading ? 'Synthesizing...' : 'Authorize Submission'}
              {!loading && <Send className="h-5 w-5 opacity-40" />}
            </button>
          </div>
        </form>
        
        <p className="text-center text-[9px] font-black text-white/10 mt-12 tracking-[0.5em] uppercase">SECURE DATA TRANSMISSION · PGP ENCRYPTED</p>
      </div>
    </Layout>
  );
}

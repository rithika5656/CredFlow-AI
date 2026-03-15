import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, CheckCircle2, ChevronRight } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('bank_officer');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginUser({ email: form.email, password: form.password });
      login(data.access_token, data.user);
      if (data.user.role === 'bank_officer') navigate('/officer/dashboard');
      else navigate('/applicant/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#050e1f]" style={{ fontFamily: "'Inter', sans-serif" }}>
      
      {/* ══ LEFT PANEL — Branding ══ */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden bg-[#071020]" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        {/* Animated Background Orbs */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[130px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[110px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-20 xl:p-28">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[22px] bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.6)] border border-white/10">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <span className="text-white text-3xl font-black tracking-tighter uppercase leading-none">Intelli-Credit</span>
          </div>

          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-[2px] bg-blue-500 rounded-full" />
               <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Next-Gen Underwriting OS</p>
            </div>
            <h1 className="text-6xl xl:text-7xl font-black text-white leading-[0.9] mb-10 tracking-tighter uppercase">
              Engineered <br/><span className="text-blue-500">Capital</span> Trust
            </h1>
            <p className="text-blue-100/40 text-lg leading-relaxed mb-12 font-medium max-w-md">
              The institutional standard for automated credit appraisal and real-time risk intelligence.
            </p>
            
            <div className="space-y-6">
              {[
                'Strategic Loan Decisioning',
                'AI-Driven Risk Matrices',
                'Global Compliance Integration',
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 group cursor-default">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shadow-[0_0_10px_#2563eb] transition-transform group-hover:scale-150" />
                  <span className="text-white/60 text-[11px] font-black uppercase tracking-[0.2em] group-hover:text-white transition-colors">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8 opacity-20">
             <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white">SECURE ENCLAVE V4.2</p>
             <div className="h-[1px] flex-1 bg-white/20" />
             <p className="text-[9px] font-black tracking-[0.4em] uppercase text-white">TLS 1.3 ENCRYPTED</p>
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — Login Form ══ */}
      <div className="w-full lg:w-2/5 flex items-center justify-center p-8 sm:p-16 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="card p-12 sm:p-16 shadow-[0_30px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 blur-[80px] -mr-20 -mt-20 pointer-events-none" />
            
            <div className="mb-14 text-center lg:text-left">
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase mb-4">Authorize</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: '#4c7dd4' }}>Identify node synchronization</p>
            </div>

            {/* ── Role Switcher ── */}
            <div className="flex bg-white/5 p-1 rounded-3xl mb-10 border border-white/5 backdrop-blur-sm">
              <button 
                type="button" 
                onClick={() => setRole('bank_officer')}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${role === 'bank_officer' ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]' : 'text-white/30 hover:text-white/60'}`}
              >
                Officer
              </button>
              <button 
                type="button" 
                onClick={() => setRole('applicant')}
                className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${role === 'applicant' ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]' : 'text-white/30 hover:text-white/60'}`}
              >
                Applicant
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-black uppercase tracking-widest px-6 py-4 rounded-2xl mb-10 animate-in fade-in slide-in-from-top-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 ml-1">Access Protocol ({role === 'bank_officer' ? 'Officer' : 'Applicant'})</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-500 text-white/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-[24px] pl-14 pr-6 py-5 text-sm font-black text-white outline-none transition-all placeholder:text-white/10 focus:border-blue-500 focus:bg-white/10"
                    placeholder={role === 'bank_officer' ? "officer@bank.xyz" : "applicant@corp.xyz"}
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-3 ml-1">Security Cipher (Key)</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-blue-500 text-white/20">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full bg-white/5 border border-white/5 rounded-[24px] pl-14 pr-16 py-5 text-sm font-black text-white outline-none transition-all placeholder:text-white/10 focus:border-blue-500 focus:bg-white/10"
                    placeholder="••••••••••••"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-all p-2"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 rounded-[28px] text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 relative overflow-hidden group shadow-[0_15px_40px_rgba(37,99,235,0.4)] active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)' }}
                >
                  <span className="relative z-10">{loading ? 'Synchronizing...' : 'Establish Link'}</span>
                  {!loading && <ChevronRight className="h-5 w-5 relative z-10 transition-transform group-hover:translate-x-1" />}
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </form>

            <div className="mt-12 pt-8 border-t border-white/5 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 opacity-40">
                New Identity Request?{' '}
                <Link to="/register" className="text-white hover:text-blue-400 transition-all border-b border-white/20 hover:border-blue-400 ml-2">
                  Initialize Profile
                </Link>
              </p>
            </div>
          </div>
          
          <p className="text-center text-[9px] font-black text-white/10 mt-12 tracking-[0.5em] uppercase">SYSTEM CORE V4.2.1 · LIVE STATUS: OPTIMAL</p>
        </div>
      </div>
    </div>
  );
}

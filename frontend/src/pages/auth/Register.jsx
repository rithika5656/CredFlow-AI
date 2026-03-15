import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/api';
import { Shield, Mail, Lock, User, Building2, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    company_name: '',
    role: 'applicant',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await registerUser(form);
      login(data.access_token, data.user);
      navigate(data.user.role === 'bank_officer' ? '/officer/dashboard' : '/applicant/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#050e1f' }}>
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#071020]" style={{ borderRight: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/30 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col justify-between w-full p-16 xl:p-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.5)]">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <span className="text-white text-2xl font-black tracking-tighter uppercase">Intelli-Credit</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-5xl xl:text-6xl font-black text-white leading-tight mb-8 tracking-tighter uppercase">
              Start Your <br/>Credit Journey
            </h1>
            <p className="text-blue-400 text-sm font-black tracking-[0.2em] mb-6 uppercase">Unified Underwriting Platform</p>
            <p className="text-blue-200/60 text-lg leading-relaxed mb-12 font-medium">
              Join the future of corporate credit decisioning. Seamless intake, real-time risk intelligence, and automated appraisal memos.
            </p>
            <div className="space-y-4">
              {[
                'Strategic Loan Decisioning',
                'AI-Driven Risk Matrices',
                'Global Compliance Integration',
              ].map((item) => (
                <div key={item} className="flex items-center gap-4 group">
                  <div className="w-2 h-2 rounded-full bg-blue-500 group-hover:scale-150 transition-transform" />
                  <span className="text-white/60 text-sm font-bold tracking-tight group-hover:text-white transition-colors uppercase">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-white/20 text-[10px] tracking-[0.3em] font-black uppercase">Secure Enclave v4.2</p>
        </div>
      </div>

      {/* Right Panel — Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 relative">
        <div className="w-full max-w-md relative z-10">
          <div className="rounded-3xl p-10 sm:p-12 shadow-2xl relative overflow-hidden" 
            style={{ background: '#0d1c35', border: '1px solid rgba(255,255,255,0.08)' }}>
            
            <div className="mb-10 text-center sm:text-left">
              <h2 className="text-3xl font-black text-white tracking-tight uppercase">Create Account</h2>
              <p className="text-sm font-bold mt-2" style={{ color: '#4c7dd4' }}>Initialize your corporate credit identity</p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold px-5 py-4 rounded-2xl mb-8 animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { label: 'Full Name', name: 'full_name', type: 'text', icon: User, placeholder: 'Strategic Officer / Founder' },
                { label: 'Email Node', name: 'email', type: 'email', icon: Mail, placeholder: 'name@enterprise.com' },
                { label: 'Security Key', name: 'password', type: 'password', icon: Lock, placeholder: '••••••••' },
                { label: 'Corporate Entity', name: 'company_name', type: 'text', icon: Building2, placeholder: 'Acme Corp Pvt Ltd' }
              ].map(f => (
                <div key={f.name}>
                  <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">{f.label}</label>
                  <div className="relative group">
                    <f.icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-white/20 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type={f.type === 'password' && showPassword ? 'text' : f.type}
                      name={f.name}
                      required
                      className="w-full bg-white/5 border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold text-white outline-none transition-all placeholder:text-white/10 focus:border-blue-500 focus:bg-white/10"
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.placeholder}
                      minLength={f.type === 'password' ? 8 : undefined}
                    />
                    {f.type === 'password' && (
                       <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 hover:text-white transition-colors"
                       >
                         {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                       </button>
                    )}
                  </div>
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-2 ml-1">Account Protocol</label>
                <select
                  name="role"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-4 py-3.5 text-sm font-black text-white outline-none appearance-none cursor-pointer focus:border-blue-500 h-[52px]"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="applicant" style={{ background: '#0d1c35' }}>LOAN APPLICANT</option>
                  <option value="bank_officer" style={{ background: '#0d1c35' }}>BANK OFFICER</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] transition-all flex items-center justify-center gap-3 mt-4 shadow-xl active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #2563eb, #1e40af)', boxShadow: '0 8px 30px rgba(37,99,235,0.4)' }}
              >
                {loading ? 'Initializing Interface...' : 'Authorize Account'}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="text-center text-[10px] font-black uppercase tracking-widest text-[#4c7dd4]/40 mt-10">
              Existing identity?{' '}
              <Link to="/login" className="text-white hover:text-blue-400 transition-colors border-b border-white/10 hover:border-blue-400/50 pb-0.5 ml-1">
                Sign in
              </Link>
            </p>
          </div>

          <p className="text-center text-[9px] font-black text-white/10 mt-8 tracking-[0.3em] uppercase">Secure Access Portal · TLS 1.3 ENCRYPTED</p>
        </div>
      </div>
    </div>
  );
}

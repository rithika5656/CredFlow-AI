import { AlertTriangle, CheckCircle2, Info, XCircle, Loader2, FileText, ChevronRight } from 'lucide-react';

/* ── Status Badge ────────────────────────────────────────────────────────── */
export const StatusBadge = ({ status }) => {
  const map = {
    submitted:    { label: 'Pending Initialization',  bg: 'bg-blue-500/10',  text: 'text-blue-400',  border: 'border-blue-500/20' },
    under_review: { label: 'Risk Analysis Active',      bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    approved:     { label: 'Capital Cleared',           bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' },
    rejected:     { label: 'Risk Terminated',           bg: 'bg-red-500/10',   text: 'text-red-400',   border: 'border-red-500/20' },
  };
  const c = map[status] || map.submitted;
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.15em] border ${c.bg} ${c.text} ${c.border} shadow-lg shadow-black/20`}>
      <div className={`w-1 h-1 rounded-full mr-2 animate-pulse bg-current`} />
      {c.label}
    </span>
  );
};

/* ── Risk Badge ────────────────────────────────────────────────────────── */
export const RiskBadge = ({ level, score }) => {
  const map = {
    Safe:        { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
    'Low Risk':  { bg: 'bg-green-500/10',  text: 'text-green-400',  border: 'border-green-500/20' },
    'Medium Risk': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    'High Risk':   { bg: 'bg-red-500/10',   text: 'text-red-400',   border: 'border-red-500/20' },
  };
  const c = map[level] || map['Medium Risk'];
  return (
    <div className={`inline-flex items-center gap-3 px-4 py-1.5 rounded-xl border ${c.bg} ${c.text} ${c.border} shadow-xl`}>
      <span className="text-[10px] font-black uppercase tracking-widest leading-none">{level}</span>
      <div className="w-[1px] h-3 bg-white/10" />
      <span className="text-xs font-black font-mono leading-none">{score}</span>
    </div>
  );
};

/* ── Stat Card ────────────────────────────────────────────────────────── */
export const StatCard = ({ label, value, icon: Icon, color = 'blue', trend }) => {
  return (
    <div className="card group relative overflow-hidden p-8 hover:-translate-y-1">
      <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 bg-${color}-500 transition-opacity group-hover:opacity-20`} />
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3.5 rounded-2xl bg-${color}-500/10 border border-${color}-500/20 shadow-xl`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
        {trend && (
           <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">{trend}</span>
        )}
      </div>
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">{label}</p>
      <h3 className="text-3xl font-black text-white tracking-tighter uppercase">{value}</h3>
    </div>
  );
};

/* ── Loading Spinner ──────────────────────────────────────────────────── */
export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center p-20 min-h-[400px]">
    <div className="relative">
      <div className="w-16 h-16 rounded-3xl border-2 border-blue-500/10 animate-pulse" />
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin absolute inset-0 m-auto" />
    </div>
    <p className="mt-8 text-[11px] font-black text-blue-400 uppercase tracking-[0.4em] animate-pulse">Synchronizing Session</p>
  </div>
);

/* ── Empty State ──────────────────────────────────────────────────────── */
export const EmptyState = ({ title, desc }) => (
  <div className="card p-24 text-center flex flex-col items-center">
    <div className="w-20 h-20 rounded-full bg-white/2 border border-white/5 flex items-center justify-center mb-8 shadow-inner">
      <FileText className="w-10 h-10 text-white opacity-10" />
    </div>
    <h3 className="text-xl font-black text-white uppercase tracking-tight">{title}</h3>
    <p className="mt-4 text-sm font-medium max-w-xs leading-relaxed opacity-40 text-blue-100">{desc}</p>
  </div>
);

/* ── Utils ────────────────────────────────────────────────────────────── */
export const formatCurrency = (val) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export const formatDate = (dateString) => {
  if (!dateString) return '--';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'SHORT',
    year: 'numeric'
  }).toUpperCase();
};

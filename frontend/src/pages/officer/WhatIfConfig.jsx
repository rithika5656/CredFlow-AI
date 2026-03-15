import { useState } from 'react';
import Layout from '../../components/Layout';
import WhatIfSimulator from '../../components/WhatIfSimulator';
import { Search, Zap } from 'lucide-react';

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';

export default function WhatIfConfig() {
  const [appId, setAppId] = useState('1'); 

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <Zap className="h-6 w-6 text-amber-500 fill-amber-500/20" />
          <h1 className="text-3xl font-black text-white tracking-tight">Enterprise What-If Simulator</h1>
        </div>
        <p style={{ color: MUTED }} className="font-medium text-sm">Standalone simulation environment for hypothetical borrower stress testing.</p>
      </div>

      <div className="rounded-2xl p-6 mb-8 flex items-center gap-6 overflow-hidden relative"
        style={{ background: '#0d1c35', border: `1px solid ${LINE}`, boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl pointer-events-none" />

        <div className="flex-1 max-w-sm relative z-10">
          <label className="block text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: DIM }}>
            Test Specific Application ID
          </label>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: MUTED }} />
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold rounded-xl outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${LINE}`, color: '#fff' }}
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              placeholder="e.g. 1"
              onFocus={e => e.target.style.borderColor = '#2563eb'}
              onBlur={e => e.target.style.borderColor = LINE}
            />
          </div>
        </div>

        <div className="flex-1 relative z-10">
          <p className="text-sm font-medium leading-relaxed" style={{ color: MUTED }}>
            Running the simulator here will run standalone macroeconomic stress tests. 
            To run on actual borrower data seamlessly, navigate through the Application Pipeline.
          </p>
        </div>
      </div>

      <div className="max-w-6xl">
        <WhatIfSimulator applicationId={appId} loanAmount={5000000} />
      </div>
    </Layout>
  );
}

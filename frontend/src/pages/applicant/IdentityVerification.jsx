import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { ShieldCheck, Upload, Camera, CheckCircle, AlertCircle, RefreshCcw, UserCheck, Search, Zap } from 'lucide-react';

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

export default function IdentityVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState('upload'); // upload, selfie, processing, success
  const [docUploaded, setDocUploaded] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const webcamRef = useRef(null);

  const facePoints = [
    { x: 45, y: 35 }, { x: 55, y: 35 }, 
    { x: 50, y: 45 }, 
    { x: 42, y: 55 }, { x: 50, y: 58 }, { x: 58, y: 55 }, 
    { x: 50, y: 30 }, { x: 40, y: 38 }, { x: 60, y: 38 }, { x: 50, y: 65 }, 
  ];

  useEffect(() => {
    if (step === 'processing') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.8;
        setMatchPercentage(Math.floor(progress));
        if (progress >= 98) {
          clearInterval(interval);
          setTimeout(() => setStep('success'), 1000);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [step]);

  const handleUpload = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setDocUploaded(true);
      setIsProcessing(false);
      setStep('selfie');
    }, 1500);
  };

  const handleSelfieCapture = () => {
    setStep('processing');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
             <Zap className="w-8 h-8 text-blue-500 fill-blue-500/20" />
             <h1 className="text-4xl font-black text-white tracking-tight uppercase">Biometric Gateway</h1>
          </div>
          <p style={{ color: MUTED }} className="mt-2 max-w-2xl mx-auto font-medium text-sm">
            AI-powered biometric matching engine verifying corporate identity against immutable government ledger records.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center space-x-6">
            {[
              { s: 'upload', l: 'Social ID', n: '1' },
              { s: 'selfie', l: 'Live Biometrics', n: '2' },
              { s: 'success', l: 'Verification', n: '3' }
            ].map((st, i) => {
              const active = step === st.s || (st.s === 'selfie' && (step === 'processing' || step === 'success')) || (st.s === 'upload' && step !== 'upload');
              const done = (st.s === 'upload' && step !== 'upload') || (st.s === 'selfie' && step === 'success');
              
              return (
                <React.Fragment key={st.s}>
                  <div className={`flex items-center gap-3 ${active ? 'text-white' : 'text-white/20'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all duration-500 border-2 
                      ${active ? 'bg-blue-600 border-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'bg-white/5 border-white/5'}`}>
                      {done ? <CheckCircle className="w-5 h-5 text-white" /> : st.n}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{st.l}</span>
                  </div>
                  {i < 2 && <div className="w-16 h-0.5 rounded-full bg-white/5 overflow-hidden"><div className={`h-full bg-blue-600 transition-all duration-500 ${active ? 'w-full' : 'w-0'}`} /></div>}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Doc */}
          <div className={`rounded-3xl p-8 transition-all duration-500 ${step === 'upload' ? 'bg-blue-600/10 border-blue-500/40' : 'bg-[#0d1c35] opacity-40'} border`}
            style={{ border: step === 'upload' ? undefined : `1px solid ${LINE}` }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-white text-[10px] uppercase tracking-widest flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-blue-400" /> Government ID
              </h3>
              {docUploaded && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>
            
            <div className="relative border-2 border-dashed border-white/10 rounded-2xl aspect-[1.5/1] flex flex-col items-center justify-center bg-white/2 overflow-hidden group">
              {docUploaded ? (
                <div className="relative w-full h-full p-4">
                   <div className="w-full h-full bg-[#0a1628] rounded-xl border border-white/10 p-5 flex flex-col justify-between overflow-hidden shadow-2xl">
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-lg bg-blue-500/20 border border-blue-500/40 relative overflow-hidden">
                           <div className="absolute inset-0 bg-blue-400/10 animate-pulse" />
                        </div>
                        <div className="space-y-2 mt-1">
                          <div className="w-24 h-2 bg-white/10 rounded" />
                          <div className="w-16 h-1.5 bg-white/5 rounded" />
                        </div>
                      </div>
                      <div className="flex justify-between items-end opacity-20">
                         <div className="text-[7px] text-white font-black uppercase tracking-[0.3em]">REPUBLIC OF INDIA</div>
                         <div className="w-4 h-4 rounded-full border border-white/40" />
                      </div>
                   </div>
                   <div className="scanner-line h-0.5 bg-blue-400/50 shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                </div>
              ) : (
                <div className="text-center p-6 flex flex-col items-center">
                  <div className="w-16 h-16 bg-blue-600/10 text-blue-400 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all border border-blue-500/20 shadow-xl">
                    <Upload className="w-7 h-7" />
                  </div>
                  <p className="text-xs font-black text-white uppercase tracking-widest">Aadhaar / PAN Input</p>
                  <p className="text-[10px] font-bold mt-2" style={{ color: DIM }}>RAW IMAGE · ENCRYPTED</p>
                  <button onClick={handleUpload} disabled={isProcessing}
                    className="mt-8 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all shadow-xl">
                    {isProcessing ? 'Synthesizing...' : 'Upload Data'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Center: AI Matching */}
          <div className="rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
            style={{ background: CARD, border: `1px solid ${LINE}` }}>
            <div className="absolute inset-0 bg-blue-600/5 blur-[100px] pointer-events-none" />
            
            <div className="relative w-52 h-52 mb-10 z-10 flex items-center justify-center">
               <div className="absolute inset-0 border border-blue-500/10 rounded-full animate-ping group-hover:block" />
               <div className="absolute inset-2 border-2 border-blue-500/20 border-dashed rounded-full animate-spin-slow" />
               
               <div className="relative w-36 h-36 bg-[#0a1628] rounded-full border-4 border-white/5 shadow-2xl flex items-center justify-center overflow-hidden">
                  {step === 'processing' || step === 'success' ? (
                    <div className="w-full h-full relative">
                       {facePoints.map((p, i) => (
                         <div key={i} className="face-mesh-dot bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" 
                           style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: Math.random() * 0.8 + 0.2 }} />
                       ))}
                       <div className="scanner-line !h-[1px] bg-blue-400/80" />
                       <UserCheck className={`w-16 h-16 ${step === 'success' ? 'text-green-500' : 'text-blue-500'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20`} />
                    </div>
                  ) : (
                    <Search className="w-14 h-14 opacity-10 text-white" />
                  )}
               </div>
               
               <div className="absolute -top-4 px-3 py-1 bg-blue-600 text-[9px] text-white rounded-lg font-black tracking-widest shadow-xl uppercase">
                  AI Face-Match 4.0
               </div>
            </div>

            <div className="text-center z-10 w-full px-4">
               <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Biometric Match</span>
                  <span className={`text-xs font-black font-mono ${matchPercentage > 90 ? 'text-green-400' : 'text-blue-400'}`}>
                    {matchPercentage}%
                  </span>
               </div>
               <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div className={`h-full transition-all duration-300 relative ${matchPercentage > 90 ? 'bg-green-500' : 'bg-blue-600'}`}
                    style={{ width: `${matchPercentage}%`, boxShadow: '0 0 15px rgba(37,99,235,0.4)' }} />
               </div>
               
               <div className="mt-10 min-h-[40px]">
                  {step === 'processing' ? (
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCcw className="w-5 h-5 text-blue-500 animate-spin" />
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.25em] animate-pulse">Running Topology Scans...</span>
                    </div>
                  ) : step === 'success' ? (
                    <div className="flex flex-col items-center gap-3 scale-110 transition-transform">
                       <CheckCircle className="w-10 h-10 text-green-500 shadow-2xl" />
                       <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.25em]">Verified Identity</span>
                    </div>
                  ) : (
                    <div className="text-[9px] font-black uppercase tracking-[0.3em]" style={{ color: DIM }}>No Signal Input</div>
                  )}
               </div>
            </div>
          </div>

          {/* Right: Camera */}
          <div className={`rounded-3xl p-8 transition-all duration-500 ${(step === 'selfie' || step === 'processing') ? 'bg-blue-600/10 border-blue-500/40' : 'bg-[#0d1c35] opacity-40'} border`}
            style={{ border: (step === 'selfie' || step === 'processing') ? undefined : `1px solid ${LINE}` }}>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-white text-[10px] uppercase tracking-widest flex items-center gap-3">
                <Camera className="w-5 h-5 text-blue-400" /> Biometric Sync
              </h3>
              {(step === 'processing' || step === 'success') && <CheckCircle className="w-5 h-5 text-green-400" />}
            </div>

            <div className="relative border-2 border-dashed border-white/5 rounded-3xl aspect-[1.5/1] flex flex-col items-center justify-center bg-[#071020] overflow-hidden shadow-inner">
               {step === 'upload' ? (
                 <div className="text-center p-4">
                    <Camera className="w-10 h-10 text-white/5 mx-auto mb-4" />
                    <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">Awaiting Doc Verification</p>
                 </div>
               ) : (
                 <div className="relative w-full h-full">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                       <div className="w-32 h-44 border-2 border-blue-400/20 rounded-[60px] relative">
                          <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-blue-600/20 backdrop-blur-md rounded-xl text-[8px] text-blue-100 font-black tracking-widest border border-blue-500/30 whitespace-nowrap">
                             STAY IN CENTER
                          </div>
                       </div>
                    </div>
                    
                    {step === 'processing' && (
                       <div className="absolute inset-0 z-30">
                          {facePoints.map((p, i) => (
                            <div key={i} className="face-mesh-dot bg-blue-400 shadow-xl scale-125" style={{ left: `${p.x}%`, top: `${p.y}%` }} />
                          ))}
                          <div className="scanner-line h-0.5 bg-blue-400/40" />
                       </div>
                    )}

                    <div className="absolute bottom-6 left-6 z-40 flex items-center gap-2">
                       <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shadow-[0_0_12px_red]" />
                       <span className="text-[9px] text-white font-black tracking-widest uppercase">Biometric Live Feed</span>
                    </div>
                    <div className="absolute inset-0 bg-white/2 mix-blend-overlay opacity-30" />
                 </div>
               )}
            </div>

            <div className="mt-8">
              <button onClick={handleSelfieCapture} disabled={step !== 'selfie'}
                className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 flex items-center justify-center gap-3 shadow-2xl
                  ${step === 'selfie' 
                    ? 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105' 
                    : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/5'
                  }`}>
                <Camera className="w-5 h-5 fill-white/10" />
                Initialize Biometrics
              </button>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-16 flex justify-between items-center p-8 rounded-3xl" style={{ background: CARD, border: `1px solid ${LINE}` }}>
           <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center shadow-xl">
                 <ShieldCheck className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                 <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Deep-Security Matrix</p>
                 <p className="text-sm font-black text-white tracking-tight uppercase">Quantum-Resistant AES-256 Protocol</p>
              </div>
           </div>

           <div className="flex gap-6 items-center">
              <button className="text-[10px] font-black uppercase tracking-widest" style={{ color: DIM }} onClick={() => navigate(-1)} onMouseEnter={e => e.currentTarget.style.color = '#fff'} onMouseLeave={e => e.currentTarget.style.color = DIM}>
                Abort
              </button>
              {step === 'success' && (
                <button 
                  className="px-10 py-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 30px rgba(16,185,129,0.4)' }}
                  onClick={() => navigate('/applicant/dashboard')}
                >
                  Confirm & Finalize
                </button>
              )}
           </div>
        </div>
      </div>
    </Layout>
  );
}

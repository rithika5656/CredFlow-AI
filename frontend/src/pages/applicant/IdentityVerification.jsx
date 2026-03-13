import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { ShieldCheck, Upload, Camera, CheckCircle, AlertCircle, RefreshCcw, UserCheck, Search } from 'lucide-react';

export default function IdentityVerification() {
  const navigate = useNavigate();
  const [step, setStep] = useState('upload'); // upload, selfie, processing, success
  const [docUploaded, setDocUploaded] = useState(false);
  const [matchPercentage, setMatchPercentage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const webcamRef = useRef(null);

  // Simulated face mesh coordinates for the "center" module
  const facePoints = [
    { x: 45, y: 35 }, { x: 55, y: 35 }, // eyes
    { x: 50, y: 45 }, // nose
    { x: 42, y: 55 }, { x: 50, y: 58 }, { x: 58, y: 55 }, // mouth
    { x: 50, y: 30 }, { x: 40, y: 38 }, { x: 60, y: 38 }, { x: 50, y: 65 }, // face outline/jaw
  ];

  useEffect(() => {
    if (step === 'processing') {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setMatchPercentage(Math.floor(progress));
        if (progress >= 98) {
          clearInterval(interval);
          setTimeout(() => setStep('success'), 1000);
        }
      }, 50);
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
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Biometric Identity Verification</h1>
          <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
            Secure AI-powered face matching system to verify your identity against government-issued documents.
          </p>
        </div>

        {/* Verification Status Stepper */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center gap-2 ${step !== 'upload' ? 'text-green-600' : 'text-primary-600'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === 'upload' ? 'bg-primary-600 text-white' : 'bg-green-50'}`}>
                {step !== 'upload' ? <CheckCircle className="w-5 h-5" /> : '1'}
              </div>
              <span className="font-medium">Social ID</span>
            </div>
            <div className={`w-12 h-px bg-gray-200`} />
            <div className={`flex items-center gap-2 ${step === 'selfie' ? 'text-primary-600' : step === 'processing' || step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === 'selfie' ? 'bg-primary-600 text-white' : step === 'processing' || step === 'success' ? 'bg-green-50' : 'bg-gray-50'}`}>
                {step === 'processing' || step === 'success' ? <CheckCircle className="w-5 h-5" /> : '2'}
              </div>
              <span className="font-medium">Live Selfie</span>
            </div>
            <div className={`w-12 h-px bg-gray-200`} />
            <div className={`flex items-center gap-2 ${step === 'success' ? 'text-green-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${step === 'success' ? 'bg-green-50 text-green-600' : 'bg-gray-50'}`}>
                {step === 'success' ? <CheckCircle className="w-5 h-5" /> : '3'}
              </div>
              <span className="font-medium">Verified</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Left Panel: Document Upload */}
          <div className={`glass-card rounded-2xl p-6 transition-all duration-500 ${step === 'upload' ? 'ring-2 ring-primary-500' : 'opacity-80'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
                Document Verification
              </h3>
              {docUploaded && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
            
            <div className="relative border-2 border-dashed border-gray-200 rounded-xl aspect-[1.5/1] flex flex-col items-center justify-center bg-gray-50/50 overflow-hidden group">
              {docUploaded ? (
                <div className="relative w-full h-full p-4">
                   <div className="w-full h-full bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                      {/* Simulated Aadhaar Card */}
                      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white p-4 relative">
                        <div className="w-12 h-16 bg-gray-200 rounded mb-2" />
                        <div className="space-y-1.5 ">
                          <div className="w-24 h-2 bg-gray-200 rounded" />
                          <div className="w-32 h-2 bg-gray-100 rounded" />
                        </div>
                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                           <div className="text-[8px] text-gray-400">Government of India</div>
                           <div className="w-8 h-8 bg-gray-100 rounded" />
                        </div>
                      </div>
                   </div>
                   <div className="scanner-line" />
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Upload Aadhaar / PAN Card</p>
                  <p className="text-xs text-gray-500 mt-1">JPEG, PNG or PDF up to 5MB</p>
                  <button 
                    onClick={handleUpload}
                    disabled={isProcessing}
                    className="mt-6 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    {isProcessing ? 'Reading Card...' : 'Select Document'}
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-4">
               <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Ensure the document photo is clear and well-lit. All four corners should be visible.
                  </p>
               </div>
            </div>
          </div>

          {/* Center Panel: AI Comparison Module */}
          <div className="relative flex flex-col">
             <div className="glass-card rounded-2xl p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-white to-gray-50/50">
                <div className="absolute inset-0 radial-glow pointer-events-none" />
                
                <div className="relative w-48 h-48 mb-8 z-10">
                   {/* AI Recognition Visualizer */}
                   <div className="absolute inset-0 border-[3px] border-primary-100 rounded-full animate-pulse" />
                   <div className="absolute inset-2 border border-primary-200 border-dashed rounded-full" />
                   
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-32 h-32 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-white overflow-hidden">
                         {step === 'processing' || step === 'success' ? (
                           <div className="w-full h-full relative">
                              {/* Simulated face mesh points */}
                              {facePoints.map((p, i) => (
                                <div 
                                  key={i} 
                                  className="face-mesh-dot" 
                                  style={{ left: `${p.x}%`, top: `${p.y}%`, opacity: Math.random() * 0.5 + 0.5 }} 
                                />
                              ))}
                              <div className="scanner-line !h-[2px]" />
                              <UserCheck className={`w-12 h-12 ${step === 'success' ? 'text-green-500' : 'text-primary-500'} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20`} />
                           </div>
                         ) : (
                           <Search className="w-12 h-12 text-gray-200" />
                         )}
                      </div>
                   </div>

                   {/* Orbital labels */}
                   <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-blue-600 text-[10px] text-white rounded-full font-bold shadow-sm whitespace-nowrap">
                      AI FACE ENGINE 2.0
                   </div>
                </div>

                <div className="text-center z-10 w-full px-4">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-gray-400 tracking-wider">SIMILARITY MATCH</span>
                      <span className={`text-[10px] font-bold ${matchPercentage > 90 ? 'text-green-600' : 'text-primary-600'}`}>
                        {matchPercentage}%
                      </span>
                   </div>
                   <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-100">
                      <div 
                        className={`h-full transition-all duration-300 relative ${matchPercentage > 90 ? 'bg-green-500' : 'bg-primary-500'}`}
                        style={{ width: `${matchPercentage}%` }}
                      >
                         <div className="absolute inset-0 progress-shimmer" />
                      </div>
                   </div>
                   
                   <div className="mt-8">
                      {step === 'processing' ? (
                        <div className="flex flex-col items-center gap-2">
                          <RefreshCcw className="w-5 h-5 text-primary-500 animate-spin" />
                          <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest animate-pulse">Analyzing Biometrics...</span>
                        </div>
                      ) : step === 'success' ? (
                        <div className="flex flex-col items-center gap-2 animate-bounce">
                           <div className="bg-green-100 text-green-600 p-2 rounded-full">
                              <CheckCircle className="w-6 h-6" />
                           </div>
                           <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Verification Complete</span>
                        </div>
                      ) : (
                        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Awaiting Biometric Data</div>
                      )}
                   </div>
                </div>
             </div>
          </div>

          {/* Right Panel: Live Selfie Capture */}
          <div className={`glass-card rounded-2xl p-6 transition-all duration-500 ${(step === 'selfie' || step === 'processing') ? 'ring-2 ring-primary-500' : 'opacity-80'}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-600" />
                Live Biometric Capture
              </h3>
              {(step === 'processing' || step === 'success') && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>

            <div className="relative border-2 border-dashed border-gray-200 rounded-xl aspect-[1.5/1] flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
               {step === 'upload' ? (
                 <div className="text-center p-4">
                    <Camera className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">Camera Locked</p>
                 </div>
               ) : (
                 <div className="relative w-full h-full">
                    {/* Simulated Webcam View */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    {/* Centered Profile Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                       <div className="w-40 h-52 border-2 border-white/30 rounded-[60px] relative pointer-events-none">
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 px-3 py-1 bg-white/10 backdrop-blur rounded-full text-[8px] text-white font-bold tracking-widest border border-white/20">
                             POSITION FACE HERE
                          </div>
                       </div>
                    </div>
                    
                    {/* Facial Landmark Tracking simulation */}
                    {step === 'processing' && (
                       <div className="absolute inset-0 z-20">
                          {facePoints.map((p, i) => (
                            <div 
                              key={i} 
                              className="face-mesh-dot glow-point" 
                              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: 'scale(1.5)' }} 
                            />
                          ))}
                          <div className="scanner-line border-t border-primary-400/50" />
                       </div>
                    )}

                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_red]" />
                       <span className="text-[10px] text-white font-bold tracking-widest bg-black/40 px-2 py-0.5 rounded">LIVE REC</span>
                    </div>

                    {/* Background noise/simulated image */}
                    <div className="absolute inset-0 bg-gray-800 opacity-60 mix-blend-overlay" />
                 </div>
               )}
            </div>

            <div className="mt-6 flex justify-center">
              <button 
                onClick={handleSelfieCapture}
                disabled={step !== 'selfie'}
                className={`w-full py-4 rounded-xl text-sm font-bold transition-all duration-300 flex items-center justify-center gap-3 shadow-md
                  ${step === 'selfie' 
                    ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg active:scale-[0.98]' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                <Camera className="w-5 h-5" />
                Capture & Verify Biometrics
              </button>
            </div>
          </div>

        </div>

        {/* Action Bar */}
        <div className="mt-12 flex justify-between items-center p-6 glass-card rounded-2xl">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 rounded-xl">
                 <ShieldCheck className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                 <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Security Level</p>
                 <p className="text-sm font-bold text-gray-800">Advanced AI Encryption (AES-256)</p>
              </div>
           </div>

           <div className="flex gap-3">
              <button 
                className="px-6 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all"
                onClick={() => navigate(-1)}
              >
                Back
              </button>
              {step === 'success' && (
                <button 
                  className="px-8 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  onClick={() => navigate('/applicant/dashboard')}
                >
                  Proceed to Final Review
                </button>
              )}
           </div>
        </div>
      </div>
    </Layout>
  );
}

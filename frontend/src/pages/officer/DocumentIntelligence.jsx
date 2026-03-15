import React, { useState } from 'react';
import Layout from '../../components/Layout';
import { FileSearch, CheckCircle2, AlertTriangle, ScanLine, FileText, Download, Fingerprint, Zap } from 'lucide-react';

const mockDocs = [
  { id: 'DOC-102', applicant: 'TechVision Inc', type: 'GST Certificate', status: 'Verified', confidence: '99%', AI_Flags: 0, date: '2 hours ago' },
  { id: 'DOC-101', applicant: 'TechVision Inc', type: 'Bank Statement (6M)', status: 'Verified', confidence: '94%', AI_Flags: 0, date: '2 hours ago' },
  { id: 'DOC-099', applicant: 'Nexus Corp', type: 'ITR Return 2025', status: 'Flagged', confidence: '72%', AI_Flags: 2, date: 'Yesterday' },
  { id: 'DOC-098', applicant: 'Apex Construct', type: 'PAN Card', status: 'Verified', confidence: '98%', AI_Flags: 0, date: 'Yesterday' },
];

const MUTED = '#4c7dd4';
const DIM   = '#2a4a79';
const LINE  = 'rgba(255,255,255,0.08)';
const CARD  = '#0d1c35';

export default function DocumentIntelligence() {
  const [selectedDoc, setSelectedDoc] = useState(mockDocs[0]);

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <FileSearch className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-black text-white tracking-tight">Document Intelligence Engine</h1>
        </div>
        <p style={{ color: MUTED }} className="font-medium text-sm">AI-driven OCR, anti-tampering analysis, and automated entity extraction from corporate uploads.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Document List */}
        <div className="rounded-3xl overflow-hidden lg:col-span-1 h-[620px] flex flex-col shadow-2xl"
          style={{ background: '#0a1628', border: `1px solid ${LINE}` }}>
          
          <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">OCR Active Queue</span>
            <span className="bg-blue-600/20 text-blue-400 px-2.5 py-1 rounded-lg text-[9px] font-black border border-blue-500/30">{mockDocs.length} DOCS</span>
          </div>
          <div className="overflow-y-auto flex-1 p-4 space-y-4 custom-scrollbar">
            {mockDocs.map(doc => (
              <div 
                key={doc.id} 
                onClick={() => setSelectedDoc(doc)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all duration-300 relative group ${selectedDoc.id === doc.id ? 'bg-blue-600/10 border-blue-500/50 shadow-xl' : 'bg-white/2 border-white/5 hover:border-white/20'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className={`font-black text-sm tracking-tight uppercase ${selectedDoc.id === doc.id ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>{doc.type}</h4>
                  {doc.status === 'Verified' ? <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" /> : <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: DIM }}>{doc.applicant}</p>
                <div className="flex items-center justify-between mt-1 border-t border-white/5 pt-3">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${doc.confidence >= '90%' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}`}>CONF {doc.confidence}</span>
                  <span className="text-[9px] font-bold font-mono" style={{ color: DIM }}>{doc.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Viewer & Extraction Results */}
        <div className="lg:col-span-3 space-y-8">
          <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
            style={{ background: CARD, border: `1px solid ${LINE}`, boxShadow: '0 10px 40px rgba(0,0,0,0.4)' }}>
            
            {/* Glow accent */}
            <div className={`absolute top-0 right-0 w-48 h-48 blur-[100px] pointer-events-none opacity-20 ${selectedDoc.status === 'Verified' ? 'bg-green-500' : 'bg-amber-500'}`} />

            <div className={`w-20 h-20 rounded-2xl flex items-center justify-center shrink-0 border relative z-10 ${selectedDoc.status === 'Verified' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
               <FileText className="w-10 h-10" />
            </div>
            <div className="flex-1 w-full relative z-10">
               <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                 <div>
                   <h2 className="text-3xl font-black text-white tracking-tight uppercase">{selectedDoc.type}</h2>
                   <p className="text-sm font-bold tracking-tight mt-1" style={{ color: MUTED }}>{selectedDoc.applicant} · <span className="text-white opacity-40 font-mono tracking-widest">#{selectedDoc.id}</span></p>
                 </div>
                 <div className="flex gap-3 shrink-0">
                   <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                     <ScanLine className="w-4 h-4 text-blue-400" /> Rescan Vision
                   </button>
                   <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-all">
                     <Download className="w-4 h-4" /> Export
                   </button>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {[
                   { l: 'Verification', v: selectedDoc.status, color: selectedDoc.status === 'Verified' ? 'text-green-400' : 'text-amber-400' },
                   { l: 'OCR Confidence', v: selectedDoc.confidence, color: 'text-blue-400' },
                   { l: 'Anti-Tamper', v: selectedDoc.AI_Flags > 0 ? 'Failed' : 'Safe', color: selectedDoc.AI_Flags > 0 ? 'text-red-400' : 'text-green-400' },
                   { l: 'Risk Indicators', v: selectedDoc.AI_Flags, color: selectedDoc.AI_Flags > 0 ? 'text-red-400' : 'text-white' }
                 ].map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-white/5 bg-white/5 shadow-inner">
                      <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: DIM }}>{item.l}</p>
                      <p className={`text-base font-black ${item.color}`}>{item.v}</p>
                    </div>
                 ))}
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="rounded-3xl overflow-hidden flex flex-col shadow-2xl" style={{ background: CARD, border: `1px solid ${LINE}` }}>
               <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
                 <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                   <Fingerprint className="w-4 h-4 text-blue-400" /> Structure Entities
                 </h3>
               </div>
               <div className="p-8">
                 {selectedDoc.type.includes('GST') ? (
                   <div className="space-y-6">
                     {[
                       { l: 'Legal Name', v: 'TECHVISION INC PVT LTD', mono: true },
                       { l: 'Incorporation Date', v: '12-MAR-2021', mono: true },
                       { l: 'GSTIN Validation', v: '27AAPCU348L1Z9', mono: true, green: true }
                     ].map((item, idx) => (
                        <div key={idx}>
                          <p className="text-[9px] font-black uppercase tracking-widest mb-2" style={{ color: DIM }}>{item.l}</p>
                          <p className={`font-mono text-xs font-black p-3 rounded-xl border tracking-widest shadow-inner ${item.green ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-white/5 border-white/10 text-white'}`}>
                            {item.v}
                          </p>
                        </div>
                     ))}
                   </div>
                 ) : (
                   <div className="py-16 text-center flex flex-col items-center opacity-40">
                     <Zap className="w-10 h-10 mb-4" />
                     <p className="text-[10px] font-black uppercase tracking-widest">Model Training Required</p>
                   </div>
                 )}
               </div>
             </div>

             <div className="rounded-3xl overflow-hidden flex flex-col shadow-2xl" style={{ background: '#071020', border: `1px solid ${LINE}` }}>
               <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between">
                 <h3 className="font-black text-white text-[10px] uppercase tracking-[0.2em] flex items-center gap-2">
                   <ScanLine className="w-4 h-4 text-green-400" /> Vision AI Log
                 </h3>
               </div>
               <div className="p-8 font-mono text-xs text-green-400/80 space-y-4 flex-1 custom-scrollbar overflow-y-auto">
                 <p className="text-white/20">&gt; Loading Anti-Tamper Engine V4.2.1...</p>
                 <p>&gt; Authenticating document signature [SHA-256]</p>
                 <p>&gt; Sign matched origin repo. <span className="text-green-500 font-black">[OK]</span></p>
                 <p>&gt; Triggering OCR Cluster AWS-WEST-2...</p>
                 <p>&gt; Processed 1.2k tokens. Found 6 schema entities.</p>
                 <p>&gt; Pixel analysis (ELA Scan): <span className="text-green-500 font-bold">[CLEAN]</span></p>
                 <p>&gt; Metadata integrity check: <span className={selectedDoc.AI_Flags > 0 ? 'text-red-400 font-bold' : 'text-green-500 font-bold'}>{selectedDoc.AI_Flags > 0 ? '[WARN] ELA Mismatch' : '[CLEAN]'}</span></p>
                 {selectedDoc.AI_Flags > 0 && (
                   <div className="p-3 border border-red-500/30 bg-red-500/5 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-tight">
                     <AlertTriangle className="w-3 h-3 inline mr-2" /> PDF was modified post-export at source.
                   </div>
                 )}
                 <div className="mt-10 pt-4 border-t border-white/5 text-white/40 flex justify-between items-center text-[10px] font-black uppercase">
                    <span>Process Terminal Exit</span>
                    <span className="text-blue-400">T = 122ms</span>
                 </div>
               </div>
             </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import ApplicantDashboard from './pages/applicant/Dashboard';
import LoanApplicationForm from './pages/applicant/LoanApplicationForm';
import MyApplications from './pages/applicant/MyApplications';
import ApplicationDetail from './pages/applicant/ApplicationDetail';
import IdentityVerification from './pages/applicant/IdentityVerification';

import OfficerDashboard from './pages/officer/Dashboard';
import OfficerApplications from './pages/officer/Applications';
import OfficerApplicationDetail from './pages/officer/ApplicationDetail';
import RiskDashboard from './pages/officer/RiskDashboard';
import FraudDetection from './pages/officer/FraudDetection';
import WhatIfConfig from './pages/officer/WhatIfConfig';
import BorrowerNetwork from './pages/officer/BorrowerNetwork';
import CAMGenerator from './pages/officer/CAMGenerator';
import Alerts from './pages/officer/Alerts';
import ActivityLogs from './pages/officer/ActivityLogs';
import LoanPipeline from './pages/officer/LoanPipeline';
import DocumentIntelligence from './pages/officer/DocumentIntelligence';
import Layout from './components/Layout';
import { Activity } from 'lucide-react';

function PlaceholderModule({ title, desc }) {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center p-24 text-center">
        <div className="w-20 h-20 bg-white/5 border border-white/10 text-blue-500 flex items-center justify-center rounded-3xl mb-8 shadow-2xl">
          <Activity className="w-10 h-10 opacity-50" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">{title}</h2>
        <p className="text-sm font-medium max-w-sm" style={{ color: '#4c7dd4' }}>
          {desc || "This strategic module is currently entering deployment phase. System sync in progress."}
        </p>
      </div>
    </Layout>
  );
}



function RootRedirect() {
  const { user, loading } = useAuth();
  
  if (loading) return null; // Wait for initialization

  if (!user || !user.role) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role === 'bank_officer') {
    return <Navigate to="/officer/dashboard" replace />;
  }
  
  if (user.role === 'applicant') {
    return <Navigate to="/applicant/dashboard" replace />;
  }

  // Fallback for safety
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Applicant Routes */}
          <Route path="/applicant/dashboard" element={
            <ProtectedRoute role="applicant"><ApplicantDashboard /></ProtectedRoute>
          } />
          <Route path="/applicant/apply" element={
            <ProtectedRoute role="applicant"><LoanApplicationForm /></ProtectedRoute>
          } />
          <Route path="/applicant/applications" element={
            <ProtectedRoute role="applicant"><MyApplications /></ProtectedRoute>
          } />
          <Route path="/applicant/applications/:id" element={
            <ProtectedRoute role="applicant"><ApplicationDetail /></ProtectedRoute>
          } />
          <Route path="/applicant/verify" element={
            <ProtectedRoute role="applicant"><IdentityVerification /></ProtectedRoute>
          } />

          {/* Bank Officer Routes */}
          <Route path="/officer/dashboard" element={
            <ProtectedRoute role="bank_officer"><OfficerDashboard /></ProtectedRoute>
          } />
          <Route path="/officer/applications" element={
            <ProtectedRoute role="bank_officer"><OfficerApplications /></ProtectedRoute>
          } />
          <Route path="/officer/applications/:id" element={
            <ProtectedRoute role="bank_officer"><OfficerApplicationDetail /></ProtectedRoute>
          } />
          <Route path="/officer/risk-intelligence" element={
            <ProtectedRoute role="bank_officer"><RiskDashboard /></ProtectedRoute>
          } />

          {/* New Banking Enterprise Modules */}
          <Route path="/officer/pipeline" element={<ProtectedRoute role="bank_officer"><LoanPipeline /></ProtectedRoute>} />
          <Route path="/officer/documents" element={<ProtectedRoute role="bank_officer"><DocumentIntelligence /></ProtectedRoute>} />
          <Route path="/officer/fraud" element={<ProtectedRoute role="bank_officer"><FraudDetection /></ProtectedRoute>} />
          <Route path="/officer/whatif" element={<ProtectedRoute role="bank_officer"><WhatIfConfig /></ProtectedRoute>} />
          <Route path="/officer/network" element={<ProtectedRoute role="bank_officer"><BorrowerNetwork /></ProtectedRoute>} />
          <Route path="/officer/cam" element={<ProtectedRoute role="bank_officer"><CAMGenerator /></ProtectedRoute>} />
          <Route path="/officer/alerts" element={<ProtectedRoute role="bank_officer"><Alerts /></ProtectedRoute>} />
          <Route path="/officer/logs" element={<ProtectedRoute role="bank_officer"><ActivityLogs /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

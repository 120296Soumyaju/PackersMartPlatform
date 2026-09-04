import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, LayoutDashboard, UserPlus, Sparkles, Zap } from 'lucide-react';
import axiosClient from './api/axiosClient';
import LeadForm from './components/LeadForm';
import OtpModal from './components/OtpModal';
import CompanyMatchesModal from './components/CompanyMatchesModal';
import DashboardStats from './components/DashboardStats';
import LeadTable from './components/LeadTable';

export default function App() {
  const [activeView, setActiveView] = useState('customer');
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // Active Lead Flow States
  const [currentLead, setCurrentLead] = useState(null);
  const [testOtpCode, setTestOtpCode] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedLeadMatches, setSelectedLeadMatches] = useState(null);
  const [selectedLeadBreakdown, setSelectedLeadBreakdown] = useState(null);
  const [showMatchesModal, setShowMatchesModal] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const statsRes = await axiosClient.get('/dashboard');
      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }

      const leadsRes = await axiosClient.get('/leads');
      if (leadsRes.data.success) {
        setLeads(leadsRes.data.leads);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLeadCreated = (lead, testOtp) => {
    setCurrentLead(lead);
    setTestOtpCode(testOtp);
    setShowOtpModal(true);
    showToast(`Lead registered! OTP generated for ${lead.mobile}`, 'info');
    fetchDashboardData();
  };

  const handleOtpVerified = (verifiedLead, matchingCompanies, scoreBreakdown) => {
    setShowOtpModal(false);
    setCurrentLead(verifiedLead);
    setSelectedLeadMatches(matchingCompanies);
    setSelectedLeadBreakdown(scoreBreakdown);
    setShowMatchesModal(true);
    showToast(`OTP verified! Lead status is now Verified. Found ${matchingCompanies?.length || 0} matched companies!`, 'success');
    fetchDashboardData();
  };

  const handleViewMatchesForLead = (lead) => {
    setCurrentLead(lead);
    setSelectedLeadMatches(lead.matches || []);
    setShowMatchesModal(true);
  };

  const handleStatusChange = (leadId, newStatus) => {
    showToast(`Lead status updated to ${newStatus}`);
    fetchDashboardData();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-5 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-bold flex items-center justify-between sm:justify-start gap-2 ${
            toast.type === 'success' ? 'bg-emerald-950 border-emerald-500 text-emerald-300' : 'bg-indigo-950 border-indigo-500 text-indigo-300'
          }`}>
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              {toast.message}
            </span>
          </div>
        </div>
      )}

      {/* Global Header - Fully Mobile Responsive */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Packers<span className="text-indigo-400">Mart</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-widest font-mono">1-Day MVP</span>
              </h1>
            </div>
          </div>
        </div>

        {/* View Switcher Header - Responsive Button Group */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
          <button
            onClick={() => setActiveView('customer')}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'customer'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Customer Registration
          </button>
          <button
            onClick={() => {
              setActiveView('admin');
              fetchDashboardData();
            }}
            className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeView === 'admin'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" /> Admin Dashboard
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 md:p-8">
        {activeView === 'customer' ? (
          <div className="space-y-8 sm:space-y-12 py-2 sm:py-4">
            <LeadForm onLeadCreated={handleLeadCreated} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto pt-4 sm:pt-6">
              <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">6-Digit OTP Verification</h4>
                  <p className="text-xs text-slate-400 mt-1">Generates 6-digit OTP code stored against lead with expiry time to set status to Verified.</p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Lead Quality Scoring</h4>
                  <p className="text-xs text-slate-400 mt-1">Calculates Lead Quality Score for verified leads, classifying them into Hot, Warm, or Cold.</p>
                </div>
              </div>

              <div className="glass-card rounded-2xl p-5 border border-slate-800 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">Logistics Company Matching</h4>
                  <p className="text-xs text-slate-400 mt-1">Rule-based matching algorithm connecting verified leads to suitable companies based on Pickup, Destination, and Service Type.</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <DashboardStats stats={stats} />
            <LeadTable
              leads={leads}
              onStatusChange={handleStatusChange}
              onViewMatches={handleViewMatchesForLead}
              onRefresh={fetchDashboardData}
            />
          </div>
        )}
      </main>

      {/* Modals */}
      {showOtpModal && currentLead && (
        <OtpModal
          lead={currentLead}
          testOtpCode={testOtpCode}
          onClose={() => setShowOtpModal(false)}
          onVerified={handleOtpVerified}
        />
      )}

      {showMatchesModal && currentLead && (
        <CompanyMatchesModal
          lead={currentLead}
          matches={selectedLeadMatches}
          scoreBreakdown={selectedLeadBreakdown}
          onClose={() => setShowMatchesModal(false)}
        />
      )}

      <footer className="border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <p>PackersMart Platform MVP • 1-Day Full-Stack Assessment Task Implementation</p>
      </footer>
    </div>
  );
}

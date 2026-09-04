import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Sparkles, Lock } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function OtpModal({ lead, testOtpCode, onClose, onVerified }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTestOtp, setCurrentTestOtp] = useState(testOtpCode);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleAutoFillTestOtp = () => {
    if (!currentTestOtp) return;
    const digits = currentTestOtp.toString().split('');
    setOtp(digits);
    setError(null);
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    const fullOtp = otp.join('');
    if (fullOtp.length < 6) {
      setError("Please enter complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post(`/leads/${lead.id}/verify-otp`, {
        otp: fullOtp
      });

      if (response.data.success) {
        onVerified(response.data.lead, response.data.matchingCompanies, response.data.scoreBreakdown);
      } else {
        setError(response.data.error || "OTP verification failed.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Incorrect or expired OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.post('/otp/send', { leadId: lead.id });
      if (response.data.success) {
        setCurrentTestOtp(response.data.testOtpCode);
        setTimer(60);
        setOtp(['', '', '', '', '', '']);
      }
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-card rounded-2xl p-5 sm:p-6 border border-emerald-500/30 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-emerald-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white">6-Digit OTP Verification</h3>
          <p className="text-xs text-slate-400 mt-1">
            Sent to mobile <span className="text-emerald-400 font-mono font-bold">{lead?.mobile}</span>
          </p>
        </div>

        {currentTestOtp && (
          <div className="mb-4 p-2.5 sm:p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center justify-between">
            <div className="text-xs">
              <span className="font-semibold block text-indigo-200 text-[11px]">Assessment Quick-Test OTP:</span>
              <span className="font-mono text-sm sm:text-base font-extrabold tracking-widest text-indigo-400">{currentTestOtp}</span>
            </div>
            <button
              type="button"
              onClick={handleAutoFillTestOtp}
              className="px-2.5 sm:px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1 shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" /> Auto-Fill
            </button>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-1.5 sm:gap-2 mb-6">
            {otp.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-input-${idx}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-10 sm:w-12 h-12 sm:h-14 bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 rounded-xl text-center text-lg sm:text-xl font-bold text-white font-mono transition-all"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 sm:py-3.5 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 text-sm"
          >
            {loading ? "Verifying..." : "Verify OTP & View Matches"}
          </button>
        </form>

        <div className="mt-4 text-center flex items-center justify-between text-xs text-slate-400">
          <span>{timer > 0 ? `Resend code in ${timer}s` : "Didn't get code?"}</span>
          <button
            type="button"
            disabled={timer > 0 || loading}
            onClick={handleResendOtp}
            className="text-emerald-400 hover:text-emerald-300 font-semibold disabled:text-slate-600 flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
}

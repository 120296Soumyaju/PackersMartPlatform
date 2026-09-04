import React, { useState } from 'react';
import { MapPin, Calendar, Home, User, Phone, Mail, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Sparkles, FileText } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const CITIES = [
  "Mumbai", "Delhi NCR", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Chandigarh", "Kochi", "Coimbatore"
];

const SERVICE_TYPES = [
  { id: "Household Relocation (1BHK)", label: "1 BHK Household", desc: "Small apartment / Studio move" },
  { id: "Household Relocation (2BHK)", label: "2 BHK Household", desc: "Standard 2 bedroom house" },
  { id: "Household Relocation (3BHK)", label: "3 BHK Household", desc: "Spacious 3 bedroom house" },
  { id: "Household Relocation (4+BHK)", label: "4+ BHK / Villa", desc: "Large villa or luxury residence" },
  { id: "Office Shifting", label: "Office Shifting", desc: "Commercial & workplace move" },
  { id: "Vehicle Transport", label: "Vehicle Transport", desc: "Car or bike transportation" }
];

export default function LeadForm({ onLeadCreated }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    customerName: '',
    mobile: '',
    email: '',
    pickupCity: 'Mumbai',
    destinationCity: 'Bangalore',
    serviceType: 'Household Relocation (2BHK)',
    movingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    additionalRequirements: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSelectService = (serviceId) => {
    setFormData(prev => ({ ...prev, serviceType: serviceId }));
  };

  const validateStep = (currentStep) => {
    if (currentStep === 1) {
      if (!formData.pickupCity || !formData.destinationCity || !formData.movingDate) {
        setError("Please fill in Pickup City, Destination City, and Moving Date.");
        return false;
      }
      if (formData.pickupCity === formData.destinationCity) {
        setError("Pickup City and Destination City must be different.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.serviceType) {
        setError("Please select a Service Type.");
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.customerName.trim()) {
        setError("Please enter your Customer Name.");
        return false;
      }
      if (!formData.mobile.trim() || formData.mobile.length < 10) {
        setError("Please enter a valid 10-digit Mobile Number.");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setError(null);
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.post('/leads', formData);

      if (response.data.success) {
        onLeadCreated(response.data.lead, response.data.testOtpCode);
      } else {
        setError(response.data.error || "Failed to submit lead.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Server connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-card rounded-2xl p-6 sm:p-8 border border-indigo-500/20 shadow-2xl relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" /> Customer Lead Registration
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">PackersMart Relocation Inquiry</h2>
        <p className="text-slate-400 text-sm mt-1">Get verified quotes from matched logistics partners in 3 easy steps</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-400 mb-2">
          <span className={step >= 1 ? "text-indigo-400 font-bold" : ""}>1. Route & Date</span>
          <span className={step >= 2 ? "text-indigo-400 font-bold" : ""}>2. Service Type</span>
          <span className={step >= 3 ? "text-indigo-400 font-bold" : ""}>3. Customer Info</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold">
          {error}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Pickup City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-indigo-400" />
                <select
                  name="pickupCity"
                  value={formData.pickupCity}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  {CITIES.map(c => (
                    <option key={`pickup-${c}`} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Destination City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 w-5 h-5 text-emerald-400" />
                <select
                  name="destinationCity"
                  value={formData.destinationCity}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                >
                  {CITIES.map(c => (
                    <option key={`dest-${c}`} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Moving Date</label>
              <div className="relative">
                <Calendar className="absolute left-3.5 top-3.5 w-5 h-5 text-indigo-400" />
                <input
                  type="date"
                  name="movingDate"
                  value={formData.movingDate}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={nextStep}
              className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
            >
              Continue to Service Type <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">Select Service Type</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SERVICE_TYPES.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectService(item.id)}
                    className={`cursor-pointer p-4 rounded-xl border transition-all ${
                      formData.serviceType === item.id
                        ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-sm">
                      <span>{item.label}</span>
                      {formData.serviceType === item.id && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                Customer Details <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Customer Name *</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3.5 w-5 h-5 text-indigo-400" />
                <input
                  type="text"
                  name="customerName"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.customerName}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Mobile Number * (for 6-Digit OTP)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3.5 w-5 h-5 text-emerald-400" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="e.g. 9812345678"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Email Address (Optional)</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">Additional Requirements</label>
              <textarea
                name="additionalRequirements"
                rows="2"
                placeholder="e.g. Delicate glass items, sofa disassembly required..."
                value={formData.additionalRequirements}
                onChange={handleChange}
                className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
              ></textarea>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={prevStep}
                className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Submitting...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" /> Submit Lead & Get OTP
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

import React from 'react';
import { Star, Truck, CheckCircle2, Phone, ShieldCheck, X, ArrowUpRight, Zap } from 'lucide-react';

export default function CompanyMatchesModal({ lead, matches, scoreBreakdown, onClose }) {
  const getQualityBadgeColor = (quality) => {
    switch (quality) {
      case 'Hot': return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'Warm': return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-md animate-fadeIn overflow-hidden">
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-card rounded-2xl p-4 sm:p-6 border border-indigo-500/30 shadow-2xl flex flex-col">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header (Fixed top) */}
        <div className="shrink-0 border-b border-slate-800 pb-4 pr-8">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] sm:text-xs font-extrabold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED LEAD
            </span>
            <span className={`px-2.5 py-0.5 rounded-full border text-[11px] sm:text-xs font-extrabold ${getQualityBadgeColor(lead?.leadQuality)}`}>
              SCORE: {lead?.leadScore}/100 ({lead?.leadQuality} LEAD)
            </span>
          </div>

          <h3 className="text-lg sm:text-2xl font-extrabold text-white">Matched Packers & Movers</h3>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-slate-400 mt-2">
            <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">
              Route: <strong className="text-indigo-400">{lead?.pickupCity} ➔ {lead?.destinationCity}</strong>
            </span>
            <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">
              Date: <strong className="text-white">{lead?.movingDate}</strong>
            </span>
            <span className="bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-slate-200">
              Service: <strong className="text-emerald-400">{lead?.serviceType}</strong>
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          
          {/* Score Breakdown Analysis Pills */}
          {scoreBreakdown && scoreBreakdown.length > 0 && (
            <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" /> Lead Quality Score Analysis
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {scoreBreakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2 bg-slate-950/80 px-3 py-2 rounded-lg border border-slate-800/80">
                    <span className="text-slate-300 text-[11px] leading-tight flex-1">{item.criteria}</span>
                    <span className={`font-mono font-bold text-[11px] shrink-0 ${item.points > 0 ? 'text-emerald-400' : 'text-slate-500'}`}>
                      +{item.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Company Matches Cards */}
          <div className="space-y-3">
            {matches && matches.length > 0 ? (
              matches.map((matchItem) => {
                const company = matchItem.company;
                let serviceTypes = [];
                let reasons = [];
                try { serviceTypes = JSON.parse(company.serviceTypes); } catch (e) {}
                try { reasons = JSON.parse(matchItem.matchReasons); } catch (e) {}

                return (
                  <div
                    key={matchItem.id}
                    className="glass-card rounded-xl p-4 border border-slate-800 hover:border-indigo-500/40 transition-all bg-slate-900/70 space-y-3"
                  >
                    {/* Header Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-base sm:text-lg text-white">{company.companyName}</h4>
                        <div className="flex items-center gap-3 text-xs text-slate-300 flex-wrap mt-1">
                          <span className="flex items-center gap-1 font-bold text-amber-400">
                            <Star className="w-3.5 h-3.5 fill-amber-400 shrink-0" /> {company.rating} ({company.reviewCount} reviews)
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <Truck className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Fleet: {company.fleetSize} Vehicles
                          </span>
                        </div>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-extrabold shrink-0">
                        {matchItem.matchScore}% Match
                      </span>
                    </div>

                    {/* Services Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {serviceTypes.slice(0, 4).map((s, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-800/90 text-slate-300 text-[10px] sm:text-[11px] rounded border border-slate-700/60">
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Match Reasons */}
                    {reasons.length > 0 && (
                      <div className="pt-1 text-xs text-emerald-400/90 font-medium space-y-1 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                        {reasons.map((r, idx) => (
                          <div key={idx} className="flex items-start gap-1.5 text-[11px] sm:text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-slate-800/80">
                      <a
                        href={`tel:${company.mobile}`}
                        className="flex-1 px-3.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Company
                      </a>
                      <button
                        onClick={() => alert(`Booking request sent to ${company.companyName}!`)}
                        className="flex-1 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1"
                      >
                        Book Slot <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                No suitable company matches found for this specific route and service type.
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer (Fixed bottom) */}
        <div className="shrink-0 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px] text-slate-500">PackersMart Matching Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

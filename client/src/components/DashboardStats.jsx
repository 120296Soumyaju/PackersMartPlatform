import React from 'react';
import { Users, ShieldCheck, CheckCircle2, TrendingUp, Award, Truck, AlertTriangle, Copy, Clock, Flame, Zap, Snowflake } from 'lucide-react';

export default function DashboardStats({ stats }) {
  if (!stats) return null;

  return (
    <div className="space-y-6 mb-8">
      {/* Top Section 6 KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Leads */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Leads</p>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">{stats.totalLeads}</h3>
          <p className="text-[10px] text-slate-500 mt-1">All submitted inquiries</p>
        </div>

        {/* Verified Leads */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Verified Leads</p>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1">{stats.verifiedLeads}</h3>
          <p className="text-[10px] text-slate-500 mt-1">6-Digit OTP verified</p>
        </div>

        {/* Pending Leads */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Pending Leads</p>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1">{stats.pendingLeads}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Awaiting OTP verification</p>
        </div>

        {/* Fake Leads */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Fake Leads</p>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-rose-400 mt-1">{stats.fakeLeads}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Flagged invalid / spam</p>
        </div>

        {/* Duplicate Leads */}
        <div className="glass-card rounded-2xl p-4 border border-slate-800 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Duplicate Leads</p>
            <Copy className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-purple-400 mt-1">{stats.duplicateLeads}</h3>
          <p className="text-[10px] text-slate-500 mt-1">Repeated inquiries</p>
        </div>
      </div>

      {/* Second Row: Quality Classification & Company Matching Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Lead Quality Distribution */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 md:col-span-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
            <span>Lead Quality Classification</span>
            <span className="text-indigo-400 text-xs font-mono">Avg Score: {stats.avgLeadScore}/100</span>
          </h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/90 rounded-xl p-3.5 border border-rose-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-400 font-extrabold text-xs mb-1">
                <Flame className="w-3.5 h-3.5" /> HOT LEADS
              </div>
              <div className="text-2xl font-extrabold text-white">{stats.tierBreakdown?.Hot || 0}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Score &gt;= 75</div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-3.5 border border-amber-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-extrabold text-xs mb-1">
                <Zap className="w-3.5 h-3.5" /> WARM LEADS
              </div>
              <div className="text-2xl font-extrabold text-white">{stats.tierBreakdown?.Warm || 0}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Score 50-74</div>
            </div>

            <div className="bg-slate-900/90 rounded-xl p-3.5 border border-blue-500/20 text-center">
              <div className="flex items-center justify-center gap-1 text-blue-400 font-extrabold text-xs mb-1">
                <Snowflake className="w-3.5 h-3.5" /> COLD LEADS
              </div>
              <div className="text-2xl font-extrabold text-white">{stats.tierBreakdown?.Cold || 0}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Score &lt; 50</div>
            </div>
          </div>
        </div>

        {/* Company Matching Metric */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-purple-400" /> Company Matching Metrics
            </h4>
            <div className="text-2xl font-extrabold text-white mt-1">
              {stats.totalMatches} <span className="text-xs font-normal text-slate-400">Total Matches Generated</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex justify-between items-center">
            <span>Active Companies: <strong className="text-purple-300">{stats.activeCompanies}</strong></span>
            <span>Leads Matched: <strong className="text-emerald-400">{stats.leadsWithMatchesCount}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

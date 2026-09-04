import React, { useState } from 'react';
import { Search, Phone, Calendar, MapPin, Eye, CheckCircle2, AlertTriangle, Clock, Copy, RefreshCw, Sparkles, Filter, ChevronRight } from 'lucide-react';
import axiosClient from '../api/axiosClient';

export default function LeadTable({ leads, onStatusChange, onViewMatches, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [qualityFilter, setQualityFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');
  const [updatingId, setUpdatingId] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> PENDING</span>;
      case 'Verified':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> VERIFIED</span>;
      case 'Fake':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> FAKE</span>;
      case 'Duplicate':
        return <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-bold flex items-center gap-1"><Copy className="w-3 h-3" /> DUPLICATE</span>;
      case 'Re-attempt':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold flex items-center gap-1"><RefreshCw className="w-3 h-3" /> RE-ATTEMPT</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-400 text-xs">{status}</span>;
    }
  };

  const getQualityBadge = (quality, score) => {
    switch (quality) {
      case 'Hot':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-extrabold font-mono">{score} / HOT 🔥</span>;
      case 'Warm':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-extrabold font-mono">{score} / WARM ⚡</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-extrabold font-mono">{score} / COLD ❄️</span>;
    }
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    setUpdatingId(leadId);
    try {
      const response = await axiosClient.patch(`/leads/${leadId}/status`, { status: newStatus });
      if (response.data.success) {
        onStatusChange(leadId, newStatus);
      }
    } catch (err) {
      alert("Failed to update lead status.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Filtering
  let filteredLeads = leads.filter(l => {
    if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
    if (qualityFilter !== 'ALL' && l.leadQuality !== qualityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = l.customerName?.toLowerCase().includes(q);
      const matchMobile = l.mobile?.includes(q);
      const matchPickup = l.pickupCity?.toLowerCase().includes(q);
      const matchDest = l.destinationCity?.toLowerCase().includes(q);
      const matchService = l.serviceType?.toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchPickup && !matchDest && !matchService) return false;
    }
    return true;
  });

  // Sorting
  filteredLeads.sort((a, b) => {
    if (sortBy === 'score_desc') return b.leadScore - a.leadScore;
    if (sortBy === 'score_asc') return a.leadScore - b.leadScore;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-2xl">
      {/* Table Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
            Admin Lead Management Queue <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">{filteredLeads.length} leads</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">Review inquiries, update statuses (Pending, Verified, Fake, Duplicate, Re-attempt), and inspect matched companies</p>
        </div>

        <button
          onClick={onRefresh}
          className="w-full sm:w-auto px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Refresh Queue
        </button>
      </div>

      {/* Filter Toolbar - Fully Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 mb-6 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, mobile, city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Filter: All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Fake">Fake</option>
            <option value="Duplicate">Duplicate</option>
            <option value="Re-attempt">Re-attempt</option>
          </select>
        </div>

        {/* Quality Filter */}
        <div>
          <select
            value={qualityFilter}
            onChange={(e) => setQualityFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">Filter: All Lead Quality</option>
            <option value="Hot">Hot Leads (&gt;= 75)</option>
            <option value="Warm">Warm Leads (50-74)</option>
            <option value="Cold">Cold Leads (&lt; 50)</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="newest">Sort: Newest First</option>
            <option value="score_desc">Sort: Highest Score</option>
            <option value="score_asc">Sort: Lowest Score</option>
          </select>
        </div>
      </div>

      {/* MOBILE CARD VIEW (Block on < md screens, hidden on md+) */}
      <div className="block md:hidden space-y-3">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-bold text-white text-sm">{lead.customerName}</h4>
                  <div className="text-slate-400 font-mono text-xs mt-0.5 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-emerald-400 shrink-0" /> {lead.mobile}
                  </div>
                </div>
                <div>{getQualityBadge(lead.leadQuality, lead.leadScore)}</div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{lead.pickupCity} ➔ {lead.destinationCity}</span>
                </div>
                <div className="text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{lead.movingDate}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <span className="px-2 py-0.5 bg-slate-800 text-slate-300 text-[11px] font-semibold rounded border border-slate-700">
                  {lead.serviceType}
                </span>

                <div className="flex items-center gap-2">
                  <select
                    disabled={updatingId === lead.id}
                    value={lead.status}
                    onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                    className="bg-slate-950 border border-slate-700 rounded text-[11px] px-2 py-1.5 text-slate-200 focus:outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Verified">Verified</option>
                    <option value="Fake">Fake</option>
                    <option value="Duplicate">Duplicate</option>
                    <option value="Re-attempt">Re-attempt</option>
                  </select>

                  <button
                    onClick={() => onViewMatches(lead)}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" /> Matches ({lead.matches?.length || 0})
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No leads found matching current filters.
          </div>
        )}
      </div>

      {/* DESKTOP TABLE VIEW (Hidden on < md screens, block on md+) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Customer Details</th>
              <th className="py-3.5 px-4">Route & Moving Date</th>
              <th className="py-3.5 px-4">Service Type</th>
              <th className="py-3.5 px-4">Lead Quality</th>
              <th className="py-3.5 px-4">Status Control</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLeads.length > 0 ? (
              filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-900/50 transition-all">
                  <td className="py-4 px-4">
                    <div className="font-extrabold text-white text-sm">{lead.customerName}</div>
                    <div className="text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-emerald-400" /> {lead.mobile}
                    </div>
                    {lead.email && <div className="text-[11px] text-slate-500">{lead.email}</div>}
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400" /> {lead.pickupCity} ➔ {lead.destinationCity}
                    </div>
                    <div className="text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-500" /> {lead.movingDate}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-slate-200 border border-slate-700">
                      {lead.serviceType}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    {getQualityBadge(lead.leadQuality, lead.leadScore)}
                  </td>

                  <td className="py-4 px-4">
                    <div className="space-y-1">
                      <div>{getStatusBadge(lead.status)}</div>
                      <select
                        disabled={updatingId === lead.id}
                        value={lead.status}
                        onChange={(e) => handleStatusUpdate(lead.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded text-[11px] px-2 py-1 text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Verified">Verified</option>
                        <option value="Fake">Fake</option>
                        <option value="Duplicate">Duplicate</option>
                        <option value="Re-attempt">Re-attempt</option>
                      </select>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      onClick={() => onViewMatches(lead)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg shadow transition-all inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Companies ({lead.matches?.length || 0})
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-10 text-slate-500 text-sm">
                  No leads found matching current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

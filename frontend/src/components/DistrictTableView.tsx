import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  ArrowUpDown,
  X
} from "lucide-react";
import { ImdAlertBadge } from "./ImdAlertBadge";
import { LeadSelector } from "./LeadSelector";
import { api } from "@/lib/api";
import type { LeadDistrict, ProductMeta } from "@/types";

interface DistrictTableViewProps {
  currentLead: number;
  onSelectLead: (lead: number) => void;
  meta: ProductMeta | null;
  districts: LeadDistrict[];
  validDate: string;
}

export const DistrictTableView: React.FC<DistrictTableViewProps> = ({
  currentLead,
  onSelectLead,
  meta,
  districts,
  validDate
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"mean" | "max" | "p_heavy" | "p_very_heavy" | "raw_mean">("mean");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedDistrict, setSelectedDistrict] = useState<LeadDistrict | null>(null);

  const leads = meta?.leads || [1, 2, 3, 4, 5].map((l) => ({ lead: l, valid: "2026-09-30" }));

  const filteredDistricts = useMemo(() => {
    return districts
      .filter((d) => {
        const matchesSearch =
          d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (d.lgd && d.lgd.includes(searchTerm));
        const matchesLevel = selectedLevel === "all" || d.level === selectedLevel;
        return matchesSearch && matchesLevel;
      })
      .sort((a, b) => {
        const diff = (a[sortBy] || 0) - (b[sortBy] || 0);
        return sortOrder === "desc" ? -diff : diff;
      });
  }, [districts, searchTerm, selectedLevel, sortBy, sortOrder]);

  const toggleSort = (field: "mean" | "max" | "p_heavy" | "p_very_heavy" | "raw_mean") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const handleDownloadCsv = () => {
    window.open(api.getDistrictCsvUrl(currentLead), "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="section-title">District Advisory</h1>
            <span className="badge badge-blue">Day {currentLead}</span>
          </div>
          <p className="section-subtitle">
            Grid-to-district precipitation & probability of exceeding IMD thresholds · Valid: {validDate}
          </p>
        </div>
        <LeadSelector currentLead={currentLead} leads={leads} onSelectLead={onSelectLead} />
      </div>

      {/* Controls */}
      <div className="card p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search district, state or LGD…"
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {["all", "red", "orange", "yellow", "green"].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize transition-all cursor-pointer ${
                  selectedLevel === lvl ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                {lvl === "all" ? "All" : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
              </button>
            ))}
          </div>
          <button onClick={handleDownloadCsv} className="btn btn-primary btn-sm">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Data table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>District</th>
                <th>Alert</th>
                <th onClick={() => toggleSort("mean")} className="cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">AI Mean<ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => toggleSort("max")} className="cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">Peak Cell<ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => toggleSort("raw_mean")} className="cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">Raw GFS<ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => toggleSort("p_heavy")} className="cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">P(≥64mm)<ArrowUpDown className="w-3 h-3" /></div>
                </th>
                <th onClick={() => toggleSort("p_very_heavy")} className="cursor-pointer hover:text-slate-900">
                  <div className="flex items-center gap-1">P(≥115mm)<ArrowUpDown className="w-3 h-3" /></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.length === 0 ? (
                <tr><td colSpan={7} className="py-12 text-center text-slate-400 font-medium">No districts match your search.</td></tr>
              ) : (
                filteredDistricts.map((d) => (
                  <tr key={d.id} onClick={() => setSelectedDistrict(d)} className="cursor-pointer hover:bg-blue-50/40 group">
                    <td>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">{d.name}</div>
                      <div className="text-xs text-slate-400">{d.state}{d.lgd ? ` · LGD ${d.lgd}` : ""}</div>
                    </td>
                    <td><ImdAlertBadge level={d.level} size="sm" /></td>
                    <td className="font-mono font-bold text-blue-700">{d.mean.toFixed(1)}</td>
                    <td className="font-mono font-semibold text-slate-700">{d.max.toFixed(1)}</td>
                    <td className="font-mono text-slate-500">{d.raw_mean.toFixed(1)}</td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-amber-700">{(d.p_heavy * 100).toFixed(0)}%</span>
                        <div className="progress-bar w-12 hidden sm:block"><div className="progress-fill bg-amber-400" style={{width:`${d.p_heavy*100}%`}} /></div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-semibold text-red-700">{(d.p_very_heavy * 100).toFixed(0)}%</span>
                        <div className="progress-bar w-12 hidden sm:block"><div className="progress-fill bg-red-500" style={{width:`${d.p_very_heavy*100}%`}} /></div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>{filteredDistricts.length} of {districts.length} districts shown</span>
          <span>Survey of India boundaries · IMD color matrix</span>
        </div>
      </div>

      {/* District Detail Drawer/Modal */}
      {selectedDistrict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(15,23,42,0.5)",backdropFilter:"blur(4px)"}}>
          <div className="card-xl bg-white w-full max-w-lg p-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700">District Inspection</span>
                <h3 className="text-2xl font-black text-slate-950">{selectedDistrict.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedDistrict.state} · LGD Code: {selectedDistrict.lgd ?? "N/A"}</p>
              </div>
              <button
                onClick={() => setSelectedDistrict(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-700 font-semibold">Operational Warning Status:</span>
              <ImdAlertBadge level={selectedDistrict.level} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100">
                <span className="text-blue-800 font-bold uppercase tracking-wider text-[10px]">SAWAN Corrected Mean</span>
                <div className="text-xl font-bold font-mono text-blue-700 mt-1">
                  {selectedDistrict.mean.toFixed(1)} mm
                </div>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-600 font-bold uppercase tracking-wider text-[10px]">Raw GFS Mean</span>
                <div className="text-xl font-bold font-mono text-slate-800 mt-1">
                  {selectedDistrict.raw_mean.toFixed(1)} mm
                </div>
              </div>
              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <span className="text-amber-800 font-bold uppercase tracking-wider text-[10px]">P(Heavy &gt; 64.5 mm)</span>
                <div className="text-xl font-bold font-mono text-amber-800 mt-1">
                  {(selectedDistrict.p_heavy * 100).toFixed(0)}%
                </div>
              </div>
              <div className="p-3.5 bg-red-50/60 rounded-xl border border-red-100">
                <span className="text-red-800 font-bold uppercase tracking-wider text-[10px]">P(Very Heavy &gt; 115.6 mm)</span>
                <div className="text-xl font-bold font-mono text-red-700 mt-1">
                  {(selectedDistrict.p_very_heavy * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 leading-relaxed font-medium">
              <strong>Advisory:</strong> Precautionary flood preparations and NDRF/SDRF alert recommended for low-lying water catchment areas in {selectedDistrict.name}.
            </div>

            <button
              onClick={() => setSelectedDistrict(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Close Advisory
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

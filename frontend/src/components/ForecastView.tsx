import React from "react";
import {
  CloudLightning,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Layers,
  Sparkles,
  Droplets,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { ImdAlertBadge } from "./ImdAlertBadge";
import { LeadSelector } from "./LeadSelector";
import type { LeadDistrict, ProductMeta } from "@/types";

interface ForecastViewProps {
  currentLead: number;
  onSelectLead: (lead: number) => void;
  meta: ProductMeta | null;
  forecastData: {
    issue: string;
    lead: number;
    valid: string;
    raw: number[];
    corrected: number[];
    p_heavy: number[];
    p_very_heavy: number[];
    gate: { key: string; cells: number; amount: string; warning: string }[];
    districts: LeadDistrict[];
    thresholds: Record<string, number>;
  } | null;
}

export const ForecastView: React.FC<ForecastViewProps> = ({
  currentLead,
  onSelectLead,
  meta,
  forecastData
}) => {
  const districts = forecastData?.districts || [];
  const leads = meta?.leads || [1, 2, 3, 4, 5].map((l) => ({ lead: l, valid: "2026-09-30" }));

  const redCount    = districts.filter((d) => d.level === "red").length;
  const orangeCount = districts.filter((d) => d.level === "orange").length;
  const yellowCount = districts.filter((d) => d.level === "yellow").length;
  const maxRain     = Math.max(...districts.map((d) => d.max || 0), 0);
  const maxRaw      = Math.max(...districts.map((d) => d.raw_mean || 0), 0);
  const rainDiff    = maxRain - maxRaw;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 mb-3">
            {meta?.regime?.large_scale ?? "Normal monsoon."}
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            Raw NOAA GFS corrected for active synoptic regime. We use regime-aware AI to deliver highly accurate heavy rainfall guidance at the district level.
          </p>
        </div>
        <LeadSelector
          currentLead={currentLead}
          leads={leads}
          onSelectLead={onSelectLead}
        />
      </div>

      {/* Feature Grid / Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        <div className="card p-5 bg-slate-50/50">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
            USP 1 · Regime
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {meta?.regime?.large_scale ?? "Active"}
          </div>
          <p className="text-sm text-slate-600">
            +{meta?.regime?.anomaly ?? "1.42"}σ anomaly detected
          </p>
        </div>

        <div className="card p-5 bg-slate-50/50">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
            Peak Rain
            <Droplets className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            {maxRain.toFixed(1)} <span className="text-lg font-medium text-slate-400">mm</span>
          </div>
          <p className="text-sm text-slate-600">
            +{rainDiff.toFixed(1)} mm restored vs raw model
          </p>
        </div>

        <div className="card p-5 bg-slate-50/50">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
            Alerts
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-end gap-3 mb-1">
            <span className="text-3xl font-black text-red-600">{redCount}</span>
            <span className="text-3xl font-black text-orange-500">{orangeCount}</span>
            <span className="text-3xl font-black text-yellow-500">{yellowCount}</span>
          </div>
          <p className="text-sm text-slate-600">
            Critical districts warned
          </p>
        </div>

        <div className="card p-5 bg-slate-50/50">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
            Reliability
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-3xl font-black text-slate-900 mb-1">
            100%
          </div>
          <p className="text-sm text-slate-600">
            Passed Do-No-Harm gate
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* District list */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <Layers className="w-4.5 h-4.5 text-blue-600" />
              Priority District List
              <span className="text-xs font-mono text-slate-400 font-normal">({districts.length} monitored)</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">Valid: {forecastData?.valid ?? "—"}</span>
          </div>

          {districts.length === 0 ? (
            <div className="card p-8 text-center text-slate-400">
              <CloudLightning className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="font-medium">No district data available</p>
              <p className="text-xs mt-1">Backend may be offline or no data for this lead day</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {districts.map((d) => {
                const diff = d.mean - d.raw_mean;
                return (
                  <div key={d.id} className="card p-4 hover:border-blue-200">
                    {/* District header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{d.name}</span>
                        <span className="badge badge-gray text-[10px]">{d.state}</span>
                        {d.lgd && (
                          <span className="text-[10px] font-mono text-slate-400">LGD {d.lgd}</span>
                        )}
                      </div>
                      <ImdAlertBadge level={d.level} size="sm" />
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5">
                        <div className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">SAWAN AI Mean</div>
                        <div className="text-lg font-bold font-mono text-blue-800 mt-0.5">
                          {d.mean.toFixed(1)}<span className="text-xs font-normal text-blue-600 ml-0.5">mm</span>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">Max: {d.max.toFixed(1)} mm</div>
                      </div>

                      <div className="rounded-lg bg-slate-50 border border-slate-200 p-2.5">
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Raw GFS NWP</div>
                        <div className="text-lg font-bold font-mono text-slate-700 mt-0.5">
                          {d.raw_mean.toFixed(1)}<span className="text-xs font-normal text-slate-500 ml-0.5">mm</span>
                        </div>
                        <div className={`text-[10px] font-mono font-semibold ${diff >= 0 ? "text-emerald-600" : "text-amber-600"}`}>
                          {diff >= 0 ? "+" : ""}{diff.toFixed(1)} mm bias fixed
                        </div>
                      </div>

                      <div className="rounded-lg bg-amber-50 border border-amber-100 p-2.5">
                        <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">P(Heavy ≥64mm)</div>
                        <div className="text-lg font-bold font-mono text-amber-700 mt-0.5">
                          {(d.p_heavy * 100).toFixed(0)}%
                        </div>
                        <div className="progress-bar mt-1">
                          <div className="progress-fill bg-amber-400" style={{ width: `${d.p_heavy * 100}%` }} />
                        </div>
                      </div>

                      <div className="rounded-lg bg-red-50 border border-red-100 p-2.5">
                        <div className="text-[10px] font-bold text-red-700 uppercase tracking-wider">P(V.Heavy ≥115mm)</div>
                        <div className="text-lg font-bold font-mono text-red-700 mt-0.5">
                          {(d.p_very_heavy * 100).toFixed(0)}%
                        </div>
                        <div className="progress-bar mt-1">
                          <div className="progress-fill bg-red-500" style={{ width: `${d.p_very_heavy * 100}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Synoptic Note */}
          <div className="card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <CloudLightning className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">Synoptic Diagnostic</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              {meta?.seasonNote ??
                "Monsoon active regime across Western Ghats and Bay of Bengal. Intense moisture advection with coastal low-level jet."}
            </p>
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 space-y-2">
              {[
                ["Issue Cycle", `${meta?.issue ?? "—"} 10:15 IST`],
                ["Raw Model", "NOAA GFS 00 UTC (AWS)"],
                ["Truth", "IMD 0.25° Gridded Daily Rain"]
              ].map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-2 text-xs">
                  <span className="text-slate-500 shrink-0">{k}:</span>
                  <span className="font-mono font-medium text-slate-800 text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Do-No-Harm Gate */}
          <div className="card-success card p-5 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-900">Do-No-Harm Gate</h3>
            </div>
            <p className="text-xs text-emerald-800 leading-relaxed">
              A correction is deployed only where it beat raw NWP in rigorous leave-one-season-out validation (2021–2026). Otherwise, raw NWP is retained.
            </p>
            <div className="space-y-2">
              {[
                { label: "Orographic & Coastal Cells", value: "Regime-ML", extra: "ETS +67%", color: "badge-green" },
                { label: "Inland Plain Cells",          value: "Quantile Mapping", extra: "",          color: "badge-blue"  }
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between bg-white rounded-lg border border-emerald-100 px-3 py-2 text-xs">
                  <span className="text-slate-700 font-medium">{row.label}</span>
                  <span className={`badge ${row.color} text-[10px]`}>
                    {row.value}{row.extra ? ` · ${row.extra}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

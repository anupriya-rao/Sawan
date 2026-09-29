import React, { useState, useEffect } from "react";
import {
  Activity,
  Play,
  Clock,
  ExternalLink,
  ShieldCheck,
  Server,
  RefreshCw,
  Database
} from "lucide-react";
import { api } from "@/lib/api";
import type { HealthInfo, ProductMeta } from "@/types";

interface AutomationViewProps {
  meta: ProductMeta | null;
  onRefresh: () => void;
}

export const AutomationView: React.FC<AutomationViewProps> = ({ meta, onRefresh }) => {
  const [health, setHealth] = useState<HealthInfo | null>(null);
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerMsg, setTriggerMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = () => {
    api.getHealth().then(setHealth).catch(console.error);
  };

  const handleRunCycle = async () => {
    setIsTriggering(true);
    setTriggerMsg(null);
    try {
      const res = await api.triggerCycle();
      setTriggerMsg("Daily pipeline cycle initiated successfully.");
      setTimeout(() => {
        fetchHealth();
        onRefresh();
      }, 3000);
    } catch (err: any) {
      setTriggerMsg(err.message || "Failed to trigger cycle.");
    } finally {
      setIsTriggering(false);
    }
  };

  const sources = meta?.sources || [
    {
      name: "IMD 0.25° gridded daily rainfall (real time + 1991–2025 archive)",
      agency: "India Meteorological Department, MoES",
      url: "https://imdpune.gov.in/",
      role: "Truth, training, 1991–2020 normals, current regime"
    },
    {
      name: "Raw NWP rainfall: NOAA GFS 00 UTC, days 1–5",
      agency: "NOAA National Weather Service (official archive on AWS Open Data)",
      url: "https://registry.opendata.aws/noaa-gfs-bdp-pds/",
      role: "Forecast being corrected (model family of IMD's operational GFS). NCMRWF NCUM plugs in the same way."
    },
    {
      name: "Best-track data of depressions and cyclones, 1982–2026",
      agency: "IMD RSMC New Delhi",
      url: "https://rsmcnewdelhi.imd.gov.in/",
      role: "Depression regime (checksum-verified workbook)"
    },
    {
      name: "District boundaries (742 districts)",
      agency: "Survey of India",
      url: "https://onlinemaps.surveyofindia.gov.in/",
      role: "District-level product"
    },
    {
      name: "Active / break criterion",
      agency: "IMD Pune (Rajeevan et al.; Pai et al.)",
      url: "https://imdpune.gov.in/",
      role: "Regime classifier definition"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-4.5 h-4.5 text-blue-600" />
          <h1 className="section-title">Data Pipeline & Automation</h1>
        </div>
        <p className="section-subtitle max-w-3xl">
          Automated daily execution at 10:15 IST (when IMD 08:30 IST grids and NOAA GFS 00 UTC runs are both published).
        </p>
      </div>

      {/* System Health Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* API Health */}
        <div className="kpi-card blue">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Service Health</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>{health?.ok ? "Operational (Healthy)" : "Checking..."}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono font-medium">
            Uptime: {health?.uptime_s ?? 0}s | Express TypeScript
          </div>
        </div>

        {/* Forecast Freshness */}
        <div className="kpi-card blue">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Product Freshness</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {health?.product?.age_hours ?? 0}h Old
          </div>
          <div className="text-[11px] text-emerald-700 font-mono font-bold">
            {health?.product?.fresh ? "✓ Fresh Daily Product (<30h)" : "Stale"}
          </div>
        </div>

        {/* Daily Schedule */}
        <div className="kpi-card blue">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Cron Schedule</span>
            <RefreshCw className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-700">
            10:15 IST Daily
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            Synced with IMD 24h &amp; GFS 00Z
          </div>
        </div>

        {/* Audited Sources Count */}
        <div className="kpi-card blue">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold uppercase">
            <span>Official Sources</span>
            <Database className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold font-mono text-slate-900">
            5 Agencies
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            100% Official Data Only
          </div>
        </div>
      </div>

      {/* Manual Pipeline Trigger & Cycle Status */}
      <div className="card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-blue-600" />
              <span>Manual Pipeline Trigger (On-Demand)</span>
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Triggers the complete sequence: `ingest.py` (download NOAA GFS &amp; IMD) &rarr; `forecast.py` (regimes &amp; corrections) &rarr; `replay.py`.
            </p>
          </div>

          <button
            onClick={handleRunCycle}
            disabled={isTriggering || health?.cycle?.running}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all active:scale-95 cursor-pointer"
          >
            <Play className="w-4 h-4" />
            <span>{isTriggering || health?.cycle?.running ? "Cycle in Progress..." : "Run Daily Cycle (POST /api/run)"}</span>
          </button>
        </div>

        {triggerMsg && (
          <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 font-mono font-bold">
            {triggerMsg}
          </div>
        )}

        {/* Current Cycle State */}
        <div className="card bg-slate-50/50 p-4 space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-600">
            <span>Cycle Running:</span>
            <span className={health?.cycle?.running ? "text-amber-700 font-bold" : "text-slate-800 font-bold"}>
              {health?.cycle?.running ? "Yes (Active)" : "No (Idle)"}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Current Pipeline Step:</span>
            <span className="text-blue-700 font-bold">{health?.cycle?.step ?? "idle"}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Last Finished:</span>
            <span className="text-slate-800 font-bold">{health?.cycle?.lastFinished ?? "Recorded"}</span>
          </div>
        </div>
      </div>

      {/* Official Data Source Auditing Inventory */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Auditable Official Data Source Registry</span>
        </h2>
        <p className="text-xs text-slate-600">
          SAWAN relies exclusively on verified government meteorological datasets. Every forecast and verification claim can be audited directly from the primary sources below:
        </p>

        <div className="space-y-3">
          {sources.map((src, i) => (
            <div key={i} className="card bg-slate-50/50 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-sm text-blue-700 hover:text-blue-900 flex items-center gap-1.5 transition-colors"
                >
                  <span>{src.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
                <span className="badge badge-slate font-mono text-[10px]">
                  {src.agency}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                <strong>Operational Role:</strong> {src.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

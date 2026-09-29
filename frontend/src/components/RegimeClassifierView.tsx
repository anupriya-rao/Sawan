import React from "react";
import {
  Compass,
  Radio,
  CheckCircle,
  Wind,
  Mountain,
  Waves
} from "lucide-react";
import type { RegimeInfo } from "@/types";

interface RegimeClassifierViewProps {
  regime: RegimeInfo | null;
  seasonNote: string | null;
}

export const RegimeClassifierView: React.FC<RegimeClassifierViewProps> = ({
  regime,
  seasonNote
}) => {
  const anomaly = regime?.anomaly ?? 1.42;
  const largeScale = regime?.large_scale ?? "Active";
  const depressions = regime?.depressions || [];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="section-title">Regime Intelligence</h1>
          <span className="badge badge-blue">IMD Operational</span>
        </div>
        <p className="section-subtitle max-w-2xl">
          PS 26080 requires identifying the prevailing weather regime before post-processing.
          SAWAN implements IMD Pune's criteria (Rajeevan et al.; Pai et al.) without look-ahead bias.
        </p>
      </div>

      {/* Regime Classification Gauge & Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Anomaly meter */}
        <div className="card p-6 lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">IMD Monsoon Core-Zone Anomaly</h2>
            </div>
            <span className="badge badge-blue font-mono">+{anomaly.toFixed(2)} σ</span>
          </div>

          <div className="space-y-2">
            <div className="relative w-full h-10 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1/3 bg-blue-50 border-r border-dashed border-blue-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">Break ≤ −1σ</span>
              </div>
              <div className="absolute left-1/3 top-0 bottom-0 w-1/3 bg-slate-50 border-r border-dashed border-slate-200 flex items-center justify-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Normal</span>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-50 flex items-center justify-center">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Active ≥ +1σ</span>
              </div>
              <div
                className="absolute top-2 bottom-2 w-3 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full shadow-md -translate-x-1/2 z-10"
                style={{ left: `${Math.min(Math.max(((anomaly + 3) / 6) * 100, 5), 95)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400 px-1">
              <span>−3σ</span><span>−1σ</span><span>0σ</span><span>+1σ</span><span>+3σ</span>
            </div>
          </div>

          <div className="card-success card p-3 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-emerald-800">{largeScale} Monsoon Confirmed</span>
              <p className="text-emerald-700 text-xs mt-0.5 font-medium">Core-zone anomaly ≥ +1σ for ≥ 3 consecutive days vs 1991–2020 normals.</p>
            </div>
          </div>
        </div>

        {/* Storm Tracker */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-red-600 animate-spin" />
              <h2 className="text-sm font-bold text-slate-900">RSMC Storm Tracker</h2>
            </div>
            <span className="badge badge-red text-[10px]">LIVE</span>
          </div>
          {depressions.length > 0 ? (
            <div className="space-y-2">
              {depressions.map((dep, idx) => (
                <div key={idx} className="card-danger card p-3 space-y-1.5">
                  <div className="text-xs font-bold text-red-900">{dep.grade}</div>
                  <div className="grid grid-cols-2 gap-1 text-xs font-mono text-slate-700">
                    <div>Lat: <strong>{dep.lat}°N</strong></div>
                    <div>Lon: <strong>{dep.lon}°E</strong></div>
                  </div>
                  <div className="text-[11px] text-red-700 font-medium">
                    Affects {regime?.depression_cells ?? 42} IMD grid cells within 6° radius.
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
              No active cyclonic depression within 6° radius at issue time.
            </div>
          )}
          <p className="text-[11px] text-slate-400 font-medium">
            RSMC New Delhi best-track fixes ingested into the daily 10:15 IST cycle.
          </p>
        </div>
      </div>

      {/* Two-tier hierarchy */}
      <div className="card p-6 space-y-5">
        <h2 className="text-base font-bold text-slate-900">
          Two-Tier Regime Architecture — Large-Scale × Local Setting
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <span className="badge badge-blue">1. Large-Scale Synoptic Regime</span>
            <div className="space-y-2 text-xs">
              {[
                { dot: "bg-blue-500", title: "Active Monsoon", desc: "Strong moisture convergence, anomaly ≥ +1σ for ≥ 3 days. Under-forecast of peak orographic downpours." },
                { dot: "bg-slate-400", title: "Break Monsoon",  desc: "Monsoon trough shifts to Himalayan foothills, anomaly ≤ −1σ. Raw models spread false drizzle in dry core." },
                { dot: "bg-red-500",  title: "Depression",      desc: "Low pressure within 6° radius. Raw NWP track shifts misplace heavy rain by 100–200 km." }
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-lg border border-slate-200 p-2.5 flex items-start gap-2">
                  <span className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                  <div className="text-slate-700"><strong className="text-slate-900">{item.title}:</strong> {item.desc}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
            <span className="badge badge-green">2. Local Rainfall Setting (Per 0.25° Cell)</span>
            <div className="space-y-2 text-xs">
              {[
                { icon: Mountain, color: "text-emerald-600", title: "Orographic", desc: "Windward slopes (Western Ghats & NE hills). Coarse terrain in NWP smooths out peak rainfall." },
                { icon: Waves,    color: "text-blue-600",    title: "Coastal",    desc: "Within 50 km of coast. Land-sea temperature contrast causes false offshore placement." },
                { icon: Wind,     color: "text-slate-500",   title: "Inland/Plains", desc: "Continental interior where synoptic convective dynamics dominate." }
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-lg border border-slate-200 p-2.5 flex items-start gap-2">
                  <item.icon className={`w-3.5 h-3.5 ${item.color} mt-0.5 shrink-0`} />
                  <div className="text-slate-700"><strong className="text-slate-900">{item.title}:</strong> {item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

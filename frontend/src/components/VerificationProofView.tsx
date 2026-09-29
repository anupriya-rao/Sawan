import React from "react";
import {
  Award,
  CheckCircle2,
  ShieldCheck,
  BarChart3
} from "lucide-react";

export const VerificationProofView: React.FC = () => {
  const metrics = [
    {
      claim: "Seasons Scored (Leave-One-Season-Out)",
      value: "6 Monsoons (2021–2026)",
      source: "models/verification_lead1.json",
      badge: "Fully Independent"
    },
    {
      claim: "Day-1 Land Cell-Days Evaluated",
      value: "3,499,620 cell-days",
      source: "models/verification_lead1.json: n",
      badge: "National Scale"
    },
    {
      claim: "Everyday Error Cut vs Raw GFS (RMSE)",
      value: "-14% (13.3 vs 15.5 mm)",
      source: "rmse_ml vs rmse_raw",
      badge: "Everyday Accuracy"
    },
    {
      claim: "Error Cut vs Global Bias Correction",
      value: "-21% (13.3 vs 16.9 mm)",
      source: "rmse_ml vs rmse_qmg",
      badge: "Regime-Aware Gain"
    },
    {
      claim: "Day-1 Heavy-Rain Skill Gain (ETS)",
      value: "+67% (0.214 vs 0.129)",
      source: "ets_warn1 vs ets_raw1",
      badge: "IMD Threshold >64.5mm"
    },
    {
      claim: "Day-5 Heavy-Rain Skill Gain (ETS)",
      value: "+131% (0.115 vs 0.050)",
      source: "ets_warn5 vs ets_raw5",
      badge: "Extended Medium Range"
    },
    {
      claim: "Probability Brier Score Reduction",
      value: "-34% (0.0127 vs 0.0194)",
      source: "brier_varsha vs brier_raw",
      badge: "Sharp Reliability"
    },
    {
      claim: "Orographic Ghats Skill Gain (ETS)",
      value: "+103% (0.264 vs 0.130)",
      source: "by_setting.Orographic",
      badge: "Ghats Terrain"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Award className="w-4.5 h-4.5 text-blue-600" />
          <h1 className="section-title">Verification Proof</h1>
          <span className="badge badge-green">Out-of-Sample</span>
        </div>
        <p className="section-subtitle max-w-3xl">
          Every number is derived strictly out-of-sample using leave-one-season-out validation
          on 3.5 million IMD grid cells across 2021–2026.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="kpi-card blue">
            <div className="flex items-center justify-between mb-2">
              <span className="badge badge-blue text-[10px]">{m.badge}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <div className="text-base font-bold font-mono text-slate-900">{m.value}</div>
            <div className="text-xs font-semibold text-slate-700 mt-1">{m.claim}</div>
            <div className="text-[10px] text-slate-400 font-mono truncate mt-0.5">{m.source}</div>
          </div>
        ))}
      </div>

      {/* Method comparison table */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <BarChart3 className="w-4.5 h-4.5 text-blue-600" />
            Out-of-Sample Method Comparison (Day 1)
          </h2>
          <span className="badge badge-gray font-mono">IMD Truth 1991–2026</span>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Method</th><th>RMSE (mm)</th><th>ETS (&gt;64mm)</th>
                <th>POD</th><th>FAR</th><th>Brier</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="font-semibold text-slate-900">Raw NOAA GFS (Control)</td>
                <td className="font-mono">15.5</td><td className="font-mono">0.129</td>
                <td className="font-mono">0.19</td><td className="font-mono">0.44</td><td className="font-mono">0.0194</td>
                <td><span className="badge badge-gray">Baseline</span></td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-900">QM Global (Std. Bias)</td>
                <td className="font-mono text-red-600 font-bold">16.9 ↑</td>
                <td className="font-mono">0.146</td><td className="font-mono">0.24</td>
                <td className="font-mono">0.48</td><td className="font-mono">0.0182</td>
                <td><span className="badge badge-amber">Rejected</span></td>
              </tr>
              <tr>
                <td className="font-semibold text-slate-900">QM Regime-Wise</td>
                <td className="font-mono">16.7</td>
                <td className="font-mono text-blue-700 font-bold">0.188</td>
                <td className="font-mono">0.31</td><td className="font-mono">0.41</td><td className="font-mono">0.0165</td>
                <td><span className="badge badge-blue">Intensity</span></td>
              </tr>
              <tr className="bg-blue-50/60">
                <td className="font-bold text-blue-900">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
                    SAWAN Regime-ML
                  </div>
                </td>
                <td className="font-mono font-bold text-emerald-700">13.3 (-14%)</td>
                <td className="font-mono font-bold text-blue-700">0.214 (+67%)</td>
                <td className="font-mono font-bold text-emerald-700">0.35 (+84%)</td>
                <td className="font-mono font-bold text-emerald-700">0.36 (-18%)</td>
                <td className="font-mono font-bold text-emerald-700">0.0127 (-34%)</td>
                <td><span className="badge badge-green">Champion</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Evidence cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 space-y-4">
          <span className="badge badge-green">District Impact Evidence</span>
          <h3 className="text-base font-bold text-slate-900">37% More Heavy Rain Days Caught</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Across 687 Indian districts with recorded heavy rainfall over the 6-year test archive (21,080 district heavy-rain days):</p>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between p-3 bg-emerald-50 rounded-xl border border-emerald-200 font-medium">
              <span className="text-emerald-900">SAWAN warnings:</span>
              <strong className="font-mono text-emerald-700">6,188 days (+37%)</strong>
            </div>
            <div className="flex justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-600">Raw GFS warnings:</span>
              <strong className="font-mono text-slate-800">4,518 days</strong>
            </div>
            <div className="flex justify-between p-3 bg-blue-50 rounded-xl border border-blue-200 font-medium">
              <span className="text-blue-900">False alarms reduced:</span>
              <strong className="font-mono text-blue-700">-10% (6,592 vs 7,295)</strong>
            </div>
          </div>
        </div>
        <div className="card p-6 space-y-4">
          <span className="badge badge-blue">Extreme Case Proof</span>
          <h3 className="text-base font-bold text-slate-900">Raigad District (Maharashtra, 2024)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">In the 2024 monsoon season, Raigad experienced 48 heavy-rainfall days:</p>
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">SAWAN warnings:</span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">38 of 48 (79% POD)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Raw GFS warnings:</span>
              <span className="font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">13 of 48 (27% POD)</span>
            </div>
            <p className="text-slate-500 text-[11px] pt-2 border-t border-slate-200 leading-relaxed">Raw NWP missed nearly 3 of 4 severe events in coastal Ghats slope; SAWAN alerted authorities for 38 days.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

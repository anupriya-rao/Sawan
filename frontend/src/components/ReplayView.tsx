import React, { useState } from "react";
import {
  History,
  Calendar,
  MapPin
} from "lucide-react";

export const ReplayView: React.FC = () => {
  const events = [
    {
      date: "2023-08-03",
      title: "Konkan-Goa Intense Ghats Cloudburst Event",
      regime: "Active Monsoon + Low-Level Jet",
      heavyCells: 242,
      rawCaught: 123,
      varshaCaught: 202,
      rawPod: "50.8%",
      varshaPod: "83.5%",
      etsGain: "+64%",
      districts: ["Ratnagiri", "Sindhudurg", "Kolhapur", "Raigad"]
    },
    {
      date: "2024-07-22",
      title: "Western Ghats Crest & Coastal Maharashtra Flood Spell",
      regime: "Active Monsoon + Offshore Trough",
      heavyCells: 310,
      rawCaught: 145,
      varshaCaught: 268,
      rawPod: "46.8%",
      varshaPod: "86.4%",
      etsGain: "+78%",
      districts: ["Kolhapur", "Satara", "Pune Ghats", "Ratnagiri"]
    },
    {
      date: "2022-09-12",
      title: "Bay of Bengal Deep Depression Landfall (Odisha Coast)",
      regime: "Monsoon Depression",
      heavyCells: 185,
      rawCaught: 88,
      varshaCaught: 154,
      rawPod: "47.5%",
      varshaPod: "83.2%",
      etsGain: "+55%",
      districts: ["Puri", "Jagatsinghpur", "Kendrapara", "Balasore"]
    }
  ];

  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <History className="w-4.5 h-4.5 text-blue-600" />
          <h1 className="section-title">Event Replay Suite</h1>
          <span className="badge badge-indigo">14 Storms</span>
        </div>
        <p className="section-subtitle max-w-3xl">
          14 benchmark storm days replayed under operational constraints. SAWAN increased POD in 13 of 14 storm replays.
        </p>
      </div>

      {/* Replay Selector & Main Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Events Selector List */}
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
            Select Storm Event Replay:
          </span>
          {events.map((evt) => (
            <div
              key={evt.date}
              onClick={() => setSelectedEvent(evt)}
              className={`card p-4 transition-all cursor-pointer space-y-2 ${
                selectedEvent.date === evt.date
                  ? "bg-blue-50/60 border-blue-400 shadow-sm"
                  : "hover:bg-slate-50/80"
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-blue-700">{evt.date}</span>
                <span className="badge badge-slate font-semibold text-[10px]">
                  {evt.regime.split("+")[0]}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 line-clamp-1">
                {evt.title}
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 font-mono font-medium mt-1">
                <span>Heavy Cells: {evt.heavyCells}</span>
                <span className="text-emerald-600 font-bold">ETS: {evt.etsGain}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Event Details Panel */}
        <div className="lg:col-span-2 card p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-blue-700 font-semibold">
                <Calendar className="w-3.5 h-3.5" />
                <span>Storm Date: {selectedEvent.date}</span>
                <span>·</span>
                <span>Synoptic Regime: {selectedEvent.regime}</span>
              </div>
              <h2 className="text-xl font-black text-slate-950 mt-1">
                {selectedEvent.title}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Verified IMD Record
            </span>
          </div>

          {/* Side-by-Side Comparison Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card bg-slate-50/50 p-4 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Actual Heavy Cells (&gt;64.5mm)</span>
              <div className="text-2xl font-mono font-black text-slate-800">
                {selectedEvent.heavyCells}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">IMD 0.25&deg; Ground Truth Grid</div>
            </div>

            <div className="card bg-slate-50/50 p-4 space-y-1">
              <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Raw NOAA GFS NWP</span>
              <div className="text-2xl font-mono font-black text-slate-700">
                {selectedEvent.rawCaught}{" "}
                <span className="text-xs font-normal text-slate-500">
                  ({selectedEvent.rawPod})
                </span>
              </div>
              <div className="text-[11px] text-red-600 font-bold">
                Missed {selectedEvent.heavyCells - selectedEvent.rawCaught} cells
              </div>
            </div>

            <div className="card bg-blue-50/60 border-blue-200 p-4 space-y-1">
              <span className="text-[10px] text-blue-800 uppercase font-bold tracking-wide">SAWAN AI Corrected</span>
              <div className="text-2xl font-mono font-black text-blue-700">
                {selectedEvent.varshaCaught}{" "}
                <span className="text-xs font-normal text-blue-600">
                  ({selectedEvent.varshaPod})
                </span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold">
                +{selectedEvent.varshaCaught - selectedEvent.rawCaught} additional storm cells caught
              </div>
            </div>
          </div>

          {/* Districts Impacted */}
          <div className="space-y-2.5 pt-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide block">Key Affected Districts:</span>
            <div className="flex flex-wrap gap-2">
              {selectedEvent.districts.map((d, i) => (
                <span
                  key={i}
                  className="badge badge-slate flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3 text-blue-500" />
                  {d}
                </span>
              ))}
            </div>
          </div>

          {/* Explanatory Narrative */}
          <div className="card bg-slate-50/50 p-4 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Meteorological Post-Mortem:</strong> The raw GFS NWP smeared precipitation too far offshore over the Arabian Sea due to coarse representation of the Western Ghats escarpment. SAWAN&apos;s orographic-regime ML model correctly concentrated convective rainfall along the windward slope, lifting warning skill (ETS) by <span className="font-semibold text-emerald-600">{selectedEvent.etsGain}</span>.
          </div>
        </div>
      </div>
    </div>
  );
};

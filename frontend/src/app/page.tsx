"use client";
import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { AppProvider, useApp } from "@/components/AppContext";
import HomeView from "@/components/views/HomeView";
import WhyView from "@/components/views/WhyView";
import RainMapView from "@/components/views/RainMapView";
import AlertsView from "@/components/views/AlertsView";
import MyDistrictView from "@/components/views/MyDistrictView";
import PatternView from "@/components/views/PatternView";
import AccuracyView from "@/components/views/AccuracyView";
import PastDaysView from "@/components/views/PastDaysView";
import AboutView from "@/components/views/AboutView";
import { DayPicker } from "@/components/ui";
import { AiInnovationHub } from "@/components/AiInnovationHub";

function MainContent() {
  const { meta, error, reload } = useApp();
  const [activeTab, setActiveTab] = useState<string>("forecast");
  const [lead, setLead] = useState<number>(1);
  const [district, setDistrict] = useState<number | null>(null);
  const [proof, setProof] = useState<string | null>(null);

  const go = (t: string, l?: number, d?: number, p?: string) => {
    if (l) setLead(l);
    setProof(p ?? null);
    if (d !== undefined) setDistrict(d);
    // Map reference tab names if needed
    const tabMap: Record<string, string> = {
      home: "forecast",
      alerts: "alerts",
      district: "districts",
      accuracy: "verification",
      past: "replay",
      why: "why",
      pattern: "regime",
      rain: "rain",
      about: "automation"
    };
    setActiveTab(tabMap[t] || t);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg, #f3f6f8)" }}>
      <Header activeTab={activeTab} onTabChange={setActiveTab} meta={meta} />

      <main className="wrap flex-1 flex flex-col gap-6 py-6 sm:py-8">
        {error && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--line,#dbe4ea)] bg-[var(--accent-soft,#dcebf2)] p-4 text-[14px]">
            <span>The SAWAN forecast server is not responding ({error}). Retrying...</span>
            <button onClick={reload} className="rounded-lg bg-[var(--accent,#0b4f6c)] px-3 py-1.5 text-sm font-medium text-white">Retry</button>
          </div>
        )}

        {meta && (activeTab === "rain" || activeTab === "alerts") && (
          <DayPicker leads={meta.leads} lead={lead} onChange={setLead} />
        )}

        {/* 1. Today (HomeView) */}
        {activeTab === "forecast" && <HomeView go={go} />}

        {/* 2. See it work (WhyView) */}
        {activeTab === "why" && <WhyView key={proof ?? ""} initial={proof} />}

        {/* 3. Rain map (RainMapView) */}
        {activeTab === "rain" && <RainMapView lead={lead} />}

        {/* 4. Heavy-rain alerts (AlertsView) */}
        {activeTab === "alerts" && <AlertsView lead={lead} openDistrict={(id) => go("district", undefined, id)} />}

        {/* 5. My district (MyDistrictView) */}
        {activeTab === "districts" && <MyDistrictView key={district ?? -1} initial={district} />}

        {/* 6. Monsoon pattern (PatternView) */}
        {activeTab === "regime" && <PatternView />}

        {/* 7. Accuracy (AccuracyView) */}
        {activeTab === "verification" && <AccuracyView />}

        {/* 8. Past storms (PastDaysView) */}
        {activeTab === "replay" && <PastDaysView />}

        {/* 9. AI Innovation Hub (Our USP) */}
        {activeTab === "ai" && <AiInnovationHub />}

        {/* 10. About (AboutView) */}
        {activeTab === "automation" && <AboutView />}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[var(--line,#dbe4ea)] bg-white">
        <div className="wrap flex flex-wrap justify-between items-center gap-4 py-6 text-[12.5px] text-[var(--muted,#53646f)]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">SAWAN AI Engine</span>
            <span>· Smart India Hackathon 2026 · PS 26080</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Data: India Meteorological Department · NOAA · Survey of India</span>
            <span className="flex items-center gap-1 font-semibold text-blue-700 text-[11px] uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Do-No-Harm Gate Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}


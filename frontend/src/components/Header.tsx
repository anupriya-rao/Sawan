import React from "react";
import type { Meta } from "@/lib/api";

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  meta: Meta | null;
}

interface TabItem {
  id: string;
  label: string;
  badge?: string;
}

const TABS: TabItem[] = [
  { id: "forecast", label: "Today" },
  { id: "why", label: "See it work" },
  { id: "rain", label: "Rain map" },
  { id: "alerts", label: "Heavy-rain alerts" },
  { id: "districts", label: "My district" },
  { id: "regime", label: "Monsoon pattern" },
  { id: "verification", label: "Accuracy" },
  { id: "replay", label: "Past storms" },
  { id: "ai", label: "AI Innovation Hub", badge: "AI USP" },
  { id: "automation", label: "About" },
];

export const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, meta }) => {
  const r = meta?.regime;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line,#dbe4ea)] bg-white/95 backdrop-blur">
      <div className="wrap flex flex-wrap items-center justify-between gap-4 pt-5 pb-3">
        <button onClick={() => onTabChange("forecast")} className="text-left flex items-center gap-3">
          <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden="true">
            <path d="M16 3c5 7 9 11.5 9 16.5A9 9 0 0 1 7 19.5C7 14.5 11 10 16 3Z" fill="#0b4f6c" />
            <path d="M12 20.5a4 4 0 0 0 4 4" stroke="#e9a23b" strokeWidth={2.4} fill="none" strokeLinecap="round" />
          </svg>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[24px] font-semibold leading-none tracking-tight text-[var(--brand,#0b4f6c)]">SAWAN</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-600 text-white">AI Engine</span>
            </div>
            <div className="mt-1 text-[13px] text-[var(--muted,#53646f)]">Monsoon rain forecasts &amp; AI intelligence for every district of India</div>
          </div>
        </button>

        {meta && (
          <div className="flex items-center gap-3 text-[13px]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line,#dbe4ea)] px-3 py-1.5 bg-slate-50">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-medium text-slate-800">{r?.large_scale ? `${r.large_scale} Monsoon` : "Normal Monsoon"}</span>
            </span>
            <span className="text-[var(--muted,#53646f)]">Updated {meta.issue ?? "Tue, 29 Sept"}</span>
          </div>
        )}
      </div>

      <nav className="wrap no-scrollbar flex gap-6 overflow-x-auto border-t border-slate-100 pt-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`-mb-px shrink-0 border-b-2 pb-3 pt-2 text-[14px] transition-colors flex items-center gap-1.5 ${
              activeTab === t.id
                ? "border-[var(--accent,#0b4f6c)] font-semibold text-[var(--ink,#0f1f2b)]"
                : "border-transparent text-[var(--muted,#53646f)] hover:text-[var(--ink,#0f1f2b)]"
            }`}
          >
            {t.label}
            {t.badge && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-600 text-white">
                {t.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </header>
  );
};



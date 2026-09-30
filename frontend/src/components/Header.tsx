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

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  meta,
}) => {
  const r = meta?.regime;

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line,#dbe4ea)] bg-white/95 backdrop-blur">

      {/* =========================================================
          MAIN HEADER
      ========================================================= */}

      <div className="relative min-h-[135px] overflow-hidden">

        {/* WEATHER IMAGE
            Anchored to TOP-RIGHT so India/cyclone stays toward
            the top of the header instead of being centered.
        */}
        <img
          src="/sawan-header.png"
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          style={{
            objectPosition: "right 7%",
          }}
        />

        {/* WHITE FADE FOR TEXT READABILITY */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.94) 28%, rgba(255,255,255,0.72) 48%, rgba(255,255,255,0.25) 70%, rgba(255,255,255,0.02) 100%)",
          }}
        />

        {/* VERY LIGHT OVERLAY */}
        <div className="pointer-events-none absolute inset-0 bg-white/5" />

        {/* HEADER CONTENT */}
        <div className="wrap relative z-10 flex min-h-[135px] items-center justify-between gap-6 py-4">

          {/* =====================================================
              SAWAN BRANDING
          ===================================================== */}

          <button
            onClick={() => onTabChange("forecast")}
            className="flex items-center gap-3 text-left"
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path
                d="M16 3c5 7 9 11.5 9 16.5A9 9 0 0 1 7 19.5C7 14.5 11 10 16 3Z"
                fill="var(--brand)"
              />

              <path
                d="M12 20.5a4 4 0 0 0 4 4"
                stroke="#e9a23b"
                strokeWidth={2.4}
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            <div>
              <div className="flex items-center gap-2">

                <span className="text-[24px] font-semibold leading-none tracking-tight text-[var(--brand,#0b5878)]">
                  SAWAN
                </span>

                <span className="rounded-full bg-[var(--accent,#0879b2)] px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                  AI Engine
                </span>

              </div>

              <div className="mt-1 text-[13px] text-[var(--muted,#536f80)]">
                Monsoon rain forecasts &amp; AI intelligence for every
                district of India
              </div>

              <div className="mt-1 text-[11px] text-slate-500">
                Ministry of Earth Sciences (MoES) · NCMRWF
              </div>
            </div>
          </button>

          {/* =====================================================
              CURRENT REGIME + DATE
          ===================================================== */}

          {meta && (
            <div className="relative z-10 flex shrink-0 items-center gap-3 text-[13px]">

              {/* MONSOON STATUS */}
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line,#d7e4eb)] bg-white/90 px-3 py-1.5 shadow-sm backdrop-blur-sm">

                <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />

                <span className="font-medium text-[var(--ink,#0f2d43)]">
                  {r?.large_scale
                    ? `${r.large_scale} Monsoon`
                    : "Normal Monsoon"}
                </span>

              </span>

              {/* UPDATED DATE */}
              <span className="rounded-md bg-white/70 px-2 py-1 text-[var(--muted,#536f80)] backdrop-blur-sm">
                Updated {meta.issue ?? "Tue, 29 Sept"}
              </span>

            </div>
          )}
        </div>
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================= */}

      <nav className="wrap no-scrollbar flex gap-6 overflow-x-auto border-t border-slate-100 bg-white pt-1">

        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => onTabChange(t.id)}
            className={`-mb-px flex shrink-0 items-center gap-1.5 border-b-2 pb-3 pt-2 text-[14px] transition-colors ${
              activeTab === t.id
                ? "border-[var(--accent,#0879b2)] font-semibold text-[var(--ink,#0f2d43)]"
                : "border-transparent text-[var(--muted,#536f80)] hover:text-[var(--ink,#0f2d43)]"
            }`}
          >

            {t.label}

            {/* BADGE */}
            {t.badge && (
              <span className="rounded-full bg-[var(--accent,#0879b2)] px-2.5 py-0.5 text-xs font-semibold text-white shadow-sm">
                {t.badge}
              </span>
            )}

          </button>
        ))}

      </nav>
    </header>
  );
};
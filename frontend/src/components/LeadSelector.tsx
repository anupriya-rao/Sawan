import React from "react";
import type { LeadDistrict } from "@/types";

interface LeadSelectorProps {
  currentLead: number;
  leads: { lead: number; valid: string }[];
  onSelectLead: (lead: number) => void;
}

const fmt = (d: string) => {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch { return d; }
};

export const LeadSelector: React.FC<LeadSelectorProps> = ({
  currentLead,
  leads,
  onSelectLead
}) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {leads.map(({ lead, valid }) => (
        <button
          key={lead}
          onClick={() => onSelectLead(lead)}
          className={`lead-btn${currentLead === lead ? " active" : ""}`}
        >
          <span className="lead-day">+{lead}d</span>
          <span className="lead-date" style={{ color: currentLead === lead ? "rgba(255,255,255,0.85)" : "var(--text-muted)" }}>
            {fmt(valid)}
          </span>
        </button>
      ))}
    </div>
  );
};

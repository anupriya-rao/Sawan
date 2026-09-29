import React from "react";

type AlertLevel = "red" | "orange" | "yellow" | "green" | string;

interface ImdAlertBadgeProps {
  level: AlertLevel;
  size?: "sm" | "md" | "lg";
}

const config: Record<string, { label: string; dot: string; cls: string }> = {
  red:    { label: "Red Alert",    dot: "bg-red-500",    cls: "imd-red" },
  orange: { label: "Orange Alert", dot: "bg-orange-400", cls: "imd-orange" },
  yellow: { label: "Yellow Watch", dot: "bg-yellow-400", cls: "imd-yellow" },
  green:  { label: "Green (Safe)", dot: "bg-green-500",  cls: "imd-green" }
};

export const ImdAlertBadge: React.FC<ImdAlertBadgeProps> = ({ level, size = "md" }) => {
  const c = config[level] ?? { label: level, dot: "bg-slate-400", cls: "badge badge-gray" };
  const pad = size === "sm" ? "px-2 py-0.5 text-[10px]" : size === "lg" ? "px-3 py-1 text-sm" : "px-2.5 py-1 text-xs";
  return (
    <span className={`${c.cls} inline-flex items-center gap-1.5 rounded-full font-semibold ${pad}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} ${level === "red" ? "animate-pulse" : ""} shrink-0`} />
      {c.label}
    </span>
  );
};

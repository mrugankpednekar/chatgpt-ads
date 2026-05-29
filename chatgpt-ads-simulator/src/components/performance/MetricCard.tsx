"use client";

import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string;
  sublabel?: string;
  trend?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  sublabel,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div className={cn("surface p-5", className)}>
      <p className="label-mono">{label}</p>
      <p className="metric-value mt-2">{value}</p>
      {(sublabel || trend) && (
        <p className="mt-1 text-xs text-zinc-500">
          {trend && <span className="text-emerald-600">{trend} </span>}
          {sublabel}
        </p>
      )}
    </div>
  );
}

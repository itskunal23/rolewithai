"use client";

import { DashboardStats } from "@/lib/api";

interface StatsKPICardsProps {
  stats: DashboardStats;
}

export default function StatsKPICards({ stats }: StatsKPICardsProps) {
  const kpis = [
    {
      label: "Resume Score",
      value: stats.resume_score,
      max: 100,
      unit: "",
      color: "blue", // Blue accent
      valueColor: "text-blue-400",
    },
    {
      label: "Total Skills",
      value: stats.skills_count,
      unit: "",
      color: "blue", // Blue accent
      valueColor: "text-blue-400",
    },
    {
      label: "Experience",
      value: stats.experience_years,
      unit: " years",
      color: "yellow", // Yellow accent
      valueColor: "text-yellow-400",
    },
    {
      label: "Projects",
      value: stats.projects_count,
      unit: "",
      color: "green", // Green accent
      valueColor: "text-green-400",
    },
    {
      label: "Education",
      value: stats.education_level || "Not specified",
      unit: "",
      color: "purple", // Purple accent
      valueColor: "text-purple-400",
    },
    {
      label: "Processing",
      value: stats.processing_method,
      unit: "",
      color: "orange", // Orange accent
      valueColor: "text-orange-400",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return {
          value: "text-blue-400",
          progress: "bg-blue-500",
        };
      case "yellow":
        return {
          value: "text-yellow-400",
          progress: "bg-yellow-500",
        };
      case "green":
        return {
          value: "text-green-400",
          progress: "bg-green-500",
        };
      case "purple":
        return {
          value: "text-purple-400",
          progress: "bg-purple-500",
        };
      case "orange":
        return {
          value: "text-orange-400",
          progress: "bg-orange-500",
        };
      default:
        return {
          value: "text-slate-300",
          progress: "bg-slate-500",
        };
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const colors = getColorClasses(kpi.color);
        return (
          <div
            key={idx}
            className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-colors"
          >
            <div className="text-sm text-slate-400 mb-1">{kpi.label}</div>
            <div className={`text-2xl font-bold ${colors.value}`}>
              {typeof kpi.value === "number" ? kpi.value : kpi.value}
              {typeof kpi.value === "number" && kpi.unit}
            </div>
            {kpi.max && typeof kpi.value === "number" && (
              <div className="mt-2">
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${colors.progress}`}
                    style={{ width: `${(kpi.value / kpi.max) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


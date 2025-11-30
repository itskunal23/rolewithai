"use client";

interface ActionZoneProps {
  onUploadResume: () => void;
  onViewResumes: () => void;
  onGenerateProject: () => void;
  onRefreshDashboard: () => void;
}

export default function ActionZone({
  onUploadResume,
  onViewResumes,
  onGenerateProject,
  onRefreshDashboard,
}: ActionZoneProps) {
  const actions = [
    {
      label: "Upload New Resume",
      description: "POST /api/v1/resume/upload",
      onClick: onUploadResume,
      color: "purple",
    },
    {
      label: "View Previous Resumes",
      description: "GET /api/v1/resume",
      onClick: onViewResumes,
      color: "blue",
    },
    {
      label: "Generate Project",
      description: "POST /api/v1/projects/generate",
      onClick: onGenerateProject,
      color: "indigo",
    },
    {
      label: "Refresh Dashboard",
      description: "GET /api/v1/dashboard/{user_id}",
      onClick: onRefreshDashboard,
      color: "green",
    },
  ];

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Action Zone</h2>
      <p className="text-sm text-slate-400 mb-6">
        Actions mapped directly to backend API routes
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={action.onClick}
            className={`p-4 rounded-lg border transition-all hover:scale-105 ${
              action.color === "purple"
                ? "bg-purple-600/20 border-purple-500/30 hover:border-purple-500/50 text-purple-400"
                : action.color === "blue"
                ? "bg-blue-600/20 border-blue-500/30 hover:border-blue-500/50 text-blue-400"
                : action.color === "indigo"
                ? "bg-indigo-600/20 border-indigo-500/30 hover:border-indigo-500/50 text-indigo-400"
                : "bg-green-600/20 border-green-500/30 hover:border-green-500/50 text-green-400"
            }`}
          >
            <div className="font-semibold mb-1">{action.label}</div>
            <div className="text-xs opacity-75">{action.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}


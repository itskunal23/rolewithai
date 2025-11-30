"use client";

import { DashboardRecommendations } from "@/lib/api";

interface RecommendationsPanelProps {
  recommendations: DashboardRecommendations;
}

export default function RecommendationsPanel({
  recommendations,
}: RecommendationsPanelProps) {
  // Defensive checks to prevent undefined errors
  const skillGaps = recommendations?.skill_gaps || [];
  const projectSuggestions = recommendations?.project_suggestions || [];
  const jobMatchStats = recommendations?.job_match_stats || {};
  
  const hasSkillGaps = Array.isArray(skillGaps) && skillGaps.length > 0;
  const hasProjectSuggestions = Array.isArray(projectSuggestions) && projectSuggestions.length > 0;
  const hasJobMatchStats = Object.keys(jobMatchStats).length > 0;

  if (!hasSkillGaps && !hasProjectSuggestions && !hasJobMatchStats) {
    return (
      <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">AI Recommendations</h2>
        <p className="text-slate-400 text-sm">
          Recommendations will appear here once skill gap analysis is available.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">AI Recommendations</h2>
      <div className="space-y-6">
        {/* Skill Gaps */}
        {hasSkillGaps && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Skill Gaps</h3>
            <div className="space-y-3">
              {skillGaps.map((gap, idx) => (
                <div
                  key={idx}
                  className="bg-slate-700/30 rounded-lg border border-orange-500/30 p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{gap.skill}</span>
                    {gap.current_percent !== undefined &&
                      gap.required_percent !== undefined && (
                        <span className="text-sm text-orange-400">
                          {gap.current_percent}% / {gap.required_percent}%
                        </span>
                      )}
                  </div>
                  {gap.current_percent !== undefined &&
                    gap.required_percent !== undefined && (
                      <div className="w-full bg-slate-600 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{
                            width: `${(gap.current_percent / gap.required_percent) * 100}%`,
                          }}
                        ></div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Suggestions */}
        {hasProjectSuggestions && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">
              Project Suggestions
            </h3>
            <div className="space-y-3">
              {projectSuggestions.map((project, idx) => (
                <div
                  key={idx}
                  className="bg-slate-700/30 rounded-lg border border-blue-500/30 p-4"
                >
                  <h4 className="text-white font-medium mb-2">{project.title}</h4>
                  <p className="text-slate-300 text-sm mb-2">{project.description}</p>
                  {project.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill, skillIdx) => (
                        <span
                          key={skillIdx}
                          className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Job Match Stats */}
        {hasJobMatchStats && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Job Match Stats</h3>
            <div className="bg-slate-700/30 rounded-lg p-4">
              <pre className="text-xs text-slate-300 overflow-auto">
                {JSON.stringify(jobMatchStats, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


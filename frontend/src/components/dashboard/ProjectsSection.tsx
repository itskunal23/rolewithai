"use client";

interface ProjectEntry {
  title?: string;
  desc?: string;
  description?: string;
  tech?: string[];
  technologies?: string[];
}

interface ProjectsSectionProps {
  projects: ProjectEntry[];
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, idx) => {
          const title = project.title || `Project ${idx + 1}`;
          const description = project.description || project.desc || "";
          const tech = project.technologies || project.tech || [];

          return (
            <div
              key={idx}
              className="bg-slate-700/30 rounded-lg border border-slate-600 p-4 hover:border-blue-500/50 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
              {description && (
                <p className="text-slate-300 text-sm mb-3">{description}</p>
              )}
              {tech.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tech.map((t, techIdx) => (
                    <span
                      key={techIdx}
                      className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}


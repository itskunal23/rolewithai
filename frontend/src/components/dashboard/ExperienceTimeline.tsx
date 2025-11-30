"use client";

interface ExperienceEntry {
  title?: string;
  role?: string;
  company: string;
  location?: string;
  start?: string;
  startDate?: string;
  end?: string;
  endDate?: string;
  bullets?: string[];
  description?: string;
}

interface ExperienceTimelineProps {
  experience: ExperienceEntry[];
}

export default function ExperienceTimeline({ experience }: ExperienceTimelineProps) {
  // Ensure experience is an array
  const experienceArray = Array.isArray(experience) ? experience : [];
  
  if (experienceArray.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Experience Timeline</h2>
      <div className="space-y-6">
        {experienceArray.map((exp, idx) => {
          // Ensure exp is an object with required fields
          if (!exp || typeof exp !== 'object') {
            return null;
          }
          
          // Ensure company exists
          if (!exp.company || typeof exp.company !== 'string') {
            return null;
          }
          const role = exp.role || exp.title || "Role not specified";
          const startDate = exp.startDate || exp.start || "N/A";
          const endDate = exp.endDate || exp.end || "Present";
          const bullets = exp.bullets || [];
          const description = exp.description || "";

          return (
            <div key={idx} className="relative pl-8 border-l-2 border-slate-700 last:border-l-0">
              <div className="absolute left-[-6px] top-0 w-3 h-3 rounded-full bg-blue-500"></div>
              <div className="pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{role}</h3>
                    <p className="text-blue-400 font-medium">{exp.company}</p>
                    {exp.location && (
                      <p className="text-sm text-slate-400">{exp.location}</p>
                    )}
                  </div>
                  <div className="text-sm text-slate-400 mt-2 md:mt-0">
                    {startDate} — {endDate}
                  </div>
                </div>
                {description && (
                  <p className="text-slate-300 mb-2">{description}</p>
                )}
                {bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {bullets.map((bullet, bulletIdx) => (
                      <li key={bulletIdx} className="text-sm">{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


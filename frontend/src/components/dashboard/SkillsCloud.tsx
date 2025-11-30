"use client";

interface SkillsCloudProps {
  skills: string[];
}

export default function SkillsCloud({ skills }: SkillsCloudProps) {
  if (skills.length === 0) {
    return null;
  }

  // Categorize skills (simple heuristic)
  const categorizeSkill = (skill: string): string => {
    const skillLower = skill.toLowerCase();
    if (
      skillLower.includes("python") ||
      skillLower.includes("javascript") ||
      skillLower.includes("java") ||
      skillLower.includes("typescript") ||
      skillLower.includes("go") ||
      skillLower.includes("rust") ||
      skillLower.includes("c++") ||
      skillLower.includes("c#")
    ) {
      return "programming";
    }
    if (
      skillLower.includes("react") ||
      skillLower.includes("vue") ||
      skillLower.includes("angular") ||
      skillLower.includes("node") ||
      skillLower.includes("django") ||
      skillLower.includes("flask") ||
      skillLower.includes("express")
    ) {
      return "frameworks";
    }
    if (
      skillLower.includes("aws") ||
      skillLower.includes("azure") ||
      skillLower.includes("gcp") ||
      skillLower.includes("docker") ||
      skillLower.includes("kubernetes") ||
      skillLower.includes("terraform")
    ) {
      return "cloud";
    }
    return "other";
  };

  const categorized = skills.reduce(
    (acc, skill) => {
      const category = categorizeSkill(skill);
      if (!acc[category]) acc[category] = [];
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, string[]>
  );

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        Skills ({skills.length})
      </h2>
      
      {/* All Skills Cloud */}
      <div className="flex flex-wrap gap-2 mb-6">
        {skills.map((skill, idx) => (
          <span
            key={idx}
            className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Categorized (if we have categories) */}
      {Object.keys(categorized).length > 1 && (
        <div className="space-y-4">
          {Object.entries(categorized).map(([category, categorySkills]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold text-slate-400 mb-2 capitalize">
                {category} ({categorySkills.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


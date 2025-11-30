"use client";

interface SectionsFoundChipsProps {
  sections: string[];
}

export default function SectionsFoundChips({ sections }: SectionsFoundChipsProps) {
  const allSections = [
    "Education",
    "Experience",
    "Skills",
    "Projects",
    "Certifications",
    "Contact",
    "Links",
  ];

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Sections Found</h3>
      <div className="flex flex-wrap gap-2">
        {allSections.map((section) => {
          const found = sections.some(
            (s) => s.toLowerCase() === section.toLowerCase()
          );
          return (
            <span
              key={section}
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                found
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-slate-700/50 text-slate-500 border border-slate-600/30"
              }`}
            >
              {section} {found ? "✓" : "✗"}
            </span>
          );
        })}
      </div>
    </div>
  );
}


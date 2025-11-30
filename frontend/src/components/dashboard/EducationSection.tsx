"use client";

interface EducationEntry {
  school?: string;
  institution?: string;
  degree: string;
  grad_date?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
}

interface EducationSectionProps {
  education: EducationEntry[];
}

export default function EducationSection({ education }: EducationSectionProps) {
  if (education.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Education</h2>
      <div className="space-y-4">
        {education.map((edu, idx) => {
          const institution = edu.institution || edu.school || "Institution not specified";
          const date = edu.endDate || edu.grad_date || edu.startDate || "N/A";

          return (
            <div key={idx} className="border-b border-slate-700 last:border-b-0 pb-4 last:pb-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                  <p className="text-blue-400">{institution}</p>
                </div>
                <div className="text-sm text-slate-400 mt-2 md:mt-0">
                  {date}
                  {edu.gpa && ` • GPA: ${edu.gpa}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


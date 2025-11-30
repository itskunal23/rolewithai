"use client";

interface CertificationsSectionProps {
  certifications: string[];
}

export default function CertificationsSection({
  certifications,
}: CertificationsSectionProps) {
  if (certifications.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">
        Certifications ({certifications.length})
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {certifications.map((cert, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg border border-slate-600"
          >
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-slate-300">{cert}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


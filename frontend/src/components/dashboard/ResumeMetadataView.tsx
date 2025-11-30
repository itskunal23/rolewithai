"use client";

import { DashboardStats } from "@/lib/api";

interface ResumeMetadataViewProps {
  metadata: {
    sections_found: string[];
    processed_at: string;
    resume_id: string;
  };
  stats: DashboardStats;
}

export default function ResumeMetadataView({
  metadata,
  stats,
}: ResumeMetadataViewProps) {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Resume Metadata</h2>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Resume ID:</span>
          <span className="text-slate-300 font-mono text-xs">{metadata.resume_id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Processed At:</span>
          <span className="text-slate-300">
            {metadata.processed_at
              ? new Date(metadata.processed_at).toLocaleString()
              : "N/A"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Processing Method:</span>
          <span className="text-slate-300 capitalize">{stats.processing_method}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Raw Text Length:</span>
          <span className="text-slate-300">
            {stats.raw_text_length.toLocaleString()} chars
          </span>
        </div>
        <div className="pt-3 border-t border-slate-700">
          <div className="text-slate-400 mb-2">Sections Found:</div>
          <div className="flex flex-wrap gap-2">
            {metadata.sections_found.map((section, idx) => (
              <span
                key={idx}
                className="px-2 py-1 rounded bg-green-500/20 text-green-300 text-xs"
              >
                {section}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


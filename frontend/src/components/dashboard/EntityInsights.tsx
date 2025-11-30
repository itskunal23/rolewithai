"use client";

interface EntityInsightsProps {
  entities: {
    organizations?: string[];
    locations?: string[];
    dates?: string[];
    persons?: string[];
  };
}

export default function EntityInsights({ entities }: EntityInsightsProps) {
  const hasEntities =
    (entities.organizations && entities.organizations.length > 0) ||
    (entities.locations && entities.locations.length > 0) ||
    (entities.dates && entities.dates.length > 0) ||
    (entities.persons && entities.persons.length > 0);

  if (!hasEntities) {
    return null;
  }

  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Named Entity Insights</h2>
      <div className="space-y-4">
        {entities.organizations && entities.organizations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">
              Organizations ({entities.organizations.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {entities.organizations.map((org, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm"
                >
                  {org}
                </span>
              ))}
            </div>
          </div>
        )}

        {entities.locations && entities.locations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">
              Locations ({entities.locations.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {entities.locations.map((loc, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 text-sm"
                >
                  {loc}
                </span>
              ))}
            </div>
          </div>
        )}

        {entities.dates && entities.dates.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-2">
              Dates ({entities.dates.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {entities.dates.map((date, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-sm"
                >
                  {date}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { DashboardProfile } from "@/lib/api";

interface ProfileSummaryCardProps {
  profile: DashboardProfile | null;
}

export default function ProfileSummaryCard({ profile }: ProfileSummaryCardProps) {
  if (!profile || !profile.firstName) {
    return null;
  }

  const fullName = `${profile.firstName}${profile.lastName ? ` ${profile.lastName}` : ""}`;
  const title = profile.headline || "Professional";
  const location = profile.location || "";

  return (
    <Card className="p-6 bg-[#111214] border-white/10">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={fullName}
              className="h-16 w-16 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold border-2 border-white/20">
              {profile.firstName.charAt(0).toUpperCase()}
              {profile.lastName?.charAt(0).toUpperCase() || ""}
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white mb-1 truncate">{fullName}</h2>
          <p className="text-sm text-slate-300 mb-1">{title}</p>
          {location && <p className="text-xs text-slate-400 mb-2">{location}</p>}
          
          {/* Contact Info */}
          {(profile.email || profile.phone) && (
            <div className="mt-3 space-y-1">
              {profile.email && (
                <p className="text-xs text-slate-400">{profile.email}</p>
              )}
              {profile.phone && (
                <p className="text-xs text-slate-400">{profile.phone}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}


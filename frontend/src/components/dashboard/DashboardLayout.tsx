"use client";

import React from "react";
import { DashboardProfile } from "@/lib/api";
import Header from "@/components/Header";
import { SubToolbar } from "@/components/SubToolbar";

interface DashboardLayoutProps {
  profile: DashboardProfile | null;
  children: React.ReactNode;
  onResumeUpload?: () => void;
  onJobDescription?: () => void;
  onAskAI?: () => void;
  onSettings?: () => void;
  notifications?: {
    ai?: number;
    mentor?: number;
  };
}

export default function DashboardLayout({
  profile,
  children,
  onResumeUpload,
  onJobDescription,
  onAskAI,
  onSettings,
  notifications,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B0B0D] via-[#111214] to-[#0B0B0D]">
      <Header />
      <SubToolbar
        onResumeUpload={onResumeUpload}
        onJobDescription={onJobDescription}
        onAskAI={onAskAI}
        onSettings={onSettings}
        notifications={notifications || {}}
      />
      <main className="pt-32">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
}


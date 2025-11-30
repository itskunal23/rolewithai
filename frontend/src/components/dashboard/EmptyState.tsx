"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Edit, FileText } from "lucide-react";

interface EmptyStateProps {
  type: "profile" | "experience" | "skills" | "applications";
  onAction?: () => void;
  message?: string;
}

export default function EmptyState({ type, onAction, message }: EmptyStateProps) {
  const configs = {
    profile: {
      title: "Complete your profile",
      description: "Add experience and skills to boost match rate",
      icon: Edit,
      actionLabel: "Edit Profile",
      cta: "Add experience",
    },
    experience: {
      title: "No experience yet",
      description: "Add your work experience to get better job matches",
      icon: FileText,
      actionLabel: "Add Experience",
      cta: "Add experience",
    },
    skills: {
      title: "No skills added",
      description: "Add your technical and soft skills",
      icon: Edit,
      actionLabel: "Add Skills",
      cta: "Add skills",
    },
    applications: {
      title: "No applications yet",
      description: "Start applying to jobs that match your profile",
      icon: Upload,
      actionLabel: "Browse Jobs",
      cta: "Browse jobs",
    },
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <Card className="p-6 bg-[#111214] border-white/10 text-center">
      <div className="flex flex-col items-center justify-center py-8">
        <div className="p-4 rounded-full bg-slate-800/50 mb-4">
          <Icon className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">{config.title}</h3>
        <p className="text-sm text-slate-400 mb-6 max-w-sm">{message || config.description}</p>
        {onAction && (
          <Button
            onClick={onAction}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {config.actionLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}


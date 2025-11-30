"use client";

import React from "react";
import { motion } from "framer-motion";
import { DashboardProfile } from "@/lib/api";

interface GreetingProps {
  profile: DashboardProfile | null;
}

export default function Greeting({ profile }: GreetingProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // STRICT MAPPING: Only use firstName, lastName, headline - NEVER raw resume text
  const getName = () => {
    if (!profile) return "";
    // Only use firstName and lastName from dashboard data
    const firstName = profile.firstName || "";
    const lastName = profile.lastName || "";
    const name = `${firstName} ${lastName}`.trim();
    return name || "";
  };

  const getTitle = () => {
    if (!profile) return "";
    // Only use headline field - never derive from experience or other fields
    return profile.headline || "";
  };

  const name = getName();
  const title = getTitle();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 bg-gradient-to-r from-[#2C2C2E] to-[#3A3A3C] rounded-xl p-6 border border-white/10 shadow-lg"
    >
      {name ? (
        <>
          <h1 className="text-2xl font-bold text-white">
            {getGreeting()}, {name.toUpperCase()}! 👋
          </h1>
          {title && (
            <p className="text-white/60 mt-1">
              {title}
            </p>
          )}
          <p className="text-white/60 mt-1 text-sm">
            Here's your personalized dashboard for today.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-white">
            {getGreeting()}! 👋
          </h1>
          <p className="text-white/60 mt-1">
            Upload your resume to unlock a personalized dashboard and job matches.
          </p>
        </>
      )}
    </motion.div>
  );
}


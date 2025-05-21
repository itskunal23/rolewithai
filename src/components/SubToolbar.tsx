"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Link as LinkIcon, MessageCircle, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";

interface SubToolbarProps {
  onResumeUpload: () => void;
  onJobDescription: () => void;
  onAskAI: () => void;
  onSettings: () => void;
  notifications?: {
    ai: number;
    mentor: number;
  };
}

export function SubToolbar({
  onResumeUpload,
  onJobDescription,
  onAskAI,
  onSettings,
  notifications = { ai: 0, mentor: 0 }
}: SubToolbarProps) {
  const [isSticky, setIsSticky] = useState(false);

  // Handle scroll to make toolbar sticky
  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      const scrollPosition = window.scrollY;
      setIsSticky(scrollPosition > 100);
    });
  }

  return (
    <motion.div
      initial={false}
      animate={{
        y: isSticky ? 0 : -100,
        opacity: isSticky ? 1 : 0
      }}
      transition={{ duration: 0.2 }}
      className={`fixed top-0 left-0 right-0 z-40 bg-white/5 backdrop-blur-md border-b border-white/10 ${
        isSticky ? "shadow-lg" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <Tooltip content="Upload your resume for AI analysis">
              <Button
                onClick={onResumeUpload}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Upload size={16} /> Upload Resume
              </Button>
            </Tooltip>

            <Tooltip content="Add a job description to find matches">
              <Button
                onClick={onJobDescription}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                <LinkIcon size={16} /> Add Job Description
              </Button>
            </Tooltip>
          </div>

          {/* Center Section */}
          <div className="text-lg font-bold text-white">RoleWithAI Dashboard</div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <Tooltip content="Ask AI for personalized advice">
              <Button
                onClick={onAskAI}
                className="relative flex items-center gap-2 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600"
              >
                <MessageCircle size={16} /> Ask AI
                {notifications.ai > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                    {notifications.ai}
                  </span>
                )}
              </Button>
            </Tooltip>

            <Tooltip content="Customize your dashboard">
              <Button
                onClick={onSettings}
                variant="ghost"
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Settings size={16} />
              </Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
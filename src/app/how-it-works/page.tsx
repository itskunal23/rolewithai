"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle, Clock, Star, Target, TrendingUp } from "lucide-react";
import HowItWorks from "@/components/HowItWorks";

const roadmapItems = [
  {
    quarter: "Q1 2024",
    title: "Enhanced AI Mentorship",
    status: "In Progress",
    icon: <Star className="h-6 w-6 text-blue-500" />,
    features: [
      "Advanced AI mentor matching",
      "Real-time feedback system",
      "Personalized learning paths"
    ]
  },
  {
    quarter: "Q2 2024",
    title: "Community Features",
    status: "Planned",
    icon: <Target className="h-6 w-6 text-purple-500" />,
    features: [
      "Peer learning groups",
      "Industry expert AMAs",
      "Collaborative projects"
    ]
  },
  {
    quarter: "Q3 2024",
    title: "Career Analytics",
    status: "Planned",
    icon: <TrendingUp className="h-6 w-6 text-green-500" />,
    features: [
      "Advanced skill analytics",
      "Market trend insights",
      "Salary benchmarking"
    ]
  },
  {
    quarter: "Q4 2024",
    title: "Enterprise Solutions",
    status: "Planned",
    icon: <Calendar className="h-6 w-6 text-orange-500" />,
    features: [
      "Team learning management",
      "Custom skill tracks",
      "Enterprise reporting"
    ]
  }
];

const recentUpdates = [
  {
    date: "March 2024",
    title: "AI Mentor 2.0 Launch",
    description: "Enhanced AI mentor with improved personalization and real-time feedback",
    status: "Completed"
  },
  {
    date: "February 2024",
    title: "Mobile App Release",
    description: "Native mobile apps for iOS and Android with offline support",
    status: "Completed"
  },
  {
    date: "January 2024",
    title: "Skill Assessment Update",
    description: "New comprehensive skill assessment system with detailed analytics",
    status: "Completed"
  }
];

export default function Page() {
  return <HowItWorks />;
} 
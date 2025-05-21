"use client";

import { motion } from "framer-motion";
import { User, Briefcase, GraduationCap, Rocket, Target, Lightbulb } from "lucide-react";

const personas = [
  {
    title: "Career Switchers",
    description: "Professionals looking to transition into AI/ML roles",
    icon: <Rocket className="h-6 w-6 text-blue-500" />,
    needs: [
      "Structured learning paths",
      "Skill gap analysis",
      "Industry mentor matching"
    ],
    stats: "45% of our users"
  },
  {
    title: "Recent Graduates",
    description: "New graduates seeking their first role in tech",
    icon: <GraduationCap className="h-6 w-6 text-purple-500" />,
    needs: [
      "Resume optimization",
      "Interview preparation",
      "Entry-level job matching"
    ],
    stats: "30% of our users"
  },
  {
    title: "Career Advancers",
    description: "Professionals looking to level up in their current field",
    icon: <Target className="h-6 w-6 text-green-500" />,
    needs: [
      "Advanced skill development",
      "Leadership training",
      "Industry networking"
    ],
    stats: "25% of our users"
  }
];

const successStories = [
  {
    name: "Alex Kim",
    from: "Marketing Manager",
    to: "AI Product Manager",
    time: "6 months",
    quote: "RoleWithAI helped me make a successful transition into AI product management.",
    avatar: "👨‍💼"
  },
  {
    name: "Priya Patel",
    from: "Recent CS Graduate",
    to: "ML Engineer",
    time: "3 months",
    quote: "The platform's structured learning path was exactly what I needed to land my first role.",
    avatar: "👩‍💻"
  },
  {
    name: "David Chen",
    from: "Senior Developer",
    to: "AI Team Lead",
    time: "8 months",
    quote: "The mentorship and skill development programs were invaluable for my career advancement.",
    avatar: "👨‍💻"
  }
];

export default function PersonasPage() {
  return (
    <section className="flex flex-col items-center py-10 bg-neutral-900 min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8 w-full max-w-7xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-100 mb-2">Who Uses RoleWithAI?</h1>
        <p className="text-lg md:text-xl text-neutral-400 mb-6 max-w-2xl">Discover how different professionals are using our platform to achieve their career goals.</p>
      </div>

      {/* Chrome Tab and Dashboard */}
      <div className="w-full max-w-7xl rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden">
        {/* Chrome Tab Bar */}
        <div className="flex items-center justify-between bg-neutral-800 px-4 md:px-8 py-2 border-b border-neutral-700" style={{ minHeight: "48px" }}>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="text-sm font-semibold text-neutral-400">Personas Dashboard</div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 bg-neutral-900">
          {/* Personas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {personas.map((persona, index) => (
              <div key={index} className="rounded-xl bg-neutral-800 border border-neutral-700 shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  {persona.icon}
                  <h3 className="text-xl font-extrabold text-neutral-100">{persona.title}</h3>
                </div>
                <p className="text-neutral-400 mb-4">{persona.description}</p>
                <ul className="space-y-2 mb-4">
                  {persona.needs.map((need, i) => (
                    <li key={i} className="flex items-center gap-2 text-neutral-300">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      {need}
                    </li>
                  ))}
                </ul>
                <div className="text-sm font-semibold text-blue-500">{persona.stats}</div>
              </div>
            ))}
          </div>

          {/* Success Stories */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-neutral-100 mb-6">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {successStories.map((story, index) => (
                <div key={index} className="rounded-xl bg-neutral-800 border border-neutral-700 shadow p-6">
                  <div className="text-4xl mb-4">{story.avatar}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    <span className="text-sm text-neutral-400">{story.from} → {story.to}</span>
                  </div>
                  <p className="text-neutral-300 mb-4 italic">"{story.quote}"</p>
                  <div>
                    <div className="font-semibold text-neutral-100">{story.name}</div>
                    <div className="text-sm text-neutral-400">Transition time: {story.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-neutral-100 mb-4">Find Your Path</h2>
            <p className="text-neutral-400 mb-6">Join our community of professionals and start your journey today</p>
            <div className="flex justify-center gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Start Free Trial
              </button>
              <button className="border border-neutral-700 text-neutral-100 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition">
                View Success Stories
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
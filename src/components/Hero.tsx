"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Settings, MessageCircle, PlusCircle } from "lucide-react";

const accent = "#005fa3"; // Desaturated blue for dark mode

const kpi = {
  xp: 320,
  skills: 5,
  streak: 7,
  achievements: 12,
};
const skills = [
  { name: "Python", value: 80 },
  { name: "Machine Learning", value: 60 },
  { name: "Data Visualization", value: 90 },
];
const achievements = ["🏅 Data Wrangler", "🏅 ML Novice", "🏅 Streak Master"];
const resources = [
  "Deep Learning Specialization",
  "Kaggle Titanic Competition",
  "FastAI Course",
];
const activity = [
  "Completed: Introduction to Neural Networks",
  "Joined: AI/ML Community Discussion",
  "Chatted with Mentor: Resume Review",
  "Earned Badge: Data Wrangler",
];
const community = [
  "Top Contributor: Jane Doe",
  "Event: AI Career Fair – June 20",
  "Your Rank: #5 (1200 points)",
  "Contributed: OpenAI GPT-3 Playground",
];

const Hero = () => {
  const [showActivity, setShowActivity] = useState(false);
  const [dark, setDark] = useState(true);

  return (
    <section className="pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="inline-block h-8 w-8 rounded-full bg-zinc-800 ring-2 ring-background"
                />
              ))}
            </div>
            <div className="text-sm text-foreground/70">1k+ career professionals</div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tighter max-w-3xl">
            Navigate. Grow. <span className="gradient-text">Advance.</span>
          </h1>

          <p className="text-xl md:text-2xl text-foreground/70 max-w-2xl mt-4">
            Let AI guide your career journey with personalized skill development and growth opportunities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button size="lg" className="bg-primary">
              <Link href="#signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-zinc-700 hover:bg-zinc-800">
              <Link href="#learn-more">Learn More</Link>
            </Button>
          </div>
        </div>

        <div className="relative mt-16 rounded-xl border border-zinc-800 bg-zinc-900/80 backdrop-blur p-2 shadow-md">
          <div className="overflow-hidden rounded-lg border border-zinc-800">
            <div className="bg-zinc-900/90 px-6 py-3 flex items-center justify-between border-b border-zinc-800">
              <div className="flex items-center space-x-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
                <div className="h-2.5 w-2.5 rounded-full bg-zinc-800"></div>
              </div>
              <div className="text-xs text-foreground/50">AI Career Dashboard</div>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Toggle theme"
                  className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setDark((d) => !d)}
                >
                  {dark ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <button
                  aria-label="Customize dashboard"
                  className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Settings size={18} />
                </button>
              </div>
            </div>
            <div className="relative aspect-[16/9] bg-zinc-900">
              <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden p-4 bg-zinc-900/80">
                {/* Left: Main Panels */}
                <div className="flex flex-col gap-4">
                  {/* Performance Panel */}
                  <div className="rounded-xl bg-zinc-800/80 backdrop-blur p-4 shadow flex flex-col gap-2">
                    <div className="text-sm font-semibold text-foreground mb-2">Performance</div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* XP */}
                      <div className="flex-1 flex flex-col items-center" aria-label="Weekly XP">
                        <div className="text-xs text-foreground/60 mb-1">Weekly XP</div>
                        <motion.div
                          className="text-2xl font-bold"
                          style={{ color: accent }}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {kpi.xp}
                        </motion.div>
                        <div className="text-xs text-foreground/40">XP earned this week</div>
                        <button
                          aria-label="Log Activity"
                          className="mt-2 text-xs flex items-center gap-1 px-2 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <PlusCircle size={14} /> Log Activity
                        </button>
                      </div>
                      {/* Skills Progressed */}
                      <div className="flex-1 flex flex-col items-center" aria-label="Skills Progressed">
                        <div className="text-xs text-foreground/60 mb-1">Skills Progressed</div>
                        <div className="text-2xl font-bold" style={{ color: accent }}>{kpi.skills}</div>
                        <div className="text-xs text-foreground/40">Skills improved</div>
                      </div>
                    </div>
                  </div>
                  {/* Engagement Panel */}
                  <div className="rounded-xl bg-zinc-800/80 backdrop-blur p-4 shadow flex flex-col gap-2">
                    <div className="text-sm font-semibold text-foreground mb-2">Engagement</div>
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Streak */}
                      <div className="flex-1 flex flex-col items-center" aria-label="Streak">
                        <div className="text-xs text-foreground/60 mb-1">Streak</div>
                        <motion.div
                          className="text-2xl font-bold"
                          style={{ color: accent }}
                          initial={{ scale: 0.9 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          {kpi.streak} days
                        </motion.div>
                        <div className="text-xs text-foreground/40">Consecutive days</div>
                      </div>
                      {/* Achievements */}
                      <div className="flex-1 flex flex-col items-center" aria-label="Achievements">
                        <div className="text-xs text-foreground/60 mb-1">Achievements</div>
                        <div className="text-2xl font-bold" style={{ color: accent }}>{kpi.achievements}</div>
                        <div className="text-xs text-foreground/40">Badges unlocked</div>
                      </div>
                    </div>
                  </div>
                  {/* Career Roadmap */}
                  <div className="rounded-xl bg-zinc-800/80 backdrop-blur p-4 shadow">
                    <div className="text-sm font-semibold text-foreground mb-2">Career Roadmap</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold" style={{ color: accent }}>Data Analyst</span>
                      <span className="text-foreground/40">→</span>
                      <span className="text-sm font-bold" style={{ color: accent }}>ML Engineer</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-primary/20 text-primary text-xs font-semibold">Current</span>
                      <span className="text-foreground/40">→</span>
                      <span className="text-sm text-foreground/60">AI Researcher</span>
                    </div>
                    <div className="mt-2 w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ background: accent, width: '60%' }}
                        initial={{ width: 0 }}
                        animate={{ width: '60%' }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>
                  {/* Skill Progress (Bar Chart) */}
                  <div className="rounded-xl bg-zinc-800/80 backdrop-blur p-4 shadow">
                    <div className="text-sm font-semibold text-foreground mb-2">Skill Progress</div>
                    <div className="space-y-2">
                      {skills.map((skill) => (
                        <div key={skill.name} className="group">
                          <div className="flex justify-between text-xs mb-1">
                            <span>{skill.name}</span>
                            <span>{skill.value}%</span>
                          </div>
                          <div className="relative w-full h-2 bg-zinc-700 rounded-full">
                            <motion.div
                              className="h-2 rounded-full"
                              style={{ background: accent, width: `${skill.value}%` }}
                              initial={{ width: 0 }}
                              animate={{ width: `${skill.value}%` }}
                              transition={{ duration: 1 }}
                            />
                            <span className="absolute left-1/2 -translate-x-1/2 top-0 text-xs text-white bg-zinc-900/90 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" aria-label={`${skill.name} progress`}>{skill.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Quick Actions */}
                  <div className="flex gap-2 mt-2">
                    <button
                      aria-label="Ask AI"
                      className="flex items-center gap-1 px-3 py-2 rounded bg-primary/90 hover:bg-primary text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <MessageCircle size={16} /> Ask AI
                    </button>
                    <button
                      aria-label="Customize dashboard"
                      className="flex items-center gap-1 px-3 py-2 rounded bg-zinc-700 hover:bg-zinc-600 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <Settings size={16} /> Customize
                    </button>
                  </div>
                </div>
                {/* Right: Engagement, Achievements, Resources, Activity, Community */}
                <div className="flex flex-col gap-4">
                  {/* Recent Achievements */}
                  <div className="rounded-xl bg-zinc-800/80 backdrop-blur p-4 shadow">
                    <div className="text-sm font-semibold text-foreground mb-2">Recent Achievements</div>
                    <ul className="text-sm text-foreground/80 space-y-1">
                      {achievements.map((a) => <li key={a}>{a}</li>)}
                    </ul>
                  </div>
                  {/* Recommended Resources */}
                  <div className="rounded-xl bg-zinc-800/80 backdrop-blur p-4 shadow">
                    <div className="text-sm font-semibold text-foreground mb-2">Recommended Resources</div>
                    <ul className="text-sm text-foreground/80 space-y-1">
                      {resources.map((r) => <li key={r}>{r}</li>)}
                    </ul>
                  </div>
                  {/* Recent Activity (Expandable) */}
                  <div className="rounded-xl bg-zinc-800/80 backdrop-blur p-4 shadow">
                    <button
                      aria-expanded={showActivity}
                      aria-controls="activity-list"
                      className="w-full text-left text-sm font-semibold text-foreground flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary"
                      onClick={() => setShowActivity((v) => !v)}
                    >
                      Recent Activity
                      <span>{showActivity ? "▲" : "▼"}</span>
                    </button>
                    {showActivity && (
                      <ul id="activity-list" className="text-sm text-foreground/80 space-y-1 mt-2">
                        {activity.map((a) => <li key={a}>{a}</li>)}
                      </ul>
                    )}
                  </div>
                  {/* Community Highlights */}
                  <div className="rounded-xl bg-zinc-800/80 backdrop-blur p-4 shadow">
                    <div className="text-sm font-semibold text-foreground mb-2">Community Highlights</div>
                    <ul className="text-sm text-foreground/80 space-y-1">
                      {community.map((c) => <li key={c}>{c}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

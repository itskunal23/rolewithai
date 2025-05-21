"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, ReactNode, FC } from "react";
import { motion } from "framer-motion";
import { Sun, Moon, Settings, MessageCircle, PlusCircle, User, Briefcase, ArrowRight, CheckCircle, MessageSquare, Star, ChevronRight, X } from "lucide-react";

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
const learningPath = [
  { step: "Intro to AI", done: true },
  { step: "Python Basics", done: true },
  { step: "ML Foundations", done: false },
  { step: "Deep Learning", done: false },
];
const mentorChat = {
  name: "Jane Mentor",
  lastMessage: "Let's review your resume tomorrow!",
  avatar: <User className="h-8 w-8 text-blue-500" />,
};
const jobMatches = [
  { title: "Data Scientist", company: "TechCorp", location: "Remote" },
  { title: "ML Engineer", company: "InnovateAI", location: "NYC" },
  { title: "AI Product Manager", company: "NextGenAI", location: "SF" },
];
const tips = [
  "Set a weekly learning goal for consistent progress.",
  "Connect with mentors for personalized advice.",
  "Update your resume with new skills regularly.",
  "Participate in community events to grow your network.",
];

type ModalProps = { onClose: () => void };
type KPIBlockProps = { title: string; value: string | number; accent: string; subtext: string };
type SectionBlockProps = { title: string; children: ReactNode };

function MockAIModal({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-neutral-800 rounded-xl p-8 w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100"><X /></button>
        <h2 className="text-lg font-bold text-neutral-100 mb-2 flex items-center gap-2"><MessageCircle /> Ask AI</h2>
        <div className="text-neutral-200 mb-4">How can I help you with your career today?</div>
        <div className="bg-neutral-900 rounded p-3 text-neutral-300 text-sm mb-2">Sample: "What skills should I learn for an ML Engineer role?"</div>
        <button onClick={onClose} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Close</button>
      </div>
    </div>
  );
}
function MockCustomizeModal({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-neutral-800 rounded-xl p-8 w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100"><X /></button>
        <h2 className="text-lg font-bold text-neutral-100 mb-2 flex items-center gap-2"><Settings /> Customize Dashboard</h2>
        <div className="text-neutral-200 mb-4">Personalize your dashboard layout and theme (mock).</div>
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Dark</button>
          <button className="bg-white text-neutral-900 px-4 py-2 rounded border border-neutral-300 hover:bg-neutral-100">Light</button>
        </div>
        <button onClick={onClose} className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Close</button>
      </div>
    </div>
  );
}

const Hero = () => {
  const [showActivity, setShowActivity] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [showAskAI, setShowAskAI] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  return (
    <section className="flex flex-col items-center py-10 bg-neutral-900 min-h-screen">
      {/* Hero Intro Section ABOVE Chrome Tab */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8 w-full">
        <div className="flex items-center space-x-2 mb-4 justify-center">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="inline-block h-8 w-8 rounded-full bg-neutral-800 ring-2 ring-neutral-700"
              />
            ))}
          </div>
          <div className="text-sm text-neutral-400">1k+ career professionals</div>
        </div>
        <h1 className="text-5xl font-extrabold text-neutral-100 mb-2">Transform Your Career with AI</h1>
        <p className="text-xl text-neutral-400 mb-6">Let AI guide your journey with personalized skill development, mentorship, and job matching.</p>
        <div className="flex justify-center gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">Get Started</button>
          <button className="border border-neutral-700 text-neutral-100 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition">Learn More</button>
        </div>
      </div>
      {/* Chrome Tab and Dashboard */}
      <div className={`w-full max-w-7xl rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden transition-colors ${theme === "dark" ? "dark" : "light"}`}>
        {/* Chrome Tab Bar */}
        <div className="flex items-center justify-between bg-neutral-800 px-8 py-1 border-b border-neutral-700" style={{ minHeight: 40 }}>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-500" />
          </div>
          <div className="text-xs font-semibold text-neutral-400">AI Career Dashboard</div>
          <button
            aria-label="Toggle theme"
            className="rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-600"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
        {/* Dashboard Content */}
        <div className="p-8 bg-neutral-900">
          {/* Priority KPIs Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <KPIBlock title="Weekly XP" value={320} accent="blue" subtext="XP earned this week" />
            <KPIBlock title="Skills Progressed" value={5} accent="blue" subtext="Skills improved" />
            <KPIBlock title="Streak" value="7 days" accent="yellow" subtext="Consecutive days" />
            <KPIBlock title="Badges Unlocked" value={12} accent="green" subtext="Badges unlocked" />
          </div>
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-8">
              <SectionBlock title="Career Roadmap">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-blue-500">Data Analyst</span>
                  <ArrowRight className="text-neutral-400" />
                  <span className="font-bold text-blue-500">ML Engineer</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-blue-600/20 text-blue-600 text-xs font-semibold ml-1">Current</span>
                  <ArrowRight className="text-neutral-400" />
                  <span className="text-neutral-400">AI Researcher</span>
                </div>
                <div className="mt-2 w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: "#0077B5", width: '60%' }}
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </SectionBlock>
              <SectionBlock title="Skill Progress">
                <div className="space-y-4">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{skill.name}</span>
                        <span className="font-bold text-blue-500">{skill.value}%</span>
                      </div>
                      <div className="relative w-full h-2 bg-neutral-800 rounded-full">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ background: "#0077B5", width: `${skill.value}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionBlock>
              <SectionBlock title="Learning Path Progress">
                <div className="flex items-center gap-4">
                  {learningPath.map((step, idx) => (
                    <div key={step.step} className="flex flex-col items-center">
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${step.done ? 'bg-blue-600' : 'bg-neutral-700'} text-white font-bold mb-1`}>
                        {step.done ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                      </div>
                      <span className="text-xs text-neutral-300 w-16 text-center">{step.step}</span>
                      {idx < learningPath.length - 1 && <div className="h-4 w-1 bg-neutral-700 mx-auto" />}
                    </div>
                  ))}
                </div>
              </SectionBlock>
              <SectionBlock title="Mentor Chat Preview">
                <div className="flex items-center gap-3">
                  {mentorChat.avatar}
                  <div>
                    <div className="font-semibold text-neutral-100">{mentorChat.name}</div>
                    <div className="text-sm text-neutral-400">{mentorChat.lastMessage}</div>
                  </div>
                  <button className="ml-auto bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">Reply</button>
                </div>
              </SectionBlock>
              <SectionBlock title="Job Matches">
                <ul className="space-y-2">
                  {jobMatches.map((job, i) => (
                    <li key={i} className="flex items-center gap-2 bg-neutral-800 rounded p-2">
                      <Briefcase className="text-blue-500" />
                      <div className="flex-1">
                        <div className="font-semibold text-neutral-100">{job.title}</div>
                        <div className="text-xs text-neutral-400">{job.company} • {job.location}</div>
                      </div>
                      <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-xs">Apply</button>
                    </li>
                  ))}
                </ul>
              </SectionBlock>
              <SectionBlock title="Personalized Tips">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" />
                  <span className="text-neutral-200">{tips[tipIdx]}</span>
                  <button onClick={() => setTipIdx((tipIdx + 1) % tips.length)} className="ml-2 text-blue-500 hover:underline text-xs">Next</button>
                </div>
              </SectionBlock>
              <div className="flex gap-2">
                <button onClick={() => setShowAskAI(true)} className="flex items-center gap-1 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                  <MessageCircle size={16} /> Ask AI
                </button>
                <button onClick={() => setShowCustomize(true)} className="flex items-center gap-1 px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-800 text-neutral-100 font-semibold">
                  <Settings size={16} /> Customize
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <SectionBlock title="Recent Achievements">
                <ul className="text-lg flex flex-wrap gap-3">
                  {achievements.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </SectionBlock>
              <SectionBlock title="Recommended Resources">
                <ul className="space-y-1">
                  {resources.map((r) => <li key={r} className="flex items-center gap-2"><ChevronRight className="h-4 w-4 text-blue-500" />{r}</li>)}
                </ul>
              </SectionBlock>
              <SectionBlock title="Recent Activity">
                <button
                  aria-expanded={showActivity}
                  aria-controls="activity-list"
                  className="w-full text-left text-sm font-semibold text-neutral-100 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-600"
                  onClick={() => setShowActivity((v) => !v)}
                >
                  Show Activity
                  <span className={`transition-transform ml-2 ${showActivity ? "rotate-180" : ""}`}>▼</span>
                </button>
                {showActivity && (
                  <ul id="activity-list" className="text-sm text-neutral-300 space-y-1 mt-2">
                    {activity.map((a) => <li key={a} className="flex items-center gap-2"><MessageSquare className="h-4 w-4 text-blue-500" />{a}</li>)}
                  </ul>
                )}
              </SectionBlock>
              <SectionBlock title="Community Highlights">
                <ul className="space-y-1">
                  {community.map((c) => <li key={c} className="flex items-center gap-2"><User className="h-4 w-4 text-green-500" />{c}</li>)}
                </ul>
              </SectionBlock>
              <SectionBlock title="Platform Features">
                <ul className="space-y-1">
                  <li>🤖 <span className="font-semibold">AI Mentor</span> — Personalized guidance</li>
                  <li>📈 <span className="font-semibold">Skill Tracking</span> — Visualize growth</li>
                  <li>🛣️ <span className="font-semibold">Learning Paths</span> — Curated journeys</li>
                  <li>🗺️ <span className="font-semibold">Career Roadmap</span> — Plan your future</li>
                  <li>🤝 <span className="font-semibold">Human Mentorship</span> — Real connections</li>
                  <li>💼 <span className="font-semibold">Job Matching</span> — Find your fit</li>
                </ul>
                <a href="#features" className="mt-2 inline-block text-blue-500 text-xs hover:underline">See all features</a>
              </SectionBlock>
            </div>
          </div>
        </div>
      </div>
      {/* Mock Modals */}
      {showAskAI && <MockAIModal onClose={() => setShowAskAI(false)} />}
      {showCustomize && <MockCustomizeModal onClose={() => setShowCustomize(false)} />}
    </section>
  );
};

const KPIBlock: FC<KPIBlockProps> = ({ title, value, accent, subtext }) => {
  const color = accent === "blue" ? "text-blue-500" : accent === "green" ? "text-green-500" : accent === "yellow" ? "text-yellow-400" : "text-neutral-100";
  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700 shadow p-4 flex flex-col items-center">
      <div className={`text-lg font-bold mb-1 ${color}`}>{title}</div>
      <div className={`text-3xl font-extrabold ${color}`}>{value}</div>
      <div className="text-xs text-neutral-400 mt-1">{subtext}</div>
    </div>
  );
};
const SectionBlock: FC<SectionBlockProps> = ({ title, children }) => {
  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700 shadow p-4">
      <div className="text-lg font-bold text-neutral-100 mb-2">{title}</div>
      {children}
    </div>
  );
};

export default Hero;

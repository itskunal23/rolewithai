"use client";

import { useState, useCallback, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Settings, MessageCircle, User, Briefcase, ArrowRight, CheckCircle, X, Upload, Link as LinkIcon, BookOpen, Award, Target, Share2, Sparkles, Trophy, Zap, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { ResumeUploader } from "@/components/ResumeUploader";
import { Tooltip } from "@/components/ui/tooltip";
import { SubToolbar } from "@/components/SubToolbar";

// Enhanced data structures with more engaging metrics
const kpi = {
  xp: 320,
  skills: 5,
  streak: 7,
  achievements: 12,
  mentorSessions: 3,
  jobViews: 28,
  level: 3,
  nextLevelXp: 500
};

const skills = [
  { name: "Python", value: 80, lessons: "3/5", trend: "up", xp: 150 },
  { name: "Machine Learning", value: 60, lessons: "4/5", trend: "up", xp: 120 },
  { name: "Data Visualization", value: 90, lessons: "2/5", trend: "up", xp: 180 },
];

const achievements = [
  { name: "🏅 Data Wrangler", description: "Processed 100+ datasets", xp: 50 },
  { name: "🏅 ML Novice", description: "Completed 5 ML projects", xp: 75 },
  { name: "🏅 Streak Master", description: "7-day learning streak", xp: 100 },
];

const learningPath = [
  { step: "Intro to AI", done: true, lessons: "3/5", xp: 120 },
  { step: "Python Basics", done: true, lessons: "4/5", xp: 150 },
  { step: "ML Foundations", done: false, lessons: "0/5", xp: 200 },
  { step: "Deep Learning", done: false, lessons: "0/5", xp: 250 },
];

const mentorChat = {
  name: "Jane Mentor",
  lastMessage: "Let's review your resume tomorrow!",
  avatar: <User className="h-8 w-8 text-purple-500" />,
  status: "online",
  nextSession: "Tomorrow, 2 PM"
};

const jobMatches = [
  { title: "Data Scientist", company: "TechCorp", location: "Remote", match: 85, salary: "$120k-150k", skills: ["Python", "ML", "Data Analysis"] },
  { title: "ML Engineer", company: "InnovateAI", location: "NYC", match: 78, salary: "$130k-160k", skills: ["Python", "TensorFlow", "AWS"] },
  { title: "AI Product Manager", company: "NextGenAI", location: "SF", match: 65, salary: "$140k-180k", skills: ["Product Strategy", "AI/ML", "Agile"] },
];

const recommendations = [
  { type: "Course", title: "Deep Learning Specialization", platform: "Coursera", match: 95, xp: 200, duration: "12 weeks" },
  { type: "Certification", title: "AWS Machine Learning", platform: "AWS", match: 88, xp: 150, duration: "8 weeks" },
  { type: "Project", title: "Build an ML Pipeline", platform: "Kaggle", match: 92, xp: 180, duration: "4 weeks" },
];

type ModalProps = { onClose: () => void };
type KPIBlockProps = { title: string; value: string | number; accent: string; subtext: string };
type SectionBlockProps = { 
  title: string; 
  children: React.ReactNode; 
  icon?: React.ReactElement;
};

// Add new types for AI-driven personalization
interface AIPrediction {
  nextSkill: string;
  confidence: number;
  reason: string;
}

interface UserMood {
  energy: number;
  focus: number;
  motivation: number;
}

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

function ResumeUploadModal({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-neutral-800 rounded-xl p-8 w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100"><X /></button>
        <h2 className="text-lg font-bold text-neutral-100 mb-2 flex items-center gap-2"><Upload /> Upload Resume</h2>
        <div className="text-neutral-200 mb-4">Upload your resume or paste its contents below</div>
        <div className="space-y-4">
          <div className="border-2 border-dashed border-neutral-600 rounded-lg p-8 text-center">
            <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-2" />
            <p className="text-sm text-neutral-400">Drag and drop your resume here, or click to browse</p>
          </div>
          <textarea 
            className="w-full h-32 bg-neutral-900 rounded p-3 text-neutral-200 text-sm"
            placeholder="Or paste your resume content here..."
          />
          <Button className="w-full">Analyze Resume</Button>
        </div>
      </div>
    </div>
  );
}

function JobDescriptionModal({ onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-neutral-800 rounded-xl p-8 w-full max-w-md shadow-xl relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-100"><X /></button>
        <h2 className="text-lg font-bold text-neutral-100 mb-2 flex items-center gap-2"><LinkIcon /> Job Description</h2>
        <div className="text-neutral-200 mb-4">Enter a job description URL or paste its contents</div>
        <div className="space-y-4">
          <input 
            type="url"
            className="w-full bg-neutral-900 rounded p-3 text-neutral-200 text-sm"
            placeholder="https://..."
          />
          <textarea 
            className="w-full h-32 bg-neutral-900 rounded p-3 text-neutral-200 text-sm"
            placeholder="Or paste the job description here..."
          />
          <Button className="w-full">Analyze Job Description</Button>
        </div>
      </div>
    </div>
  );
}

// Add confetti effect
const triggerConfetti = () => {
  if (typeof window !== 'undefined') {
    const confetti = require('canvas-confetti');
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
};

// Update color constants
const colors = {
  // Apple HIG colors
  red: "from-[#FF3B30] to-[#FF453A]",
  orange: "from-[#FF9500] to-[#FF9F0A]",
  yellow: "from-[#FFCC00] to-[#FFD60A]",
  green: "from-[#34C759] to-[#30D158]",
  teal: "from-[#5AC8FA] to-[#64D2FF]",
  blue: "from-[#007AFF] to-[#0A84FF]",
  indigo: "from-[#5856D6] to-[#5E5CE6]",
  purple: "from-[#AF52DE] to-[#BF5AF2]",
  pink: "from-[#FF2D55] to-[#FF375F]",
  gray: "from-[#8E8E93] to-[#98989D]"
};

const KPIBlock: FC<KPIBlockProps> = ({ title, value, accent, subtext }) => {
  return (
    <Tooltip
      content={
        <div className="space-y-1">
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-white/60">{subtext}</div>
          <div className="text-xs text-white/60">Click to view details</div>
        </div>
      }
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="rounded-xl bg-gradient-to-br p-4 flex flex-col items-center shadow-lg cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${colors[accent as keyof typeof colors]})` }}
      >
        <div className="text-lg font-extrabold text-white mb-1">{title}</div>
        <div className="text-3xl font-black text-white">{value}</div>
        <div className="text-xs text-white/80 mt-1">{subtext}</div>
      </motion.div>
    </Tooltip>
  );
};

const SectionBlock: FC<SectionBlockProps> = ({ title, children, icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 shadow-xl p-4"
    >
      <div className="text-xl font-extrabold text-white mb-3 tracking-tight flex items-center gap-2">
        {icon}
        {title}
      </div>
      {children}
    </motion.div>
  );
};

export default function DashboardPage() {
  const [theme, setTheme] = useState("dark");
  const [showAskAI, setShowAskAI] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [showJobDescription, setShowJobDescription] = useState(false);
  const [resumeAnalysis, setResumeAnalysis] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [notifications, setNotifications] = useState({
    ai: 2,
    mentor: 1
  });

  // Move AI prediction state inside component
  const [aiPrediction, setAIPrediction] = useState<AIPrediction>({
    nextSkill: "Deep Learning",
    confidence: 0.85,
    reason: "Based on your Python and ML progress"
  });

  // Move user mood state inside component
  const [userMood, setUserMood] = useState<UserMood>({
    energy: 0.8,
    focus: 0.7,
    motivation: 0.9
  });

  const handleResumeAnalysis = useCallback((data: any) => {
    setResumeAnalysis(data);
    triggerConfetti();
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
    
    if (data.skills) {
      const updatedSkills = data.skills.map((skill: any) => ({
        name: skill.name,
        value: Math.min(100, skill.years * 25),
        lessons: "0/5",
        trend: "up",
        xp: skill.years * 50
      }));
      const existingSkillNames = new Set(skills.map(s => s.name));
      const newSkills = updatedSkills.filter((s: any) => !existingSkillNames.has(s.name));
      if (newSkills.length > 0) {
        skills.push(...newSkills);
        triggerConfetti();
      }
    }
  }, []);

  return (
    <>
      <Header />
      <SubToolbar
        onResumeUpload={() => setShowResumeUpload(true)}
        onJobDescription={() => setShowJobDescription(true)}
        onAskAI={() => setShowAskAI(true)}
        onSettings={() => setShowCustomize(true)}
        notifications={notifications}
      />
      <main className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black pt-32">
        <div className="container mx-auto px-4">
          {/* AI Prediction Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-[#5856D6]/20 to-[#BF5AF2]/20 rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-bold text-white">Next Skill to Master</div>
                <div className="text-2xl font-black text-[#5E5CE6]">{aiPrediction.nextSkill}</div>
                <div className="text-sm text-white/60">{aiPrediction.reason}</div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-[#5E5CE6]">{aiPrediction.confidence * 100}%</div>
                <div className="text-sm text-white/60">Confidence Score</div>
              </div>
            </div>
          </motion.div>

          {/* Level Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="h-6 w-6 text-[#FFD60A]" />
                <span className="text-lg font-bold text-white">Level {kpi.level}</span>
              </div>
              <span className="text-sm text-white/60">{kpi.xp} / {kpi.nextLevelXp} XP</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-[#FFD60A] to-[#FFCC00]"
                initial={{ width: 0 }}
                animate={{ width: `${(kpi.xp / kpi.nextLevelXp) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </motion.div>

          {/* Priority KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <KPIBlock title="Weekly XP" value={kpi.xp} accent="blue" subtext="XP earned this week" />
            <KPIBlock title="Skills Progressed" value={kpi.skills} accent="green" subtext="Skills improved" />
            <KPIBlock title="Streak" value={`${kpi.streak} days`} accent="yellow" subtext="Consecutive days" />
            <KPIBlock title="Badges Unlocked" value={kpi.achievements} accent="purple" subtext="Badges unlocked" />
            <KPIBlock title="Mentor Sessions" value={kpi.mentorSessions} accent="pink" subtext="This month" />
            <KPIBlock title="Job Views" value={kpi.jobViews} accent="teal" subtext="Profile views" />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <SectionBlock title="Career Roadmap" icon={<Target className="h-5 w-5 text-[#5E5CE6]" />}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-[#5E5CE6]">Data Analyst</span>
                  <ArrowRight className="text-white/40" />
                  <span className="font-bold text-[#5E5CE6]">ML Engineer</span>
                  <span className="inline-block px-2 py-0.5 rounded bg-[#5856D6]/20 text-[#5E5CE6] text-xs font-semibold ml-1">Current</span>
                  <ArrowRight className="text-white/40" />
                  <span className="text-white/60">AI Researcher</span>
                </div>
                <div className="mt-2 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-gradient-to-r from-[#5856D6] to-[#BF5AF2]"
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </SectionBlock>

              <SectionBlock title="Skill Progress" icon={<Zap className="h-5 w-5 text-[#0A84FF]" />}>
                <div className="space-y-3">
                  {skills.map((skill) => (
                    <div key={skill.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white">{skill.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-white/60">{skill.lessons}</span>
                          <span className="font-bold text-[#0A84FF]">{skill.value}%</span>
                          <span className="text-xs text-white/60">+{skill.xp} XP</span>
                        </div>
                      </div>
                      <div className="relative w-full h-2 bg-white/10 rounded-full">
                        <motion.div
                          className="h-2 rounded-full bg-gradient-to-r from-[#007AFF] to-[#0A84FF]"
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionBlock>
            </div>

            {/* Middle Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <SectionBlock title="Learning Path Progress" icon={<BookOpen className="h-5 w-5 text-[#30D158]" />}>
                <div className="flex items-center gap-4">
                  {learningPath.map((step, idx) => (
                    <div key={step.step} className="flex flex-col items-center">
                      <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                        step.done ? 'bg-gradient-to-br from-[#34C759] to-[#30D158]' : 'bg-white/10'
                      } text-white font-bold mb-1`}>
                        {step.done ? <CheckCircle className="h-5 w-5" /> : idx + 1}
                      </div>
                      <span className="text-xs text-white w-16 text-center">{step.step}</span>
                      <span className="text-xs text-white/60">+{step.xp} XP</span>
                      {idx < learningPath.length - 1 && <div className="h-4 w-1 bg-white/10 mx-auto" />}
                    </div>
                  ))}
                </div>
              </SectionBlock>

              <SectionBlock title="AI Recommendations" icon={<Sparkles className="h-5 w-5 text-[#FF375F]" />}>
                <div className="space-y-3">
                  {recommendations.map((rec, i) => (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      key={i}
                      className="flex items-center gap-3 bg-white/5 rounded p-3"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-white">{rec.title}</div>
                        <div className="text-xs text-white/60">{rec.platform} • {rec.type} • {rec.duration}</div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-[#FF375F]">{rec.match}% match</span>
                        <span className="text-xs text-white/60">+{rec.xp} XP</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </SectionBlock>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <SectionBlock title="Job Matches" icon={<Briefcase className="h-5 w-5 text-[#FF9F0A]" />}>
                <ul className="space-y-3">
                  {jobMatches.map((job, i) => (
                    <motion.li
                      whileHover={{ scale: 1.02 }}
                      key={i}
                      className="flex items-center gap-3 bg-white/5 rounded p-3"
                    >
                      <Briefcase className="text-[#FF9F0A]" />
                      <div className="flex-1">
                        <div className="font-semibold text-white">{job.title}</div>
                        <div className="text-xs text-white/60">{job.company} • {job.location}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.skills.map((skill, idx) => (
                            <span key={idx} className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/80">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-bold text-[#FF9F0A]">{job.match}% match</span>
                        <span className="text-xs text-white/60">{job.salary}</span>
                        <button className="bg-gradient-to-r from-[#FF9500] to-[#FF9F0A] text-white px-3 py-1 rounded hover:from-[#FF9F0A] hover:to-[#FF9500] text-xs">
                          Apply
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </SectionBlock>

              <SectionBlock title="Mentor Chat Preview" icon={<MessageCircle className="h-5 w-5 text-[#5E5CE6]" />}>
                <div className="flex items-center gap-3">
                  {mentorChat.avatar}
                  <div>
                    <div className="font-semibold text-white flex items-center gap-2">
                      {mentorChat.name}
                      <span className="text-xs px-2 py-0.5 rounded bg-[#30D158]/20 text-[#30D158]">
                        {mentorChat.status}
                      </span>
                    </div>
                    <div className="text-sm text-white/60">{mentorChat.lastMessage}</div>
                    <div className="text-xs text-white/40 mt-1">Next session: {mentorChat.nextSession}</div>
                  </div>
                  <button className="ml-auto bg-gradient-to-r from-[#5856D6] to-[#5E5CE6] text-white px-3 py-1 rounded hover:from-[#5E5CE6] hover:to-[#5856D6] text-xs">
                    Reply
                  </button>
                </div>
              </SectionBlock>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/60">
            <Lock className="h-4 w-4" />
            <span>Your data is encrypted and secure. Read our</span>
            <a href="#" className="text-[#5E5CE6] hover:text-[#5856D6]">Privacy Policy</a>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {showAskAI && <MockAIModal onClose={() => setShowAskAI(false)} />}
        {showCustomize && <MockCustomizeModal onClose={() => setShowCustomize(false)} />}
        {showResumeUpload && (
          <ResumeUploader
            onClose={() => setShowResumeUpload(false)}
            onAnalysisComplete={handleResumeAnalysis}
          />
        )}
        {showJobDescription && <JobDescriptionModal onClose={() => setShowJobDescription(false)} />}
      </AnimatePresence>

      {/* Confetti Effect */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {/* Confetti animation is handled by canvas-confetti */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
} 
"use client";

import { useState, useCallback, FC, useEffect } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { 
  Sun, Moon, Settings, MessageCircle, User, Briefcase, ArrowRight, CheckCircle, 
  X, Upload, Link as LinkIcon, BookOpen, Award, Target, Share2, Sparkles, Trophy, 
  Zap, Star, Lock, ChevronRight, TrendingUp, Bell, Home as HomeIcon, Search, Plus, Filter,
  Calendar, FileText, GraduationCap, Medal, BriefcaseIcon, Building2, School,
  Heart, Users, Share, Leaf, Brain, Coffee, Timer, BarChart, PieChart, LineChart,
  Globe, Languages, Star as StarIcon, Bookmark, ThumbsUp, MessageSquare, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import { ResumeUploader } from "@/components/ResumeUploader";
import { Tooltip } from "@/components/ui/tooltip";
import { SubToolbar } from "@/components/SubToolbar";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

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

// Add new types for enhanced features
interface OnboardingStep {
  target: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface SparklineData {
  values: number[];
  trend: 'up' | 'down' | 'stable';
}

interface DrillDownData {
  title: string;
  sparkline: SparklineData;
  details: {
    label: string;
    value: string | number;
  }[];
}

// Add onboarding steps
const onboardingSteps: OnboardingStep[] = [
  {
    target: '.kpi-row',
    content: 'Track your progress with key metrics and achievements',
    placement: 'bottom'
  },
  {
    target: '.ai-banner',
    content: 'Get AI-powered recommendations for your next skill to master',
    placement: 'bottom'
  },
  {
    target: '.resume-upload',
    content: 'Upload your resume to get personalized job matches',
    placement: 'right'
  }
];

// Add drill-down data
const drillDownData: Record<string, DrillDownData> = {
  xp: {
    title: 'Weekly XP Progress',
    sparkline: {
      values: [120, 180, 220, 280, 320],
      trend: 'up'
    },
    details: [
      { label: 'Daily Average', value: '64 XP' },
      { label: 'Best Day', value: '85 XP' },
      { label: 'Next Level', value: '180 XP to go' }
    ]
  },
  skills: {
    title: 'Skills Progress',
    sparkline: {
      values: [2, 3, 3, 4, 5],
      trend: 'up'
    },
    details: [
      { label: 'Most Improved', value: 'Python' },
      { label: 'Next Target', value: 'Deep Learning' },
      { label: 'Completion Rate', value: '75%' }
    ]
  }
};

// Add new types for enhanced features
interface UserProfile {
  name: string;
  avatar: string;
  location: string;
  level: 'intern' | 'entry' | 'mid' | 'senior';
  title: string;
  experience: {
    role: string;
    company: string;
    duration: string;
    description: string;
    achievements: string[];
  }[];
  leadership: {
    role: string;
    organization: string;
    duration: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    gpa?: string;
    relevantCourses?: string[];
  }[];
  certifications: {
    name: string;
    issuer: string;
    year: string;
    credentialId?: string;
    expiryDate?: string;
  }[];
  skills: {
    category: string;
    items: string[];
    proficiency: number;
  }[];
}

interface Application {
  id: string;
  company: string;
  role: string;
  status: 'Applied' | 'Interviewing' | 'Offered' | 'Rejected';
  date: string;
  match: number;
}

// Update user profile data
const userProfile: UserProfile = {
  name: "Alex Chen",
  avatar: "👨‍💻",
  location: "San Francisco, CA",
  level: "mid",
  title: "Data Scientist",
  experience: [
    {
      role: "Data Scientist",
      company: "TechCorp",
      duration: "2022-Present",
      description: "Leading data science initiatives for enterprise clients",
      achievements: [
        "Reduced model training time by 40% through optimization",
        "Implemented ML pipeline serving 1M+ daily predictions",
        "Mentored 3 junior data scientists"
      ]
    },
    {
      role: "ML Engineer",
      company: "AI Solutions",
      duration: "2020-2022",
      description: "Developed and deployed machine learning models",
      achievements: [
        "Built real-time recommendation engine",
        "Improved model accuracy by 25%",
        "Automated data processing pipeline"
      ]
    }
  ],
  leadership: [
    {
      role: "Tech Lead",
      organization: "AI Research Group",
      duration: "2021-Present",
      description: "Leading a team of 5 engineers in AI research projects"
    }
  ],
  education: [
    {
      degree: "MS in Computer Science",
      institution: "Stanford University",
      year: "2020",
      gpa: "3.9/4.0",
      relevantCourses: ["Machine Learning", "Deep Learning", "Data Mining"]
    },
    {
      degree: "BS in Computer Science",
      institution: "MIT",
      year: "2018",
      gpa: "3.8/4.0",
      relevantCourses: ["Data Structures", "Algorithms", "Statistics"]
    }
  ],
  certifications: [
    {
      name: "AWS Machine Learning",
      issuer: "Amazon",
      year: "2022",
      credentialId: "AWS-123456",
      expiryDate: "2025-12-31"
    },
    {
      name: "TensorFlow Developer",
      issuer: "Google",
      year: "2021",
      credentialId: "TF-789012",
      expiryDate: "2024-12-31"
    }
  ],
  skills: [
    {
      category: "Programming",
      items: ["Python", "R", "SQL", "JavaScript"],
      proficiency: 90
    },
    {
      category: "Machine Learning",
      items: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras"],
      proficiency: 85
    },
    {
      category: "Data Engineering",
      items: ["Apache Spark", "Hadoop", "Airflow", "Docker"],
      proficiency: 80
    },
    {
      category: "Soft Skills",
      items: ["Leadership", "Communication", "Problem Solving", "Team Collaboration"],
      proficiency: 95
    }
  ]
};

// Add applications data
const applications: Application[] = [
  { id: "1", company: "Google", role: "Senior ML Engineer", status: "Interviewing", date: "2024-03-15", match: 92 },
  { id: "2", company: "Microsoft", role: "AI Research Scientist", status: "Applied", date: "2024-03-10", match: 88 },
  { id: "3", company: "OpenAI", role: "ML Engineer", status: "Rejected", date: "2024-03-05", match: 85 }
];

// Add new types for enhanced features
interface WellnessCheck {
  mood: number;
  energy: number;
  timestamp: string;
}

interface CommunityPost {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  content: string;
  type: 'achievement' | 'question' | 'tip';
  likes: number;
  comments: number;
  timestamp: string;
}

interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  deadline: string;
  completed: boolean;
}

// Add wellness check data
const wellnessChecks: WellnessCheck[] = [
  { mood: 0.8, energy: 0.7, timestamp: "2024-03-15T09:00:00" },
  { mood: 0.9, energy: 0.8, timestamp: "2024-03-14T09:00:00" }
];

// Add community posts
const communityPosts: CommunityPost[] = [
  {
    id: "1",
    user: {
      name: "Sarah Chen",
      avatar: "👩‍💻"
    },
    content: "Just completed the Deep Learning specialization! 🎉",
    type: "achievement",
    likes: 24,
    comments: 5,
    timestamp: "2h ago"
  },
  {
    id: "2",
    user: {
      name: "Mike Johnson",
      avatar: "👨‍💻"
    },
    content: "Any tips for preparing for ML Engineer interviews?",
    type: "question",
    likes: 12,
    comments: 8,
    timestamp: "4h ago"
  }
];

// Add daily challenges
const dailyChallenges: DailyChallenge[] = [
  {
    id: "1",
    title: "Complete 2 Python Lessons",
    description: "Master the basics of Python programming",
    xpReward: 50,
    deadline: "2024-03-16T23:59:59",
    completed: false
  },
  {
    id: "2",
    title: "Update Your Resume",
    description: "Add your latest achievements and skills",
    xpReward: 30,
    deadline: "2024-03-16T23:59:59",
    completed: true
  }
];

// Add new types for enhanced features
interface ProfileAnalytics {
  profileViews: {
    total: number;
    trend: number;
    history: { date: string; views: number }[];
  };
  postImpressions: {
    total: number;
    trend: number;
    history: { date: string; impressions: number }[];
  };
  searchAppearances: {
    total: number;
    trend: number;
    history: { date: string; appearances: number }[];
  };
}

interface RecentActivity {
  id: string;
  type: 'post' | 'comment' | 'like' | 'share';
  content: string;
  timestamp: string;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
}

// Add analytics data
const profileAnalytics: ProfileAnalytics = {
  profileViews: {
    total: 245,
    trend: 12.5,
    history: [
      { date: "2024-03-10", views: 15 },
      { date: "2024-03-11", views: 22 },
      { date: "2024-03-12", views: 18 },
      { date: "2024-03-13", views: 25 },
      { date: "2024-03-14", views: 30 },
      { date: "2024-03-15", views: 35 }
    ]
  },
  postImpressions: {
    total: 1234,
    trend: 8.3,
    history: [
      { date: "2024-03-10", impressions: 180 },
      { date: "2024-03-11", impressions: 220 },
      { date: "2024-03-12", impressions: 190 },
      { date: "2024-03-13", impressions: 250 },
      { date: "2024-03-14", impressions: 280 },
      { date: "2024-03-15", impressions: 314 }
    ]
  },
  searchAppearances: {
    total: 89,
    trend: 15.2,
    history: [
      { date: "2024-03-10", appearances: 12 },
      { date: "2024-03-11", appearances: 15 },
      { date: "2024-03-12", appearances: 13 },
      { date: "2024-03-13", appearances: 18 },
      { date: "2024-03-14", appearances: 20 },
      { date: "2024-03-15", appearances: 23 }
    ]
  }
};

// Add recent activity data
const recentActivity: RecentActivity[] = [
  {
    id: "1",
    type: "post",
    content: "Just completed the Deep Learning specialization! 🎉",
    timestamp: "2h ago",
    engagement: {
      likes: 24,
      comments: 5,
      shares: 2
    }
  },
  {
    id: "2",
    type: "comment",
    content: "Great insights on ML model optimization!",
    timestamp: "4h ago",
    engagement: {
      likes: 8,
      comments: 2,
      shares: 0
    }
  }
];

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

// Update color constants with semantic system colors and proper dark mode values
const colors = {
  // System Background Colors
  systemBackground: "from-[#121212] to-[#1C1C1E]",
  secondarySystemBackground: "from-[#1C1C1E] to-[#2C2C2E]",
  tertiarySystemBackground: "from-[#2C2C2E] to-[#3A3A3C]",
  
  // Semantic Colors (slightly desaturated for dark mode)
  primary: "from-[#007AFF] to-[#0A84FF]",
  success: "from-[#32D74B] to-[#30D158]",
  warning: "from-[#FF9F0A] to-[#FFB340]",
  error: "from-[#FF453A] to-[#FF6961]",
  info: "from-[#64D2FF] to-[#5AC8FA]",
  
  // Text Colors (using opacity for hierarchy)
  textPrimary: "text-white",
  textSecondary: "text-white/80",
  textTertiary: "text-white/60",
  
  // Accent Colors (desaturated for dark mode)
  accentBlue: "from-[#007AFF] to-[#0A84FF]",
  accentGreen: "from-[#32D74B] to-[#30D158]",
  accentPurple: "from-[#5856D6] to-[#5E5CE6]",
  accentPink: "from-[#FF2D55] to-[#FF375F]",
  accentOrange: "from-[#FF9F0A] to-[#FFB340]"
};

// Enhanced KPIBlock with emojis and deeper insights
const KPIBlock: FC<KPIBlockProps & { drillDown?: DrillDownData; emoji: string }> = ({ 
  title, value, accent, subtext, drillDown, emoji 
}) => {
  const [showDrillDown, setShowDrillDown] = useState(false);
  const controls = useAnimation();

  const handleClick = async () => {
    if (drillDown) {
      setShowDrillDown(true);
      await controls.start({ opacity: 1, y: 0 });
    }
  };

  return (
    <>
      <Tooltip
        content={
          <div className="space-y-1">
            <div className="font-semibold flex items-center gap-2">
              {emoji} {title}
            </div>
            <div className="text-xs text-white/60">{subtext}</div>
            {drillDown && (
              <div className="text-xs text-white/60 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                Click to view details
              </div>
            )}
          </div>
        }
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleClick}
          className="rounded-xl bg-gradient-to-br p-4 flex flex-col items-center shadow-lg cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${colors[accent as keyof typeof colors]})` }}
        >
          <div className="text-lg font-extrabold text-white mb-1 flex items-center gap-2">
            {emoji} {title}
          </div>
          <div className="text-3xl font-black text-white">{value}</div>
          <div className="text-xs text-white/80 mt-1">{subtext}</div>
        </motion.div>
      </Tooltip>

      <AnimatePresence>
        {showDrillDown && drillDown && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <div className="bg-[#1C1C1E] rounded-xl p-6 w-full max-w-md shadow-xl relative">
              <button 
                onClick={() => setShowDrillDown(false)}
                className="absolute top-3 right-3 text-white/60 hover:text-white"
              >
                <X />
              </button>
              <h2 className="text-xl font-bold text-white mb-4">{drillDown.title}</h2>
              
              {/* Sparkline */}
              <div className="h-20 mb-4 flex items-end gap-1">
                {drillDown.sparkline.values.map((value, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${(value / Math.max(...drillDown.sparkline.values)) * 100}%` }}
                    className="w-8 bg-gradient-to-t from-[#007AFF] to-[#0A84FF] rounded-t"
                  />
                ))}
              </div>

              {/* Details */}
              <div className="space-y-3">
                {drillDown.details.map((detail, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-white/60">{detail.label}</span>
                    <span className="text-white font-semibold">{detail.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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

// Add Career Roadmap component
const CareerRoadmap = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? "auto" : "200px" }}
      className="overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Target className="h-5 w-5 text-[#5E5CE6]" />
          Career Roadmap
        </h2>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white/60 hover:text-white"
        >
          {isExpanded ? "Collapse" : "Expand"}
        </Button>
      </div>
      {/* ... existing roadmap content ... */}
    </motion.div>
  );
};

// Replace VirtualResume with Professional Profile component
const ProfessionalProfile = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getLevelBadge = (level: string) => {
    const badges = {
      intern: { color: "bg-blue-500/20 text-blue-400", text: "Intern" },
      entry: { color: "bg-green-500/20 text-green-400", text: "Entry Level" },
      mid: { color: "bg-purple-500/20 text-purple-400", text: "Mid Level" },
      senior: { color: "bg-orange-500/20 text-orange-400", text: "Senior Level" }
    };
    const badge = badges[level as keyof typeof badges];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    );
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10">
      {/* Header */}
      <div className="flex items-start gap-4 mb-6">
        <div className="text-4xl">{userProfile.avatar}</div>
        <div>
          <h2 className="text-2xl font-bold text-white">{userProfile.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-white/60">{userProfile.title}</span>
            <span className="text-white/40">•</span>
            <span className="text-white/60">{userProfile.location}</span>
          </div>
          <div className="mt-2">
            {getLevelBadge(userProfile.level)}
          </div>
        </div>
      </div>

      {/* Experience */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('experience')}
          className="w-full flex items-center justify-between text-lg font-semibold text-white mb-2"
        >
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5 text-[#0A84FF]" />
            Professional Experience
          </div>
          <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'experience' ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSection === 'experience' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-2">
                {userProfile.experience.map((exp, i) => (
                  <div key={i} className="bg-[#2C2C2E] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{exp.role}</h3>
                        <p className="text-white/60">{exp.company}</p>
                      </div>
                      <span className="text-sm text-white/40">{exp.duration}</span>
                    </div>
                    <p className="text-white/80 mt-2">{exp.description}</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {exp.achievements.map((achievement, j) => (
                        <li key={j} className="text-white/60 text-sm">{achievement}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Leadership */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('leadership')}
          className="w-full flex items-center justify-between text-lg font-semibold text-white mb-2"
        >
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#FF9F0A]" />
            Leadership Experience
          </div>
          <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'leadership' ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSection === 'leadership' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-2">
                {userProfile.leadership.map((lead, i) => (
                  <div key={i} className="bg-[#2C2C2E] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{lead.role}</h3>
                        <p className="text-white/60">{lead.organization}</p>
                      </div>
                      <span className="text-sm text-white/40">{lead.duration}</span>
                    </div>
                    <p className="text-white/80 mt-2">{lead.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Education */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('education')}
          className="w-full flex items-center justify-between text-lg font-semibold text-white mb-2"
        >
          <div className="flex items-center gap-2">
            <School className="h-5 w-5 text-[#32D74B]" />
            Education
          </div>
          <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'education' ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSection === 'education' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-2">
                {userProfile.education.map((edu, i) => (
                  <div key={i} className="bg-[#2C2C2E] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{edu.degree}</h3>
                        <p className="text-white/60">{edu.institution}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-white/40">{edu.year}</span>
                        {edu.gpa && (
                          <p className="text-sm text-white/60">GPA: {edu.gpa}</p>
                        )}
                      </div>
                    </div>
                    {edu.relevantCourses && (
                      <div className="mt-2">
                        <p className="text-sm text-white/60">Relevant Courses:</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {edu.relevantCourses.map((course, j) => (
                            <span key={j} className="text-xs px-2 py-1 rounded bg-white/10 text-white/80">
                              {course}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Certifications */}
      <div className="mb-6">
        <button
          onClick={() => toggleSection('certifications')}
          className="w-full flex items-center justify-between text-lg font-semibold text-white mb-2"
        >
          <div className="flex items-center gap-2">
            <Medal className="h-5 w-5 text-[#FF375F]" />
            Certifications
          </div>
          <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'certifications' ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSection === 'certifications' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-2">
                {userProfile.certifications.map((cert, i) => (
                  <div key={i} className="bg-[#2C2C2E] rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{cert.name}</h3>
                        <p className="text-white/60">{cert.issuer}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-white/40">{cert.year}</span>
                        {cert.expiryDate && (
                          <p className="text-sm text-white/60">
                            Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    {cert.credentialId && (
                      <p className="text-sm text-white/60 mt-2">
                        Credential ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Skills */}
      <div>
        <button
          onClick={() => toggleSection('skills')}
          className="w-full flex items-center justify-between text-lg font-semibold text-white mb-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[#5E5CE6]" />
            Skills
          </div>
          <ChevronRight className={`h-5 w-5 transition-transform ${expandedSection === 'skills' ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {expandedSection === 'skills' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 mt-2">
                {userProfile.skills.map((skillGroup, i) => (
                  <div key={i} className="bg-[#2C2C2E] rounded-lg p-4">
                    <h3 className="font-semibold text-white mb-2">{skillGroup.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.items.map((skill, j) => (
                        <span key={j} className="text-sm px-3 py-1 rounded-full bg-white/10 text-white/80">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2">
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${skillGroup.proficiency}%` }}
                          className="h-full bg-gradient-to-r from-[#5E5CE6] to-[#0A84FF]"
                        />
                      </div>
                      <p className="text-xs text-white/60 mt-1">
                        Proficiency: {skillGroup.proficiency}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Add Application Tracker component
const ApplicationTracker = () => {
  return (
    <div className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Briefcase className="h-5 w-5 text-[#0A84FF]" />
        Application Tracker
      </h2>
      
      <div className="space-y-4">
        {applications.map((app) => (
          <motion.div
            key={app.id}
            whileHover={{ scale: 1.01 }}
            className="bg-[#2C2C2E] rounded-lg p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold text-white">{app.role}</div>
                <div className="text-sm text-white/60">{app.company}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  app.status === 'Interviewing' ? 'bg-[#FF9F0A]/20 text-[#FF9F0A]' :
                  app.status === 'Applied' ? 'bg-[#0A84FF]/20 text-[#0A84FF]' :
                  app.status === 'Offered' ? 'bg-[#32D74B]/20 text-[#32D74B]' :
                  'bg-[#FF453A]/20 text-[#FF453A]'
                }`}>
                  {app.status}
                </span>
                <span className="text-sm text-white/60">{app.date}</span>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-white/60">Match: {app.match}%</span>
              <Button variant="ghost" size="sm" className="text-[#0A84FF]">
                View Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Add Wellness Check component
const WellnessCheck = () => {
  const [mood, setMood] = useState(0.8);
  const [energy, setEnergy] = useState(0.7);

  const getMoodEmoji = (value: number) => {
    if (value >= 0.8) return "😊";
    if (value >= 0.6) return "🙂";
    if (value >= 0.4) return "😐";
    if (value >= 0.2) return "😔";
    return "😢";
  };

  return (
    <div className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Heart className="h-5 w-5 text-[#FF375F]" />
        How are you feeling today?
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-white/80 mb-2 block">Mood</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={mood}
              onChange={(e) => setMood(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-2xl">{getMoodEmoji(mood)}</span>
          </div>
        </div>

        <div>
          <label className="text-white/80 mb-2 block">Energy Level</label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={energy}
              onChange={(e) => setEnergy(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-2xl">⚡</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button className="flex-1 bg-[#FF375F] hover:bg-[#FF375F]/90">
            Save Check-in
          </Button>
          <Button variant="outline" className="flex-1">
            View History
          </Button>
        </div>
      </div>
    </div>
  );
};

// Add Community Feed component
const CommunityFeed = () => {
  return (
    <div className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="h-5 w-5 text-[#5E5CE6]" />
        Community Feed
      </h2>
      
      <div className="space-y-4">
        {communityPosts.map((post) => (
          <motion.div
            key={post.id}
            whileHover={{ scale: 1.01 }}
            className="bg-[#2C2C2E] rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{post.user.avatar}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{post.user.name}</span>
                  <span className="text-xs text-white/60">{post.timestamp}</span>
                </div>
                <p className="text-white/80 mt-1">{post.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-white/60 hover:text-white">
                    <Heart className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-white/60 hover:text-white">
                    <MessageCircle className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 text-white/60 hover:text-white">
                    <Share className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Add Daily Challenges component
const DailyChallenges = () => {
  return (
    <div className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Timer className="h-5 w-5 text-[#FF9F0A]" />
        Daily Challenges
      </h2>
      
      <div className="space-y-4">
        {dailyChallenges.map((challenge) => (
          <motion.div
            key={challenge.id}
            whileHover={{ scale: 1.01 }}
            className="bg-[#2C2C2E] rounded-lg p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-white">{challenge.title}</h3>
                <p className="text-sm text-white/60 mt-1">{challenge.description}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-[#FF9F0A]/20 text-[#FF9F0A]">
                    +{challenge.xpReward} XP
                  </span>
                  <span className="text-xs text-white/60">
                    Due: {new Date(challenge.deadline).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <Button
                variant={challenge.completed ? "outline" : "default"}
                className={challenge.completed ? "text-[#32D74B]" : ""}
              >
                {challenge.completed ? "Completed" : "Start"}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Add Analytics Panel component
const AnalyticsPanel = () => {
  return (
    <div className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BarChart className="h-5 w-5 text-[#0A84FF]" />
        Resume Insights
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Views */}
        <div className="bg-[#2C2C2E] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#0A84FF]" />
              <span className="text-white/80">Profile Views</span>
            </div>
            <span className={`text-sm ${profileAnalytics.profileViews.trend > 0 ? 'text-[#32D74B]' : 'text-[#FF453A]'}`}>
              {profileAnalytics.profileViews.trend > 0 ? '+' : ''}{profileAnalytics.profileViews.trend}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {profileAnalytics.profileViews.total}
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={profileAnalytics.profileViews.history}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#0A84FF" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Post Impressions */}
        <div className="bg-[#2C2C2E] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-[#FF9F0A]" />
              <span className="text-white/80">Post Impressions</span>
            </div>
            <span className={`text-sm ${profileAnalytics.postImpressions.trend > 0 ? 'text-[#32D74B]' : 'text-[#FF453A]'}`}>
              {profileAnalytics.postImpressions.trend > 0 ? '+' : ''}{profileAnalytics.postImpressions.trend}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {profileAnalytics.postImpressions.total}
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={profileAnalytics.postImpressions.history}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="impressions" stroke="#FF9F0A" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Search Appearances */}
        <div className="bg-[#2C2C2E] rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-[#FF375F]" />
              <span className="text-white/80">Search Appearances</span>
            </div>
            <span className={`text-sm ${profileAnalytics.searchAppearances.trend > 0 ? 'text-[#32D74B]' : 'text-[#FF453A]'}`}>
              {profileAnalytics.searchAppearances.trend > 0 ? '+' : ''}{profileAnalytics.searchAppearances.trend}%
            </span>
          </div>
          <div className="text-2xl font-bold text-white mb-2">
            {profileAnalytics.searchAppearances.total}
          </div>
          <div className="h-16">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={profileAnalytics.searchAppearances.history}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="appearances" stroke="#FF375F" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Recent Activity Feed component
const ActivityFeed = () => {
  return (
    <div className="bg-[#1C1C1E] rounded-xl p-6 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-[#5E5CE6]" />
        Recent Activity
      </h2>
      
      <div className="space-y-4">
        {recentActivity.map((activity) => (
          <motion.div
            key={activity.id}
            whileHover={{ scale: 1.01 }}
            className="bg-[#2C2C2E] rounded-lg p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {activity.type === 'post' ? '📝' : 
                 activity.type === 'comment' ? '💬' : 
                 activity.type === 'like' ? '❤️' : '🔄'}
              </div>
              <div className="flex-1">
                <p className="text-white/80">{activity.content}</p>
                <div className="flex items-center gap-4 mt-2">
                  <button className="flex items-center gap-1 text-white/60 hover:text-white">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{activity.engagement.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 text-white/60 hover:text-white">
                    <MessageSquare className="h-4 w-4" />
                    <span>{activity.engagement.comments}</span>
                  </button>
                  <button className="flex items-center gap-1 text-white/60 hover:text-white">
                    <Share className="h-4 w-4" />
                    <span>{activity.engagement.shares}</span>
                  </button>
                  <span className="text-sm text-white/40">{activity.timestamp}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
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
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showWellnessCheck, setShowWellnessCheck] = useState(true);

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

  // Check for mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle onboarding
  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowOnboarding(false);
    }
  };

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
      <main className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1C1C1E] to-[#121212] pt-32">
        <div className="container mx-auto px-4">
          {/* Welcome Banner with Time-based Greeting */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-[#2C2C2E] to-[#3A3A3C] rounded-xl p-6 border border-white/10 shadow-lg"
          >
            <h1 className="text-2xl font-bold text-white">
              {new Date().getHours() < 12 ? "Good morning" : 
               new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}, {userProfile.name}! 👋
            </h1>
            <p className="text-white/60 mt-1">
              Here's your personalized dashboard for today
            </p>
          </motion.div>

          {/* Wellness Check Modal */}
          <AnimatePresence>
            {showWellnessCheck && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-[#1C1C1E] rounded-xl p-6 max-w-md mx-4 relative"
                >
                  <button
                    onClick={() => setShowWellnessCheck(false)}
                    className="absolute top-3 right-3 text-white/60 hover:text-white"
                  >
                    <X />
                  </button>
                  <WellnessCheck />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-[#1C1C1E] p-1">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="mentor">Mentor Info</TabsTrigger>
              <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
              <TabsTrigger value="resume">Resume Builder</TabsTrigger>
              <TabsTrigger value="applications">Applications</TabsTrigger>
              <TabsTrigger value="community">Community</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="mt-6">
              {/* Priority KPIs Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                <KPIBlock 
                  title="Weekly XP" 
                  value={kpi.xp} 
                  accent="accentBlue" 
                  subtext="XP earned this week"
                  drillDown={drillDownData.xp}
                  emoji="🏆"
                />
                <KPIBlock 
                  title="Skills Progressed" 
                  value={kpi.skills} 
                  accent="accentGreen" 
                  subtext="Skills improved"
                  drillDown={drillDownData.skills}
                  emoji="💡"
                />
                <KPIBlock 
                  title="Streak" 
                  value={`${kpi.streak} days`} 
                  accent="accentOrange" 
                  subtext="Consecutive days"
                  emoji="🔥"
                />
                <KPIBlock 
                  title="Badges Unlocked" 
                  value={kpi.achievements} 
                  accent="accentPurple" 
                  subtext="Badges unlocked"
                  emoji="🎖️"
                />
                <KPIBlock 
                  title="Mentor Sessions" 
                  value={kpi.mentorSessions} 
                  accent="accentPink" 
                  subtext="This month"
                  emoji="🎓"
                />
                <KPIBlock 
                  title="Job Views" 
                  value={kpi.jobViews} 
                  accent="info" 
                  subtext="Profile views"
                  emoji="📈"
                />
              </div>

              {/* Main Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                {/* Left Column */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <ProfessionalProfile />
                  <AnalyticsPanel />
                  <WellnessCheck />
                </div>

                {/* Middle Column */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <DailyChallenges />
                  <ActivityFeed />
                  <CareerRoadmap />
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <ApplicationTracker />
                  <CommunityFeed />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mentor">
              {/* Mentor content */}
            </TabsContent>

            <TabsContent value="ai">
              {/* AI Recommendations content */}
            </TabsContent>

            <TabsContent value="resume">
              {/* Resume Builder content */}
            </TabsContent>

            <TabsContent value="applications">
              {/* Applications content */}
            </TabsContent>

            <TabsContent value="community">
              {/* Community content */}
            </TabsContent>
          </Tabs>

          {/* Mobile bottom navigation */}
          {isMobile && (
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-[#1C1C1E] border-t border-white/10 p-4 flex justify-around items-center"
            >
              <button className="flex flex-col items-center text-white/80 hover:text-white">
                <HomeIcon className="h-6 w-6" />
                <span className="text-xs mt-1">Dashboard</span>
              </button>
              <button className="flex flex-col items-center text-white/80 hover:text-white">
                <Briefcase className="h-6 w-6" />
                <span className="text-xs mt-1">Jobs</span>
              </button>
              <button className="flex flex-col items-center text-white/80 hover:text-white">
                <MessageCircle className="h-6 w-6" />
                <span className="text-xs mt-1">Chat</span>
              </button>
              <button className="flex flex-col items-center text-white/80 hover:text-white">
                <Users className="h-6 w-6" />
                <span className="text-xs mt-1">Community</span>
              </button>
              <button className="flex flex-col items-center text-white/80 hover:text-white">
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">Profile</span>
              </button>
            </motion.div>
          )}

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
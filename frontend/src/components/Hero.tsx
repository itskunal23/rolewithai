"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, ReactNode, FC, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Settings, MessageCircle, PlusCircle, User, Briefcase, ArrowRight, CheckCircle, MessageSquare, Star, ChevronRight, X, Upload, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

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

// Resume JSON Type Interface (matching dashboard)
interface ResumeJson {
  firstName: string;
  lastName: string;
  title: string;
  location: string;
  careerLevel: string;
  summary: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  certifications: string[];
  projects: string[];
  avatarUrl: string | null;
  jobMatchStats: {
    profileViews: number;
    postImpressions: number;
    searchAppearances: number;
  };
  links?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

const Hero = () => {
  const router = useRouter();
  const [showActivity, setShowActivity] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [showAskAI, setShowAskAI] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);
  
  // Resume upload and processing states
  const [isUploading, setIsUploading] = useState(false);
  const [processingStep, setProcessingStep] = useState<'idle' | 'uploading' | 'analyzing' | 'building' | 'visualizing' | 'complete'>('idle');
  const [resumeJson, setResumeJson] = useState<ResumeJson | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle resume upload and processing
  const handleResumeUpload = useCallback(async (uploadedFile: File) => {
    setIsUploading(true);
    setProcessingStep('uploading');
    
    // Step 1: Uploading - Actually upload the file
    let uploadResult: { status: string; resume_id: string; score: number; message: string; resume_data?: ResumeJson } | null = null;
    try {
      const { uploadResume } = await import('@/lib/api');
      uploadResult = await uploadResume(uploadedFile);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process resume. Please ensure the backend is running.';
      console.error('Resume upload failed:', error);
      setError(errorMessage);
      setIsUploading(false);
      setProcessingStep('idle');
      return;
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProcessingStep('analyzing');
    
    // Step 2: Analyzing - Process the resume data
    let resumeData: ResumeJson | null = null;
    if (uploadResult.resume_data) {
      resumeData = uploadResult.resume_data;
    } else if (uploadResult.resume_id) {
      try {
        const { getResume } = await import('@/lib/api');
        const fetched = await getResume(uploadResult.resume_id);
        resumeData = fetched.parsed_data as ResumeJson;
      } catch (error) {
        console.error('Failed to fetch resume:', error);
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStep('building');
    
    // Step 3: Building dashboard - Store the data
    if (resumeData) {
      setResumeJson(resumeData);
      // Store in localStorage for dashboard access
      if (typeof window !== 'undefined') {
        localStorage.setItem('resumeJson', JSON.stringify(resumeData));
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    setProcessingStep('visualizing');
    
    // Step 4: Visualizing - Show populated dashboard
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setProcessingStep('complete');
    setIsUploading(false);
    
    // Redirect to dashboard immediately after step 4
    setTimeout(() => {
      router.push('/dashboard');
    }, 1000);
  }, [router]);

  return (
    <section className="flex flex-col items-center py-10 bg-neutral-900 min-h-screen">
      {/* Extra Spacing Above Hero */}
      <div className="h-8 md:h-12" />
      {/* Hero Intro Section ABOVE Chrome Tab */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8 w-full">
        <div className="flex items-center space-x-2 mb-4 justify-center">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
              />
            ))}
          </div>
        </div>
        <h1 className="text-5xl font-extrabold text-neutral-100 mb-2">Transform Your Career with AI</h1>
        <p className="text-xl text-neutral-400 mb-6">Let AI guide your journey with personalized skill development, mentorship, and job matching.</p>
        
        {/* Resume Upload Section */}
        {processingStep === 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto mb-6"
          >
            <div className="rounded-2xl bg-gradient-to-br from-blue-900/80 to-neutral-900/80 shadow-xl p-8 flex flex-col items-center">
              <span className="text-6xl mb-4">🤖</span>
              <h2 className="text-2xl font-extrabold text-neutral-100 mb-2">Meet Alex, your AI career coach</h2>
              <p className="text-neutral-400 mb-6 text-center">Let's build your future together! I'll guide you through every step to unlock your career potential as an aspiring ML Engineer.</p>
              
              {/* Upload Area */}
              <div
                className={`w-full border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging ? "border-blue-500 bg-blue-500/10" : "border-neutral-600 bg-neutral-800/50"
                }`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const droppedFile = e.dataTransfer.files[0];
                  if (droppedFile && (droppedFile.type === "application/pdf" || droppedFile.type === "application/msword" || droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                    setFile(droppedFile);
                    handleResumeUpload(droppedFile);
                  }
                }}
              >
                <input
                  type="file"
                  id="resume-upload-hero"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0];
                    if (selectedFile) {
                      setFile(selectedFile);
                      handleResumeUpload(selectedFile);
                    }
                  }}
                />
                <label
                  htmlFor="resume-upload-hero"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="mx-auto h-12 w-12 text-neutral-400 mb-2" />
                  <p className="text-sm text-neutral-400 mb-2">
                    {file ? file.name : "Drag and drop your resume here, or click to browse"}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Supports PDF and Word documents
                  </p>
                </label>
              </div>
              
              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex items-center gap-2 bg-neutral-800 rounded-lg px-4 py-2"
                >
                  <FileText className="h-5 w-5 text-blue-500" />
                  <span className="text-sm text-neutral-200">{file.name}</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Processing Animation */}
        {processingStep !== 'idle' && processingStep !== 'complete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl mx-auto mb-6"
          >
            <div className="rounded-2xl bg-gradient-to-br from-blue-900/80 to-neutral-900/80 shadow-xl p-8 flex flex-col items-center">
              <ProcessingAnimation step={processingStep} />
            </div>
          </motion.div>
        )}
        
        {processingStep === 'idle' && (
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => document.getElementById('resume-upload-hero')?.click()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Upload Resume
            </button>
            <button className="border border-neutral-700 text-neutral-100 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition">Learn More</button>
          </div>
        )}
      </div>
      {/* Processing Steps Animation Component */}
      {processingStep !== 'idle' && processingStep !== 'complete' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-4xl mx-auto mb-8"
        >
          <div className="flex flex-col items-center">
            <div className="text-sm text-neutral-400 mb-2">
              {processingStep === 'uploading' && "Step 1: Uploading your resume for analysis"}
              {processingStep === 'analyzing' && "Step 2: Building your AI persona"}
              {processingStep === 'building' && "Step 3: Visualizing your personalized dashboard"}
              {processingStep === 'visualizing' && "Step 4: Spotting your growth opportunities"}
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden max-w-xs">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500/80 to-blue-900/80"
                initial={{ width: 0 }}
                animate={{ 
                  width: processingStep === 'uploading' ? '25%' : 
                         processingStep === 'analyzing' ? '50%' : 
                         processingStep === 'building' ? '75%' : 
                         processingStep === 'visualizing' ? '100%' : '0%'
                }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Chrome Tab and Dashboard */}
      <div className={`w-full max-w-7xl rounded-2xl shadow-2xl border border-neutral-700 overflow-hidden transition-colors ${theme === "dark" ? "dark" : "light"} ${processingStep === 'complete' ? 'animate-pulse' : ''}`}>
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
          {/* Priority KPIs Row - Populated from resume if available */}
          <div className="grid grid-cols-6 gap-4 mb-6">
            <KPIBlock 
              title="Weekly XP" 
              value={resumeJson ? (100 + (resumeJson.skills.length * 20) + (resumeJson.experience.length * 50)) : 320} 
              accent="blue" 
              subtext="XP earned this week" 
            />
            <KPIBlock 
              title="Skills Progressed" 
              value={resumeJson ? resumeJson.skills.length : 5} 
              accent="blue" 
              subtext="Skills improved" 
            />
            <KPIBlock title="Streak" value="7 days" accent="yellow" subtext="Consecutive days" />
            <KPIBlock 
              title="Badges Unlocked" 
              value={resumeJson ? Math.floor(resumeJson.skills.length / 3) + Math.floor(resumeJson.experience.length / 2) : 12} 
              accent="green" 
              subtext="Badges unlocked" 
            />
            <KPIBlock title="Mentor Sessions" value={3} accent="purple" subtext="This month" />
            <KPIBlock 
              title="Job Views" 
              value={resumeJson ? resumeJson.jobMatchStats.profileViews : 28} 
              accent="orange" 
              subtext="Profile views" 
            />
          </div>
          {/* Main Grid */}
          <div className="grid grid-cols-6 gap-4">
            {/* Left Column */}
            <div className="col-span-2 flex flex-col gap-4">
              <SectionBlock title="Career Roadmap">
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {resumeJson && resumeJson.experience.length > 0 ? (
                    <>
                      <span className="text-neutral-400">{resumeJson.experience[resumeJson.experience.length - 1]?.role || 'Entry Level'}</span>
                      <ArrowRight className="text-neutral-400" />
                      <span className="font-bold text-blue-500">{resumeJson.title || 'Current Role'}</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-600/20 text-blue-600 text-xs font-semibold ml-1">Current</span>
                      <ArrowRight className="text-neutral-400" />
                      <span className="text-neutral-400">Next Level</span>
                    </>
                  ) : (
                    <>
                      <span className="font-bold text-blue-500">Data Analyst</span>
                      <ArrowRight className="text-neutral-400" />
                      <span className="font-bold text-blue-500">ML Engineer</span>
                      <span className="inline-block px-2 py-0.5 rounded bg-blue-600/20 text-blue-600 text-xs font-semibold ml-1">Current</span>
                      <ArrowRight className="text-neutral-400" />
                      <span className="text-neutral-400">AI Researcher</span>
                    </>
                  )}
                </div>
                <div className="mt-2 w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full"
                    style={{ background: "#0077B5", width: resumeJson ? '60%' : '60%' }}
                    initial={{ width: 0 }}
                    animate={{ width: processingStep === 'complete' || processingStep === 'visualizing' ? '60%' : 0 }}
                    transition={{ duration: 1, delay: processingStep === 'complete' || processingStep === 'visualizing' ? 0.3 : 0 }}
                  />
                </div>
              </SectionBlock>
              <SectionBlock title="Skill Progress">
                <div className="space-y-3">
                  {(resumeJson && resumeJson.skills.length > 0 ? resumeJson.skills.slice(0, 5).map((skill, idx) => ({
                    name: skill,
                    value: 60 + (idx * 10) // Progressive skill levels
                  })) : skills).map((skill) => (
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
                          animate={{ width: processingStep === 'complete' || processingStep === 'visualizing' ? `${skill.value}%` : 0 }}
                          transition={{ duration: 1, delay: processingStep === 'complete' || processingStep === 'visualizing' ? 0.5 : 0 }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </SectionBlock>
            </div>
            {/* Middle Column */}
            <div className="col-span-2 flex flex-col gap-4">
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
            </div>
            {/* Right Column */}
            <div className="col-span-2 flex flex-col gap-4">
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
              <SectionBlock title="Recent Achievements">
                <ul className="text-lg flex flex-wrap gap-3">
                  {achievements.map((a) => <li key={a}>{a}</li>)}
                </ul>
              </SectionBlock>
            </div>
          </div>
          {/* Action Buttons Row */}
          <div className="flex gap-4 mt-6">
            <button onClick={() => setShowAskAI(true)} className="flex items-center gap-2 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              <MessageCircle size={16} /> Ask AI
            </button>
            <button onClick={() => setShowCustomize(true)} className="flex items-center gap-2 px-4 py-2 rounded bg-neutral-700 hover:bg-neutral-800 text-neutral-100 font-semibold">
              <Settings size={16} /> Customize
            </button>
          </div>
        </div>
      </div>
      {/* Mock Modals */}
      {showAskAI && <MockAIModal onClose={() => setShowAskAI(false)} />}
      {showCustomize && <MockCustomizeModal onClose={() => setShowCustomize(false)} />}
    </section>
  );
};

// Processing Animation Component
const ProcessingAnimation = ({ step }: { step: 'uploading' | 'analyzing' | 'building' | 'visualizing' }) => {
  if (step === 'uploading') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-44 bg-gradient-to-br from-blue-500/80 to-blue-900/80 rounded-lg shadow-lg flex items-center justify-center relative animate-pulse">
          <span className="text-5xl">📄</span>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">Uploading...</span>
        </div>
        <div className="mt-6 flex gap-2">
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    );
  }
  
  if (step === 'analyzing') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-32 h-44 bg-gradient-to-br from-green-500/80 to-blue-900/80 rounded-lg shadow-lg flex items-center justify-center relative animate-pulse">
          <span className="text-5xl">📄</span>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow">Analyzing...</span>
        </div>
        <div className="mt-6 flex gap-2">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
        <p className="mt-4 text-neutral-400 text-center">Building your AI persona...</p>
      </div>
    );
  }
  
  if (step === 'building') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-64 h-36 bg-gradient-to-br from-neutral-800 to-yellow-400/40 rounded-xl shadow-lg flex flex-col justify-between p-4">
          <div className="flex gap-2">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-8 h-8 bg-blue-600/80 rounded-lg flex items-center justify-center text-white font-bold"
            >XP</motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-8 h-8 bg-green-500/80 rounded-lg flex items-center justify-center text-white font-bold"
            >SK</motion.div>
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="w-8 h-8 bg-yellow-400/80 rounded-lg flex items-center justify-center text-white font-bold"
            >ST</motion.div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-white font-extrabold"
            >Your Dashboard</motion.span>
          </div>
        </div>
        <p className="mt-4 text-neutral-400 text-center">Visualizing your personalized dashboard...</p>
      </div>
    );
  }
  
  if (step === 'visualizing') {
    return (
      <div className="flex flex-col items-center">
        <div className="w-64 h-36 bg-gradient-to-br from-purple-600/80 to-blue-900/80 rounded-xl shadow-lg flex flex-col justify-center items-center">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl text-white font-extrabold mb-2"
          >AI Recommendations</motion.span>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow mb-2"
          >"Take the Deep Learning Specialization"</motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow"
          >"Connect with a Mentor"</motion.div>
        </div>
        <p className="mt-4 text-neutral-400 text-center">Unlocking your next steps with AI...</p>
      </div>
    );
  }
  
  return null;
};

const KPIBlock: FC<KPIBlockProps> = ({ title, value, accent, subtext }) => {
  const color = accent === "blue" ? "text-blue-500" : accent === "green" ? "text-green-500" : accent === "yellow" ? "text-yellow-400" : accent === "purple" ? "text-purple-500" : "text-orange-500";
  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700 shadow p-4 flex flex-col items-center">
      <div className={`text-lg font-extrabold mb-1 ${color}`}>{title}</div>
      <div className={`text-3xl font-black ${color}`}>{value}</div>
      <div className="text-xs text-neutral-400 mt-1">{subtext}</div>
    </div>
  );
};
const SectionBlock: FC<SectionBlockProps> = ({ title, children }) => {
  return (
    <div className="rounded-xl bg-neutral-800 border border-neutral-700 shadow p-4">
      <div className="text-xl font-extrabold text-neutral-100 mb-3 tracking-tight">{title}</div>
      {children}
    </div>
  );
};

export default Hero;

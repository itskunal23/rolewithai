"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const user = { name: "Alex", role: "ML Engineer" };
const questNarratives = [
  "Uploading your resume for analysis",
  "Building your AI persona",
  "Visualizing your personalized dashboard",
  "Spotting your growth opportunities",
  "Unlocking your next steps with AI"
];

const steps = [
  {
    key: "upload",
    title: "Attach Your Resume",
    description: `Upload your resume to get personalized insights, ${user.name}.`,
    accent: "bg-blue-600",
    visual: (
      <div className="flex flex-col items-center">
        <div className="w-32 h-44 bg-gradient-to-br from-blue-500/80 to-blue-900/80 rounded-lg shadow-lg flex items-center justify-center relative">
          <span className="text-5xl">📄</span>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">Resume.pdf</span>
        </div>
        <div className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-lg">Upload</div>
      </div>
    ),
  },
  {
    key: "processing",
    title: "Analyzing Your Skills",
    description: `We're analyzing your skills to tailor your AI roadmap, ${user.name}.`,
    accent: "bg-green-500",
    visual: (
      <div className="flex flex-col items-center">
        <div className="w-32 h-44 bg-gradient-to-br from-green-500/80 to-blue-900/80 rounded-lg shadow-lg flex items-center justify-center relative animate-pulse">
          <span className="text-5xl">📄</span>
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow">Processing...</span>
        </div>
        <div className="mt-6 flex gap-2">
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    ),
  },
  {
    key: "dashboard",
    title: "Dashboard Visualization",
    description: `See your personalized dashboard come to life, ${user.name}.`,
    accent: "bg-yellow-400",
    visual: (
      <div className="flex flex-col items-center">
        <div className="w-64 h-36 bg-gradient-to-br from-neutral-800 to-yellow-400/40 rounded-xl shadow-lg flex flex-col justify-between p-4">
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-blue-600/80 rounded-lg flex items-center justify-center text-white font-bold">XP</div>
            <div className="w-8 h-8 bg-green-500/80 rounded-lg flex items-center justify-center text-white font-bold">SK</div>
            <div className="w-8 h-8 bg-yellow-400/80 rounded-lg flex items-center justify-center text-white font-bold">ST</div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-2xl text-white font-extrabold">Your Dashboard</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    key: "skillgaps",
    title: "Identifying Skill Gaps",
    description: `RoleWithAI highlights your growth opportunities, ${user.name}.`,
    accent: "bg-orange-500",
    visual: (
      <div className="flex flex-col items-center">
        <div className="w-64 h-36 bg-gradient-to-br from-neutral-800 to-orange-500/40 rounded-xl shadow-lg flex flex-col justify-between p-4 relative">
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-blue-600/80 rounded-lg flex items-center justify-center text-white font-bold">XP</div>
            <div className="w-8 h-8 bg-green-500/80 rounded-lg flex items-center justify-center text-white font-bold">SK</div>
            <div className="w-8 h-8 bg-yellow-400/80 rounded-lg flex items-center justify-center text-white font-bold">ST</div>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <span className="text-2xl text-white font-extrabold">Skill Gaps</span>
          </div>
          <div className="absolute right-4 bottom-4 bg-red-500 text-white text-xs px-2 py-1 rounded shadow-lg">Python: Intermediate</div>
          <div className="absolute left-4 bottom-4 bg-orange-500 text-white text-xs px-2 py-1 rounded shadow-lg">ML: Needs Practice</div>
        </div>
      </div>
    ),
  },
  {
    key: "recommendations",
    title: "AI Recommendations",
    description: `Great job, ${user.name}! Get personalized next steps in under 30 seconds.`,
    accent: "bg-purple-500",
    visual: (
      <div className="flex flex-col items-center">
        <div className="w-64 h-36 bg-gradient-to-br from-purple-600/80 to-blue-900/80 rounded-xl shadow-lg flex flex-col justify-center items-center">
          <span className="text-2xl text-white font-extrabold mb-2">AI Recommendations</span>
          <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full shadow mb-2">"Take the Deep Learning Specialization"</div>
          <div className="bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow">"Connect with a Mentor"</div>
        </div>
      </div>
    ),
  },
];

const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function HowItWorks() {
  const [step, setStep] = useState(-1); // -1 = intro
  const [showReward, setShowReward] = useState(false);
  const [showSocial, setShowSocial] = useState(false);
  const rewardStep = useRef(Math.floor(Math.random() * (steps.length - 1)) + 1); // random step except first/last

  // Show reward pop-up on the random step
  useEffect(() => {
    if (step === rewardStep.current) {
      setShowReward(true);
      const t = setTimeout(() => setShowReward(false), 1800);
      return () => clearTimeout(t);
    }
  }, [step]);

  // Show social modal after last step
  useEffect(() => {
    if (step === steps.length) {
      setShowSocial(true);
    } else {
      setShowSocial(false);
    }
  }, [step]);

  const goToStep = (idx: number) => setStep(idx);
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const skip = () => setStep(steps.length);
  const start = () => setStep(0);

  // Animation config
  const anim = prefersReducedMotion
    ? { initial: {}, animate: {}, exit: {} }
    : { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -40 } };

  return (
    <section id="how-it-works" className="py-20 bg-neutral-900">
      <div className="container px-4 md:px-6 max-w-2xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-extrabold text-neutral-100 mb-8 text-center">How RoleWithAI works?</h2>
        {/* Persona/Narrative Intro */}
        {step === -1 && (
          <motion.div {...anim} className="flex flex-col items-center justify-center min-h-[320px]">
            <div className="rounded-2xl bg-gradient-to-br from-blue-900/80 to-neutral-900/80 shadow-xl p-8 w-full max-w-md flex flex-col items-center">
              <span className="text-6xl mb-4">🤖</span>
              <h2 className="text-2xl font-extrabold text-neutral-100 mb-2">Meet Alex, your AI career coach</h2>
              <p className="text-neutral-400 mb-6 text-center">Let's build your future together! I'll guide you through every step to unlock your career potential as an aspiring {user.role}.</p>
              <button onClick={start} className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold text-lg shadow hover:bg-blue-700 transition">Start</button>
            </div>
          </motion.div>
        )}
        {/* Stepper & Steps */}
        {step >= 0 && step < steps.length && (
          <>
            {/* Narrative Progress Bar */}
            <div className="flex flex-col items-center mb-6">
              <div className="text-sm text-neutral-400 mb-1">Step {step + 1} of {steps.length}: <span className="font-semibold text-neutral-100">{questNarratives[step]}</span></div>
              <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden max-w-xs">
                <motion.div
                  className="h-2 rounded-full"
                  style={{ background: steps[step].accent.replace('bg-', 'bg-gradient-to-r from-') + '/80 to-blue-900/80' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
                  transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
                />
              </div>
            </div>
            {/* Stepper Progress Indicator */}
            <div className="flex justify-center gap-3 mb-8">
              {steps.map((stepObj, idx) => (
                <button
                  key={stepObj.key}
                  aria-label={`Go to step ${idx + 1}`}
                  className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                    idx === step
                      ? `${stepObj.accent} border-white scale-125 shadow-lg`
                      : "bg-neutral-700 border-neutral-600 hover:border-blue-400"
                  }`}
                  onClick={() => goToStep(idx)}
                />
              ))}
            </div>
            {/* Animated Step Content */}
            <div className="relative min-h-[320px] flex flex-col items-center justify-center">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={steps[step].key}
                  {...anim}
                  className="flex flex-col items-center w-full"
                >
                  {steps[step].visual}
                  <div className="mt-8 text-center px-4">
                    <h3 className="text-xl font-extrabold text-neutral-100 mb-2">{`${step + 1}. ${steps[step].title}`}</h3>
                    <p className="text-neutral-400 text-base max-w-md mx-auto">{steps[step].description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              {/* Variable Reward Pop-up */}
              <AnimatePresence>
                {showReward && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg text-lg font-bold z-20"
                  >
                    🎉 Lucky Skill Boost! +50 XP
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Navigation Controls */}
            <div className="flex justify-between items-center mt-8 gap-4">
              <button
                onClick={prevStep}
                disabled={step === 0}
                className={`px-4 py-2 rounded font-semibold transition-colors min-w-[96px] ${
                  step === 0
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Back
              </button>
              <button
                onClick={skip}
                disabled={step === steps.length - 1}
                className={`px-4 py-2 rounded font-semibold transition-colors min-w-[96px] ${
                  step === steps.length - 1
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                Skip
              </button>
              <button
                onClick={nextStep}
                disabled={step === steps.length - 1}
                className={`px-4 py-2 rounded font-semibold transition-colors min-w-[96px] ${
                  step === steps.length - 1
                    ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Next
              </button>
            </div>
          </>
        )}
        {/* Social Proof Modal */}
        <AnimatePresence>
          {showSocial && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            >
              <div className="bg-neutral-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-neutral-700 flex flex-col items-center">
                <span className="text-5xl mb-4">🏆</span>
                <h2 className="text-2xl font-extrabold text-neutral-100 mb-2">You're in the top 10% of AI learners this week!</h2>
                <p className="text-neutral-400 mb-6 text-center">Share your Skill Snapshot and inspire your peers.</p>
                <div className="flex gap-4 mb-4">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">Share on LinkedIn</button>
                  <button className="bg-blue-400 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition">Share on X</button>
                </div>
                <button onClick={() => setStep(0)} className="mt-2 text-neutral-400 hover:text-neutral-100 underline">Restart Walkthrough</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-16">
          <Separator className="bg-zinc-800 my-10" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-xl">
              <h3 className="text-2xl font-bold mb-4 text-neutral-100">Continuous Improvement</h3>
              <p className="text-neutral-400">
                Our roadmap evolves based on user feedback and industry trends. We're committed to
                continuously enhancing the platform to better serve your career development needs.
              </p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex items-center space-x-4">
              <div className="h-10 w-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5 text-blue-600"
                >
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-neutral-100">Have a feature idea?</h4>
                <p className="text-xs text-neutral-400">We'd love to hear your suggestions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

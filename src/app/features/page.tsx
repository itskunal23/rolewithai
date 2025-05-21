"use client";

import { motion } from "framer-motion";
import { MessageCircle, Settings, User, Briefcase, Star, ChevronRight, ArrowRight } from "lucide-react";

const features = [
  {
    title: "AI-Powered Career Guidance",
    description: "Get personalized career advice and learning paths tailored to your goals",
    icon: <MessageCircle className="h-6 w-6 text-blue-500" />,
    stats: "98% user satisfaction"
  },
  {
    title: "Skill Tracking & Analytics",
    description: "Visualize your progress with detailed analytics and skill assessments",
    icon: <Settings className="h-6 w-6 text-purple-500" />,
    stats: "500+ skills tracked"
  },
  {
    title: "Mentor Matching",
    description: "Connect with industry experts and AI mentors for personalized guidance",
    icon: <User className="h-6 w-6 text-green-500" />,
    stats: "1000+ active mentors"
  },
  {
    title: "Job Matching",
    description: "Find the perfect role with our AI-powered job matching system",
    icon: <Briefcase className="h-6 w-6 text-orange-500" />,
    stats: "5000+ job matches"
  },
  {
    title: "Achievement System",
    description: "Earn badges and track your progress with our gamified system",
    icon: <Star className="h-6 w-6 text-yellow-500" />,
    stats: "50+ unique badges"
  }
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Data Scientist",
    company: "TechCorp",
    text: "RoleWithAI transformed my career journey. The personalized guidance helped me land my dream job.",
    avatar: "👩‍💻"
  },
  {
    name: "Michael Rodriguez",
    role: "ML Engineer",
    company: "AI Solutions",
    text: "The skill tracking and mentor matching features are game-changers for career development.",
    avatar: "👨‍💻"
  },
  {
    name: "Emily Thompson",
    role: "Product Manager",
    company: "InnovateAI",
    text: "I've never seen a platform that combines AI guidance with human mentorship so effectively.",
    avatar: "👩‍💼"
  }
];

export default function FeaturesPage() {
  return (
    <section className="flex flex-col items-center py-10 bg-neutral-900 min-h-screen">
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8 w-full max-w-7xl px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-100 mb-2">Powerful Features for Your Career Growth</h1>
        <p className="text-lg md:text-xl text-neutral-400 mb-6 max-w-2xl">Discover how RoleWithAI's comprehensive suite of tools can accelerate your career development.</p>
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
          <div className="text-sm font-semibold text-neutral-400">Features Dashboard</div>
        </div>

        {/* Dashboard Content */}
        <div className="p-8 bg-neutral-900">
          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="rounded-xl bg-neutral-800 border border-neutral-700 shadow p-6">
                <div className="flex items-center gap-3 mb-3">
                  {feature.icon}
                  <h3 className="text-xl font-extrabold text-neutral-100">{feature.title}</h3>
                </div>
                <p className="text-neutral-400 mb-4">{feature.description}</p>
                <div className="text-sm font-semibold text-blue-500">{feature.stats}</div>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-extrabold text-neutral-100 mb-6">What Our Users Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="rounded-xl bg-neutral-800 border border-neutral-700 shadow p-6">
                  <div className="text-4xl mb-4">{testimonial.avatar}</div>
                  <p className="text-neutral-300 mb-4 italic">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-neutral-100">{testimonial.name}</div>
                    <div className="text-sm text-neutral-400">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-neutral-100 mb-4">Ready to Transform Your Career?</h2>
            <p className="text-neutral-400 mb-6">Join thousands of professionals who are already using RoleWithAI</p>
            <div className="flex justify-center gap-4">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Get Started Free
              </button>
              <button className="border border-neutral-700 text-neutral-100 px-6 py-3 rounded-lg font-semibold hover:bg-neutral-800 transition">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 
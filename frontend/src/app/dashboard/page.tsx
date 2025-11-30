"use client";

import "@/styles/dashboard.css";
import { useState, useEffect } from "react";
import { getDashboard, DashboardResponse, uploadResume } from "@/lib/api";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { ResumeUploader } from "@/components/ResumeUploader";
import Footer from "@/components/Footer";

// Section Components
import Greeting from "@/components/dashboard/Greeting";
import ProfileSummaryCard from "@/components/dashboard/ProfileSummaryCard";
import StatsKPICards from "@/components/dashboard/StatsKPICards";
import SectionsFoundChips from "@/components/dashboard/SectionsFoundChips";
import ExperienceTimeline from "@/components/dashboard/ExperienceTimeline";
import EducationSection from "@/components/dashboard/EducationSection";
import SkillsCloud from "@/components/dashboard/SkillsCloud";
import ProjectsSection from "@/components/dashboard/ProjectsSection";
import CertificationsSection from "@/components/dashboard/CertificationsSection";
import EntityInsights from "@/components/dashboard/EntityInsights";
import RecommendationsPanel from "@/components/dashboard/RecommendationsPanel";
import ResumeMetadataView from "@/components/dashboard/ResumeMetadataView";
import ActionZone from "@/components/dashboard/ActionZone";
import EmptyState from "@/components/dashboard/EmptyState";

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showResumeUpload, setShowResumeUpload] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Get user ID (for now, use demo user or get from auth)
  useEffect(() => {
    // TODO: Get from auth context
    const storedUserId = typeof window !== "undefined" ? localStorage.getItem("user_id") : null;
    setUserId(storedUserId || "demo_user");
  }, []);

  // Load dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getDashboard(userId);
        
        // Check if dashboard is enabled
        if (data.enabled === false) {
          setError(data.message || "Please upload a resume to enable your dashboard");
          setDashboardData(null);
        } else {
          setDashboardData(data);
        }
      } catch (err: any) {
        console.error("Failed to load dashboard:", err);
        setError(err.message || "Failed to load dashboard data");
        setDashboardData(null);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadDashboard();
    }
  }, [userId]);

  // Handle resume upload success
  const handleResumeUploadSuccess = async (data: any) => {
    setShowResumeUpload(false);
    // Reload dashboard after upload
    if (userId) {
      try {
        const updatedData = await getDashboard(userId);
        setDashboardData(updatedData);
      } catch (err) {
        console.error("Failed to reload dashboard:", err);
      }
    }
  };

  // Build profile object for components that expect it
  const profile = dashboardData ? {
    firstName: dashboardData.profile.firstName,
    lastName: dashboardData.profile.lastName,
    email: dashboardData.profile.email,
    phone: dashboardData.profile.phone,
    location: dashboardData.profile.location,
    links: dashboardData.profile.links,
    headline: dashboardData.profile.headline,
  } : null;

  if (loading) {
    return (
      <DashboardLayout profile={profile} onResumeUpload={() => setShowResumeUpload(true)} notifications={{ ai: 0, mentor: 0 }}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !dashboardData || dashboardData.enabled === false) {
    return (
      <DashboardLayout profile={profile} onResumeUpload={() => setShowResumeUpload(true)} notifications={{ ai: 0, mentor: 0 }}>
        <div className="flex items-center justify-center min-h-[400px]">
          <EmptyState
            type="profile"
            onAction={() => setShowResumeUpload(true)}
            message={error || "Please upload a resume to enable your dashboard"}
          />
        </div>
        {showResumeUpload && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-[#111214] rounded-xl border border-white/10 p-6 max-w-2xl w-full">
              <ResumeUploader
                onAnalysisComplete={handleResumeUploadSuccess}
                onClose={() => setShowResumeUpload(false)}
              />
            </div>
          </div>
        )}
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      profile={profile}
      onResumeUpload={() => setShowResumeUpload(true)}
      notifications={{ ai: 0, mentor: 0 }}
    >
      {/* SECTION 1: HEADER - Greeting */}
      <div className="mb-6">
        <Greeting profile={profile} />
      </div>

      {/* SECTION 2: PROFILE SUMMARY CARD */}
      <div className="mb-6">
        <ProfileSummaryCard profile={profile} />
      </div>

      {/* SECTION 3: RESUME QUALITY & STATISTICS - KPI Cards */}
      <div className="mb-6">
        <StatsKPICards stats={dashboardData.stats} />
      </div>

      {/* SECTION 4: SECTIONS FOUND (Verification) */}
      <div className="mb-6">
        <SectionsFoundChips sections={dashboardData.resume.metadata.sections_found} />
      </div>

      {/* SECTION 5: MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* LEFT COLUMN: Resume Details */}
        <div className="lg:col-span-8 space-y-6">
          {/* Experience Timeline */}
          {Array.isArray(dashboardData.resume.experience) && dashboardData.resume.experience.length > 0 && (
            <ExperienceTimeline experience={dashboardData.resume.experience} />
          )}

          {/* Education Section */}
          {Array.isArray(dashboardData.resume.education) && dashboardData.resume.education.length > 0 && (
            <EducationSection education={dashboardData.resume.education} />
          )}

          {/* Skills Cloud/List */}
          {Array.isArray(dashboardData.resume.skills) && dashboardData.resume.skills.length > 0 && (
            <SkillsCloud skills={dashboardData.resume.skills} />
          )}

          {/* Projects Section */}
          {Array.isArray(dashboardData.resume.projects) && dashboardData.resume.projects.length > 0 ? (
            <ProjectsSection projects={dashboardData.resume.projects} />
          ) : (
            <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Projects</h3>
              <p className="text-slate-400 mb-4">No projects found in your resume.</p>
              <button
                onClick={() => {
                  // TODO: Call POST /api/v1/projects/generate
                  console.log("Generate project");
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Generate AI Project Suggestion
              </button>
            </div>
          )}

          {/* Certifications */}
          {Array.isArray(dashboardData.resume.certifications) && dashboardData.resume.certifications.length > 0 && (
            <CertificationsSection certifications={dashboardData.resume.certifications} />
          )}

          {/* Named Entity Insights */}
          {dashboardData.resume.entities && (
            <EntityInsights entities={dashboardData.resume.entities} />
          )}
        </div>

        {/* RIGHT COLUMN: Recommendations & Metadata */}
        <div className="lg:col-span-4 space-y-6">
          {/* AI Recommendations Panel */}
          <RecommendationsPanel recommendations={dashboardData.recommendations} />

          {/* Resume Raw Metadata View */}
          <ResumeMetadataView metadata={dashboardData.resume.metadata} stats={dashboardData.stats} />
        </div>
      </div>

      {/* SECTION 6: ACTION ZONE */}
      <div className="mb-8">
        <ActionZone
          onUploadResume={() => setShowResumeUpload(true)}
          onViewResumes={() => {
            // TODO: Navigate to resumes list
            console.log("View previous resumes");
          }}
          onGenerateProject={() => {
            // TODO: Call POST /api/v1/projects/generate
            console.log("Generate project");
          }}
          onRefreshDashboard={() => {
            if (userId) {
              getDashboard(userId).then(setDashboardData).catch(console.error);
            }
          }}
        />
      </div>

      {/* FOOTER */}
      <Footer />

      {/* Resume Upload Modal */}
      {showResumeUpload && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111214] rounded-xl border border-white/10 p-6 max-w-2xl w-full">
            <ResumeUploader
              onAnalysisComplete={handleResumeUploadSuccess}
              onClose={() => setShowResumeUpload(false)}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

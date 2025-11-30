/**
 * API utility functions for backend communication
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ApiError {
  detail: string;
}

/**
 * Resume JSON Type Interface (matching backend format)
 */
export interface ResumeJson {
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

/**
 * Get auth token from localStorage (if using auth)
 */
function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
}

/**
 * Make authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error: ApiError = await response.json().catch(() => ({
      detail: `HTTP ${response.status}: ${response.statusText}`,
    }));
    throw new Error(error.detail || 'API request failed');
  }

  return response.json();
}

/**
 * Upload resume response
 */
export interface UploadResumeResponse {
  status: string;
  resume_id: string;
  score: number;
  message: string;
  resume_data?: ResumeJson;
}

/**
 * Upload resume file
 */
export async function uploadResume(file: File): Promise<UploadResumeResponse> {
  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file); // Changed from 'resume' to 'file' to match backend

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // Don't set Content-Type for FormData - browser will set it with boundary

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/resume/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const error: ApiError = await response.json();
        errorMessage = error.detail || errorMessage;
      } catch {
        // If response is not JSON, use status text
      }
      throw new Error(errorMessage || 'Failed to upload resume');
    }

    return response.json();
  } catch (error) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        'Cannot connect to backend server. Please ensure the backend is running on http://localhost:8000'
      );
    }
    throw error;
  }
}

/**
 * Resume response from API
 */
export interface ResumeResponse {
  id: string;
  filename: string;
  parsed_data: ResumeJson;
  score: number;
  created_at: string | null;
}

/**
 * Get resume by ID
 */
export async function getResume(resumeId: string): Promise<ResumeResponse> {
  return apiRequest<ResumeResponse>(`/api/v1/resume/${resumeId}`);
}

/**
 * Get latest resume for current user
 */
export async function getLatestResume() {
  // First get list of resumes, then get the latest one
  const resumes = await apiRequest<Array<{ id: string; created_at: string }>>(
    '/api/v1/resume/'
  );
  if (resumes.length === 0) {
    return null;
  }
  // Get the most recent one
  const latest = resumes[0];
  return getResume(latest.id);
}

/**
 * Dashboard data interfaces - matching backend 1:1
 */
export interface DashboardProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  links: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  headline: string;
}

export interface DashboardStats {
  resume_score: number;
  skills_count: number;
  experience_years: number;
  projects_count: number;
  education_level: string;
  processing_method: string;
  raw_text_length: number;
}

export interface DashboardResume {
  experience: Array<{
    title?: string;
    role?: string;
    company: string;
    location?: string;
    start?: string;
    startDate?: string;
    end?: string;
    endDate?: string;
    bullets?: string[];
    description?: string;
  }>;
  education: Array<{
    school?: string;
    institution?: string;
    degree: string;
    grad_date?: string;
    startDate?: string;
    endDate?: string;
    gpa?: string;
  }>;
  skills: string[];
  projects: Array<{
    title?: string;
    desc?: string;
    description?: string;
    tech?: string[];
    technologies?: string[];
  }>;
  certifications: string[];
  entities: {
    organizations?: string[];
    locations?: string[];
    dates?: string[];
    persons?: string[];
  };
  metadata: {
    sections_found: string[];
    processed_at: string;
    resume_id: string;
  };
}

export interface DashboardRecommendations {
  skill_gaps: Array<{
    skill: string;
    current_percent?: number;
    required_percent?: number;
  }>;
  project_suggestions: Array<{
    title: string;
    description: string;
    skills: string[];
  }>;
  job_match_stats: Record<string, any>;
}

export interface DashboardResponse {
  enabled?: boolean;
  message?: string;
  profile: DashboardProfile;
  stats: DashboardStats;
  resume: DashboardResume;
  recommendations: DashboardRecommendations;
}

/**
 * Get dashboard data
 */
export async function getDashboard(userId: string): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>(`/api/v1/dashboard/${userId}`);
}


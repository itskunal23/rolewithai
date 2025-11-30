module.exports = [
"[project]/src/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * API utility functions for backend communication
 */ __turbopack_context__.s([
    "getDashboard",
    ()=>getDashboard,
    "getLatestResume",
    ()=>getLatestResume,
    "getResume",
    ()=>getResume,
    "uploadResume",
    ()=>uploadResume
]);
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
/**
 * Get auth token from localStorage (if using auth)
 */ function getAuthToken() {
    if ("TURBOPACK compile-time truthy", 1) return null;
    //TURBOPACK unreachable
    ;
}
/**
 * Make authenticated API request
 */ async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                detail: `HTTP ${response.status}: ${response.statusText}`
            }));
        throw new Error(error.detail || 'API request failed');
    }
    return response.json();
}
async function uploadResume(file) {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('resume', file);
    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}/api/v1/resume/upload`, {
        method: 'POST',
        headers,
        body: formData
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                detail: `HTTP ${response.status}: ${response.statusText}`
            }));
        throw new Error(error.detail || 'Failed to upload resume');
    }
    return response.json();
}
async function getResume(resumeId) {
    return apiRequest(`/api/v1/resume/${resumeId}`);
}
async function getLatestResume() {
    // First get list of resumes, then get the latest one
    const resumes = await apiRequest('/api/v1/resume/');
    if (resumes.length === 0) {
        return null;
    }
    // Get the most recent one
    const latest = resumes[0];
    return getResume(latest.id);
}
async function getDashboard(userId) {
    return apiRequest(`/api/v1/dashboard/${userId}`);
}
}),
];

//# sourceMappingURL=src_lib_api_ts_26bff7e8._.js.map
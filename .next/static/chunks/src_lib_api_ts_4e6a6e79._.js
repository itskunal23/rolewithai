(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_BASE_URL = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
/**
 * Get auth token from localStorage (if using auth)
 */ function getAuthToken() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return localStorage.getItem('auth_token');
}
/**
 * Make authenticated API request
 */ async function apiRequest(endpoint) {
    let options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) {
        headers['Authorization'] = "Bearer ".concat(token);
    }
    const response = await fetch("".concat(API_BASE_URL).concat(endpoint), {
        ...options,
        headers
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                detail: "HTTP ".concat(response.status, ": ").concat(response.statusText)
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
        headers['Authorization'] = "Bearer ".concat(token);
    }
    const response = await fetch("".concat(API_BASE_URL, "/api/v1/resume/upload"), {
        method: 'POST',
        headers,
        body: formData
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                detail: "HTTP ".concat(response.status, ": ").concat(response.statusText)
            }));
        throw new Error(error.detail || 'Failed to upload resume');
    }
    return response.json();
}
async function getResume(resumeId) {
    return apiRequest("/api/v1/resume/".concat(resumeId));
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
    return apiRequest("/api/v1/dashboard/".concat(userId));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_lib_api_ts_4e6a6e79._.js.map
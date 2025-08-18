const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session management
    ...options,
  };

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  login: (email, password, userType) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: { email, password, user_type: userType },
    }),

  logout: () =>
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  registerStudent: (studentData) =>
    apiRequest('/auth/register/student', {
      method: 'POST',
      body: studentData,
    }),

  registerInstructor: (instructorData) =>
    apiRequest('/auth/register/instructor', {
      method: 'POST',
      body: instructorData,
    }),

  getProfile: () =>
    apiRequest('/auth/profile'),

  checkSession: () =>
    apiRequest('/auth/check-session'),
};

// Attendance API
export const attendanceAPI = {
  getCourses: () =>
    apiRequest('/attendance/courses'),

  getSessions: (courseId = null) =>
    apiRequest(`/attendance/sessions${courseId ? `?course_id=${courseId}` : ''}`),

  createSession: (sessionData) =>
    apiRequest('/attendance/sessions', {
      method: 'POST',
      body: sessionData,
    }),

  markAttendance: (sessionId, method, notes = '') =>
    apiRequest('/attendance/mark-attendance', {
      method: 'POST',
      body: {
        session_id: sessionId,
        attendance_method: method,
        notes,
      },
    }),

  getAttendanceRecords: (courseId = null, sessionId = null) => {
    const params = new URLSearchParams();
    if (courseId) params.append('course_id', courseId);
    if (sessionId) params.append('session_id', sessionId);
    const queryString = params.toString();
    return apiRequest(`/attendance/attendance-records${queryString ? `?${queryString}` : ''}`);
  },

  getAttendanceStats: (courseId = null) =>
    apiRequest(`/attendance/attendance-stats${courseId ? `?course_id=${courseId}` : ''}`),

  getDashboard: () =>
    apiRequest('/attendance/dashboard'),
};

// Helper functions for common operations
export const apiHelpers = {
  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const response = await authAPI.checkSession();
      return response.authenticated;
    } catch (error) {
      return false;
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await authAPI.getProfile();
      return response;
    } catch (error) {
      return null;
    }
  },

  // Login and return user data
  loginUser: async (email, password, userType) => {
    try {
      const response = await authAPI.login(email, password, userType);
      return {
        success: true,
        user: response.user,
        userType: response.user_type,
        message: response.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Mark attendance with error handling
  markAttendanceWithFeedback: async (sessionId, method, notes = '') => {
    try {
      const response = await attendanceAPI.markAttendance(sessionId, method, notes);
      return {
        success: true,
        message: response.message,
        record: response.record,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get dashboard data with error handling
  getDashboardData: async () => {
    try {
      const response = await attendanceAPI.getDashboard();
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }
  },
};




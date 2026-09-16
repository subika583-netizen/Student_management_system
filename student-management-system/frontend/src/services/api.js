import axios from 'axios';

// Configure the base URL for the Django REST Framework API
// During development, Django runs on port 8000
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Student API Service with clear methods for all CRUD operations
export const studentApi = {
  /**
   * Fetch all registered students
   * GET /api/students/
   */
  getAllStudents: async () => {
    try {
      const response = await apiClient.get('/students/');
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Fetch single student by student_id
   * GET /api/students/<id>/
   */
  getStudentById: async (id) => {
    try {
      const response = await apiClient.get(`/students/${id}/`);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Create a new student record
   * POST /api/students/
   */
  createStudent: async (studentData) => {
    try {
      const response = await apiClient.post('/students/', studentData);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Update an existing student record
   * PUT /api/students/<id>/
   */
  updateStudent: async (id, studentData) => {
    try {
      const response = await apiClient.put(`/students/${id}/`, studentData);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },

  /**
   * Delete a student record by ID
   * DELETE /api/students/<id>/
   */
  deleteStudent: async (id) => {
    try {
      const response = await apiClient.delete(`/students/${id}/`);
      return response.data;
    } catch (error) {
      throw formatError(error);
    }
  },
};

/**
 * Standardize error responses from backend/Axios for clean display in UI
 */
function formatError(error) {
  if (error.response) {
    // Server responded with non-2xx status code
    const data = error.response.data;
    const status = error.response.status;

    let message = 'An error occurred while processing your request.';
    let fieldErrors = {};

    if (data) {
      if (typeof data === 'string') {
        message = data;
      } else if (data.error) {
        message = data.error;
      } else if (data.message) {
        message = data.message;
      } else if (data.detail) {
        message = data.detail;
      }

      // Collect field-specific validation errors from DRF
      if (data.details && typeof data.details === 'object') {
        fieldErrors = data.details;
      } else if (typeof data === 'object') {
        Object.keys(data).forEach((key) => {
          if (Array.isArray(data[key])) {
            fieldErrors[key] = data[key];
          }
        });
      }
    }

    return {
      status,
      message,
      fieldErrors,
      raw: data,
    };
  } else if (error.request) {
    // Request made but no response received (e.g. Django backend is not running)
    return {
      status: 0,
      message: 'Cannot connect to backend server. Please verify Django is running on port 8000.',
      fieldErrors: {},
    };
  } else {
    // Error setting up the request
    return {
      status: 0,
      message: error.message || 'An unexpected error occurred.',
      fieldErrors: {},
    };
  }
}

export default studentApi;

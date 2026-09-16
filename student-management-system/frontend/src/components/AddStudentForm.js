import React, { useState } from 'react';
import studentApi from '../services/api';
import './AddStudentForm.css';

/**
 * AddStudentForm Component
 * Renders the form to register a new student with complete client-side validation
 * and handles server responses (e.g. duplicate student_id/email).
 */
function AddStudentForm({ onStudentAdded, onCancel }) {
  // Form input states
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    year: '1',
  });

  // Inline client-side errors
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverMessage, setServerMessage] = useState(null);

  // Handle standard input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error on user edit
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  /**
   * Client-Side Validation Rules
   * Validates required fields, email format, numeric phone, and valid academic year.
   */
  const validateForm = () => {
    const newErrors = {};

    // Student ID
    if (!formData.student_id.trim()) {
      newErrors.student_id = 'Student ID is required (e.g. STU101).';
    }

    // Name
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address (e.g. student@college.edu).';
    }

    // Phone number: numeric only
    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d+$/.test(phoneTrimmed)) {
      newErrors.phone = 'Phone number must contain only numeric digits (no letters or dashes).';
    } else if (phoneTrimmed.length < 7 || phoneTrimmed.length > 15) {
      newErrors.phone = 'Phone number must be between 7 and 15 digits.';
    }

    // Department
    if (!formData.department.trim()) {
      newErrors.department = 'Please select or enter an academic department.';
    }

    // Year validation (1 to 5)
    const yearInt = parseInt(formData.year, 10);
    if (isNaN(yearInt) || yearInt < 1 || yearInt > 5) {
      newErrors.year = 'Year must be an integer between 1 and 5.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage(null);

    // Run client validation first
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        student_id: formData.student_id.trim(),
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        year: parseInt(formData.year, 10),
      };

      const response = await studentApi.createStudent(payload);

      // Reset form on success
      setFormData({
        student_id: '',
        name: '',
        email: '',
        phone: '',
        department: 'Computer Science',
        year: '1',
      });
      setErrors({});

      if (onStudentAdded) {
        onStudentAdded(response.student || payload);
      }
    } catch (err) {
      // Map server-side errors back to form fields if available
      if (err.fieldErrors) {
        const backendFieldErrors = {};
        Object.keys(err.fieldErrors).forEach((field) => {
          backendFieldErrors[field] = Array.isArray(err.fieldErrors[field])
            ? err.fieldErrors[field][0]
            : err.fieldErrors[field];
        });
        setErrors(backendFieldErrors);
      }
      setServerMessage({
        type: 'danger',
        text: err.message || 'Failed to register student. Please verify the input values.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <h2>Register New Student</h2>
        <p>Complete all required fields below to create a new student record in the database.</p>
      </div>

      {serverMessage && (
        <div className={`alert-banner alert-${serverMessage.type}`}>
          <span>{serverMessage.text}</span>
          <button
            className="alert-close-btn"
            onClick={() => setServerMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="student-form" noValidate>
        {/* Row 1: Student ID & Full Name */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="student_id">
              Student ID <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="student_id"
              name="student_id"
              className={`form-control ${errors.student_id ? 'input-error' : ''}`}
              placeholder="e.g. STU101"
              value={formData.student_id}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.student_id ? (
              <span className="error-feedback">{errors.student_id}</span>
            ) : (
              <span className="form-hint">Unique primary registration number.</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-control ${errors.name ? 'input-error' : ''}`}
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.name && <span className="error-feedback">{errors.name}</span>}
          </div>
        </div>

        {/* Row 2: Email & Phone */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-control ${errors.email ? 'input-error' : ''}`}
              placeholder="e.g. john.doe@college.edu"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-feedback">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phone">
              Phone Number <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              className={`form-control ${errors.phone ? 'input-error' : ''}`}
              placeholder="e.g. 9876543210 (digits only)"
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.phone ? (
              <span className="error-feedback">{errors.phone}</span>
            ) : (
              <span className="form-hint">Must contain numeric digits only.</span>
            )}
          </div>
        </div>

        {/* Row 3: Department & Year */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="department">
              Department <span className="required-star">*</span>
            </label>
            <select
              id="department"
              name="department"
              className={`form-control ${errors.department ? 'input-error' : ''}`}
              value={formData.department}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics & Communication">Electronics & Communication</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
              <option value="Civil Engineering">Civil Engineering</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
            </select>
            {errors.department && <span className="error-feedback">{errors.department}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="year">
              Academic Year <span className="required-star">*</span>
            </label>
            <select
              id="year"
              name="year"
              className={`form-control ${errors.year ? 'input-error' : ''}`}
              value={formData.year}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="1">1st Year (Freshman)</option>
              <option value="2">2nd Year (Sophomore)</option>
              <option value="3">3rd Year (Junior)</option>
              <option value="4">4th Year (Senior)</option>
              <option value="5">5th Year (Graduate/Dual)</option>
            </select>
            {errors.year && <span className="error-feedback">{errors.year}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering...' : 'Save Student'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddStudentForm;

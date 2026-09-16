import React, { useState, useEffect } from 'react';
import studentApi from '../services/api';
import './AddStudentForm.css';
import './EditStudentForm.css';

/**
 * EditStudentForm Component
 * Pre-populates student data, performs GET verification, handles client-side
 * validation, and dispatches PUT /api/students/<id>/ to persist changes.
 */
function EditStudentForm({ student, onStudentUpdated, onCancel }) {
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '1',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [serverMessage, setServerMessage] = useState(null);

  // Load existing student details on mount
  useEffect(() => {
    const fetchLatestDetails = async () => {
      if (!student || !student.student_id) return;

      try {
        setIsLoading(true);
        // GET /api/students/<id>/ to ensure the freshest record
        const data = await studentApi.getStudentById(student.student_id);
        setFormData({
          student_id: data.student_id,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || 'Computer Science',
          year: String(data.year || '1'),
        });
      } catch (err) {
        // Fallback to passed student props if offline/error
        setFormData({
          student_id: student.student_id,
          name: student.name || '',
          email: student.email || '',
          phone: student.phone || '',
          department: student.department || 'Computer Science',
          year: String(student.year || '1'),
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestDetails();
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Client validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    const phoneTrimmed = formData.phone.trim();
    if (!phoneTrimmed) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d+$/.test(phoneTrimmed)) {
      newErrors.phone = 'Phone number must contain only numeric digits.';
    } else if (phoneTrimmed.length < 7 || phoneTrimmed.length > 15) {
      newErrors.phone = 'Phone number must be between 7 and 15 digits.';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Academic department is required.';
    }

    const yearInt = parseInt(formData.year, 10);
    if (isNaN(yearInt) || yearInt < 1 || yearInt > 5) {
      newErrors.year = 'Year must be an integer between 1 and 5.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit PUT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        student_id: formData.student_id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        department: formData.department.trim(),
        year: parseInt(formData.year, 10),
      };

      const response = await studentApi.updateStudent(formData.student_id, payload);

      if (onStudentUpdated) {
        onStudentUpdated(response.student || payload);
      }
    } catch (err) {
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
        text: err.message || 'Failed to update student record.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="form-card edit-form-wrapper">
        <div className="loading-indicator">
          <p>Loading student information for ID {student.student_id}...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="form-card edit-form-wrapper">
      <div className="form-header">
        <h2>Edit Student Record</h2>
        <p>Update academic information for student ID <strong>{formData.student_id}</strong></p>
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
        {/* Row 1: Student ID (read-only primary key) & Name */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="edit_student_id">
              Student ID <span className="read-only-badge">Primary Key (Fixed)</span>
            </label>
            <input
              type="text"
              id="edit_student_id"
              name="student_id"
              className="form-control"
              value={formData.student_id}
              disabled
              style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#64748b' }}
            />
            <span className="form-hint">Primary key cannot be modified.</span>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit_name">
              Full Name <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="edit_name"
              name="name"
              className={`form-control ${errors.name ? 'input-error' : ''}`}
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
            <label className="form-label" htmlFor="edit_email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              type="email"
              id="edit_email"
              name="email"
              className={`form-control ${errors.email ? 'input-error' : ''}`}
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.email && <span className="error-feedback">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="edit_phone">
              Phone Number <span className="required-star">*</span>
            </label>
            <input
              type="text"
              id="edit_phone"
              name="phone"
              className={`form-control ${errors.phone ? 'input-error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              disabled={isSubmitting}
            />
            {errors.phone ? (
              <span className="error-feedback">{errors.phone}</span>
            ) : (
              <span className="form-hint">Numeric digits only.</span>
            )}
          </div>
        </div>

        {/* Row 3: Department & Year */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="edit_department">
              Department <span className="required-star">*</span>
            </label>
            <select
              id="edit_department"
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
            <label className="form-label" htmlFor="edit_year">
              Academic Year <span className="required-star">*</span>
            </label>
            <select
              id="edit_year"
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

        {/* Action buttons */}
        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving Changes...' : 'Update Student'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditStudentForm;

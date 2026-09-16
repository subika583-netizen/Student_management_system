import React, { useState } from 'react';
import studentApi from '../services/api';
import './DeleteConfirmationModal.css';

/**
 * DeleteConfirmationModal Component
 * Presents a confirmation prompt to prevent accidental deletion,
 * dispatches DELETE /api/students/<id>/, and handles loading and error states.
 */
function DeleteConfirmationModal({ student, onConfirmDelete, onCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  if (!student) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    setErrorMessage(null);

    try {
      await studentApi.deleteStudent(student.student_id);
      if (onConfirmDelete) {
        onConfirmDelete(student);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete student from the database.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click from bubbling
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-header">
          <div className="modal-danger-icon">⚠️</div>
          <div className="modal-header-text">
            <h3>Delete Student Record?</h3>
            <p>This action cannot be undone. The student will be permanently removed from SQLite.</p>
          </div>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to permanently delete this student record?</p>

          <div className="student-delete-preview">
            <div>
              <strong>Name:</strong> {student.name}
            </div>
            <div>
              <strong>Student ID:</strong> {student.student_id}
            </div>
            <div>
              <strong>Department:</strong> {student.department} (Year {student.year})
            </div>
            <div>
              <strong>Email:</strong> {student.email}
            </div>
          </div>

          {errorMessage && (
            <div className="alert-banner alert-danger" style={{ marginTop: '14px', marginBottom: 0 }}>
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Yes, Delete Student'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;

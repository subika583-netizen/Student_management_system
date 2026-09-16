import React, { useState, useMemo } from 'react';
import './StudentList.css';

/**
 * StudentList Component
 * Displays a searchable, responsive table of all registered students with
 * Edit and Delete action controls.
 */
function StudentList({
  students = [],
  isLoading = false,
  onEditStudent,
  onDeleteStudent,
  onAddNew,
}) {
  // Search query for real-time filtering by name or student_id
  const [searchTerm, setSearchTerm] = useState('');

  // Filter students in real-time
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) {
      return students;
    }
    const query = searchTerm.toLowerCase().trim();
    return students.filter(
      (student) =>
        (student.name && student.name.toLowerCase().includes(query)) ||
        (student.student_id && student.student_id.toLowerCase().includes(query)) ||
        (student.department && student.department.toLowerCase().includes(query)) ||
        (student.email && student.email.toLowerCase().includes(query))
    );
  }, [students, searchTerm]);

  return (
    <div className="list-container">
      {/* Top Header */}
      <div className="list-header">
        <div>
          <h2>Student Directory</h2>
          <p>View, search, edit, or delete enrolled student records</p>
        </div>
        <div>
          <button className="btn btn-primary" onClick={onAddNew}>
            + Add New Student
          </button>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="controls-bar">
        <div className="search-box-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by student name or student ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="list-count-badge">
          Showing {filteredStudents.length} of {students.length} student{students.length === 1 ? '' : 's'}
        </div>
      </div>

      {/* Main Table or Loading/Empty State */}
      {isLoading ? (
        <div className="loading-indicator">
          <p>Loading student records from server...</p>
        </div>
      ) : students.length === 0 ? (
        <div className="empty-state">
          <h3>No Student Records Found</h3>
          <p>The database is currently empty. Click below to add your first student record.</p>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={onAddNew}>
              + Register Student
            </button>
          </div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="empty-state">
          <h3>No Matching Students</h3>
          <p>No records matched your search query "{searchTerm}". Try another keyword.</p>
          <div style={{ marginTop: '16px' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setSearchTerm('')}>
              Clear Search Filter
            </button>
          </div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="student-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Department</th>
                <th>Year</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.student_id}>
                  <td className="student-id-cell">{student.student_id}</td>
                  <td>
                    <strong>{student.name}</strong>
                  </td>
                  <td>{student.email}</td>
                  <td>{student.phone}</td>
                  <td>
                    <span className="badge-department">{student.department}</span>
                  </td>
                  <td>
                    <span className="badge-year">Year {student.year}</span>
                  </td>
                  <td>
                    <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                      <button
                        className="btn btn-sm btn-edit"
                        onClick={() => onEditStudent(student)}
                        title="Edit Student Record"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDeleteStudent(student)}
                        title="Delete Student Record"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default StudentList;

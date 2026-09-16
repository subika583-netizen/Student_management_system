import React from 'react';
import './Dashboard.css';

/**
 * Dashboard Component
 * Displays student count metric card, system status, quick action buttons,
 * and recent students overview.
 */
function Dashboard({ students = [], onNavigate }) {
  const totalStudents = students.length;

  // Calculate department distribution for overview
  const departmentCounts = students.reduce((acc, student) => {
    const dept = student.department || 'Unassigned';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {});

  const totalDepartments = Object.keys(departmentCounts).length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Academic Operations Dashboard</h2>
          <p>Real-time overview of student enrollment and database records</p>
        </div>
        <div>
          <button
            className="btn btn-primary"
            onClick={() => onNavigate('add')}
          >
            + Add New Student
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon-wrapper">🎓</div>
          <div className="stat-info-wrapper">
            <span className="stat-label">Total Enrolled Students</span>
            <div className="stat-number">{totalStudents}</div>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon-wrapper">🏛️</div>
          <div className="stat-info-wrapper">
            <span className="stat-label">Active Departments</span>
            <div className="stat-number">{totalDepartments}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper">⚡</div>
          <div className="stat-info-wrapper">
            <span className="stat-label">Database Status</span>
            <div className="stat-number" style={{ fontSize: '20px', color: '#16a34a' }}>
              SQLite Online
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panel */}
      <div className="quick-actions-card">
        <h3>Quick Navigation</h3>
        <div className="action-buttons-group">
          <button
            className="btn btn-primary"
            onClick={() => onNavigate('add')}
          >
            Register Student (Add Form)
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => onNavigate('list')}
          >
            Browse Student Directory ({totalStudents})
          </button>
        </div>
      </div>

      {/* Recently Added Students */}
      <div className="recent-students-card">
        <div className="recent-header">
          <h3>Recently Registered Students</h3>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('list')}
          >
            View All
          </button>
        </div>

        {students.length === 0 ? (
          <div className="empty-state">
            <p>No students enrolled yet. Click "Add New Student" to get started.</p>
          </div>
        ) : (
          <div className="simple-list">
            {students.slice(0, 5).map((student) => (
              <div key={student.student_id} className="simple-list-item">
                <div>
                  <span className="student-meta-id">{student.student_id}</span>
                  <strong>{student.name}</strong>
                  <span className="student-meta-dept"> — {student.department} (Year {student.year})</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                    {student.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

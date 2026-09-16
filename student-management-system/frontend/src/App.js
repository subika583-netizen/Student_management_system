import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import AddStudentForm from './components/AddStudentForm';
import StudentList from './components/StudentList';
import EditStudentForm from './components/EditStudentForm';
import DeleteConfirmationModal from './components/DeleteConfirmationModal';
import studentApi from './services/api';
import './App.css';

/**
 * Main Application Component for the Student Management System
 * College CRUD Project Submission
 */
function App() {
  // Navigation state: 'dashboard' | 'add' | 'list' | 'edit'
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Student dataset state
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Modals & Selected Student States
  const [editingStudent, setEditingStudent] = useState(null);
  const [deletingStudent, setDeletingStudent] = useState(null);

  // Global feedback notification
  const [notification, setNotification] = useState(null);

  // Show notification helper with auto-dismiss
  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  // Fetch all students from the Django backend API
  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await studentApi.getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (err) {
      showNotification('danger', err.message || 'Failed to connect to backend server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Handler: Student Added
  const handleStudentAdded = (newStudent) => {
    showNotification('success', `Student "${newStudent.name}" (${newStudent.student_id}) was successfully registered.`);
    fetchStudents();
    setCurrentView('list');
  };

  // Handler: Edit Clicked
  const handleStartEdit = (student) => {
    setEditingStudent(student);
    setCurrentView('edit');
  };

  // Handler: Student Updated
  const handleStudentUpdated = (updatedStudent) => {
    showNotification('success', `Student record for "${updatedStudent.name}" updated successfully.`);
    setEditingStudent(null);
    fetchStudents();
    setCurrentView('list');
  };

  // Handler: Delete Clicked
  const handleStartDelete = (student) => {
    setDeletingStudent(student);
  };

  // Handler: Student Deleted
  const handleConfirmDelete = (deletedStudent) => {
    showNotification('success', `Student "${deletedStudent.name}" (${deletedStudent.student_id}) has been removed.`);
    setDeletingStudent(null);
    fetchStudents();
  };

  return (
    <div className="app-container">
      {/* Top Navigation Bar */}
      <header className="navbar">
        <div className="navbar-inner">
          <div className="navbar-brand" onClick={() => setCurrentView('dashboard')}>
            <div className="brand-icon">🎓</div>
            <div className="brand-text">
              <h1>Student Management System</h1>
              <p>Django REST & React CRUD Architecture</p>
            </div>
          </div>

          <nav>
            <ul className="nav-links">
              <li>
                <button
                  className={`nav-btn ${currentView === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setCurrentView('dashboard')}
                >
                  Dashboard
                </button>
              </li>
              <li>
                <button
                  className={`nav-btn ${currentView === 'add' ? 'active' : ''}`}
                  onClick={() => setCurrentView('add')}
                >
                  Add Student
                </button>
              </li>
              <li>
                <button
                  className={`nav-btn ${currentView === 'list' || currentView === 'edit' ? 'active' : ''}`}
                  onClick={() => {
                    setEditingStudent(null);
                    setCurrentView('list');
                  }}
                >
                  View Students ({students.length})
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Global Toast Alert */}
        {notification && (
          <div className={`alert-banner alert-${notification.type}`}>
            <span>{notification.message}</span>
            <button
              className="alert-close-btn"
              onClick={() => setNotification(null)}
            >
              ×
            </button>
          </div>
        )}

        {/* View Router */}
        {currentView === 'dashboard' && (
          <Dashboard
            students={students}
            onNavigate={(view) => setCurrentView(view)}
          />
        )}

        {currentView === 'add' && (
          <AddStudentForm
            onStudentAdded={handleStudentAdded}
            onCancel={() => setCurrentView('list')}
          />
        )}

        {currentView === 'list' && (
          <StudentList
            students={students}
            isLoading={isLoading}
            onEditStudent={handleStartEdit}
            onDeleteStudent={handleStartDelete}
            onAddNew={() => setCurrentView('add')}
          />
        )}

        {currentView === 'edit' && editingStudent && (
          <EditStudentForm
            student={editingStudent}
            onStudentUpdated={handleStudentUpdated}
            onCancel={() => {
              setEditingStudent(null);
              setCurrentView('list');
            }}
          />
        )}

        {/* Delete Confirmation Modal */}
        {deletingStudent && (
          <DeleteConfirmationModal
            student={deletingStudent}
            onConfirmDelete={handleConfirmDelete}
            onCancel={() => setDeletingStudent(null)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Student Management System &bull; Full-Stack College CRUD Project Submission &bull; Django REST Framework &amp; React
        </p>
      </footer>
    </div>
  );
}

export default App;

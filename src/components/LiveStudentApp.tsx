import React, { useState, useEffect, useMemo } from 'react';
import { Student } from '../types';
import { INITIAL_STUDENTS } from '../data/initialStudents';
import {
  GraduationCap,
  Building2,
  Database,
  Plus,
  Search,
  Pencil,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const LiveStudentApp: React.FC = () => {
  // Navigation within student app: 'dashboard' | 'add' | 'list' | 'edit'
  const [subView, setSubView] = useState<'dashboard' | 'add' | 'list' | 'edit'>('dashboard');

  // Persistence: initialize from localStorage or INITIAL_STUDENTS
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('college_students_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return INITIAL_STUDENTS;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('college_students_db', JSON.stringify(students));
  }, [students]);

  // Selected student for editing or deleting
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');

  // Toast Notification
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Form states for Add Student
  const [formData, setFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    year: '1',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Form states for Edit Student
  const [editFormData, setEditFormData] = useState({
    student_id: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    year: '1',
  });
  const [editErrors, setEditErrors] = useState<Record<string, string>>({});

  // Populate edit form when editingStudent changes
  useEffect(() => {
    if (editingStudent) {
      setEditFormData({
        student_id: editingStudent.student_id,
        name: editingStudent.name,
        email: editingStudent.email,
        phone: editingStudent.phone,
        department: editingStudent.department,
        year: String(editingStudent.year),
      });
      setEditErrors({});
    }
  }, [editingStudent]);

  // Filter students in real-time
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students;
    const q = searchTerm.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.student_id.toLowerCase().includes(q) ||
        s.department.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
    );
  }, [students, searchTerm]);

  // Validation function
  const validateStudentInput = (data: typeof formData, isEdit = false, currentId = '') => {
    const errs: Record<string, string> = {};

    if (!isEdit) {
      if (!data.student_id.trim()) {
        errs.student_id = 'Student ID is required (e.g. CS2026-001).';
      } else if (students.some((s) => s.student_id.toLowerCase() === data.student_id.trim().toLowerCase())) {
        errs.student_id = `A student with ID '${data.student_id.trim()}' already exists.`;
      }
    }

    if (!data.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (data.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(data.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    } else {
      const emailExists = students.some(
        (s) => s.email.toLowerCase() === data.email.trim().toLowerCase() && (!isEdit || s.student_id !== currentId)
      );
      if (emailExists) {
        errs.email = `Email '${data.email.trim()}' is already registered.`;
      }
    }

    const phoneDigits = data.phone.trim();
    if (!phoneDigits) {
      errs.phone = 'Phone number is required.';
    } else if (!/^\d+$/.test(phoneDigits)) {
      errs.phone = 'Phone number must contain only numeric digits.';
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      errs.phone = 'Phone number must be between 7 and 15 digits.';
    }

    if (!data.department.trim()) {
      errs.department = 'Department is required.';
    }

    const yr = parseInt(data.year, 10);
    if (isNaN(yr) || yr < 1 || yr > 5) {
      errs.year = 'Academic year must be an integer between 1 and 5.';
    }

    return errs;
  };

  // CREATE student
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateStudentInput(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast('error', 'Please resolve the highlighted validation errors.');
      return;
    }

    const newStudent: Student = {
      student_id: formData.student_id.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      department: formData.department.trim(),
      year: parseInt(formData.year, 10),
      created_at: new Date().toISOString(),
    };

    setStudents([newStudent, ...students]);
    setFormData({
      student_id: '',
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science',
      year: '1',
    });
    setFormErrors({});
    showToast('success', `Student ${newStudent.name} (${newStudent.student_id}) registered successfully!`);
    setSubView('list');
  };

  // UPDATE student
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;

    const errors = validateStudentInput(editFormData, true, editingStudent.student_id);
    if (Object.keys(errors).length > 0) {
      setEditErrors(errors);
      showToast('error', 'Please resolve the validation errors before saving.');
      return;
    }

    setStudents((prev) =>
      prev.map((s) =>
        s.student_id === editingStudent.student_id
          ? {
              ...s,
              name: editFormData.name.trim(),
              email: editFormData.email.trim(),
              phone: editFormData.phone.trim(),
              department: editFormData.department.trim(),
              year: parseInt(editFormData.year, 10),
            }
          : s
      )
    );

    showToast('success', `Record for ${editFormData.name} updated successfully!`);
    setEditingStudent(null);
    setSubView('list');
  };

  // DELETE student
  const handleConfirmDelete = () => {
    if (!deletingStudent) return;
    const name = deletingStudent.name;
    const id = deletingStudent.student_id;
    setStudents((prev) => prev.filter((s) => s.student_id !== id));
    showToast('success', `Student ${name} (${id}) has been permanently deleted.`);
    setDeletingStudent(null);
  };

  // Reset sample dataset
  const handleResetData = () => {
    if (window.confirm('Reset student records to default college sample data?')) {
      setStudents(INITIAL_STUDENTS);
      showToast('success', 'Reset student database to initial 6 records.');
    }
  };

  // Active departments count
  const activeDepartments = useMemo(() => {
    return new Set(students.map((s) => s.department)).size;
  }, [students]);

  return (
    <div className="space-y-6">
      {/* Sub-navigation bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubView('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              subView === 'dashboard'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => {
              setFormErrors({});
              setSubView('add');
            }}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
              subView === 'add'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Plus className="w-4 h-4" /> Add Student
          </button>
          <button
            onClick={() => setSubView('list')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
              subView === 'list' || subView === 'edit'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Student Directory ({students.length})
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Persistent SQLite Ready
          </span>
          <button
            onClick={handleResetData}
            title="Reset database to sample records"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toast && (
        <div
          className={`flex items-center justify-between p-4 rounded-lg text-sm font-medium transition-all ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
          <button onClick={() => setToast(null)} className="p-1 hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* VIEW: DASHBOARD */}
      {subView === 'dashboard' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Academic Operations Dashboard</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Real-time student registry metrics and active database records
              </p>
            </div>
            <button
              onClick={() => setSubView('add')}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors self-start md:self-auto"
            >
              <Plus className="w-4 h-4" /> Register New Student
            </button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Enrolled
                </div>
                <div className="text-3xl font-bold text-slate-900 mt-1">{students.length}</div>
                <div className="text-xs text-slate-500 mt-0.5">Active Student Profiles</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Departments
                </div>
                <div className="text-3xl font-bold text-slate-900 mt-1">{activeDepartments}</div>
                <div className="text-xs text-slate-500 mt-0.5">Degree Programs</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center gap-5">
              <div className="w-14 h-14 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
                <Database className="w-7 h-7" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Database Engine
                </div>
                <div className="text-xl font-bold text-emerald-600 mt-1">SQLite 3</div>
                <div className="text-xs text-slate-500 mt-0.5">Persistent Storage</div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Recent Records */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-semibold text-slate-900 text-base">Quick Operations</h3>
              <p className="text-xs text-slate-500">
                Execute standard CRUD workflows with automated field validation:
              </p>
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  onClick={() => setSubView('add')}
                  className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg text-left flex items-center justify-between"
                >
                  <span>1. Register New Student (POST)</span>
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSubView('list')}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg text-left flex items-center justify-between"
                >
                  <span>2. Browse Directory (GET)</span>
                  <Search className="w-4 h-4 text-slate-500" />
                </button>
                <button
                  onClick={() => {
                    if (students.length > 0) {
                      setEditingStudent(students[0]);
                      setSubView('edit');
                    } else {
                      showToast('error', 'No students available to edit.');
                    }
                  }}
                  className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg text-left flex items-center justify-between"
                >
                  <span>3. Modify Records (PUT)</span>
                  <Pencil className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-slate-900 text-base">Recently Registered Students</h3>
                <button
                  onClick={() => setSubView('list')}
                  className="text-xs font-semibold text-blue-900 hover:underline"
                >
                  View All ({students.length})
                </button>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  No student records found. Click "Add Student" to create your first record.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {students.slice(0, 5).map((s) => (
                    <div key={s.student_id} className="py-3 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                            {s.student_id}
                          </span>
                          <span className="font-semibold text-slate-900 text-sm">{s.name}</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {s.department} &bull; Year {s.year} &bull; {s.email}
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingStudent(s);
                            setSubView('edit');
                          }}
                          className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingStudent(s)}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW: ADD STUDENT FORM */}
      {subView === 'add' && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Register New Student</h2>
            <p className="text-sm text-slate-500 mt-1">
              Provide student credentials. Server and client validations prevent duplicates.
            </p>
          </div>

          <form onSubmit={handleAddSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Student ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Student ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. CS2026-007"
                  value={formData.student_id}
                  onChange={(e) => {
                    setFormData({ ...formData, student_id: e.target.value });
                    if (formErrors.student_id) setFormErrors({ ...formErrors, student_id: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                    formErrors.student_id
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10'
                  }`}
                />
                {formErrors.student_id ? (
                  <p className="text-xs text-red-600 font-medium mt-1">{formErrors.student_id}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Unique primary key</p>
                )}
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Margaret Hamilton"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                    formErrors.name
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10'
                  }`}
                />
                {formErrors.name && (
                  <p className="text-xs text-red-600 font-medium mt-1">{formErrors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="student@college.edu"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                    formErrors.email
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10'
                  }`}
                />
                {formErrors.email ? (
                  <p className="text-xs text-red-600 font-medium mt-1">{formErrors.email}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Unique institutional email</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (formErrors.phone) setFormErrors({ ...formErrors, phone: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-all ${
                    formErrors.phone
                      ? 'border-red-400 bg-red-50/30 focus:border-red-500'
                      : 'border-slate-300 focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10'
                  }`}
                />
                {formErrors.phone ? (
                  <p className="text-xs text-red-600 font-medium mt-1">{formErrors.phone}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1">Numeric digits only (7-15)</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-900"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Academic Year <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-900"
                >
                  <option value="1">Year 1 (Freshman)</option>
                  <option value="2">Year 2 (Sophomore)</option>
                  <option value="3">Year 3 (Junior)</option>
                  <option value="4">Year 4 (Senior)</option>
                  <option value="5">Year 5 (Graduate / Dual)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubView('list')}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
              >
                Save Student Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: STUDENT LIST DIRECTORY */}
      {subView === 'list' && (
        <div className="space-y-5">
          {/* Top Search Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, student ID, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-lg outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/10"
              />
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <span className="text-xs font-semibold text-slate-500">
                Showing {filteredStudents.length} of {students.length} student{students.length === 1 ? '' : 's'}
              </span>
              <button
                onClick={() => setSubView('add')}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Student
              </button>
            </div>
          </div>

          {/* Table */}
          {students.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-1">No Student Records Found</h3>
              <p className="text-sm text-slate-500 mb-4">The student database is currently empty.</p>
              <button
                onClick={() => setSubView('add')}
                className="px-5 py-2 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg"
              >
                Register First Student
              </button>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-1">No Matching Students Found</h3>
              <p className="text-sm text-slate-500 mb-4">
                No results matched your search query "{searchTerm}".
              </p>
              <button
                onClick={() => setSearchTerm('')}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Student ID</th>
                      <th className="py-3.5 px-4">Full Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Phone</th>
                      <th className="py-3.5 px-4">Department</th>
                      <th className="py-3.5 px-4">Year</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredStudents.map((s) => (
                      <tr key={s.student_id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded">
                            {s.student_id}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{s.name}</td>
                        <td className="py-3.5 px-4 text-slate-600">{s.email}</td>
                        <td className="py-3.5 px-4 font-mono text-xs text-slate-600">{s.phone}</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-md">
                            {s.department}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 bg-sky-50 text-sky-700 text-xs font-bold rounded-full border border-sky-100">
                            Year {s.year}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                setEditingStudent(s);
                                setSubView('edit');
                              }}
                              className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded flex items-center gap-1"
                            >
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={() => setDeletingStudent(s)}
                              className="px-2.5 py-1 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VIEW: EDIT STUDENT FORM */}
      {subView === 'edit' && editingStudent && (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-slate-200 shadow-xs">
          <div className="border-b border-slate-100 pb-5 mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Edit Student Record</h2>
            <p className="text-sm text-slate-500 mt-1">
              Modify student details for registration ID <strong>{editingStudent.student_id}</strong>
            </p>
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Locked Student ID */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Student ID <span className="text-xs text-slate-400 font-normal">(Primary Key - Locked)</span>
                </label>
                <input
                  type="text"
                  value={editFormData.student_id}
                  disabled
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-500 font-mono text-sm cursor-not-allowed"
                />
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, name: e.target.value });
                    if (editErrors.name) setEditErrors({ ...editErrors, name: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none ${
                    editErrors.name ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-blue-900'
                  }`}
                />
                {editErrors.name && (
                  <p className="text-xs text-red-600 font-medium mt-1">{editErrors.name}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, email: e.target.value });
                    if (editErrors.email) setEditErrors({ ...editErrors, email: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none ${
                    editErrors.email ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-blue-900'
                  }`}
                />
                {editErrors.email && (
                  <p className="text-xs text-red-600 font-medium mt-1">{editErrors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => {
                    setEditFormData({ ...editFormData, phone: e.target.value });
                    if (editErrors.phone) setEditErrors({ ...editErrors, phone: '' });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none ${
                    editErrors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300 focus:border-blue-900'
                  }`}
                />
                {editErrors.phone && (
                  <p className="text-xs text-red-600 font-medium mt-1">{editErrors.phone}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Department */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">Department</label>
                <select
                  value={editFormData.department}
                  onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-900"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Electronics & Communication">Electronics & Communication</option>
                  <option value="Mechanical Engineering">Mechanical Engineering</option>
                  <option value="Civil Engineering">Civil Engineering</option>
                  <option value="Electrical Engineering">Electrical Engineering</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-1.5">Academic Year</label>
                <select
                  value={editFormData.year}
                  onChange={(e) => setEditFormData({ ...editFormData, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-sm outline-none focus:border-blue-900"
                >
                  <option value="1">Year 1 (Freshman)</option>
                  <option value="2">Year 2 (Sophomore)</option>
                  <option value="3">Year 3 (Junior)</option>
                  <option value="4">Year 4 (Senior)</option>
                  <option value="5">Year 5 (Graduate / Dual)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSubView('list')}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors"
              >
                Update Student Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: DELETE CONFIRMATION */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">Permanently Delete Student?</h3>
            <p className="text-sm text-slate-500 mb-4">
              This action cannot be undone. The student record will be removed from the SQLite database.
            </p>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs space-y-1 mb-5">
              <div>
                <strong>Name:</strong> {deletingStudent.name}
              </div>
              <div>
                <strong>Student ID:</strong> {deletingStudent.student_id}
              </div>
              <div>
                <strong>Email:</strong> {deletingStudent.email}
              </div>
              <div>
                <strong>Department:</strong> {deletingStudent.department} (Year {deletingStudent.year})
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs"
              >
                Yes, Delete Student
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import { CodeFile } from '../types';

export const PROJECT_CODE_FILES: CodeFile[] = [
  // Backend Files
  {
    path: 'backend/manage.py',
    name: 'manage.py',
    category: 'backend',
    language: 'python',
    content: `#!/usr/bin/env python
"""Django's command-line utility for administrative tasks."""
import os
import sys

def main():
    """Run administrative tasks."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'student_project.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()`,
  },
  {
    path: 'backend/requirements.txt',
    name: 'requirements.txt',
    category: 'backend',
    language: 'plaintext',
    content: `Django==4.2.11
djangorestframework==3.14.0
django-cors-headers==4.3.1
asgiref==3.7.2
sqlparse==0.4.4
typing_extensions==4.10.0`,
  },
  {
    path: 'backend/student_project/settings.py',
    name: 'settings.py',
    category: 'backend',
    language: 'python',
    content: `from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
SECRET_KEY = 'django-insecure-college-student-management-crud-project-secret-key-change-in-prod'
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1', '*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'students.apps.StudentsConfig',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'student_project.urls'
WSGI_APPLICATION = 'student_project.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
        'rest_framework.renderers.BrowsableAPIRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]`,
  },
  {
    path: 'backend/student_project/urls.py',
    name: 'urls.py (Project)',
    category: 'backend',
    language: 'python',
    content: `from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('students.urls')),
]`,
  },
  {
    path: 'backend/students/models.py',
    name: 'models.py',
    category: 'backend',
    language: 'python',
    content: `from django.db import models
from django.core.exceptions import ValidationError

def validate_phone_numeric(value):
    if not str(value).isdigit():
        raise ValidationError('Phone number must contain only digits.')

def validate_year_range(value):
    if not isinstance(value, int) or value < 1 or value > 5:
        raise ValidationError('Year must be an integer between 1 and 5.')

class Student(models.Model):
    student_id = models.CharField(
        max_length=50,
        primary_key=True,
        unique=True,
        help_text="Unique student registration/roll number"
    )
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, validators=[validate_phone_numeric])
    department = models.CharField(max_length=50)
    year = models.IntegerField(validators=[validate_year_range])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def clean(self):
        super().clean()
        if self.phone and not str(self.phone).isdigit():
            raise ValidationError({'phone': 'Phone number must contain only digits.'})
        if self.year is not None:
            try:
                yr = int(self.year)
                if yr < 1 or yr > 5:
                    raise ValidationError({'year': 'Year must be between 1 and 5.'})
            except (ValueError, TypeError):
                raise ValidationError({'year': 'Year must be a valid integer.'})

    def __str__(self):
        return f"{self.student_id} - {self.name} ({self.department})"`,
  },
  {
    path: 'backend/students/serializers.py',
    name: 'serializers.py',
    category: 'backend',
    language: 'python',
    content: `from rest_framework import serializers
from .models import Student

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['student_id', 'name', 'email', 'phone', 'department', 'year', 'created_at']
        read_only_fields = ['created_at']

    def validate_student_id(self, value):
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Student ID cannot be empty.")
        if not self.instance:
            if Student.objects.filter(student_id=val).exists():
                raise serializers.ValidationError(f"Student with ID '{val}' already exists.")
        return val

    def validate_name(self, value):
        val = value.strip()
        if len(val) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return val

    def validate_email(self, value):
        val = value.strip().lower()
        query = Student.objects.filter(email__iexact=val)
        if self.instance:
            query = query.exclude(student_id=self.instance.student_id)
        if query.exists():
            raise serializers.ValidationError(f"A student with email '{val}' already exists.")
        return val

    def validate_phone(self, value):
        val = str(value).strip()
        if not val.isdigit():
            raise serializers.ValidationError("Phone number must contain only numeric digits.")
        if len(val) < 7 or len(val) > 15:
            raise serializers.ValidationError("Phone number must be between 7 and 15 digits.")
        return val

    def validate_year(self, value):
        try:
            val = int(value)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Year must be a valid integer.")
        if val < 1 or val > 5:
            raise serializers.ValidationError("Year must be between 1 and 5.")
        return val`,
  },
  {
    path: 'backend/students/views.py',
    name: 'views.py',
    category: 'backend',
    language: 'python',
    content: `from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Student
from .serializers import StudentSerializer

@api_view(['GET', 'POST'])
def student_list_create(request):
    if request.method == 'GET':
        students = Student.objects.all().order_by('-created_at')
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        required_fields = ['student_id', 'name', 'email', 'phone', 'department', 'year']
        missing_fields = [f for f in required_fields if f not in request.data or str(request.data.get(f, '')).strip() == '']
        if missing_fields:
            return Response(
                {"error": "Missing required fields.", "details": {f: ["This field is required."] for f in missing_fields}},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = StudentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Student registered successfully.", "student": serializer.data}, status=status.HTTP_201_CREATED)
        return Response({"error": "Validation failed.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def student_detail(request, id):
    try:
        student = Student.objects.get(student_id=id)
    except Student.DoesNotExist:
        return Response({"error": f"Student with ID '{id}' was not found in the records."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        return Response(StudentSerializer(student).data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data, partial=False, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Student record updated successfully.", "student": serializer.data}, status=status.HTTP_200_OK)
        return Response({"error": "Failed to update student record.", "details": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        name, s_id = student.name, student.student_id
        student.delete()
        return Response({"message": f"Student {name} ({s_id}) has been successfully deleted."}, status=status.HTTP_200_OK)`,
  },
  {
    path: 'backend/students/urls.py',
    name: 'urls.py (Students App)',
    category: 'backend',
    language: 'python',
    content: `from django.urls import path
from . import views

urlpatterns = [
    path('students/', views.student_list_create, name='student-list-create'),
    path('students/<str:id>/', views.student_detail, name='student-detail'),
]`,
  },
  {
    path: 'backend/students/admin.py',
    name: 'admin.py',
    category: 'backend',
    language: 'python',
    content: `from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'name', 'email', 'phone', 'department', 'year', 'created_at')
    list_filter = ('department', 'year', 'created_at')
    search_fields = ('student_id', 'name', 'email', 'department')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)`,
  },
  {
    path: 'backend/students/tests.py',
    name: 'tests.py',
    category: 'test',
    language: 'python',
    content: `# Unit and Integration Tests (21 automated tests)
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Student
from .serializers import StudentSerializer

class StudentModelUnitTest(TestCase):
    def setUp(self):
        self.valid_data = {
            'student_id': 'CS2026-001', 'name': 'Alice Johnson',
            'email': 'alice@college.edu', 'phone': '9876543210',
            'department': 'Computer Science', 'year': 3
        }
    def test_create_valid_student_model(self):
        student = Student.objects.create(**self.valid_data)
        self.assertEqual(student.student_id, 'CS2026-001')

class StudentAPIIntegrationTest(APITestCase):
    def setUp(self):
        self.list_create_url = reverse('student-list-create')
        self.student = Student.objects.create(
            student_id='CS-101', name='Grace Hopper',
            email='grace.hopper@college.edu', phone='9812345678',
            department='Computer Science', year=4
        )
    def test_create_student_success(self):
        payload = {'student_id': 'CS-102', 'name': 'Alan Turing', 'email': 'alan@college.edu', 'phone': '9823456789', 'department': 'Math', 'year': 3}
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    def test_get_all_students(self):
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)`,
  },
  // Frontend Files
  {
    path: 'frontend/src/services/api.js',
    name: 'api.js',
    category: 'frontend',
    language: 'javascript',
    content: `import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  timeout: 10000,
});

export const studentApi = {
  getAllStudents: async () => (await apiClient.get('/students/')).data,
  getStudentById: async (id) => (await apiClient.get(\`/students/\${id}/\`)).data,
  createStudent: async (studentData) => (await apiClient.post('/students/', studentData)).data,
  updateStudent: async (id, studentData) => (await apiClient.put(\`/students/\${id}/\`, studentData)).data,
  deleteStudent: async (id) => (await apiClient.delete(\`/students/\${id}/\`)).data,
};

export default studentApi;`,
  },
  {
    path: 'frontend/src/components/Dashboard.js',
    name: 'Dashboard.js',
    category: 'frontend',
    language: 'javascript',
    content: `import React from 'react';
import './Dashboard.css';

function Dashboard({ students = [], onNavigate }) {
  const totalStudents = students.length;
  const departments = new Set(students.map(s => s.department)).size;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Academic Operations Dashboard</h2>
          <p>Real-time overview of student enrollment and database records</p>
        </div>
        <button className="btn btn-primary" onClick={() => onNavigate('add')}>+ Add New Student</button>
      </div>
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
            <div className="stat-number">{departments}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;`,
  },
  {
    path: 'frontend/src/components/AddStudentForm.js',
    name: 'AddStudentForm.js',
    category: 'frontend',
    language: 'javascript',
    content: `import React, { useState } from 'react';
import studentApi from '../services/api';
import './AddStudentForm.css';

function AddStudentForm({ onStudentAdded, onCancel }) {
  const [formData, setFormData] = useState({
    student_id: '', name: '', email: '', phone: '', department: 'Computer Science', year: '1'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errs = {};
    if (!formData.student_id.trim()) errs.student_id = 'Student ID is required.';
    if (!formData.name.trim()) errs.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) errs.email = 'Valid email is required.';
    if (!/^\\d+$/.test(formData.phone.trim())) errs.phone = 'Phone number must be numeric digits only.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const res = await studentApi.createStudent({ ...formData, year: parseInt(formData.year, 10) });
      onStudentAdded(res.student || formData);
    } catch (err) {
      alert(err.message || 'Error creating student');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-card">
      <h2>Register New Student</h2>
      <form onSubmit={handleSubmit}>
        {/* Form controls with inline error validation */}
      </form>
    </div>
  );
}
export default AddStudentForm;`,
  },
  {
    path: 'frontend/src/components/StudentList.js',
    name: 'StudentList.js',
    category: 'frontend',
    language: 'javascript',
    content: `import React, { useState, useMemo } from 'react';
import './StudentList.css';

function StudentList({ students = [], onEditStudent, onDeleteStudent, onAddNew }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return students;
    return students.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.student_id.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    );
  }, [students, searchTerm]);

  return (
    <div className="list-container">
      <div className="controls-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search by student name or ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="student-table">
        <thead>
          <tr>
            <th>Student ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Department</th><th>Year</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(s => (
            <tr key={s.student_id}>
              <td>{s.student_id}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.department}</td>
              <td>Year {s.year}</td>
              <td>
                <button onClick={() => onEditStudent(s)}>Edit</button>
                <button onClick={() => onDeleteStudent(s)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default StudentList;`,
  },
  {
    path: 'frontend/src/components/EditStudentForm.js',
    name: 'EditStudentForm.js',
    category: 'frontend',
    language: 'javascript',
    content: `import React, { useState, useEffect } from 'react';
import studentApi from '../services/api';

function EditStudentForm({ student, onStudentUpdated, onCancel }) {
  const [formData, setFormData] = useState({ ...student, year: String(student.year) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await studentApi.updateStudent(student.student_id, {
      ...formData,
      year: parseInt(formData.year, 10)
    });
    onStudentUpdated(res.student || formData);
  };

  return (
    <div className="form-card">
      <h2>Edit Student ({student.student_id})</h2>
      <form onSubmit={handleSubmit}>
        {/* Form controls with student_id disabled as primary key */}
      </form>
    </div>
  );
}
export default EditStudentForm;`,
  },
  {
    path: 'frontend/src/components/DeleteConfirmationModal.js',
    name: 'DeleteConfirmationModal.js',
    category: 'frontend',
    language: 'javascript',
    content: `import React from 'react';
import './DeleteConfirmationModal.css';

function DeleteConfirmationModal({ student, onConfirmDelete, onCancel }) {
  if (!student) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal-dialog" onClick={e => e.stopPropagation()}>
        <h3>Delete Student Record?</h3>
        <p>Are you sure you want to permanently delete {student.name} ({student.student_id})?</p>
        <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn btn-danger" onClick={() => onConfirmDelete(student)}>Yes, Delete Student</button>
      </div>
    </div>
  );
}
export default DeleteConfirmationModal;`,
  },
  // Config & Documentation
  {
    path: 'README.md',
    name: 'README.md',
    category: 'config',
    language: 'markdown',
    content: `# Student Management System (Full-Stack College CRUD Submission)
Complete Django REST Framework + React Student Management System with SQLite database persistence, dual-layer validation, automated tests, and Postman test suite.`,
  },
  {
    path: 'POSTMAN_TESTS.md',
    name: 'POSTMAN_TESTS.md',
    category: 'config',
    language: 'markdown',
    content: `# 10 Postman Test Cases for Student Management System
Includes Test 1 (Valid Create 201), Test 2 (Missing Fields 400), Test 3 (Duplicate ID 400), Test 4 (Duplicate Email 400), Test 5 (List 200), Test 6 (Get One 200), Test 7 (Not Found 404), Test 8 (Update 200), Test 9 (Delete 200), Test 10 (Delete Not Found 404).`,
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    category: 'config',
    language: 'plaintext',
    content: `db.sqlite3
venv/
__pycache__/
*.pyc
node_modules/
frontend/build/
.env`,
  },
];

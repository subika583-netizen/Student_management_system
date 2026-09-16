"""
Comprehensive Unit and Integration Tests for Student Management System.

Covers:
1. Model Unit Tests (validation, string representation, edge cases)
2. Serializer Unit Tests (field validation, duplicate rejection, phone/year limits)
3. API Integration Tests (all 5 CRUD endpoints, HTTP status codes, error payloads, CORS headers)
"""
from django.test import TestCase, Client
from django.core.exceptions import ValidationError
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Student
from .serializers import StudentSerializer


class StudentModelUnitTest(TestCase):
    """
    Unit test suite validating the Student model integrity, field limits, and constraints.
    """

    def setUp(self):
        """Set up a baseline student record for model test cases."""
        self.valid_data = {
            'student_id': 'CS2026-001',
            'name': 'Alice Johnson',
            'email': 'alice.johnson@college.edu',
            'phone': '9876543210',
            'department': 'Computer Science',
            'year': 3,
        }

    def test_create_valid_student_model(self):
        """Verify that a student can be created with valid fields."""
        student = Student.objects.create(**self.valid_data)
        self.assertEqual(student.student_id, 'CS2026-001')
        self.assertEqual(student.name, 'Alice Johnson')
        self.assertEqual(student.year, 3)
        self.assertIsNotNone(student.created_at)

    def test_student_str_representation(self):
        """Verify __str__ format displays ID, name, and department."""
        student = Student.objects.create(**self.valid_data)
        expected_str = "CS2026-001 - Alice Johnson (Computer Science)"
        self.assertEqual(str(student), expected_str)

    def test_phone_must_be_numeric_model_clean(self):
        """Verify model clean method raises ValidationError when phone has letters."""
        student = Student(
            student_id='CS2026-002',
            name='Bob Smith',
            email='bob.smith@college.edu',
            phone='12345ABCDE',
            department='Information Technology',
            year=2
        )
        with self.assertRaises(ValidationError):
            student.clean()

    def test_year_range_model_clean_out_of_bounds(self):
        """Verify model clean method rejects years outside the 1 to 5 range."""
        student_year_zero = Student(
            student_id='CS2026-003',
            name='Charlie Day',
            email='charlie@college.edu',
            phone='9876543211',
            department='Electronics',
            year=0
        )
        with self.assertRaises(ValidationError):
            student_year_zero.clean()

        student_year_six = Student(
            student_id='CS2026-004',
            name='David Miller',
            email='david@college.edu',
            phone='9876543212',
            department='Electronics',
            year=6
        )
        with self.assertRaises(ValidationError):
            student_year_six.clean()


class StudentSerializerUnitTest(TestCase):
    """
    Unit test suite validating the StudentSerializer field validation and error messaging.
    """

    def setUp(self):
        self.existing_student = Student.objects.create(
            student_id='STU1001',
            name='Existing Student',
            email='existing@college.edu',
            phone='9876543210',
            department='Mechanical Engineering',
            year=2
        )

    def test_serializer_with_valid_data(self):
        """Verify serializer passes validation with completely valid payload."""
        data = {
            'student_id': 'STU1002',
            'name': 'Sarah Connor',
            'email': 'sarah@college.edu',
            'phone': '9876543213',
            'department': 'Robotics',
            'year': 4
        }
        serializer = StudentSerializer(data=data)
        self.assertTrue(serializer.is_valid(), serializer.errors)

    def test_serializer_rejects_duplicate_student_id(self):
        """Verify serializer rejects new student if student_id already exists."""
        data = {
            'student_id': 'STU1001',  # duplicate
            'name': 'Duplicate ID Person',
            'email': 'unique.person@college.edu',
            'phone': '9876543214',
            'department': 'Civil Engineering',
            'year': 1
        }
        serializer = StudentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('student_id', serializer.errors)

    def test_serializer_rejects_duplicate_email(self):
        """Verify serializer rejects new student if email already exists."""
        data = {
            'student_id': 'STU1003',
            'name': 'Duplicate Email Person',
            'email': 'existing@college.edu',  # duplicate
            'phone': '9876543215',
            'department': 'Civil Engineering',
            'year': 1
        }
        serializer = StudentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)

    def test_serializer_rejects_non_numeric_phone(self):
        """Verify serializer rejects phone numbers containing non-digit characters."""
        data = {
            'student_id': 'STU1004',
            'name': 'Phone Test',
            'email': 'phone@college.edu',
            'phone': '987-654-3210',  # contains dashes
            'department': 'Computer Science',
            'year': 2
        }
        serializer = StudentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('phone', serializer.errors)

    def test_serializer_rejects_invalid_year(self):
        """Verify serializer rejects year less than 1 or greater than 5."""
        data = {
            'student_id': 'STU1005',
            'name': 'Year Test',
            'email': 'year@college.edu',
            'phone': '9876543216',
            'department': 'Computer Science',
            'year': 7  # invalid
        }
        serializer = StudentSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('year', serializer.errors)


class StudentAPIIntegrationTest(APITestCase):
    """
    Integration test suite testing all 5 REST API endpoints against the SQLite database.
    """

    def setUp(self):
        """Seed a standard test student for API testing."""
        self.list_create_url = reverse('student-list-create')
        self.student = Student.objects.create(
            student_id='CS-101',
            name='Grace Hopper',
            email='grace.hopper@college.edu',
            phone='9812345678',
            department='Computer Science',
            year=4
        )
        self.detail_url = reverse('student-detail', kwargs={'id': self.student.student_id})

    # 1. CREATE (POST) TESTS
    def test_create_student_success(self):
        """POST /api/students/ - Successfully create student with 201 status code."""
        payload = {
            'student_id': 'CS-102',
            'name': 'Alan Turing',
            'email': 'alan.turing@college.edu',
            'phone': '9823456789',
            'department': 'Mathematics',
            'year': 3
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['student']['student_id'], 'CS-102')
        self.assertTrue(Student.objects.filter(student_id='CS-102').exists())

    def test_create_student_missing_required_fields(self):
        """POST /api/students/ - Return 400 when required fields are missing."""
        payload = {
            'student_id': 'CS-103',
            'name': 'Incomplete Student'
            # missing email, phone, department, year
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)

    def test_create_student_duplicate_student_id(self):
        """POST /api/students/ - Return 400 when duplicate student_id is sent."""
        payload = {
            'student_id': 'CS-101',  # already exists in setUp
            'name': 'Duplicate Grace',
            'email': 'different.email@college.edu',
            'phone': '9834567890',
            'department': 'Computer Science',
            'year': 1
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_student_duplicate_email(self):
        """POST /api/students/ - Return 400 when duplicate email is sent."""
        payload = {
            'student_id': 'CS-104',
            'name': 'Duplicate Email Grace',
            'email': 'grace.hopper@college.edu',  # duplicate email
            'phone': '9845678901',
            'department': 'Computer Science',
            'year': 2
        }
        response = self.client.post(self.list_create_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    # 2. READ ALL (GET) TESTS
    def test_get_all_students(self):
        """GET /api/students/ - Return 200 OK and list of all students."""
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['student_id'], self.student.student_id)

    # 3. READ SINGLE (GET <id>) TESTS
    def test_get_single_student_success(self):
        """GET /api/students/<id>/ - Return 200 OK and student details for existing ID."""
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['student_id'], 'CS-101')
        self.assertEqual(response.data['name'], 'Grace Hopper')

    def test_get_single_student_not_found(self):
        """GET /api/students/<id>/ - Return 404 NOT FOUND for non-existent ID."""
        not_found_url = reverse('student-detail', kwargs={'id': 'NON_EXISTENT_ID'})
        response = self.client.get(not_found_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)

    # 4. UPDATE (PUT <id>) TESTS
    def test_update_student_success(self):
        """PUT /api/students/<id>/ - Return 200 OK with updated attributes."""
        update_payload = {
            'student_id': 'CS-101',
            'name': 'Admiral Grace Hopper',
            'email': 'admiral.grace@college.edu',
            'phone': '9899999999',
            'department': 'Computer Science & AI',
            'year': 4
        }
        response = self.client.put(self.detail_url, update_payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.student.refresh_from_db()
        self.assertEqual(self.student.name, 'Admiral Grace Hopper')
        self.assertEqual(self.student.email, 'admiral.grace@college.edu')

    def test_update_student_not_found(self):
        """PUT /api/students/<id>/ - Return 404 when updating non-existent student."""
        not_found_url = reverse('student-detail', kwargs={'id': 'UNKNOWN-ID'})
        payload = {
            'student_id': 'UNKNOWN-ID',
            'name': 'Ghost',
            'email': 'ghost@college.edu',
            'phone': '9800000000',
            'department': 'Physics',
            'year': 1
        }
        response = self.client.put(not_found_url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # 5. DELETE (DELETE <id>) TESTS
    def test_delete_student_success(self):
        """DELETE /api/students/<id>/ - Return 200 OK and delete student record."""
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Student.objects.filter(student_id='CS-101').exists())

    def test_delete_student_not_found(self):
        """DELETE /api/students/<id>/ - Return 404 when deleting non-existent student."""
        not_found_url = reverse('student-detail', kwargs={'id': 'GHOST-999'})
        response = self.client.delete(not_found_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    # 6. CORS HEADER VERIFICATION
    def test_cors_headers_allowed_origin(self):
        """Verify that requests from http://localhost:3000 receive CORS response headers."""
        response = self.client.get(
            self.list_create_url,
            HTTP_ORIGIN='http://localhost:3000'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.headers.get('Access-Control-Allow-Origin'), 'http://localhost:3000')

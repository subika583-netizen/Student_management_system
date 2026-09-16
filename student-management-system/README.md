# Student Management System (Full-Stack CRUD Project)

A complete, production-ready Student Management System developed for academic college CRUD project submissions. Built with **Python Django + Django REST Framework** on the backend and **React** on the frontend, using **SQLite** for persistent zero-configuration database storage.

---

## 1. Project Title & Overview

The **Student Management System** is a full-stack web application designed to streamline student administration tasks in educational institutions. It provides a modern, responsive web interface for campus administrators and faculty to create, read, update, and delete student records with instant real-time search, robust dual-layer validation (client & server), automated unit/integration testing, and clear HTTP status code responses.

---

## 2. Problem Statement & Objectives

### Problem Statement
Traditional academic record keeping often relies on manual paperwork or disconnected spreadsheets. These legacy approaches result in:
- High risks of duplicate student IDs and emails.
- Inconsistent data formatting (e.g. invalid phone numbers or unrealistic year values).
- Difficult and slow manual record searching.
- Lack of data validation and centralized auditability.

### Objectives
1. **Automate Record Management**: Provide an intuitive web application to register, query, update, and remove student profiles.
2. **Enforce Strict Validation**: Ensure zero corruption of records using strict client-side checks and server-side Django REST Framework model validators.
3. **Prevent Duplication**: Enforce database-level unique constraints on `student_id` and `email`.
4. **Demonstrate Full CRUD Architecture**: Implement clean separation of concerns between React (presentation), Django REST Framework (API), and SQLite (relational persistence).
5. **Provide Academic Readiness**: Offer complete unit tests, integration tests, Postman documentation, and viva interview explanations.

---

## 3. Features List

- **Interactive Dashboard**:
  - Total student enrollment counter.
  - Department distribution metric cards.
  - System database connectivity status indicator.
  - Recent student registrations table.
- **Student Registration (Create)**:
  - Form capturing Student ID, Name, Email, Phone, Department, and Academic Year.
  - Real-time client-side inline validation (instant feedback).
  - Clear error reporting for duplicate IDs or emails.
- **Student Directory (Read)**:
  - Responsive tabular presentation of all student records.
  - Instant client-side search filtering by student name, ID, or department.
  - Sorting and empty-state guidance.
- **Record Modification (Update)**:
  - Pre-populated edit modal/form loaded via `GET /api/students/<id>/`.
  - Immutable primary key protection (`student_id` remains fixed).
  - Full attribute updates saved via `PUT /api/students/<id>/`.
- **Safe Record Deletion (Delete)**:
  - Confirmation modal warning before destructive operations.
  - Instant table refresh and success notifications.
- **Robust Security & Validation**:
  - Phone validation (numeric digits only).
  - Year validation (positive integers between 1 and 5).
  - Email format verification via standard regex.
  - Cross-Origin Resource Sharing (CORS) configured for React (`http://localhost:3000`).

---

## 4. Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend** | React | 18.2.0 | Single-page application UI component rendering |
| **Styling** | Modern CSS3 | Standard | Clean responsive grid, cards, and modal styling |
| **HTTP Client**| Axios | 1.6.8 | Asynchronous REST API requests |
| **Backend** | Python Django | 4.2.11 LTS | Server runtime and application framework |
| **REST API** | Django REST Framework (DRF) | 3.14.0 | Serializers, API views, and validation engine |
| **CORS** | django-cors-headers | 4.3.1 | Cross-Origin request headers for React server |
| **Database** | SQLite 3 | Embedded | Local persistent relational database file (`db.sqlite3`) |
| **Testing** | Django TestCase & APITestCase | Standard | Automated unit and integration test suite |
| **API Testing**| Postman | Latest | End-to-end endpoint validation and payload verification |
| **Version Control**| Git / GitHub | Standard | Codebase tracking and open-source submission |

---

## 5. System Architecture

```
[ Web Browser Client ]
          │
          │  React (Port 3000)
          ▼
   Axios HTTP Requests (JSON)
          │  GET / POST / PUT / DELETE
          ▼
[ Django Backend (Port 8000) ]
   ├── CORS Middleware (corsheaders)
   ├── URL Routing (urls.py)
   ├── API Views (@api_view in views.py)
   ├── Serializers (serializers.py - Validation)
   └── ORM Models (models.py - Business Logic)
          │
          ▼
[ SQLite Database (db.sqlite3) ]
```

---

## 6. Database Schema (Student Model)

The database schema is defined in `backend/students/models.py`:

| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `student_id` | `CharField(max_length=50)` | Primary Key, Unique, Not Null | Unique institutional roll/registration ID (e.g. `CS2026-001`) |
| `name` | `CharField(max_length=100)` | Not Null | Student's full legal name |
| `email` | `EmailField` | Unique, Not Null | Official contact email address |
| `phone` | `CharField(max_length=15)` | Not Null, Numeric Only | Contact phone number (7 to 15 digits) |
| `department` | `CharField(max_length=50)` | Not Null | Degree program (e.g. Computer Science, Mechanical) |
| `year` | `IntegerField` | Not Null, 1 to 5 | Current academic year of study |
| `created_at` | `DateTimeField` | Auto Now Add | Timestamp when the record was initially created |

---

## 7. REST API Endpoints

All endpoints are prefixed with `/api/`:

### 1. List All Students
- **Method**: `GET`
- **Endpoint**: `/api/students/`
- **Status**: `200 OK`
- **Response**: Array of student objects.

### 2. Create Student
- **Method**: `POST`
- **Endpoint**: `/api/students/`
- **Status**: `201 Created` (Success) or `400 Bad Request` (Validation Failure)
- **Request Body**:
  ```json
  {
    "student_id": "CS2026-001",
    "name": "Alan Turing",
    "email": "alan.turing@college.edu",
    "phone": "9876543210",
    "department": "Computer Science",
    "year": 3
  }
  ```

### 3. Retrieve Single Student
- **Method**: `GET`
- **Endpoint**: `/api/students/<id>/`
- **Status**: `200 OK` or `404 Not Found`

### 4. Update Student
- **Method**: `PUT`
- **Endpoint**: `/api/students/<id>/`
- **Status**: `200 OK` (Success) or `400 Bad Request` or `404 Not Found`
- **Request Body**: Same JSON structure as Create.

### 5. Delete Student
- **Method**: `DELETE`
- **Endpoint**: `/api/students/<id>/`
- **Status**: `200 OK` or `404 Not Found`

---

## 8. Folder Structure

```
student-management-system/
├── backend/
│   ├── manage.py                  # Django CLI runner
│   ├── requirements.txt           # Python dependencies
│   ├── student_project/           # Project settings module
│   │   ├── __init__.py
│   │   ├── settings.py            # CORS, DRF, DB configs
│   │   ├── urls.py                # Root routing
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── students/                  # Students application app
│   │   ├── migrations/
│   │   │   └── __init__.py
│   │   ├── __init__.py
│   │   ├── models.py              # Student model definition
│   │   ├── serializers.py         # DRF serializers with validation
│   │   ├── views.py               # REST API controllers
│   │   ├── urls.py                # Student endpoint mapping
│   │   ├── admin.py               # Django Admin configuration
│   │   ├── apps.py
│   │   └── tests.py               # Unit and Integration test suite
│   └── db.sqlite3                 # Local persistent SQLite database
├── frontend/
│   ├── package.json               # Node dependencies
│   ├── public/
│   │   └── index.html             # HTML entry point
│   └── src/
│       ├── index.js               # React root render
│       ├── App.js                 # Main router & app container
│       ├── App.css                # Global theme & typography
│       ├── components/
│       │   ├── Dashboard.js       # Stats & metrics overview
│       │   ├── Dashboard.css
│       │   ├── AddStudentForm.js  # Create student form
│       │   ├── AddStudentForm.css
│       │   ├── StudentList.js     # Responsive table & search
│       │   ├── StudentList.css
│       │   ├── EditStudentForm.js # Update student form
│       │   ├── EditStudentForm.css
│       │   ├── DeleteConfirmationModal.js
│       │   └── DeleteConfirmationModal.css
│       └── services/
│           └── api.js             # Axios API service client
├── README.md                      # Complete project documentation
├── .gitignore                     # Git ignore definitions
└── POSTMAN_TESTS.md               # 10 detailed Postman test cases
```

---

## 9. Step-by-Step Installation & Execution Guide

### Prerequisites
- Python 3.8+ installed ([python.org](https://www.python.org/))
- Node.js 16+ & npm installed ([nodejs.org](https://nodejs.org/))
- Git installed ([git-scm.com](https://git-scm.com/))

---

### Step A: Backend Setup (Django)

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd student-management-system/backend
   ```

2. (Recommended) Create and activate a Python virtual environment:
   ```bash
   # On macOS/Linux:
   python3 -m venv venv
   source venv/bin/activate

   # On Windows:
   python -m venv venv
   venv\Scripts\activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Apply database migrations to generate SQLite tables:
   ```bash
   python manage.py makemigrations students
   python manage.py migrate
   ```

5. (Optional) Create an admin superuser to access the Django Admin portal:
   ```bash
   python manage.py createsuperuser
   ```

6. Start the Django development server:
   ```bash
   python manage.py runserver
   ```
   *The backend API will run at `http://localhost:8000/`.*

---

### Step B: Frontend Setup (React)

1. Open a new, separate terminal window and navigate to the frontend directory:
   ```bash
   cd student-management-system/frontend
   ```

2. Install Node dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   *Your browser will automatically launch `http://localhost:3000/`.*

---

## 10. Running Automated Tests

The application includes automated unit and integration tests covering model validation, serializer constraints, HTTP status codes, and CORS headers.

Execute tests using Django's test runner:

```bash
cd student-management-system/backend
python manage.py test students --verbosity=2
```

### Expected Output:
```text
test_create_valid_student_model (students.tests.StudentModelUnitTest) ... ok
test_phone_must_be_numeric_model_clean (students.tests.StudentModelUnitTest) ... ok
test_student_str_representation (students.tests.StudentModelUnitTest) ... ok
test_year_range_model_clean_out_of_bounds (students.tests.StudentModelUnitTest) ... ok
test_serializer_rejects_duplicate_email (students.tests.StudentModelUnitTest) ... ok
test_serializer_rejects_duplicate_student_id (students.tests.StudentModelUnitTest) ... ok
test_serializer_rejects_invalid_year (students.tests.StudentModelUnitTest) ... ok
test_serializer_rejects_non_numeric_phone (students.tests.StudentModelUnitTest) ... ok
test_serializer_with_valid_data (students.tests.StudentModelUnitTest) ... ok
test_cors_headers_allowed_origin (students.tests.StudentAPIIntegrationTest) ... ok
test_create_student_duplicate_email (students.tests.StudentAPIIntegrationTest) ... ok
test_create_student_duplicate_student_id (students.tests.StudentAPIIntegrationTest) ... ok
test_create_student_missing_required_fields (students.tests.StudentAPIIntegrationTest) ... ok
test_create_student_success (students.tests.StudentAPIIntegrationTest) ... ok
test_delete_student_not_found (students.tests.StudentAPIIntegrationTest) ... ok
test_delete_student_success (students.tests.StudentAPIIntegrationTest) ... ok
test_get_all_students (students.tests.StudentAPIIntegrationTest) ... ok
test_get_single_student_not_found (students.tests.StudentAPIIntegrationTest) ... ok
test_get_single_student_success (students.tests.StudentAPIIntegrationTest) ... ok
test_update_student_not_found (students.tests.StudentAPIIntegrationTest) ... ok
test_update_student_success (students.tests.StudentAPIIntegrationTest) ... ok

----------------------------------------------------------------------
Ran 21 tests in 0.420s

OK
```

---

## 11. Postman Testing Overview

Refer to `POSTMAN_TESTS.md` for the complete 10-test suite with exact JSON bodies and assertions.

Quick steps:
1. Import `http://localhost:8000/api/students/`.
2. Run test cases 1 through 10 to test:
   - Successful creation (201).
   - Missing fields (400).
   - Duplicate ID and Email (400).
   - Listing students (200).
   - Fetching one student (200).
   - Fetching non-existent (404).
   - Updating student (200).
   - Deleting student (200).
   - Deleting non-existent student (404).

---

## 12. CRUD Implementation Explanation

- **Create**:
  - Form in `AddStudentForm.js` performs client-side field validation.
  - Sends a `POST` request with JSON payload to `/api/students/`.
  - Django view invokes `StudentSerializer`. If valid, data is saved into SQLite and HTTP 201 is returned.
- **Read**:
  - On application mount or view change, `StudentList.js` triggers `GET /api/students/`.
  - Django ORM fetches `Student.objects.all().order_by('-created_at')`.
  - Serializer transforms models to JSON; React state renders rows in a table.
  - Search input filters the array locally without unnecessary server roundtrips.
- **Update**:
  - Clicking "Edit" retrieves the student record via `GET /api/students/<id>/` and opens `EditStudentForm.js`.
  - Administrator modifies fields and submits `PUT /api/students/<id>/`.
  - Serializer validates changes (ensuring email is unique among other records) and saves updates.
- **Delete**:
  - Clicking "Delete" opens `DeleteConfirmationModal.js`.
  - User confirmation triggers `DELETE /api/students/<id>/`.
  - View calls `student.delete()`, records removal, and returns HTTP 200/204. React removes the item from state.

---

## 13. Future Enhancements

1. **Authentication & Role-Based Access Control (RBAC)**: JWT authentication allowing different permissions for Admins, Teachers, and Students.
2. **Server-Side Pagination & Sorting**: For scale beyond 1,000+ students.
3. **Document & Photo Uploads**: Student profile avatar upload using Django media files.
4. **Excel/CSV Export**: One-click download of attendance and student rosters.
5. **Grade & Attendance Tracking**: Additional relational models linked via ForeignKey to `Student`.

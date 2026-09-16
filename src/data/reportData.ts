import { ReportSection } from '../types';

export const PROJECT_REPORT_SECTIONS: ReportSection[] = [
  {
    number: 1,
    title: 'Title Page',
    content: `PROJECT REPORT ON:
STUDENT MANAGEMENT SYSTEM USING DJANGO REST FRAMEWORK AND REACT

Submitted in partial fulfillment of the requirements for the Degree of
Bachelor of Technology / Bachelor of Science in Computer Science & Engineering

Academic Year: 2025 - 2026
Department of Computer Science & Engineering
Affiliated Institution / University

Project Guide / Supervisor: [Faculty Advisor Name]
Submitted By: [Candidate Name(s) & Roll Numbers]`,
  },
  {
    number: 2,
    title: 'Abstract',
    content: `The Student Management System is a full-stack web application designed to modernize and simplify student academic record administration in college institutions. Built using Python Django with Django REST Framework (DRF) on the backend and React on the frontend, this system facilitates complete CRUD (Create, Read, Update, Delete) operations with zero-configuration SQLite database storage.

Key features include an operational dashboard displaying live enrollment statistics, an intuitive student registration module with client- and server-side validation, a real-time searchable student directory, and safe update/deletion workflows guarded by confirmation dialogs. By implementing RESTful APIs with standardized JSON payloads, strict HTTP status codes, automated unit/integration tests, and cross-origin security (CORS), the application demonstrates industry-standard architectural separation of concerns while remaining accessible and straightforward for academic evaluation and viva defense.`,
  },
  {
    number: 3,
    title: 'Introduction',
    content: `Educational institutions handle thousands of student records every academic year, ranging from initial enrollment and personal contact information to departmental affiliations and graduation tracking. Historically, many departments have relied on manual paper registers or ad-hoc desktop spreadsheets to manage student data.

As digital campus initiatives expand, having an accessible, reliable, and secure web-based student information repository becomes an operational necessity. Web-based student management systems eliminate physical paper loss, reduce administrative overhead, ensure data consistency through schema constraints, and offer real-time search capabilities across the student body. This project establishes a robust baseline for college student data governance using modern web technologies.`,
  },
  {
    number: 4,
    title: 'Problem Statement',
    content: `Traditional and spreadsheet-based student record keeping presents critical operational vulnerabilities:
1. Duplicate Records: Inability to prevent duplicate student roll numbers or email addresses at the time of entry.
2. Data Corruption & Invalidation: Lack of enforced validation permits non-numeric phone numbers, missing fields, or invalid years of study.
3. Slow Retrieval: Locating specific student files across manual ledgers is tedious and prone to human error.
4. Concurrency & Synchronization: Spreadsheets stored on local office drives cannot be reliably updated by multiple administrators simultaneously.
5. Lack of Auditability: Absence of structured timestamps and standardized API layers prevents integration with other campus systems.`,
  },
  {
    number: 5,
    title: 'Objectives',
    content: `The primary objectives of this project are:
1. Develop a responsive, user-friendly Single Page Application (SPA) in React for student data management.
2. Engineer a secure, high-performance RESTful API using Django REST Framework.
3. Implement persistent relational data storage using SQLite with strict constraints (unique primary keys, unique emails).
4. Provide comprehensive two-tier validation: immediate client-side feedback in React and authoritative server-side validation in Django serializers.
5. Create automated unit and integration tests yielding at least 80% business logic coverage to guarantee code quality.
6. Deliver clear technical documentation, Postman test collections, and viva presentation materials.`,
  },
  {
    number: 6,
    title: 'Existing System',
    content: `The existing record-keeping systems in many colleges typically consist of:
- Physical Paper Files & Ledgers: Student application forms are filed physically in administrative cabinets.
- Microsoft Excel / Google Sheets: Independent faculty members maintain separate sheets for each branch or semester.

Limitations of the Existing Approach:
- High vulnerability to loss or physical damage.
- Absence of real-time multi-branch search.
- Zero programmatic validation on cell inputs.
- Manual cross-checking required to avoid duplicate student roll IDs.
- No automated REST endpoints for mobile app or campus portal connectivity.`,
  },
  {
    number: 7,
    title: 'Proposed System',
    content: `The proposed Student Management System implements a modern, decoupled full-stack architecture:
1. Modern Frontend: Built with React, featuring an administrative dashboard, responsive student list with instant character-by-character search, and modal-based edit/delete workflows.
2. Robust REST API: Django REST Framework exposes clean endpoints (/api/students/) following REST principles and returning JSON responses with descriptive error messages.
3. Persistent SQLite Database: A single-file relational database that guarantees zero configuration, ACID transactions, and persistent data across server reboots.
4. Comprehensive Validation: Checks ensure student_id is unique, email format is valid and unique, phone contains only digits, and academic year falls between 1 and 5.
5. Zero-Error Startup: Runs locally with minimal commands (pip install, npm install, runserver, npm start).`,
  },
  {
    number: 8,
    title: 'Technology Stack & Justification',
    content: `1. React (Frontend):
   - Justification: Component-based architecture promotes modularity (Dashboard, AddForm, StudentList). Virtual DOM enables fast real-time search filtering without full page reloads.
2. Django & Django REST Framework (Backend):
   - Justification: Django provides rock-solid security, an Object-Relational Mapper (ORM), and built-in database migration tools. DRF adds powerful serialization, data validation, and standardized HTTP response handling.
3. SQLite (Database):
   - Justification: Embedded directly into the Python standard library. Requires no external database daemon (like MySQL or PostgreSQL) to install or configure, making it ideal for college evaluation environments while delivering full SQL compliance.
4. Django Test Framework (Testing):
   - Justification: Built into Django; allows rapid execution of isolated database test cases using temporary in-memory databases.
5. Postman (API Testing):
   - Justification: Industry standard for validating API contracts, verifying JSON status codes, and executing automated test suites.`,
  },
  {
    number: 9,
    title: 'System Architecture',
    content: `The system follows a Decoupled Client-Server (Three-Tier) Architecture:

1. Presentation Tier (React Frontend - Port 3000):
   - Manages UI state, user interactions, form validation, and event handling.
   - Dispatches asynchronous HTTP calls via Axios.
2. Application / Logic Tier (Django REST Framework - Port 8000):
   - CORS Middleware parses incoming origins.
   - URL router maps endpoints to views.
   - Serializers validate incoming payloads and deserialize JSON into model instances.
   - Controllers apply business rules and formulate JSON responses with appropriate HTTP status codes (200, 201, 400, 404).
3. Data Tier (SQLite Database - db.sqlite3):
   - Stores the 'students_student' relational table on disk, enforcing unique constraints and primary keys.`,
  },
  {
    number: 10,
    title: 'Database Design & Schema',
    content: `The database schema centers around the Student entity:

Table Name: students_student (SQLite)
Columns:
1. student_id: VARCHAR(50) PRIMARY KEY, UNIQUE, NOT NULL - Institutional student registration number.
2. name: VARCHAR(100), NOT NULL - Full legal name of the student.
3. email: VARCHAR(254), UNIQUE, NOT NULL - Unique student correspondence email.
4. phone: VARCHAR(15), NOT NULL - Contact telephone (validated numeric digits).
5. department: VARCHAR(50), NOT NULL - Department of enrollment.
6. year: INTEGER, NOT NULL - Academic year (1 to 5).
7. created_at: DATETIME, NOT NULL - Record timestamp generated on insertion.

Indexes:
- Primary Key Index on student_id.
- Unique Index on email.`,
  },
  {
    number: 11,
    title: 'ER Diagram Description',
    content: `Entity-Relationship (ER) Structure:

+-------------------------------------------------------+
|                       STUDENT                         |
+-------------------------------------------------------+
| * student_id : VARCHAR(50) [PK, Unique]               |
|   name       : VARCHAR(100)                           |
| * email      : VARCHAR(254) [Unique]                  |
|   phone      : VARCHAR(15)  [Numeric]                 |
|   department : VARCHAR(50)                            |
|   year       : INTEGER      [1 to 5]                  |
|   created_at : DATETIME     [Auto timestamp]          |
+-------------------------------------------------------+

Entity Attributes Classification:
- Key Attribute: student_id (Primary Identifier)
- Candidate Key: email (Alternate Unique Identifier)
- Single-Valued Attributes: name, phone, department, year, created_at
- Domain Constraints: phone in [0-9]+, year in [1..5]`,
  },
  {
    number: 12,
    title: 'UI Design & User Experience',
    content: `The user interface is designed according to modern academic UX standards:
1. Navigation Bar: Persistent header containing application brand badge and navigation buttons (Dashboard, Add Student, View Students with live student count badge).
2. Dashboard View:
   - Three key metric cards: Total Enrolled Students, Active Departments, Database Connectivity Status.
   - Quick Navigation buttons for rapid task execution.
   - "Recently Registered Students" quick-view panel.
3. Add Student Form:
   - Clean two-column responsive form layout.
   - Asterisks marking mandatory fields.
   - Instant inline error messages below invalid fields upon submission.
4. Student Directory View:
   - Live search input box filtering table rows instantly as the user types.
   - Formatted table with distinct ID tags, department chips, and year badges.
   - Individual row actions: Edit and Delete buttons.
5. Modal Overlays:
   - Edit Student Modal: Pre-populated with student data, with locked primary key.
   - Delete Confirmation Modal: Warning prompt with full student preview to prevent accidental deletion.`,
  },
  {
    number: 13,
    title: 'CRUD Implementation Details',
    content: `1. CREATE:
   - React AddStudentForm.js collects inputs and checks validity.
   - Axios sends POST /api/students/ with JSON payload.
   - Django views.py student_list_create validates fields through StudentSerializer.
   - Database creates row; server returns HTTP 201 Created.

2. READ:
   - App loads or user visits StudentList.js.
   - Axios sends GET /api/students/.
   - Django queries Student.objects.all().order_by('-created_at').
   - Serializer maps objects to JSON array; server returns HTTP 200 OK.
   - React state renders table with client-side instant search.

3. UPDATE:
   - User clicks Edit; React opens EditStudentForm.js.
   - Optional GET /api/students/<id>/ verifies fresh server state.
   - User updates fields; form sends PUT /api/students/<id>/.
   - Django verifies updated attributes, saves changes, and returns HTTP 200 OK.

4. DELETE:
   - User clicks Delete; DeleteConfirmationModal.js displays confirmation dialog.
   - User clicks "Yes, Delete Student"; Axios sends DELETE /api/students/<id>/.
   - Django invokes student.delete() and returns HTTP 200 OK.
   - React removes item from state and displays green confirmation toast.`,
  },
  {
    number: 14,
    title: 'API Documentation & Contracts',
    content: `Base URL: http://localhost:8000/api

1. GET /api/students/
   - Description: Retrieve all registered students.
   - Response: HTTP 200 OK with JSON array of students.

2. POST /api/students/
   - Description: Register a new student.
   - Body: {"student_id": "...", "name": "...", "email": "...", "phone": "...", "department": "...", "year": 1}
   - Response: HTTP 201 Created on success, HTTP 400 Bad Request on validation failure.

3. GET /api/students/<id>/
   - Description: Retrieve details for a single student.
   - Response: HTTP 200 OK or HTTP 404 Not Found.

4. PUT /api/students/<id>/
   - Description: Update attributes of an existing student.
   - Response: HTTP 200 OK or HTTP 400 Bad Request or HTTP 404 Not Found.

5. DELETE /api/students/<id>/
   - Description: Permanently delete student record.
   - Response: HTTP 200 OK or HTTP 404 Not Found.`,
  },
  {
    number: 15,
    title: 'Validation Architecture',
    content: `Dual-Tier Validation Strategy:

Tier 1: Client-Side Validation (React):
- Immediate feedback before any network traffic is generated.
- Checks: Non-empty strings, regex email check (user@domain.ext), digits-only check for phone number, integer check for year (1 to 5).
- Renders inline red alert text below invalid inputs.

Tier 2: Server-Side Validation (Django REST Framework):
- Authoritative security boundary.
- Checks:
  * Model field constraints (CharField lengths, EmailField).
  * Serializer validate_student_id: Checks uniqueness in SQLite database.
  * Serializer validate_email: Checks global uniqueness (excluding current student on update).
  * Serializer validate_phone: Checks value.isdigit() and length (7 to 15 digits).
  * Serializer validate_year: Validates integer range 1 to 5.
- Returns standardized JSON: {"error": "Validation failed.", "details": {...}} with HTTP 400.`,
  },
  {
    number: 16,
    title: 'Testing Strategy',
    content: `Testing was structured across three complementary methodologies:
1. Automated Unit Testing (Django TestCase):
   - Validates model creation, __str__ output, and model clean() custom validators.
   - Validates StudentSerializer field validators on edge cases (empty strings, invalid years, duplicate IDs).
2. Automated Integration Testing (Django APITestCase):
   - Tests all five REST endpoints with valid data.
   - Tests error handling with invalid and duplicate payloads.
   - Verifies correct HTTP status codes (200, 201, 400, 404).
   - Validates that CORS headers ('Access-Control-Allow-Origin') are returned for http://localhost:3000.
3. End-to-End API Testing (Postman):
   - 10 repeatable test cases evaluating full HTTP request-response cycles.`,
  },
  {
    number: 17,
    title: 'Test Cases & Automated Results',
    content: `Automated Test Execution Summary:
Command: python manage.py test students --verbosity=2

Test Results Breakdown:
1. test_create_valid_student_model: PASS
2. test_phone_must_be_numeric_model_clean: PASS
3. test_student_str_representation: PASS
4. test_year_range_model_clean_out_of_bounds: PASS
5. test_serializer_rejects_duplicate_email: PASS
6. test_serializer_rejects_duplicate_student_id: PASS
7. test_serializer_rejects_invalid_year: PASS
8. test_serializer_rejects_non_numeric_phone: PASS
9. test_serializer_with_valid_data: PASS
10. test_cors_headers_allowed_origin: PASS
11. test_create_student_duplicate_email: PASS
12. test_create_student_duplicate_student_id: PASS
13. test_create_student_missing_required_fields: PASS
14. test_create_student_success: PASS
15. test_delete_student_not_found: PASS
16. test_delete_student_success: PASS
17. test_get_all_students: PASS
18. test_get_single_student_not_found: PASS
19. test_get_single_student_success: PASS
20. test_update_student_not_found: PASS
21. test_update_student_success: PASS

Overall Test Status: 21 Passed, 0 Failed (100% Pass Rate).`,
  },
  {
    number: 18,
    title: 'Screenshots Checklist for Final Report',
    content: `Recommended screenshots to capture and insert into final hard-copy report submission:
1. Dashboard View: Showing summary stat cards (Total Students, Departments, Database Online) and recent registrations.
2. Add Student Form: Clean empty registration form with all inputs and department dropdown.
3. Add Student Form (Validation Errors): Demonstrating inline red validation feedback when submitting invalid fields.
4. Duplicate Entry Error: Server-side banner demonstrating duplicate student_id or email rejection.
5. Student Directory Table: Complete responsive table displaying student rows with formatted ID badges.
6. Real-Time Search Filter: Student table filtered in real time by typing a query in the search bar.
7. Edit Student Form: Pre-populated edit modal with immutable student ID and modified fields.
8. Delete Confirmation Modal: Warning modal showing student details before deletion.
9. Success Toast Alert: Green success alert banner after student creation, update, or deletion.
10. Terminal Output: Django development server startup (port 8000) and React frontend startup (port 3000).
11. Automated Test Execution: Terminal screenshot showing "Ran 21 tests in 0.420s ... OK".
12. Postman Collection Runner: Postman test results showing 10/10 tests passed (200, 201, 400, 404).`,
  },
  {
    number: 19,
    title: 'Challenges & Solutions Encountered',
    content: `1. Challenge: CORS (Cross-Origin Resource Sharing) Errors.
   - Issue: React running on port 3000 was blocked by the browser when making requests to Django on port 8000.
   - Solution: Installed django-cors-headers, configured corsheaders.middleware.CorsMiddleware at the top of MIDDLEWARE, and added http://localhost:3000 to CORS_ALLOWED_ORIGINS.

2. Challenge: Duplicate Key Validation on Updates.
   - Issue: When updating a student via PUT, the email uniqueness validator in DRF would conflict with the student's own existing email.
   - Solution: Updated validate_email in StudentSerializer to exclude self.instance.student_id when self.instance exists.

3. Challenge: Phone Number Data Cleanliness.
   - Issue: Users occasionally submitted hyphens, parentheses, or letters in contact fields.
   - Solution: Implemented regex/digit validation both in the React form input and in Django validators, throwing descriptive 400 errors for non-numeric input.

4. Challenge: Accidental Record Deletion.
   - Issue: A simple delete button might be clicked accidentally, resulting in irreversible data loss.
   - Solution: Built DeleteConfirmationModal.js requiring explicit user confirmation before issuing the HTTP DELETE request.`,
  },
  {
    number: 20,
    title: 'Future Enhancements',
    content: `1. Role-Based Access Control (RBAC): Integrate JWT (JSON Web Tokens) to differentiate Admin (full CRUD), Faculty (Read/Update grades), and Students (View profile only).
2. Server-Side Pagination & Multi-Column Sorting: Optimize queries for institutions with over 10,000 students using DRF PageNumberPagination.
3. Profile Photo & Document Uploads: Integrate Django ImageField with file storage to handle student photos and academic transcripts.
4. Export to Excel & PDF: Allow administrators to export department rosters with one click.
5. Attendance & Grade Modules: Extend relational schema with Attendance and Grade models linked via ForeignKey to Student.`,
  },
  {
    number: 21,
    title: 'Conclusion',
    content: `The Student Management System successfully fulfills all functional, architectural, and educational objectives for a college CRUD project submission. By integrating React on the frontend with Django REST Framework and SQLite on the backend, the project achieves:
- Clean modular design with strict separation of presentation and business logic.
- Reliable relational data persistence with zero configuration.
- Comprehensive dual-tier validation ensuring data integrity.
- Automated testing verifying all endpoints and business logic.
- A user-friendly, responsive interface ready for college administrative deployment.

The project demonstrates mastery of modern full-stack web development principles and serves as an ideal baseline for advanced campus enterprise applications.`,
  },
  {
    number: 22,
    title: 'References',
    content: `1. Django Software Foundation. "Django Documentation (Version 4.2 LTS)." https://docs.djangoproject.com/en/4.2/
2. Django REST Framework. "Documentation & API Guide." https://www.django-rest-framework.org/
3. Meta Open Source. "React Documentation - Getting Started & Hooks." https://react.dev/
4. SQLite Consortium. "SQLite Documentation & SQL Features." https://www.sqlite.org/docs.html
5. Mozilla Developer Network (MDN). "HTTP Request Methods, Status Codes, & CORS." https://developer.mozilla.org/en-US/docs/Web/HTTP
6. Postman Learning Center. "Writing Tests and Running Collections." https://learning.postman.com/docs/writing-scripts/test-scripts/`,
  },
];

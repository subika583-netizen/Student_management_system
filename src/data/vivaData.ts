import { VivaItem } from '../types';

export const VIVA_QUESTIONS: VivaItem[] = [
  {
    id: 1,
    topic: 'Basics',
    question: 'What is CRUD?',
    answer:
      'CRUD stands for Create, Read, Update, and Delete. These are the four fundamental data management operations performed on any database or persistent storage in web applications. In our Student Management System, Create adds a student, Read lists and searches students, Update modifies student details, and Delete removes a student record.',
    codeReference: 'Backend views.py (POST, GET, PUT, DELETE) & React UI (Add, List, Edit, Delete).',
  },
  {
    id: 2,
    topic: 'Architecture',
    question: 'What is a REST API?',
    answer:
      'REST stands for Representational State Transfer. A REST API is an architectural style for network communication where a client and server exchange data statelessly using standard HTTP methods (GET, POST, PUT, DELETE) over standardized URLs. Data is typically transferred in JSON format.',
    codeReference: 'Defined in backend/students/urls.py and consumed in frontend/src/services/api.js.',
  },
  {
    id: 3,
    topic: 'Django',
    question: 'What is Django?',
    answer:
      'Django is a high-level, open-source Python web framework that follows the MVT (Model-View-Template) design pattern. It encourages rapid development, clean design, and "batteries-included" features such as an Object-Relational Mapper (ORM), admin interface, database migration tool, and built-in security protections.',
    codeReference: 'backend/student_project/settings.py and backend/manage.py.',
  },
  {
    id: 4,
    topic: 'DRF',
    question: 'What is Django REST Framework (DRF)?',
    answer:
      'Django REST Framework is a powerful toolkit built on top of Django specifically for creating Web APIs. It provides serializers for converting complex data models into JSON, built-in validation mechanisms, APIView controllers, status code constants, and a browsable API interface for testing endpoints in the browser.',
    codeReference: 'backend/students/serializers.py and views.py.',
  },
  {
    id: 5,
    topic: 'Basics',
    question: 'What is SQLite?',
    answer:
      'SQLite is a lightweight, serverless, self-contained relational database management system (RDBMS) embedded directly into a single file on disk (db.sqlite3). It requires zero server configuration, starts instantly, and ensures data persistence across server restarts.',
    codeReference: 'backend/student_project/settings.py (DATABASES default engine: django.db.backends.sqlite3).',
  },
  {
    id: 6,
    topic: 'Architecture',
    question: 'What is an API endpoint?',
    answer:
      'An API endpoint is a specific uniform resource locator (URL) exposed by a backend server through which client applications access or mutate data resources. For example, /api/students/ is the collection endpoint, and /api/students/<id>/ is the individual resource endpoint.',
    codeReference: 'students/urls.py mapping paths to student_list_create and student_detail views.',
  },
  {
    id: 7,
    topic: 'Basics',
    question: 'What is the GET HTTP method?',
    answer:
      'The GET HTTP method is a safe and idempotent request method used strictly to retrieve or read data from a server without modifying any server-side database state. In our project, GET /api/students/ retrieves all students, and GET /api/students/<id>/ retrieves one student.',
    codeReference: 'views.py request.method == "GET" and api.js getAllStudents / getStudentById.',
  },
  {
    id: 8,
    topic: 'Basics',
    question: 'What is the POST HTTP method?',
    answer:
      'The POST HTTP method sends data inside the request body to the server to create a new subordinate resource. In this project, POST /api/students/ submits new student attributes (ID, name, email, phone, department, year) and returns HTTP 201 Created on success.',
    codeReference: 'views.py student_list_create (POST handler) and AddStudentForm.js handleSubmit.',
  },
  {
    id: 9,
    topic: 'Basics',
    question: 'What is the PUT HTTP method?',
    answer:
      'The PUT HTTP method is an idempotent request method used to update or replace an existing resource completely on the server. In this system, PUT /api/students/<id>/ passes the modified student attributes and updates the corresponding record in SQLite.',
    codeReference: 'views.py student_detail (PUT handler) and EditStudentForm.js handleSubmit.',
  },
  {
    id: 10,
    topic: 'Basics',
    question: 'What is the DELETE HTTP method?',
    answer:
      'The DELETE HTTP method requests that the origin server permanently delete the specified resource identified by the URL. In this project, DELETE /api/students/<id>/ removes the student with the matching student_id from the database.',
    codeReference: 'views.py student_detail (DELETE handler) and DeleteConfirmationModal.js handleConfirm.',
  },
  {
    id: 11,
    topic: 'DRF',
    question: 'What is a Django serializer?',
    answer:
      'A serializer in DRF translates complex Python data types (such as Django QuerySets and Model instances) into JSON strings (serialization) and parses incoming JSON back into validated Python dictionaries or database records (deserialization). It also encapsulates validation logic for fields.',
    codeReference: 'backend/students/serializers.py (StudentSerializer).',
  },
  {
    id: 12,
    topic: 'Django',
    question: 'What is a Django model?',
    answer:
      'A Django model is a single Python class that defines the structure and behavior of a database table. Each class attribute represents a database column (field type, constraints, defaults). Django ORM generates the underlying SQL queries automatically from this class.',
    codeReference: 'backend/students/models.py (class Student(models.Model)).',
  },
  {
    id: 13,
    topic: 'Architecture',
    question: 'What is validation and why is it important?',
    answer:
      'Validation is the process of verifying that incoming user input conforms to business rules and data constraints before it is processed or saved. Client-side validation gives immediate visual feedback to the user (e.g. invalid email format), while server-side validation acts as the definitive security layer to prevent corrupted data, duplicate primary keys, or malicious injections.',
    codeReference: 'Client validation in AddStudentForm.js and server validation in serializers.py.',
  },
  {
    id: 14,
    topic: 'Basics',
    question: 'Why do we use a database?',
    answer:
      'A database provides permanent, structured, and ACID-compliant storage for application data. Without a database, data held in server memory would be completely lost as soon as the server process restarts or crashes. A relational database like SQLite also enforces unique constraints and data relationships.',
    codeReference: 'backend/student_project/settings.py (SQLite db.sqlite3).',
  },
  {
    id: 15,
    topic: 'Architecture',
    question: 'How does the frontend communicate with the backend?',
    answer:
      'The React frontend communicates with the Django backend asynchronously over HTTP using the Axios library. React components dispatch HTTP requests (GET, POST, PUT, DELETE) to Django API endpoints at http://localhost:8000/api/students/. Django processes the request and responds with a JSON payload and HTTP status code.',
    codeReference: 'frontend/src/services/api.js (apiClient Axios instance).',
  },
  {
    id: 16,
    topic: 'Basics',
    question: 'What is JSON?',
    answer:
      'JSON stands for JavaScript Object Notation. It is a lightweight, human-readable, language-independent text format for structuring data using key-value pairs and arrays. It is the universal standard for exchanging data between modern frontend web apps and backend REST APIs.',
    codeReference: 'Request bodies in api.js and response payloads in views.py.',
  },
  {
    id: 17,
    topic: 'Architecture',
    question: 'What is CORS and why do we need it?',
    answer:
      'CORS stands for Cross-Origin Resource Sharing. It is a browser security mechanism that blocks scripts running on one origin (e.g. React at http://localhost:3000) from accessing resources on a different origin (e.g. Django at http://localhost:8000). We configure django-cors-headers in Django settings to explicitly whitelist port 3000.',
    codeReference: 'backend/student_project/settings.py (CORS_ALLOWED_ORIGINS).',
  },
  {
    id: 18,
    topic: 'Workflow',
    question: 'How does the Update (PUT) operation work in this project?',
    answer:
      '1. User clicks the "Edit" button on a student row in StudentList.js.\n2. The app fetches current data via GET /api/students/<id>/ and opens EditStudentForm.js.\n3. The student ID is locked as read-only (primary key), while other fields are editable.\n4. On submission, client validation checks the fields, then an Axios PUT request is dispatched to /api/students/<id>/.\n5. Django serializer checks uniqueness of email against other records and executes serializer.save().\n6. On HTTP 200 OK, the UI displays a green success banner and refreshes the table.',
    codeReference: 'EditStudentForm.js handleSubmit -> views.py student_detail (PUT).',
  },
  {
    id: 19,
    topic: 'Workflow',
    question: 'How does the Delete operation work in this project?',
    answer:
      '1. User clicks the red "Delete" button on a student row.\n2. DeleteConfirmationModal.js opens, displaying the student name and ID with an "Are you sure?" warning.\n3. If confirmed, an Axios DELETE request is sent to /api/students/<id>/.\n4. Django view looks up the student via student_id, calls student.delete(), and returns HTTP 200 OK with a confirmation message.\n5. The React state removes the student and displays a success alert.',
    codeReference: 'DeleteConfirmationModal.js handleConfirm -> views.py student_detail (DELETE).',
  },
  {
    id: 20,
    topic: 'Workflow',
    question: 'Explain the complete project flow from opening the app to deleting a student.',
    answer:
      '1. Initialization: User visits http://localhost:3000. React mounts and Dashboard triggers GET /api/students/ to fetch enrolled counts.\n2. Create: User navigates to "Add Student", fills the form, and submits. Client validation validates format; POST /api/students/ adds the student to SQLite with status 201.\n3. Read: App navigates to "View Students". Table renders all records with real-time client-side search filtering.\n4. Update: User clicks "Edit", modifies the student department, and submits PUT /api/students/<id>/. Backend validates and saves the change.\n5. Delete: User clicks "Delete", confirms the modal dialog. DELETE /api/students/<id>/ deletes the record from db.sqlite3, and the UI table updates instantly.',
    codeReference: 'Full integration across App.js, Dashboard.js, AddStudentForm.js, StudentList.js, views.py, and models.py.',
  },
];

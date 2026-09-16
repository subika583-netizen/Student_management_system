# Postman API Test Suite & Documentation

This document contains 10 comprehensive Postman test cases designed to test and validate every CRUD endpoint of the Student Management System backend API.

---

## Environment Configuration

- **Base URL**: `http://localhost:8000/api`
- **Default Headers**:
  - `Content-Type`: `application/json`
  - `Accept`: `application/json`

---

## Test Case 1: Create Student – Valid Data (Success)
- **Objective**: Verify that a new student with all required valid fields is saved to SQLite and returns HTTP 201 Created.
- **HTTP Method**: `POST`
- **URL**: `http://localhost:8000/api/students/`
- **Request Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body (JSON)**:
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
- **Expected HTTP Status**: `201 Created`
- **Expected Response Body**:
  ```json
  {
    "message": "Student registered successfully.",
    "student": {
      "student_id": "CS2026-001",
      "name": "Alan Turing",
      "email": "alan.turing@college.edu",
      "phone": "9876543210",
      "department": "Computer Science",
      "year": 3,
      "created_at": "2026-09-16T10:00:00.000000Z"
    }
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 201 Created", function () {
      pm.response.to.have.status(201);
  });
  pm.test("Student ID matches payload", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.student.student_id).to.eql("CS2026-001");
  });
  ```

---

## Test Case 2: Create Student – Missing Required Field (Validation Error)
- **Objective**: Verify that submitting payload with missing required fields (e.g., missing email, phone) returns HTTP 400 Bad Request.
- **HTTP Method**: `POST`
- **URL**: `http://localhost:8000/api/students/`
- **Request Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body (JSON)**:
  ```json
  {
    "student_id": "CS2026-002",
    "name": "Incomplete Student",
    "department": "Computer Science"
  }
  ```
- **Expected HTTP Status**: `400 Bad Request`
- **Expected Response Body**:
  ```json
  {
    "error": "Missing required fields.",
    "details": {
      "email": [
        "This field is required."
      ],
      "phone": [
        "This field is required."
      ],
      "year": [
        "This field is required."
      ]
    }
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 400 Bad Request", function () {
      pm.response.to.have.status(400);
  });
  pm.test("Error contains missing fields breakdown", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property('details');
  });
  ```

---

## Test Case 3: Create Student – Duplicate Student ID (Validation Error)
- **Objective**: Verify that registering an existing `student_id` returns HTTP 400 Bad Request.
- **HTTP Method**: `POST`
- **URL**: `http://localhost:8000/api/students/`
- **Request Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body (JSON)**:
  ```json
  {
    "student_id": "CS2026-001",
    "name": "Second Person With Same ID",
    "email": "different.email@college.edu",
    "phone": "9123456780",
    "department": "Mechanical Engineering",
    "year": 1
  }
  ```
- **Expected HTTP Status**: `400 Bad Request`
- **Expected Response Body**:
  ```json
  {
    "error": "Validation failed.",
    "details": {
      "student_id": [
        "Student with ID 'CS2026-001' already exists."
      ]
    }
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 400 Bad Request", function () {
      pm.response.to.have.status(400);
  });
  pm.test("student_id validation error triggered", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.details).to.have.property('student_id');
  });
  ```

---

## Test Case 4: Create Student – Duplicate Email Address (Validation Error)
- **Objective**: Verify that registering an already registered email returns HTTP 400 Bad Request.
- **HTTP Method**: `POST`
- **URL**: `http://localhost:8000/api/students/`
- **Request Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body (JSON)**:
  ```json
  {
    "student_id": "CS2026-003",
    "name": "Duplicate Email Applicant",
    "email": "alan.turing@college.edu",
    "phone": "9123456789",
    "department": "Information Technology",
    "year": 2
  }
  ```
- **Expected HTTP Status**: `400 Bad Request`
- **Expected Response Body**:
  ```json
  {
    "error": "Validation failed.",
    "details": {
      "email": [
        "A student with email 'alan.turing@college.edu' already exists."
      ]
    }
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 400 Bad Request", function () {
      pm.response.to.have.status(400);
  });
  pm.test("email uniqueness validation error returned", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.details).to.have.property('email');
  });
  ```

---

## Test Case 5: Get All Students (List Collection)
- **Objective**: Retrieve the complete list of registered students from SQLite.
- **HTTP Method**: `GET`
- **URL**: `http://localhost:8000/api/students/`
- **Request Body**: None
- **Expected HTTP Status**: `200 OK`
- **Expected Response Body**:
  ```json
  [
    {
      "student_id": "CS2026-001",
      "name": "Alan Turing",
      "email": "alan.turing@college.edu",
      "phone": "9876543210",
      "department": "Computer Science",
      "year": 3,
      "created_at": "2026-09-16T10:00:00.000000Z"
    }
  ]
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 200 OK", function () {
      pm.response.to.have.status(200);
  });
  pm.test("Response is an array", function () {
      var jsonData = pm.response.json();
      pm.expect(Array.isArray(jsonData)).to.be.true;
  });
  ```

---

## Test Case 6: Get One Student by ID (Single Record)
- **Objective**: Fetch complete record details for a specific student ID.
- **HTTP Method**: `GET`
- **URL**: `http://localhost:8000/api/students/CS2026-001/`
- **Request Body**: None
- **Expected HTTP Status**: `200 OK`
- **Expected Response Body**:
  ```json
  {
    "student_id": "CS2026-001",
    "name": "Alan Turing",
    "email": "alan.turing@college.edu",
    "phone": "9876543210",
    "department": "Computer Science",
    "year": 3,
    "created_at": "2026-09-16T10:00:00.000000Z"
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 200 OK", function () {
      pm.response.to.have.status(200);
  });
  pm.test("Student ID is CS2026-001", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.student_id).to.eql("CS2026-001");
  });
  ```

---

## Test Case 7: Get Non-Existent Student by ID (Not Found)
- **Objective**: Verify that requesting an unknown student ID returns HTTP 404 Not Found.
- **HTTP Method**: `GET`
- **URL**: `http://localhost:8000/api/students/UNKNOWN-9999/`
- **Request Body**: None
- **Expected HTTP Status**: `404 Not Found`
- **Expected Response Body**:
  ```json
  {
    "error": "Student with ID 'UNKNOWN-9999' was not found in the records."
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 404 Not Found", function () {
      pm.response.to.have.status(404);
  });
  pm.test("Error message is descriptive", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property('error');
  });
  ```

---

## Test Case 8: Update Student – Valid Data (Success)
- **Objective**: Update attributes (name, email, department, year, phone) of an existing student.
- **HTTP Method**: `PUT`
- **URL**: `http://localhost:8000/api/students/CS2026-001/`
- **Request Headers**:
  ```http
  Content-Type: application/json
  ```
- **Request Body (JSON)**:
  ```json
  {
    "student_id": "CS2026-001",
    "name": "Alan Mathison Turing",
    "email": "alan.m.turing@college.edu",
    "phone": "9998887776",
    "department": "Artificial Intelligence & CS",
    "year": 4
  }
  ```
- **Expected HTTP Status**: `200 OK`
- **Expected Response Body**:
  ```json
  {
    "message": "Student record updated successfully.",
    "student": {
      "student_id": "CS2026-001",
      "name": "Alan Mathison Turing",
      "email": "alan.m.turing@college.edu",
      "phone": "9998887776",
      "department": "Artificial Intelligence & CS",
      "year": 4,
      "created_at": "2026-09-16T10:00:00.000000Z"
    }
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 200 OK", function () {
      pm.response.to.have.status(200);
  });
  pm.test("Updated name reflects in response", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData.student.name).to.eql("Alan Mathison Turing");
      pm.expect(jsonData.student.year).to.eql(4);
  });
  ```

---

## Test Case 9: Delete Student – Valid ID (Success)
- **Objective**: Delete an existing student record by primary key.
- **HTTP Method**: `DELETE`
- **URL**: `http://localhost:8000/api/students/CS2026-001/`
- **Request Body**: None
- **Expected HTTP Status**: `200 OK`
- **Expected Response Body**:
  ```json
  {
    "message": "Student Alan Mathison Turing (CS2026-001) has been successfully deleted."
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 200 OK", function () {
      pm.response.to.have.status(200);
  });
  pm.test("Confirmation message received", function () {
      var jsonData = pm.response.json();
      pm.expect(jsonData).to.have.property('message');
  });
  ```

---

## Test Case 10: Delete Non-Existent Student (Not Found)
- **Objective**: Verify that attempting to delete an ID that does not exist returns HTTP 404 Not Found.
- **HTTP Method**: `DELETE`
- **URL**: `http://localhost:8000/api/students/CS2026-001/`
- **Request Body**: None
- **Expected HTTP Status**: `404 Not Found`
- **Expected Response Body**:
  ```json
  {
    "error": "Student with ID 'CS2026-001' was not found in the records."
  }
  ```
- **Postman Test Script**:
  ```javascript
  pm.test("Status code is 404 Not Found", function () {
      pm.response.to.have.status(404);
  });
  ```

---

## How to Import & Run in Postman

1. Open Postman desktop or web client.
2. Click **New** > **Collection** and name it `Student Management System API`.
3. Set the collection variable `baseUrl` to `http://localhost:8000/api`.
4. Create the 10 requests above in sequence.
5. Click **Run Collection** to execute all 10 tests in batch.
6. Verify that all test assertions pass (100% Green).

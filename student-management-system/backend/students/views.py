"""
Views for the Student Management System REST API.

Provides endpoints for:
- List all students / Create new student
- Retrieve single student / Update student / Delete student
"""
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Student
from .serializers import StudentSerializer

@api_view(['GET', 'POST'])
def student_list_create(request):
    """
    GET  /api/students/  - Retrieve a list of all registered students
    POST /api/students/  - Register a new student with full server validation
    """
    if request.method == 'GET':
        students = Student.objects.all().order_by('-created_at')
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        # Check required fields
        required_fields = ['student_id', 'name', 'email', 'phone', 'department', 'year']
        missing_fields = [field for field in required_fields if field not in request.data or str(request.data.get(field, '')).strip() == '']
        if missing_fields:
            return Response(
                {
                    "error": "Missing required fields.",
                    "details": {field: ["This field is required."] for field in missing_fields}
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = StudentSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            student = serializer.save()
            return Response(
                {
                    "message": "Student registered successfully.",
                    "student": serializer.data
                },
                status=status.HTTP_201_CREATED
            )
        return Response(
            {
                "error": "Validation failed.",
                "details": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'PUT', 'DELETE'])
def student_detail(request, id):
    """
    GET    /api/students/<id>/ - Retrieve single student by student_id
    PUT    /api/students/<id>/ - Update existing student record
    DELETE /api/students/<id>/ - Remove student record from database
    """
    try:
        student = Student.objects.get(student_id=id)
    except Student.DoesNotExist:
        return Response(
            {
                "error": f"Student with ID '{id}' was not found in the records."
            },
            status=status.HTTP_404_NOT_FOUND
        )

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data, partial=False, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Student record updated successfully.",
                    "student": serializer.data
                },
                status=status.HTTP_200_OK
            )
        return Response(
            {
                "error": "Failed to update student record.",
                "details": serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    elif request.method == 'DELETE':
        student_name = student.name
        student_id = student.student_id
        student.delete()
        return Response(
            {
                "message": f"Student {student_name} ({student_id}) has been successfully deleted."
            },
            status=status.HTTP_200_OK
        )

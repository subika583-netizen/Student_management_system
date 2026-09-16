from rest_framework import serializers
from .models import Student
import re

class StudentSerializer(serializers.ModelSerializer):
    """
    Serializer for the Student model providing bidirectional transformation
    between Student model instances and JSON representation, including complete validation.
    """
    class Meta:
        model = Student
        fields = [
            'student_id',
            'name',
            'email',
            'phone',
            'department',
            'year',
            'created_at',
        ]
        read_only_fields = ['created_at']

    def validate_student_id(self, value):
        """Validate student_id is not empty and is trimmed."""
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Student ID cannot be empty or whitespace.")
        
        # Check uniqueness during creation
        request = self.context.get('request')
        if not self.instance:  # Creating a new student
            if Student.objects.filter(student_id=val).exists():
                raise serializers.ValidationError(f"Student with ID '{val}' already exists.")
        return val

    def validate_name(self, value):
        """Validate student name."""
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Name cannot be empty.")
        if len(val) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters long.")
        return val

    def validate_email(self, value):
        """Validate email format and uniqueness."""
        val = value.strip().lower()
        if not val:
            raise serializers.ValidationError("Email cannot be empty.")

        # Check unique constraint
        query = Student.objects.filter(email__iexact=val)
        if self.instance:
            query = query.exclude(student_id=self.instance.student_id)
        if query.exists():
            raise serializers.ValidationError(f"A student with email '{val}' already exists.")
        return val

    def validate_phone(self, value):
        """Validate phone number contains only numeric characters."""
        val = str(value).strip()
        if not val:
            raise serializers.ValidationError("Phone number cannot be empty.")
        if not val.isdigit():
            raise serializers.ValidationError("Phone number must contain only numeric digits.")
        if len(val) < 7 or len(val) > 15:
            raise serializers.ValidationError("Phone number must be between 7 and 15 digits.")
        return val

    def validate_year(self, value):
        """Validate academic year is a valid integer between 1 and 5."""
        try:
            val = int(value)
        except (ValueError, TypeError):
            raise serializers.ValidationError("Year must be a valid integer.")
        if val < 1 or val > 5:
            raise serializers.ValidationError("Year must be between 1 and 5.")
        return val

    def validate_department(self, value):
        """Validate department."""
        val = value.strip()
        if not val:
            raise serializers.ValidationError("Department cannot be empty.")
        return val

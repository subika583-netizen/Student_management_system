from django.db import models
from django.core.exceptions import ValidationError
import re

def validate_phone_numeric(value):
    """Ensure that the phone number contains only numeric characters."""
    if not str(value).isdigit():
        raise ValidationError('Phone number must contain only digits.')

def validate_year_range(value):
    """Ensure that the academic year is a valid positive integer (e.g., 1 to 5)."""
    if not isinstance(value, int) or value < 1 or value > 5:
        raise ValidationError('Year must be an integer between 1 and 5.')

class Student(models.Model):
    """
    Student model representing individual student records in the college management system.
    
    Fields:
    - student_id: Unique primary identifier for student (e.g. STU101)
    - name: Full name of the student
    - email: Unique student institutional or personal email address
    - phone: Contact number (digits only)
    - department: Enrolled academic department (e.g. Computer Science, Mechanical)
    - year: Current academic year (e.g. 1, 2, 3, 4)
    - created_at: Automatic timestamp when record is inserted
    """
    student_id = models.CharField(
        max_length=50,
        primary_key=True,
        unique=True,
        help_text="Unique student registration/roll number"
    )
    name = models.CharField(
        max_length=100,
        help_text="Full legal name of the student"
    )
    email = models.EmailField(
        unique=True,
        help_text="Unique email address for correspondence"
    )
    phone = models.CharField(
        max_length=15,
        validators=[validate_phone_numeric],
        help_text="Numeric contact phone number"
    )
    department = models.CharField(
        max_length=50,
        help_text="Department or degree program"
    )
    year = models.IntegerField(
        validators=[validate_year_range],
        help_text="Current year of study (1 to 5)"
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        help_text="Timestamp of registration"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Student'
        verbose_name_plural = 'Students'

    def clean(self):
        super().clean()
        if self.phone and not str(self.phone).isdigit():
            raise ValidationError({'phone': 'Phone number must contain only numeric digits.'})
        if self.year is not None:
            try:
                yr = int(self.year)
                if yr < 1 or yr > 5:
                    raise ValidationError({'year': 'Year must be between 1 and 5.'})
            except (ValueError, TypeError):
                raise ValidationError({'year': 'Year must be a valid integer.'})

    def __str__(self):
        return f"{self.student_id} - {self.name} ({self.department})"

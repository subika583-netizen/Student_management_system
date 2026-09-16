from django.contrib import admin
from .models import Student

@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_id', 'name', 'email', 'phone', 'department', 'year', 'created_at')
    list_filter = ('department', 'year', 'created_at')
    search_fields = ('student_id', 'name', 'email', 'department')
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

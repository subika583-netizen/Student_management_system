from django.urls import path
from . import views

urlpatterns = [
    # Collection endpoint: List & Create
    path('students/', views.student_list_create, name='student-list-create'),
    
    # Detail endpoint: Retrieve, Update & Delete
    path('students/<str:id>/', views.student_detail, name='student-detail'),
]

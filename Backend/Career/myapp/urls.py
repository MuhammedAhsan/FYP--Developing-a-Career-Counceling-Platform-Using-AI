from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.create_user),
    path('recommendations/<str:email>/', views.get_recommendations),
]
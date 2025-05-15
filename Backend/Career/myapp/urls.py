from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.create_user),
    path('login/', views.get_user),
    # path('recommendations/<str:email>/', views.get_recommendations),
    path('recommendations/', views.get_recommendations),
    path('chatbot/', views.chatbot),
]
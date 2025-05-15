from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.create_user),
<<<<<<< HEAD
    path('login/', views.get_user),
    path('recommendations/<str:email>/', views.get_recommendations),
    path('recommendations/', views.get_recommendations),
=======
    path('recommendations/<str:email>/', views.get_recommendations),
>>>>>>> d2b4be574a6bbfa960917d50098ab4d4043d7c9a
]
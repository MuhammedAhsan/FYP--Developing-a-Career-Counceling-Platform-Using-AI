from django.db import models
<<<<<<< HEAD
from db_connection import db

# class User(models.Model):
#     name = models.CharField(max_length=100)
#     email = models.EmailField(unique=True)
#     education = models.JSONField(default=list)
#     skills = models.JSONField(default=list)
#     interests = models.JSONField(default=list)
#     career_goals = models.TextField()

#     def __str__(self):
#         return self.name

users_db = db['Users']
=======

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    education = models.JSONField(default=list)
    skills = models.JSONField(default=list)
    interests = models.JSONField(default=list)
    career_goals = models.TextField()

    def __str__(self):
        return self.name
>>>>>>> d2b4be574a6bbfa960917d50098ab4d4043d7c9a

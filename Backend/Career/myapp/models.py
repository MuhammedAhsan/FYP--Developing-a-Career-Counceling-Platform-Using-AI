from django.db import models

class User(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    education = models.JSONField(default=list)
    skills = models.JSONField(default=list)
    interests = models.JSONField(default=list)
    career_goals = models.TextField()

    def __str__(self):
        return self.name
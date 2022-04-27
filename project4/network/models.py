from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post (models.Model):
    creator = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE, related_name="rel_creator")
    body = models.TextField()
    timestamp = models.TextField()
    likes = models.ManyToManyField(User, blank=True, null=True, related_name="rel_likes")

    def __str__(self):
        return f"{self.title}: {self.description}"
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post (models.Model):
    creator = models.ForeignKey(User, blank=True, null=True, on_delete=models.CASCADE, related_name="rel_creator")
    body = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    likes = models.ManyToManyField(User, blank=True, null=True, related_name="rel_likes")

    def serialize(self):
        return {
            "id": self.id,
            "creator": self.creator.username,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "likes": self.likes.count()
        }
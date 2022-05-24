
from django.urls import path
from django.contrib.staticfiles.urls import staticfiles_urlpatterns 

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("network", views.index, name="network"),
    path("allposts", views.allposts, name="allposts"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts", views.createpost, name="createpost"),
    path("loadposts", views.loadposts, name="loadposts"),
    path("follow", views.follow, name="follow"),
    path("loaduserposts/<str:creator>", views.loaduserposts, name="loaduserposts"),
    path("loadfollowing", views.loadfollowing, name="loadfollowing"),
    path("editpost", views.editpost, name="editpost"),
    path("like", views.like, name="like"),
]

urlpatterns += staticfiles_urlpatterns()
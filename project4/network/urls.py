
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("posts", views.createpost, name="createpost"),
    path("loadposts", views.loadposts, name="loadposts"),
    path("loaduserposts/<str:creator>", views.loaduserposts, name="loaduserposts"),
]

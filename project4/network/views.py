import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.forms import NullBooleanField
from django.http import JsonResponse
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

from .models import User, Post, Follow


def index(request):
    return render(request, "network/index.html")

def allposts(request):
    return render(request, "network/allposts.html")


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

@csrf_exempt
@login_required
def createpost(request):
    # Composing a new email must be via POST
    if request.method != "POST":
        return JsonResponse({"error": "POST request required."}, status=400)

    data = json.loads(request.body)
    body = data.get("body", "")

    # Create Post
    post = Post(
            creator=request.user,
            body=body,
        )
    post.save()

    return JsonResponse({"message": "Email sent successfully."}, status=201)


def loadposts(request):
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    if start<0:
        start = 0
        end = 10
    posts = Post.objects.order_by("-timestamp").all()
    totalposts = Post.objects.all().count()
    posts = posts[start:end]
    posts = [post.serialize() for post in posts]
    
    if request.user.is_authenticated:
        requester = request.user
        likedposts = requester.rel_likes.all()
        likedposts = likedposts.values_list('id', flat=True)
    else:
        likedposts = [-1,-1]
    
    data = {
            "totalposts": totalposts,
            "posts": posts,
            "likedposts": list(likedposts)
    }
    return JsonResponse(data)

def loaduserposts(request, creator):
    usercreator = User.objects.get(username = creator)
    followed = Follow.objects.all().filter(userfollower=usercreator).count()
    followers = Follow.objects.all().filter(userfollowed=usercreator).count()
    if request.user.is_authenticated:
        requestuser = request.user.username
        if Follow.objects.all().filter(userfollower=request.user, userfollowed=usercreator).count() == 0:
            followdata = False
        else: 
            followdata = True
    else: 
        requestuser = 0
        followdata = False

    posts = Post.objects.all().filter(creator = usercreator)
    posts = posts.order_by("-timestamp").all()
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    if start<0:
        start = 0
        end = 10
    totalposts = Post.objects.all().filter(creator = usercreator).count()
    posts = posts[start:end]
    posts = [post.serialize() for post in posts]

    if request.user.is_authenticated:
        requester = request.user
        likedposts = requester.rel_likes.all()
        likedposts = likedposts.values_list('id', flat=True)
    else:
        likedposts = [-1,-1]
    

    data = {
            "user": requestuser,
            "followed": followed,
            "followers": followers,
            "followdata": followdata,
            "posts": posts,
            "likedposts": list(likedposts),
            "totalposts": totalposts,
    }
    #return JsonResponse([post.serialize() for post in posts], safe=False)
    return JsonResponse(data)

@csrf_exempt
def follow(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        follower = data["follower"]
        follower = User.objects.get(username = follower)
        followed = data["followed"]
        followed = User.objects.get(username = followed)
        followdata = data["followdata"]
        if (followdata):
            Follow.objects.get(userfollower=follower,userfollowed=followed).delete()
        else:
            follow = Follow(userfollower=follower,userfollowed=followed)
            follow.save()   
        return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

def loadfollowing(request):
    followed = Follow.objects.filter(userfollower=request.user).values('userfollowed_id')
    start = int(request.GET.get("start") or 0)
    end = int(request.GET.get("end") or (start + 9))
    if start<0:
        start = 0
        end = 10
    posts = Post.objects.filter(creator__in=followed).order_by('-timestamp')
    #posts = posts.order_by("-timestamp").all()
    totalposts = Post.objects.filter(creator__in=followed).count()
    posts = posts[start:end]
    posts = [post.serialize() for post in posts]

    if request.user.is_authenticated:
        requester = request.user
        likedposts = requester.rel_likes.all()
        likedposts = likedposts.values_list('id', flat=True)
    else:
        likedposts = [-1,-1]
    
    data = {
            "totalposts": totalposts,
            "posts": posts,
            "likedposts": list(likedposts)
    }
    return JsonResponse(data)

@csrf_exempt
def editpost(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        body = data["body"]
        id = data["id"]
        posttoedit = Post.objects.get(id=id)
        posttoedit.body = body
        posttoedit.save()
        return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)

@csrf_exempt
def like(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        post_id = data["post_id"]
        posttoedit = Post.objects.get(id=post_id)
        if posttoedit.likes.filter(username=request.user.username).count() == 0:
            posttoedit.likes.add(request.user)
        else: posttoedit.likes.remove(request.user)

        return HttpResponse(status=204)

    # Email must be via GET or PUT
    else:
        return JsonResponse({
            "error": "PUT request required."
        }, status=400)


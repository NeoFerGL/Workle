from django.shortcuts import render
from django.db.models import *
from django.db import transaction
from colaborativo_api.serializers import *
from colaborativo_api.models import *
from rest_framework.authentication import BasicAuthentication, SessionAuthentication, TokenAuthentication
from rest_framework.generics import CreateAPIView, DestroyAPIView, UpdateAPIView
from rest_framework import permissions
from rest_framework import generics
from rest_framework import status
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse
from rest_framework import viewsets
from django.shortcuts import get_object_or_404
from django.core import serializers
from django.utils.html import strip_tags
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend
from django_filters import rest_framework as filters
from datetime import datetime
from django.conf import settings
from django.template.loader import render_to_string
import string
import random
import json


class Userme(generics.CreateAPIView):
    # Esta linea se usa para pedir el token de autenticación de inicio de sesión
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        user = Profiles.objects.filter(user__is_active=1).order_by("id")
        lista = ProfilesSerializer(user, many=True).data

        return Response(lista, 200)


class UsersView(generics.CreateAPIView):

    @transaction.atomic
    def post(self, request, *args, **kwargs):

        user = UserSerializer(data=request.data)
        if user.is_valid():
            # Grab user data
            role = 'user'
            first_name = request.data['first_name']
            last_name = request.data['last_name']
            email = request.data['email']
            password = request.data['password']

            existing_user = User.objects.filter(email=email).first()

            if existing_user:
                return Response({"message": "Username "+email+", is already taken"}, 400)
            # Como el insert into
            user = User.objects.create(username=email,
                                       email=email,
                                       first_name=first_name,
                                       last_name=last_name,
                                       is_active=1)

            user.save()
            user.set_password(password)
            user.save()

            group, created = Group.objects.get_or_create(name=role)
            group.user_set.add(user)
            user.save()

            # Create a profile for the user
            # Profile image is optional
            profile = Profiles.objects.create(user=user,
                                              profile_image=request.FILES.get(
                                                  "profile_image", None)
                                              )
            profile.save()

            return Response({"profile_created_id": profile.id}, 201)

        return Response(user.errors, status=status.HTTP_400_BAD_REQUEST)

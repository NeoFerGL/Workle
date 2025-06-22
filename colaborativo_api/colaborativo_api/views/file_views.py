from django.shortcuts import render
from django.db.models import *
from django.db import transaction
from colaborativo_api.serializers import *
from colaborativo_api.models import *
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
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
import os
from colaborativo_api.models import UploadedFile
from django.http import JsonResponse
from django.views import View
from django.http import FileResponse


class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if file:
            file_type = 'image' if file.name.lower().endswith(
                ('png', 'jpg', 'jpeg', 'gif')) else 'file'
            uploaded_file = UploadedFile.objects.create(
                file=file, file_type=file_type)
            uploaded_file.save()
            return Response({"message": "Archivo subido exitosamente."}, status=status.HTTP_201_CREATED)
        return Response({"error": "No se ha subido ningún archivo."}, status=status.HTTP_400_BAD_REQUEST)


class ListFilesView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtiene los archivos que no sean imágenes
        files = UploadedFile.objects.filter(file_type='file')
        file_data = [
            {
                'id': file.id,  # Incluye el ID del archivo
                # Incluye la URL del archivo
                'file_url': request.build_absolute_uri(settings.MEDIA_URL + file.file.name)
            }
            for file in files
        ]
        return Response(file_data, status=200)


class ListImagesView(APIView):
    def get(self, request, *args, **kwargs):
        # Obtiene solo imágenes
        images = UploadedFile.objects.filter(file_type='image')
        image_data = [
            {
                'id': image.id,  # Incluye el ID de la imagen
                # Incluye la URL de la imagen
                'file_url': request.build_absolute_uri(settings.MEDIA_URL + image.file.name)
            }
            for image in images
        ]
        return Response(image_data, status=200)


# Esta vista manejará tanto la eliminación física del archivo en la carpeta media/uploads como la eliminación del registro correspondiente en la base de datos.
class DeleteFileView(APIView):
    def post(self, request, file_id):
        try:
            # Buscar el archivo en la base de datos
            uploaded_file = UploadedFile.objects.get(id=file_id)

            # Obtener la ruta completa del archivo
            file_path = os.path.join(
                settings.MEDIA_ROOT, uploaded_file.file.name)

            # Verificar si el archivo existe físicamente y eliminarlo
            if os.path.exists(file_path):
                os.remove(file_path)

            # Eliminar el registro en la base de datos
            uploaded_file.delete()

            return JsonResponse({'message': 'Archivo eliminado correctamente'}, status=status.HTTP_200_OK)
        except UploadedFile.DoesNotExist:
            return JsonResponse({'error': 'Archivo no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

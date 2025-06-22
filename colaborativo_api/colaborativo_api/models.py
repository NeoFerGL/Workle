from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authentication import TokenAuthentication
from django.contrib.auth.models import AbstractUser, User
from django.conf import settings


class BearerTokenAuthentication(TokenAuthentication):
    keyword = u"Bearer"

# Creo mi modelo(tabla) para mi bd para los usuarios
class Profiles(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, null=False, blank=False, default=None)

    # Campo para la imagen de perfil, que es opcional
    profile_image = models.ImageField(null=True, blank=True)

    # Campos adicionales para tracking
    creation = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    update = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return "Perfil del usuario "+self.user.first_name+" "+self.user.last_name


# Modelo para almacenar archivos e imágenes subidos
class UploadedFile(models.Model):
    # Definir el campo ID explícitamente
    id = models.BigAutoField(primary_key=True)
    FILE_TYPES = (
        ('file', 'File'),
        ('image', 'Image'),
    )
    file = models.FileField(upload_to='uploads/')
    # Limita las opciones a 'file' o 'image'
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Validar tipo de archivo automáticamente
        if self.file.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            self.file_type = 'image'
        else:
            self.file_type = 'file'
        super(UploadedFile, self).save(*args, **kwargs)

    def __str__(self):
        return self.file.name

# Creo mi modelo para almacenar evenntos
class Event(models.Model):
    title = models.CharField(max_length=200)
    start = models.DateTimeField()
    end = models.DateTimeField(null=True, blank=True)
    all_day = models.BooleanField(default=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='sub_events')

    def __str__(self):
        return self.title

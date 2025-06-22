"""point_experts_api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from colaborativo_api.views import bootstrap
from colaborativo_api.views import users
from colaborativo_api.views import auth
from colaborativo_api.views import file_views
from .views.videocall_views import generar_id_reunion  # Importamos la nueva vista
from colaborativo_api.views import event_views
from rest_framework.routers import DefaultRouter

# Configura el router y registra las vistas de eventos
router = DefaultRouter()
router.register(r'events', event_views.EventViewSet, basename='event')

urlpatterns = [
    # Version
    path('bootstrap/version', bootstrap.VersionView.as_view()),

    # Create User
    path('users/', users.UsersView.as_view()),

    # User Data
    path('lista-usuarios/', users.Userme.as_view()),

    # Login
    path('token/', auth.CustomAuthToken.as_view()),

    # Logout
    path('logout/', auth.Logout.as_view()),

    # Rutas para manejo de archivos e imágenes
    path('upload/', file_views.FileUploadView.as_view(), name='file-upload'),
    path('files/', file_views.ListFilesView.as_view(), name='list-files'),
    path('images/', file_views.ListImagesView.as_view(), name='list-images'),
    path('delete-file/<int:file_id>/',
         file_views.DeleteFileView.as_view(), name='delete-file'),
    path('api/generar-id-reunion/', generar_id_reunion, name='generar_id_reunion'),
    # Incluir rutas del router
    path('', include(router.urls)),

]
# Para servir archivos durante el desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL,
                          document_root=settings.MEDIA_ROOT)

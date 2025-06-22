import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';  // Servicio para manejar la carga de archivos
import { HttpEventType, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-archivos-screen',
  templateUrl: './archivos-screen.component.html',
  styleUrls: ['./archivos-screen.component.scss']
})
export class ArchivosScreenComponent implements OnInit {

  selectedFile: File | null = null;  // Archivo seleccionado
  files: Array<{ id: number, file_url: string }> = [];  // Lista de archivos con id y URL
  images: Array<{ id: number, file_url: string }> = []; // Lista de imágenes con id y URL
  message = '';          // Mensaje de estado de la carga
  showFiles = false;     // Mostrar la lista de archivos
  showImages = false;    // Mostrar la lista de imágenes
  showBackButton = false; // Mostrar el botón de volver
  // Varibales
  public tipo: string = "registro-usuarios";

  constructor(private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.loadFiles();   // Cargar lista de archivos al inicio
    this.loadImages();  // Cargar lista de imágenes al inicio
  }

  // Manejar la selección de archivo
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // Subir archivo seleccionado
  onUpload() {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.fileUploadService.uploadFile(formData).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            this.message = `Subiendo: ${Math.round(100 * event.loaded / event.total)}%`;
          } else if (event instanceof HttpResponse) {
            this.message = 'Archivo subido exitosamente.';
            this.loadFiles();   // Recargar archivos después de la carga
            this.loadImages();  // Recargar imágenes después de la carga
          }
        },
        error: (err: any) => {
          this.message = 'Error al subir archivo.';
        }
      });
    }
  }

  // Cargar archivos desde el backend
  loadFiles() {
    this.fileUploadService.getFiles().subscribe({
      next: (response: any) => {
        // Mapeamos la respuesta para que contenga id y URL de cada archivo
        this.files = response.map((file: any) => ({
          id: file.id,
          file_url: file.file_url
        }));
      },
      error: () => {
        this.message = 'Error al cargar archivos.';
      }
    });
  }

  // Cargar imágenes desde el backend
  loadImages() {
    this.fileUploadService.getImages().subscribe({
      next: (response: any) => {
        // Mapeamos la respuesta para que contenga id y URL de cada imagen
        this.images = response.map((image: any) => ({
          id: image.id,
          file_url: image.file_url
        }));
      },
      error: () => {
        this.message = 'Error al cargar imágenes.';
      }
    });
  }

  // Descargar archivo o imagen en nueva pestaña
  downloadFile(fileUrl: string) {
    window.open(fileUrl, '_blank');
  }

  // Eliminar archivo o imagen con confirmación
  deleteFile(fileId: number) {
    if (!fileId) {
      console.error('ID del archivo no válido.');
      return;
    }

    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar este archivo?');
    if (confirmDelete) {
      this.fileUploadService.deleteFile(fileId).subscribe({
        next: () => {
          this.message = 'Archivo eliminado correctamente.';
          this.loadFiles();  // Recargar archivos después de la eliminación
          this.loadImages(); // Recargar imágenes después de la eliminación
        },
        error: (err) => {
          this.message = 'Error al eliminar archivo.';
        }
      });
    }
  }

  // Cambiar a vista de archivos
  viewFiles() {
    this.showFiles = true;
    this.showImages = false;
    this.showBackButton = true;
  }

  // Cambiar a vista de imágenes
  viewImages() {
    this.showFiles = false;
    this.showImages = true;
    this.showBackButton = true;
  }

  // Volver a la vista principal
  goBack() {
    this.showFiles = false;
    this.showImages = false;
    this.showBackButton = false;
  }
}

# 🚀 Workle: Plataforma Colaborativa en Tiempo Real

## 🎯 Descripción General

**Workle** es una **plataforma web colaborativa**. Ofrece herramientas integradas como:

- Videollamadas
- Calendario interactivo con eventos arrastrables  
- Gestión y visualización de archivos (PDF, imágenes, DOCX…)  

---

## 🗂️ Estructura del Proyecto

- **Backend**: `colaborativo_api/` *(Django REST)*  
  - Modelos configurados para eventos, archivos y usuarios  
  - Autenticación mediante JWT  

- **Frontend**: `colaborativo-webapp/` *(Angular 16)*  
  - Componentes principales:
    - `videollamadas-screen/` → integración WebSocket
    - `calendarios-screen/` → FullCalendar.js + Angular Material
    - `archivos-screen/` → explorador de archivos y fotos
  - Estilos con Bootstrap y Angular Material

---

## 🛠️ Tecnologías

- **Frontend**: Angular 16, Angular Material, Bootstrap 
- **Backend**: Django REST Framework, MySQL  
- **Tiempo real**: WebSockets
- **UI**: API FullCalendar

---

## 📸 Capturas de Pantalla  

### 1. Vista de Sala de Reuniones  

<img src="https://github.com/user-attachments/assets/418960df-3a45-4ea3-babd-d9ad42a2e4ea" width="400">


### 2. Calendario

<img src="https://github.com/user-attachments/assets/02093d4a-b866-49ea-9471-18e694c054e2" width="400">


### 3. Videollamadas

<img src="https://github.com/user-attachments/assets/5b9ba90d-e519-4699-ad65-e157da021d92" width="400">

---

## 🔑 Funcionalidades

- Videollamadas en tiempo real entre usuarios (WebSocket)  
- Calendario con eventos arrastrables e interacción dinámica  
- Subida y vista previa de archivos de forma colaborativa

---

## 🙌 Autor

**Fernando Garza de la Luz**

---

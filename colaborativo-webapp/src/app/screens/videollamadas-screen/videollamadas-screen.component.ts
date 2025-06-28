import { Component, OnInit, OnDestroy } from '@angular/core';
import { VideollamadasService } from 'src/app/services/videollamadas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-videollamadas-screen',
  templateUrl: './videollamadas-screen.component.html',
  styleUrls: ['./videollamadas-screen.component.scss']
})
export class VideollamadasScreenComponent implements OnInit, OnDestroy {
  private socket: WebSocket | null = null;
  localStream: MediaStream | null = null;
  microphoneEnabled: boolean = false;
  cameraEnabled: boolean = false;
  screenSharingEnabled: boolean = false;
  // messages: string[] = [];
  message: string = '';
  meetingLink: string | null = null;
  messages: Array<{ sender: string, text: string }> = [];


  // Gestión de participantes
  participants: Array<{ name: string, stream: MediaStream | null }> = [];
  activeParticipant: { name: string, stream: MediaStream | null } | null = null;

  constructor(private videollamadasService: VideollamadasService, private router: Router) { }

  ngOnInit(): void {
    this.socket = new WebSocket('ws://127.0.0.1:8000/ws/videocall/room_name/');
    this.socket.onmessage = (event) => {
      const mensaje = event.data;
      this.messages.push(mensaje);
    };

    this.socket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    this.generateMeetingLink(); // Generar el enlace al iniciar el componente
  }

  ngOnDestroy(): void {
    this.stopLocalStream(); // Apagar la cámara y micrófono al salir del componente
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }

  private stopLocalStream(): void {
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop()); // Detener todas las pistas del stream
      this.localStream = null;
      this.microphoneEnabled = false;
      this.cameraEnabled = false;
    }
  }

  toggleMicrophone(): void {
    if (!this.localStream) {
      navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      }).then(stream => {
        this.localStream = stream;
        this.addParticipantStream('You', stream);
        this.microphoneEnabled = true;
        this.attachStreamToVideoElement();
        this.sendMediaStatus('audio', true);
      }).catch(err => console.error('Error al acceder al micrófono:', err));
    } else {
      const audioTracks = this.localStream.getAudioTracks();
      if (audioTracks.length > 0) {
        this.microphoneEnabled = !this.microphoneEnabled;
        audioTracks[0].enabled = this.microphoneEnabled;
        this.sendMediaStatus('audio', this.microphoneEnabled);
      } else {
        navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        }).then(stream => {
          const audioTrack = stream.getAudioTracks()[0];
          this.localStream?.addTrack(audioTrack);
          this.microphoneEnabled = true;
          this.attachStreamToVideoElement();
          this.sendMediaStatus('audio', true);
        }).catch(err => console.error('Error al acceder al micrófono:', err));
      }
    }
  }


  toggleCamera(): void {
    if (!this.localStream) {
      // Si no existe un stream local, solicitar acceso tanto a audio como video
      navigator.mediaDevices.getUserMedia({ video: true, audio: this.microphoneEnabled }).then(stream => {
        const videoTrack = stream.getVideoTracks()[0];
        this.localStream = stream; // Asignar el stream local

        this.addParticipantStream('You', stream);  // Añadir el stream local a la lista de participantes
        this.attachStreamToVideoElement(); // Asignar el stream al elemento de video

        this.cameraEnabled = true; // Marcar la cámara como habilitada
        this.sendMediaStatus('video', true); // Enviar el estado del video
      }).catch(err => console.error('Error al acceder a la cámara:', err));
    } else {
      const videoTracks = this.localStream.getVideoTracks();
      if (videoTracks.length > 0) {
        this.cameraEnabled = false;
        videoTracks[0].stop(); // Detener la pista de video
        this.localStream.removeTrack(videoTracks[0]); // Remover la pista de video del stream
        this.sendMediaStatus('video', false);
      } else {
        // Si no existe una pista de video, solicitar acceso a la cámara
        navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
          const videoTrack = stream.getVideoTracks()[0];
          this.localStream?.addTrack(videoTrack); // Agregar pista de video al stream local
          this.cameraEnabled = true;
          this.attachStreamToVideoElement();
          this.sendMediaStatus('video', true);
        }).catch(err => console.error('Error al acceder a la cámara:', err));
      }
    }
  }

  shareScreen(): void {
    if (!this.screenSharingEnabled) {
      // Iniciar pantalla compartida
      navigator.mediaDevices.getDisplayMedia({ video: true }).then(screenStream => {
        this.screenSharingEnabled = true;
        this.activeParticipant = { name: 'You (Screen)', stream: screenStream };
        const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
        if (localVideo) {
          localVideo.srcObject = screenStream;
        }

        // Agregar el audio si existe un stream de audio
        if (this.localStream) {
          const audioTrack = this.localStream.getAudioTracks()[0];
          if (audioTrack) {
            screenStream.addTrack(audioTrack); // Añadir la pista de audio del localStream al screenStream
          }
        }

        this.sendMediaStatus('screen', true);

        // Cuando se detiene la pantalla compartida
        screenStream.getVideoTracks()[0].onended = () => {
          this.screenSharingEnabled = false;
          if (this.cameraEnabled && this.localStream) {
            if (localVideo) {
              localVideo.srcObject = this.localStream;
            }
          }
          this.sendMediaStatus('screen', false);
        };
      }).catch(err => {
        console.error('Error al compartir pantalla:', err);
        if (err.name === 'NotAllowedError') {
          console.log('El permiso de compartir pantalla fue denegado.');
        }
      });
    } else {
      // Detener pantalla compartida
      const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
      if (this.activeParticipant?.stream) {
        // Detener solo la pista de video del screenStream sin afectar el audio
        this.activeParticipant.stream.getVideoTracks().forEach(track => track.stop());
      }

      this.screenSharingEnabled = false;
      if (this.cameraEnabled && this.localStream && localVideo) {
        localVideo.srcObject = this.localStream;  // Volver al stream de la cámara
      }
      this.sendMediaStatus('screen', false);
    }
  }

  enviarMensaje(): void {
    if (this.message.trim() && this.socket && this.socket.readyState === WebSocket.OPEN) {
      const mensaje = {
        sender: 'You',  // Aquí defines el remitente (puedes cambiarlo según tu lógica)
        text: this.message
      };
      this.socket.send(JSON.stringify({
        type: 'message',
        message: this.message
      }));
      this.messages.push(mensaje);  // Añadir el objeto mensaje
      this.message = '';  // Limpiar el campo de texto
    }
  }


  copiarAlPortapapeles(): void {
    if (this.meetingLink) {
      navigator.clipboard.writeText(this.meetingLink).then(() => {
        console.log('Enlace copiado al portapapeles');
      }).catch(err => {
        console.error('Error al copiar el enlace:', err);
      });
    }
  }

  leaveCall(): void {
    this.stopLocalStream();  // Detener todos los streams y apagar dispositivos
    if (this.socket) {
      this.socket.close();
    }
    console.log('Has abandonado la reunión');
    this.router.navigate(['/home']);  // Redirigir al home
  }

  private attachStreamToVideoElement(): void {
    const localVideo = document.getElementById('localVideo') as HTMLVideoElement;
    if (this.localStream && localVideo) {
      localVideo.srcObject = this.localStream;
    }
  }

  private sendMediaStatus(type: string, enabled: boolean): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const statusMessage = JSON.stringify({ type, enabled });
      this.socket.send(statusMessage);
    } else {
      console.warn('WebSocket no está abierto. No se envió:', { type, enabled });
    }
  }
  

  private generateMeetingLink(): void {
    this.videollamadasService.generarEnlaceReunion()
      .subscribe(response => {
        const roomId = response.roomId;
        this.meetingLink = `http://localhost:4200/videollamada/${roomId}`;  // Crear el link de la reunión
      }, error => {
        console.error('Error al generar el ID de la reunión:', error);
      });
  }

  // Añadir el stream del participante
  private addParticipantStream(name: string, stream: MediaStream): void {
    const existingParticipant = this.participants.find(p => p.name === name);
    if (existingParticipant) {
      existingParticipant.stream = stream;
    } else {
      this.participants.push({ name, stream });
    }
    if (!this.activeParticipant) {
      this.activeParticipant = { name, stream }; // El primer participante será el activo
    }
  }
}

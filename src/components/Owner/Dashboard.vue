<template>
  <HeadingAdmin>
    <div class="main-layout">
      <main class="dashboard-content">
        <div class="gym-brand-card">
          <h1 class="gym-name-display">
            ULTRA <span class="highlight-blue">FITNESS</span> CENTER
          </h1>
          <p class="gym-subtitle">Sistema de Gestión de Alto Rendimiento</p>
        </div>

        <div class="attendance-methods">
          <button class="attendance-btn glass-effect" @click="openCamera('facial')">
            <svg class="svg-btn" viewBox="0 0 24 24"><path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/></svg>
            <span>Asistencia Facial</span>
          </button>
          <button class="attendance-btn glass-effect" @click="openCamera('scanner')">
            <svg class="svg-btn" viewBox="0 0 24 24"><path d="M4 4h7V11H4V4M13 4h7V11h-7V4M4 13h7v7H4v-7M13 13h3v2h-3v-2M18 13h2v2h-2v-2M13 15h2v2h-2v-2M15 18h2v2h-2v-2M18 18h2v2h-2v-2M13 18h2v2h-2v-2M18 15h2v2h-2v-2z"/></svg>
            <span>Escáner QR</span>
          </button>
        </div>

        <div class="action-buttons-container">
          <button class="action-card primary" @click="activeModal = 'add-schedule'">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" class="svg-btn"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
            </div>
            <div class="card-info">
              <span class="main-text">Añadir Horario</span>
              <span class="sub-text">Gestión de turnos</span>
            </div>
          </button>
          <button class="action-card secondary" @click="activeModal = 'view-schedule'">
            <div class="action-icon">
              <svg viewBox="0 0 24 24" class="svg-btn"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
            </div>
            <div class="card-info">
              <span class="main-text">Ver Horario</span>
              <span class="sub-text">Lunes a Domingo</span>
            </div>
          </button>
        </div>
      </main>
      
      <NotificationsPanel 
        :is-open="isNotificationsOpen" 
        :notifications="notifications" 
        @close="isNotificationsOpen = false"
      />

      <transition name="pop">
        <div v-if="activeModal" class="modal-wrapper" @click.self="closeModal">
          
          <AddScheduleModal v-if="activeModal === 'add-schedule'" @close="closeModal" />
          <ViewScheduleModal v-if="activeModal === 'view-schedule'" @close="closeModal" />

          <div v-if="activeModal === 'facial' || activeModal === 'scanner'" class="camera-panel glass-effect">
            <div class="panel-header">
              <h3>{{ activeModal === 'facial' ? 'Escaneo Facial' : 'Escaneando QR' }}</h3>
              <button class="close-panel" @click="closeModal">&times;</button>
            </div>
            <div class="camera-container">
              <video ref="videoPlayer" autoplay playsinline class="video-feed"></video>
              <div v-if="activeModal === 'facial'" class="face-overlay"></div>
              <div v-if="activeModal === 'scanner'" class="qr-overlay"><div class="scanner-line"></div></div>
            </div>
            <div class="panel-footer">
              <p v-if="activeModal === 'facial'">Coloca tu rostro dentro del círculo</p>
              <p v-else>Centra el código QR en el recuadro</p>
              <button class="action-btn-full outline" @click="closeModal">Cancelar</button>
            </div>
          </div>

          <div v-if="activeModal === 'qr'" class="custom-panel glass-effect">
            <div class="panel-header">
              <h3>Código QR de Acceso</h3>
              <button class="close-panel" @click="activeModal = null">&times;</button>
            </div>
            <div class="panel-body qr-view">
              <div class="qr-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ULTRAFITNESS" alt="QR Code">
              </div>
              <p>Muestra este código en la entrada para que los socios registren su asistencia.</p>
              <button class="action-btn-full">Descargar para Imprimir</button>
            </div>
          </div>

          <div v-if="activeModal === 'website'" class="custom-panel glass-effect">
            <div class="panel-header">
              <h3>Tu Sitio Web</h3>
              <button class="close-panel" @click="activeModal = null">&times;</button>
            </div>
            <div class="panel-body web-view">
              <div class="web-preview">
                 <svg viewBox="0 0 24 24" class="large-svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H9v-2h6v2zm4-4H5V6h14v8z"/></svg>
              </div>
              <p>Gestiona la apariencia pública de tu gimnasio desde aquí.</p>
              <button class="action-btn-full outline">Visitar Sitio Público</button>
              <button class="action-btn-full">Configurar landing page</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </HeadingAdmin>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import Sidebar from '../../components/Owner/Sidebar.vue';
import NotificationsPanel from './Notifications/NotificationsPanel.vue';
import AddScheduleModal from '../Modals/AddScheduleModal.vue';
import ViewScheduleModal from '../Modals/ViewScheduleModal.vue';
import HeadingAdmin from './HeadingOwner.vue';

const isSidebarOpen = ref(false);
const isNotificationsOpen = ref(false);
const activeModal = ref(null);
const videoPlayer = ref(null);
let stream = null;

const notifications = ref([
  { id: 1, title: 'Carlos Atleta', message: 'Cliente inactivo por 29 días', time: 'hace 7 días', read: false },
  { id: 2, title: 'Sofia Runner', message: 'Cliente inactivo por 26 días', time: 'hace 7 días', read: false },
  { id: 3, title: 'Pedro Crossfit', message: 'Cliente inactivo por 25 días', time: 'hace 7 días', read: false }
]);

const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };

const openCamera = async (type) => {
  activeModal.value = type;
  try {
    setTimeout(async () => {
      stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: type === 'scanner' ? 'environment' : 'user' } 
      });
      if (videoPlayer.value) {
        videoPlayer.value.srcObject = stream;
      }
    }, 100);
  } catch (err) {
    console.error("Error al acceder a la cámara: ", err);
    alert("No se pudo acceder a la cámara. Verifica los permisos.");
    activeModal.value = null;
  }
};

const closeModal = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
  activeModal.value = null;
};

onBeforeUnmount(() => closeModal());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;700&display=swap');

.dashboard-wrapper {
  display: flex;
  min-height: 100vh;
  background: #0a0a0a;
  position: relative;
  overflow-x: hidden;
  font-family: 'Inter', sans-serif;
  color: #f5f5f4;
}

.sidebar-container {
  width: 280px;
  background: #121212;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(-100%); 
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 3000;
  box-shadow: 10px 0 30px rgba(0,0,0,0.5);
}

.sidebar-open .sidebar-container { transform: translateX(0); }

.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2500;
  backdrop-filter: blur(6px);
}

.main-layout {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  transition: margin-left 0.4s ease;
}

@media (min-width: 1024px) {
  .sidebar-open .main-layout { margin-left: 280px; }
}

.top-nav {
  display: flex;
  justify-content: space-between;
  padding: 16px 24px;
  background: rgba(18, 18, 18, 0.7);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.09);
}

.nav-left, .nav-right { display: flex; gap: 16px; align-items: center; }

.toggle-btn, .nav-action-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.toggle-btn:hover, .nav-action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #1c4fd6;
  transform: translateY(-2px);
}

.notification { position: relative; }

.dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  background: #1c4fd6;
  border-radius: 50%;
  box-shadow: 0 0 8px #1c4fd6;
}

.svg-icon { width: 22px; height: 22px; fill: none; stroke: #f5f5f4; stroke-width: 2; }

.dashboard-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  gap: 32px;
}

.gym-brand-card {
  text-align: center;
  padding: 40px;
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 24px;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
}

.gym-name-display {
  font-family: 'Archivo Black', sans-serif;
  font-size: 2.4rem;
  color: #f5f5f4;
  margin: 0;
  letter-spacing: -1px;
}

.highlight-blue {
  color: #1c4fd6;
}

.gym-subtitle { color: rgba(245, 245, 244, 0.55); margin-top: 12px; font-size: 1rem; font-weight: 500; }

.attendance-methods { display: flex; gap: 20px; width: 100%; max-width: 550px; }

.attendance-btn {
  flex: 1;
  padding: 24px 16px;
  border-radius: 16px;
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  color: #f5f5f4;
  transition: all 0.2s ease;
}

.attendance-btn:hover { 
  background: #1c4fd6; 
  border-color: #1c4fd6;
  box-shadow: 0 8px 24px rgba(28, 79, 214, 0.3);
  transform: translateY(-2px);
}

.action-buttons-container { display: flex; gap: 20px; width: 100%; max-width: 550px; }

.action-card {
  flex: 1;
  height: 120px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  padding: 24px;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #121212;
  color: #f5f5f4;
}

.action-icon {
  background: rgba(28, 79, 214, 0.15);
  padding: 12px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1c4fd6;
}

.svg-btn { width: 28px; height: 28px; fill: currentColor; }

.card-info { display: flex; flex-direction: column; text-align: left; }

.main-text { font-family: 'Oswald', sans-serif; font-size: 1.05rem; }

.sub-text { font-size: 0.85rem; color: rgba(245, 245, 244, 0.55); margin-top: 4px; }

.action-card:hover { 
  transform: translateY(-3px); 
  border-color: #1c4fd6;
  background: #161616;
}

.modal-wrapper {
  position: fixed; inset: 0; z-index: 4000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
}

.custom-panel, .camera-panel {
  background: #121212;
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: #f5f5f4;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  width: 92%;
  max-width: 440px;
}

.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

.panel-header h3 { font-family: 'Oswald', sans-serif; font-size: 1.3rem; margin: 0; color: #1c4fd6; }

.close-panel {
  background: rgba(255, 255, 255, 0.03);
  border: none; color: #f5f5f4;
  font-size: 1.6rem; width: 36px; height: 36px;
  border-radius: 12px; cursor: pointer;
  transition: all 0.2s ease;
}

.close-panel:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.panel-body { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px; }

.qr-container { background: #f5f5f4; padding: 16px; border-radius: 16px; }
.qr-container img { width: 180px; height: 180px; display: block; }

.web-preview {
  width: 70px; height: 70px; background: rgba(255, 255, 255, 0.03);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
}

.large-svg { width: 32px; fill: #f5f5f4; }

.panel-body p, .panel-footer p { color: rgba(245, 245, 244, 0.55); font-size: 0.95rem; line-height: 1.6; margin: 0; }

.action-btn-full {
  width: 100%; padding: 14px; border-radius: 12px; border: none;
  background: #1c4fd6; color: #ffffff;
  font-family: 'Oswald', sans-serif; font-size: 0.95rem;
  cursor: pointer; transition: all 0.2s ease;
}

.action-btn-full.outline {
  background: transparent; border: 1.5px solid rgba(255, 255, 255, 0.15);
  color: #f5f5f4; margin-top: 8px;
}

.action-btn-full:hover { background: #123ba0; transform: translateY(-1px); }

.camera-container {
  position: relative; width: 100%; aspect-ratio: 4 / 3;
  background: #000000; border-radius: 16px; overflow: hidden;
  margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.12);
}

.video-feed { width: 100%; height: 100%; object-fit: cover; }

.face-overlay {
  position: absolute; inset: 0; background-color: rgba(0, 0, 0, 0.6);
  mask: radial-gradient(circle, transparent 50%, black 50%);
}

.qr-overlay {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 220px; height: 220px; border: 2.5px solid #1c4fd6;
  border-radius: 16px; box-shadow: 0 0 0 1000px rgba(0,0,0,0.5);
}

.scanner-line {
  position: absolute; width: 100%; height: 3px; background: #1c4fd6;
  box-shadow: 0 0 12px #1c4fd6; animation: scan 2.2s infinite ease-in-out;
}

@keyframes scan { 0%, 100% { top: 0%; } 50% { top: 100%; } }

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 680px) {
  .attendance-methods, .action-buttons-container { flex-direction: column; }
  .action-card { height: 100px; }
  .gym-name-display { font-size: 1.8rem; }
  .dashboard-content { padding: 24px 16px; }
  .custom-panel, .camera-panel { padding: 24px 20px; }
}
</style>
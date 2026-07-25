<template>
  <div class="app-wrapper" :class="{ 'sidebar-open': isSidebarOpen }">
    <transition name="fade">
      <div v-if="isSidebarOpen" class="sidebar-overlay" @click="toggleSidebar"></div>
    </transition>

    <aside class="sidebar-container">
      <Sidebar />
    </aside>

    <div class="main-layout-container">
      <nav class="top-nav">
        <div class="nav-left">
          <button class="nav-action-btn glass-effect" @click="toggleSidebar" aria-label="Abrir menú">
            <svg viewBox="0 0 24 24" class="svg-icon">
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
            </svg>
          </button>
        </div>

        <div class="nav-right">
          <button class="nav-action-btn glass-effect" @click="activeModal = 'qr'" title="QR del Gimnasio">
            <svg viewBox="0 0 24 24" class="svg-icon"><path d="M3 4.5V8h2V4.5A1.5 1.5 0 0 1 6.5 3H10V1H6.5A3.5 3.5 0 0 0 3 4.5zm14.5-3.5H14v2h3.5A1.5 1.5 0 0 1 19 4.5V8h2V4.5A3.5 3.5 0 0 0 17.5 1zM3 17.5V14h2v3.5A1.5 1.5 0 0 0 6.5 19H10v2H6.5A3.5 3.5 0 0 1 3 17.5zm18 0V14h-2v3.5a1.5 1.5 0 0 1-1.5 1.5H14v2h3.5a3.5 3.5 0 0 1 3.5-3.5zM7 7h4v4H7V7zm5-1h4v4h-4V6zM7 13h4v4H7v-4zm5 0h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm3-2h1v1h-1v-1zm-1 1h1v1h-1v-1zm1 1h1v1h-1v-1z"/></svg>
          </button>
          <button class="nav-action-btn glass-effect notification" @click="isNotificationsOpen = true" title="Notificaciones">
            <span class="dot"></span>
            <svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          </button>
        </div>
      </nav>
      
      <main class="main-content-wrapper">
        <slot /> 
      </main>
    </div>

    <transition name="pop">
      <div v-if="activeModal" class="modal-wrapper" @click.self="activeModal = null">
        <div v-if="activeModal === 'qr'" class="custom-panel glass-effect">
          <div class="panel-header">
            <h3>Código QR de Acceso</h3>
            <button class="close-panel" @click="activeModal = null">&times;</button>
          </div>
          <div class="panel-body">
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
          <div class="panel-body">
            <div class="qr-preview-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ULTRAFITNESS-WEB" alt="QR Sitio Web" class="preview-qr-img">
            </div>
            <p>Gestiona la apariencia pública de tu gimnasio desde aquí.</p>
            <button class="action-btn-full outline">Visitar Sitio Público</button>
            <button class="action-btn-full">Descargar QR</button>
          </div>
        </div>
      </div>
    </transition>

    <NotificationsPanel :is-open="isNotificationsOpen" :notifications="notifications" @close="isNotificationsOpen = false" />
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Oswald&display=swap');

.app-wrapper { 
  min-height: 100vh; 
  background: #0a0a0a; 
  font-family: 'Inter', sans-serif; 
  position: relative;
  overflow-x: hidden;
}

.sidebar-container { 
  width: 280px; 
  height: 100vh; 
  position: fixed; 
  top: 0; 
  left: 0; 
  background: #121212; 
  transform: translateX(-100%); 
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); 
  z-index: 3000; 
  box-shadow: 10px 0 30px rgba(0,0,0,0.5);
}

.sidebar-open .sidebar-container { transform: translateX(0); }

.sidebar-overlay { 
  position: fixed; 
  inset: 0; 
  background: rgba(0, 0, 0, 0.6); 
  z-index: 2999; 
  backdrop-filter: blur(6px);
  cursor: pointer; 
}

.main-layout-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  transition: margin-left 0.4s ease;
}

@media (min-width: 1024px) {
  .sidebar-open .main-layout-container { 
    margin-left: 280px; 
    width: calc(100% - 280px);
  }
}

.top-nav { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  padding: 16px 24px; 
  background: rgba(18, 18, 18, 0.7); 
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.09); 
  position: sticky;
  top: 0;
  z-index: 1000;
}

.nav-left, .nav-right { display: flex; gap: 16px; align-items: center; }

.nav-action-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 12px; 
  border-radius: 12px;
  cursor: pointer; 
  display: flex; 
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-action-btn:hover { 
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08); 
  border-color: #1c4fd6; 
  box-shadow: 0 4px 12px rgba(28, 79, 214, 0.3);
}

.svg-icon { width: 22px; height: 22px; fill: none; stroke: #f5f5f4; stroke-width: 2; pointer-events: none; }

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

.main-content-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.modal-wrapper {
  position: fixed; 
  inset: 0; 
  z-index: 4000;
  display: flex; 
  align-items: center; 
  justify-content: center;
  background: rgba(0, 0, 0, 0.8); 
  backdrop-filter: blur(8px);
}

.custom-panel {
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
  border: none; 
  color: #f5f5f4;
  font-size: 1.6rem; 
  width: 36px; 
  height: 36px;
  border-radius: 12px; 
  cursor: pointer;
  transition: all 0.2s ease;
}
.close-panel:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.panel-body { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px; }
.qr-container { background: #f5f5f4; padding: 16px; border-radius: 16px; }
.qr-container img { width: 180px; height: 180px; display: block; }

.qr-preview-container {
  width: 150px; 
  height: 150px; 
  background: #f5f5f4;
  border-radius: 16px; 
  display: flex; 
  align-items: center; 
  justify-content: center;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
.preview-qr-img { width: 100%; height: 100%; display: block; }

.panel-body p { color: rgba(245, 245, 244, 0.55); font-size: 0.95rem; line-height: 1.6; margin: 0; }

.action-btn-full {
  width: 100%; 
  padding: 14px; 
  border-radius: 12px; 
  border: none;
  background: #1c4fd6; 
  color: #ffffff;
  font-family: 'Oswald', sans-serif; 
  font-size: 0.95rem;
  cursor: pointer; 
  transition: all 0.2s ease;
}
.action-btn-full.outline {
  background: transparent; 
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  color: #f5f5f4; 
  margin-top: 8px;
}
.action-btn-full:hover { background: #123ba0; transform: translateY(-1px); }

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<script setup>
import { ref } from 'vue';
import Sidebar from './Sidebar.vue';
import NotificationsPanel from './Notifications/NotificationsPanel.vue';

const isSidebarOpen = ref(false);
const isNotificationsOpen = ref(false);
const activeModal = ref(null);
const notifications = ref([{ id: 1, title: 'Sistema', message: 'Bienvenido', time: 'ahora', read: false }]);
const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };
</script>
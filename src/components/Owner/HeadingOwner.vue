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
          <button class="nav-action-btn glass-effect" @click="toggleSidebar" :aria-label="t.abrirMenu">
            <svg viewBox="0 0 24 24" class="svg-icon">
              <path d="M4 4h4v4H4V4zm6 0h4v4h-4V4zm6 0h4v4h-4V4zM4 10h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4zM4 16h4v4H4v-4zm6 0h4v4h-4v-4zm6 0h4v4h-4v-4z"/>
            </svg>
          </button>
          <button class="nav-action-btn glass-effect" @click="activeModal = 'website'" :title="t.irSitioWeb">
            <svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
          </button>
        </div>

        <div class="nav-right">
          <button class="nav-action-btn glass-effect" @click="activeModal = 'qr'" :title="t.qrGimnasio">
            <svg viewBox="0 0 24 24" class="svg-icon"><path d="M3 4.5V8h2V4.5A1.5 1.5 0 0 1 6.5 3H10V1H6.5A3.5 3.5 0 0 0 3 4.5zm14.5-3.5H14v2h3.5A1.5 1.5 0 0 1 19 4.5V8h2V4.5A3.5 3.5 0 0 0 17.5 1zM3 17.5V14h2v3.5A1.5 1.5 0 0 0 6.5 19H10v2H6.5A3.5 3.5 0 0 1 3 17.5zm18 0V14h-2v3.5a1.5 1.5 0 0 1-1.5 1.5H14v2h3.5a3.5 3.5 0 0 1 3.5-3.5zM7 7h4v4H7V7zm5-1h4v4h-4V6zM7 13h4v4H7v-4zm5 0h1v1h-1v-1zm1 1h1v1h-1v-1zm-1 1h1v1h-1v-1zm3-2h1v1h-1v-1zm-1 1h1v1h-1v-1zm1 1h1v1h-1v-1z"/></svg>
          </button>
          <button class="nav-action-btn glass-effect notification" @click="isNotificationsOpen = true" :title="t.notificaciones">
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
            <h3>{{ t.codigoQrAcceso }}</h3>
            <button class="close-panel" @click="activeModal = null">&times;</button>
          </div>
          <div class="panel-body">
            <div class="qr-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ULTRAFITNESS" alt="QR Code">
            </div>
            <p>{{ t.muestraCodigoAsistencia }}</p>
            <button class="action-btn-full">{{ t.descargarImprimir }}</button>
          </div>
        </div>

        <div v-if="activeModal === 'website'" class="custom-panel glass-effect">
          <div class="panel-header">
            <h3>{{ t.tuSitioWeb }}</h3>
            <button class="close-panel" @click="activeModal = null">&times;</button>
          </div>
          <div class="panel-body">
            <div class="qr-preview-container">
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ULTRAFITNESS-WEB" alt="QR Sitio Web" class="preview-qr-img">
            </div>
            <p>{{ t.gestionaApariencia }}</p>
            <button class="action-btn-full outline">{{ t.visitarSitioPublico }}</button>
            <button class="action-btn-full">{{ t.descargarQr }}</button>
          </div>
        </div>
      </div>
    </transition>

    <NotificationsPanel :is-open="isNotificationsOpen" :notifications="notifications" @close="isNotificationsOpen = false" />
  </div>
</template>

<style scoped>
/* (Tus estilos se quedan exactamente igual) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Oswald&display=swap');

.app-wrapper { 
  min-height: 100vh; 
  background: var(--bg-custom, #0a0a0a); 
  font-family: 'Inter', sans-serif; 
  position: relative;
  overflow-x: hidden;
  transition: background 0.3s ease; 
}

.custom-panel {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: var(--color-texto-general, #f5f5f4);
  border-radius: var(--app-border-radius, 24px); 
  padding: 32px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  width: 92%;
  max-width: 440px;
}

.sidebar-container { 
  width: 280px; 
  height: 100vh; 
  position: fixed; 
  top: 0; 
  left: 0; 
  background: var(--bg-cards, #121212); 
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
  background: var(--color-heading-bg, rgba(18, 18, 18, 0.7)); 
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.09); 
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: background-color 0.3s ease;
}

.nav-left, .nav-right { display: flex; gap: 16px; align-items: center; }

.nav-action-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 12px; 
  border-radius: var(--app-border-radius, 12px);
  cursor: pointer; 
  display: flex; 
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.nav-action-btn:hover { 
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.08); 
  border-color: var(--color-highlight, #3b82f6); 
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.svg-icon { 
  width: 22px; 
  height: 22px; 
  fill: none; 
  stroke: var(--color-svg, #f5f5f4); 
  stroke-width: 2; 
  pointer-events: none; 
}

.notification { position: relative; }
.dot { 
  position: absolute; 
  top: 10px; 
  right: 10px; 
  width: 8px; 
  height: 8px; 
  background: var(--color-highlight, #3b82f6); 
  border-radius: 50%; 
  box-shadow: 0 0 8px var(--color-highlight, #3b82f6);
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

.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }

.panel-header h3 { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.3rem; 
  margin: 0; 
  color: var(--color-titulos, #ffffff);
}

.close-panel {
  background: rgba(255, 255, 255, 0.03);
  border: none; 
  color: var(--color-texto-general, #f5f5f4);
  font-size: 1.6rem; 
  width: 36px; 
  height: 36px;
  border-radius: var(--app-border-radius, 12px); 
  cursor: pointer;
  transition: all 0.2s ease;
}
.close-panel:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.panel-body { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 24px; }
.qr-container { background: var(--color-etiquetas, #f5f5f4); padding: 16px; border-radius: var(--app-border-radius, 16px); }
.qr-container img { width: 180px; height: 180px; display: block; }

.qr-preview-container {
  width: 150px; 
  height: 150px; 
  background: var(--color-etiquetas, #f5f5f4);
  border-radius: var(--app-border-radius, 16px); 
  display: flex; 
  align-items: center; 
  justify-content: center;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}
.preview-qr-img { width: 100%; height: 100%; display: block; }

.panel-body p { color: var(--color-texto-general, rgba(245, 245, 244, 0.55)); font-size: 0.95rem; line-height: 1.6; margin: 0; }

.action-btn-full {
  width: 100%; 
  padding: 14px; 
  border-radius: var(--app-border-radius, 12px); 
  border: none;
  background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, #ffffff);
  font-family: 'Oswald', sans-serif; 
  font-size: 0.95rem;
  cursor: pointer; 
  transition: all 0.2s ease;
}
.action-btn-full.outline {
  background: transparent; 
  border: 1.5px solid rgba(255, 255, 255, 0.15);
  color: var(--color-etiquetas, #f5f5f4); 
  margin-top: 8px;
}
.action-btn-full:hover { filter: brightness(0.9); transform: translateY(-1px); }

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import Sidebar from './Sidebar.vue';
import NotificationsPanel from './Notifications/NotificationsPanel.vue';
import { traducciones } from './i18n.js';
import { useLang } from './useLang.js';

const { lang, setLang } = useLang();

// Función que se ejecuta al hacer clic en cambiar idioma (ej: alternar español/inglés)
const toggleIdioma = () => {
  const nuevo = lang.value === 'es' ? 'en' : 'es';
  setLang(nuevo); // Esto actualiza instantáneamente el Dashboard y toda la app
};

const isSidebarOpen = ref(false);
const isNotificationsOpen = ref(false);
const activeModal = ref(null);
const notifications = ref([{ id: 1, title: 'Sistema', message: 'Bienvenido', time: 'ahora', read: false }]);

// Ejemplo de función al cambiar idioma en HeadingOwner.vue
const cambiarIdiomaApp = (nuevoIdioma) => {
  localStorage.setItem('appLang', nuevoIdioma);
  
  // ¡Importante! Esto fuerza a que el Dashboard se entere al instante del cambio
  window.dispatchEvent(new Event('language-changed'));
};

// Estado reactivo para el idioma actual en todo el layout
const idiomaActual = ref(localStorage.getItem('owner-idioma') || 'es');

// Propiedad computada para las traducciones
const t = computed(() => traducciones[idiomaActual.value] || traducciones.es);

const toggleSidebar = () => { isSidebarOpen.value = !isSidebarOpen.value; };

const handleIdiomaChanged = (event) => {
  if (event.detail && event.detail.idioma) {
    idiomaActual.value = event.detail.idioma;
  }
};

const aplicarEstilosGlobales = () => {
  const savedColors = JSON.parse(localStorage.getItem('app-colors'));
  const savedRadius = localStorage.getItem('app-radius');
  const savedDensidad = localStorage.getItem('app-densidad');

  const root = document.documentElement;

  if (savedColors) {
    if (savedColors.headingBg) root.style.setProperty('--color-heading-bg', savedColors.headingBg);
    if (savedColors.tablas) root.style.setProperty('--color-tablas', savedColors.tablas);
    if (savedColors.interfaz) {
      root.style.setProperty('--color-interfaz', savedColors.interfaz);
      root.style.setProperty('--bg-custom', savedColors.interfaz);
    }
    if (savedColors.botones) root.style.setProperty('--color-botones', savedColors.botones);
    if (savedColors.tarjetas) root.style.setProperty('--bg-cards', savedColors.tarjetas);
    if (savedColors.titulos) root.style.setProperty('--color-titulos', savedColors.titulos);
    if (savedColors.highlight) root.style.setProperty('--color-highlight', savedColors.highlight);
    if (savedColors.etiquetas) root.style.setProperty('--color-etiquetas', savedColors.etiquetas);
    if (savedColors.textoGeneral) root.style.setProperty('--color-texto-general', savedColors.textoGeneral);
    if (savedColors.textoBotones) root.style.setProperty('--color-texto-botones', savedColors.textoBotones);
    if (savedColors.svgColor) root.style.setProperty('--color-svg', savedColors.svgColor);
  }
  
  if (savedRadius) {
    root.style.setProperty('--app-border-radius', savedRadius);
  }
  
  if (savedDensidad === 'compacto') {
    root.style.setProperty('--panel-padding', '16px');
    root.style.setProperty('--row-padding', '10px 0');
  } else if (savedDensidad === 'espacioso') {
    root.style.setProperty('--panel-padding', '38px');
    root.style.setProperty('--row-padding', '22px 0');
  } else {
    root.style.setProperty('--panel-padding', '30px');
    root.style.setProperty('--row-padding', '16px 0');
  }
};

onMounted(() => {
  aplicarEstilosGlobales();
  window.addEventListener('app-settings-updated', aplicarEstilosGlobales);
  window.addEventListener('idioma-changed', handleIdiomaChanged);
});

onUnmounted(() => {
  window.removeEventListener('app-settings-updated', aplicarEstilosGlobales);
  window.removeEventListener('idioma-changed', handleIdiomaChanged);
});
</script>
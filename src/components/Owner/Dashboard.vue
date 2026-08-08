<template>
  <HeadingAdmin :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="saas-dashboard-wrapper">
      
      <main class="dashboard-main-container">
        
        <section class="hero-metrics-grid">
          
          <div class="glass-card gym-identity-box" id="tutorial-step-0">
            <div class="gym-header-top">
              <span class="gym-badge-tag">{{ t.sucursal }}</span>
              
              <div class="header-status-controls">
                <button class="gym-status-toggle" :class="isGymOpen ? 'status-open' : 'status-closed'" @click="toggleGymStatus">
                  <span class="toggle-dot" :class="isGymOpen ? 'dot-open' : 'dot-closed'"></span>
                  {{ isGymOpen ? t.gymAbierto : t.gymCerrado }}
                </button>

                <div class="billing-status-badge" :class="billingStatus">
                  <span class="billing-dot" :class="billingStatus"></span>
                  {{ billingStatusText }}
                </div>
              </div>
            </div>

            <div class="gym-titles-container">
              <h1 class="main-heading">
                ULTRA <span class="highlight-color">FITNESS</span> CENTER
              </h1>
              <p class="hero-desc">{{ t.panelControl }}</p>
            </div>
          </div>

          <div class="metrics-card-group" id="tutorial-step-1">
            <div class="metric-mini-card">
              <span class="metric-number">142</span>
              <span class="metric-label">{{ t.entradasHoy }}</span>
            </div>
            <div class="metric-mini-card">
              <span class="metric-number text-highlight">28</span>
              <span class="metric-label">{{ t.enInstalaciones }}</span>
            </div>
            <div class="metric-mini-card">
              <span class="metric-number">3</span>
              <span class="metric-label">{{ t.porVencer }}</span>
            </div>
          </div>

        </section>

        <div class="modules-grid-container">
          
          <div class="module-column" id="tutorial-step-2">
            <h3 class="column-category-title">{{ t.controlAcceso }}</h3>
            <div class="cards-stack">
              
              <button class="action-card-modern" @click="openCamera('facial')">
                <div class="card-icon-box">
                  <svg class="svg-btn" viewBox="0 0 24 24"><path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/></svg>
                </div>
                <div class="card-text-content">
                  <span class="card-title">{{ t.asistenciaFacial }}</span>
                  <span class="card-desc">{{ t.reconocimientoBio }}</span>
                </div>
              </button>

              <button class="action-card-modern" @click="openCamera('scanner')">
                <div class="card-icon-box">
                  <svg class="svg-btn" viewBox="0 0 24 24"><path d="M4 4h7V11H4V4M13 4h7V11h-7V4M4 13h7v7H4v-7M13 13h3v2h-3v-2M18 13h2v2h-2v-2M13 15h2v2h-2v-2M15 18h2v2h-2v-2M18 18h2v2h-2v-2M13 18h2v2h-2v-2M18 15h2v2h-2v-2z"/></svg>
                </div>
                <div class="card-text-content">
                  <span class="card-title">{{ t.escanerQr }}</span>
                  <span class="card-desc">{{ t.validacionPase }}</span>
                </div>
              </button>

            </div>
          </div>

          <div class="module-column" id="tutorial-step-3">
            <h3 class="column-category-title">{{ t.adminTurnos }}</h3>
            <div class="cards-stack">
              
              <button class="action-card-modern" @click="activeModal = 'add-schedule'">
                <div class="card-icon-box highlight-tint">
                  <svg class="svg-btn" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                </div>
                <div class="card-text-content">
                  <span class="card-title">{{ t.anadirHorario }}</span>
                  <span class="card-desc">{{ t.gestionTurnos }}</span>
                </div>
              </button>

              <button class="action-card-modern" @click="activeModal = 'view-schedule'">
                <div class="card-icon-box highlight-tint">
                  <svg class="svg-btn" viewBox="0 0 24 24"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
                </div>
                <div class="card-text-content">
                  <span class="card-title">{{ t.verHorario }}</span>
                  <span class="card-desc">{{ t.calendarioActivo }}</span>
                </div>
              </button>

            </div>
          </div>
        </div>
      </main>
      
      <transition name="pop">
        <div v-if="activeModal" class="modal-wrapper" @click.self="closeModal">
          
          <AddScheduleModal v-if="activeModal === 'add-schedule'" @close="closeModal" />
          <ViewScheduleModal v-if="activeModal === 'view-schedule'" @close="closeModal" />

          <div v-if="activeModal === 'facial' || activeModal === 'scanner'" class="camera-panel">
            <div class="panel-header">
              <h3>{{ activeModal === 'facial' ? t.escaneoFacialTitle : t.escaneandoQrTitle }}</h3>
              <button class="close-panel" @click="closeModal">&times;</button>
            </div>
            <div class="camera-container">
              <video ref="videoPlayer" autoplay playsinline class="video-feed"></video>
              <div v-if="activeModal === 'facial'" class="face-overlay"></div>
              <div v-if="activeModal === 'scanner'" class="qr-overlay"><div class="scanner-line"></div></div>
            </div>
            <div class="panel-footer">
              <p>{{ activeModal === 'facial' ? t.instruccionFacial : t.instruccionQr }}</p>
              <button class="action-btn-full outline" @click="closeModal">{{ t.cancelar }}</button>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </HeadingAdmin>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import { traducciones } from './i18n.js'; 
import AddScheduleModal from '../Modals/AddScheduleModal.vue';
import ViewScheduleModal from '../Modals/ViewScheduleModal.vue';
import HeadingAdmin from './HeadingOwner.vue';

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');

const t = computed(() => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  const fallbackTable = traducciones.es;
  
  return new Proxy({}, {
    get(_, key) {
      return langTable[key] !== undefined ? langTable[key] : fallbackTable[key];
    }
  });
});

const activeModal = ref(null);
const videoPlayer = ref(null);
let stream = null;

const isGymOpen = ref(true);
const billingStatus = ref('active'); 

const toggleGymStatus = () => {
  isGymOpen.value = !isGymOpen.value;
  localStorage.setItem('isGymOpen', JSON.stringify(isGymOpen.value));
};

const billingStatusText = computed(() => {
  if (billingStatus.value === 'active') return t.value.cuentaCorriente;
  if (billingStatus.value === 'pending') return t.value.pendientePago;
  return t.value.bloqueadoPago;
});

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

onMounted(() => {
  const savedGymStatus = localStorage.getItem('isGymOpen');
  if (savedGymStatus !== null) {
    isGymOpen.value = JSON.parse(savedGymStatus);
  }
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
});

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

/* NOTA: Usamos exactamente las variables que se declaran en aplicarEstilosGlobales() */

.saas-dashboard-wrapper {
  background: var(--bg-custom, var(--color-interfaz, #0a0a0a));
  min-height: calc(100vh - 65px);
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.dashboard-main-container {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hero-metrics-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: stretch;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 20px);
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gym-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.gym-badge-tag {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-texto-general, rgba(245, 245, 244, 0.7));
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-status-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.gym-status-toggle {
  display: flex; align-items: center; gap: 8px; padding: 6px 14px;
  border-radius: 20px; font-size: 0.75rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s ease; border: 1px solid;
}
.gym-status-toggle.status-open { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #34d399; }
.gym-status-toggle.status-closed { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; }
.toggle-dot { width: 6px; height: 6px; border-radius: 50%; }
.dot-open { background: #10b981; box-shadow: 0 0 8px #10b981; }
.dot-closed { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

.billing-status-badge {
  display: flex; align-items: center; gap: 8px; padding: 6px 14px;
  border-radius: 20px; font-size: 0.75rem; font-weight: 600;
  border: 1px solid; cursor: default;
}
.billing-status-badge.active { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #34d399; }
.billing-status-badge.pending { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.3); color: #fbbf24; }
.billing-status-badge.blocked { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; }

.billing-dot { width: 6px; height: 6px; border-radius: 50%; }
.billing-dot.active { background: #10b981; box-shadow: 0 0 8px #10b981; }
.billing-dot.pending { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
.billing-dot.blocked { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

.main-heading {
  font-family: 'Archivo Black', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-titulos, #ffffff);
  letter-spacing: -1px;
}

.highlight-color { color: var(--color-highlight, #3b82f6); }
.text-highlight { color: var(--color-highlight, #3b82f6); }

.hero-desc {
  font-size: 0.95rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.55));
  opacity: 0.8;
  margin: 8px 0 0 0;
  font-weight: 500;
}

.metrics-card-group {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}

.metric-mini-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 20px);
  padding: 16px 8px;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.metric-number {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem; font-weight: 700;
  color: var(--color-titulos, #ffffff);
}

.metric-label {
  font-size: 0.65rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.55));
  opacity: 0.8;
  margin-top: 4px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
}

.modules-grid-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.module-column { display: flex; flex-direction: column; gap: 12px; }

.column-category-title {
  font-family: 'Oswald', sans-serif; font-size: 1.05rem; font-weight: 600;
  color: var(--color-titulos, rgba(245, 245, 244, 0.7)); margin: 0; letter-spacing: 0.5px;
}

.cards-stack { display: flex; flex-direction: column; gap: 12px; }

.action-card-modern {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 16px);
  padding: 22px; display: flex; align-items: center; gap: 16px;
  cursor: pointer; text-align: left; transition: all 0.2s ease;
  width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.action-card-modern:hover {
  filter: brightness(1.1);
  border-color: var(--color-highlight, #3b82f6);
  transform: translateY(-2px);
}

.card-icon-box {
  width: 48px; height: 48px;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--app-border-radius, 12px);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-svg, #f5f5f4); flex-shrink: 0;
}

.card-icon-box.highlight-tint {
  background: rgba(255, 255, 255, 0.05);
  border-color: var(--color-highlight, #3b82f6);
  color: var(--color-highlight, #3b82f6);
}

.svg-btn { width: 24px; height: 24px; fill: currentColor; }

.card-text-content { display: flex; flex-direction: column; }
.card-title { font-family: 'Oswald', sans-serif; font-size: 1.15rem; font-weight: 600; color: var(--color-titulos, #f5f5f4); }
.card-desc { font-size: 0.85rem; color: var(--color-texto-general, rgba(245, 245, 244, 0.55)); opacity: 0.8; margin-top: 3px; font-weight: 400; }

.modal-wrapper {
  position: fixed; inset: 0; z-index: 4000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
}

.camera-panel {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: var(--color-texto-general, #f5f5f4);
  border-radius: var(--app-border-radius, 24px);
  padding: 32px; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  width: 92%; max-width: 440px;
}

.panel-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.panel-header h3 { font-family: 'Oswald', sans-serif; font-size: 1.3rem; margin: 0; color: var(--color-titulos, #3b82f6); }

.close-panel {
  background: rgba(255, 255, 255, 0.03); border: none; color: var(--color-texto-general, #f5f5f4);
  font-size: 1.6rem; width: 36px; height: 36px; border-radius: var(--app-border-radius, 12px); cursor: pointer; transition: all 0.2s ease;
}
.close-panel:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }

.camera-container {
  position: relative; width: 100%; aspect-ratio: 4 / 3;
  background: #000000; border-radius: var(--app-border-radius, 16px); overflow: hidden;
  margin-bottom: 20px; border: 1px solid rgba(255, 255, 255, 0.12);
}

.video-feed { width: 100%; height: 100%; object-fit: cover; }
.face-overlay { position: absolute; inset: 0; background-color: rgba(0, 0, 0, 0.6); mask: radial-gradient(circle, transparent 50%, black 50%); }

.qr-overlay {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
  width: 220px; height: 220px; border: 2.5px solid var(--color-highlight, #3b82f6);
  border-radius: 16px; box-shadow: 0 0 0 1000px rgba(0,0,0,0.5);
}

.scanner-line {
  position: absolute; width: 100%; height: 3px; background: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 12px var(--color-highlight, #3b82f6); animation: scan 2.2s infinite ease-in-out;
}
@keyframes scan { 0%, 100% { top: 0%; } 50% { top: 100%; } }

.panel-footer { text-align: center; }
.panel-footer p { color: var(--color-texto-general, rgba(245, 245, 244, 0.55)); opacity: 0.8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px; }

.action-btn-full {
  width: 100%; padding: 14px; border-radius: var(--app-border-radius, 12px); border: none;
  background: var(--color-botones, #1c4fd6); color: var(--color-texto-botones, #ffffff);
  font-family: 'Oswald', sans-serif; font-size: 0.95rem;
  cursor: pointer; transition: all 0.2s ease;
}
.action-btn-full.outline {
  background: transparent; border: 1.5px solid rgba(255, 255, 255, 0.15);
  color: var(--color-texto-general, #f5f5f4);
}
.action-btn-full:hover { filter: brightness(1.1); }

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95); }

@media (max-width: 1024px) {
  .hero-metrics-grid { grid-template-columns: 1fr; }
  .modules-grid-container { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .metrics-card-group { grid-template-columns: 1fr; }
  .dashboard-main-container { padding: 14px; }
  .gym-badge-tag { display: none; }
  .glass-card { display: flex; flex-direction: column; text-align: center; padding: 50px 14px; }
  .gym-header-top { order: 2; justify-content: center; margin-bottom: 0; margin-top: 38px; width: 100%; }
  .gym-titles-container { order: 1; width: 100%; }
  .main-heading { font-size: 1.7rem; line-height: 1.5; }
  .hero-desc { font-size: 0.95rem; margin-top: 18px; }
  .header-status-controls { width: 100%; flex-direction: row; justify-content: space-between; gap: 12px; }
  .gym-status-toggle, .billing-status-badge { flex: 1; justify-content: center; padding: 6px 6px; font-size: 0.75rem; text-align: center; }
}
</style>
<template>
  <HeadingAdmin :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="dashboard">
      <main class="dashboard-container">

        <!-- ==================== INFORMACIÓN PRINCIPAL ==================== -->
        <section class="hero-grid">
          <div class="gym-card">
            <div class="gym-card-top">
              <span class="branch-badge">{{ t.sucursal }}</span>

              <div class="status-group">
                <button class="status-pill" :class="isGymOpen ? 'open' : 'closed'" @click="toggleGymStatus">
                  <span class="status-dot"></span>
                  {{ isGymOpen ? t.gymAbierto : t.gymCerrado }}
                </button>

                <div class="billing-pill" :class="billingStatus">
                  <span class="billing-dot"></span>
                  {{ billingStatusText }}
                </div>
              </div>
            </div>

            <div class="gym-title-content">
              <span class="eyebrow">{{ ui.ownerPanel }}</span>
              <h1>ULTRA <span>FITNESS</span> CENTER</h1>
              <p>{{ t.panelControl }}</p>
            </div>
          </div>

          <!-- MÉTRICAS -->
          <div class="metrics-grid">
            <article class="metric-card">
              <div class="metric-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <strong>142</strong>
              <span>{{ t.entradasHoy }}</span>
            </article>

            <article class="metric-card">
              <div class="metric-icon accent">
                <svg viewBox="0 0 24 24">
                  <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5M9 10h.01M15 10h.01"/>
                </svg>
              </div>
              <strong class="highlight">28</strong>
              <span>{{ t.enInstalaciones }}</span>
            </article>

            <article class="metric-card">
              <div class="metric-icon warning">
                <svg viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M12 7v5l3 2"/>
                </svg>
              </div>
              <strong>3</strong>
              <span>{{ t.porVencer }}</span>
            </article>
          </div>
        </section>

        <!-- ==================== MÓDULOS ==================== -->
        <section class="modules-grid">

          <!-- CONTROL DE ACCESO -->
          <div class="module-section">
            <div class="section-header">
              <span class="section-eyebrow">{{ ui.operation }}</span>
              <h2>{{ t.controlAcceso }}</h2>
            </div>

            <div class="action-list">
              <button class="action-card" @click="openCamera('facial')">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z"/>
                  </svg>
                </div>

                <div class="action-info">
                  <strong>{{ t.asistenciaFacial }}</strong>
                  <span>{{ t.reconocimientoBio }}</span>
                </div>

                <div class="action-arrow">
                  <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </button>

              <button class="action-card" @click="openCamera('scanner')">
                <div class="action-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h3v2h-3zM18 13h2v2h-2zM13 17h2v3h-2zM17 17h3v3h-3z"/>
                  </svg>
                </div>

                <div class="action-info">
                  <strong>{{ t.escanerQr }}</strong>
                  <span>{{ t.validacionPase }}</span>
                </div>

                <div class="action-arrow">
                  <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </button>
            </div>
          </div>

          <!-- HORARIOS -->
          <div class="module-section">
            <div class="section-header">
              <span class="section-eyebrow">{{ ui.schedule }}</span>
              <h2>{{ t.adminTurnos }}</h2>
            </div>

            <div class="action-list">
              <button class="action-card" @click="activeModal = 'add-schedule'">
                <div class="action-icon accent">
                  <svg viewBox="0 0 24 24">
                    <path d="M19 4H5a2 2 0 0 0-2 2v14h18V6a2 2 0 0 0-2-2ZM8 2v4M16 2v4M3 9h18M8 13h3v3H8z"/>
                  </svg>
                </div>

                <div class="action-info">
                  <strong>{{ t.anadirHorario }}</strong>
                  <span>{{ t.gestionTurnos }}</span>
                </div>

                <div class="action-arrow">
                  <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </button>

              <button class="action-card" @click="activeModal = 'view-schedule'">
                <div class="action-icon accent">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                </div>

                <div class="action-info">
                  <strong>{{ t.verHorario }}</strong>
                  <span>{{ t.calendarioActivo }}</span>
                </div>

                <div class="action-arrow">
                  <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </button>
            </div>
          </div>

          <!-- SUCURSALES -->
          <div class="module-section">
            <div class="section-header">
              <span class="section-eyebrow">{{ ui.expansion }}</span>
              <h2>{{ ui.branches }}</h2>
            </div>

            <div class="action-list">
              <button class="action-card add-branch" @click="openBranchModal">
                <div class="action-icon accent">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </div>

                <div class="action-info">
                  <strong>{{ ui.addBranch }}</strong>
                  <span>{{ ui.addBranchDescription }}</span>
                </div>

                <div class="action-arrow">
                  <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
                </div>
              </button>
            </div>
          </div>
        </section>
      </main>

      <!-- ==================== MODALES ==================== -->
      <transition name="pop">
        <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
          <AddScheduleModal v-if="activeModal === 'add-schedule'" @close="closeModal" />
          <ViewScheduleModal v-if="activeModal === 'view-schedule'" @close="closeModal" />

          <div v-if="activeModal === 'facial' || activeModal === 'scanner'" class="camera-panel">
            <div class="camera-header">
              <div>
                <span>{{ ui.accessControl }}</span>
                <h3>{{ activeModal === 'facial' ? t.escaneoFacialTitle : t.escaneandoQrTitle }}</h3>
              </div>

              <button @click="closeModal">&times;</button>
            </div>

            <div class="camera-container">
              <video ref="videoPlayer" autoplay playsinline></video>

              <div v-if="activeModal === 'facial'" class="face-overlay"></div>

              <div v-if="activeModal === 'scanner'" class="qr-overlay">
                <div class="scanner-line"></div>
              </div>
            </div>

            <div class="camera-footer">
              <p>{{ activeModal === 'facial' ? t.instruccionFacial : t.instruccionQr }}</p>
              <button @click="closeModal">{{ t.cancelar }}</button>
            </div>
          </div>
        </div>
      </transition>

      <!-- ==================== MODAL REGISTRO SUCURSAL ==================== -->
      <transition name="branch-modal">
        <div v-if="showBranchModal" class="branch-modal-overlay" @click.self="closeBranchModal">
          <div class="branch-modal">
            <header class="branch-modal-header">
              <div class="branch-modal-title">
                <div class="branch-modal-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/>
                  </svg>
                </div>

                <div>
                  <span>{{ ui.branchManagement }}</span>
                  <h2>{{ ui.registerBranch }}</h2>
                </div>
              </div>

              <button class="branch-modal-close" @click="closeBranchModal">&times;</button>
            </header>

            <div class="branch-modal-body">
              <RegisterGymModal @close="closeBranchModal" />
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
import RegisterGymModal from '../Record/Record-Gym.vue';
import HeadingAdmin from './HeadingOwner.vue';

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');
const activeModal = ref(null);
const showBranchModal = ref(false);
const videoPlayer = ref(null);
const isGymOpen = ref(true);
const billingStatus = ref('active');
let stream = null;

/* =========================================================
   TRADUCCIONES EXISTENTES DEL PROYECTO
========================================================= */
const t = computed(() => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  const fallbackTable = traducciones.es;

  return new Proxy({}, {
    get(_, key) {
      return langTable[key] !== undefined
        ? langTable[key]
        : fallbackTable[key];
    }
  });
});

/* =========================================================
   TEXTOS PROPIOS DEL DASHBOARD QUE ESTABAN FIJOS
========================================================= */
const dashboardTranslations = {
  es: {
    ownerPanel: 'PANEL DEL PROPIETARIO',
    operation: 'OPERACIÓN',
    schedule: 'AGENDA',
    expansion: 'EXPANSIÓN',
    branches: 'Sucursales',
    addBranch: 'Agregar sucursal',
    addBranchDescription: 'Registra una nueva sede en tu cuenta.',
    accessControl: 'CONTROL DE ACCESO',
    branchManagement: 'GESTIÓN DE SUCURSALES',
    registerBranch: 'Registrar nueva sede',
    cameraError: 'No se pudo acceder a la cámara. Verifica los permisos.'
  },

  en: {
    ownerPanel: 'OWNER PANEL',
    operation: 'OPERATIONS',
    schedule: 'SCHEDULE',
    expansion: 'EXPANSION',
    branches: 'Branches',
    addBranch: 'Add branch',
    addBranchDescription: 'Register a new location in your account.',
    accessControl: 'ACCESS CONTROL',
    branchManagement: 'BRANCH MANAGEMENT',
    registerBranch: 'Register new location',
    cameraError: 'Camera access failed. Check your permissions.'
  }
};

const ui = computed(() => {
  return dashboardTranslations[currentLang.value] || dashboardTranslations.es;
});

/* =========================================================
   ESTADO DE FACTURACIÓN
========================================================= */
const billingStatusText = computed(() => {
  if (billingStatus.value === 'active') return t.value.cuentaCorriente;
  if (billingStatus.value === 'pending') return t.value.pendientePago;
  return t.value.bloqueadoPago;
});

/* =========================================================
   ESTADO DEL GIMNASIO
========================================================= */
const toggleGymStatus = () => {
  isGymOpen.value = !isGymOpen.value;
  localStorage.setItem('isGymOpen', JSON.stringify(isGymOpen.value));
};

/* =========================================================
   CAMBIO DE IDIOMA
========================================================= */
const handleLangChange = (e) => {
  if (!e.detail?.idioma) return;

  currentLang.value = e.detail.idioma;
  localStorage.setItem('owner-idioma', e.detail.idioma);
};

/* =========================================================
   MODAL SUCURSAL
========================================================= */
const openBranchModal = () => {
  showBranchModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeBranchModal = () => {
  showBranchModal.value = false;
  document.body.style.overflow = '';
};

/* =========================================================
   CÁMARA
========================================================= */
const openCamera = async (type) => {
  activeModal.value = type;

  try {
    setTimeout(async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: type === 'scanner'
              ? 'environment'
              : 'user'
          }
        });

        if (videoPlayer.value) {
          videoPlayer.value.srcObject = stream;
        }
      } catch (err) {
        console.error('Error al acceder a la cámara:', err);
        alert(ui.value.cameraError);
        activeModal.value = null;
      }
    }, 100);
  } catch (err) {
    console.error('Error al acceder a la cámara:', err);
    alert(ui.value.cameraError);
    activeModal.value = null;
  }
};

const closeModal = () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;
  }

  activeModal.value = null;
};

/* =========================================================
   CICLO DE VIDA
========================================================= */
onMounted(() => {
  const savedGymStatus = localStorage.getItem('isGymOpen');

  if (savedGymStatus !== null) {
    isGymOpen.value = JSON.parse(savedGymStatus);
  }

  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
  document.body.style.overflow = '';
});

onBeforeUnmount(() => closeModal());
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }
button { font: inherit; }

.dashboard {
  --hl: var(--color-highlight, #3b82f6);
  --hl-soft: rgba(59,130,246,.1);
  --hl-line: rgba(59,130,246,.45);
  --card: var(--bg-cards, #121212);
  --line: rgba(255,255,255,.08);
  --line-strong: rgba(255,255,255,.15);
  --title: var(--color-titulos, #fff);
  --text-2: rgba(245,245,244,.62);
  --text-3: rgba(245,245,244,.45);

  min-height: calc(100vh - 65px);
  background: var(--bg-custom, var(--color-interfaz, #090909));
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

@supports (background: color-mix(in srgb, red 10%, transparent)) {
  .dashboard {
    --hl-soft: color-mix(in srgb, var(--hl) 11%, transparent);
    --hl-line: color-mix(in srgb, var(--hl) 50%, transparent);
  }
}

.dashboard-container {
  width: 100%;
  max-width: 1320px;
  margin: auto;
  padding: 36px 32px 56px;
  display: flex;
  flex-direction: column;
  gap: 36px;
}

/* ============ HERO ============ */

.hero-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 360px;
  gap: 18px;
}

.gym-card {
  min-height: 200px;
  padding: 28px 32px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 28px;
  background:
    radial-gradient(circle at 100% 0%, var(--hl-soft), transparent 55%),
    linear-gradient(140deg, var(--card), rgba(14,14,14,.9));
  border: 1px solid var(--line);
  border-radius: 24px;
  box-shadow: 0 18px 45px rgba(0,0,0,.32), inset 0 1px rgba(255,255,255,.03);
}

.gym-card::after {
  content: "";
  position: absolute;
  right: -90px;
  bottom: -160px;
  width: 280px;
  height: 280px;
  border: 1px solid var(--hl-soft);
  border-radius: 50%;
  pointer-events: none;
}

.gym-card-top {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.status-group { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.branch-badge {
  padding: 6px 12px;
  background: rgba(255,255,255,.05);
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--text-2);
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: .5px;
  text-transform: uppercase;
}

.status-pill,
.billing-pill {
  height: 36px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 650;
}

.status-pill { cursor: pointer; transition: filter .2s, transform .2s; }
.status-pill:hover { filter: brightness(1.15); transform: translateY(-1px); }

.status-pill.open, .billing-pill.active { color: #34d399; background: rgba(16,185,129,.1); border-color: rgba(16,185,129,.3); }
.status-pill.closed, .billing-pill.blocked { color: #f87171; background: rgba(239,68,68,.1); border-color: rgba(239,68,68,.32); }
.billing-pill.pending { color: #fbbf24; background: rgba(245,158,11,.1); border-color: rgba(245,158,11,.32); }

.status-dot, .billing-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 9px currentColor;
}

.gym-title-content { position: relative; z-index: 1; }

.eyebrow, .section-eyebrow {
  display: block;
  margin-bottom: 8px;
  color: var(--hl);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.gym-title-content h1 {
  margin: 0;
  color: var(--title);
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(28px, 3.4vw, 40px);
  line-height: 1.12;
  letter-spacing: -1px;
}

.gym-title-content h1 span, .highlight { color: var(--hl) !important; }

.gym-title-content p {
  margin: 10px 0 0;
  color: var(--text-2);
  font-size: 14.5px;
  font-weight: 500;
}

/* ============ MÉTRICAS ============ */

.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

.metric-card {
  min-width: 0;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0,0,0,.25);
  transition: transform .2s ease, border-color .2s ease;
}

.metric-card:hover { transform: translateY(-2px); border-color: var(--line-strong); }

.metric-icon {
  width: 36px;
  height: 36px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  background: rgba(255,255,255,.05);
  color: rgba(255,255,255,.65);
}

.metric-icon.accent { color: var(--hl); background: var(--hl-soft); }
.metric-icon.warning { color: #f59e0b; background: rgba(245,158,11,.1); }
.metric-icon svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

.metric-card strong {
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 30px;
  font-weight: 600;
  line-height: 1;
}

.metric-card > span {
  max-width: 96px;
  margin-top: 9px;
  color: var(--text-3);
  font-size: 10.5px;
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: .4px;
  text-transform: uppercase;
}

/* ============ MÓDULOS ============ */

.modules-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 20px; align-items: start; }
.module-section { display: flex; flex-direction: column; gap: 14px; min-width: 0; }

.section-header { display: flex; flex-direction: column; }
.section-header .section-eyebrow { margin-bottom: 4px; font-size: 10.5px; }

.section-header h2 {
  margin: 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: .2px;
}

.action-list { display: flex; flex-direction: column; gap: 12px; }

.action-card {
  width: 100%;
  min-height: 92px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  gap: 15px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 10px 26px rgba(0,0,0,.22);
  transition: transform .2s ease, border-color .2s ease, background .2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  border-color: var(--hl-line);
  background: rgba(255,255,255,.028);
}

/* Botón de agregar sucursal: mismo tamaño que las demás, con borde punteado */
.action-card.add-branch { border-style: dashed; border-color: var(--hl-line); background: var(--hl-soft); }
.action-card.add-branch:hover { border-color: var(--hl); background: var(--hl-soft); }

.action-icon {
  width: 50px;
  height: 50px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,.88);
  background: rgba(255,255,255,.04);
  border: 1px solid var(--line-strong);
  border-radius: 15px;
}

.action-icon.accent { color: var(--hl); background: var(--hl-soft); border-color: var(--hl-line); }
.action-icon svg { width: 23px; height: 23px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }

.action-info { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 4px; }

.action-info strong {
  overflow: hidden;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 17.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-info span {
  overflow: hidden;
  color: var(--text-2);
  font-size: 13px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-arrow {
  width: 32px;
  height: 32px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,.3);
  border-radius: 10px;
  transition: .2s ease;
}

.action-arrow svg { width: 17px; height: 17px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
.action-card:hover .action-arrow { color: var(--hl); background: var(--hl-soft); transform: translateX(2px); }

.action-card:focus-visible,
.status-pill:focus-visible,
.camera-header button:focus-visible,
.camera-footer button:focus-visible,
.branch-modal-close:focus-visible {
  outline: 2px solid var(--hl);
  outline-offset: 3px;
}

/* ============ MODAL CÁMARA ============ */

.modal-overlay, .branch-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  padding: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,.82);
  backdrop-filter: blur(9px);
}

.camera-panel {
  width: min(460px, 94vw);
  padding: 26px;
  color: var(--color-texto-general, #fff);
  background: var(--card);
  border: 1px solid var(--line-strong);
  border-radius: 22px;
  box-shadow: 0 30px 80px rgba(0,0,0,.55);
}

.camera-header { margin-bottom: 20px; display: flex; align-items: center; justify-content: space-between; }
.camera-header span { color: var(--hl); font-size: 10.5px; font-weight: 800; letter-spacing: 1.2px; }
.camera-header h3 { margin: 4px 0 0; color: var(--title); font-family: 'Oswald', sans-serif; font-size: 21px; font-weight: 600; }

.camera-header button, .branch-modal-close {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255,255,255,.65);
  font-size: 22px;
  cursor: pointer;
  background: rgba(255,255,255,.04);
  border: 1px solid var(--line);
  border-radius: 11px;
  transition: .2s ease;
}

.camera-header button:hover, .branch-modal-close:hover { color: #f87171; background: rgba(239,68,68,.09); border-color: rgba(239,68,68,.3); }

.camera-container { position: relative; width: 100%; aspect-ratio: 4/3; overflow: hidden; background: #000; border: 1px solid var(--line-strong); border-radius: 16px; }
.camera-container video { width: 100%; height: 100%; object-fit: cover; }
.face-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.55); mask: radial-gradient(circle, transparent 49%, #000 50%); }
.qr-overlay { position: absolute; top: 50%; left: 50%; width: 210px; height: 210px; transform: translate(-50%,-50%); border: 2px solid var(--hl); border-radius: 15px; box-shadow: 0 0 0 1000px rgba(0,0,0,.5); }
.scanner-line { position: absolute; width: 100%; height: 2px; background: var(--hl); box-shadow: 0 0 10px var(--hl); animation: scan 2s infinite ease-in-out; }

.camera-footer { text-align: center; }
.camera-footer p { margin: 18px 0; color: var(--text-2); font-size: 13.5px; line-height: 1.55; }
.camera-footer button { width: 100%; padding: 13px; color: #fff; font-family: 'Oswald', sans-serif; font-size: 15px; cursor: pointer; background: transparent; border: 1px solid var(--line-strong); border-radius: 11px; transition: background .2s; }
.camera-footer button:hover { background: rgba(255,255,255,.05); }

/* ============ MODAL SUCURSAL ============ */

.branch-modal {
  width: min(1280px, 96vw);
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--bg-cards, #111);
  border: 1px solid var(--line-strong);
  border-radius: 22px;
  box-shadow: 0 35px 100px rgba(0,0,0,.65);
}

.branch-modal-header { min-height: 76px; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,.015); border-bottom: 1px solid var(--line); }
.branch-modal-title { display: flex; align-items: center; gap: 13px; }
.branch-modal-icon { width: 42px; height: 42px; display: flex; align-items: center; justify-content: center; color: var(--hl); background: var(--hl-soft); border: 1px solid var(--hl-line); border-radius: 12px; }
.branch-modal-icon svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.branch-modal-title span { display: block; margin-bottom: 3px; color: var(--hl); font-size: 10.5px; font-weight: 800; letter-spacing: 1.1px; }
.branch-modal-title h2 { margin: 0; color: var(--title); font-family: 'Oswald', sans-serif; font-size: 20px; font-weight: 600; }
.branch-modal-body { padding: 20px; overflow-y: auto; overscroll-behavior: contain; }

/* ============ ANIMACIONES ============ */

.pop-enter-active, .pop-leave-active, .branch-modal-enter-active, .branch-modal-leave-active { transition: opacity .2s ease; }
.pop-enter-from, .pop-leave-to, .branch-modal-enter-from, .branch-modal-leave-to { opacity: 0; }
.branch-modal-enter-active .branch-modal, .branch-modal-leave-active .branch-modal { transition: transform .2s ease, opacity .2s ease; }
.branch-modal-enter-from .branch-modal { opacity: 0; transform: translateY(10px) scale(.98); }

@keyframes scan { 0%,100% { top: 0; } 50% { top: 100%; } }

@media (prefers-reduced-motion: reduce) {
  *, *:before, *:after { transition: none !important; animation-duration: .01ms !important; }
}

/* ============ RESPONSIVE ============ */

@media (max-width: 1180px) {
  .modules-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 1024px) {
  .hero-grid { grid-template-columns: 1fr; }
  .gym-card { min-height: 0; }
}

@media (max-width: 760px) {
  .modules-grid { grid-template-columns: 1fr; gap: 26px; }
}

@media (max-width: 680px) {
  .dashboard-container { padding: 16px 14px 40px; gap: 28px; }

  .gym-card { padding: 22px 18px; gap: 24px; border-radius: 20px; }
  .gym-card-top { flex-direction: column; align-items: stretch; gap: 14px; }
  .branch-badge { align-self: flex-start; }
  .status-group { width: 100%; gap: 8px; flex-wrap: nowrap; }
  .status-pill, .billing-pill { flex: 1; min-width: 0; height: 40px; padding: 0 8px; justify-content: center; font-size: 12px; text-align: center; }
  .gym-title-content h1 { font-size: 27px; line-height: 1.18; }
  .gym-title-content p { font-size: 14px; }

  .metrics-grid { gap: 8px; }
  .metric-card { padding: 16px 6px; border-radius: 16px; }
  .metric-icon { width: 32px; height: 32px; margin-bottom: 9px; }
  .metric-card strong { font-size: 26px; }
  .metric-card > span { font-size: 10px; max-width: none; }

  .section-header h2 { font-size: 19px; }
  .action-card { min-height: 88px; padding: 14px; gap: 13px; border-radius: 16px; }
  .action-icon { width: 46px; height: 46px; border-radius: 13px; }
  .action-info strong { font-size: 16.5px; }
  .action-info span { font-size: 12.5px; }

  .modal-overlay, .branch-modal-overlay { padding: 8px; }
  .camera-panel { padding: 20px; }
  .branch-modal { width: 100%; max-height: 96vh; border-radius: 16px; }
  .branch-modal-header { padding: 12px 14px; }
  .branch-modal-body { padding: 12px; }
}

@media (max-width: 360px) {
  .status-group { flex-wrap: wrap; }
  .status-pill, .billing-pill { flex: 1 1 100%; }
}
</style>
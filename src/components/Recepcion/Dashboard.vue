<template>
  <HeadingAdmin :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="dashboard">
      <main class="dashboard-container">

        <!-- 1. ENCABEZADO + HOY -->
        <section class="hero-row">
          <div class="hero" id="tutorial-step-0">
            <div class="hero-main">
              <span class="branch-badge">{{ t.sucursal }}</span>
              <span class="eyebrow">{{ ui.receptionPanel }}</span>
              <h1>ULTRA <span>FITNESS</span> CENTER</h1>
              <p>{{ t.panelControl }}</p>
            </div>

            <div class="hero-status">
              <button
                type="button"
                class="status-pill"
                :class="isGymOpen ? 'open' : 'closed'"
                @click="toggleGymStatus"
              >
                <span class="status-dot"></span>
                {{ isGymOpen ? t.gymAbierto : t.gymCerrado }}
              </button>

              <div class="billing-pill" :class="billingStatus">
                <span class="billing-dot"></span>
                {{ billingStatusText }}
              </div>
            </div>
          </div>

          <div class="today-card" id="tutorial-step-1">
            <div class="today-cell">
              <div class="kpi-icon">
                <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <strong>142</strong>
              <span>{{ t.entradasHoy }}</span>
            </div>

            <div class="today-cell">
              <div class="kpi-icon accent">
                <svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/></svg>
              </div>
              <strong class="highlight">28</strong>
              <span>{{ t.enInstalaciones }}</span>
            </div>

            <div class="today-cell">
              <div class="kpi-icon warning">
                <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
              </div>
              <strong>{{ expiring.length }}</strong>
              <span>{{ t.porVencer }}</span>
            </div>
          </div>
        </section>

        <!-- 2. CONTROL DE ACCESO -->
        <section class="access-section" id="tutorial-step-2">
          <div class="section-title-row">
            <span class="section-eyebrow">{{ ui.operation }}</span>
            <h2>{{ t.controlAcceso }}</h2>
          </div>

          <div class="access-grid">
            <button type="button" class="access-card" @click="openCamera('facial')">
              <span class="access-icon">
                <svg viewBox="0 0 24 24"><path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2M9 10h.01M15 10h.01M9.5 15a3.5 3.5 0 0 0 5 0"/></svg>
              </span>
              <span class="access-copy">
                <strong>{{ t.asistenciaFacial }}</strong>
                <small>{{ t.reconocimientoBio }}</small>
              </span>
              <span class="access-arrow">
                <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              </span>
            </button>

            <button type="button" class="access-card qr" @click="openCamera('scanner')">
              <span class="access-icon">
                <svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h3v2h-3zM18 13h2v2h-2zM13 17h2v3h-2zM17 17h3v3h-3z"/></svg>
              </span>
              <span class="access-copy">
                <strong>{{ t.escanerQr }}</strong>
                <small>{{ t.validacionPase }}</small>
              </span>
              <span class="access-arrow">
                <svg viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              </span>
            </button>
          </div>
        </section>

        <!-- 3. ACCESOS DIRECTOS -->
        <section class="shortcuts">
          <div class="shortcut-grid">
            <button
              v-for="action in quickActions"
              :key="action.label"
              type="button"
              class="shortcut"
              @click="onShortcut(action)"
            >
              <span class="shortcut-icon">
                <svg viewBox="0 0 24 24"><path :d="action.icon"/></svg>
              </span>
              <span class="shortcut-copy">
                <strong>{{ action.label }}</strong>
                <small>{{ action.description }}</small>
              </span>
            </button>
          </div>
        </section>

        <!-- 4. ACCESOS RECIENTES + POR VENCER -->
        <section class="two-col">
          <article class="panel">
            <div class="panel-header">
              <div>
                <span class="section-eyebrow">{{ ui.today }}</span>
                <h2>{{ ui.recentAccess }}</h2>
              </div>
              <button type="button" class="link-btn" @click="go('/recepcion/view-clients')">{{ ui.viewClients }} →</button>
            </div>

            <div class="row-list">
              <div
                v-for="item in recentAccess"
                :key="item.name + item.time"
                class="list-row"
              >
                <div class="avatar" :class="item.method">{{ item.initials }}</div>
                <div class="row-info">
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.text }}</span>
                </div>
                <time>{{ item.time }}</time>
              </div>
            </div>
          </article>

          <article class="panel">
            <div class="panel-header">
              <div>
                <span class="section-eyebrow">{{ ui.attention }}</span>
                <h2>{{ ui.expiringTitle }}</h2>
              </div>
              <span class="count-chip">{{ expiring.length }}</span>
            </div>

            <div class="row-list">
              <div
                v-for="item in expiring"
                :key="item.id"
                class="list-row"
              >
                <div class="avatar" :class="item.level">{{ item.initials }}</div>
                <div class="row-info">
                  <strong>{{ item.name }}</strong>
                  <span>
                    {{ item.plan }} ·
                    <b class="due" :class="item.level">{{ item.due }}</b>
                  </span>
                </div>
                <button type="button" class="pay-btn" @click="go('/recepcion/pay/' + item.id)">
                  {{ ui.charge }}
                </button>
              </div>
            </div>
          </article>
        </section>

        <!-- 5. HORARIOS (menos frecuente) -->
        <section class="tools" id="tutorial-step-3">
          <div class="tools-title">
            <span>{{ t.adminTurnos }}</span>
            <i></i>
          </div>

          <div class="tools-grid">
            <button type="button" class="action-card" @click="activeModal = 'add-schedule'">
              <div class="action-icon">
                <svg viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 0 0-2 2v14h18V6a2 2 0 0 0-2-2ZM8 2v4M16 2v4M3 9h18M8 13h3v3H8z"/></svg>
              </div>
              <div class="action-info">
                <strong>{{ t.anadirHorario }}</strong>
                <span>{{ t.gestionTurnos }}</span>
              </div>
              <ArrowIcon />
            </button>

            <button type="button" class="action-card" @click="activeModal = 'view-schedule'">
              <div class="action-icon">
                <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
              </div>
              <div class="action-info">
                <strong>{{ t.verHorario }}</strong>
                <span>{{ t.calendarioActivo }}</span>
              </div>
              <ArrowIcon />
            </button>
          </div>
        </section>
      </main>

      <!-- MODALES -->
      <transition name="pop">
        <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
          <AddScheduleModal v-if="activeModal === 'add-schedule'" @close="closeModal" />
          <ViewScheduleModal v-if="activeModal === 'view-schedule'" @close="closeModal" />

          <Promo
            v-if="activeModal === 'promo'"
            @select-oferta="closeModal"
            @close="closeModal"
          />

          <div v-if="activeModal === 'facial' || activeModal === 'scanner'" class="camera-panel">
            <div class="camera-header">
              <div>
                <span>{{ ui.accessControl }}</span>
                <h3>{{ activeModal === 'facial' ? t.escaneoFacialTitle : t.escaneandoQrTitle }}</h3>
              </div>
              <button type="button" @click="closeModal">&times;</button>
            </div>

            <div class="camera-container">
              <video ref="videoPlayer" autoplay playsinline></video>
              <div v-if="activeModal === 'facial'" class="face-overlay"></div>
              <div v-else class="qr-overlay"><div class="scanner-line"></div></div>
            </div>

            <div class="camera-footer">
              <p>{{ activeModal === 'facial' ? t.instruccionFacial : t.instruccionQr }}</p>
              <button type="button" @click="closeModal">{{ t.cancelar }}</button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </HeadingAdmin>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, h } from 'vue';
import { useRouter } from 'vue-router';
import { traducciones } from './i18n.js';
import AddScheduleModal from '../Modals/AddScheduleModal.vue';
import ViewScheduleModal from '../Modals/ViewScheduleModal.vue';
import HeadingAdmin from './HeadingRecepcion.vue';
// Ajusta esta ruta a donde tengas Promos.vue
import Promo from './Payments/Promos.vue';

const router = useRouter();

const currentLang = ref(localStorage.getItem('recepcion-idioma') || 'es');
const activeModal = ref(null);
const videoPlayer = ref(null);
const isGymOpen = ref(true);
const billingStatus = ref('active');

let stream = null;

/* =========================================================
   UTILIDADES
========================================================= */

const ArrowIcon = () =>
  h('div', { class: 'action-arrow' }, [
    h('svg', { viewBox: '0 0 24 24' }, [h('path', { d: 'm9 18 6-6-6-6' })])
  ]);

const go = (path) => router.push(path);

/* Accesos directos: si traen "modal" abren modal, si no navegan */
const onShortcut = (action) => {
  if (action.modal) {
    activeModal.value = action.modal;
  } else {
    go(action.route);
  }
};

/* =========================================================
   TRADUCCIONES
========================================================= */

const t = computed(() => {
  const lang = traducciones[currentLang.value] || traducciones.es;
  const fallback = traducciones.es;

  return new Proxy({}, {
    get(_, key) {
      return lang[key] !== undefined ? lang[key] : fallback[key];
    }
  });
});

const dashboardTranslations = {
  es: {
    receptionPanel: 'PANEL DE RECEPCIÓN',
    operation: 'OPERACIÓN',
    accessControl: 'CONTROL DE ACCESO',
    today: 'HOY',
    attention: 'ATENCIÓN',
    recentAccess: 'Accesos recientes',
    expiringTitle: 'Membresías por vencer',
    viewClients: 'Ver clientes',
    charge: 'Cobrar'
  },
  en: {
    receptionPanel: 'RECEPTION PANEL',
    operation: 'OPERATIONS',
    accessControl: 'ACCESS CONTROL',
    today: 'TODAY',
    attention: 'ATTENTION',
    recentAccess: 'Recent check-ins',
    expiringTitle: 'Expiring memberships',
    viewClients: 'View clients',
    charge: 'Charge'
  }
};

const ui = computed(
  () => dashboardTranslations[currentLang.value] || dashboardTranslations.es
);

/* =========================================================
   DATOS (de prueba)
========================================================= */

const recentAccess = computed(() =>
  currentLang.value === 'es'
    ? [
        { initials: 'AL', name: 'Andrea López', text: 'Entrada · Reconocimiento facial', time: 'Hace 3 min', method: 'facial' },
        { initials: 'JR', name: 'José Ramírez', text: 'Entrada · Código QR', time: 'Hace 8 min', method: 'qr' },
        { initials: 'CH', name: 'Carlos Hernández', text: 'Entrada · Reconocimiento facial', time: 'Hace 15 min', method: 'facial' },
        { initials: 'MG', name: 'Mariana García', text: 'Entrada · Código QR', time: 'Hace 22 min', method: 'qr' }
      ]
    : [
        { initials: 'AL', name: 'Andrea López', text: 'Check-in · Facial recognition', time: '3 min ago', method: 'facial' },
        { initials: 'JR', name: 'José Ramírez', text: 'Check-in · QR code', time: '8 min ago', method: 'qr' },
        { initials: 'CH', name: 'Carlos Hernández', text: 'Check-in · Facial recognition', time: '15 min ago', method: 'facial' },
        { initials: 'MG', name: 'Mariana García', text: 'Check-in · QR code', time: '22 min ago', method: 'qr' }
      ]
);

const expiring = computed(() =>
  currentLang.value === 'es'
    ? [
        { id: 1, initials: 'LP', name: 'Luis Pérez', plan: 'Mensual', due: 'Vence hoy', level: 'danger' },
        { id: 2, initials: 'SM', name: 'Sofía Martínez', plan: 'Quincenal', due: 'Vence mañana', level: 'warning' },
        { id: 3, initials: 'DT', name: 'Diego Torres', plan: 'Mensual', due: 'Vence en 2 días', level: 'warning' }
      ]
    : [
        { id: 1, initials: 'LP', name: 'Luis Pérez', plan: 'Monthly', due: 'Expires today', level: 'danger' },
        { id: 2, initials: 'SM', name: 'Sofía Martínez', plan: 'Biweekly', due: 'Expires tomorrow', level: 'warning' },
        { id: 3, initials: 'DT', name: 'Diego Torres', plan: 'Monthly', due: 'Expires in 2 days', level: 'warning' }
      ]
);

/* icon = path de un SVG de 24x24 */
const quickActions = computed(() => {
  const icons = {
    register: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6',
    clients: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    payment: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    promo: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01'
  };

  return currentLang.value === 'es'
    ? [
        { label: 'Registrar cliente', description: 'Nueva membresía', route: '/recepcion/register-clients', icon: icons.register },
        { label: 'Ver clientes', description: 'Consultar y editar', route: '/recepcion/view-clients', icon: icons.clients },
        { label: 'Registrar pago', description: 'Cobrar membresía', route: '/recepcion/payments', icon: icons.payment },
        { label: 'Promociones', description: 'Descuentos activos', modal: 'promo', icon: icons.promo }
      ]
    : [
        { label: 'Register client', description: 'New membership', route: '/recepcion/register-clients', icon: icons.register },
        { label: 'View clients', description: 'Search and edit', route: '/recepcion/view-clients', icon: icons.clients },
        { label: 'Register payment', description: 'Charge membership', route: '/recepcion/payments', icon: icons.payment },
        { label: 'Promotions', description: 'Active discounts', modal: 'promo', icon: icons.promo }
      ];
});

/* =========================================================
   ESTADO DEL GIMNASIO
========================================================= */

const billingStatusText = computed(() => {
  if (billingStatus.value === 'active') return t.value.cuentaCorriente;
  if (billingStatus.value === 'pending') return t.value.pendientePago;
  return t.value.bloqueadoPago;
});

const toggleGymStatus = () => {
  isGymOpen.value = !isGymOpen.value;
  localStorage.setItem('isGymOpen', JSON.stringify(isGymOpen.value));
};

/* =========================================================
   IDIOMA
========================================================= */

const handleLangChange = (event) => {
  if (event.detail?.idioma) {
    currentLang.value = event.detail.idioma;
  }
};

/* =========================================================
   CÁMARA / MODALES
========================================================= */

const openCamera = async (type) => {
  activeModal.value = type;

  setTimeout(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia no disponible');
      }

      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: type === 'scanner' ? 'environment' : 'user' }
      });

      if (videoPlayer.value) {
        videoPlayer.value.srcObject = stream;
      }
    } catch (err) {
      console.error('Error al acceder a la cámara:', err);
      alert('No se pudo acceder a la cámara. Verifica los permisos.');
      activeModal.value = null;
    }
  }, 100);
};

const closeModal = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  activeModal.value = null;
};

const handleKeydown = (event) => {
  if (event.key === 'Escape' && activeModal.value) {
    closeModal();
  }
};

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(() => {
  const saved = localStorage.getItem('isGymOpen');

  if (saved !== null) {
    try {
      isGymOpen.value = JSON.parse(saved);
    } catch {
      /* valor inválido: se queda el predeterminado */
    }
  }

  window.addEventListener('idioma-changed', handleLangChange);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
  window.removeEventListener('keydown', handleKeydown);
});

onBeforeUnmount(closeModal);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

button {
  font: inherit;
}

/* =========================================================
   BASE
========================================================= */

.dashboard {
  --hl: var(--color-highlight, #3b82f6);
  --hl-soft: color-mix(in srgb, var(--hl) 11%, transparent);
  --hl-line: color-mix(in srgb, var(--hl) 45%, transparent);
  --card: var(--bg-cards, #121212);
  --line: rgba(255, 255, 255, 0.08);
  --line2: rgba(255, 255, 255, 0.14);
  --title: var(--color-titulos, #fff);
  --text2: rgba(245, 245, 244, 0.63);
  --text3: rgba(245, 245, 244, 0.43);

  min-height: calc(100vh - 65px);
  background: var(--bg-custom, var(--color-interfaz, #090909));
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.dashboard-container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 28px 32px 56px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.eyebrow,
.section-eyebrow {
  display: block;
  margin-bottom: 6px;
  color: var(--hl);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.highlight {
  color: var(--hl) !important;
}

/* =========================================================
   1. ENCABEZADO + HOY
========================================================= */

.hero-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 390px;
  gap: 18px;
}

.hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 26px 30px;
  background:
    radial-gradient(circle at 100% 0%, var(--hl-soft), transparent 55%),
    linear-gradient(140deg, var(--card), rgba(14, 14, 14, 0.92));
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
}

.hero::after {
  content: '';
  position: absolute;
  right: -90px;
  bottom: -170px;
  width: 280px;
  height: 280px;
  border: 1px solid var(--hl-soft);
  border-radius: 50%;
  pointer-events: none;
}

.hero-main,
.hero-status {
  position: relative;
  z-index: 1;
}

.branch-badge {
  display: inline-block;
  margin-bottom: 14px;
  padding: 5px 11px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--text2);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.hero-main h1 {
  margin: 0;
  color: var(--title);
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(24px, 2.8vw, 34px);
  line-height: 1.1;
}

.hero-main h1 span {
  color: var(--hl);
}

.hero-main p {
  margin: 8px 0 0;
  color: var(--text2);
  font-size: 13.5px;
}

.hero-status {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 190px;
}

.status-pill,
.billing-pill {
  height: 36px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill {
  cursor: pointer;
  transition: filter 0.15s ease;
}

.status-pill:hover {
  filter: brightness(1.15);
}

.status-pill.open,
.billing-pill.active {
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.status-pill.closed,
.billing-pill.blocked {
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.billing-pill.pending {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.status-dot,
.billing-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 9px currentColor;
}

/* ---------- Tarjeta "Hoy" ---------- */

.today-card {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: center;
  padding: 18px 6px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
}

.today-cell {
  min-width: 0;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  text-align: center;
}

.today-cell + .today-cell {
  border-left: 1px solid var(--line);
}

.today-cell strong {
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 30px;
  line-height: 1;
}

.today-cell > span {
  max-width: 100%;
  color: var(--text3);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}

.kpi-icon {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 11px;
}

.kpi-icon.accent { color: var(--hl); background: var(--hl-soft); }
.kpi-icon.warning { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }

.kpi-icon svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* =========================================================
   2. CONTROL DE ACCESO
========================================================= */

.access-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title-row .section-eyebrow {
  margin-bottom: 3px;
  font-size: 9px;
}

.section-title-row h2,
.panel-header h2 {
  margin: 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 19px;
  font-weight: 600;
}

.access-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.access-card {
  --tint: var(--hl);
  --tint-soft: color-mix(in srgb, var(--tint) 14%, transparent);
  --tint-line: color-mix(in srgb, var(--tint) 42%, transparent);

  position: relative;
  min-height: 130px;
  padding: 22px 24px;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 20px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background:
    radial-gradient(circle at 0% 0%, var(--tint-soft), transparent 62%),
    var(--card);
  border: 1px solid var(--tint-line);
  border-radius: 20px;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.access-card.qr {
  --tint: #a78bfa;
}

.access-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.35);
  border-color: var(--tint);
}

.access-icon {
  width: 64px;
  height: 64px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tint);
  background: var(--tint-soft);
  border: 1px solid var(--tint-line);
  border-radius: 18px;
}

.access-icon svg {
  width: 30px;
  height: 30px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.access-copy {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.access-copy strong {
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 21px;
  font-weight: 600;
}

.access-copy small {
  color: var(--text2);
  font-size: 12.5px;
}

.access-arrow {
  width: 38px;
  height: 38px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--tint);
  background: var(--tint-soft);
  border-radius: 50%;
  transition: transform 0.2s ease;
}

.access-card:hover .access-arrow {
  transform: translateX(3px);
}

.access-arrow svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* =========================================================
   3. ACCESOS DIRECTOS
========================================================= */

.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.shortcut {
  min-height: 74px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.shortcut:hover {
  transform: translateY(-2px);
  border-color: var(--hl-line);
  background: var(--hl-soft);
}

.shortcut-icon {
  width: 40px;
  height: 40px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hl);
  background: var(--hl-soft);
  border: 1px solid var(--hl-line);
  border-radius: 12px;
}

.shortcut-icon svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.shortcut-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.shortcut-copy strong {
  overflow: hidden;
  color: var(--title);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.shortcut-copy small {
  overflow: hidden;
  color: var(--text3);
  font-size: 10.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================================================
   4. LISTAS
========================================================= */

.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.panel {
  min-width: 0;
  padding: 22px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.panel-header {
  min-height: 42px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.panel-header .section-eyebrow {
  margin-bottom: 3px;
  font-size: 9px;
}

.link-btn {
  padding: 3px 0;
  color: var(--hl);
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: 0;
  white-space: nowrap;
}

.link-btn:hover {
  text-decoration: underline;
}

.count-chip {
  min-width: 28px;
  height: 28px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.row-list {
  display: flex;
  flex-direction: column;
}

.list-row {
  min-height: 60px;
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--line);
}

.list-row:first-child {
  border-top: 0;
}

.avatar {
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--hl);
  border-radius: 11px;
  font-size: 11px;
  font-weight: 800;
}

.avatar.qr { background: #7c3aed; }
.avatar.danger { background: #dc2626; }
.avatar.warning { background: #d97706; }

.row-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.row-info strong {
  overflow: hidden;
  color: var(--title);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.row-info span {
  overflow: hidden;
  color: var(--text3);
  font-size: 10.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-row time {
  color: var(--text3);
  font-size: 10.5px;
  white-space: nowrap;
}

.due {
  font-weight: 700;
}

.due.danger { color: #f87171; }
.due.warning { color: #fbbf24; }

.pay-btn {
  padding: 8px 14px;
  color: var(--color-texto-botones, #fff);
  cursor: pointer;
  background: var(--color-botones, #2563eb);
  border: 0;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.pay-btn:hover {
  filter: brightness(1.12);
  transform: translateY(-1px);
}

/* =========================================================
   5. HORARIOS
========================================================= */

.tools {
  margin-top: 4px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.tools-title {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text3);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.tools-title i {
  height: 1px;
  flex: 1;
  background: var(--line);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.action-card {
  width: 100%;
  min-height: 78px;
  padding: 13px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  border-color: var(--hl-line);
  background: rgba(255, 255, 255, 0.025);
}

.action-icon {
  width: 44px;
  height: 44px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hl);
  background: var(--hl-soft);
  border: 1px solid var(--hl-line);
  border-radius: 13px;
}

.action-icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.action-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.action-info strong {
  overflow: hidden;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 15.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-info span {
  overflow: hidden;
  color: var(--text2);
  font-size: 11.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-arrow {
  width: 28px;
  height: 28px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  border-radius: 9px;
  transition: color 0.2s ease, background 0.2s ease;
}

.action-arrow svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.action-card:hover .action-arrow {
  color: var(--hl);
  background: var(--hl-soft);
}

/* =========================================================
   MODALES
========================================================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.84);
}

.camera-panel {
  width: min(460px, 94vw);
  padding: 25px;
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 21px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
}

.camera-header {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.camera-header span {
  color: var(--hl);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 1px;
}

.camera-header h3 {
  margin: 4px 0 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
}

.camera-header button {
  width: 37px;
  height: 37px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 21px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
  border-radius: 10px;
}

.camera-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #000;
  border: 1px solid var(--line2);
  border-radius: 15px;
}

.camera-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.face-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  mask: radial-gradient(circle, transparent 49%, #000 50%);
}

.qr-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 210px;
  height: 210px;
  transform: translate(-50%, -50%);
  border: 2px solid var(--hl);
  border-radius: 15px;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
}

.scanner-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: var(--hl);
  box-shadow: 0 0 10px var(--hl);
  animation: scan 2s infinite ease-in-out;
}

.camera-footer {
  text-align: center;
}

.camera-footer p {
  margin: 17px 0;
  color: var(--text2);
  font-size: 13px;
}

.camera-footer button {
  width: 100%;
  padding: 12px;
  color: #fff;
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--line2);
  border-radius: 10px;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.2s;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}

@keyframes scan {
  0%, 100% { top: 0; }
  50% { top: 100%; }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .hero-row {
    grid-template-columns: minmax(0, 1fr) 340px;
  }

  .shortcut-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .hero-row {
    grid-template-columns: 1fr;
  }

  .two-col {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   MÓVIL (≤ 680px)
========================================================= */

@media (max-width: 680px) {
  .dashboard-container {
    padding: 14px 12px 40px;
    gap: 14px;
  }

  /* ---- Encabezado compacto ---- */
  .hero-row {
    gap: 12px;
  }

  .hero {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding: 18px 16px;
    border-radius: 18px;
  }

  .branch-badge {
    margin-bottom: 12px;
    padding: 4px 9px;
    font-size: 9.5px;
  }

  .hero-main h1 {
    font-size: 24px;
  }

  .hero-main p {
    margin-top: 6px;
    font-size: 12.5px;
  }

  .hero-status {
    min-width: 0;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-pill,
  .billing-pill {
    height: 32px;
    padding: 0 12px;
    font-size: 11px;
  }

  /* ---- Hoy ---- */
  .today-card {
    padding: 14px 2px;
    border-radius: 18px;
  }

  .today-cell {
    padding: 4px 4px;
    gap: 6px;
  }

  .today-cell strong {
    font-size: 24px;
  }

  .today-cell > span {
    font-size: 8.5px;
  }

  .kpi-icon {
    width: 34px;
    height: 34px;
  }

  /* ---- Acceso: dos mosaicos grandes ---- */
  .access-grid {
    gap: 10px;
  }

  .access-card {
    min-height: 136px;
    padding: 16px 12px;
    flex-direction: column;
    justify-content: center;
    gap: 12px;
    text-align: center;
    border-radius: 18px;
  }

  .access-icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }

  .access-icon svg {
    width: 27px;
    height: 27px;
  }

  .access-copy {
    align-items: center;
    gap: 3px;
  }

  .access-copy strong {
    font-size: 16px;
  }

  .access-copy small {
    font-size: 11px;
  }

  .access-arrow {
    display: none;
  }

  /* ---- Accesos directos: mosaicos 2x2 ---- */
  .shortcut-grid {
    gap: 8px;
  }

  .shortcut {
    min-height: 92px;
    padding: 12px 8px 10px;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    text-align: center;
  }

  .shortcut-copy {
    width: 100%;
    align-items: center;
  }

  .shortcut-copy strong {
    font-size: 12px;
  }

  .shortcut-copy small {
    display: none;
  }

  /* ---- Listas ---- */
  .panel {
    padding: 16px 14px;
    border-radius: 16px;
  }

  .panel-header {
    min-height: 0;
  }

  .panel-header h2 {
    font-size: 17px;
  }

  .list-row {
    grid-template-columns: 36px minmax(0, 1fr) auto;
    gap: 10px;
  }

  .avatar {
    width: 36px;
    height: 36px;
  }

  .list-row time {
    display: none;
  }

  /* ---- Horarios ---- */
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .action-card {
    min-height: 66px;
    padding: 10px 12px;
    gap: 11px;
    border-radius: 14px;
  }

  .action-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }

  .action-info strong {
    font-size: 14.5px;
  }

  /* ---- Modales ---- */
  .modal-overlay {
    padding: 8px;
  }

  .camera-panel {
    padding: 19px;
  }
}

@media (max-width: 380px) {
  .access-copy strong {
    font-size: 14.5px;
  }

  .today-cell strong {
    font-size: 21px;
  }

  .shortcut {
    padding: 10px 4px 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
<template>
  <RouterView />
  <!--<HelpButton v-if="userRole === 'Owner'" />
  <HelpButton2 v-if="userRole === 'recepcion'" />
  <HelpButton3 v-if="userRole === 'member'" />-->

  <HelpButton/>
  <HelpButton2/>
  <HelpButton3/>
  
  <transition name="fade">
    <div v-if="mostrarAvisoInactividad" class="inactivity-overlay">
      <div class="inactivity-modal glass-effect">
        <div class="warning-icon-wrap">
          <svg viewBox="0 0 24 24" class="warning-icon" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L1 21h22L12 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="rgba(245,158,11,0.12)"/>
            <path d="M12 9v5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            <circle cx="12" cy="17" r="1" fill="currentColor"/>
          </svg>
        </div>

        <h3>Inactividad detectada</h3>
        <p>Por tu seguridad, la sesión se cerrará automáticamente por falta de actividad.</p>

        <div class="countdown-ring">
          <svg viewBox="0 0 120 120" class="ring-svg">
            <circle cx="60" cy="60" r="54" class="ring-track" />
            <circle
              cx="60" cy="60" r="54"
              class="ring-progress"
              :stroke-dasharray="2 * Math.PI * 54"
              :stroke-dashoffset="dashOffset"
            />
          </svg>
          <div class="countdown-number">
            {{ segundosRestantes }}<span>s</span>
          </div>
        </div>

        <p class="sub-text">Mueve el cursor o presiona cualquier tecla para continuar trabajando.</p>

        <div class="modal-actions">
          <button class="action-btn-secondary" @click="ejecutarCierreSesion">
            Cerrar sesión ahora
          </button>
          <button class="action-btn-full" @click="reiniciarTemporizador">
            Continuar sesión
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { RouterView } from 'vue-router';
import HelpButton from './components/Owner/HelpButton.vue';
import HelpButton2 from './components/Recepcion/HelpButton.vue';
import HelpButton3 from './components/Member/HelpButton.vue';

const router = useRouter();

const userRole = ref(localStorage.getItem('user_role') || '');

function safeJsonParse(raw: string | null, fallback: any = null) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn('localStorage corrupto, usando valores por defecto:', e);
    return fallback;
  }
}

// --- CONTROL DE INACTIVIDAD (sin cambios) ---
let inactivityTimer: number | null = null;
let countdownTimer: number | null = null;

const INACTIVITY_TIME_LIMIT = 10 * 60 * 1000;
const COUNTDOWN_TIME_LIMIT = 60;
const LAST_ACTIVITY_KEY = 'last_activity_timestamp';

const mostrarAvisoInactividad = ref(false);
const segundosRestantes = ref(COUNTDOWN_TIME_LIMIT);

const progresoCountdown = computed(() => segundosRestantes.value / COUNTDOWN_TIME_LIMIT);
const CIRCUNFERENCIA = 2 * Math.PI * 54;
const dashOffset = computed(() => CIRCUNFERENCIA * (1 - progresoCountdown.value));

const marcarActividad = () => {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
};

const ejecutarCierreSesion = () => {
  detenerMonitoreoInactividad();
  localStorage.removeItem('user_role');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem(LAST_ACTIVITY_KEY);
  router.replace({ name: 'login' });
};

const verificarSesionExpiradaAlCargar = (): boolean => {
  const hayCredenciales = !!localStorage.getItem('token') || !!localStorage.getItem('user_role');
  if (!hayCredenciales) return false;

  const ultimaActividadRaw = localStorage.getItem(LAST_ACTIVITY_KEY);
  if (!ultimaActividadRaw) {
    ejecutarCierreSesion();
    return true;
  }

  const ultimaActividad = parseInt(ultimaActividadRaw, 10);
  const tiempoTranscurrido = Date.now() - ultimaActividad;

  if (tiempoTranscurrido >= INACTIVITY_TIME_LIMIT) {
    ejecutarCierreSesion();
    return true;
  }
  return false;
};

const iniciarCuentaRegresiva = () => {
  mostrarAvisoInactividad.value = true;
  segundosRestantes.value = COUNTDOWN_TIME_LIMIT;
  if (countdownTimer) clearInterval(countdownTimer);
  countdownTimer = window.setInterval(() => {
    segundosRestantes.value--;
    if (segundosRestantes.value <= 0) {
      clearInterval(countdownTimer as number);
      mostrarAvisoInactividad.value = false;
      ejecutarCierreSesion();
    }
  }, 1000);
};

const reiniciarTemporizador = () => {
  marcarActividad();
  if (mostrarAvisoInactividad.value) {
    mostrarAvisoInactividad.value = false;
    if (countdownTimer) clearInterval(countdownTimer);
  }
  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = window.setTimeout(iniciarCuentaRegresiva, INACTIVITY_TIME_LIMIT);
};

const iniciarMonitoreoInactividad = () => {
  const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  eventos.forEach(evento => window.addEventListener(evento, reiniciarTemporizador));
  reiniciarTemporizador();
};

const detenerMonitoreoInactividad = () => {
  const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  eventos.forEach(evento => window.removeEventListener(evento, reiniciarTemporizador));
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (countdownTimer) clearInterval(countdownTimer);
};

const manejarCambioStorage = (evento: StorageEvent) => {
  if (evento.key === 'user_role' && evento.newValue === null) {
    ejecutarCierreSesion();
  }
};

// --- CSS por rol (sin cambios respecto a la versión anterior) ---
const ROLE_STYLE_LINK_ID = 'role-stylesheet';

const RUTAS_CSS_POR_ROL: Record<string, string> = {
  owner: '/src/assets/styles-owner.css',
  member: '/src/assets/styles-member.css',
  recepcion: '/src/assets/styles-recepcion.css',
};

const cargarEstiloDelRol = () => {
  const rol = (localStorage.getItem('user_role') || '').toLowerCase();
  const ruta = RUTAS_CSS_POR_ROL[rol];

  let link = document.getElementById(ROLE_STYLE_LINK_ID) as HTMLLinkElement | null;

  if (!ruta) {
    if (link) link.remove();
    return;
  }

  if (!link) {
    link = document.createElement('link');
    link.id = ROLE_STYLE_LINK_ID;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  if (!link.href.endsWith(ruta)) {
    link.href = ruta;
  }
};

const aplicarEstilosGlobales = () => {
  const rol = (localStorage.getItem('user_role') || '').toLowerCase();
  const savedColors = safeJsonParse(localStorage.getItem(`app-colors-${rol}`)) || {};
  const savedRadius = localStorage.getItem(`app-radius-${rol}`);
  const savedDensidad = localStorage.getItem(`app-densidad-${rol}`);

  const root = document.documentElement;

  // ============================================================
  // CAMBIO CLAVE: antes solo se hacía setProperty() de los valores
  // que existieran en savedColors, dejando cualquier variable no
  // presente CON EL VALOR ANTERIOR (el del rol previo). Ahora, para
  // cada variable, si el rol actual no tiene un color guardado
  // (savedColors.x es undefined), se hace removeProperty() para
  // que caiga de nuevo al valor de global-theme.css / :root en vez
  // de arrastrar el color del rol anterior.
  // ============================================================
  const aplicarOFallback = (prop: string, valor: string | undefined) => {
    if (valor) {
      root.style.setProperty(prop, valor);
    } else {
      root.style.removeProperty(prop);
    }
  };

  aplicarOFallback('--color-heading-bg', savedColors.headingBg);
  aplicarOFallback('--color-tablas', savedColors.tablas);
  aplicarOFallback('--color-interfaz', savedColors.interfaz);
  aplicarOFallback('--bg-custom', savedColors.interfaz);
  aplicarOFallback('--color-botones', savedColors.botones);
  aplicarOFallback('--bg-cards', savedColors.tarjetas);
  aplicarOFallback('--color-titulos', savedColors.titulos);
  aplicarOFallback('--color-highlight', savedColors.highlight);
  aplicarOFallback('--color-etiquetas', savedColors.etiquetas);
  aplicarOFallback('--color-texto-general', savedColors.textoGeneral);
  aplicarOFallback('--color-texto-botones', savedColors.textoBotones);
  aplicarOFallback('--color-svg', savedColors.svgColor);
  aplicarOFallback('--app-border-radius', savedRadius || undefined);

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
  cargarEstiloDelRol();
  aplicarEstilosGlobales();
  window.addEventListener('app-settings-updated', aplicarEstilosGlobales);
  window.addEventListener('storage', manejarCambioStorage);

  const expiro = verificarSesionExpiradaAlCargar();
  if (!expiro) {
    iniciarMonitoreoInactividad();
  }

  // ============================================================
  // CAMBIO PRINCIPAL: router.afterEach
  // App.vue se monta UNA sola vez por sesión de SPA. Antes,
  // aplicarEstilosGlobales() solo corría en este onMounted, es decir,
  // solo la PRIMERA vez que se cargaba la página completa. Cualquier
  // navegación posterior dentro del SPA (Owner -> Dashboard Member,
  // por ejemplo) NO volvía a leer el rol ni a reaplicar sus colores;
  // las variables CSS en document.documentElement (que son globales
  // para TODO el documento, no por componente) se quedaban con los
  // valores que dejó el rol anterior.
  //
  // Con este hook, CADA VEZ que cambias de ruta (entrar a cualquier
  // panel, sin importar si es la página de configuración o no) se
  // vuelve a leer `user_role` desde localStorage y se reaplican tanto
  // el <link> de CSS del rol (cargarEstiloDelRol) como las variables
  // de color/densidad/radius namespaceadas (aplicarEstilosGlobales),
  // sobrescribiendo cualquier valor que haya dejado el rol anterior.
  //
  // Esto es lo que hace que Member SIEMPRE vea sus propios colores al
  // entrar a su panel, sin importar qué tema tenía aplicado Owner
  // segundos antes en la misma pestaña.
  // ============================================================
  router.afterEach(() => {
    cargarEstiloDelRol();
    aplicarEstilosGlobales();
  });
});

onUnmounted(() => {
  window.removeEventListener('app-settings-updated', aplicarEstilosGlobales);
  window.removeEventListener('storage', manejarCambioStorage);
  detenerMonitoreoInactividad();
});
</script>

<style>
@import './assets/global-theme.css';


body {
  margin: 0;
  padding: 0;
  background-color: var(--bg-custom, #0f172a);
  color: var(--color-texto-general, white);
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
  transition: background-color 0.3s ease, color 0.3s ease;
}

::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: var(--bg-custom, #0f172a);
}
::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* ---------- Modal de Inactividad (rediseñado) ---------- */

.inactivity-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

.inactivity-modal {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 32px 28px;
  border-radius: var(--app-border-radius, 24px);
  width: 100%;
  max-width: 380px;
  text-align: center;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(245, 158, 11, 0.05);
  animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-sizing: border-box;
}

.warning-icon-wrap {
  width: 56px;
  height: 56px;
  margin: 0 auto 14px;
  border-radius: 50%;
  background: rgba(245, 158, 11, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulseRing 2s ease-in-out infinite;
}

.warning-icon {
  width: 28px;
  height: 28px;
  color: #f59e0b;
}

.inactivity-modal h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.35rem;
  margin: 0 0 8px 0;
  color: var(--color-titulos, #ffffff);
  letter-spacing: 0.3px;
}

.inactivity-modal p {
  color: var(--color-texto-general, rgba(245, 245, 244, 0.7));
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.countdown-ring {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 8;
}

.ring-progress {
  fill: none;
  stroke: #f59e0b;
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 1s linear;
  filter: drop-shadow(0 0 6px rgba(245, 158, 11, 0.5));
}

.countdown-number {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Oswald', sans-serif;
  font-size: 2.1rem;
  font-weight: bold;
  color: #ffffff;
}

.countdown-number span {
  font-size: 1rem;
  opacity: 0.6;
  margin-left: 3px;
  align-self: center;
}

.sub-text {
  font-size: 0.82rem !important;
  opacity: 0.5;
  margin-bottom: 22px !important;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-btn-full {
  background: #f59e0b;
  color: #1a1a1a;
  border: none;
  border-radius: calc(var(--app-border-radius, 24px) / 2);
  padding: 13px 20px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.action-btn-full:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

.action-btn-secondary {
  background: transparent;
  color: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: calc(var(--app-border-radius, 24px) / 2);
  padding: 11px 20px;
  font-weight: 500;
  font-size: 0.85rem;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}

.action-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.85);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes modalPop {
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulseRing {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0.25); }
  50% { box-shadow: 0 0 0 10px rgba(245, 158, 11, 0); }
}
</style>
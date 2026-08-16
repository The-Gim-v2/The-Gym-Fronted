<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { RouterView } from 'vue-router';
import HelpButton from './components/Owner/HelpButton.vue';
import HelpButton2 from './components/Recepcion/HelpButton.vue';
import HelpButton3 from './components/Member/HelpButton.vue';

const router = useRouter();

const userRole = ref(localStorage.getItem('user_role') || '');

// --- CONTROL DE INACTIVIDAD Y ADVERTENCIA ---
let inactivityTimer: number | null = null;
let countdownTimer: number | null = null;

const INACTIVITY_TIME_LIMIT = 10 * 60 * 1000; // 10 minutos de uso normal
const COUNTDOWN_TIME_LIMIT = 60; // 60 segundos de advertencia visual
const LAST_ACTIVITY_KEY = 'last_activity_timestamp';

const mostrarAvisoInactividad = ref(false);
const segundosRestantes = ref(COUNTDOWN_TIME_LIMIT);

// Progreso del anillo de cuenta regresiva (0 a 1)
const progresoCountdown = computed(() => segundosRestantes.value / COUNTDOWN_TIME_LIMIT);
const CIRCUNFERENCIA = 2 * Math.PI * 54; // radio 54
const dashOffset = computed(() => CIRCUNFERENCIA * (1 - progresoCountdown.value));

const marcarActividad = () => {
  localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
};

const ejecutarCierreSesion = () => {
  detenerMonitoreoInactividad();

  // Limpieza total de credenciales y del rol de seguridad
  localStorage.removeItem('user_role');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem(LAST_ACTIVITY_KEY);

  // Redirección segura reemplazando la ruta para evitar que el botón "Atrás" regrese al panel
  router.replace({ name: 'login' });
};

// --- NUEVO: verifica, ANTES de montar el monitoreo normal, si la sesión ya
// expiró mientras la pestaña estaba cerrada. Esto es lo que faltaba: el
// setTimeout de abajo se destruye al cerrar la pestaña, así que si el usuario
// cierra el navegador y vuelve pasados los 10 minutos, hay que detectarlo
// comparando contra el timestamp guardado, no contra un timer que ya no existe.
const verificarSesionExpiradaAlCargar = (): boolean => {
  const hayCredenciales = !!localStorage.getItem('token') || !!localStorage.getItem('user_role');
  if (!hayCredenciales) return false;

  const ultimaActividadRaw = localStorage.getItem(LAST_ACTIVITY_KEY);

  // Si hay credenciales pero nunca se registró actividad (dato viejo/corrupto),
  // tratamos la sesión como expirada por seguridad.
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

  // Si el modal de advertencia está abierto y el usuario interactúa, cancelamos el cierre
  if (mostrarAvisoInactividad.value) {
    mostrarAvisoInactividad.value = false;
    if (countdownTimer) clearInterval(countdownTimer);
  }

  if (inactivityTimer) clearTimeout(inactivityTimer);
  inactivityTimer = window.setTimeout(iniciarCuentaRegresiva, INACTIVITY_TIME_LIMIT);
};

const iniciarMonitoreoInactividad = () => {
  const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  eventos.forEach(evento => {
    window.addEventListener(evento, reiniciarTemporizador);
  });
  reiniciarTemporizador();
};

const detenerMonitoreoInactividad = () => {
  const eventos = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
  eventos.forEach(evento => {
    window.removeEventListener(evento, reiniciarTemporizador);
  });
  if (inactivityTimer) clearTimeout(inactivityTimer);
  if (countdownTimer) clearInterval(countdownTimer);
};

// --- NUEVO: sincronización entre pestañas. Si cierras sesión en una pestaña
// (o expira ahí), las demás pestañas abiertas también deben cerrar sesión.
const manejarCambioStorage = (evento: StorageEvent) => {
  if (evento.key === 'user_role' && evento.newValue === null) {
    ejecutarCierreSesion();
  }
};
// ---------------------------------------------

// Función para tus estilos globales
const aplicarEstilosGlobales = () => {
  const savedColors = JSON.parse(localStorage.getItem('app-colors') || '{}');
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

  if (savedRadius) root.style.setProperty('--app-border-radius', savedRadius);

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
  window.addEventListener('storage', manejarCambioStorage);

  // Primero verificamos si la sesión ya expiró (pestaña cerrada y reabierta
  // pasados los 10 min). Si expiró, ejecutarSesionExpiradaAlCargar ya
  // redirige a login y no hace falta arrancar el monitoreo.
  const expiro = verificarSesionExpiradaAlCargar();
  if (!expiro) {
    iniciarMonitoreoInactividad();
  }
});

onUnmounted(() => {
  window.removeEventListener('app-settings-updated', aplicarEstilosGlobales);
  window.removeEventListener('storage', manejarCambioStorage);
  detenerMonitoreoInactividad();
});
</script>

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

<style>
@import './assets/global-theme.css';
@import '@/assets/styles-member.css';

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
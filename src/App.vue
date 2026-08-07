<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { RouterView } from 'vue-router';
import HelpButton from './components/Owner/HelpButton.vue';

const router = useRouter();

// --- CONTROL DE INACTIVIDAD Y ADVERTENCIA ---
let inactivityTimer: number | null = null;
let countdownTimer: number | null = null;

const INACTIVITY_TIME_LIMIT = 14 * 60 * 1000; // 14 minutos de uso normal
const COUNTDOWN_TIME_LIMIT = 60; // 60 segundos de advertencia visual

const mostrarAvisoInactividad = ref(false);
const segundosRestantes = ref(COUNTDOWN_TIME_LIMIT);

const ejecutarCierreSesion = () => {
  detenerMonitoreoInactividad();
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
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
  iniciarMonitoreoInactividad();
});

onUnmounted(() => {
  window.removeEventListener('app-settings-updated', aplicarEstilosGlobales);
  detenerMonitoreoInactividad();
});
</script>

<template>
  <RouterView />
  <HelpButton />

  <!-- MODAL DE ADVERTENCIA POR INACTIVIDAD -->
  <transition name="fade">
    <div v-if="mostrarAvisoInactividad" class="inactivity-overlay">
      <div class="inactivity-modal glass-effect">
        <div class="warning-icon">⚠️</div>
        <h3>Inactividad Detectada</h3>
        <p>Por tu seguridad, la sesión se cerrará automáticamente debido a la falta de actividad en:</p>
        
        <div class="countdown-number">
          {{ segundosRestantes }}<span>s</span>
        </div>

        <p class="sub-text">Mueve el cursor o presiona cualquier tecla para continuar trabajando.</p>
        
        <button class="action-btn-full" @click="reiniciarTemporizador">
          Continuar Sesión
        </button>
      </div>
    </div>
  </transition>
</template>

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

/* Estilos para el Modal de Inactividad */
.inactivity-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(10px);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.inactivity-modal {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 36px;
  border-radius: var(--app-border-radius, 24px);
  width: 90%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.7);
  animation: modalPop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.warning-icon {
  font-size: 3rem;
  margin-bottom: 12px;
}

.inactivity-modal h3 {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  margin: 0 0 12px 0;
  color: var(--color-titulos, #ffffff);
}

.inactivity-modal p {
  color: var(--color-texto-general, rgba(245, 245, 244, 0.7));
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.countdown-number {
  font-family: 'Oswald', sans-serif;
  font-size: 3.5rem;
  color: var(--color-highlight, #3b82f6);
  font-weight: bold;
  margin-bottom: 10px;
  text-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
}

.countdown-number span {
  font-size: 1.5rem;
  opacity: 0.7;
}

.sub-text {
  font-size: 0.85rem !important;
  opacity: 0.5;
  margin-bottom: 24px !important;
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
</style>
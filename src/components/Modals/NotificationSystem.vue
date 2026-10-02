<template>
  <Teleport to="body">
    <div class="ns-stack" aria-live="polite">
      <TransitionGroup name="ns" tag="div" class="ns-list">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="ns-toast"
          :class="`ns-${toast.type}`"
          role="status"
        >
          <div class="ns-icon">
            <!-- Success -->
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            <!-- Warning -->
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
            <!-- Error -->
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            <!-- Info -->
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
          </div>

          <div class="ns-body">
            <strong class="ns-title">{{ titleFor(toast.type) }}</strong>
            <p class="ns-message">{{ toast.message }}</p>
          </div>

          <button type="button" class="ns-close" aria-label="Cerrar" @click="removeToast(toast.id)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>

          <!-- Barra de tiempo: al terminar cierra el aviso; se pausa con el cursor encima -->
          <span
            class="ns-progress"
            :style="{ animationDuration: toast.duration + 'ms' }"
            @animationend="removeToast(toast.id)"
          ></span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

const MAX_VISIBLE = 3;

const toasts = ref<Toast[]>([]);
let uid = 0;

/* ---------- Idioma de los títulos ---------- */
const lang = ref(localStorage.getItem('owner-idioma') || 'es');

const TITLES_ES: Record<ToastType, string> = {
  success: 'Listo',
  warning: 'Atención',
  error: 'Error',
  info: 'Información'
};

const TITLES: Record<string, Record<ToastType, string>> = {
  es: TITLES_ES,
  en: { success: 'Done', warning: 'Heads up', error: 'Error', info: 'Info' },
  fr: { success: 'Terminé', warning: 'Attention', error: 'Erreur', info: 'Information' },
  pt: { success: 'Pronto', warning: 'Atenção', error: 'Erro', info: 'Informação' }
};

const titleFor = (type: ToastType): string => (TITLES[lang.value] ?? TITLES_ES)[type];

const handleLangChange = (e: Event) => {
  const detail = (e as CustomEvent<{ idioma?: string }>).detail;
  if (detail && detail.idioma) lang.value = detail.idioma;
};

onMounted(() => window.addEventListener('idioma-changed', handleLangChange));
onUnmounted(() => window.removeEventListener('idioma-changed', handleLangChange));

/* ---------- API ---------- */
const removeToast = (id: number) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

// notify(mensaje, tipo = 'success', duracionMs = 3500)
const notify = (message: string, type: ToastType = 'success', duration = 3500) => {
  // Si el mismo mensaje ya está visible lo reiniciamos en vez de duplicarlo
  toasts.value = toasts.value.filter((t) => t.message !== message);
  toasts.value.push({ id: ++uid, message, type, duration });

  if (toasts.value.length > MAX_VISIBLE) toasts.value.shift();
};

defineExpose({ notify });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* Clases propias (ns-*): así no les afectan los :deep(.toast-container) de otras pantallas */
.ns-stack {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100000; /* por encima de los modales */
  width: min(380px, calc(100vw - 32px));
  pointer-events: none;
}

.ns-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.ns-toast {
  --ns-color: var(--color-highlight, #3b82f6);

  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  overflow: hidden;
  padding: 14px 12px 16px 14px;
  pointer-events: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: 3px solid var(--ns-color);
  border-radius: 14px;
  background: var(--bg-cards, #161616);
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', sans-serif;
}

/* Tinte suave del color del tipo */
.ns-toast::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, color-mix(in srgb, var(--ns-color) 13%, transparent), transparent 65%);
  pointer-events: none;
}

.ns-success { --ns-color: #10b981; }
.ns-warning { --ns-color: #f59e0b; }
.ns-error   { --ns-color: #ef4444; }
.ns-info    { --ns-color: var(--color-highlight, #3b82f6); }

.ns-icon {
  position: relative;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: color-mix(in srgb, var(--ns-color) 18%, transparent);
  color: var(--ns-color);
}
.ns-icon svg { width: 17px; height: 17px; }

.ns-body { position: relative; flex: 1; min-width: 0; padding-top: 1px; }

.ns-title {
  display: block;
  margin-bottom: 2px;
  color: var(--color-titulos, #fff);
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.1px;
}

.ns-message {
  margin: 0;
  color: var(--color-texto-general, #cbd5e1);
  font-size: 0.8rem;
  line-height: 1.45;
  opacity: 0.9;
  overflow-wrap: anywhere;
}

.ns-close {
  position: relative;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: rgba(255, 255, 255, 0.45);
  transition: background 0.2s, color 0.2s;
}
.ns-close:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
.ns-close svg { width: 14px; height: 14px; }

/* Barra de tiempo */
.ns-progress {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: var(--ns-color);
  opacity: 0.75;
  transform-origin: left center;
  animation-name: ns-countdown;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
.ns-toast:hover .ns-progress { animation-play-state: paused; }

@keyframes ns-countdown {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

/* Entrada / salida / reordenamiento */
.ns-enter-active { transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease; }
.ns-leave-active { transition: transform 0.25s ease, opacity 0.2s ease; position: absolute; left: 0; right: 0; }
.ns-enter-from   { opacity: 0; transform: translateX(32px) scale(0.97); }
.ns-leave-to     { opacity: 0; transform: translateX(32px); }
.ns-move         { transition: transform 0.3s ease; }

/* Móvil: aviso a lo ancho, arriba */
@media (max-width: 600px) {
  .ns-stack { top: 12px; right: 16px; left: 16px; width: auto; }
  .ns-enter-from,
  .ns-leave-to { transform: translateY(-20px); }
}

@media (prefers-reduced-motion: reduce) {
  .ns-enter-active,
  .ns-leave-active,
  .ns-move { transition: opacity 0.15s ease; }
  .ns-enter-from,
  .ns-leave-to { transform: none; }
}
</style>
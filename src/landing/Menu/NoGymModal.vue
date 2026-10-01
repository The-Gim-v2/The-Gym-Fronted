<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

defineProps<{ rol: 'atleta' | 'entrenador' }>();
const emit = defineEmits<{ (e: 'add'): void; (e: 'skip'): void; (e: 'close'): void }>();

const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') emit('close'); };
onMounted(() => document.addEventListener('keydown', onKey));
onUnmounted(() => document.removeEventListener('keydown', onKey));
</script>

<template>
  <div class="ng-overlay" @click.self="emit('close')">
    <div class="ng-modal" role="dialog" aria-modal="true" aria-labelledby="ng-title">

      <button type="button" class="ng-close" aria-label="Cerrar" @click="emit('close')">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
      </button>

      <!-- Ilustración: ubicación de gimnasio con signo + -->
      <div class="ng-art" aria-hidden="true">
        <svg width="132" height="112" viewBox="0 0 132 112" fill="none">
          <defs>
            <linearGradient id="ngPin" x1="66" y1="8" x2="66" y2="84" gradientUnits="userSpaceOnUse">
              <stop stop-color="#5b8bf0"/>
              <stop offset="1" stop-color="#1c4fd6"/>
            </linearGradient>
            <radialGradient id="ngGlow" cx="0.5" cy="0.5" r="0.5">
              <stop stop-color="#1c4fd6" stop-opacity="0.35"/>
              <stop offset="1" stop-color="#1c4fd6" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <circle cx="66" cy="56" r="54" fill="url(#ngGlow)"/>
          <ellipse cx="66" cy="96" rx="26" ry="6" fill="#000" opacity="0.45"/>
          <ellipse cx="66" cy="96" rx="14" ry="3" stroke="#5b8bf0" stroke-opacity="0.6" stroke-width="1.5"/>
          <path d="M66 8c-19.3 0-35 15.2-35 34 0 24 35 54 35 54s35-30 35-54c0-18.8-15.7-34-35-34z" fill="url(#ngPin)"/>
          <circle cx="66" cy="42" r="19" fill="#0f0f0f"/>
          <path d="M66 32v20M56 42h20" stroke="#fff" stroke-width="4.5" stroke-linecap="round"/>
        </svg>
      </div>

      <h3 id="ng-title" class="ng-title">Aún no eliges tu gimnasio</h3>
      <p class="ng-text">
        Para {{ rol === 'atleta' ? 'entrenar' : 'trabajar' }} necesitas estar en un gimnasio.
        Búscalo ahora y elígelo en un par de clics.
      </p>

      <div class="ng-actions">
        <button type="button" class="ng-btn primary" @click="emit('add')">
          Añadir gimnasio
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
        <button type="button" class="ng-btn ghost" @click="emit('skip')">Continuar sin gimnasio</button>
      </div>

      <p class="ng-note">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><circle cx="12" cy="7.8" r="0.6" fill="currentColor"/></svg>
        Si continúas sin gimnasio, podrás elegirlo después desde tu perfil.
      </p>
    </div>
  </div>
</template>

<style scoped>
.ng-overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0, 0, 0, 0.72); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; padding: 20px;
}

.ng-modal {
  position: relative; width: 100%; max-width: 410px; text-align: center; overflow: hidden;
  background:
    radial-gradient(120% 70% at 50% 0%, rgba(28, 79, 214, 0.2) 0%, rgba(28, 79, 214, 0) 65%),
    #121212;
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px;
  padding: 30px 28px 24px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(28, 79, 214, 0.08);
  color: #f5f5f4; font-family: 'Inter', sans-serif;
  animation: ng-in 0.28s cubic-bezier(0.2, 0.9, 0.3, 1);
}
@keyframes ng-in { from { opacity: 0; transform: translateY(14px) scale(0.97); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .ng-modal { animation: none; } }

.ng-close {
  position: absolute; top: 14px; right: 14px; width: 34px; height: 34px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center; cursor: pointer;
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 244, 0.6); transition: background 0.2s ease, color 0.2s ease;
}
.ng-close:hover { background: rgba(255, 255, 255, 0.12); color: #fff; }

.ng-art { display: flex; justify-content: center; margin: 2px 0 6px; }

.ng-title {
  font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 24px;
  letter-spacing: 0.2px; margin: 0 0 10px; color: #fff;
}
.ng-text {
  font-size: 14.5px; line-height: 1.6; color: rgba(245, 245, 244, 0.68);
  margin: 0 auto 24px; max-width: 320px;
}

.ng-actions { display: flex; flex-direction: column; gap: 10px; }
.ng-btn {
  width: 100%; min-height: 52px; border-radius: 14px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 9px;
  font-family: 'Oswald', sans-serif; font-weight: 700; font-size: 14.5px;
  letter-spacing: 0.5px; text-transform: uppercase; transition: background 0.2s ease, border-color 0.2s ease;
}
.ng-btn.primary {
  background: linear-gradient(180deg, #2a5de6 0%, #1c4fd6 100%); border: none; color: #fff;
  box-shadow: 0 12px 26px rgba(28, 79, 214, 0.35);
}
.ng-btn.primary:hover { background: linear-gradient(180deg, #3568ee 0%, #2158e0 100%); }
.ng-btn.ghost { background: transparent; border: 1.5px solid rgba(255, 255, 255, 0.14); color: rgba(245, 245, 244, 0.85); }
.ng-btn.ghost:hover { background: rgba(255, 255, 255, 0.06); border-color: rgba(255, 255, 255, 0.24); }
.ng-btn:focus-visible, .ng-close:focus-visible { outline: 2px solid #5b8bf0; outline-offset: 2px; }

.ng-note {
  display: flex; align-items: flex-start; justify-content: center; gap: 7px;
  margin: 18px auto 0; max-width: 310px; text-align: left;
  font-size: 12px; line-height: 1.45; color: rgba(245, 245, 244, 0.5);
}
.ng-note svg { flex-shrink: 0; margin-top: 1px; color: #5b8bf0; }
</style>
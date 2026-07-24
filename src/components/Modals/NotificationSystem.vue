<template>
  <div class="toast-container">
    <transition-group name="toast-anim" tag="div">
      <div v-for="toast in toasts" :key="toast.id" :class="['toast', toast.type]">
        <div class="toast-icon">
          <!-- Icono Success -->
          <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor"/></svg>
          <!-- Icono Error -->
          <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>
          <!-- Icono Warning -->
          <svg v-else viewBox="0 0 24 24" width="20" height="20"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/></svg>
        </div>
        <div class="toast-content">
          <span class="toast-message">{{ toast.message }}</span>
        </div>
        <button class="toast-close" @click="removeToast(toast.id)">×</button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning';
}

const toasts = ref<Toast[]>([]);

const notify = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
  const id = Date.now();
  toasts.value.push({ id, message, type });
  
  // Auto eliminar después de 3.5 segundos
  setTimeout(() => {
    removeToast(id);
  }, 3500);
};

const removeToast = (id: number) => {
  toasts.value = toasts.value.filter(t => t.id !== id);
};

defineExpose({ notify });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 380px;
  width: 100%;
  pointer-events: none; /* Permite hacer clic a través del contenedor vacío */
}

.toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: 14px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

/* Tipos de Toast con identidad visual moderna */
.toast.success {
  background: rgba(16, 185, 129, 0.85);
  border-color: rgba(52, 211, 153, 0.3);
}

.toast.error {
  background: rgba(239, 68, 68, 0.85);
  border-color: rgba(248, 113, 113, 0.3);
}

.toast.warning {
  background: rgba(245, 158, 11, 0.85);
  border-color: rgba(251, 191, 36, 0.3);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
}

.toast-message {
  font-size: 0.9rem;
  font-weight: 500;
  line-height: 1.4;
  word-break: break-word;
}

.toast-close {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toast-close:hover {
  color: #ffffff;
}

/* Transiciones fluidas para entrada, salida y reordenamiento */
.toast-anim-enter-active,
.toast-anim-leave-active,
.toast-anim-move {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-anim-enter-from {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
}

.toast-anim-leave-to {
  opacity: 0;
  transform: translateX(50px) scale(0.95);
}

.toast-anim-leave-active {
  position: absolute;
  right: 0;
  left: 0;
}
</style>
<template>
  <div class="schedule-wrapper">
    <!-- Notificación Toast corta para móviles y escritorio -->
    <transition name="toast-slide">
      <div v-if="toast.show" :class="['toast-notification', toast.type]">
        <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>

    <div class="schedule-panel glass-effect">
      <!-- Header -->
      <div class="panel-header">
        <div class="title-container">
          <h3 class="title">{{ t('scheduleTitle') }}</h3>
          <span class="subtitle-mobile">{{ t('scheduleSubtitle') }}</span>
        </div>
        <button class="close-btn" @click="$emit('close')" :title="t('closeTitle')">✕</button>
      </div>

      <!-- Vista Móvil Optimizada -->
      <div class="mobile-only">
        <div class="mobile-nav">
          <div class="tabs-container">
            <button v-for="(dayKey, index) in dayKeys" :key="index"
                    :class="['tab', { active: activeDay === index }]"
                    @click="activeDay = index">
              {{ t(dayKey) }}
            </button>
          </div>
        </div>
        
        <div class="schedule-content">
          <div class="day-active-title">{{ t(dayKeys[activeDay]!) }}</div>
          <div class="slots-list">
            <div v-for="hour in hours" :key="hour" class="mobile-slot-card">
              <div class="slot-time-info">
                <span class="time-badge">{{ hour }} hrs</span>
                <div class="slot-status-info">
                  <span class="status">{{ t('statusAvailable') }}</span>
                  <span class="sub-text">{{ t('subtextFree') }}</span>
                </div>
              </div>
              <button class="action-btn" @click="selectSlot(dayKeys[activeDay]!, hour)">{{ t('btnReserve') }}</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Vista de Escritorio -->
      <div class="desktop-only">
        <table class="desktop-table">
          <thead>
            <tr>
              <th></th>
              <th v-for="dayKey in dayKeys" :key="dayKey">{{ t(dayKey) }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hour in hours" :key="hour">
              <td class="hour-cell">{{ hour }}</td>
              <td v-for="dayKey in dayKeys" :key="dayKey">
                <div class="slot-desktop" @click="selectSlot(dayKey, hour)">{{ t('statusAvailable') }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';

const settings = reactive({
  idioma: localStorage.getItem('app-idioma') || 'es'
});

const translations: Record<string, Record<string, string>> = {
  es: {
    scheduleTitle: "Horario Semanal",
    scheduleSubtitle: "Selecciona un horario disponible",
    closeTitle: "Cerrar",
    monday: "Lunes",
    tuesday: "Martes",
    wednesday: "Miércoles",
    thursday: "Jueves",
    friday: "Viernes",
    saturday: "Sábado",
    sunday: "Domingo",
    statusAvailable: "Disponible",
    subtextFree: "Libre para agendar",
    btnReserve: "Reservar",
    toastReserved: "¡Reservado!"
  },
  en: {
    scheduleTitle: "Weekly Schedule",
    scheduleSubtitle: "Select an available time slot",
    closeTitle: "Close",
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    statusAvailable: "Available",
    subtextFree: "Free to book",
    btnReserve: "Reserve",
    toastReserved: "Reserved!"
  }
};

const t = (key: string) => {
  return translations[settings.idioma]?.[key] || translations['es']?.[key] || key;
};

const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
const activeDay = ref(0);

const emit = defineEmits(['close', 'select-slot']);

// Estado de la notificación Toast con mensaje más corto
const toast = reactive({
  show: false,
  message: '',
  type: 'success'
});

const mostrarToast = (mensaje: string, tipo = 'success') => {
  toast.message = mensaje;
  toast.type = tipo;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 2200);
};

const selectSlot = (dayKey: string, hour: string) => {
  const dayName = t(dayKey);
  emit('select-slot', { day: dayName, hour });
  mostrarToast(`${t('toastReserved')} (${dayName} ${hour})`, 'success');
};

onMounted(() => {
  window.addEventListener('idioma-changed', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail && customEvent.detail.idioma) {
      settings.idioma = customEvent.detail.idioma;
    }
  });
});
</script>

<style scoped>
.schedule-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* --- Estilos del Toast --- */
.toast-notification {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: var(--app-border-radius, 12px);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  pointer-events: none;
  max-width: 90%;
  backdrop-filter: blur(10px);
}

.toast-notification.success {
  background: rgba(16, 185, 129, 0.9);
  border: 1px solid rgba(52, 211, 153, 0.4);
}

.toast-notification.error {
  background: rgba(239, 68, 68, 0.9);
  border: 1px solid rgba(248, 113, 113, 0.4);
}

.toast-notification svg {
  width: 16px;
  height: 16px;
  stroke: #fff;
  flex-shrink: 0;
}

.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translate(-50%, 15px);
}

.schedule-panel {
  background: var(--bg-cards, rgba(18, 18, 18, 0.92));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 24px);
  padding: 20px;
  width: 92%;
  max-width: 1000px;
  color: var(--color-texto-general, white);
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  margin: 0 auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
}

/* --- Vista Móvil Optimizada --- */
.mobile-only { display: block; }
.desktop-only { display: none; }

.mobile-nav {
  width: 100%;
  overflow-x: auto;
  margin-bottom: 16px;
  padding-bottom: 4px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.mobile-nav::-webkit-scrollbar { display: none; }

.tabs-container {
  display: flex;
  gap: 8px;
}

.tab {
  background: var(--bg-input, #16161a);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.05));
  color: var(--color-etiquetas, #94a3b8);
  padding: 8px 16px;
  border-radius: var(--app-border-radius, 12px);
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.tab.active {
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, white);
  border-color: var(--color-botones, #1c4fd6);
  box-shadow: 0 4px 12px rgba(28, 79, 214, 0.4);
}

.schedule-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.day-active-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  color: var(--color-titulos, #e2e8f0);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 2px;
  border-left: 3px solid var(--color-botones, #1c4fd6);
  padding-left: 8px;
}

.slots-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 2px;
}

.mobile-slot-card {
  background: var(--bg-input, #141418);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.06));
  padding: 12px 16px;
  border-radius: var(--app-border-radius, 14px);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.slot-time-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.time-badge {
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  color: var(--color-titulos, #fff);
  letter-spacing: 0.5px;
}

.slot-status-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status {
  color: #10b981;
  font-size: 0.8rem;
  font-weight: 600;
}

.sub-text {
  color: var(--color-etiquetas, #64748b);
  font-size: 0.72rem;
}

.action-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: var(--app-border-radius, 10px);
  cursor: pointer;
  font-weight: 600;
  font-size: 0.8rem;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
}

.action-btn:active {
  transform: scale(0.95);
}

/* --- Vista de Escritorio --- */
@media (min-width: 768px) {
  .schedule-panel { 
    padding: 20px; 
    display: flex;
    flex-direction: column;
  }
  .mobile-only { display: none; }
  .desktop-only { display: block; }

  .desktop-table { 
    width: 100%; 
    border-collapse: separate; 
    border-spacing: 10px; 
  }
  
  th { 
    color: var(--color-etiquetas, #94a3b8); 
    font-family: 'Oswald', sans-serif; 
    padding-bottom: 12px; 
    text-align: center; 
    font-weight: normal; 
    font-size: 1.05rem;
    letter-spacing: 0.5px;
  }
  
  .hour-cell { 
    font-family: 'Oswald', sans-serif; 
    font-weight: bold; 
    color: var(--color-titulos, #fff); 
    text-align: right; 
    padding-right: 15px; 
    font-size: 0.95rem;
  }
  
  .slot-desktop { 
    background: var(--bg-input, #141418); 
    padding: 16px; 
    border-radius: var(--app-border-radius, 12px); 
    text-align: center; 
    color: #10b981; 
    font-size: 0.85rem; 
    font-weight: 600;
    border: 1px solid var(--border-input, rgba(255, 255, 255, 0.05));
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .slot-desktop:hover {
    background: var(--bg-input-focus, #1a1a22);
    border-color: rgba(16, 185, 129, 0.4);
    transform: translateY(-2px);
  }
}

.panel-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 20px; 
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  padding-bottom: 12px;
}

.title-container {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.title { 
  font-family: 'Oswald', sans-serif; 
  margin: 0; 
  font-size: 1.4rem; 
  letter-spacing: 0.5px;
  color: var(--color-titulos, #fff);
}

.subtitle-mobile {
  font-size: 0.78rem;
  color: var(--color-etiquetas, #64748b);
}

.close-btn {
  background: var(--bg-input, #16161a);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.05));
  color: var(--color-texto-general, #fff);
  width: 36px;
  height: 36px;
  border-radius: var(--app-border-radius, 10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover { 
  background: rgba(239, 68, 68, 0.15); 
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444; 
}
</style>
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

    <div class="schedule-panel">
      <!-- Header -->
      <div class="panel-header">
        <div class="title-container">
          <h3 class="title">Horario Semanal</h3>
          <span class="subtitle-mobile">Selecciona un horario disponible</span>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Vista Móvil Optimizada -->
      <div class="mobile-only">
        <div class="mobile-nav">
          <div class="tabs-container">
            <button v-for="(day, index) in days" :key="index"
                    :class="['tab', { active: activeDay === index }]"
                    @click="activeDay = index">
              {{ day }}
            </button>
          </div>
        </div>
        
        <div class="schedule-content">
          <div class="day-active-title">{{ days[activeDay] }}</div>
          <div class="slots-list">
            <div v-for="hour in hours" :key="hour" class="mobile-slot-card">
              <div class="slot-time-info">
                <span class="time-badge">{{ hour }} hrs</span>
                <div class="slot-status-info">
                  <span class="status">Disponible</span>
                  <span class="sub-text">Libre para agendar</span>
                </div>
              </div>
              <button class="action-btn" @click="selectSlot(days[activeDay], hour)">Reservar</button>
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
              <th v-for="day in days" :key="day">{{ day }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hour in hours" :key="hour">
              <td class="hour-cell">{{ hour }}</td>
              <td v-for="day in days" :key="day">
                <div class="slot-desktop" @click="selectSlot(day, hour)">Disponible</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
const activeDay = ref(0);

const emit = defineEmits(['close', 'select-slot']);

// Estado de la notificación Toast con mensaje más corto
const toast = reactive({
  show: false,
  message: '',
  type: 'success'
});

const mostrarToast = (mensaje, tipo = 'success') => {
  toast.message = mensaje;
  toast.type = tipo;
  toast.show = true;
  setTimeout(() => {
    toast.show = false;
  }, 2200);
};

const selectSlot = (day, hour) => {
  emit('select-slot', { day, hour });
  // Mensaje conciso para que quepa perfectamente en pantallas móviles
  mostrarToast(`¡Reservado (${day} ${hour})!`, 'success');
};
</script>

<style scoped>
.schedule-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* --- Estilos del Toast (Flotando en la parte inferior del panel) --- */
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
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  pointer-events: none;
  max-width: 90%;
}

.toast-notification.success {
  background: #10b981;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.toast-notification.error {
  background: #ef4444;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

.toast-notification svg {
  width: 16px;
  height: 16px;
  stroke: #fff;
  flex-shrink: 0;
}

/* Animaciones del Toast (Entrada desde abajo) */
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
  background: #0d0d0f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 20px;
  width: 92%;
  max-width: 1000px;
  color: white;
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
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.tab.active {
  background: #1c4fd6;
  color: white;
  border-color: #1c4fd6;
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
  color: #e2e8f0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  margin-bottom: 2px;
  border-left: 3px solid #1c4fd6;
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
  background: #141418;
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 12px 16px;
  border-radius: 14px;
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
  color: #fff;
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
  color: #64748b;
  font-size: 0.72rem;
}

.action-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 10px;
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
  .schedule-panel { padding: 32px; }
  .mobile-only { display: none; }
  .desktop-only { display: block; }

  .desktop-table { 
    width: 100%; 
    border-collapse: separate; 
    border-spacing: 10px; 
  }
  
  th { 
    color: #94a3b8; 
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
    color: #fff; 
    text-align: right; 
    padding-right: 15px; 
    font-size: 0.95rem;
  }
  
  .slot-desktop { 
    background: #141418; 
    padding: 16px; 
    border-radius: 12px; 
    text-align: center; 
    color: #10b981; 
    font-size: 0.85rem; 
    font-weight: 600;
    border: 1px solid rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .slot-desktop:hover {
    background: #1a1a22;
    border-color: rgba(16, 185, 129, 0.4);
    transform: translateY(-2px);
  }
}

.panel-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 20px; 
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
}

.subtitle-mobile {
  font-size: 0.78rem;
  color: #64748b;
}

.close-btn {
  background: #16161a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover { 
  background: #ef4444; 
  border-color: #ef4444;
}
</style>
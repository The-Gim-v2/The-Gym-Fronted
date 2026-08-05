<template>
  <div class="form-wrapper">
    <div class="form-panel glass-effect">
      <div class="panel-header">
        <h2 class="form-title">Nueva <span class="highlight">Actividad</span></h2>
        <button class="close-x" @click="$emit('close')" title="Cerrar">&times;</button>
      </div>
      
      <form @submit.prevent="guardarActividad" class="form-body">
        <!-- Día de la Semana -->
        <div class="input-group">
          <label>Día de la Semana</label>
          <div class="select-wrapper">
            <select v-model="form.dia" class="custom-select" required>
              <option disabled value="">Seleccionar día...</option>
              <option v-for="day in days" :key="day" :value="day">{{ day }}</option>
            </select>
          </div>
        </div>
        
        <!-- Nombre de la Actividad -->
        <div class="input-group">
          <label>Nombre de Actividad</label>
          <input type="text" v-model="form.nombre" placeholder="Ej. Crossfit" class="custom-input" required>
        </div>

        <!-- Horarios en lista vertical hacia abajo -->
        <div class="schedule-vertical-stack">
          <div class="input-group">
            <label>Hora de Inicio</label>
            <input type="time" v-model="form.inicio" class="custom-input time-input" required>
          </div>
          <div class="input-group">
            <label>Hora de Fin</label>
            <input type="time" v-model="form.fin" class="custom-input time-input" required>
          </div>
        </div>

        <!-- Ubicación / Aula -->
        <div class="input-group">
          <label>Ubicación / Aula</label>
          <input type="text" v-model="form.ubicacion" placeholder="Ej. Gimnasio Principal o Sala B" class="custom-input">
        </div>

        <!-- Categoría / Color -->
        <div class="input-group">
          <label>Categoría / Color</label>
          <div class="color-picker-container">
            <button type="button" 
                    v-for="color in colorOptions" 
                    :key="color.value"
                    :style="{ background: color.value }"
                    :class="['color-dot', { active: form.color === color.value }]"
                    @click="form.color = color.value"
                    :title="color.label">
            </button>
          </div>
        </div>

        <!-- Descripción / Notas -->
        <div class="input-group">
          <label>Descripción / Notas</label>
          <textarea v-model="form.descripcion" placeholder="Detalles adicionales de la actividad..." class="custom-textarea" rows="2"></textarea>
        </div>

        <!-- Botones de Acción -->
        <div class="panel-footer-btns">
          <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
          <button type="submit" class="btn-save">Guardar Actividad</button>
        </div>
      </form>
    </div>

    <!-- Notificación Toast flotante -->
    <transition name="toast-slide">
      <div v-if="toast.show" :class="['toast-notification', toast.type]">
        <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 6L9 17l-5-5"/></svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span>{{ toast.message }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue';

const props = defineProps({
  initialData: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'save']);

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const colorOptions = [
  { label: 'Azul', value: '#3b82f6' },
  { label: 'Verde', value: '#10b981' },
  { label: 'Morado', value: '#8b5cf6' },
  { label: 'Naranja', value: '#f59e0b' },
  { label: 'Rosa', value: '#ec4899' }
];

const form = reactive({
  dia: '',
  nombre: '',
  inicio: '08:00',
  fin: '09:00',
  ubicacion: '',
  color: '#3b82f6',
  descripcion: ''
});

// Estado de la notificación Toast
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
  }, 2500);
};

watch(() => props.initialData, (newData) => {
  if (newData) {
    if (newData.day) form.dia = newData.day;
    if (newData.hour) form.inicio = newData.hour;
    if (newData.fin) form.fin = newData.fin;
  }
}, { immediate: true });

const guardarActividad = () => {
  console.log("Actividad guardada:", form);
  
  emit('save', { ...form });
  mostrarToast('¡Actividad guardada correctamente!', 'success');

  setTimeout(() => {
    emit('close');
  }, 900);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Oswald:wght@400;600;700&display=swap');

.form-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

/* --- Estilos del Toast --- */
.toast-notification {
  position: absolute;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 22px;
  border-radius: var(--app-border-radius, 14px);
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  pointer-events: none;
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
  width: 18px;
  height: 18px;
  stroke: #fff;
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

/* --- Panel de Formulario --- */
.form-panel {
  background: var(--bg-cards, rgba(18, 18, 18, 0.92));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  color: var(--color-texto-general, #f5f5f4);
  border-radius: var(--app-border-radius, 24px);
  padding: 24px;
  width: 94%;
  max-width: 440px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.8);
  font-family: 'Inter', sans-serif;
  box-sizing: border-box;
  margin: 0 auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.form-panel::-webkit-scrollbar {
  width: 6px;
}
.form-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 10px;
}

.panel-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 16px; 
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  padding-bottom: 12px;
}

.form-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 1.4rem; 
  margin: 0; 
  color: var(--color-titulos, #fff);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.highlight { color: var(--color-highlight, #3b82f6); }

.close-x { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.1); 
  color: var(--color-texto-general, #f5f5f4); 
  font-size: 1.3rem; 
  width: 36px; 
  height: 36px; 
  border-radius: var(--app-border-radius, 12px); 
  cursor: pointer; 
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}
.close-x:hover { 
  background: rgba(239, 68, 68, 0.15); 
  border-color: rgba(239, 68, 68, 0.3);
  color: #ef4444; 
}

.form-body { 
  display: flex; 
  flex-direction: column; 
  gap: 14px; 
}

.input-group { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}

.input-group label { 
  font-family: 'Oswald', sans-serif; 
  font-size: 0.8rem; 
  color: var(--color-etiquetas, #a1a1aa);
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.schedule-vertical-stack {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.custom-select, .custom-input, .custom-textarea { 
  background: var(--bg-input, #141414); 
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.12)); 
  color: var(--color-texto-input, #fff); 
  padding: 10px 14px; 
  border-radius: var(--app-border-radius, 12px); 
  width: 100%; 
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
}

.custom-select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 16px;
  padding-right: 40px;
  cursor: pointer;
}

.custom-textarea {
  resize: none;
  height: 56px;
}

.custom-select:focus, .custom-input:focus, .custom-textarea:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  background: var(--bg-input-focus, var(--bg-input, #141414));
}

.time-input {
  cursor: pointer;
}

.color-picker-container {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 2px 0;
}

.color-dot {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;
}

.color-dot:hover {
  transform: scale(1.1);
}

.color-dot.active {
  border-color: #ffffff;
  transform: scale(1.15);
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.4);
}

.panel-footer-btns { 
  display: flex; 
  justify-content: flex-end; 
  align-items: center;
  gap: 10px; 
  margin-top: 12px; 
  border-top: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  padding-top: 14px;
}

.btn-cancel { 
  background: transparent; 
  border: none; 
  color: var(--color-texto-general, #94a3b8); 
  cursor: pointer; 
  font-family: 'Oswald', sans-serif;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  padding: 10px 14px;
  border-radius: var(--app-border-radius, 10px);
  transition: color 0.2s, background 0.2s;
}
.btn-cancel:hover { 
  color: #f5f5f4; 
  background: rgba(255, 255, 255, 0.05);
}

.btn-save { 
  background: var(--color-botones, #1c4fd6); 
  color: var(--color-texto-botones, white); 
  padding: 10px 22px; 
  border: none; 
  border-radius: var(--app-border-radius, 12px); 
  cursor: pointer; 
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 14px rgba(28, 79, 214, 0.35);
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@media (hover: hover) {
  .btn-save:hover { 
    background: var(--color-botones, #1742be); 
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(28, 79, 214, 0.5);
    filter: brightness(0.95);
  }
}

.btn-save:active { 
  transform: scale(0.96); 
}
</style>
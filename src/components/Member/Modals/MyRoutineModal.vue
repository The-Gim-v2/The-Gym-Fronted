<template>
  <div class="modal-box glass-card-modal">
    <div class="modal-header">
      <div class="header-icon-title">
        <svg class="svg-modal" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 21.29 21.29 19.86 19.86 18.43 22 16.29z"/></svg>
        <div>
          <h3>Mis Rutinas Asignadas</h3>
          <span class="sub-title">Hipertrofia y Fuerza - Fase 2</span>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')">&times;</button>
    </div>

    <div class="days-tabs-bar">
      <button 
        v-for="day in routineDays" 
        :key="day.id"
        :class="['tab-btn', { active: selectedDay === day.id }]"
        @click="selectedDay = day.id"
      >
        {{ day.name }}
      </button>
    </div>

    <div class="modal-body custom-scroll">
      <div class="routine-meta-banner">
        <div class="meta-info">
          <span class="label">Entrenador Asignado:</span>
          <strong>Prof. Carlos Gómez</strong>
        </div>
        <div class="meta-badge">
          {{ currentExercises.length }} Ejercicios hoy
        </div>
      </div>

      <div class="exercises-container">
        <div 
          v-for="(exercise, index) in currentExercises" 
          :key="index"
          class="exercise-card-row"
          :class="{ 'completed': exercise.done }"
        >
          <div class="exercise-main-info">
            <div class="ex-number">#{{ index + 1 }}</div>
            <div class="ex-details">
              <span class="ex-title">{{ exercise.name }}</span>
              <div class="ex-tags">
                <span class="tag-muscle">{{ exercise.muscle }}</span>
                <span class="tag-specs">{{ exercise.sets }} Series &bull; {{ exercise.reps }} Reps</span>
              </div>
            </div>
          </div>

          <div class="exercise-actions">
            <span class="weight-tag" v-if="exercise.weight">Sugerido: {{ exercise.weight }}</span>
            <button 
              class="btn-check" 
              :class="{ 'checked': exercise.done }"
              @click="exercise.done = !exercise.done"
              title="Marcar como realizado"
            >
              <svg viewBox="0 0 24 24" class="svg-check"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-footer">
      <div class="progress-indicator">
        Progreso del día: <strong>{{ completedCount }} / {{ currentExercises.length }}</strong>
      </div>
      <button class="btn-primary" @click="$emit('close')">Guardar y Cerrar</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

defineEmits(['close']);

const selectedDay = ref('lunes');

const routineDays = [
  { id: 'lunes', name: 'Lunes: Pecho y Tríceps' },
  { id: 'miercoles', name: 'Miércoles: Espalda y Bíceps' },
  { id: 'viernes', name: 'Viernes: Pierna Completa' }
];

// Base de datos de ejercicios por día (reactiva para marcar completados)
const routinesData = ref({
  lunes: [
    { name: 'Press de Banca Plano con Barra', muscle: 'Pectorales', sets: 4, reps: '10-12', weight: '70 kg', done: false },
    { name: 'Aperturas inclinadas con mancuernas', muscle: 'Pectoral Superior', sets: 3, reps: '12', weight: '18 kg', done: false },
    { name: 'Press Francés con barra EZ', muscle: 'Tríceps', sets: 4, reps: '10', weight: '30 kg', done: false },
    { name: 'Extensiones de tríceps en polea', muscle: 'Tríceps', sets: 3, reps: '15', weight: '25 kg', done: false }
  ],
  miercoles: [
    { name: 'Dominadas asistidas o libres', muscle: 'Espalda (Dorsales)', sets: 4, reps: '8-10', weight: 'Corporal', done: false },
    { name: 'Remo con barra inclinado', muscle: 'Espalda Media', sets: 4, reps: '10', weight: '60 kg', done: false },
    { name: 'Curl de bíceps con barra', muscle: 'Bíceps', sets: 3, reps: '12', weight: '25 kg', done: false },
    { name: 'Curl martillo con mancuernas', muscle: 'Bíceps / Antebrazo', sets: 3, reps: '12', weight: '14 kg', done: false }
  ],
  viernes: [
    { name: 'Sentadilla libre con barra', muscle: 'Cuádriceps / Glúteos', sets: 4, reps: '8', weight: '90 kg', done: false },
    { name: 'Prensa de pierna 45°', muscle: 'Cuádriceps', sets: 3, reps: '12', weight: '140 kg', done: false },
    { name: 'Peso muerto rumano', muscle: 'Isquiotibiales', sets: 4, reps: '10', weight: '70 kg', done: false },
    { name: 'Elevación de pantorrillas de pie', muscle: 'Pantorrillas', sets: 4, reps: '20', weight: '50 kg', done: false }
  ]
});

const currentExercises = computed(() => {
  return routinesData.value[selectedDay.value];
});

const completedCount = computed(() => {
  return currentExercises.value.filter(ex => ex.done).length;
});
</script>

<style scoped>
.modal-box {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--app-border-radius, 20px);
  width: 100%;
  max-width: 620px;
  max-height: 90vh;
  padding: 24px;
  color: var(--color-texto-general, #f5f5f4);
  box-shadow: 0 25px 50px rgba(0,0,0,0.8);
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-icon-title {
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon-title h3 {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.35rem;
  color: var(--color-titulos, #fff);
  letter-spacing: 0.5px;
}

.sub-title {
  font-size: 0.8rem;
  color: var(--color-highlight, #3b82f6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.svg-modal {
  width: 28px;
  height: 28px;
  fill: var(--color-highlight, #3b82f6);
  flex-shrink: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  opacity: 0.7;
  padding: 0 4px;
}
.close-btn:hover { opacity: 1; }

/* Pestañas de días */
.days-tabs-bar {
  display: flex;
  gap: 8px;
  background: rgba(255, 255, 255, 0.02);
  padding: 4px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.tab-btn {
  flex: 1;
  background: transparent;
  border: none;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.6));
  padding: 8px 12px;
  font-size: 0.8rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
}

.tab-btn:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

.tab-btn.active {
  background: var(--color-highlight, #3b82f6);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* Cuerpo del modal */
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
  max-height: 400px;
  padding-right: 4px;
}

.custom-scroll::-webkit-scrollbar {
  width: 6px;
}
.custom-scroll::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
  border-radius: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover {
  background: var(--color-highlight, #3b82f6);
}

.routine-meta-banner {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 10px 16px;
  border-radius: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
}

.meta-info .label {
  opacity: 0.6;
  margin-right: 6px;
}

.meta-badge {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-highlight, #3b82f6);
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
}

.exercises-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.exercise-card-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 14px 16px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.exercise-card-row:hover {
  border-color: rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.04);
}

.exercise-card-row.completed {
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.2);
  opacity: 0.75;
}

.exercise-main-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.ex-number {
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  color: var(--color-highlight, #3b82f6);
  opacity: 0.8;
  width: 24px;
}

.ex-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.ex-title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-titulos, #fff);
}

.ex-tags {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.tag-muscle {
  font-size: 0.7rem;
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 8px;
  border-radius: 4px;
  opacity: 0.8;
}

.tag-specs {
  font-size: 0.75rem;
  color: var(--color-highlight, #3b82f6);
  font-weight: 600;
}

.exercise-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}

.weight-tag {
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px 8px;
  border-radius: 6px;
  opacity: 0.7;
}

.btn-check {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.svg-check {
  width: 16px;
  height: 16px;
  fill: transparent;
  transition: fill 0.2s ease;
}

.btn-check.checked {
  background: #10b981;
  border-color: #10b981;
}

.btn-check.checked .svg-check {
  fill: #ffffff;
}

/* Footer */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 14px;
}

.progress-indicator {
  font-size: 0.8rem;
  opacity: 0.7;
}

.progress-indicator strong {
  color: #10b981;
}

.btn-primary {
  background: var(--color-highlight, #3b82f6);
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: filter 0.2s ease;
}

.btn-primary:hover { 
  filter: brightness(1.1); 
}
</style>
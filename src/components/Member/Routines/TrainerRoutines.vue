<template>
  <HeadingMember>
    <div class="weekly-wrapper">
      <main class="weekly-main">

        <!-- HEADER DE LA SECCIÓN (#tutorial-1) -->
        <section id="tutorial-1" class="glass-card header-card">
          <div class="header-top-row">
            <span class="gym-badge-tag">{{ t.trainerPlanTag }}</span>
          </div>

          <div class="header-titles">
            <h1 class="main-heading">
              {{ t.trainerMainTitle1 }} <span class="highlight-color">{{ t.trainerMainTitle2 }}</span>
            </h1>
            <p class="hero-desc">
              {{ selectedTrainer ? t.trainerSelectedDesc : t.trainerHeroDesc }}
            </p>
          </div>

          <!-- Botón de retorno limpio -->
          <div v-if="selectedTrainer" class="header-actions-row">
            <button class="btn-secondary-action" @click="selectedTrainer = null">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
              {{ t.backToTrainersBtn }}
            </button>
          </div>
        </section>

        <!-- ================= VISTA 1: LISTADO DE ENTRENADORES ================= -->
        <div v-if="!selectedTrainer" class="trainers-selection-container">
          
          <!-- SECCIÓN: MI ENTRENADOR ASIGNADO (#tutorial-2) -->
          <div id="tutorial-2" v-if="assignedTrainer" class="trainer-section-group">
            <h3 class="panel-heading">{{ t.myAssignedTrainerTitle }}</h3>
            <div class="trainers-grid-balanced">
              <div class="glass-card trainer-card-item" @click="selectTrainer(assignedTrainer)">
                <div class="trainer-card-header">
                  <div class="trainer-avatar-wrapper">
                    <img :src="assignedTrainer.avatar" :alt="assignedTrainer.name" class="trainer-avatar" />
                    <span class="status-dot online"></span>
                  </div>
                  <div class="trainer-badge-wrapper">
                    <span class="gym-badge-tag primary-badge">{{ t.assignedBadge }}</span>
                  </div>
                </div>
                <div class="trainer-card-body">
                  <h3 class="trainer-name">{{ assignedTrainer.name }}</h3>
                  <p class="trainer-specialty">{{ assignedTrainer.specialty }}</p>
                  <p class="trainer-bio">{{ assignedTrainer.bio }}</p>
                  
                  <div class="trainer-meta-details">
                    <div class="meta-row" v-if="assignedTrainer.phone">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      <span>{{ assignedTrainer.phone }}</span>
                    </div>
                    <div class="meta-row" v-if="assignedTrainer.email">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                      <span>{{ assignedTrainer.email }}</span>
                    </div>
                  </div>
                </div>
                <div class="trainer-card-footer">
                  <span class="btn-explore">{{ t.viewRoutinesBtn }} &rarr;</span>
                </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN: OTROS ENTRENADORES (#tutorial-3) -->
          <div id="tutorial-3" class="trainer-section-group" style="margin-top: 1.5rem;" v-if="otherTrainers.length">
            <h3 class="panel-heading">{{ t.otherTrainersTitle }}</h3>
            <div class="trainers-grid-balanced">
              <div 
                v-for="trainer in otherTrainers" 
                :key="trainer.id"
                class="glass-card trainer-card-item"
                :class="{ 'locked-trainer-card': !hasActiveMembership }"
                @click="handleTrainerClick(trainer)"
              >
                <!-- Capa de bloqueo por membresía -->
                <div v-if="!hasActiveMembership" class="trainer-lock-overlay">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  <span class="lock-text">{{ t.membershipRequiredMsg }}</span>
                </div>

                <div class="trainer-card-header">
                  <div class="trainer-avatar-wrapper">
                    <img :src="trainer.avatar" :alt="trainer.name" class="trainer-avatar" />
                    <span class="status-dot"></span>
                  </div>
                </div>
                <div class="trainer-card-body">
                  <h3 class="trainer-name">{{ trainer.name }}</h3>
                  <p class="trainer-specialty">{{ trainer.specialty }}</p>
                  <p class="trainer-bio">{{ trainer.bio }}</p>

                  <div class="trainer-meta-details">
                    <div class="meta-row" v-if="trainer.phone">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                      <span>{{ trainer.phone }}</span>
                    </div>
                  </div>
                </div>
                <div class="trainer-card-footer">
                  <span class="btn-explore">{{ hasActiveMembership ? t.viewRoutinesBtn : t.lockedBtnText }} &rarr;</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ================= VISTA 2: PLANIFICADOR SEMANAL ================= -->
        <div v-else class="planner-layout">

          <!-- PANEL LATERAL: DATOS DEL ENTRENADOR Y BIBLIOTECA (#tutorial-4) -->
          <aside id="tutorial-4" class="glass-card library-panel">
            
            <div class="trainer-profile-expanded">
              <div class="trainer-profile-top">
                <img :src="selectedTrainer.avatar" :alt="selectedTrainer.name" class="trainer-avatar-lg" />
                <div class="trainer-identity">
                  <h3 class="panel-heading" style="margin:0;">{{ selectedTrainer.name }}</h3>
                  <p class="trainer-specialty-lg">{{ selectedTrainer.specialty }}</p>
                </div>
              </div>
              <p class="trainer-bio-expanded" v-if="selectedTrainer.bio">{{ selectedTrainer.bio }}</p>
              
              <div class="trainer-contact-vertical" v-if="selectedTrainer.phone || selectedTrainer.email">
                <div class="meta-row" v-if="selectedTrainer.phone">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>{{ selectedTrainer.phone }}</span>
                </div>
                <div class="meta-row" v-if="selectedTrainer.email">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>{{ selectedTrainer.email }}</span>
                </div>
              </div>
            </div>

            <input
              type="text"
              class="styled-input"
              v-model="trainerFilterText"
              :placeholder="t.searchPlaceholder"
            />

            <div class="library-list custom-scrollbar">
              <div
                v-for="routine in filteredTrainerRoutines"
                :key="routine.id"
                class="mini-routine-card"
                draggable="true"
                @dragstart="onDragStart($event, routine)"
                @click="viewRoutineDetails(routine)"
              >
                <img
                  class="mini-thumb"
                  :src="getRoutineMediaSrc(routine)"
                  :alt="routine.name"
                  loading="lazy"
                  @error="(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'; }"
                />
                <div class="mini-info">
                  <span class="mini-name" :title="routine.name">{{ routine.name }}</span>
                  <div class="mini-badges-row">
                    <span class="mini-level-badge">{{ translateLevel(routine.level) }}</span>
                    <span class="mini-cat-badge">{{ routine.target }}</span>
                  </div>
                </div>

                <div class="mini-card-actions" @click.stop>
                  <button class="add-to-day-btn" @click="toggleAddMenu(routine.id, $event)">
                    <span>{{ t.addToDayBtn }}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                  </button>
                  <div class="add-day-dropdown" v-if="openAddMenuId === routine.id">
                    <button v-for="day in dayKeys" :key="day" @click="addRoutineToDay(day, routine)">
                      {{ t.daysShort[day] || day }}
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="!filteredTrainerRoutines.length" class="empty-hint">
                <p>{{ t.noTrainerRoutines }}</p>
              </div>
            </div>
          </aside>

          <!-- PANEL DE DÍA ENFOCADO -->
          <section class="week-focus-panel">

            <!-- SELECTOR DE DÍAS (#tutorial-5) -->
            <div id="tutorial-5" class="day-selector-bar glass-card">
              <div class="day-chips-strip clean-tabs">
                <button
                  v-for="day in dayKeys"
                  :key="day"
                  class="day-strip-chip"
                  :class="{ active: selectedDay === day, 'is-rest': weeklyPlan[day].isRest, 'has-routines': !weeklyPlan[day].isRest && weeklyPlan[day].routines.length }"
                  @click="selectedDay = day"
                >
                  <span class="strip-day-label">{{ t.daysShort[day] || day }}</span>
                  <span class="strip-dot"></span>
                </button>
              </div>
            </div>

            <div
              class="day-detail-card glass-card"
              :class="{ 'is-drop-target': draggingItem }"
              @dragover.prevent
              @drop="onDropToDay($event, selectedDay)"
            >
              <!-- DETALLE DEL DÍA HEADER (#tutorial-6) -->
              <div id="tutorial-6" class="day-detail-header">
                <div class="day-detail-title-group">
                  <h2 class="day-detail-title">{{ t.days[selectedDay] || selectedDay }}</h2>
                </div>
                <div class="day-detail-actions">
                  <label class="rest-toggle">
                    <input type="checkbox" v-model="weeklyPlan[selectedDay].isRest" @change="onToggleRest(selectedDay)" />
                    <span>{{ t.restDayLabel }}</span>
                  </label>
                </div>
              </div>

              <!-- ESTADO DE DESCANSO (#tutorial-8) -->
              <div id="tutorial-8" v-if="weeklyPlan[selectedDay].isRest" class="rest-day-box big">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <h3>{{ t.restDayBoxTitle }}</h3>
                <p>{{ t.restDayBoxText }}</p>
              </div>

              <div v-else-if="!weeklyPlan[selectedDay].routines.length" class="day-empty-drop big">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                <p>{{ t.dropHint }}</p>
              </div>

              <!-- GRILLA DE RUTINAS DEL DÍA (#tutorial-7) -->
              <div id="tutorial-7" v-else class="routines-grid">
                <div
                  v-for="(routine) in weeklyPlan[selectedDay].routines"
                  :key="routine.instanceId || routine.id"
                  class="routine-card"
                  :class="{ 'completed-routine': routine.completed }"
                >
                  <div class="card-media">
                    <img :src="getRoutineMediaSrc(routine)" :alt="routine.name" loading="lazy" @error="(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'; }">
                    <div class="media-overlay"></div>
                    <div class="badge-container">
                      <span class="badge-level">{{ translateLevel(routine.level) }}</span>
                      <span class="badge-goal">{{ routine.target }}</span>
                    </div>
                    <div class="status-badge-overlay" v-if="routine.completed">
                      <span>✓ {{ t.completedLabel }}</span>
                    </div>
                  </div>

                  <div class="card-body">
                    <h3 class="card-title-routine">{{ routine.name }}</h3>
                    <p class="routine-desc">{{ getRoutineDescription(routine) }}</p>
                    
                    <div class="card-footer-actions">
                      <button class="btn-explore" @click="viewRoutineDetails(routine)">
                        {{ t.viewDetails }} &rarr;
                      </button>
                      
                      <label class="complete-checkbox-label" @click.stop>
                        <input type="checkbox" v-model="routine.completed" />
                        <span>{{ routine.completed ? t.doneLabel : t.completeLabel }}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>

      </main>
    </div>
  </HeadingMember>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { useLang } from '../useLang.js';
import HeadingMember from '../HeadingMember.vue';

const { lang } = useLang();

const traducciones = {
  es: {
    trainerPlanTag: "Entrenadores",
    trainerMainTitle1: "Rutinas de",
    trainerMainTitle2: "Entrenadores",
    trainerHeroDesc: "Selecciona a tu entrenador asignado o explora otros profesionales para ver sus programas.",
    trainerSelectedDesc: "Visualiza el programa y la distribución semanal asignada por este profesional.",
    backToTrainersBtn: "Volver a Entrenadores",
    myAssignedTrainerTitle: "Tu Entrenador Asignado",
    assignedBadge: "Principal",
    otherTrainersTitle: "Otros Entrenadores",
    viewRoutinesBtn: "Ver Rutinas",
    lockedBtnText: "Bloqueado",
    membershipRequiredMsg: "Bloqueado: Requiere mensualidad activa",
    searchPlaceholder: "Buscar rutina...",
    restDayLabel: "Día de descanso",
    restDayBoxTitle: "Día de descanso",
    restDayBoxText: "No hay ejercicios programados para hoy.",
    dropHint: "Arrastra una rutina aquí o usa \"Añadir\"",
    viewDetails: "Ver Detalles",
    addToDayBtn: "Añadir",
    noTrainerRoutines: "Este entrenador no tiene rutinas disponibles.",
    completedLabel: "Completado",
    doneLabel: "Hecho",
    completeLabel: "Completar",
    days: { monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles', thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo' },
    daysShort: { monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié', thursday: 'Jue', friday: 'Vie', saturday: 'Sáb', sunday: 'Dom' }
  },
  en: {
    trainerPlanTag: "Trainers",
    trainerMainTitle1: "Trainer",
    trainerMainTitle2: "Routines",
    trainerHeroDesc: "Select your assigned trainer or explore other professionals to view their programs.",
    trainerSelectedDesc: "View the program and weekly schedule assigned by this professional.",
    backToTrainersBtn: "Back to Trainers",
    myAssignedTrainerTitle: "Your Assigned Trainer",
    assignedBadge: "Main",
    otherTrainersTitle: "Other Trainers",
    viewRoutinesBtn: "View Routines",
    lockedBtnText: "Locked",
    membershipRequiredMsg: "Locked: Requires active membership",
    searchPlaceholder: "Search routine...",
    restDayLabel: "Rest day",
    restDayBoxTitle: "Rest day",
    restDayBoxText: "No exercises scheduled for today.",
    dropHint: "Drag a routine here or use \"Add\"",
    viewDetails: "View Details",
    addToDayBtn: "Add",
    noTrainerRoutines: "This trainer has no routines available.",
    completedLabel: "Completed",
    doneLabel: "Done",
    completeLabel: "Complete",
    days: { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday' },
    daysShort: { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' }
  }
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

const props = defineProps({
  assignedTrainer: { 
    type: Object, 
    default: () => ({
      id: 1,
      name: "Carlos Mendoza",
      specialty: "Hipertrofia y Fuerza",
      bio: "Especialista en acondicionamiento físico avanzado y optimización biomecánica.",
      phone: "+52 55 1234 5678",
      email: "carlos.mendoza@gym.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      routines: [
        { id: 101, name: "Rutina Base Hipertrofia A", level: "Intermedio", target: "Pecho y Tríceps", description: "Enfoque en tensión mecánica.", mediaUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", completed: false }
      ]
    }) 
  },
  trainersList: { 
    type: Array, 
    default: () => [
      {
        id: 1,
        name: "Carlos Mendoza",
        specialty: "Hipertrofia y Fuerza",
        bio: "Especialista en acondicionamiento físico avanzado.",
        phone: "+52 55 1234 5678",
        email: "carlos.mendoza@gym.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
        routines: [{ id: 101, name: "Rutina Base Hipertrofia A", level: "Intermedio", target: "Pecho y Tríceps", description: "Enfoque en tensión mecánica.", mediaUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800", completed: false }]
      },
      {
        id: 2,
        name: "Ana Sofía Valdés",
        specialty: "Pérdida de Grasa y Funcional",
        bio: "Entrenadora certificada en circuitos de alta intensidad.",
        phone: "+52 55 8765 4321",
        email: "ana.valdes@gym.com",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200",
        routines: [{ id: 201, name: "Fullbody Quema Total", level: "Principiante", target: "Cuerpo Completo", description: "Circuito dinámico metabólico.", mediaUrl: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800", completed: false }]
      }
    ] 
  },
  hasActiveMembership: {
    type: Boolean,
    default: false
  },
  getRoutineMediaSrc: { type: Function, default: (r) => r.mediaUrl },
  getRoutineDescription: { type: Function, default: (r) => r.description },
  translateLevel: { type: Function, default: (l) => l },
  viewRoutineDetails: { type: Function, default: (r) => console.log(r) }
})

const selectedTrainer = ref(null)
const trainerFilterText = ref('')
const openAddMenuId = ref(null)
const selectedDay = ref('monday')
const draggingItem = ref(null)

const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const weeklyPlan = reactive({
  monday: { isRest: false, routines: [] },
  tuesday: { isRest: false, routines: [] },
  wednesday: { isRest: false, routines: [] },
  thursday: { isRest: false, routines: [] },
  friday: { isRest: false, routines: [] },
  saturday: { isRest: true, routines: [] },
  sunday: { isRest: true, routines: [] }
})

const otherTrainers = computed(() => {
  if (!props.assignedTrainer) return props.trainersList
  return props.trainersList.filter(t => t.id !== props.assignedTrainer.id)
})

const filteredTrainerRoutines = computed(() => {
  if (!selectedTrainer.value || !selectedTrainer.value.routines) return []
  return selectedTrainer.value.routines.filter(r => 
    r.name.toLowerCase().includes(trainerFilterText.value.toLowerCase())
  )
})

const selectTrainer = (trainer) => {
  selectedTrainer.value = trainer
}

const handleTrainerClick = (trainer) => {
  if (!props.hasActiveMembership) {
    return
  }
  selectTrainer(trainer)
}

const toggleAddMenu = (id, event) => {
  event.stopPropagation()
  openAddMenuId.value = openAddMenuId.value === id ? null : id
}

const addRoutineToDay = (day, routine) => {
  weeklyPlan[day].routines.push({ ...routine, instanceId: Date.now() + Math.random(), completed: false })
  openAddMenuId.value = null
}

const onToggleRest = (day) => {
  if (weeklyPlan[day].isRest) {
    weeklyPlan[day].routines = []
  }
}

const onDragStart = (event, routine) => {
  draggingItem.value = routine
  event.dataTransfer.setData('text/plain', JSON.stringify(routine))
}

const onDropToDay = (event, day) => {
  event.preventDefault()
  if (draggingItem.value && !weeklyPlan[day].isRest) {
    addRoutineToDay(day, draggingItem.value)
  }
  draggingItem.value = null
}
</script>

<style scoped>
.weekly-wrapper { 
  display: flex; 
  min-height: 100vh; 
  color: var(--color-texto-general, #f5f5f4); 
  background-color: var(--bg-custom, #0a0a0a); 
  padding: 1.5rem; 
  box-sizing: border-box;
}
.weekly-main { 
  flex: 1; 
  max-width: 1400px; 
  margin: 0 auto; 
  display: flex; 
  flex-direction: column; 
  gap: 1.5rem; 
  width: 100%;
}

.glass-card {
  background: var(--bg-cards, #121212);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 20px);
  padding: 1.5rem;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  box-sizing: border-box;
}

.header-card { display: flex; flex-direction: column; gap: 1rem; }
.header-top-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }

.gym-badge-tag {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-highlight, #60a5fa);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: 2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.primary-badge { background: rgba(34, 197, 94, 0.15); color: #22c55e; border-color: rgba(34, 197, 94, 0.3); }

.header-titles { display: flex; flex-direction: column; gap: 0.35rem; }
.main-heading { font-size: 1.75rem; font-weight: 800; color: var(--color-titulos, #ffffff); margin: 0; word-break: break-word; }
.highlight-color { color: var(--color-highlight, #3b82f6); }
.hero-desc { font-size: 0.9rem; color: rgba(245, 245, 244, 0.6); opacity: 0.8; margin: 0; }

.header-actions-row { display: flex; gap: 0.75rem; margin-top: 0.5rem; flex-wrap: wrap; }

.btn-secondary-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-texto-general, #f5f5f4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 0.5rem 1rem;
  border-radius: 0.6rem;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary-action:hover { background: rgba(59, 130, 246, 0.12); border-color: rgba(59, 130, 246, 0.4); }

.panel-heading { font-size: 1rem; font-weight: 700; color: var(--color-titulos, #ffffff); margin-bottom: 0.75rem; }

/* Entrenadores */
.trainers-selection-container { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 0.5rem; }
.trainers-grid-balanced { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }

.trainer-card-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
  padding: 1.25rem;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 16px);
}
.trainer-card-item:hover { transform: translateY(-3px); border-color: var(--color-highlight, #3b82f6); }

.locked-trainer-card { opacity: 1; cursor: not-allowed; } /* Asegura que el contenedor mantenga visibilidad base */
.locked-trainer-card:hover { transform: none; border-color: rgba(255, 255, 255, 0.08); }

.trainer-lock-overlay {
  position: absolute;
  inset: 0;
  /* Fondo semitransparente para permitir ver la información debajo con efecto translúcido */
  background: rgba(10, 10, 10, 0.75);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  z-index: 5;
  color: #f87171;
  text-align: center;
  padding: 1rem;
}
.lock-text { font-size: 0.78rem; font-weight: 700; color: #fca5a5; }

.trainer-card-header { display: flex; justify-content: space-between; align-items: flex-start; }
.trainer-avatar-wrapper { position: relative; }
.trainer-avatar { width: 64px; height: 64px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.12); }
.status-dot { position: absolute; bottom: 2px; right: 2px; width: 10px; height: 10px; background: rgba(255, 255, 255, 0.3); border-radius: 50%; border: 2px solid var(--bg-custom, #0a0a0a); }
.status-dot.online { background: #22c55e; }

.trainer-card-body { display: flex; flex-direction: column; gap: 0.4rem; flex: 1; }
.trainer-name { font-size: 1.1rem; color: var(--color-titulos, #ffffff); margin: 0; font-weight: 700; }
.trainer-specialty { font-size: 0.82rem; color: var(--color-highlight, #3b82f6); margin: 0; font-weight: 600; }
.trainer-bio { font-size: 0.78rem; color: rgba(245, 245, 244, 0.6); opacity: 0.8; margin: 0; line-height: 1.4; }

.trainer-meta-details { display: flex; flex-direction: column; gap: 0.3rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.06); }
.meta-row { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: rgba(245, 245, 244, 0.7); }

.trainer-card-footer { display: flex; justify-content: flex-end; align-items: center; }
.btn-explore { font-size: 0.82rem; font-weight: 600; color: var(--color-highlight, #3b82f6); background: transparent; border: none; cursor: pointer; }

/* Layout Planificador Semanal */
.planner-layout { display: grid; grid-template-columns: 340px 1fr; gap: 1.5rem; margin-top: 0.5rem; align-items: start; }
.library-panel { display: flex; flex-direction: column; gap: 1rem; height: fit-content; max-height: 85vh; }

.trainer-profile-expanded {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}
.trainer-profile-top { display: flex; align-items: center; gap: 0.85rem; }
.trainer-avatar-lg { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255, 255, 255, 0.12); }
.trainer-identity { display: flex; flex-direction: column; gap: 2px; }
.trainer-specialty-lg { font-size: 0.8rem; color: var(--color-highlight, #3b82f6); margin: 0; font-weight: 600; }
.trainer-bio-expanded { font-size: 0.78rem; color: rgba(245, 245, 244, 0.7); opacity: 0.85; margin: 0; line-height: 1.4; }
.trainer-contact-vertical { display: flex; flex-direction: column; gap: 0.35rem; margin-top: 0.25rem; background: rgba(255, 255, 255, 0.03); padding: 0.6rem; border-radius: 0.5rem; }

.styled-input {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.6rem;
  padding: 0.6rem 0.8rem;
  color: var(--color-texto-general, #f5f5f4);
  font-size: 0.85rem;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}
.styled-input:focus { border-color: var(--color-highlight, #3b82f6); }

.library-list { display: flex; flex-direction: column; gap: 0.75rem; overflow-y: auto; max-height: 42vh; padding-right: 4px; }
.mini-routine-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  padding: 0.75rem;
  cursor: grab;
  position: relative;
  transition: background 0.2s ease, border-color 0.2s ease;
}
.mini-routine-card:hover { background: rgba(59, 130, 246, 0.04); border-color: var(--color-highlight, #3b82f6); }
.mini-thumb { width: 46px; height: 46px; border-radius: 0.5rem; object-fit: cover; flex-shrink: 0; background: #000; }
.mini-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
.mini-name { font-size: 0.85rem; font-weight: 700; color: var(--color-titulos, #ffffff); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.mini-badges-row { display: flex; gap: 5px; flex-wrap: wrap; }
.mini-level-badge { font-size: 0.58rem; font-weight: 700; padding: 1px 6px; border-radius: 5px; background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, white); text-transform: uppercase; }
.mini-cat-badge { font-size: 0.62rem; color: var(--color-highlight, #60a5fa); font-weight: 600; }

.mini-card-actions { position: relative; flex-shrink: 0; }
.add-to-day-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-highlight, #60a5fa);
  border: 1px solid rgba(59, 130, 246, 0.25);
  padding: 0.35rem 0.65rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  white-space: nowrap;
}
.add-to-day-btn:hover { background: rgba(59, 130, 246, 0.2); }

.add-day-dropdown {
  position: absolute;
  right: 0;
  top: 115%;
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  z-index: 10;
  box-shadow: 0 10px 25px rgba(0,0,0,0.5);
  min-width: 110px;
  overflow: hidden;
}
.add-day-dropdown button {
  background: transparent;
  border: none;
  color: var(--color-texto-general, #f5f5f4);
  padding: 0.5rem 0.75rem;
  text-align: left;
  font-size: 0.78rem;
  cursor: pointer;
  transition: background 0.15s ease;
}
.add-day-dropdown button:hover { background: var(--color-highlight, #3b82f6); color: #fff; }

.empty-hint { text-align: center; color: rgba(245, 245, 244, 0.4); font-size: 0.8rem; padding: 1.5rem 0; }

/* Panel Enfocado Semanal */
.week-focus-panel { display: flex; flex-direction: column; gap: 1rem; min-width: 0; }
.day-selector-bar { display: flex; flex-direction: column; gap: 1rem; padding: 1rem; }

.clean-tabs { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  gap: 0.5rem; 
  width: 100%; 
}

.day-strip-chip {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.6rem;
  padding: 0.5rem 0.25rem;
  color: rgba(245, 245, 244, 0.65);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.8rem;
  box-sizing: border-box;
}
.day-strip-chip:hover {
  background: rgba(59, 130, 246, 0.06);
  border-color: var(--color-highlight, #3b82f6);
  color: #fff;
}
.day-strip-chip.active { 
  background: var(--color-botones, #3b82f6); 
  color: var(--color-texto-botones, white); 
  border-color: var(--color-botones, #3b82f6); 
  font-weight: 700; 
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
.strip-dot { width: 4px; height: 4px; border-radius: 50%; background: currentColor; opacity: 0.6; }

.day-detail-card { display: flex; flex-direction: column; gap: 1.25rem; min-height: 320px; }
.day-detail-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; }
.day-detail-title { font-size: 1.25rem; font-weight: 800; color: var(--color-titulos, #ffffff); margin: 0; }
.day-detail-actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }

.rest-toggle { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: rgba(245, 245, 244, 0.8); cursor: pointer; }
.rest-toggle input { accent-color: var(--color-highlight, #3b82f6); }
.rest-day-box.big, .day-empty-drop.big { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 1rem; text-align: center; color: rgba(245, 245, 244, 0.5); gap: 0.75rem; }

.routines-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
.routine-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 16px);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
}
.routine-card.completed-routine { border-color: rgba(34, 197, 94, 0.4); opacity: 0.85; }

.card-media { position: relative; height: 130px; width: 100%; background: #000; }
.card-media img { width: 100%; height: 100%; object-fit: cover; }
.media-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(18,18,18,0.8) 100%); }
.badge-container { position: absolute; top: 8px; left: 8px; display: flex; gap: 4px; }
.badge-level { background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, white); font-size: 0.6rem; padding: 0.15rem 0.4rem; border-radius: 4px; font-weight: 700; text-transform: uppercase; }
.badge-goal { background: rgba(0, 0, 0, 0.6); color: var(--color-texto-general, #f5f5f4); font-size: 0.6rem; padding: 0.15rem 0.4rem; border-radius: 4px; }

.status-badge-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(34, 197, 94, 0.85);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.card-body { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; flex: 1; justify-content: space-between; }
.card-title-routine { font-size: 0.95rem; font-weight: 700; color: var(--color-titulos, #ffffff); margin: 0; }
.routine-desc { font-size: 0.75rem; color: rgba(245, 245, 244, 0.6); opacity: 0.8; margin: 0; }

.card-footer-actions { display: flex; justify-content: space-between; align-items: center; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid rgba(255, 255, 255, 0.06); }
.complete-checkbox-label { display: flex; align-items: center; gap: 0.4rem; font-size: 0.75rem; color: rgba(245, 245, 244, 0.8); cursor: pointer; }
.complete-checkbox-label input { accent-color: #22c55e; }

/* OPTIMIZACIÓN MÓVIL Y TABLET */
@media (max-width: 900px) {
  .planner-layout { grid-template-columns: 1fr; }
  .weekly-wrapper { padding: 1rem 0.5rem; }
  .glass-card { padding: 1rem 0.75rem; }
  .trainers-grid-balanced { grid-template-columns: 1fr; }
}

@media (max-width: 640px) {
  .clean-tabs {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 6px;
    gap: 0.4rem;
    scrollbar-width: none;
  }
  .clean-tabs::-webkit-scrollbar { display: none; }
  .day-strip-chip { flex: 0 0 72px; scroll-snap-align: start; min-height: 52px; }
}

@media (max-width: 480px) {
  .mini-routine-card { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
  .mini-thumb { width: 100%; height: 100px; }
  .mini-info { width: 100%; }
  .mini-name { white-space: normal; overflow: visible; }
  .mini-card-actions { width: 100%; display: flex; justify-content: flex-end; margin-top: 0.25rem; }
  .add-to-day-btn { width: 100%; justify-content: center; }
  .add-day-dropdown { right: 0; left: 0; width: 100%; }
}
</style>
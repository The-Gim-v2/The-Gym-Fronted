<template>
    <HeadingMember>
  <div class="weekly-wrapper">
    <main class="weekly-main">

      <!-- HEADER -->
      <section id="tutorial-1" class="glass-card header-card">
        <div class="header-top-row">
          <span class="gym-badge-tag">{{ t.planTag }}</span>
          <transition name="fade">
            <span v-if="savedConfirmation" class="saved-toast">✓ {{ t.savedToast }}</span>
          </transition>
        </div>

        <div class="header-titles">
          <h1 class="main-heading">
            {{ t.mainTitle1 }} <span class="highlight-color">{{ t.mainTitle2 }}</span>
          </h1>
          <p class="hero-desc">{{ t.heroDesc }}</p>
        </div>

        <div id="tutorial-2" class="summary-row">
          <div class="summary-pill">
            <svg class="summary-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span class="summary-num">{{ summary.trainingDays }}</span>
            <span class="summary-label">{{ t.summaryTrainingDays }}</span>
          </div>
          <div class="summary-pill rest-pill">
            <svg class="summary-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            <span class="summary-num">{{ summary.restDays }}</span>
            <span class="summary-label">{{ t.summaryRestDays }}</span>
          </div>
          <div class="summary-pill">
            <svg class="summary-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
            <span class="summary-num">{{ summary.totalExercises }}</span>
            <span class="summary-label">{{ t.summaryExercises }}</span>
          </div>
        </div>

        <div id="tutorial-3" class="header-actions-row">
          <button class="btn-secondary-action" @click="openGenerateModal">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"></path></svg>
            {{ t.generateBtn }}
          </button>
          <button class="btn-primary-action" @click="saveWeeklyPlan">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
            {{ t.saveBtn }}
          </button>
        </div>
      </section>

      <!-- LAYOUT: BIBLIOTECA + DÍA ENFOCADO -->
      <div class="planner-layout">

        <!-- BIBLIOTECA DE RUTINAS GUARDADAS -->
        <aside id="tutorial-4" class="glass-card library-panel">
          <h3 class="panel-heading">{{ t.libraryTitle }}</h3>
          <p class="hero-desc small">{{ t.libraryDesc }}</p>

          <div class="search-input-wrapper">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              class="styled-input"
              v-model="libraryFilterText"
              :placeholder="t.searchPlaceholder"
            />
          </div>

          <div class="library-list custom-scrollbar">
            <div
              v-for="routine in filteredLibraryRoutines"
              :key="routine.id"
              class="mini-routine-card"
              draggable="true"
              @dragstart="onDragStart($event, routine, { type: 'library' })"
              @click="openDetail(routine)"
            >
              <img
                class="mini-thumb"
                :src="getRoutineMediaSrc(routine)"
                :alt="routine.name"
                loading="lazy"
                @error="(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200'; }"
              />
              <div class="mini-info">
                <span class="mini-name">{{ routine.name }}</span>
                <div class="mini-badges-row">
                  <span class="mini-level-badge">{{ translateLevel(routine.level) }}</span>
                  <span class="mini-cat-badge">{{ t.cats[routine.category] || routine.category }}</span>
                </div>
              </div>

              <div class="mini-card-actions" @click.stop>
                <button class="add-to-day-btn" @click="toggleAddMenu(routine.id, $event)">
                  {{ t.addToDayBtn }} <span class="chevron">▾</span>
                </button>
                <div class="add-day-dropdown" v-if="openAddMenuId === routine.id">
                  <button v-for="day in dayKeys" :key="day" @click="addRoutineToDay(day, routine)">
                    {{ t.daysShort[day] }}
                  </button>
                </div>
              </div>
            </div>

            <div v-if="!filteredLibraryRoutines.length" class="empty-hint">
              <p>{{ props.savedRoutines.length ? t.noMatchFilter : t.noSavedRoutines }}</p>
            </div>
          </div>
        </aside>

        <!-- PANEL DE DÍA ENFOCADO -->
        <section class="week-focus-panel">

          <div id="tutorial-5" class="day-selector-bar glass-card">
            <div class="day-select-field">
              <label class="filter-group-title">{{ t.selectDayLabel }}</label>
              <div class="select-wrapper">
                <select v-model="selectedDay" class="styled-select">
                  <option v-for="day in dayKeys" :key="day" :value="day">
                    {{ t.days[day] }}{{ weeklyPlan[day].isRest ? ' · ' + t.restDayLabel : (weeklyPlan[day].routines.length ? ' · ' + weeklyPlan[day].routines.length + ' ' + t.exercisesShort : '') }}
                  </option>
                </select>
              </div>
            </div>

            <div class="day-chips-strip">
              <button
                v-for="day in dayKeys"
                :key="day"
                class="day-strip-chip"
                :class="{ active: selectedDay === day, 'is-rest': weeklyPlan[day].isRest, 'has-routines': !weeklyPlan[day].isRest && weeklyPlan[day].routines.length }"
                @click="selectedDay = day"
              >
                <span class="strip-day-label">{{ t.daysShort[day] }}</span>
                <span class="strip-dot"></span>
              </button>
            </div>
          </div>

          <div
            id="tutorial-6"
            class="day-detail-card glass-card"
            :class="{ 'is-drop-target': draggingItem }"
            @dragover.prevent
            @drop="onDropToDay($event, selectedDay)"
          >
            <div class="day-detail-header">
              <div class="day-detail-title-group">
                <h2 class="day-detail-title">{{ t.days[selectedDay] }}</h2>
                <span class="section-count-badge" v-if="!weeklyPlan[selectedDay].isRest">
                  {{ weeklyPlan[selectedDay].routines.length }} {{ t.resultsLabel }}
                </span>
              </div>
              <div class="day-detail-actions">
                <label class="rest-toggle">
                  <input type="checkbox" v-model="weeklyPlan[selectedDay].isRest" @change="onToggleRest(selectedDay)" />
                  <span>{{ t.restDayLabel }}</span>
                </label>
                <button
                  v-if="!weeklyPlan[selectedDay].isRest && weeklyPlan[selectedDay].routines.length"
                  class="clear-day-btn"
                  @click="clearDay(selectedDay)"
                  :title="t.clearDayBtn"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </div>
            </div>

            <div v-if="weeklyPlan[selectedDay].isRest" class="rest-day-box big">
              <div class="waiting-icon-ring">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              </div>
              <h3>{{ t.restDayBoxTitle }}</h3>
              <p>{{ t.restDayBoxText }}</p>
            </div>

            <div v-else-if="!weeklyPlan[selectedDay].routines.length" class="day-empty-drop big">
              <div class="waiting-icon-ring">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
              </div>
              <p>{{ t.dropHint }}</p>
            </div>

            <!-- GRILLA DE RUTINAS -->
            <div v-else id="tutorial-7" class="routines-grid">
              <div
                v-for="(routine, idx) in weeklyPlan[selectedDay].routines"
                :key="routine.instanceId || routine.id"
                class="routine-card"
                draggable="true"
                @dragstart="onDragStart($event, routine, { type: 'day', day: selectedDay, index: idx })"
              >
                <!-- Contenedor de Imagen e Insignias -->
                <div class="card-media">
                  <img :src="getRoutineMediaSrc(routine)" :alt="routine.name" loading="lazy" @error="(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'; }">
                  <div class="media-overlay"></div>
                  
                  <div class="badge-container">
                    <span class="badge-level">{{ translateLevel(routine.level) }}</span>
                    <span class="badge-goal">{{ routine.target }}</span>
                  </div>

                  <!-- ACCIONES SUPERIORES DE LA TARJETA -->
                  <div class="media-actions" style="display: flex; gap: 6px;">
                    <button 
                      class="icon-action-btn delete-btn" 
                      @click="removeRoutineFromDay(selectedDay, idx)"
                      title="Borrar de la rutina">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>

                    <div style="position: relative;" @click.stop>
                      <button 
                        class="icon-action-btn move-btn" 
                        @click="toggleMoveMenu(routine.instanceId || routine.id, $event)"
                        title="Mover a otro día">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                      </button>
                      <div class="add-day-dropdown" v-if="openMoveMenuId === (routine.instanceId || routine.id)" style="right: 0; left: auto; top: 100%;">
                        <button v-for="day in dayKeys" :key="day" @click="moveRoutineToDay(selectedDay, idx, day, routine)">
                          {{ t.days[day] }}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Cuerpo de la Tarjeta -->
                <div class="card-body">
                  <h3 class="card-title-routine">{{ routine.name }}</h3>
                  <p class="routine-desc">{{ getRoutineDescription(routine) }}</p>

                  <div class="quick-prescription-pill">
                    <div class="pill-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                      <span><strong>{{ getPrescribedSets(routine) }}</strong> series</span>
                    </div>
                    <div class="pill-divider"></div>
                    <div class="pill-item">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                      <span><strong>{{ getPrescribedReps(routine) }}</strong></span>
                    </div>
                  </div>

                  <div class="routine-stats">
                    <div class="stat-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                      <span>{{ t.muscleLabel }}: <strong>{{ routine.target }}</strong></span>
                    </div>
                  </div>

                  <button class="btn-explore" @click="viewRoutineDetails(routine)">
                    {{ t.viewDetails }}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </button>
                </div>

              </div>
            </div>

          </div>
        </section>
      </div>

      <!-- ESTADO VACÍO GLOBAL -->
      <div id="tutorial-8" v-if="!props.savedRoutines.length" class="waiting-calculation-box glass-card">
        <div class="waiting-icon-ring">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </div>
        <h3>{{ t.emptyGlobalTitle }}</h3>
        <p>{{ t.emptyGlobalDesc }}</p>
      </div>


    </main>

    <!-- MODAL: GENERAR SEMANA AUTOMÁTICAMENTE -->
    <div class="modal-backdrop" v-if="showGenerateModal" @click.self="showGenerateModal = false">
      <div class="modal-content glass-card small-modal custom-scrollbar">
        <div class="modal-header">
          <div class="modal-title-group">
            <h2>{{ t.modalGenerateTitle }}</h2>
          </div>
          <button class="close-btn" @click="showGenerateModal = false">&times;</button>
        </div>

        <p class="modal-desc">{{ t.modalGenerateDesc }}</p>

        <div class="gen-section">
          <span class="gen-section-title">{{ t.chooseDaysLabel }}</span>
          <div class="day-chips-row">
            <button
              v-for="day in dayKeys"
              :key="day"
              class="day-chip"
              :class="{ active: genSelectedDays.includes(day) }"
              @click="toggleGenDay(day)"
            >
              {{ t.daysShort[day] }}
            </button>
          </div>
          <p class="gen-hint">{{ t.chooseDaysHint(genSelectedDays.length) }}</p>
        </div>

        <div class="gen-section">
          <span class="gen-section-title">{{ t.sourceLabel }}</span>
          <div class="source-options-row">
            <label class="source-option" :class="{ active: genSource === 'saved' }">
              <input type="radio" value="saved" v-model="genSource" />
              {{ t.sourceSaved }}
            </label>
            <label class="source-option" :class="{ active: genSource === 'library' }">
              <input type="radio" value="library" v-model="genSource" />
              {{ t.sourceLibrary }}
            </label>
            <label class="source-option" :class="{ active: genSource === 'both' }">
              <input type="radio" value="both" v-model="genSource" />
              {{ t.sourceBoth }}
            </label>
          </div>
        </div>

        <div class="gen-section">
          <span class="gen-section-title">{{ t.goalLabelRecap }} por Día</span>
          <div class="day-goal-selects-container" style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
            <div v-for="day in genSelectedDays" :key="day" class="day-goal-row">
              <span class="day-goal-name">{{ t.days[day] }}</span>
              <select v-model="dayGoals[day]" class="styled-select day-goal-select">
                <option value="hypertrophy">{{ t.goals.hypertrophy }}</option>
                <option value="strength">{{ t.goals.strength }}</option>
                <option value="endurance">{{ t.goals.endurance }}</option>
                <option value="fat_loss">{{ t.goals.fat_loss }}</option>
              </select>
            </div>
            <p v-if="!genSelectedDays.length" class="gen-hint">Selecciona días de entrenamiento arriba para configurar sus objetivos.</p>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-primary-action" :disabled="!genSelectedDays.length" @click="generateWeeklyPlan">
            {{ t.generateConfirmBtn }}
          </button>
          <button class="btn-secondary" @click="showGenerateModal = false">{{ t.cancelBtn }}</button>
        </div>
      </div>
    </div>

    <!-- MODAL DE DETALLES -->
    <RoutineDetailModal
      v-if="selectedRoutine"
      :routine="selectedRoutine"
      :isSaved="isRoutineSaved(selectedRoutine)"
      :t="t"
      :description="getRoutineDescription(selectedRoutine)"
      :instructionsList="getRoutineInstructionsList(selectedRoutine)"
      :prescribedSets="getPrescribedSets(selectedRoutine)"
      :prescribedReps="getPrescribedReps(selectedRoutine)"
      :prescribedRest="getPrescribedRest(selectedRoutine)"
      :translateLevel="translateLevel"
      @close="selectedRoutine = null"
    />

  </div>
  </HeadingMember>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { useLang } from '../useLang.js';
import RoutineDetailModal from '../Modals/RoutineDetailModalSM.vue';
import HeadingMember from '../HeadingMember.vue';

const { lang } = useLang();

const props = defineProps({
  savedRoutines: { type: Array, default: () => [] },
  routineLibrary: { type: Array, default: () => [] },
  userProfile: {
    type: Object,
    default: () => ({ age: 28, weight: 75, height: 175, gender: 'male', goal: 'hypertrophy' })
  },
  initialWeeklyPlan: { type: Object, default: null }
});

const emit = defineEmits(['save-weekly-plan']);

const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

// -------------------- TRADUCCIONES --------------------
const traducciones = {
  es: {
    planTag: 'Mi Plan Semanal',
    savedToast: 'Guardado',
    mainTitle1: 'Rutinas',
    mainTitle2: 'Semanales',
    heroDesc: 'Elige un día, revisa o arma su rutina, y muévela a otro día cuando quieras.',
    summaryTrainingDays: 'Días de entrenamiento',
    summaryRestDays: 'Días de descanso',
    summaryExercises: 'Ejercicios asignados',
    generateBtn: 'Generar Semana Automática',
    saveBtn: 'Guardar Plan Semanal',
    libraryTitle: 'Mis Rutinas Guardadas',
    libraryDesc: 'Arrastra una rutina hacia el día seleccionado o usa "Añadir a día".',
    searchPlaceholder: 'Buscar rutina...',
    addToDayBtn: 'Añadir a día',
    moveToBtn: 'Mover a',
    removeBtn: 'Quitar',
    noSavedRoutines: 'Aún no has guardado rutinas del catálogo.',
    noMatchFilter: 'Ninguna rutina coincide con la búsqueda.',
    selectDayLabel: 'Ver rutina del día',
    exercisesShort: 'ejerc.',
    resultsLabel: 'ejercicios programados',
    restDayLabel: 'Día de descanso',
    restDayBoxTitle: 'Día de descanso',
    restDayBoxText: 'No hay ejercicios programados para hoy. El cuerpo también entrena descansando.',
    dropHint: 'Arrastra una rutina desde la biblioteca o usa "Añadir a día" para llenar este día.',
    clearDayBtn: 'Vaciar día',
    emptyGlobalTitle: 'Todavía no tienes rutinas guardadas',
    emptyGlobalDesc: 'Ve al catálogo, calcula tus rutinas recomendadas y guarda las que quieras entrenar. Aparecerán aquí para armar tu semana.',
    modalGenerateTitle: 'Generar Semana Automática',
    modalGenerateDesc: 'Elige qué días quieres entrenar; el resto se marcarán como descanso. El sistema arma una rutina balanceada según tu perfil.',
    chooseDaysLabel: 'Días de entrenamiento',
    chooseDaysHint: (n) => n === 0 ? 'Selecciona al menos un día.' : `${n} día(s) de entrenamiento, ${7 - n} de descanso.`,
    sourceLabel: 'Fuente de ejercicios',
    sourceSaved: 'Solo mis guardados',
    sourceLibrary: 'Todo el catálogo',
    sourceBoth: 'Ambos',
    goalLabelRecap: 'Objetivo actual',
    generateConfirmBtn: 'Generar Rutina',
    cancelBtn: 'Cancelar',
    setsLabel: 'Series sugeridas',
    repsLabel: 'Repeticiones adaptadas',
    restLabel: 'Descanso óptimo',
    instructionsTitle: 'Instrucciones Paso a Paso',
    closeBtn: 'Cerrar',
    viewDetails: 'Ver Detalle Completo',
    muscleLabel: 'Músculo',
    days: { mon: 'Lunes', tue: 'Martes', wed: 'Miércoles', thu: 'Jueves', fri: 'Viernes', sat: 'Sábado', sun: 'Domingo' },
    daysShort: { mon: 'Lun', tue: 'Mar', wed: 'Mié', thu: 'Jue', fri: 'Vie', sat: 'Sáb', sun: 'Dom' },
    levelBeginner: 'Principiante',
    levelIntermediate: 'Intermedio',
    levelAdvanced: 'Avanzado',
    goals: {
      hypertrophy: 'Hipertrofia (Volumen)',
      strength: 'Fuerza Máxima',
      endurance: 'Resistencia',
      fat_loss: 'Definición / Quema grasa'
    },
    cats: {
      chest: 'Pecho', back: 'Espalda', 'upper legs': 'Piernas Sup.', 'upper arms': 'Brazos',
      shoulders: 'Hombros', waist: 'Cintura', 'lower legs': 'Piernas Inf.'
    }
  },
  en: {
    planTag: 'My Weekly Plan',
    savedToast: 'Saved',
    mainTitle1: 'Weekly',
    mainTitle2: 'Routines',
    heroDesc: 'Pick a day, review or build its routine, and move it to another day anytime.',
    summaryTrainingDays: 'Training days',
    summaryRestDays: 'Rest days',
    summaryExercises: 'Assigned exercises',
    generateBtn: 'Auto-Generate Week',
    saveBtn: 'Save Weekly Plan',
    libraryTitle: 'My Saved Routines',
    libraryDesc: 'Drag a routine onto the selected day or use "Add to day".',
    searchPlaceholder: 'Search routine...',
    addToDayBtn: 'Add to day',
    moveToBtn: 'Move to',
    removeBtn: 'Remove',
    noSavedRoutines: "You haven't saved any routines from the catalog yet.",
    noMatchFilter: 'No routines match your search.',
    selectDayLabel: 'View day routine',
    exercisesShort: 'ex.',
    resultsLabel: 'scheduled exercises',
    restDayLabel: 'Rest day',
    restDayBoxTitle: 'Rest day',
    restDayBoxText: 'No exercises scheduled for today. The body trains by resting too.',
    dropHint: 'Drag a routine from the library or use "Add to day" to fill this day.',
    clearDayBtn: 'Clear day',
    emptyGlobalTitle: "You don't have any saved routines yet",
    emptyGlobalDesc: 'Go to the catalog, calculate your recommended routines and save the ones you want to train. They will show up here to build your week.',
    modalGenerateTitle: 'Auto-Generate Week',
    modalGenerateDesc: 'Pick which days you want to train; the rest will be marked as rest days. The system builds a balanced routine based on your profile.',
    chooseDaysLabel: 'Training days',
    chooseDaysHint: (n) => n === 0 ? 'Select at least one day.' : `${n} training day(s), ${7 - n} rest day(s).`,
    sourceLabel: 'Exercise source',
    sourceSaved: 'Saved only',
    sourceLibrary: 'Full catalog',
    sourceBoth: 'Both',
    goalLabelRecap: 'Current goal',
    generateConfirmBtn: 'Generate Routine',
    cancelBtn: 'Cancel',
    setsLabel: 'Suggested Sets',
    repsLabel: 'Adapted Repetitions',
    restLabel: 'Optimal Rest',
    instructionsTitle: 'Step-by-Step Instructions',
    closeBtn: 'Close',
    viewDetails: 'View Full Details',
    muscleLabel: 'Muscle',
    days: { mon: 'Monday', tue: 'Tuesday', wed: 'Wednesday', thu: 'Thursday', fri: 'Friday', sat: 'Saturday', sun: 'Sunday' },
    daysShort: { mon: 'Mon', tue: 'Tue', wed: 'Wed', thu: 'Thu', fri: 'Fri', sat: 'Sat', sun: 'Sun' },
    levelBeginner: 'Beginner',
    levelIntermediate: 'Intermediate',
    levelAdvanced: 'Advanced',
    goals: {
      hypertrophy: 'Hypertrophy (Growth)',
      strength: 'Max Strength',
      endurance: 'Endurance',
      fat_loss: 'Fat Loss / Toning'
    },
    cats: {
      chest: 'Chest', back: 'Back', 'upper legs': 'Upper Legs', 'upper arms': 'Arms',
      shoulders: 'Shoulders', waist: 'Waist', 'lower legs': 'Lower Legs'
    }
  }
};

const selectedRoutine = ref(null);

const viewRoutineDetails = (routine) => {
  selectedRoutine.value = routine;
};

const translateLevel = (level) => {
  if (level === 'Principiante') return t.value.levelBeginner;
  if (level === 'Intermedio') return t.value.levelIntermediate;
  if (level === 'Avanzado') return t.value.levelAdvanced;
  return level;
};

const getPrescribedSets = (routine) => {
  const age = props.userProfile?.age || 28;
  const goal = props.userProfile?.goal || 'hypertrophy';
  if (age < 15 || age >= 60) return '2 - 3';
  if (goal === 'strength') return '4 - 5';
  if (routine.category === 'cardio' || routine.category === 'waist') return '3';
  return '3 - 4';
};

const getPrescribedReps = (routine) => {
  const goal = props.userProfile?.goal || 'hypertrophy';
  const cat = routine.category;
  const eq = routine.equipment;
  if (goal === 'strength') {
    if (cat === 'upper legs' || cat === 'chest' || cat === 'back') {
      return eq === 'body weight' ? '10 - 12 reps' : '4 - 6 reps';
    }
    return '6 - 8 reps';
  }
  if (goal === 'endurance' || goal === 'fat_loss') {
    if (cat === 'waist' || cat === 'lower legs') return '20 - 25 reps';
    return '15 - 20 reps';
  }
  if (cat === 'upper arms' || cat === 'shoulders') return '12 - 15 reps';
  if (cat === 'lower legs') return '15 - 20 reps';
  if (cat === 'upper legs') return eq === 'barbell' ? '8 - 10 reps' : '10 - 12 reps';
  return '10 - 12 reps';
};

const getPrescribedRest = (routine) => {
  const goal = props.userProfile?.goal || 'hypertrophy';
  if (goal === 'strength') return '120s - 180s';
  if (goal === 'fat_loss') return '30s - 45s';
  if (routine.category === 'upper legs') return '90s - 120s';
  return '60s - 90s';
};

const getRoutineDescription = (routine) => {
  const currentLang = lang.value;
  if (routine.instructions && routine.instructions[currentLang]) {
    return routine.instructions[currentLang];
  }
  return routine.instructions?.es || routine.instructions?.en || 'Realiza el movimiento de forma controlada.';
};

const getRoutineInstructionsList = (routine) => {
  const currentLang = lang.value;
  if (routine.instruction_steps && routine.instruction_steps[currentLang]) {
    return routine.instruction_steps[currentLang];
  }
  if (routine.instruction_steps && routine.instruction_steps.es) {
    return routine.instruction_steps.es;
  }
  return [getRoutineDescription(routine)];
};

const getRoutineMediaSrc = (routine) => {
  if (!routine) return '';
  const rawPath = routine.gif_url || routine.gifUrl || routine.image || routine.img;
  if (!rawPath) return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }
  return rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

// -------------------- ESTADO DEL PLAN --------------------
const createEmptyPlan = () => {
  const plan = {};
  dayKeys.forEach((d) => { plan[d] = { isRest: true, routines: [] }; });
  return plan;
};

const weeklyPlan = reactive(
  props.initialWeeklyPlan ? JSON.parse(JSON.stringify(props.initialWeeklyPlan)) : createEmptyPlan()
);

const selectedDay = ref('mon');
const savedConfirmation = ref(false);

const showGenerateModal = ref(false);
const genSelectedDays = ref(['mon', 'wed', 'fri']);
const genSource = ref('saved');
const dayGoals = reactive({
  mon: 'hypertrophy', tue: 'hypertrophy', wed: 'hypertrophy', thu: 'hypertrophy', fri: 'hypertrophy', sat: 'hypertrophy', sun: 'hypertrophy'
});

const simulatedSavedRoutines = computed(() => {
  return props.savedRoutines.length ? props.savedRoutines.slice(0, 3) : [
    { id: 'sim1', name: 'Rutina de Pecho Base', category: 'chest', level: 'Intermedio', target: 'chest', image: 'images/chest.jpg', instructions: { es: 'Instrucciones de prueba', en: 'Test instructions' } }
  ];
});

const openGenerateModal = () => { showGenerateModal.value = true; };

const toggleGenDay = (day) => {
  const index = genSelectedDays.value.indexOf(day);
  if (index > -1) genSelectedDays.value.splice(index, 1);
  else genSelectedDays.value.push(day);
};

const generateWeeklyPlan = () => {
  dayKeys.forEach(day => {
    if (genSelectedDays.value.includes(day)) {
      weeklyPlan[day].isRest = false;
      let pool = [];
      if (genSource.value === 'saved' || genSource.value === 'both') pool = pool.concat(props.savedRoutines);
      if (genSource.value === 'library' || genSource.value === 'both') pool = pool.concat(props.routineLibrary);
      if (!pool.length) pool = simulatedSavedRoutines.value;
      
      if (pool.length) {
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selectedSlice = shuffled.slice(0, 3);
        weeklyPlan[day].routines = selectedSlice.map(routine => ({
          ...routine,
          instanceId: makeInstanceId(routine)
        }));
      }
    } else {
      weeklyPlan[day].isRest = true;
      weeklyPlan[day].routines = [];
    }
  });
  showGenerateModal.value = false;
};

const saveWeeklyPlan = () => {
  emit('save-weekly-plan', JSON.parse(JSON.stringify(weeklyPlan)));
  savedConfirmation.value = true;
  setTimeout(() => { savedConfirmation.value = false; }, 3000);
};

const summary = computed(() => {
  let trainingDays = 0, restDays = 0, totalExercises = 0;
  dayKeys.forEach((d) => {
    if (weeklyPlan[d].isRest) restDays++; else trainingDays++;
    totalExercises += weeklyPlan[d].routines.length;
  });
  return { trainingDays, restDays, totalExercises };
});

// -------------------- BIBLIOTECA / FILTRO --------------------
const libraryFilterText = ref('');
const filteredLibraryRoutines = computed(() => {
  return props.savedRoutines.filter((r) => {
    if (!libraryFilterText.value) return true;
    return r.name.toLowerCase().includes(libraryFilterText.value.toLowerCase());
  });
});

const openAddMenuId = ref(null);
const openMoveMenuId = ref(null);

const toggleAddMenu = (id, event) => {
  event.stopPropagation();
  openMoveMenuId.value = null;
  openAddMenuId.value = openAddMenuId.value === id ? null : id;
};

const toggleMoveMenu = (instanceId, event) => {
  event.stopPropagation();
  openAddMenuId.value = null;
  openMoveMenuId.value = openMoveMenuId.value === instanceId ? null : instanceId;
};

const closeMenus = () => { openAddMenuId.value = null; openMoveMenuId.value = null; };
onMounted(() => window.addEventListener('click', closeMenus));
onUnmounted(() => window.removeEventListener('click', closeMenus));

const makeInstanceId = (routine) => `${routine.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const addRoutineToDay = (day, routine) => {
  weeklyPlan[day].isRest = false;
  weeklyPlan[day].routines.push({ ...routine, instanceId: makeInstanceId(routine) });
  openAddMenuId.value = null;
  selectedDay.value = day;
};

// --- BORRAR Y MOVER RUTINA DENTRO DEL PLAN ---
const removeRoutineFromDay = (day, index) => {
  weeklyPlan[day].routines.splice(index, 1);
};

const moveRoutineToDay = (fromDay, index, targetDay, routine) => {
  // Quitar del día actual
  weeklyPlan[fromDay].routines.splice(index, 1);
  // Agregar al día de destino
  weeklyPlan[targetDay].isRest = false;
  weeklyPlan[targetDay].routines.push(routine);
  openMoveMenuId.value = null;
  selectedDay.value = targetDay;
};

const clearDay = (day) => { weeklyPlan[day].routines = []; };
const onToggleRest = (day) => { if (weeklyPlan[day].isRest) weeklyPlan[day].routines = []; };

// -------------------- DRAG & DROP --------------------
const draggingItem = ref(null);
const onDragStart = (event, routine, source) => {
  draggingItem.value = { routine, source };
  event.dataTransfer.effectAllowed = 'move';
};

const onDropToDay = (event, day) => {
  if (!draggingItem.value) return;
  const { routine, source } = draggingItem.value;
  if (source.type === 'day' && source.day === day) { draggingItem.value = null; return; }
  weeklyPlan[day].isRest = false;
  if (source.type === 'day') {
    weeklyPlan[source.day].routines.splice(source.index, 1);
    weeklyPlan[day].routines.push(routine);
  } else {
    weeklyPlan[day].routines.push({ ...routine, instanceId: makeInstanceId(routine) });
  }
  draggingItem.value = null;
};

const isRoutineSaved = (routine) => {
  return props.savedRoutines.some(r => r.id === routine.id);
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.weekly-wrapper {
  background: var(--bg-custom, #0a0a0a);
  min-height: 100vh;
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.weekly-main {
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 40px clamp(16px, 3vw, 32px);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 22px);
  padding: 28px 30px;
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
}

/* HEADER */
.header-card { display: flex; flex-direction: column; gap: 22px; }

.header-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-botones, #1c4fd6), #60a5fa, var(--color-botones, #1c4fd6));
}

.header-top-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }

.gym-badge-tag {
  font-family: 'Oswald', sans-serif;
  font-size: 0.68rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--color-highlight, #60a5fa);
  padding: 5px 12px;
  border-radius: 50px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

.saved-toast {
  font-size: 0.74rem;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  padding: 5px 12px;
  border-radius: 50px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.header-titles { display: flex; flex-direction: column; gap: 8px; }

.main-heading {
  font-family: 'Anton', sans-serif;
  font-size: 2.1rem;
  font-weight: 400;
  margin: 0;
  color: var(--color-titulos, #ffffff);
  letter-spacing: 0.3px;
  line-height: 1.1;
  text-transform: uppercase;
}

.highlight-color { color: var(--color-highlight, #3b82f6); }

.hero-desc { font-size: 0.9rem; color: rgba(245, 245, 244, 0.6); margin: 0; font-weight: 500; line-height: 1.5; max-width: 560px; }
.hero-desc.small { font-size: 0.78rem; margin-bottom: 2px; }

.summary-row { display: flex; gap: 12px; flex-wrap: wrap; }

.summary-pill {
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 110px;
  flex: 1;
  transition: border-color 0.2s ease, transform 0.15s ease;
}
.summary-pill:hover { transform: translateY(-2px); border-color: rgba(59, 130, 246, 0.4); }
.summary-pill.rest-pill { background: rgba(255, 255, 255, 0.03); border-color: rgba(255, 255, 255, 0.1); }

.summary-icon { color: var(--color-highlight, #3b82f6); margin-bottom: 6px; }
.summary-num { font-family: 'Oswald', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; line-height: 1.1; }
.summary-label { font-size: 0.66rem; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); font-weight: 600; text-align: center; letter-spacing: 0.3px; margin-top: 2px; }

.header-actions-row { display: flex; gap: 12px; flex-wrap: wrap; }

.btn-primary-action, .btn-secondary-action, .btn-secondary {
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease, background 0.2s ease;
}
.btn-primary-action { background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, white); box-shadow: 0 6px 18px rgba(59, 130, 246, 0.35); }
.btn-primary-action:hover { filter: brightness(1.08); transform: translateY(-2px); box-shadow: 0 10px 24px rgba(59, 130, 246, 0.45); }
.btn-primary-action:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }

.btn-secondary-action {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.12);
}
.btn-secondary-action:hover { background: rgba(59, 130, 246, 0.12); border-color: rgba(59, 130, 246, 0.4); transform: translateY(-2px); }

.btn-secondary { background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); }
.btn-secondary:hover { background: rgba(255, 255, 255, 0.1); transform: translateY(-2px); }

/* LAYOUT */
.planner-layout { display: grid; grid-template-columns: 300px 1fr; gap: 24px; align-items: start; }

/* BIBLIOTECA */
.library-panel { display: flex; flex-direction: column; gap: 12px; position: sticky; top: 24px; }
.panel-heading {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.05rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.panel-heading::before {
  content: '';
  width: 3px;
  height: 16px;
  border-radius: 3px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--color-botones, #1c4fd6), rgba(37, 99, 235, 0.25));
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.search-input-wrapper svg {
  position: absolute;
  left: 12px;
  color: rgba(245, 245, 244, 0.4);
  pointer-events: none;
}
.search-input-wrapper .styled-input { padding-left: 34px; }

.styled-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.035);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 10px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 500;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.styled-input:focus { border-color: var(--color-highlight, #3b82f6); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); }

.library-list { display: flex; flex-direction: column; gap: 10px; max-height: 640px; overflow-y: auto; padding-right: 4px; }

.mini-routine-card {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 9px;
  cursor: grab;
  position: relative;
  transition: border-color 0.2s ease, transform 0.15s ease;
}
.mini-routine-card:hover { border-color: var(--color-highlight, #3b82f6); transform: translateY(-1px); }
.mini-routine-card:active { cursor: grabbing; }

.mini-thumb { width: 46px; height: 46px; object-fit: contain; background: #000; border-radius: 8px; flex-shrink: 0; }

.mini-info { display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; }
.mini-name { font-size: 0.78rem; font-weight: 600; color: #fff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mini-badges-row { display: flex; gap: 5px; flex-wrap: wrap; }
.mini-level-badge {
  font-size: 0.6rem; font-weight: 700; padding: 2px 7px; border-radius: 5px;
  background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, #fff); text-transform: uppercase;
}
.mini-cat-badge { font-size: 0.64rem; color: var(--color-highlight, #60a5fa); font-weight: 600; }

.mini-card-actions { position: relative; }

.add-to-day-btn {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  color: var(--color-highlight, #60a5fa);
  font-size: 0.64rem;
  font-weight: 700;
  padding: 6px 9px;
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
  transition: background 0.2s ease;
}
.add-to-day-btn:hover { background: rgba(59, 130, 246, 0.22); }

.add-day-dropdown {
  position: absolute;
  right: 0;
  top: calc(100% + 4px);
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px;
  padding: 6px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  z-index: 20;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}
.add-day-dropdown button {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 0.62rem;
  font-weight: 600;
  padding: 6px 4px;
  border-radius: 6px;
  cursor: pointer;
}
.add-day-dropdown button:hover { background: var(--color-highlight, #3b82f6); border-color: var(--color-highlight, #3b82f6); }

.empty-hint { padding: 20px 8px; text-align: center; color: rgba(245, 245, 244, 0.4); font-size: 0.78rem; }

/* PANEL DE DÍA ENFOCADO */
.week-focus-panel { display: flex; flex-direction: column; gap: 18px; }

.day-selector-bar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  flex-wrap: wrap;
  padding: 20px 24px;
}

.day-select-field { display: flex; flex-direction: column; gap: 7px; min-width: 220px; }
.filter-group-title { font-family: 'Oswald', sans-serif; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: rgba(245, 245, 244, 0.5); letter-spacing: 0.5px; }

.select-wrapper { position: relative; width: 100%; }

.styled-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.035);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 10px 30px 10px 13px;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  appearance: none;
  box-sizing: border-box;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.364%22%20height%3D%22292.364%22%3E%3Cpath%20fill%3D%22%2360a5fa%22%20d%3D%22M287.9 69.8c-4.3-4.3-11.3-4.3-15.6 0L146.1 195.8 20 69.8c-4.3-4.3-11.3-4.3-15.6 0s-4.3 11.3 0 15.6l133.4 133.4c4.3 4.3 11.3 4.3 15.6 0l133.5-133.4c4.3-4.3 4.3-11.3 0-15.6z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 13px center;
  background-size: 9px auto;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}
.styled-select:hover, .styled-select:focus { border-color: var(--color-highlight, #3b82f6); background-color: rgba(59, 130, 246, 0.05); }
.styled-select option { background: #141414; color: #fff; }

.day-chips-strip { display: flex; gap: 7px; flex-wrap: wrap; }

.day-strip-chip {
  background: rgba(255, 255, 255, 0.035);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 244, 0.65);
  font-family: 'Oswald', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 8px 13px;
  border-radius: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 7px;
  transition: all 0.18s ease;
}
.day-strip-chip:hover { border-color: var(--color-highlight, #3b82f6); color: #fff; transform: translateY(-1px); }
.day-strip-chip.active { background: var(--color-botones, #3b82f6); border-color: var(--color-botones, #3b82f6); color: var(--color-texto-botones, #fff); box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35); }
.strip-dot { width: 6px; height: 6px; border-radius: 50%; background: rgba(245, 245, 244, 0.25); flex-shrink: 0; }
.day-strip-chip.has-routines .strip-dot { background: #34d399; }
.day-strip-chip.is-rest .strip-dot { background: rgba(245, 245, 244, 0.2); }
.day-strip-chip.active .strip-dot { background: #fff; }

.day-detail-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-height: 420px;
  transition: border-color 0.2s ease;
}
.day-detail-card.is-drop-target { border-color: rgba(59, 130, 246, 0.45); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.12); }

.day-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 16px;
}

.day-detail-title-group { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.day-detail-title {
  margin: 0;
  font-family: 'Anton', sans-serif;
  font-size: 1.6rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.day-detail-title::before {
  content: '';
  width: 4px;
  height: 22px;
  border-radius: 4px;
  flex-shrink: 0;
  background: linear-gradient(180deg, var(--color-botones, #1c4fd6), rgba(37, 99, 235, 0.25));
}

.section-count-badge {
  font-size: 0.74rem;
  font-weight: 700;
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-highlight, #60a5fa);
  padding: 5px 12px;
  border-radius: 50px;
  border: 1px solid rgba(59, 130, 246, 0.22);
}

.day-detail-actions { display: flex; align-items: center; gap: 16px; }

.rest-toggle { display: flex; align-items: center; gap: 7px; font-size: 0.75rem; color: rgba(245, 245, 244, 0.6); font-weight: 600; cursor: pointer; user-select: none; }
.rest-toggle input { accent-color: var(--color-highlight, #3b82f6); cursor: pointer; width: 15px; height: 15px; }

.clear-day-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 244, 0.6);
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 0.2s ease, border-color 0.2s ease, transform 0.15s ease;
}
.clear-day-btn:hover { color: #f87171; border-color: rgba(248, 113, 113, 0.4); transform: translateY(-1px); }

.rest-day-box.big, .day-empty-drop.big {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: rgba(245, 245, 244, 0.45);
  text-align: center;
  padding: 60px 20px;
}
.waiting-icon-ring {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  color: var(--color-highlight, #3b82f6);
}
.rest-day-box.big h3 { margin: 0; color: #fff; font-family: 'Anton', sans-serif; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.3px; }
.rest-day-box.big p, .day-empty-drop.big p { margin: 0; font-size: 0.85rem; max-width: 360px; line-height: 1.5; }

/* TARJETAS DE RUTINA */
.routines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(270px, 1fr));
  gap: 20px;
}

.routine-card {
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 16px);
  overflow: hidden;
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.3);
  cursor: grab;
}
.routine-card:hover { border-color: var(--color-highlight, #3b82f6); transform: translateY(-3px); box-shadow: 0 14px 30px rgba(0, 0, 0, 0.4); }
.routine-card:active { cursor: grabbing; }

.card-media { position: relative; height: 160px; width: 100%; overflow: hidden; background: #050505; display: flex; align-items: center; justify-content: center; }
.card-media img { width: 100%; height: 100%; object-fit: contain; padding: 12px; transition: transform 0.35s ease; }
.routine-card:hover .card-media img { transform: scale(1.04); }

.media-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 42%, rgba(18,18,18,0.88) 100%); pointer-events: none; }

.badge-container { position: absolute; top: 10px; left: 10px; display: flex; gap: 6px; z-index: 2; flex-wrap: wrap; }
.badge-level, .badge-goal { font-family: 'Oswald', sans-serif; font-size: 0.6rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.4px; }
.badge-level { background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, #fff); }
.badge-goal { background: rgba(0, 0, 0, 0.72); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.12); }

.media-actions { position: absolute; top: 10px; right: 10px; z-index: 2; }

.icon-action-btn {
  background: rgba(0, 0, 0, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}
.icon-action-btn:hover { transform: translateY(-1px); }
.icon-action-btn.delete-btn:hover { background: rgba(248, 113, 113, 0.85); }
.icon-action-btn.move-btn:hover { background: rgba(59, 130, 246, 0.85); }

.card-body { padding: 18px; display: flex; flex-direction: column; gap: 12px; flex-grow: 1; }
.card-title-routine { margin: 0; font-family: 'Oswald', sans-serif; font-size: 1.08rem; color: var(--color-titulos, #ffffff); line-height: 1.3; }

.routine-desc {
  margin: 0; font-size: 0.8rem; color: rgba(245, 245, 244, 0.55); line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.quick-prescription-pill {
  display: flex; align-items: center; justify-content: space-between; background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.18); padding: 8px 14px; border-radius: 10px;
  font-size: 0.75rem; color: var(--color-highlight, #60a5fa);
}
.pill-item { display: flex; align-items: center; gap: 6px; }
.pill-item svg { color: var(--color-highlight, #60a5fa); flex-shrink: 0; }
.pill-divider { width: 1px; height: 16px; background: rgba(59, 130, 246, 0.25); flex-shrink: 0; }

.routine-stats {
  display: flex; gap: 10px; font-size: 0.74rem; color: rgba(245, 245, 244, 0.6);
  background: rgba(255, 255, 255, 0.02); padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.04);
}
.stat-item { display: flex; align-items: center; gap: 6px; }
.stat-item svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }

.btn-explore {
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  width: 100%;
  padding: 11px;
  border-radius: 10px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  cursor: pointer;
  margin-top: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: filter 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
}
.btn-explore:hover { filter: brightness(1.08); transform: translateY(-2px); box-shadow: 0 8px 18px rgba(59, 130, 246, 0.35); }

.waiting-calculation-box {
  text-align: center; padding: 56px 24px; display: flex; flex-direction: column;
  align-items: center; gap: 16px; color: rgba(245, 245, 244, 0.6);
}
.waiting-calculation-box h3 { margin: 0; color: #fff; font-family: 'Anton', sans-serif; font-size: 1.35rem; text-transform: uppercase; letter-spacing: 0.3px; }
.waiting-calculation-box p { margin: 0; font-size: 0.88rem; max-width: 420px; line-height: 1.5; }

/* MODALES */
.modal-backdrop {
  position: fixed; inset: 0; background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;
  box-sizing: border-box;
}

.modal-content {
  width: 100%; max-width: 650px; max-height: 90vh; overflow-y: auto;
  background: var(--bg-cards, #111111) !important; border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)) !important;
  border-radius: 24px; padding: 32px !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  animation: modalAppear 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-content.small-modal { max-width: 520px; }

@keyframes modalAppear {
  from { opacity: 0; transform: translateY(15px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.2); border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(59, 130, 246, 0.8); }

.modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.modal-title-group { display: flex; flex-direction: column; gap: 8px; }
.modal-header h2 { margin: 0; font-family: 'Anton', sans-serif; font-size: 1.35rem; color: #fff; letter-spacing: 0.3px; text-transform: uppercase; }

.close-btn {
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff;
  width: 34px; height: 34px; border-radius: 50%; font-size: 1.3rem; display: flex;
  align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s ease;
  flex-shrink: 0;
}
.close-btn:hover { background: rgba(255, 255, 255, 0.15); }

.modal-desc { font-size: 0.86rem; color: rgba(245, 245, 244, 0.72); margin-bottom: 20px; line-height: 1.6; }

.gen-section { display: flex; flex-direction: column; gap: 10px; margin-bottom: 22px; }
.gen-section-title { font-family: 'Oswald', sans-serif; font-size: 0.74rem; font-weight: 700; text-transform: uppercase; color: rgba(245, 245, 244, 0.55); letter-spacing: 0.4px; }

.day-chips-row { display: flex; gap: 8px; flex-wrap: wrap; }

.day-chip {
  background: rgba(255, 255, 255, 0.035); border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 244, 0.7); font-family: 'Oswald', sans-serif; font-size: 0.76rem; font-weight: 700; padding: 9px 16px;
  border-radius: 50px; cursor: pointer; transition: all 0.18s ease;
}
.day-chip:hover { border-color: var(--color-highlight, #3b82f6); color: #fff; transform: translateY(-1px); }
.day-chip.active { background: var(--color-botones, #3b82f6); border-color: var(--color-botones, #3b82f6); color: var(--color-texto-botones, #fff); box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35); }

.gen-hint { font-size: 0.74rem; color: rgba(245, 245, 244, 0.4); margin: 2px 0 0; }

.source-options-row { display: flex; gap: 10px; flex-wrap: wrap; }
.source-option {
  background: rgba(255, 255, 255, 0.025); border: 1.5px solid rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 244, 0.7); font-size: 0.78rem; font-weight: 600; padding: 9px 15px;
  border-radius: 10px; display: flex; align-items: center; gap: 7px; cursor: pointer; transition: all 0.18s ease;
}
.source-option input { accent-color: var(--color-highlight, #3b82f6); }
.source-option:hover { border-color: rgba(59, 130, 246, 0.35); }
.source-option.active { border-color: var(--color-highlight, #3b82f6); background: rgba(59, 130, 246, 0.09); color: #fff; }

.day-goal-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 9px 12px;
  border-radius: 10px;
}
.day-goal-name { font-family: 'Oswald', sans-serif; font-size: 0.78rem; font-weight: 700; color: #fff; width: 80px; flex-shrink: 0; }
.day-goal-select { flex: 1; max-width: 240px; padding: 7px 26px 7px 11px; font-size: 0.76rem; }

.modal-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; flex-wrap: wrap; }
.modal-footer .btn-primary-action, .modal-footer .btn-secondary { flex: 1; justify-content: center; min-width: 140px; }

@media (max-width: 1100px) {
  .planner-layout { grid-template-columns: 1fr; }
  .library-panel { position: static; }
  .library-list { max-height: 380px; }
}

@media (max-width: 768px) {
  .weekly-main { padding: 20px 14px; gap: 24px; }
  .glass-card { padding: 22px 18px; }
  .main-heading { font-size: 1.6rem; }
  .hero-desc { font-size: 0.84rem; }

  /* Tarjetas de resumen en cuadrícula de 2 columnas */
  .summary-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .summary-row .summary-pill:last-child {
    grid-column: span 2;
  }

  .header-actions-row { flex-direction: column; }
  .btn-primary-action, .btn-secondary-action { width: 100%; justify-content: center; }

  .day-selector-bar { flex-direction: column; align-items: stretch; padding: 16px; }
  .day-detail-title { font-size: 1.3rem; }
  .routines-grid { grid-template-columns: 1fr; }
  .day-detail-header { flex-direction: column; align-items: flex-start; }

  /* MEJORAS VISUALES PARA EL MODAL EN MÓVIL */
  .modal-backdrop {
    padding: 12px;
    align-items: center;
  }
  
  .modal-content {
    max-height: 90vh;
    padding: 22px 18px !important;
  }

  /* Distribución en cuadrícula de 4 columnas para los días */
  .day-chips-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 6px;
  }
  
  .day-chip {
    text-align: center;
    padding: 9px 2px;
    font-size: 0.7rem;
  }

  /* Opciones de fuente de ejercicios (Grid de 2 columnas para que no se amontonen feo) */
  .source-options-row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }
  
  .source-option {
    width: 100%;
    justify-content: flex-start;
    padding: 10px 12px;
  }
  
  /* Hacer que la última opción de fuente ocupe todo el ancho si es impar */
  .source-option:last-child:nth-child(odd) {
    grid-column: span 2;
  }

  .day-goal-row { flex-wrap: wrap; }
  .day-goal-select { max-width: 100%; width: 100%; }

  /* Botones del footer del modal alineados en fila horizontal o con buen espaciado */
  .modal-footer {
    display: flex;
    flex-direction: row;
    gap: 10px;
  }
  
  .modal-footer button {
    flex: 1;
    justify-content: center;
    padding: 12px 14px;
  }
}
</style>
<template>
  <HeadingMember>
  <div class="saas-dashboard-wrapper">
    <main class="dashboard-main-container">
      
      <!-- HEADER / CABECERA CON PERFIL ANTROPOMÉTRICO -->
      <section id="tutorial-1" class="glass-card header-card">
        <div class="header-top-row">
          <span class="gym-badge-tag">{{ t.officialCatalog }} • 1,324 {{ t.exercisesLabel }}</span>
          <div id="tutorial-9" class="athlete-counter-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            <span class="counter-num">{{ mySavedRoutines.length }}</span>
            <span class="counter-text">{{ t.savedLabel }}</span>
          </div>
        </div>

        <div class="header-titles">
          <h1 class="main-heading">
            {{ t.mainTitle1 }} <span class="highlight-color">{{ t.mainTitle2 }}</span>
          </h1>
          <p class="hero-desc">{{ t.heroDesc }}</p>
        </div>

        <!-- PANEL DE DATOS ANTROPOMÉTRICOS Y BOTÓN DE CÁLCULO -->
        <div id="tutorial-2" class="anthropometric-panel">
          <div class="panel-title-row">
            <span class="panel-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              {{ t.profileTitle }}
            </span>
            <div class="badges-row" v-if="calculatedIMC">
              <span class="imc-badge">{{ t.imcLabel }}: <strong>{{ calculatedIMC }}</strong> · {{ imcCategory }}</span>
              <span class="somatotype-badge">{{ t.somatotypeLabel }}: <strong>{{ somatotype }}</strong></span>
            </div>
          </div>
          
          <div id="tutorial-3" class="anthropometric-grid">
            <div class="input-group">
              <label>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {{ t.ageLabel }}
              </label>
              <input type="number" v-model.number="userProfile.age" min="10" max="100" class="styled-input" />
            </div>
            <div class="input-group">
              <label>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6.5 6.5h11L21 21H3z"></path><path d="M8.5 6.5a3.5 3.5 0 0 1 7 0"></path></svg>
                {{ t.weightLabel }} (kg)
              </label>
              <input type="number" v-model.number="userProfile.weight" min="30" max="250" class="styled-input" />
            </div>
            <div class="input-group">
              <label>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="2" x2="12" y2="22"></line><polyline points="8 6 12 2 16 6"></polyline><polyline points="8 18 12 22 16 18"></polyline></svg>
                {{ t.heightLabel }} (cm)
              </label>
              <input type="number" v-model.number="userProfile.height" min="100" max="230" class="styled-input" />
            </div>
            <div class="input-group">
              <label>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="5"></circle><path d="M20 21a8 8 0 1 0-16 0"></path></svg>
                {{ t.genderLabel }}
              </label>
              <select v-model="userProfile.gender" class="styled-select">
                <option value="male">{{ t.genderMale }}</option>
                <option value="female">{{ t.genderFemale }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                {{ t.goalLabel }}
              </label>
              <select v-model="userProfile.goal" class="styled-select">
                <option value="hypertrophy">{{ t.goalHypertrophy }}</option>
                <option value="strength">{{ t.goalStrength }}</option>
                <option value="endurance">{{ t.goalEndurance }}</option>
                <option value="fat_loss">{{ t.goalFatLoss }}</option>
              </select>
            </div>
          </div>

          <!-- BOTÓN EXPLÍCITO PARA CALCULAR RUTINAS -->
          <div class="calculate-action-row">
            <button id="tutorial-4" class="btn-calculate-routines" @click="calculateRoutines">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              {{ t.calculateBtnText }}
            </button>
          </div>
        </div>

        <div class="header-divider"></div>

        <!-- FILTROS GENERALES -->
        <div id="tutorial-5" class="filters-toolbar">
          <div class="filter-block">
            <span class="filter-block-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
              {{ t.bodyPartFilterLabel }}
            </span>
            <div class="chip-filter-row">
              <button
                type="button"
                class="filter-chip"
                :class="{ active: activeBodyPartFilter === 'all' }"
                @click="activeBodyPartFilter = 'all'"
              >{{ t.bodyPartAll }}</button>
              <button
                v-for="bp in targetCategoriesKeys"
                :key="bp"
                type="button"
                class="filter-chip"
                :class="{ active: activeBodyPartFilter === bp }"
                @click="activeBodyPartFilter = bp"
              >{{ t.cats[bp] || bp }}</button>
            </div>
          </div>

          <div class="filter-block">
            <span class="filter-block-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
              {{ t.difficultyLabel }}
            </span>
            <div class="chip-filter-row">
              <button
                v-for="opt in levelOptions"
                :key="opt.value"
                type="button"
                class="filter-chip"
                :class="{ active: activeLevel === opt.value }"
                @click="activeLevel = opt.value"
              >{{ opt.label }}</button>
            </div>
          </div>

          <div class="filter-block equipment-block">
            <label for="equipment-select" class="filter-block-title">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
              {{ t.equipmentLabel }}
            </label>
            <div class="select-wrapper">
              <select id="equipment-select" v-model="activeEquipment" class="styled-select">
                <option value="all">{{ t.equipmentAll }}</option>
                <option v-for="eq in equipmentList" :key="eq" :value="eq">
                  {{ eq }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- ESTADO DE ESPERA ANTES DE CALCULAR -->
      <div v-if="!hasCalculated" class="waiting-calculation-box glass-card">
        <div class="waiting-icon-ring">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        </div>
        <h3>{{ t.waitingTitle }}</h3>
        <p>{{ t.waitingDesc }}</p>
        <button class="btn-primary-action" @click="calculateRoutines">{{ t.calculateBtnText }}</button>
      </div>

      <!-- ESTADO DE CARGA -->
      <div v-else-if="loadingExercises" class="loading-state-box glass-card">
        <span class="loading-spinner"></span>
        <p class="hero-desc">{{ t.loadingText }}</p>
      </div>

      <!-- VISTA DINÁMICA SEGMENTADA POR PARTES DEL CUERPO -->
      <div v-else  class="body-parts-container">
        
        <div v-for="catGroup in categorizedRoutines" :key="catGroup.id" class="body-part-section">
          
          <div class="category-section-header">
            <div class="cat-title-wrapper">
              <h2 id="tutorial-6" class="section-category-title">{{ catGroup.name }}</h2>
              <span class="section-count-badge">{{ catGroup.routines.length }} {{ t.resultsLabel }}</span>
            </div>
            <p class="cat-recommendation-note">
              {{ getBodyPartCustomTip(catGroup.id) }}
            </p>
          </div>

          <div v-if="catGroup.routines.length > 0" class="routines-grid">
            <div v-for="(routine, index) in catGroup.routines" :key="routine.id" class="routine-card" :id="index === 0 ? 'tutorial-7' : null">
              
              <div class="card-media">
                <img :src="'/' + routine.image" :alt="routine.name" loading="lazy" @error="(e) => { e.target.src = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'; }">
                <div class="media-overlay"></div>
                
                <div class="badge-container">
                  <span class="badge-level">{{ translateLevel(routine.level) }}</span>
                  <span class="badge-goal">{{ routine.target }}</span>
                </div>

                <div class="media-actions">
                  <button 
                    class="icon-action-btn save-btn" 
                    :class="{ 'is-saved': isRoutineSaved(routine.id) }" 
                    @click="toggleSaveRoutine(routine)">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    {{ isRoutineSaved(routine.id) ? t.savedBtn : t.addBtn }}
                  </button>
                </div>
              </div>

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

                <button id="tutorial-8" class="btn-explore" @click="viewRoutineDetails(routine)">
                  {{ t.viewDetails }}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </div>

            </div>
          </div>

          <div v-else class="empty-category-box">
            <p>{{ t.noResultsCategory }}</p>
          </div>

        </div>

      </div>

      <!-- MODAL AISLADO LLAMADO COMO COMPONENTE EXTERNO -->
      <RoutineDetailModal
        v-if="selectedRoutine"
        :routine="selectedRoutine"
        :isSaved="isRoutineSaved(selectedRoutine.id)"
        :t="t"
        :description="getRoutineDescription(selectedRoutine)"
        :instructionsList="getRoutineInstructionsList(selectedRoutine)"
        :prescribedSets="getPrescribedSets(selectedRoutine)"
        :prescribedReps="getPrescribedReps(selectedRoutine)"
        :prescribedRest="getPrescribedRest(selectedRoutine)"
        :translateLevel="translateLevel"
        @close="selectedRoutine = null"
        @toggle-save="toggleSaveRoutine"
      />

    </main>
  </div>
  </HeadingMember>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useLang } from '../useLang.js';
import RoutineDetailModal from '../Modals/RoutineDetailModal.vue';
import HeadingMember from '../HeadingMember.vue';

const { lang } = useLang();

// PERFIL ANTROPOMÉTRICO
const userProfile = ref({
  age: 28,
  weight: 75,
  height: 175,
  gender: 'male',
  goal: 'hypertrophy'
});

const hasCalculated = ref(false);
const calculationTriggerKey = ref(0);

const calculateRoutines = () => {
  hasCalculated.value = true;
  calculationTriggerKey.value++;
};

const calculatedIMC = computed(() => {
  if (!userProfile.value.height || !userProfile.value.weight) return 0;
  const heightM = userProfile.value.height / 100;
  return (userProfile.value.weight / (heightM * heightM)).toFixed(1);
});

const imcCategory = computed(() => {
  const imc = parseFloat(calculatedIMC.value);
  if (!imc) return '';
  if (imc < 18.5) return lang.value === 'es' ? 'Bajo peso' : 'Underweight';
  if (imc < 25) return lang.value === 'es' ? 'Peso normal' : 'Normal weight';
  if (imc < 30) return lang.value === 'es' ? 'Sobrepeso' : 'Overweight';
  return lang.value === 'es' ? 'Obesidad' : 'Obesity';
});

const somatotype = computed(() => {
  const imc = parseFloat(calculatedIMC.value);
  if (!imc) return '';
  if (imc < 20) return lang.value === 'es' ? 'Ectomorfo (Delgado)' : 'Ectomorph';
  if (imc >= 25) return lang.value === 'es' ? 'Endomorfo (Robusto)' : 'Endomorph';
  return lang.value === 'es' ? 'Mesomorfo (Atlético)' : 'Mesomorph';
});

const traducciones = {
  es: {
    officialCatalog: "Catálogo Oficial",
    exercisesLabel: "Ejercicios",
    savedLabel: "Guardados",
    mainTitle1: "Recomendaciones por",
    mainTitle2: "Parte del Cuerpo",
    heroDesc: "Configura tus datos antropométricos y presiona calcular para obtener tu selección personalizada.",
    profileTitle: "Perfil Antropométrico y Objetivo",
    ageLabel: "Edad",
    weightLabel: "Peso",
    heightLabel: "Altura",
    genderLabel: "Género",
    genderMale: "Masculino",
    genderFemale: "Femenino",
    goalLabel: "Objetivo Principal",
    goalHypertrophy: "Hipertrofia (Volumen)",
    goalStrength: "Fuerza Máxima",
    goalEndurance: "Resistencia",
    goalFatLoss: "Definición / Quema grasa",
    imcLabel: "IMC",
    somatotypeLabel: "Somatotipo",
    calculateBtnText: "Calcular Rutinas Recomendadas",
    waitingTitle: "Esperando cálculo de rutina",
    waitingDesc: "Introduce tus datos y haz clic en calcular para mostrar los ejercicios ideales adaptados a tu perfil.",
    bodyPartFilterLabel: "Zona Corporal",
    bodyPartAll: "Todas las zonas",
    difficultyLabel: "Dificultad",
    levelAll: "Todos",
    levelBeginner: "Principiante",
    levelIntermediate: "Intermedio",
    levelAdvanced: "Avanzado",
    equipmentLabel: "Equipamiento",
    equipmentAll: "Todo el equipo",
    loadingText: "Calculando y sincronizando rutinas según tu tipo de cuerpo...",
    resultsLabel: "ejercicios recomendados",
    noResultsCategory: "No hay ejercicios con los filtros actuales para esta zona.",
    savedBtn: "Guardado",
    addBtn: "Añadir",
    muscleLabel: "Músculo",
    viewDetails: "Ver Detalle Completo",
    targetLabel: "Objetivo",
    bodyPartLabel: "Parte del cuerpo",
    instructionsTitle: "Instrucciones Paso a Paso",
    setsLabel: "Series sugeridas",
    repsLabel: "Repeticiones adaptadas",
    restLabel: "Descanso óptimo",
    removeRoutineBtn: "Quitar de mis rutinas",
    addRoutineBtn: "Añadir a mis rutinas",
    closeBtn: "Cerrar",
    cats: {
      chest: "Pecho (Pectorales)",
      back: "Espalda y Dorsales",
      'upper legs': "Piernas Superiores (Cuádriceps / Glúteos)",
      'upper arms': "Brazos (Bíceps y Tríceps)",
      shoulders: "Hombros (Deltoides)",
      waist: "Cintura y Abdomen",
      'lower legs': "Piernas Inferiores (Pantorrillas)"
    },
    tips: {
      chest: "Ideal para expansión torácica y desarrollo del empuje horizontal.",
      back: "Enfocado en la tracción para mejorar postura y grosor de espalda.",
      'upper legs': "Zona de alta demanda energética; clave para el metabolismo basal.",
      'upper arms': "Trabajo analítico para bombeo y definición de brazos.",
      shoulders: "Proporciona amplitud visual y estabilidad articular.",
      waist: "Fortalecimiento del core para proteger la zona lumbar.",
      'lower legs': "Ejercicios de alta resistencia para soporte de pantorrillas."
    }
  },
  en: {
    officialCatalog: "Official Catalog",
    exercisesLabel: "Exercises",
    savedLabel: "Saved",
    mainTitle1: "Recommendations by",
    mainTitle2: "Body Part",
    heroDesc: "Set your anthropometric data and click calculate to get your customized selection.",
    profileTitle: "Anthropometric Profile & Goal",
    ageLabel: "Age",
    weightLabel: "Weight",
    heightLabel: "Height",
    genderLabel: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    goalLabel: "Main Goal",
    goalHypertrophy: "Hypertrophy (Growth)",
    goalStrength: "Max Strength",
    goalEndurance: "Endurance",
    goalFatLoss: "Fat Loss / Toning",
    imcLabel: "BMI",
    somatotypeLabel: "Somatotype",
    calculateBtnText: "Calculate Recommended Routines",
    waitingTitle: "Waiting for routine calculation",
    waitingDesc: "Enter your data and click calculate to display the ideal exercises tailored to your profile.",
    bodyPartFilterLabel: "Body Zone",
    bodyPartAll: "All Zones",
    difficultyLabel: "Difficulty",
    levelAll: "All",
    levelBeginner: "Beginner",
    levelIntermediate: "Intermediate",
    levelAdvanced: "Advanced",
    equipmentLabel: "Equipment",
    equipmentAll: "All Equipment",
    loadingText: "Calculating and syncing routines based on your body type...",
    resultsLabel: "recommended exercises",
    noResultsCategory: "No exercises match the current filters for this zone.",
    savedBtn: "Saved",
    addBtn: "Add",
    muscleLabel: "Muscle",
    viewDetails: "View Full Details",
    targetLabel: "Target",
    bodyPartLabel: "Body Part",
    instructionsTitle: "Step-by-Step Instructions",
    setsLabel: "Suggested Sets",
    repsLabel: "Adapted Repetitions",
    restLabel: "Optimal Rest",
    removeRoutineBtn: "Remove from routines",
    addRoutineBtn: "Add to routines",
    closeBtn: "Close",
    cats: {
      chest: "Chest (Pectorals)",
      back: "Back & Lats",
      'upper legs': "Upper Legs (Quads / Glutes)",
      'upper arms': "Arms (Biceps & Triceps)",
      shoulders: "Shoulders (Deltoids)",
      waist: "Waist & Abs",
      'lower legs': "Lower Legs (Calves)"
    },
    tips: {
      chest: "Great for chest expansion and horizontal pushing power.",
      back: "Focused on pulling movements to improve posture and thickness.",
      'upper legs': "High energy demand zone; critical for basal metabolism.",
      'upper arms': "Targeted work for arm pump and definition.",
      shoulders: "Provides visual width and joint stability.",
      waist: "Core strengthening to protect the lower back.",
      'lower legs': "High endurance exercises for calf support."
    }
  }
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

const activeEquipment = ref('all');
const activeLevel = ref('Todos');
const activeBodyPartFilter = ref('all');
const selectedRoutine = ref(null);

const levelOptions = computed(() => [
  { value: 'Todos', label: t.value.levelAll },
  { value: 'Principiante', label: t.value.levelBeginner },
  { value: 'Intermedio', label: t.value.levelIntermediate },
  { value: 'Avanzado', label: t.value.levelAdvanced }
]);

const mySavedRoutines = ref([]);
const routineLibrary = ref([]);
const loadingExercises = ref(true);

const equipmentList = [
  'body weight',
  'dumbbell',
  'cable',
  'barbell',
  'leverage machine',
  'band',
  'smith machine',
  'kettlebell',
  'weighted'
];

const targetCategoriesKeys = ['chest', 'back', 'upper legs', 'upper arms', 'shoulders', 'waist', 'lower legs'];

onMounted(async () => {
  try {
    const response = await fetch('/data/exercises.json');
    if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
    const data = await response.json();
    
    routineLibrary.value = data.map((item, index) => {
      let assignedLevel = 'Intermedio';
      if (item.equipment === 'body weight' || index % 3 === 0) assignedLevel = 'Principiante';
      else if (item.equipment === 'barbell' || item.equipment === 'leverage machine' || index % 5 === 0) assignedLevel = 'Avanzado';

      return {
        id: item.id || String(index + 1),
        name: item.name || 'Ejercicio sin nombre',
        category: item.category || 'other',
        body_part: item.body_part || 'general',
        equipment: item.equipment || 'other',
        target: item.target || 'general',
        level: assignedLevel,
        image: item.image || '',
        gif_url: item.gif_url || '',
        instructions: item.instructions || {},
        instruction_steps: item.instruction_steps || {}
      };
    });
  } catch (error) {
    console.error('Error al cargar exercises.json:', error);
  } finally {
    loadingExercises.value = false;
  }
});

const translateLevel = (level) => {
  if (level === 'Principiante') return t.value.levelBeginner;
  if (level === 'Intermedio') return t.value.levelIntermediate;
  if (level === 'Avanzado') return t.value.levelAdvanced;
  return level;
};

const getPrescribedSets = (routine) => {
  const age = userProfile.value.age;
  const goal = userProfile.value.goal;
  
  if (age < 15 || age >= 60) return '2 - 3';
  if (goal === 'strength') return '4 - 5';
  if (routine.category === 'cardio' || routine.category === 'waist') return '3';
  return '3 - 4';
};

const getPrescribedReps = (routine) => {
  const goal = userProfile.value.goal;
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
  const goal = userProfile.value.goal;
  if (goal === 'strength') return '120s - 180s';
  if (goal === 'fat_loss') return '30s - 45s';
  if (routine.category === 'upper legs') return '90s - 120s';
  return '60s - 90s';
};

const getBodyPartCustomTip = (catId) => {
  return t.value.tips[catId] || 'Rutina recomendada para desarrollo equilibrado.';
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

const categorizedRoutines = computed(() => {
  const _trigger = calculationTriggerKey.value;
  const profile = userProfile.value;
  const imc = parseFloat(calculatedIMC.value) || 21;

  const categoriesToProcess = activeBodyPartFilter.value === 'all' 
    ? targetCategoriesKeys 
    : [activeBodyPartFilter.value];

  return categoriesToProcess.map(catKey => {
    const matchingRoutines = routineLibrary.value.filter(routine => {
      const matchesCategory = routine.category === catKey;
      const matchesEquipment = activeEquipment.value === 'all' || routine.equipment === activeEquipment.value;
      const matchesLevel = activeLevel.value === 'Todos' || routine.level === activeLevel.value;

      if (!matchesCategory || !matchesEquipment || !matchesLevel) return false;

      if (profile.age < 16 && routine.equipment === 'barbell' && routine.level === 'Avanzado') {
        return false;
      }

      if (imc < 18.5 && profile.goal === 'fat_loss') {
        if (routine.equipment === 'leverage machine' && routine.level === 'Avanzado') return false;
      }

      return true;
    });

    return {
      id: catKey,
      name: t.value.cats[catKey] || catKey,
      routines: matchingRoutines
    };
  });
});

const isRoutineSaved = (id) => mySavedRoutines.value.includes(id);

const toggleSaveRoutine = (routine) => {
  const index = mySavedRoutines.value.indexOf(routine.id);
  if (index > -1) {
    mySavedRoutines.value.splice(index, 1);
  } else {
    mySavedRoutines.value.push(routine.id);
  }
};

const viewRoutineDetails = (routine) => {
  selectedRoutine.value = routine;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.saas-dashboard-wrapper {
  background: var(--bg-custom, #0a0a0a);
  min-height: 100vh;
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  display: flex;
  flex-direction: column;
}

.dashboard-main-container {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 40px clamp(16px, 3vw, 32px);
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 22px);
  padding: 30px 32px;
  box-shadow: 0 16px 40px rgba(0,0,0,0.45);
  position: relative;
  overflow: hidden;
}

/* ==========================================
   HEADER PRINCIPAL
   ========================================== */
.header-card {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Franja de acento en degradado, misma identidad visual que el resto
   de las tarjetas "hero" de la app. */
.header-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--color-botones, #1c4fd6), #60a5fa, var(--color-botones, #1c4fd6));
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

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

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.main-heading {
  font-family: 'Anton', sans-serif;
  font-size: 2.3rem;
  font-weight: 400;
  margin: 0;
  color: var(--color-titulos, #ffffff);
  letter-spacing: 0.3px;
  line-height: 1.1;
  text-transform: uppercase;
}

.highlight-color { color: var(--color-highlight, #3b82f6); }

.hero-desc {
  font-size: 0.92rem;
  color: rgba(245, 245, 244, 0.6);
  margin: 0;
  font-weight: 500;
  line-height: 1.5;
  max-width: 620px;
}

/* ==========================================
   PANEL ANTROPOMÉTRICO
   ========================================== */
.anthropometric-panel {
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 16px);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.panel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.panel-title {
  font-family: 'Oswald', sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: rgba(245, 245, 244, 0.75);
  display: flex;
  align-items: center;
  gap: 8px;
}
.panel-title svg { color: var(--color-highlight, #3b82f6); }

.badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.imc-badge, .somatotype-badge {
  font-size: 0.72rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  padding: 5px 10px;
  border-radius: 8px;
  font-weight: 500;
}
.imc-badge strong, .somatotype-badge strong { font-weight: 700; }

.somatotype-badge {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.anthropometric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  align-items: flex-end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  min-width: 0;
}

.input-group label {
  font-family: 'Oswald', sans-serif;
  font-size: 0.68rem;
  font-weight: 600;
  color: rgba(245, 245, 244, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.input-group label svg { color: var(--color-highlight, #3b82f6); flex-shrink: 0; }

.styled-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.035);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}

.styled-input:hover { border-color: rgba(59, 130, 246, 0.4); }
.styled-input:focus {
  border-color: var(--color-highlight, #3b82f6);
  background-color: rgba(59, 130, 246, 0.05);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.calculate-action-row {
  display: flex;
  justify-content: flex-end;
}

.btn-calculate-routines {
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  padding: 13px 24px;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.35);
}
.btn-calculate-routines:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.45);
}

.athlete-counter-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 7px 16px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.athlete-counter-pill svg { color: var(--color-highlight, #3b82f6); }
.counter-num { font-family: 'Oswald', sans-serif; font-size: 1rem; font-weight: 700; color: #fff; line-height: 1; }
.counter-text { font-size: 0.68rem; color: rgba(245, 245, 244, 0.55); text-transform: uppercase; font-weight: 600; }

.header-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  width: 100%;
}

/* ==========================================
   FILTROS
   ========================================== */
.filters-toolbar {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.filter-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.filter-block-title {
  font-family: 'Oswald', sans-serif;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(245, 245, 244, 0.55);
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.filter-block-title svg { color: var(--color-highlight, #3b82f6); }

.chip-filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-chip {
  background: rgba(255, 255, 255, 0.035);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: rgba(245, 245, 244, 0.7);
  padding: 8px 15px;
  border-radius: 50px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
}
.filter-chip:hover {
  border-color: rgba(59, 130, 246, 0.5);
  color: #fff;
  transform: translateY(-1px);
}
.filter-chip.active {
  background: var(--color-botones, #1c4fd6);
  border-color: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, #fff);
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.35);
}

.equipment-block { max-width: 320px; }

.select-wrapper {
  position: relative;
  width: 100%;
}

.styled-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.035);
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 11px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  appearance: none;
  box-sizing: border-box;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.364%22%20height%3D%22292.364%22%3E%3Cpath%20fill%3D%22%2360a5fa%22%20d%3D%22M287.9 69.8c-4.3-4.3-11.3-4.3-15.6 0L146.1 195.8 20 69.8c-4.3-4.3-11.3-4.3-15.6 0s-4.3 11.3 0 15.6l133.4 133.4c4.3 4.3 11.3 4.3 15.6 0l133.5-133.4c4.3-4.3 4.3-11.3 0-15.6z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 14px center;
  background-size: 9px auto;
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.styled-select:hover, .styled-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  background-color: rgba(59, 130, 246, 0.05);
}

.styled-select option {
  background: #141414;
  color: #fff;
  padding: 10px;
}

/* ==========================================
   ESTADOS DE ESPERA / CARGA
   ========================================== */
.waiting-calculation-box {
  text-align: center;
  padding: 60px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  color: rgba(245, 245, 244, 0.6);
}
.waiting-icon-ring {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.25);
  color: var(--color-highlight, #3b82f6);
}
.waiting-calculation-box h3 { margin: 0; color: #fff; font-family: 'Anton', sans-serif; font-size: 1.4rem; text-transform: uppercase; letter-spacing: 0.3px; }
.waiting-calculation-box p { margin: 0; font-size: 0.88rem; max-width: 420px; line-height: 1.5; }

.loading-state-box {
  padding: 50px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}
.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid rgba(59, 130, 246, 0.2);
  border-top-color: var(--color-highlight, #3b82f6);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary-action {
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  padding: 13px 24px;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: filter 0.2s ease, transform 0.15s ease, box-shadow 0.15s ease;
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.35);
}
.btn-primary-action:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(59, 130, 246, 0.45);
}

/* ==========================================
   SECCIONES POR PARTE DEL CUERPO
   ========================================== */
.body-parts-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.body-part-section {
  display: flex;
  flex-direction: column;
  gap: 18px;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 24px;
  border-radius: var(--app-border-radius, 22px);
}

.category-section-header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 14px;
}

.cat-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.section-category-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  margin: 0;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-category-title::before {
  content: '';
  width: 4px;
  height: 20px;
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
  border: 1px solid rgba(59, 130, 246, 0.25);
  white-space: nowrap;
}

.cat-recommendation-note {
  font-size: 0.8rem;
  color: rgba(245, 245, 244, 0.5);
  margin: 0;
  line-height: 1.5;
}

.routines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 20px;
}

/* ==========================================
   TARJETA DE RUTINA
   ========================================== */
.routine-card {
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 18px);
  overflow: hidden;
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  display: flex;
  flex-direction: column;
  transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
  box-shadow: 0 8px 24px rgba(0,0,0,0.3);
}

.routine-card:hover {
  border-color: var(--color-highlight, #3b82f6);
  transform: translateY(-4px);
  box-shadow: 0 16px 34px rgba(0,0,0,0.45);
}

.card-media {
  position: relative;
  height: 180px;
  width: 100%;
  overflow: hidden;
  background: #050505;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 14px;
  transition: transform 0.35s ease;
}
.routine-card:hover .card-media img { transform: scale(1.04); }

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, transparent 45%, rgba(18,18,18,0.9) 100%);
  pointer-events: none;
}

.badge-container {
  position: absolute;
  top: 12px;
  left: 12px;
  display: flex;
  gap: 6px;
  z-index: 2;
  flex-wrap: wrap;
}

.badge-level, .badge-goal {
  font-family: 'Oswald', sans-serif;
  font-size: 0.62rem;
  font-weight: 700;
  padding: 4px 9px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-level { background: var(--color-botones, #3b82f6); color: var(--color-texto-botones, #fff); }
.badge-goal { background: rgba(0, 0, 0, 0.75); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.12); }

.media-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
}

.icon-action-btn {
  background: rgba(0, 0, 0, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #fff;
  padding: 6px 11px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.15s ease;
}
.icon-action-btn:hover { background: rgba(59, 130, 246, 0.85); transform: translateY(-1px); }
.icon-action-btn.is-saved { background: #10b981; border-color: #10b981; }

.card-body {
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.card-title-routine {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.15rem;
  color: var(--color-titulos, #ffffff);
  line-height: 1.3;
}

.routine-desc {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(245, 245, 244, 0.55);
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.quick-prescription-pill {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(59, 130, 246, 0.06);
  border: 1px solid rgba(59, 130, 246, 0.18);
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 0.75rem;
  color: var(--color-highlight, #60a5fa);
}

.pill-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pill-item svg { color: var(--color-highlight, #60a5fa); flex-shrink: 0; }
.pill-divider {
  width: 1px;
  height: 16px;
  background: rgba(59, 130, 246, 0.25);
  flex-shrink: 0;
}

.routine-stats {
  display: flex;
  gap: 10px;
  font-size: 0.74rem;
  color: rgba(245, 245, 244, 0.6);
  background: rgba(255, 255, 255, 0.02);
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.04);
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
.btn-explore:hover {
  filter: brightness(1.08);
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(59, 130, 246, 0.35);
}

.empty-category-box {
  padding: 28px;
  text-align: center;
  background: rgba(255, 255, 255, 0.015);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: rgba(245, 245, 244, 0.4);
  font-size: 0.85rem;
}

/* ==========================================
   RESPONSIVE
   ========================================== */
@media (max-width: 900px) {
  .anthropometric-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .dashboard-main-container { padding: 20px 14px; gap: 28px; }
  .glass-card { padding: 22px 18px; }
  .main-heading { font-size: 1.7rem; }
  .hero-desc { font-size: 0.85rem; }
  .anthropometric-panel { padding: 16px; }
  .anthropometric-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
  .calculate-action-row { justify-content: stretch; }
  .btn-calculate-routines { width: 100%; justify-content: center; }
  .filters-toolbar { gap: 16px; }
  .equipment-block { max-width: 100%; }
  .body-part-section { padding: 16px; }
  .section-category-title { font-size: 1.15rem; }
  .routines-grid { grid-template-columns: 1fr; gap: 16px; }
  .header-top-row { flex-direction: column; align-items: flex-start; gap: 10px; }
}

@media (max-width: 480px) {
  .anthropometric-grid { grid-template-columns: 1fr; }
}
</style>
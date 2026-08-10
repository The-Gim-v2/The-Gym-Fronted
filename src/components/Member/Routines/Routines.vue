<template>
  <HeadingMember>
  <div class="saas-dashboard-wrapper">
    <main class="dashboard-main-container">
      
      <!-- HEADER / CABECERA CON PERFIL ANTROPOMÉTRICO -->
      <section id="tutorial-1" class="glass-card header-card">
        <div class="header-top-row">
          <span class="gym-badge-tag">{{ t.officialCatalog }} • 1,324 {{ t.exercisesLabel }}</span>
          <div id="tutorial-9" class="athlete-counter-pill">
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
            <span class="panel-title">{{ t.profileTitle }}</span>
            <div class="badges-row" v-if="calculatedIMC">
              <span class="imc-badge">{{ t.imcLabel }}: {{ calculatedIMC }} ({{ imcCategory }})</span>
              <span class="somatotype-badge">{{ t.somatotypeLabel }}: {{ somatotype }}</span>
            </div>
          </div>
          
          <div id="tutorial-3" class="anthropometric-grid">
            <div class="input-group">
              <label>{{ t.ageLabel }}</label>
              <input type="number" v-model.number="userProfile.age" min="10" max="100" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.weightLabel }} (kg)</label>
              <input type="number" v-model.number="userProfile.weight" min="30" max="250" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.heightLabel }} (cm)</label>
              <input type="number" v-model.number="userProfile.height" min="100" max="230" class="styled-input" />
            </div>
            <div class="input-group">
              <label>{{ t.genderLabel }}</label>
              <select v-model="userProfile.gender" class="styled-select">
                <option value="male">{{ t.genderMale }}</option>
                <option value="female">{{ t.genderFemale }}</option>
              </select>
            </div>
            <div class="input-group">
              <label>{{ t.goalLabel }}</label>
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
        <div id="tutorial-5" class="filters-toolbar-grid">
          <div class="filter-field">
            <label for="bodypart-select" class="filter-group-title">{{ t.bodyPartFilterLabel }}</label>
            <div class="select-wrapper">
              <select id="bodypart-select" v-model="activeBodyPartFilter" class="styled-select">
                <option value="all">{{ t.bodyPartAll }}</option>
                <option v-for="bp in targetCategoriesKeys" :key="bp" :value="bp">
                  {{ t.cats[bp] || bp }}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-field">
            <label for="level-select" class="filter-group-title">{{ t.difficultyLabel }}</label>
            <div class="select-wrapper">
              <select id="level-select" v-model="activeLevel" class="styled-select">
                <option value="Todos">{{ t.levelAll }}</option>
                <option value="Principiante">{{ t.levelBeginner }}</option>
                <option value="Intermedio">{{ t.levelIntermediate }}</option>
                <option value="Avanzado">{{ t.levelAdvanced }}</option>
              </select>
            </div>
          </div>

          <div class="filter-field">
            <label for="equipment-select" class="filter-group-title">{{ t.equipmentLabel }}</label>
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
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <h3>{{ t.waitingTitle }}</h3>
        <p>{{ t.waitingDesc }}</p>
        <button class="btn-primary-action" @click="calculateRoutines">{{ t.calculateBtnText }}</button>
      </div>

      <!-- ESTADO DE CARGA -->
      <div v-else-if="loadingExercises" class="loading-state-box glass-card">
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
                  {{ t.viewDetails }} &rarr;
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
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;700&display=swap');

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
  padding: 36px 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--app-border-radius, 20px);
  padding: 24px 28px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.header-card {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.header-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.gym-badge-tag {
  font-size: 0.65rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: var(--color-highlight, #60a5fa);
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-titles {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.main-heading {
  font-family: 'Archivo Black', sans-serif;
  font-size: 1.65rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-titulos, #ffffff);
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.highlight-color { color: var(--color-highlight, #3b82f6); }

.hero-desc {
  font-size: 0.85rem;
  color: rgba(245, 245, 244, 0.6);
  margin: 0;
  font-weight: 500;
  line-height: 1.4;
}

.anthropometric-panel {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.panel-title-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.panel-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(245, 245, 244, 0.7);
}

.badges-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.imc-badge, .somatotype-badge {
  font-size: 0.7rem;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.somatotype-badge {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.3);
  color: #60a5fa;
}

.anthropometric-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  align-items: flex-end;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 100%;
}

.input-group label {
  font-size: 0.65rem;
  font-weight: 600;
  color: rgba(245, 245, 244, 0.5);
  text-transform: uppercase;
}

.styled-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  outline: none;
  box-sizing: border-box;
  transition: all 0.2s;
}

.styled-input:hover, .styled-input:focus {
  border-color: var(--color-highlight, #3b82f6);
  background-color: rgba(59, 130, 246, 0.04);
}

.calculate-action-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
}

.btn-calculate-routines {
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-calculate-routines:hover { opacity: 0.9; }

.athlete-counter-pill {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 6px 14px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}
.counter-num { font-family: 'Oswald', sans-serif; font-size: 1.1rem; font-weight: 700; color: #fff; line-height: 1.1; }
.counter-text { font-size: 0.55rem; color: rgba(245, 245, 244, 0.5); text-transform: uppercase; font-weight: 600; }

.header-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  width: 100%;
}

.filters-toolbar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.filter-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group-title {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  color: rgba(245, 245, 244, 0.5);
  letter-spacing: 0.5px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.styled-select {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  appearance: none;
  box-sizing: border-box;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.364%22%20height%3D%22292.364%22%3E%3Cpath%20fill%3D%22%2360a5fa%22%20d%3D%22M287.9 69.8c-4.3-4.3-11.3-4.3-15.6 0L146.1 195.8 20 69.8c-4.3-4.3-11.3-4.3-15.6 0s-4.3 11.3 0 15.6l133.4 133.4c4.3 4.3 11.3 4.3 15.6 0l133.5-133.4c4.3-4.3 4.3-11.3 0-15.6z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 8px auto;
  transition: all 0.2s;
}

.styled-select:hover, .styled-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  background-color: rgba(59, 130, 246, 0.04);
}

.styled-select option {
  background: #141414;
  color: #fff;
  padding: 10px;
}

.waiting-calculation-box {
  text-align: center;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: rgba(245, 245, 244, 0.6);
}
.waiting-calculation-box svg { color: var(--color-highlight, #3b82f6); }
.waiting-calculation-box h3 { margin: 0; color: #fff; font-family: 'Oswald', sans-serif; font-size: 1.3rem; }
.waiting-calculation-box p { margin: 0; font-size: 0.85rem; max-width: 400px; }

.body-parts-container {
  display: flex;
  flex-direction: column;
  gap: 36px;
}

.body-part-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: rgba(255, 255, 255, 0.01);
  border: 1px solid rgba(255, 255, 255, 0.04);
  padding: 20px;
  border-radius: 20px;
}

.category-section-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 10px;
}

.cat-title-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-category-title {
  font-family: 'Oswald', sans-serif;
  font-size: 1.3rem;
  margin: 0;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.section-count-badge {
  font-size: 0.72rem;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-highlight, #60a5fa);
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.cat-recommendation-note {
  font-size: 0.75rem;
  color: rgba(245, 245, 244, 0.45);
  margin: 0;
}

.routines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.routine-card {
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 16px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  box-shadow: 0 6px 20px rgba(0,0,0,0.3);
}

.routine-card:hover {
  border-color: var(--color-highlight, #3b82f6);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
}

.card-media {
  position: relative;
  height: 160px;
  width: 100%;
  overflow: hidden;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(18,18,18,0.85) 100%);
  pointer-events: none;
}

.badge-container {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
  z-index: 2;
}

.badge-level, .badge-goal {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-level { background: var(--color-botones, #3b82f6); color: #fff; }
.badge-goal { background: rgba(0, 0, 0, 0.7); color: #e2e8f0; border: 1px solid rgba(255, 255, 255, 0.1); }

.media-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.icon-action-btn {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: background 0.2s;
}
.icon-action-btn:hover { background: rgba(59, 130, 246, 0.8); }
.icon-action-btn.is-saved { background: #10b981; border-color: #10b981; }

.card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex-grow: 1;
}

.card-title-routine {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  color: var(--color-titulos, #ffffff);
}

.routine-desc {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(245, 245, 244, 0.55);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.quick-prescription-pill {
  display: flex;
  justify-content: space-between;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.15);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.72rem;
  color: var(--color-highlight, #60a5fa);
}

.pill-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.pill-item svg { color: var(--color-highlight, #60a5fa); }

.routine-stats {
  display: flex;
  gap: 10px;
  font-size: 0.72rem;
  color: rgba(245, 245, 244, 0.6);
  background: rgba(0, 0, 0, 0.2);
  padding: 6px 10px;
  border-radius: 8px;
}

.stat-item { display: flex; align-items: center; gap: 6px; }
.stat-item svg { color: var(--color-highlight, #3b82f6); }

.btn-explore {
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.75rem;
  cursor: pointer;
  margin-top: 2px;
  transition: opacity 0.2s;
}
.btn-explore:hover { opacity: 0.9; }

.empty-category-box {
  padding: 20px;
  text-align: center;
  background: rgba(255, 255, 255, 0.01);
  border-radius: 12px;
  color: rgba(245, 245, 244, 0.35);
  font-size: 0.8rem;
}

.loading-state-box {
  padding: 40px;
  text-align: center;
}

.btn-primary-action {
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  padding: 11px 20px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.82rem;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary-action:hover { opacity: 0.9; }

@media (max-width: 900px) {
  .anthropometric-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 768px) {
  .dashboard-main-container { padding: 16px 12px; }
  .glass-card { padding: 18px 16px; }
  .main-heading { font-size: 1.45rem; }
  .anthropometric-grid { grid-template-columns: 1fr; }
  .filters-toolbar-grid { grid-template-columns: 1fr; gap: 12px; }
}
</style>
<template>
  <HeadingMember :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="saas-dashboard-wrapper">
      <main class="dashboard-main-container">
        
        <!-- HERO / HEADER DEL ATLETA -->
        <section class="hero-metrics-grid">
          <div class="glass-card gym-identity-box">
            <div class="gym-header-top">
              <span class="gym-badge-tag">Portal del Atleta • Biblioteca de Entrenamiento</span>
              
              <div class="header-status-controls">
                <div class="gym-status-toggle" :class="isGymOpen ? 'status-open' : 'status-closed'">
                  <span class="toggle-dot" :class="isGymOpen ? 'dot-open' : 'dot-closed'"></span>
                  {{ isGymOpen ? 'Gimnasio Abierto' : 'Gimnasio Cerrado' }}
                </div>
              </div>
            </div>

            <div class="gym-titles-container-flex">
              <div>
                <h1 class="main-heading">
                  Catálogo de <span class="highlight-color">Ejercicios</span>
                </h1>
                <p class="hero-desc">Explora la base de datos completa de movimientos, añádelos a tu perfil y entrena a tu propio ritmo.</p>
              </div>
              <div class="athlete-counter-pill">
                <span class="counter-num">{{ mySavedRoutines.length }}</span>
                <span class="counter-text">Guardados</span>
              </div>
            </div>
          </div>

          <!-- FILTROS RÁPIDOS DE NIVEL -->
          <div class="metrics-card-group filter-group-box">
            <div 
              class="level-select-card" 
              v-for="lvl in levels" 
              :key="lvl" 
              @click="activeLevel = lvl" 
              :class="{ active: activeLevel === lvl }">
              <span class="metric-number text-highlight">{{ lvl }}</span>
              <span class="metric-label">Nivel</span>
            </div>
          </div>
        </section>

        <!-- FILTROS DE CATEGORÍAS (CHIPS) -->
        <div class="categories-scroll-container">
          <button 
            v-for="cat in categories" 
            :key="cat.id" 
            :class="['category-chip', { active: activeCategory === cat.id }]"
            @click="activeCategory = cat.id">
            {{ cat.name }}
          </button>
        </div>

        <!-- ESTADO DE CARGA -->
        <div v-if="loadingExercises" class="loading-state-box">
          <p class="hero-desc">Cargando biblioteca masiva de ejercicios...</p>
        </div>

        <!-- GRID DE RUTINAS / EJERCICIOS -->
        <div v-else class="routines-grid">
          <div v-for="routine in filteredRoutines" :key="routine.id" class="routine-card">
            
            <!-- Media / Imagen o GIF -->
            <div class="card-media">
              <img :src="routine.image" :alt="routine.title" loading="lazy" @error="handleImageError">
              <div class="media-overlay"></div>
              
              <div class="badge-container">
                <span class="badge-level intermedio">Pro</span>
                <span class="badge-goal">{{ routine.goal }}</span>
              </div>

              <div class="media-actions">
                <button 
                  class="icon-action-btn save-btn" 
                  :class="{ 'is-saved': isRoutineSaved(routine.id) }" 
                  @click="toggleSaveRoutine(routine)" 
                  :title="isRoutineSaved(routine.id) ? 'Guardado en tus rutinas' : 'Añadir a mis rutinas'">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  {{ isRoutineSaved(routine.id) ? 'En mi Perfil' : 'Añadir' }}
                </button>
              </div>
            </div>

            <!-- Contenido de la Tarjeta -->
            <div class="card-body">
              <h3 class="card-title-routine">{{ routine.title }}</h3>
              <p class="routine-desc">{{ routine.description }}</p>

              <!-- Equipo -->
              <div class="card-section-row">
                <span class="section-label">Equipo necesario</span>
                <div class="equipment-icons">
                  <span v-for="(eq, index) in routine.equipment" :key="index" class="eq-pill">
                    {{ eq }}
                  </span>
                </div>
              </div>

              <!-- Estadísticas -->
              <div class="routine-stats">
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{{ routine.duration }}</span>
                </div>
                <div class="stat-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>
                  <span>{{ routine.exercises.length }} paso(s)</span>
                </div>
              </div>

              <!-- Botón de Ver Completa -->
              <button class="btn-explore" @click="viewRoutineDetails(routine)">
                Ver Detalle Completo &rarr;
              </button>
            </div>

          </div>
        </div>

        <!-- MODAL: VER DETALLE DE LA RUTINA -->
        <div class="modal-backdrop" v-if="selectedRoutine" @click.self="selectedRoutine = null">
          <div class="modal-content glass-card">
            <div class="modal-header">
              <div>
                <span class="badge-level intermedio">Ejercicio</span>
                <h2>{{ selectedRoutine.title }}</h2>
              </div>
              <button class="close-btn" @click="selectedRoutine = null">&times;</button>
            </div>
            
            <div class="modal-media-preview" v-if="selectedRoutine.image">
              <img :src="selectedRoutine.image" :alt="selectedRoutine.title" class="modal-gif">
            </div>

            <p class="modal-desc">{{ selectedRoutine.description }}</p>
            
            <div class="modal-meta-box">
              <div><strong>Enfoque:</strong> {{ selectedRoutine.goal }}</div>
              <div><strong>Equipo:</strong> {{ selectedRoutine.equipment.join(', ') }}</div>
            </div>

            <h3 class="exercises-title">Instrucciones Paso a Paso</h3>
            <div class="exercises-list">
              <div v-for="(ex, idx) in selectedRoutine.exercises" :key="idx" class="exercise-item">
                <div class="ex-number">{{ idx + 1 }}</div>
                <div class="ex-info">
                  <h4>Paso {{ idx + 1 }}</h4>
                  <span>{{ ex.name }}</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button 
                class="btn-primary-action" 
                @click="toggleSaveRoutine(selectedRoutine)">
                {{ isRoutineSaved(selectedRoutine.id) ? 'Quitar de mis rutinas' : 'Añadir a mi rutina personal' }}
              </button>
              <button class="btn-secondary" @click="selectedRoutine = null">Cerrar</button>
            </div>
          </div>
        </div>

      </main>
    </div>
  </HeadingMember>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import HeadingMember from '../HeadingMember.vue'; // Ajusta la ruta relativa a tu componente HeadingMember si es necesario

const isGymOpen = ref(true);
const billingStatus = ref('active');

const activeCategory = ref('all');
const activeLevel = ref('Todos');
const selectedRoutine = ref(null);

const mySavedRoutines = ref([]);
const routineLibrary = ref([]);
const loadingExercises = ref(true);

const categories = [
  { id: 'all', name: 'Todas' },
  { id: 'strength', name: 'Fuerza' },
  { id: 'fullbody', name: 'Cuerpo Completo' },
  { id: 'home', name: 'En Casa' }
];

const levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

onMounted(async () => {
  try {
    // CORREGIDO: Apunta directo a la carpeta data dentro de public
    const response = await fetch('/data/exercises.json');
    if (!response.ok) throw new Error('No se pudo cargar el archivo JSON');
    
    const data = await response.json();
    
    routineLibrary.value = data.map((item, index) => {
      // Tomar la primera imagen de la carpeta public/images
      let imgPath = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800';
      if (item.images && item.images.length > 0) {
        imgPath = `/images/${item.images[0]}`;
      }

      return {
        id: index + 1,
        title: item.name || 'Ejercicio sin nombre',
        category: mapCategory(item.category, item.equipment),
        level: 'Intermedio',
        goal: item.primaryMuscles && item.primaryMuscles.length > 0 ? item.primaryMuscles.join(', ') : 'General',
        description: item.instructions && item.instructions.length > 0 ? item.instructions.join(' ') : 'Realiza el movimiento de forma controlada manteniendo una técnica adecuada.',
        duration: '15 mins',
        equipment: item.equipment ? [item.equipment] : ['Corporal'],
        image: imgPath,
        exercises: item.instructions && item.instructions.length > 0
          ? item.instructions.map(step => ({ name: step })) 
          : [{ name: 'Mantén la postura correcta durante todo el ejercicio.' }]
      };
    });
  } catch (error) {
    console.error('Error al cargar exercises.json:', error);
  } finally {
    loadingExercises.value = false;
  }
});

function mapCategory(cat, eq) {
  if (eq && typeof eq === 'string' && eq.toLowerCase().includes('body weight')) return 'home';
  if (cat && typeof cat === 'string' && cat.toLowerCase().includes('strength')) return 'strength';
  return 'fullbody';
}

const filteredRoutines = computed(() => {
  return routineLibrary.value.filter(routine => {
    const matchesCategory = activeCategory.value === 'all' || routine.category === activeCategory.value;
    const matchesLevel = activeLevel.value === 'Todos' || routine.level === activeLevel.value;
    return matchesCategory && matchesLevel;
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
  background: var(--bg-custom, var(--color-interfaz, #0a0a0a));
  min-height: calc(100vh - 65px);
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
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.hero-metrics-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 20px;
  align-items: stretch;
}

.glass-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 20px);
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gym-header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 12px;
}

.gym-badge-tag {
  font-size: 0.7rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-status-controls { display: flex; align-items: center; gap: 10px; }

.gym-status-toggle {
  display: flex; align-items: center; gap: 8px; padding: 6px 14px;
  border-radius: 20px; font-size: 0.75rem; font-weight: 600;
  border: 1px solid;
}
.gym-status-toggle.status-open { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #34d399; }
.gym-status-toggle.status-closed { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; }
.toggle-dot { width: 6px; height: 6px; border-radius: 50%; }
.dot-open { background: #10b981; box-shadow: 0 0 8px #10b981; }

.gym-titles-container-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.main-heading {
  font-family: 'Archivo Black', sans-serif;
  font-size: 2.2rem;
  font-weight: 800;
  margin: 0;
  color: var(--color-titulos, #ffffff);
  letter-spacing: -1px;
}

.highlight-color { color: var(--color-highlight, #3b82f6); }
.text-highlight { color: var(--color-highlight, #3b82f6); }

.hero-desc {
  font-size: 0.95rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.6));
  margin: 8px 0 0 0;
  font-weight: 500;
}

.athlete-counter-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 18px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.counter-num { font-family: 'Oswald', sans-serif; font-size: 1.4rem; font-weight: 700; color: #fff; }
.counter-text { font-size: 0.65rem; color: rgba(245, 245, 244, 0.5); text-transform: uppercase; font-weight: 600; }

.btn-primary-action {
  background: var(--color-highlight, #3b82f6);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: opacity 0.2s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}
.btn-primary-action:hover { opacity: 0.9; }

.btn-secondary {
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }

/* FILTROS NIVELES */
.filter-group-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.level-select-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 16px);
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.level-select-card:hover, .level-select-card.active {
  border-color: var(--color-highlight, #3b82f6);
  background: rgba(59, 130, 246, 0.05);
}

.metric-number {
  font-family: 'Oswald', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-titulos, #ffffff);
}

.metric-label {
  font-size: 0.6rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.55));
  margin-top: 2px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* CHIPS CATEGORÍAS */
.categories-scroll-container {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.categories-scroll-container::-webkit-scrollbar { display: none; }

.category-chip {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: var(--color-texto-general, rgba(245, 245, 244, 0.7));
  padding: 10px 18px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.85rem;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}
.category-chip:hover { border-color: rgba(255, 255, 255, 0.2); color: #fff; }
.category-chip.active {
  background: var(--color-highlight, #3b82f6);
  border-color: var(--color-highlight, #3b82f6);
  color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.loading-state-box {
  padding: 40px;
  text-align: center;
  background: var(--bg-cards, #121212);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.09);
}

/* GRID DE RUTINAS */
.routines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.routine-card {
  background: var(--bg-cards, #121212);
  border-radius: var(--app-border-radius, 18px);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.09);
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.routine-card:hover {
  border-color: var(--color-highlight, #3b82f6);
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(0,0,0,0.5);
}

.card-media {
  position: relative;
  height: 180px;
  width: 100%;
  overflow: hidden;
  background: #000;
}

.card-media img { width: 100%; height: 100%; object-fit: contain; }

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(18,18,18,0.9) 100%);
  pointer-events: none;
}

.badge-container {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 6px;
}

.badge-level, .badge-goal {
  font-size: 0.6rem;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.badge-level.intermedio { background: #3b82f6; color: #fff; }

.badge-goal {
  background: rgba(0, 0, 0, 0.7);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.media-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 6px;
}

.icon-action-btn {
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  padding: 6px 10px;
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
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex-grow: 1;
}

.card-title-routine {
  margin: 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.25rem;
  color: var(--color-titulos, #ffffff);
}

.routine-desc {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.55));
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-section-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.section-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: rgba(245, 245, 244, 0.4);
  text-transform: uppercase;
}

.equipment-icons { display: flex; gap: 4px; }
.eq-pill {
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  color: rgba(245, 245, 244, 0.8);
}

.routine-stats {
  display: flex;
  gap: 12px;
  font-size: 0.75rem;
  color: rgba(245, 245, 244, 0.6);
  background: rgba(0, 0, 0, 0.2);
  padding: 8px 12px;
  border-radius: 8px;
}

.stat-item { display: flex; align-items: center; gap: 6px; }
.stat-item svg { color: var(--color-highlight, #3b82f6); }

.btn-explore {
  background: var(--color-highlight, #3b82f6);
  color: white;
  border: none;
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  margin-top: 4px;
  transition: opacity 0.2s;
}
.btn-explore:hover { opacity: 0.9; }

/* MODALS */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  background: #141414 !important;
  border: 1px solid rgba(255, 255, 255, 0.15) !important;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}

.modal-header h2 {
  margin: 6px 0 0 0;
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem;
  color: #fff;
}

.close-btn {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.8rem;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.modal-media-preview {
  width: 100%;
  height: 220px;
  background: #000;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

.modal-gif {
  height: 100%;
  object-fit: contain;
}

.modal-desc {
  font-size: 0.9rem;
  color: rgba(245, 245, 244, 0.7);
  margin-bottom: 16px;
  line-height: 1.5;
}

.modal-meta-box {
  display: flex;
  gap: 20px;
  background: rgba(255, 255, 255, 0.03);
  padding: 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 20px;
}

.exercises-title {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--color-highlight, #3b82f6);
}

.exercises-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 24px;
}

.exercise-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 10px 14px;
  border-radius: 10px;
}

.ex-number {
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  font-weight: 700;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  flex-shrink: 0;
}

.ex-info h4 { margin: 0 0 2px 0; font-size: 0.9rem; color: #fff; }
.ex-info span { font-size: 0.75rem; color: rgba(245, 245, 244, 0.5); line-height: 1.4; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 16px;
}

@media (max-width: 1024px) {
  .hero-metrics-grid { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .dashboard-main-container { padding: 14px; }
  .filter-group-box { grid-template-columns: repeat(2, 1fr); }
}
</style>
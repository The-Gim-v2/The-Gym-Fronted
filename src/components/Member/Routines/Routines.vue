<template>
  <HeadingMember :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="saas-dashboard-wrapper">
      <main class="dashboard-main-container">
        
        <!-- HERO / BIENVENIDA UNIFICADO -->
        <section class="hero-metrics-grid">
          <div class="glass-card gym-identity-box">
            <div class="gym-header-top">
              <span class="gym-badge-tag">Catálogo Profesional</span>
              
              <div class="header-status-controls">
                <div class="gym-status-toggle" :class="isGymOpen ? 'status-open' : 'status-closed'">
                  <span class="toggle-dot" :class="isGymOpen ? 'dot-open' : 'dot-closed'"></span>
                  {{ isGymOpen ? 'Gimnasio Abierto' : 'Gimnasio Cerrado' }}
                </div>

                <div class="billing-status-badge" :class="billingStatus">
                  <span class="billing-dot" :class="billingStatus"></span>
                  {{ billingStatusText }}
                </div>
              </div>
            </div>

            <div class="gym-titles-container">
              <h1 class="main-heading">
                Planes de <span class="highlight-color">Entrenamiento</span>
              </h1>
              <p class="hero-desc">Selecciona una categoría o explora rutinas integrales de todo el cuerpo diseñadas para potenciar tus resultados.</p>
            </div>
          </div>

          <!-- FILTROS RÁPIDOS SUPERIORES / NIVELES -->
          <div class="metrics-card-group filter-group-box">
            <div class="level-select-card" v-for="lvl in levels" :key="lvl" @click="activeLevel = lvl" :class="{ active: activeLevel === lvl }">
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

        <!-- GRID DE RUTINAS CON ESTILOS GLOBALES -->
        <div class="routines-grid">
          <div v-for="routine in filteredRoutines" :key="routine.id" class="routine-card">
            
            <!-- Media / Imagen -->
            <div class="card-media">
              <img :src="routine.image" :alt="routine.title" loading="lazy">
              <div class="media-overlay"></div>
              
              <div class="badge-container">
                <span class="badge-level" :class="routine.level.toLowerCase()">{{ routine.level }}</span>
                <span class="badge-goal">{{ routine.goal }}</span>
              </div>

              <div class="media-actions">
                <button class="icon-action-btn" @click="shareRoutine(routine)" title="Compartir">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                  Share
                </button>
                <button class="icon-action-btn save-btn" @click="saveRoutine(routine)" title="Guardar rutina">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                </button>
              </div>
            </div>

            <!-- Contenido de la Tarjeta -->
            <div class="card-body">
              <h3 class="card-title-routine">{{ routine.title }}</h3>
              <p class="routine-desc">{{ routine.description }}</p>

              <!-- Equipo -->
              <div class="card-section-row">
                <span class="section-label">Equipo</span>
                <div class="equipment-icons">
                  <span v-for="(eq, index) in routine.equipment" :key="index" class="eq-pill">
                    {{ eq }}
                  </span>
                </div>
              </div>

              <!-- Enfoque Muscular -->
              <div class="card-section-row muscle-map-row">
                <span class="section-label">Enfoque Muscular</span>
                <div class="muscle-images-preview">
                  <img :src="routine.muscleAnatomyFront" alt="Anatomía Frontal" />
                  <img :src="routine.muscleAnatomyBack" alt="Anatomía Posterior" />
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
                  <span>{{ routine.exercisesCount }} ejercicios</span>
                </div>
              </div>

              <!-- Botón de Acción -->
              <button class="btn-explore" @click="viewRoutineDetails(routine)">
                Ver Rutina Completa &rarr;
              </button>
            </div>

          </div>
        </div>

      </main>
    </div>
  </HeadingMember>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HeadingMember from '../HeadingMember.vue';

const isGymOpen = ref(true);
const billingStatus = ref('active');
const billingStatusText = computed(() => billingStatus.value === 'active' ? 'Cuenta Activa' : 'Revisión');

const activeCategory = ref('all');
const activeLevel = ref('Todos');

const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'fullbody', name: 'Cuerpo Completo' },
  { id: 'strength', name: 'Fuerza Pura' },
  { id: 'hypertrophy', name: 'Hipertrofia' },
  { id: 'home', name: 'En Casa' }
];

const levels = ['Todos', 'Principiante', 'Intermedio', 'Avanzado'];

const routineLibrary = ref([
  {
    id: 1,
    title: 'Full-Body Base & Core',
    category: 'fullbody',
    level: 'Principiante',
    goal: 'Ganar masa muscular',
    description: 'Entrenamiento integral de cuerpo completo con enfoque en patrones de movimiento fundamentales.',
    duration: '45 mins',
    exercisesCount: 6,
    equipment: ['Mancuernas', 'Peso Corporal'],
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800',
    muscleAnatomyFront: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=100',
    muscleAnatomyBack: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 2,
    title: 'Hipertrofia Tren Superior',
    category: 'hypertrophy',
    level: 'Intermedio',
    goal: 'Volumen',
    description: 'Rutina focalizada en pecho, espalda y brazos para maximizar el estímulo hipertrófico.',
    duration: '60 mins',
    exercisesCount: 7,
    equipment: ['Barra', 'Mancuernas'],
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800',
    muscleAnatomyFront: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=100',
    muscleAnatomyBack: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 3,
    title: 'Fuerza Extrema Pierna',
    category: 'strength',
    level: 'Avanzado',
    goal: 'Potencia',
    description: 'Bloque especializado en tren inferior pesado para ganancia de fuerza bruta.',
    duration: '75 mins',
    exercisesCount: 5,
    equipment: ['Barra Olímpica', 'Rack'],
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800',
    muscleAnatomyFront: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=100',
    muscleAnatomyBack: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=100'
  }
]);

const filteredRoutines = computed(() => {
  return routineLibrary.value.filter(routine => {
    const matchesCategory = activeCategory.value === 'all' || routine.category === activeCategory.value;
    const matchesLevel = activeLevel.value === 'Todos' || routine.level === activeLevel.value;
    return matchesCategory && matchesLevel;
  });
});

const saveRoutine = (routine) => alert(`¡${routine.title} guardada en tus rutinas!`);
const shareRoutine = (routine) => alert(`Compartiendo ${routine.title}`);
const viewRoutineDetails = (routine) => console.log('Detalle:', routine.title);

onMounted(() => {
  const savedGymStatus = localStorage.getItem('isGymOpen');
  if (savedGymStatus !== null) {
    isGymOpen.value = JSON.parse(savedGymStatus);
  }
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;700&display=swap');

/* ESTILOS GLOBALES HEREDADOS DEL DASHBOARD */
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
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-texto-general, rgba(245, 245, 244, 0.7));
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.header-status-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.gym-status-toggle {
  display: flex; align-items: center; gap: 8px; padding: 6px 14px;
  border-radius: 20px; font-size: 0.75rem; font-weight: 600;
  border: 1px solid;
}
.gym-status-toggle.status-open { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #34d399; }
.gym-status-toggle.status-closed { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; }
.toggle-dot { width: 6px; height: 6px; border-radius: 50%; }
.dot-open { background: #10b981; box-shadow: 0 0 8px #10b981; }
.dot-closed { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

.billing-status-badge {
  display: flex; align-items: center; gap: 8px; padding: 6px 14px;
  border-radius: 20px; font-size: 0.75rem; font-weight: 600;
  border: 1px solid; cursor: default;
}
.billing-status-badge.active { background: rgba(16, 185, 129, 0.1); border-color: rgba(16, 185, 129, 0.3); color: #34d399; }
.billing-status-badge.pending { background: rgba(245, 158, 11, 0.1); border-color: rgba(245, 158, 11, 0.3); color: #fbbf24; }
.billing-dot { width: 6px; height: 6px; border-radius: 50%; }
.billing-dot.active { background: #10b981; box-shadow: 0 0 8px #10b981; }

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
  color: var(--color-texto-general, rgba(245, 245, 244, 0.55));
  opacity: 0.8;
  margin: 8px 0 0 0;
  font-weight: 500;
}

/* GRUPO DE FILTROS LATERALES DE NIVEL (Estilo Métrica Dashboard) */
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

/* FILTROS DE CATEGORÍAS TIPO CHIPS */
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

.category-chip:hover {
  border-color: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.category-chip.active {
  background: var(--color-highlight, #3b82f6);
  border-color: var(--color-highlight, #3b82f6);
  color: #fff;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
}

.card-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 40%, rgba(18,18,18,0.9) 100%);
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

.badge-level.principiante { background: #10b981; color: #fff; }
.badge-level.intermedio { background: #f59e0b; color: #fff; }
.badge-level.avanzado { background: #ef4444; color: #fff; }

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
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 5px 8px;
  border-radius: 6px;
  font-size: 0.65rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.icon-action-btn:hover {
  background: var(--color-highlight, #3b82f6);
}

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

.equipment-icons {
  display: flex;
  gap: 4px;
}

.eq-pill {
  background: rgba(255, 255, 255, 0.04);
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  color: rgba(245, 245, 244, 0.8);
}

.muscle-images-preview {
  display: flex;
  gap: 4px;
}

.muscle-images-preview img {
  width: 24px;
  height: 24px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  padding: 2px;
  object-fit: contain;
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

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat-item svg {
  color: var(--color-highlight, #3b82f6);
}

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

.btn-explore:hover {
  opacity: 0.9;
}

@media (max-width: 1024px) {
  .hero-metrics-grid { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .dashboard-main-container { padding: 14px; }
  .filter-group-box { grid-template-columns: repeat(2, 1fr); }
  .gym-badge-tag { display: none; }
}
</style>
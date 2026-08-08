<template>
  <HeadingAdmin :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="saas-dashboard-wrapper">
     
      <main class="dashboard-main-container">
        
        <!-- HERO / BIENVENIDA -->
        <section class="hero-metrics-grid">
          
          <div class="glass-card gym-identity-box" id="turtor1">
            <div class="gym-header-top">
              <span class="gym-badge-tag">{{ t.branchTitle }}</span>
              
              <div class="header-status-controls">
                <div class="gym-status-toggle" :class="isGymOpen ? 'status-open' : 'status-closed'">
                  <span class="toggle-dot" :class="isGymOpen ? 'dot-open' : 'dot-closed'"></span>
                  {{ isGymOpen ? t.gymOpen : t.gymClosed }}
                </div>

                <div class="billing-status-badge" :class="billingStatus">
                  <span class="billing-dot" :class="billingStatus"></span>
                  {{ billingStatusText }}
                </div>
              </div>
            </div>

            <div class="gym-titles-container">
              <h1 class="main-heading">
                {{ t.hello }} <span class="highlight-color">{{ t.athlete }}</span>!
              </h1>
              <p class="hero-desc">{{ t.heroDesc }}</p>
            </div>
          </div>

          <!-- MÉTRICAS PERSONALES DEL MIEMBRO -->
          <div class="metrics-card-group" id="turtor2">
            <div class="metric-mini-card">
              <span class="metric-number">12</span>
              <span class="metric-label">{{ t.daysRemaining }}</span>
            </div>
            <div class="metric-mini-card">
              <span class="metric-number text-highlight">18</span>
              <span class="metric-label">{{ t.attendanceMonth }}</span>
            </div>
            <div class="metric-mini-card">
              <span class="metric-number">2</span>
              <span class="metric-label">{{ t.classesReserved }}</span>
            </div>
          </div>

        </section>

        <!-- MÓDULOS DE ACCESO RÁPIDO PARA MIEMBROS -->
        <div class="modules-grid-container">
          
          <div class="module-column" id="turtor3">
            <h3 class="column-category-title">{{ t.accessCategory }}</h3>
            <div class="cards-stack">
              
              <button class="action-card-modern" id="turtor4" @click="activeModal = 'my-qr'">
                <div class="card-icon-box qr-tint">
                  <svg class="svg-btn" viewBox="0 0 24 24"><path d="M4 4h7V11H4V4M13 4h7V11h-7V4M4 13h7v7H4v-7M13 13h3v2h-3v-2M18 13h2v2h-2v-2M13 15h2v2h-2v-2M15 18h2v2h-2v-2M18 18h2v2h-2v-2M13 18h2v2h-2v-2M18 15h2v2h-2v-2z"/></svg>
                </div>
                <div class="card-text-content">
                  <span class="card-title">{{ t.qrTitle }}</span>
                  <span class="card-desc">{{ t.qrDesc }}</span>
                </div>
              </button>

              <button class="action-card-modern" id="turtor5" @click="activeModal = 'my-routine'">
                <div class="card-icon-box routine-tint">
                  <svg class="svg-btn" viewBox="0 0 24 24"><path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 16.29 22 18.43 19.86 19.86 21.29 21.29 19.86 19.86 18.43 22 16.29z"/></svg>
                </div>
                <div class="card-text-content">
                  <span class="card-title">{{ t.routineTitle }}</span>
                  <span class="card-desc">{{ t.routineDesc }}</span>
                </div>
              </button>

            </div>
          </div>

          <div class="module-column" id="turtor6">
            <h3 class="column-category-title">{{ t.classesCategory }}</h3>
            <div class="cards-stack">
              
              <button class="action-card-modern" id="turtor7" @click="activeModal = 'book-classes'">
                <div class="card-icon-box classes-tint">
                  <svg class="svg-btn" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>
                </div>
                <div class="card-text-content">
                  <span class="card-title">{{ t.classesTitle }}</span>
                  <span class="card-desc">{{ t.classesDesc }}</span>
                </div>
              </button>

              <button class="action-card-modern" id="turtor8" @click="activeModal = 'nutrition-plan'">
                <div class="card-icon-box nutrition-tint">
                  <svg class="svg-btn" viewBox="0 0 24 24"><path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>
                </div>
                <div class="card-text-content">
                  <span class="card-title">{{ t.nutritionTitle }}</span>
                  <span class="card-desc">{{ t.nutritionDesc }}</span>
                </div>
              </button>

            </div>
          </div>

        </div>

      </main>
      
      <!-- CONTENEDOR DE MODALES EXTERNOS -->
      <transition name="pop">
        <div v-if="activeModal" class="modal-wrapper" @click.self="closeModal">
          <MyAccessQrModal v-if="activeModal === 'my-qr'" @close="closeModal" />
          <MyRoutineModal v-if="activeModal === 'my-routine'" @close="closeModal" />
          <BookClassesModal v-if="activeModal === 'book-classes'" @close="closeModal" />
          <NutritionPlanModal v-if="activeModal === 'nutrition-plan'" @close="closeModal" />
        </div>
      </transition>

    </div>
  </HeadingAdmin>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { traducciones } from './i18n.js'; 
import HeadingAdmin from './HeadingMember.vue';

import MyAccessQrModal from './Modals/MyAccessQrModal.vue';
import MyRoutineModal from './Modals/MyRoutineModal.vue';
import BookClassesModal from './Modals/BookClassesModal.vue';
import NutritionPlanModal from './Modals/NutritionPlanModal.vue';

const currentLang = ref(localStorage.getItem('member-idioma') || 'es');

const t = computed(() => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  const fallbackTable = traducciones.es;
  
  return new Proxy({}, {
    get(_, key) {
      return langTable[key] !== undefined ? langTable[key] : fallbackTable[key];
    }
  });
});

const activeModal = ref(null);
const isGymOpen = ref(true);
const billingStatus = ref('active'); 

const closeModal = () => {
  activeModal.value = null;
};

const billingStatusText = computed(() => {
  if (billingStatus.value === 'active') return t.value.accountActive;
  if (billingStatus.value === 'pending') return t.value.accountPending;
  return t.value.accountBlocked;
});

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

onMounted(() => {
  const savedGymStatus = localStorage.getItem('isGymOpen');
  if (savedGymStatus !== null) {
    isGymOpen.value = JSON.parse(savedGymStatus);
  }
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
});
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
.billing-status-badge.blocked { background: rgba(239, 68, 68, 0.1); border-color: rgba(239, 68, 68, 0.3); color: #f87171; }

.billing-dot { width: 6px; height: 6px; border-radius: 50%; }
.billing-dot.active { background: #10b981; box-shadow: 0 0 8px #10b981; }
.billing-dot.pending { background: #f59e0b; box-shadow: 0 0 8px #f59e0b; }
.billing-dot.blocked { background: #ef4444; box-shadow: 0 0 8px #ef4444; }

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

.metrics-card-group {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}

.metric-mini-card {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 20px);
  padding: 16px 8px;
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.metric-number {
  font-family: 'Oswald', sans-serif;
  font-size: 1.5rem; font-weight: 700;
  color: var(--color-titulos, #ffffff);
}

.metric-label {
  font-size: 0.65rem;
  color: var(--color-texto-general, rgba(245, 245, 244, 0.55));
  opacity: 0.8;
  margin-top: 4px; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.5px;
}

.modules-grid-container { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.module-column { display: flex; flex-direction: column; gap: 12px; }

.column-category-title {
  font-family: 'Oswald', sans-serif; font-size: 1.05rem; font-weight: 600;
  color: var(--color-titulos, rgba(245, 245, 244, 0.7)); margin: 0; letter-spacing: 0.5px;
}

.cards-stack { display: flex; flex-direction: column; gap: 12px; }

.action-card-modern {
  background: var(--bg-cards, #121212);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: var(--app-border-radius, 16px);
  padding: 22px; display: flex; align-items: center; gap: 16px;
  cursor: pointer; text-align: left; transition: all 0.2s ease;
  width: 100%; box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

.action-card-modern:hover {
  filter: brightness(1.1);
  border-color: var(--color-highlight, #3b82f6);
  transform: translateY(-2px);
}

.card-icon-box {
  width: 48px; height: 48px;
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--app-border-radius, 12px);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* TINTES DE COLOR PERSONALIZADOS PARA CADA ICONO */
.card-icon-box.qr-tint {
  background: rgba(59, 130, 246, 0.12);
  border-color: rgba(59, 130, 246, 0.35);
  color: #3b82f6;
}
.card-icon-box.routine-tint {
  background: rgba(168, 85, 247, 0.12);
  border-color: rgba(168, 85, 247, 0.35);
  color: #a855f7;
}
.card-icon-box.classes-tint {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
  color: #10b981;
}
.card-icon-box.nutrition-tint {
  background: rgba(245, 158, 11, 0.12);
  border-color: rgba(245, 158, 11, 0.35);
  color: #f59e0b;
}

.svg-btn { width: 24px; height: 24px; fill: currentColor; }

.card-text-content { display: flex; flex-direction: column; }
.card-title { font-family: 'Oswald', sans-serif; font-size: 1.15rem; font-weight: 600; color: var(--color-titulos, #f5f5f4); }
.card-desc { font-size: 0.85rem; color: var(--color-texto-general, rgba(245, 245, 244, 0.55)); opacity: 0.8; margin-top: 3px; font-weight: 400; }

.modal-wrapper {
  position: fixed; inset: 0; z-index: 4000;
  display: flex; align-items: center; justify-content: center;
  background: rgba(0, 0, 0, 0.8); backdrop-filter: blur(8px);
}

.pop-enter-active, .pop-leave-active { transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.95); }

@media (max-width: 1024px) {
  .hero-metrics-grid { grid-template-columns: 1fr; }
  .modules-grid-container { grid-template-columns: 1fr; }
}

@media (max-width: 680px) {
  .metrics-card-group { grid-template-columns: 1fr; }
  .dashboard-main-container { padding: 14px; }
  .gym-badge-tag { display: none; }
  .glass-card { display: flex; flex-direction: column; text-align: center; padding: 50px 14px; }
  .gym-header-top { order: 2; justify-content: center; margin-bottom: 0; margin-top: 38px; width: 100%; }
  .gym-titles-container { order: 1; width: 100%; }
  .main-heading { font-size: 1.7rem; line-height: 1.5; }
  .hero-desc { font-size: 0.95rem; margin-top: 18px; }
  .header-status-controls { width: 100%; flex-direction: row; justify-content: space-between; gap: 12px; }
  .gym-status-toggle, .billing-status-badge { flex: 1; justify-content: center; padding: 6px 6px; font-size: 0.75rem; text-align: center; }
}
</style>
<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HeadingOwner from '../HeadingOwner.vue';
import FitnessPet from '@/components/FitnessPet.vue';
import { traducciones } from '../i18n.js';

const searchQuery = ref('');

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
});

const user = ref({
  nombre: 'Jose Luis Ramirez Sanchez',
  id: 'Gym001',
  pesoInicial: '70 kg',
  pesoActual: '90 kg',
  estatura: '1.78 m',
  grasaCorporal: '18.5%',
  masaMuscular: '42.0 kg',
  aguaCorporal: '58.2%',
  imc: '28.4',
  aumentoFuerza: '+35.5 kg',
  caloriasPromedio: '2,450 kcal',
  inscripcion: '14/02/2026',
  celular: '+52 4811243421',
  correo: 'joseluis@gmail.com',
  asistenciaPorcentaje: 76,
  proximoCorte: '16/Abril/2026',
  saldoAPagar: '$650.00'
});

const rachaInfo = ref({
  dias: 10, 
  nombreMascota: 'Foxy el perro fitness',
  nivelMascota: 'Nivel 2',
  tipoMascota: 'perro' 
});

const etapaActual = computed(() => {
  const racha = rachaInfo.value.dias;
  if (racha === 0) return 'huevo';
  if (racha < 10) return 'bebe';
  if (racha < 30) return 'adolescente';
  if (racha < 100) return 'adulto';
  if (racha < 200) return 'senior';
  return 'musculoso';
});

const diasCalendario = ref([
  { dia: 1, estado: 'asistio' }, { dia: 2, estado: 'asistio' }, { dia: 3, estado: 'asistio' },
  { dia: 4, estado: 'asistio' }, { dia: 5, estado: 'falto' }, { dia: 6, estado: 'falto' },
  { dia: 7, estado: 'falto' }, { dia: 8, estado: 'falto' }, { dia: 9, estado: 'asistio' },
  { dia: 10, estado: 'hoy' }, { dia: 11, estado: 'futuro' }, { dia: 12, estado: 'futuro' },
  { dia: 13, estado: 'futuro' }, { dia: 14, estado: 'futuro' }, { dia: 15, estado: 'futuro' },
  { dia: 16, estado: 'futuro' }, { dia: 17, estado: 'futuro' }, { dia: 18, estado: 'futuro' },
  { dia: 19, estado: 'futuro' }, { dia: 20, estado: 'futuro' }, { dia: 21, estado: 'futuro' },
  { dia: 22, estado: 'futuro' }, { dia: 23, estado: 'futuro' }, { dia: 24, estado: 'futuro' },
  { dia: 25, estado: 'futuro' }, { dia: 26, estado: 'futuro' }, { dia: 27, estado: 'futuro' },
  { dia: 28, estado: 'futuro' }, { dia: 29, estado: 'futuro' }, { dia: 30, estado: 'futuro' },
  { dia: 31, estado: 'futuro' },
]);
</script>

<template>
  <HeadingOwner>
    <main class="main-content">
      <div class="stats-container">
        
        <div class="view-header-flex">
          <div class="view-header">
            <h1 class="title">{{ t('statsTitlePrefix') }} <span class="highlight-text">{{ t('statsTitleHighlight') }}</span></h1>
            <p class="subtitle">{{ t('statsSubtitle') }}</p>
          </div>
          <div id="tutor-0" class="search-bar-wrapper">
            <div class="search-input-container">
              <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input type="text" v-model="searchQuery" :placeholder="t('searchPlaceholder')" class="search-input" />
            </div>
          </div>
        </div>

        <div class="dashboard-grid">
          
          <!-- COLUMNA IZQUIERDA -->
          <div class="column-left">
            <div id="tutor-1" class="user-profile-card">
              <div class="profile-header-tag">{{ t('activeUserTag') }}</div>
              <div class="profile-main-info">
                <div class="avatar-wrapper">
                  <div id="tutor-2" class="avatar-circle">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div id="tutor-3" class="attendance-badge">{{ user.asistenciaPorcentaje }}% {{ t('attendanceBadgeSuffix') }}</div>
                </div>
                <div class="user-names">
                  <h2 id="tutor-4">{{ user.nombre }}</h2>
                  <span id="tutor-5" class="user-id">ID: {{ user.id }}</span>
                </div>
              </div>

              <div class="section-subtitle-small">{{ t('bodyCompositionTitle') }}</div>
              <div id="tutor-6" class="metrics-grid">
                <div id="tutor-7" class="metric-box"><span class="metric-label">{{ t('initialWeightLabel') }}</span><span class="metric-value">{{ user.pesoInicial }}</span></div>
                <div id="tutor-8" class="metric-box"><span class="metric-label">{{ t('currentWeightLabel') }}</span><span class="metric-value accent">{{ user.pesoActual }}</span></div>
                <div id="tutor-9" class="metric-box"><span class="metric-label">{{ t('heightLabel') }}</span><span class="metric-value">{{ user.estatura }}</span></div>
                <div id="tutor-10" class="metric-box"><span class="metric-label">{{ t('bodyFatLabel') }}</span><span class="metric-value warning">{{ user.grasaCorporal }}</span></div>
                <div id="tutor-11" class="metric-box"><span class="metric-label">{{ t('muscleMassLabel') }}</span><span class="metric-value accent">{{ user.masaMuscular }}</span></div>
                <div id="tutor-12" class="metric-box"><span class="metric-label">{{ t('avgCaloriesLabel') }}</span><span class="metric-value">{{ user.caloriasPromedio }}</span></div>
              </div>

              <div class="section-subtitle-small">{{ t('advancedMetricsTitle') }}</div>
              <div id="tutor-13" class="metrics-grid advanced-metrics">
                <div id="tutor-14" class="metric-box"><span class="metric-label">{{ t('bodyWaterLabel') }}</span><span class="metric-value info">{{ user.aguaCorporal }}</span></div>
                <div id="tutor-15" class="metric-box"><span class="metric-label">{{ t('bmiLabel') }}</span><span class="metric-value">{{ user.imc }}</span></div>
                <div id="tutor-16" class="metric-box"><span class="metric-label">{{ t('strengthGainLabel') }}</span><span class="metric-value accent">{{ user.aumentoFuerza }}</span></div>
              </div>

              <div id="tutor-17" class="performance-chart-box">
                <div class="chart-header">
                  <span class="chart-title">{{ t('muscleEfficiencyTitle') }}</span>
                  <span class="chart-percentage">{{ t('muscleEfficiencyPercentage') }}</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill"></div>
                </div>
              </div>

              <div id="tutor-18" class="contact-info-list">
                <div class="contact-item"><span class="contact-label">{{ t('enrollmentDateLabel') }}</span><span class="contact-val">{{ user.inscripcion }}</span></div>
                <div class="contact-item"><span class="contact-label">{{ t('phoneLabel') }}</span><span class="contact-val">{{ user.celular }}</span></div>
                <div class="contact-item"><span class="contact-label">{{ t('emailLabel') }}</span><span class="contact-val email-text">{{ user.correo }}</span></div>
              </div>
            </div>

            <div class="bottom-financial-grid">
              <div id="tutor-19" class="info-card">
                <span class="card-mini-title">{{ t('nextCutTitle') }}</span>
                <span class="card-highlight-val red">{{ user.proximoCorte }}</span>
              </div>
              <div id="tutor-20" class="info-card">
                <span class="card-mini-title">{{ t('balanceDueTitle') }}</span>
                <span class="card-highlight-val green">{{ user.saldoAPagar }}</span>
              </div>
            </div>
          </div>

          <!-- COLUMNA DERECHA -->
          <div class="column-right">
            
            <div id="tutor-21" class="calendar-card">
              <div class="calendar-header">
                <h3>{{ t('calendarHeaderTitle') }}</h3>
                <span class="year-badge">2026</span>
              </div>
              <div class="weekdays-row">
                <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
              </div>
              <div class="days-grid">
                <div v-for="(item, index) in diasCalendario" :key="index" class="day-cell" :class="item.estado">
                  {{ item.dia }}
                </div>
              </div>
              <div class="calendar-legend">
                <div class="legend-item"><span class="dot asistio"></span> {{ t('legendAttended') }}</div>
                <div class="legend-item"><span class="dot falto"></span> {{ t('legendMissed') }}</div>
                <div class="legend-item"><span class="dot hoy"></span> {{ t('legendToday') }}</div>
              </div>
            </div>

            <!-- TARJETA DE RACHA INTACTA (TAL COMO LA SOLICITASTE) -->
            <div id="tutor-22" class="streak-card" :class="`theme-${etapaActual}`">
              <div class="streak-header-row">
                <div class="streak-title-group">
                  <span class="section-subtitle-small">{{ t('petAndStreakTitle') }}</span>
                  <span class="streak-sub">{{ t('streakSub') }}</span>
                </div>
                <span class="pet-level-badge">{{ rachaInfo.nivelMascota }}</span>
              </div>

              <div class="streak-content-layout">
                <div class="pet-display-box">
                  <FitnessPet 
                    :nombre="rachaInfo.nombreMascota" 
                    :nivel="rachaInfo.nivelMascota" 
                    :racha="rachaInfo.dias" 
                    :tipo="rachaInfo.tipoMascota" 
                  />
                </div>

                <div class="streak-counter-box">
                  <div class="streak-number-wrapper">
                    <span class="streak-number animate-bounce">{{ rachaInfo.dias }}</span>
                    <span class="fire-icon animate-pulse">🔥</span>
                  </div>
                  <span class="streak-footer-text">{{ t('streakFooterText') }}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </main>
  </HeadingOwner>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  min-height: calc(100vh - 80px); 
  background: transparent; 
  color: var(--color-texto-general, #f5f5f4); 
  font-family: 'Inter', sans-serif; 
  padding: 30px 40px; 
  position: relative; 
  overflow-x: hidden; 
  box-sizing: border-box; 
}

.stats-container { max-width: 1300px; margin: 0 auto; position: relative; z-index: 2; }
.view-header-flex { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.view-header { flex: 1; min-width: 240px; }
.title { font-family: 'Anton', sans-serif; font-size: 2.6rem; color: var(--color-titulos, #fff); margin: 0; letter-spacing: 1px; text-transform: uppercase; }
.highlight-text { color: var(--color-highlight, #3b82f6); }
.subtitle { font-size: 0.9rem; color: var(--color-highlight, rgba(245, 245, 244, 0.6)); margin: 0; line-height: 1.4; font-weight: 400; }
.search-bar-wrapper { width: 100%; max-width: 320px; }
@media (max-width: 768px) { .search-bar-wrapper { max-width: 100%; } }
.search-input-container { position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 14px; color: var(--color-highlight, #3b82f6); pointer-events: none; }
.search-input { width: 100%; background: var(--bg-input, var(--bg-cards, rgba(18, 18, 18, 0.85))); border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.12)); border-radius: var(--app-border-radius, 12px); padding: 12px 14px 12px 42px; font-size: 0.95ns; color: var(--color-texto-input, var(--color-texto-general, #fff)); outline: none; backdrop-filter: blur(20px); transition: all 0.2s ease; box-sizing: border-box; font-family: 'Inter', sans-serif; }
.search-input::placeholder { color: rgba(245, 245, 244, 0.35); }
.search-input:focus { border-color: var(--color-highlight, #3b82f6); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15); background: var(--bg-input-focus, var(--bg-cards, #141414)); }

.dashboard-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; align-items: start; }
@media (max-width: 1024px) { 
  .dashboard-grid { grid-template-columns: 1fr; gap: 20px; } 
  .main-content { padding: 16px; }
}

.column-left { display: flex; flex-direction: column; gap: 20px; }

/* Tarjetas principales adaptadas al sistema global */
.user-profile-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(20px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  border-radius: var(--app-border-radius, 24px); 
  padding: 28px; 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6); 
  position: relative; 
}
.profile-header-tag { position: absolute; top: 20px; right: 20px; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 4px 10px; background: rgba(28, 79, 214, 0.2); color: #93c5fd; border: 1px solid rgba(28, 79, 214, 0.4); border-radius: 6px; letter-spacing: 0.5px; }

.profile-main-info { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.avatar-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; }
.avatar-circle { width: 70px; height: 70px; background: linear-gradient(135deg, var(--color-botones, #1c4fd6) 0%, #102d7c 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 8px 20px rgba(28, 79, 214, 0.35); border: 2px solid rgba(255, 255, 255, 0.15); }
.attendance-badge { margin-top: 6px; font-size: 10px; font-weight: 700; background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(34, 197, 94, 0.3); white-space: nowrap; }

.user-names h2 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: clamp(1.1rem, 3.5vw, 1.4rem); letter-spacing: -0.3px; margin: 0 0 2px; color: var(--color-titulos, #fff); word-break: break-word; }
.user-id { font-family: 'Inter', sans-serif; font-size: 11.5px; color: var(--color-highlight, #93c5fd); letter-spacing: 0.3px; font-weight: 600; }

.section-subtitle-small { font-family: 'Oswald', sans-serif; font-size: 0.9rem; font-weight: 600; text-transform: uppercase; color: var(--color-highlight, #3b82f6); margin-bottom: 10px; margin-top: 18px; letter-spacing: 0.5px; }
.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 8px; background: rgba(0, 0, 0, 0.25); padding: 12px; border-radius: var(--app-border-radius, 16px); border: 1px solid var(--border-line, rgba(255, 255, 255, 0.06)); }
.advanced-metrics { grid-template-columns: repeat(3, 1fr); }
@media (max-width: 480px) { 
  .metrics-grid, .advanced-metrics { grid-template-columns: repeat(2, 1fr); } 
}
.metric-box { display: flex; flex-direction: column; gap: 4px; text-align: center; background: rgba(255, 255, 255, 0.025); padding: 10px 8px; border-radius: 10px; border: 1px solid rgba(255, 255, 255, 0.04); }
.metric-label { font-size: 9.5px; color: rgba(245, 245, 244, 0.5); text-transform: uppercase; font-weight: 600; letter-spacing: 0.3px; }
.metric-value { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #f5f5f4; }
.metric-value.accent { color: #4ade80; }
.metric-value.warning { color: #facc15; }
.metric-value.info { color: #38bdf8; }

.performance-chart-box { background: rgba(0, 0, 0, 0.25); border: 1px solid var(--border-line, rgba(255, 255, 255, 0.06)); border-radius: var(--app-border-radius, 16px); padding: 14px 16px; margin-top: 12px; margin-bottom: 16px; }
.chart-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 11px; font-family: 'Inter', sans-serif; }
.chart-title { color: rgba(245, 245, 244, 0.7); text-transform: uppercase; font-weight: 600; font-size: 10px; letter-spacing: 0.3px; }
.chart-percentage { color: #4ade80; font-weight: 700; }
.progress-bar-bg { width: 100%; height: 8px; background: rgba(255, 255, 255, 0.06); border-radius: 4px; overflow: hidden; }
.progress-bar-fill { width: 75%; height: 100%; background: linear-gradient(90deg, var(--color-botones, #1c4fd6) 0%, #4ade80 100%); border-radius: 4px; box-shadow: 0 0 10px rgba(74, 222, 128, 0.4); }

.contact-info-list { display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border-line, rgba(255, 255, 255, 0.08)); padding-top: 16px; }
.contact-item { display: flex; justify-content: space-between; align-items: center; font-size: 12px; gap: 8px; }
.contact-label { color: rgba(245, 245, 244, 0.55); font-weight: 500; }
.contact-val { color: #f5f5f4; font-weight: 600; text-align: right; }
.email-text { word-break: break-all; }

.bottom-financial-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.info-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(20px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  border-radius: var(--app-border-radius, 20px); 
  padding: 20px; 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
}
.card-mini-title { font-family: 'Oswald', sans-serif; font-size: 0.85rem; color: var(--color-highlight, #3b82f6); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
.card-highlight-val { font-family: 'Inter', sans-serif; font-size: clamp(1.1rem, 3vw, 1.3rem); font-weight: 700; }
.card-highlight-val.red { color: #f87171; }
.card-highlight-val.green { color: #4ade80; }

.column-right { display: flex; flex-direction: column; gap: 20px; }
.calendar-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.75)); 
  backdrop-filter: blur(20px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  border-radius: var(--app-border-radius, 24px); 
  padding: 28px; 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6); 
}
.calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.calendar-header h3 { font-family: 'Oswald', sans-serif; font-size: 1.2rem; font-weight: 600; margin: 0; letter-spacing: 0.5px; text-transform: uppercase; color: var(--color-titulos, #fff); }
.year-badge { font-family: 'Inter', sans-serif; color: var(--color-highlight, #3b82f6); font-size: 1rem; font-weight: 700; }
.weekdays-row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-family: 'Inter', sans-serif; font-size: 11px; color: rgba(245, 245, 244, 0.45); margin-bottom: 10px; font-weight: 600; }
.days-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
.day-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-size: 12px; font-weight: 600; background: rgba(255, 255, 255, 0.03); color: rgba(245, 245, 244, 0.75); border: 1px solid rgba(255, 255, 255, 0.04); }
.day-cell.asistio { background: rgba(34, 197, 94, 0.2); color: #4ade80; border-color: rgba(34, 197, 94, 0.4); }
.day-cell.falto { background: rgba(239, 68, 68, 0.2); color: #f87171; border-color: rgba(239, 68, 68, 0.4); }
.day-cell.hoy { background: rgba(234, 179, 8, 0.25); color: #facc15; border-color: rgba(234, 179, 8, 0.5); box-shadow: 0 0 10px rgba(234, 179, 8, 0.25); }
.calendar-legend { display: flex; justify-content: center; gap: 16px; margin-top: 18px; border-top: 1px solid var(--border-line, rgba(255, 255, 255, 0.08)); padding-top: 16px; flex-wrap: wrap; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 11px; color: rgba(245, 245, 244, 0.65); font-weight: 500; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.asistio { background: #4ade80; }
.dot.falto { background: #f87171; }
.dot.hoy { background: #facc15; }

/* ========================================================
   TARJETA DE RACHA (MANTENIDA INTACTA EXACTAMENTE COMO LA PEDISTE)
   ======================================================== */
.streak-card {
  backdrop-filter: blur(20px);
  border-radius: 18px;
  padding: 18px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.5s ease;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.theme-huevo { background: linear-gradient(135deg, rgba(148, 163, 184, 0.2) 0%, rgba(18, 18, 18, 0.9) 100%); border: 1px solid rgba(148, 163, 184, 0.4); --accent-color: #cbd5e1; }
.theme-bebe { background: linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(18, 18, 18, 0.9) 100%); border: 1px solid rgba(234, 179, 8, 0.4); --accent-color: #facc15; }
.theme-adolescente { background: linear-gradient(135deg, rgba(249, 115, 22, 0.22) 0%, rgba(18, 18, 18, 0.9) 100%); border: 1px solid rgba(249, 115, 22, 0.4); --accent-color: #fb923c; }
.theme-adulto { background: linear-gradient(135deg, rgba(236, 72, 153, 0.22) 0%, rgba(18, 18, 18, 0.9) 100%); border: 1px solid rgba(236, 72, 153, 0.4); --accent-color: #f472b6; }
.theme-senior { background: linear-gradient(135deg, rgba(168, 85, 247, 0.22) 0%, rgba(18, 18, 18, 0.9) 100%); border: 1px solid rgba(168, 85, 247, 0.4); --accent-color: #c084fc; }
.theme-musculoso { background: linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(18, 18, 18, 0.9) 100%); border: 1px solid rgba(59, 130, 246, 0.5); --accent-color: #60a5fa; }

.streak-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.streak-title-group { display: flex; flex-direction: column; }
.streak-title-group .section-subtitle-small { margin-top: 0; margin-bottom: 2px; }
.streak-sub { font-size: 11px; color: rgba(245, 245, 244, 0.6); font-weight: 400; }
.pet-level-badge { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; background: rgba(0, 0, 0, 0.4); color: var(--accent-color, #facc15); padding: 4px 10px; border-radius: 6px; border: 1px solid var(--accent-color, #facc15); text-transform: uppercase; white-space: nowrap; box-shadow: 0 2px 8px rgba(0,0,0,0.3); }

.streak-content-layout { display: flex; flex-direction: column; gap: 14px; width: 100%; box-sizing: border-box; }
.pet-display-box { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0, 0, 0, 0.3); padding: 16px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); text-align: center; box-sizing: border-box; }

.streak-counter-box { width: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: rgba(0, 0, 0, 0.3); padding: 14px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05); box-sizing: border-box; margin-top: 4px; }
.streak-number-wrapper { display: flex; align-items: center; gap: 8px; }
.streak-number { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 2.2rem; color: #f5f5f4; line-height: 1; text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6); }
.fire-icon { font-size: 1.5rem; filter: drop-shadow(0 0 8px var(--accent-color, #facc15)); }
.streak-footer-text { font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; color: rgba(245, 245, 244, 0.75); letter-spacing: 0.5px; margin-top: 4px; }

@keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes pulseFlame { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.9; } }
.animate-bounce { animation: bounceSlow 2.5s ease-in-out infinite; }
.animate-pulse { animation: pulseFlame 1.8s ease-in-out infinite; display: inline-block; }
</style>
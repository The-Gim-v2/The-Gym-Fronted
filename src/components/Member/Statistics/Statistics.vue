<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HeadingMember from '../HeadingMember.vue';
import MascotasColeccion from '@/components/MascotasColeccion.vue';
import AvatarCuerpo from '@/components/AvatarCuerpo.vue';
import LineChartSimple from '@/components/LineChartSimple.vue';
import CalorieRingsChart from '@/components/CalorieRingsChart.vue';
import DonutChart from '@/components/DonutChart.vue';

/* ---------------- IDIOMA (es/en) ----------------
   Mismo patrón que MascotasColeccion.vue: localStorage + evento global
   'idioma-changed'. Autocontenido, sin depender de rutas de import inciertas. */
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');
const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) currentLang.value = e.detail.idioma;
};
onMounted(() => window.addEventListener('idioma-changed', handleLangChange));
onUnmounted(() => window.removeEventListener('idioma-changed', handleLangChange));

const traducciones = {
  es: {
    statsTitlePrefix: 'Mis',
    statsTitleHighlight: 'Estadísticas',
    statsSubtitle: 'Tu progreso, tu constancia y tu evolución física en un solo lugar.',
    myProfileTag: 'Mi Perfil',
    attendanceBadgeSuffix: 'asistencia',
    bodyCompositionTitle: 'Composición corporal',
    initialWeightLabel: 'Peso inicial',
    currentWeightLabel: 'Peso actual',
    heightLabel: 'Estatura',
    bodyFatLabel: 'Grasa corporal',
    muscleMassLabel: 'Masa muscular',
    avgCaloriesLabel: 'Calorías prom.',
    advancedMetricsTitle: 'Métricas avanzadas',
    bodyWaterLabel: 'Agua corporal',
    bmiLabel: 'IMC',
    strengthGainLabel: 'Aumento de fuerza',
    physiqueTitle: 'Tu físico',
    physiqueDesc: 'Vista de tu composición actual, según tu peso, IMC y grasa corporal',
    weightProgressTitle: 'Progreso de peso',
    strengthProgressTitle: 'Progreso de fuerza',
    calendarHeaderTitle: 'Calendario de asistencia',
    calendarDaysAttended: 'días asistidos',
    legendAttended: 'Asististe',
    legendMissed: 'Faltaste',
    legendToday: 'Hoy',
    legendFuture: 'Pendiente',
    weeklyCaloriesTitle: 'Calorías quemadas',
    bodyCompositionChartTitle: 'Composición corporal',
    muscleCenterLabel: 'Músculo',
    petAndStreakTitle: 'Racha y compañero',
    streakSub: 'Cada día de asistencia hace crecer a tu compañero',
    weekdays: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    locale: 'es-ES',
  },
  en: {
    statsTitlePrefix: 'My',
    statsTitleHighlight: 'Stats',
    statsSubtitle: 'Your progress, consistency and physical evolution in one place.',
    myProfileTag: 'My Profile',
    attendanceBadgeSuffix: 'attendance',
    bodyCompositionTitle: 'Body composition',
    initialWeightLabel: 'Initial weight',
    currentWeightLabel: 'Current weight',
    heightLabel: 'Height',
    bodyFatLabel: 'Body fat',
    muscleMassLabel: 'Muscle mass',
    avgCaloriesLabel: 'Avg. calories',
    advancedMetricsTitle: 'Advanced metrics',
    bodyWaterLabel: 'Body water',
    bmiLabel: 'BMI',
    strengthGainLabel: 'Strength gain',
    physiqueTitle: 'Your physique',
    physiqueDesc: 'A view of your current composition, based on your weight, BMI and body fat',
    weightProgressTitle: 'Weight progress',
    strengthProgressTitle: 'Strength progress',
    calendarHeaderTitle: 'Attendance calendar',
    calendarDaysAttended: 'days attended',
    legendAttended: 'Attended',
    legendMissed: 'Missed',
    legendToday: 'Today',
    legendFuture: 'Pending',
    weeklyCaloriesTitle: 'Calories burned',
    bodyCompositionChartTitle: 'Body composition',
    muscleCenterLabel: 'Muscle',
    petAndStreakTitle: 'Streak & companion',
    streakSub: 'Every day you show up, your companion grows',
    weekdays: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    locale: 'en-US',
  },
};

const t = computed(() => traducciones[currentLang.value] || traducciones.es);

// --- Datos propios del atleta (sin fecha de corte ni saldo: eso vive en la vista de pagos) ---
const user = ref({
  nombre: 'Jose Luis Ramirez Sanchez',
  id: 'Gym001',
  sexo: 'hombre', // 'hombre' | 'mujer' -> usado por AvatarCuerpo
  pesoInicial: '70 kg',
  pesoActual: '40 kg',
  estatura: '1.78 m',
  grasaCorporal: '18.5%',
  masaMuscular: '72.0 kg',
  aguaCorporal: '58.2%',
  imc: '28.4',
  aumentoFuerza: '+35.5 kg',
  caloriasPromedio: '2,450 kcal',
  asistenciaPorcentaje: 76,
});

// Racha total del atleta: alimenta el sistema de mascotas por generaciones (ver MascotasColeccion)
const rachaInfo = ref({
  dias: 460,
  activoHoy: true,
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

// Alinea cada día con la columna de la semana correcta (el mock arranca fijo en Domingo;
// si prefieres alinearlo al calendario real, calcula el offset con el primer día del mes).
const OFFSET_PRIMER_DIA = 0;
const celdasCalendario = computed(() => {
  const relleno = Array.from({ length: OFFSET_PRIMER_DIA }, () => null);
  return [...relleno, ...diasCalendario.value];
});

// --- Métricas del calendario, usadas en la barra de progreso del encabezado ---
const diasAsistidosMes = computed(() => diasCalendario.value.filter((d) => d.estado === 'asistio').length);
const diasFaltoMes = computed(() => diasCalendario.value.filter((d) => d.estado === 'falto').length);
const diasRegistradosMes = computed(() => diasAsistidosMes.value + diasFaltoMes.value);
const porcentajeMes = computed(() =>
  diasRegistradosMes.value > 0 ? Math.round((diasAsistidosMes.value / diasRegistradosMes.value) * 100) : 0
);

const etiquetaMes = computed(() => {
  const hoy = new Date();
  const texto = hoy.toLocaleDateString(t.value.locale, { month: 'long' });
  return texto.charAt(0).toUpperCase() + texto.slice(1);
});
const anioActual = computed(() => new Date().getFullYear());

const iconoEstado = (estado) => {
  if (estado === 'asistio') return '✓';
  if (estado === 'falto') return '✕';
  return '';
};

// --- Datos para las gráficas (mock; reemplaza con datos reales del backend) ---
const pesoHistorico = ref([
  { label: 'Mar', value: 74 },
  { label: 'Abr', value: 78 },
  { label: 'May', value: 82 },
  { label: 'Jun', value: 85 },
  { label: 'Jul', value: 88 },
  { label: 'Ago', value: 90 },
]);

const fuerzaHistorico = ref([
  { label: 'Mar', value: 40 },
  { label: 'Abr', value: 48 },
  { label: 'May', value: 58 },
  { label: 'Jun', value: 65 },
  { label: 'Jul', value: 72 },
  { label: 'Ago', value: 75.5 },
]);

// Antes aquí iba "asistencia semanal" (%), pero eso ya lo muestra el calendario
// de al lado. Ahora se usa un dato distinto y complementario: calorías quemadas
// por semana (kcal), para no repetir información.
const caloriasSemanales = ref([
  { label: 'S1', value: 1850 },
  { label: 'S2', value: 2100 },
  { label: 'S3', value: 2450 },
  { label: 'S4', value: 1600 },
  { label: 'S5', value: 2380 },
  { label: 'S6', value: 2200 },
  { label: 'S7', value: 1950 },
  { label: 'S8', value: 2300 },
]);

const composicionCorporal = computed(() => [
  { label: t.value.muscleMassLabel, value: 47, color: '#4ade80' },
  { label: t.value.bodyFatLabel, value: 18, color: '#facc15' },
  { label: t.value.bodyWaterLabel, value: 35, color: '#38bdf8' },
]);
</script>

<template>
  <HeadingMember>
    <main class="main-content">

      <div class="stats-container">

        <div class="view-header-flex">
          <div class="view-header">
            <h1 class="title">{{ t.statsTitlePrefix }} <span class="highlight-text">{{ t.statsTitleHighlight }}</span></h1>
            <span class="title-underline"></span>
            <p class="subtitle">{{ t.statsSubtitle }}</p>
          </div>
        </div>

        <div class="dashboard-grid">

          <div class="user-profile-card area-perfil">
            <div class="profile-header-tag">{{ t.myProfileTag }}</div>
            <div class="profile-main-info">
              <div class="avatar-wrapper">
                <div class="avatar-circle">
                  <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                </div>
                <div class="attendance-badge">{{ user.asistenciaPorcentaje }}% {{ t.attendanceBadgeSuffix }}</div>
              </div>
              <div class="user-names">
                <h2>{{ user.nombre }}</h2>
                <div class="user-sub-info">
                  <span class="user-id">ID: {{ user.id }}</span>
                  <span class="user-meta-dot">•</span>
                  <span class="user-sex">Sexo: {{ user.sexo }}</span>
                  <span class="user-meta-dot">•</span>
                  <span class="user-age">Edad: {{ user.edad || '28' }} años</span>
                </div>
              </div>
            </div>

            <div class="section-subtitle-small"><span class="subtitle-dot"></span>{{ t.bodyCompositionTitle }}</div>
            <div class="metrics-grid">
              <div class="metric-box"><span class="metric-label">{{ t.initialWeightLabel }}</span><span class="metric-value">{{ user.pesoInicial }}</span></div>
              <div class="metric-box"><span class="metric-label">{{ t.currentWeightLabel }}</span><span class="metric-value accent">{{ user.pesoActual }}</span></div>
              <div class="metric-box"><span class="metric-label">{{ t.heightLabel }}</span><span class="metric-value">{{ user.estatura }}</span></div>
              <div class="metric-box"><span class="metric-label">{{ t.bodyFatLabel }}</span><span class="metric-value warning">{{ user.grasaCorporal }}</span></div>
              <div class="metric-box"><span class="metric-label">{{ t.muscleMassLabel }}</span><span class="metric-value accent">{{ user.masaMuscular }}</span></div>
              <div class="metric-box"><span class="metric-label">{{ t.avgCaloriesLabel }}</span><span class="metric-value">{{ user.caloriasPromedio }}</span></div>
            </div>

            <div class="section-subtitle-small"><span class="subtitle-dot"></span>{{ t.advancedMetricsTitle }}</div>
            <div class="metrics-grid advanced-metrics">
              <div class="metric-box"><span class="metric-label">{{ t.bodyWaterLabel }}</span><span class="metric-value info">{{ user.aguaCorporal }}</span></div>
              <div class="metric-box"><span class="metric-label">{{ t.bmiLabel }}</span><span class="metric-value">{{ user.imc }}</span></div>
              <div class="metric-box"><span class="metric-label">{{ t.strengthGainLabel }}</span><span class="metric-value accent">{{ user.aumentoFuerza }}</span></div>
            </div>
          </div>

          <div class="body-avatar-card area-avatar">
            <span class="section-subtitle-small"><span class="subtitle-dot"></span>{{ t.physiqueTitle }}</span>
            <span class="streak-sub">{{ t.physiqueDesc }}</span>
            <div class="body-avatar-display-box">
              <AvatarCuerpo
                :sexo="user.sexo"
                :imc="user.imc"
                :grasa-corporal="user.grasaCorporal"
                tamano="md"
              />
            </div>
          </div>

          <div class="chart-card area-peso">
            <LineChartSimple :data="pesoHistorico" color="#3b82f6" unit=" kg" :titulo="t.weightProgressTitle" />
          </div>

          <div class="chart-card area-fuerza">
            <LineChartSimple :data="fuerzaHistorico" color="#4ade80" unit=" kg" :titulo="t.strengthProgressTitle" />
          </div>

          <!-- ===== Calendario de asistencia ===== -->
          <div class="calendar-card area-calendario">
            <div class="calendar-glow glow-1" aria-hidden="true"></div>
            <div class="calendar-glow glow-2" aria-hidden="true"></div>

            <div class="calendar-content">
              <div class="calendar-header">
                <div class="calendar-header-title">
                  <span class="calendar-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  </span>
                  <div>
                    <h3>{{ t.calendarHeaderTitle }}</h3>
                    <span class="calendar-month">{{ etiquetaMes }}</span>
                  </div>
                </div>
                <span class="year-badge">{{ anioActual }}</span>
              </div>

              <div class="calendar-progress-row">
                <div class="progress-track">
                  <div class="progress-fill" :style="{ width: porcentajeMes + '%' }"></div>
                </div>
                <div class="progress-label">
                  <span>{{ diasAsistidosMes }}/{{ diasRegistradosMes }} {{ t.calendarDaysAttended }}</span>
                  <span class="progress-percent">{{ porcentajeMes }}%</span>
                </div>
              </div>

              <div class="weekdays-row">
                <span v-for="(d, i) in t.weekdays" :key="i">{{ d }}</span>
              </div>

              <div class="days-grid-expanded">
                <div
                  v-for="(item, index) in celdasCalendario"
                  :key="index"
                  class="day-cell"
                  :class="item ? item.estado : 'vacio'"
                >
                  <template v-if="item">
                    {{ item.dia }}
                    <span v-if="item.estado === 'hoy'" class="hoy-ring"></span>
                    <span v-if="iconoEstado(item.estado)" class="day-icon">
                      <svg v-if="item.estado === 'asistio'" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      <svg v-else-if="item.estado === 'falto'" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </span>
                  </template>
                </div>
              </div>

              <div class="calendar-legend">
                <div class="legend-item"><span class="dot asistio"></span> {{ t.legendAttended }}</div>
                <div class="legend-item"><span class="dot falto"></span> {{ t.legendMissed }}</div>
                <div class="legend-item"><span class="dot hoy"></span> {{ t.legendToday }}</div>
              </div>
            </div>
          </div>

          <!-- ===== Tarjeta de Racha y Mascotas (Puros SVGs) ===== -->
          <div class="streak-card area-mascotas">
            <div class="streak-header-row">
              <div class="streak-title-group">
                <span class="section-subtitle-small light"><span class="subtitle-dot pink"></span>{{ t.petAndStreakTitle }}</span>
                <span class="streak-sub">{{ t.streakSub }}</span>
              </div>
              <div class="streak-number-wrapper">
                <span class="streak-number animate-bounce">{{ rachaInfo.dias }}</span>
                <span class="fire-icon animate-pulse" aria-label="Racha">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#facc15" stroke="#f97316" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 4-4 7-4 11a4 4 0 0 0 8 0c0-2-.5-3.5-1.5-5C15.5 10 16 12 16 12s2-2 2-4c0-3.5-3-6-6-6z"/></svg>
                </span>
              </div>
            </div>

            <div class="streak-extra-banner">
              <div class="streak-status-pill">
                <span class="status-indicator-dot" :class="{ active: rachaInfo.activoHoy }"></span>
                <span>{{ rachaInfo.activoHoy ? '¡Entrenamiento registrado hoy!' : 'Pendiente de registrar hoy' }}</span>
              </div>
              <span class="streak-motivation-tip">⚡ ¡Mantén el ritmo activo para desbloquear recompensas!</span>
            </div>

            <div class="mascotas-wrapper-flex">
              <MascotasColeccion
                :dias-totales="rachaInfo.dias"
                :activo-hoy="rachaInfo.activoHoy"
              />
            </div>

            <div class="streak-bottom-analytics">
              <div class="analytics-mini-card">
                <span class="analytics-label">Récord histórico</span>
                <span class="analytics-value">
                  520 días 
                  <svg style="display:inline-block; vertical-align:middle; margin-left:2px;" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#facc15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17h4v-2.34"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
                </span>
              </div>
              <div class="analytics-mini-card">
                <span class="analytics-label">Siguiente recompensa</span>
                <span class="analytics-value accent">Faltan 340 días</span>
              </div>
            </div>

            <div class="next-pet-progress-container">
              <div class="next-pet-info-header">
                <span>Progreso hacia Gen. 3</span>
                <span class="next-pet-pct">57%</span>
              </div>
              <div class="next-pet-track">
                <div class="next-pet-fill" style="width: 57%;"></div>
              </div>
            </div>
          </div>

          <div class="chart-card area-composicion">
            <DonutChart
              :segmentos="composicionCorporal"
              :titulo="t.bodyCompositionChartTitle"
              :centro-valor="`${composicionCorporal[0].value}%`"
              :centro-label="t.muscleCenterLabel"
            />
          </div>

          <div class="chart-card area-semanal">
            <CalorieRingsChart :data="caloriasSemanales" color="#fb923c" unit=" kcal" :titulo="t.weeklyCaloriesTitle" />
          </div>

        </div>

      </div>
    </main>
  </HeadingMember>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

* { box-sizing: border-box; }

.main-content {
  min-height: calc(100vh - 80px);
  background: transparent;
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  padding: 24px 32px;
  position: relative;
  overflow-x: hidden;
  overflow-y: visible;
}

.stats-container { max-width: 1360px; margin: 0 auto; position: relative; z-index: 2; }
.view-header-flex { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
.view-header { flex: 1; min-width: 240px; }
.title { font-family: 'Anton', sans-serif; font-size: clamp(1.7rem, 5vw, 2.4rem); color: var(--color-titulos, #fff); margin: 0; letter-spacing: 1px; text-transform: uppercase; }
.highlight-text { color: var(--color-highlight, #3b82f6); }
.title-underline {
  display: block;
  width: 64px;
  height: 4px;
  margin: 4px 0 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-highlight, #3b82f6), transparent);
}
.subtitle { font-size: 0.85rem; color: var(--color-highlight, rgba(245, 245, 244, 0.6)); margin: 0; line-height: 1.4; font-weight: 400; }

/* ============ GRID PRINCIPAL ============ */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  grid-template-areas:
    "perfil avatar"
    "peso fuerza"
    "calendario mascotas"
    "composicion semanal";
  gap: 20px;
  align-items: stretch;
  position: relative;
  z-index: 1;
}

.area-perfil { grid-area: perfil; min-width: 0; }
.area-avatar { grid-area: avatar; min-width: 0; }
.area-peso { grid-area: peso; min-width: 0; }
.area-fuerza { grid-area: fuerza; min-width: 0; }
.area-calendario { grid-area: calendario; min-width: 0; }
.area-mascotas { grid-area: mascotas; align-self: stretch; min-width: 0; }
.area-composicion { grid-area: composicion; align-self: stretch; justify-content: center; min-width: 0; }
.area-semanal { grid-area: semanal; min-width: 0; }

/* --- Responsive Media Queries --- */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      "perfil"
      "avatar"
      "peso"
      "fuerza"
      "calendario"
      "mascotas"
      "composicion"
      "semanal";
  }
}

@media (max-width: 640px) {
  .main-content { padding: 14px 12px; }
  .user-profile-card,
  .body-avatar-card,
  .calendar-card { padding: 14px; }
  .chart-card { padding: 14px 16px; }
  .streak-card { padding: 14px 16px; }
  .metrics-grid { padding: 8px; gap: 6px; }
}

/* --- Base de tarjeta --- */
.chart-card,
.user-profile-card,
.calendar-card,
.body-avatar-card,
.streak-card {
  position: relative;
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
  max-width: 100%;
}
.chart-card::before,
.user-profile-card::before,
.calendar-card::before,
.body-avatar-card::before {
  content: '';
  position: absolute;
  top: 0; left: 20px; right: 20px;
  height: 2px;
  border-radius: 0 0 3px 3px;
  background: linear-gradient(90deg, transparent, var(--color-highlight, #3b82f6), transparent);
  opacity: 0.7;
}

/* --- Tarjeta de Perfil --- */
.user-profile-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 24px);
  padding: 20px 24px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  overflow: hidden;
}
.profile-header-tag { position: absolute; top: 16px; right: 20px; font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 700; text-transform: uppercase; padding: 3px 8px; background: rgba(28, 79, 214, 0.2); color: #93c5fd; border: 1px solid rgba(28, 79, 214, 0.4); border-radius: 6px; letter-spacing: 0.5px; }

.profile-main-info { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; flex-wrap: wrap; }
.avatar-wrapper { position: relative; display: flex; flex-direction: column; align-items: center; }
.avatar-circle { width: 56px; height: 56px; background: linear-gradient(135deg, var(--color-botones, #1c4fd6) 0%, #102d7c 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; box-shadow: 0 6px 16px rgba(28, 79, 214, 0.35); border: 2px solid rgba(255, 255, 255, 0.15); flex-shrink: 0; }
.attendance-badge { margin-top: 4px; font-size: 9.5px; font-weight: 700; background: rgba(34, 197, 94, 0.15); color: #4ade80; padding: 1px 6px; border-radius: 6px; border: 1px solid rgba(34, 197, 94, 0.3); white-space: nowrap; }

.user-names { min-width: 0; }
.user-names h2 { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 1.25rem; letter-spacing: -0.3px; margin: 0 0 4px; color: var(--color-titulos, #fff); overflow-wrap: anywhere; }
.user-sub-info { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: 11px; }
.user-id { color: var(--color-highlight, #93c5fd); font-weight: 600; }
.user-sex, .user-age { color: rgba(245, 245, 244, 0.7); }
.user-meta-dot { color: rgba(245, 245, 244, 0.3); }

.section-subtitle-small {
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-highlight, #3b82f6);
  margin-bottom: 6px;
  margin-top: 12px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.section-subtitle-small.light { color: #f472b6; }
.subtitle-dot {
  width: 5px; height: 5px; border-radius: 50%;
  background: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 6px var(--color-highlight, #3b82f6);
  flex-shrink: 0;
}
.subtitle-dot.pink { background: #f472b6; box-shadow: 0 0 6px #f472b6; }

.metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 4px; background: rgba(0, 0, 0, 0.25); padding: 10px; border-radius: var(--app-border-radius, 14px); border: 1px solid var(--border-line, rgba(255, 255, 255, 0.06)); }
.advanced-metrics { grid-template-columns: repeat(3, 1fr); }
.metric-box {
  display: flex; flex-direction: column; gap: 2px; text-align: center;
  background: rgba(255, 255, 255, 0.025);
  padding: 8px 6px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  min-width: 0;
}
.metric-label { font-size: 9px; color: rgba(245, 245, 244, 0.5); text-transform: uppercase; font-weight: 600; }
.metric-value { font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; color: #f5f5f4; overflow-wrap: anywhere; }
.metric-value.accent { color: #4ade80; }
.metric-value.warning { color: #facc15; }
.metric-value.info { color: #38bdf8; }

/* --- Tarjeta del Avatar Corporal --- */
.body-avatar-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 24px);
  padding: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 100%;
}
.body-avatar-card .streak-sub { line-height: 1.4; margin-bottom: 6px; font-size: 10.5px; }
.body-avatar-display-box {
  flex: 1;
  width: 100%;
  max-width: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  min-height: 200px;
}

/* ===================================================================
   Calendario de asistencia — compacto
   =================================================================== */
.calendar-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 24px);
  padding: 16px 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
}

.calendar-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(46px);
  pointer-events: none;
  z-index: 0;
}
.calendar-glow.glow-1 {
  width: 140px; height: 140px; top: -50px; right: -40px;
  background: radial-gradient(circle, rgba(59,130,246,0.3) 0%, transparent 70%);
}
.calendar-glow.glow-2 {
  width: 130px; height: 130px; bottom: -50px; left: -40px;
  background: radial-gradient(circle, rgba(74,222,128,0.2) 0%, transparent 70%);
}

.calendar-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  gap: 10px;
}

.calendar-header { display: flex; justify-content: space-between; align-items: flex-start; }
.calendar-header-title { display: flex; align-items: flex-start; gap: 8px; min-width: 0; }
.calendar-icon {
  width: 30px; height: 30px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, rgba(59,130,246,0.25), rgba(59,130,246,0.05));
  border: 1px solid rgba(59,130,246,0.3);
  border-radius: 8px;
  color: #93c5fd;
}
.calendar-header h3 { font-family: 'Oswald', sans-serif; font-size: 0.9rem; font-weight: 600; margin: 0; letter-spacing: 0.5px; text-transform: uppercase; color: var(--color-titulos, #fff); }
.calendar-month { font-size: 10.5px; color: rgba(245, 245, 244, 0.5); font-weight: 500; }
.year-badge {
  font-family: 'Inter', sans-serif;
  color: var(--color-highlight, #3b82f6);
  font-size: 0.75rem;
  font-weight: 700;
  background: rgba(59,130,246,0.12);
  border: 1px solid rgba(59,130,246,0.3);
  padding: 2px 8px;
  border-radius: 7px;
  flex-shrink: 0;
  white-space: nowrap;
}

.calendar-progress-row { display: flex; flex-direction: column; gap: 4px; }
.progress-track { height: 5px; border-radius: 4px; background: rgba(255,255,255,0.06); overflow: hidden; }
.progress-fill {
  height: 100%;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-highlight, #3b82f6), #4ade80);
  transition: width 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.progress-label { display: flex; justify-content: space-between; font-size: 10px; color: rgba(245, 245, 244, 0.55); font-weight: 500; }
.progress-percent { color: #4ade80; font-weight: 700; }

.weekdays-row { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-size: 10px; color: rgba(245, 245, 244, 0.45); font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase; }

.days-grid-expanded {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 4px;
  flex: 1;
  align-content: center;
  min-height: 0;
}
.day-cell {
  position: relative;
  aspect-ratio: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  font-size: clamp(9px, 2.2vw, 11px);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.03);
  color: rgba(245, 245, 244, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.day-cell.vacio { background: transparent; border-color: transparent; }
.day-cell:not(.vacio):hover { transform: scale(1.1); box-shadow: 0 4px 12px rgba(0,0,0,0.35); z-index: 2; }
.day-cell.asistio { background: linear-gradient(145deg, rgba(34, 197, 94, 0.28), rgba(34, 197, 94, 0.08)); color: #4ade80; border-color: rgba(34, 197, 94, 0.4); }
.day-cell.falto { background: linear-gradient(145deg, rgba(239, 68, 68, 0.26), rgba(239, 68, 68, 0.06)); color: #f87171; border-color: rgba(239, 68, 68, 0.4); }
.day-cell.hoy { background: linear-gradient(145deg, rgba(234, 179, 8, 0.32), rgba(234, 179, 8, 0.1)); color: #facc15; border-color: rgba(234, 179, 8, 0.55); box-shadow: 0 0 12px rgba(234, 179, 8, 0.3); font-weight: 800; }
.day-cell.futuro { color: rgba(245, 245, 244, 0.28); }

.day-icon {
  position: absolute;
  bottom: 1px;
  right: 2px;
  line-height: 1;
  opacity: 0.85;
}

.hoy-ring {
  position: absolute;
  inset: -2px;
  border-radius: 9px;
  border: 1.5px solid rgba(250, 204, 21, 0.55);
  animation: pulseRing 1.8s ease-out infinite;
  pointer-events: none;
}
@keyframes pulseRing {
  0% { transform: scale(1); opacity: 0.9; }
  100% { transform: scale(1.3); opacity: 0; }
}

.calendar-legend {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
  border-top: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  padding-top: 8px;
}
.legend-item {
  display: flex; align-items: center; gap: 5px;
  font-size: 10px; color: rgba(245, 245, 244, 0.65); font-weight: 500;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.05);
  padding: 3px 8px;
  border-radius: 16px;
  white-space: nowrap;
}
.dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.dot.asistio { background: #4ade80; }
.dot.falto { background: #f87171; }
.dot.hoy { background: #facc15; }

/* --- Tarjeta de Racha y Mascotas Enriquecida (Puros SVGs) --- */
.streak-card {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.16) 0%, rgba(18, 18, 18, 0.9) 55%);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(236, 72, 153, 0.3);
  border-radius: var(--app-border-radius, 24px);
  padding: 16px 18px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: 100%;
  overflow: hidden;
}
.streak-header-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 10px; }
.streak-title-group { display: flex; flex-direction: column; min-width: 0; }
.streak-title-group .section-subtitle-small { margin-top: 0; margin-bottom: 2px; }
.streak-sub { font-size: 10.5px; color: rgba(245, 245, 244, 0.6); font-weight: 400; display: block; }

.streak-number-wrapper { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.streak-number { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 1.8rem; color: #f5f5f4; line-height: 1; text-shadow: 0 4px 20px rgba(0, 0, 0, 0.6); }
.fire-icon { font-size: 1.3rem; filter: drop-shadow(0 0 8px #facc15); display: flex; align-items: center; }

.streak-extra-banner {
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(236, 72, 153, 0.15);
  padding: 5px 10px;
  border-radius: 10px;
}
.streak-status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  color: #f5f5f4;
}
.status-indicator-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f87171;
  box-shadow: 0 0 6px #f87171;
}
.status-indicator-dot.active {
  background: #4ade80;
  box-shadow: 0 0 6px #4ade80;
}
.streak-motivation-tip {
  font-size: 8.5px;
  color: rgba(245, 245, 244, 0.55);
}

.mascotas-wrapper-flex {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 0;
}

.streak-bottom-analytics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}
.analytics-mini-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 6px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.analytics-label { font-size: 8.5px; color: rgba(245, 245, 244, 0.5); text-transform: uppercase; font-weight: 600; }
.analytics-value { font-size: 11px; font-weight: 700; color: #f5f5f4; display: flex; align-items: center; }
.analytics-value.accent { color: #f472b6; }

.next-pet-progress-container {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(236, 72, 153, 0.12);
  border-radius: 8px;
  padding: 6px 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.next-pet-info-header {
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: rgba(245, 245, 244, 0.6);
  font-weight: 600;
}
.next-pet-pct { color: #f472b6; font-weight: 700; }
.next-pet-track { height: 4px; border-radius: 4px; background: rgba(255,255,255,0.06); overflow: hidden; }
.next-pet-fill { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #ec4899, #f43f5e); }

@keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes pulseFlame { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.12); opacity: 0.9; } }
.animate-bounce { animation: bounceSlow 2.5s ease-in-out infinite; }
.animate-pulse { animation: pulseFlame 1.8s ease-in-out infinite; display: inline-block; }

/* --- Tarjetas Genéricas para Gráficas --- */
.chart-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 20px);
  padding: 18px 20px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.chart-card > * { max-height: 100%; }

@media (prefers-reduced-motion: reduce) {
  .hoy-ring { animation: none; }
  .animate-bounce, .animate-pulse { animation: none; }
  .progress-fill, .next-pet-fill { transition: none; }
}
</style>
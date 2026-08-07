<template>
  <div class="form-panel glass-effect">
    <div class="panel-header">
      <div class="title-group">
        <h2 class="form-title">{{ t('attendanceTitle') }} <span class="highlight">{{ t('attendanceHighlight') }}</span></h2>
        <p class="form-subtitle">{{ t('attendanceSubtitle') }}</p>
      </div>
      <button class="close-x" @click="$emit('close')" :aria-label="t('close')">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="form-body">
      <!-- Comparativa Mes a Mes -->
      <div class="comparison-container">
        
        <!-- Mes anterior -->
        <div class="month-block">
          <div class="month-header-info">
            <span class="month-label">{{ t('prevMonth') }}</span>
            <span class="month-stat">{{ totalMesAnterior }} {{ t('totalSuffix') }}</span>
          </div>
          <div class="bars-wrapper">
            <div 
              v-for="(day, index) in mesAnterior" 
              :key="'prev-' + index" 
              class="day-bar" 
              :style="{ height: day.value + '%' }"
              :title="`${t('dayLabel')} ${index + 1}: ${day.value}%`"
            ></div>
          </div>
        </div>
        
        <!-- Mes actual -->
        <div class="month-block">
          <div class="month-header-info">
            <span class="month-label active-label">{{ t('currMonth') }}</span>
            <span class="month-stat highlight-stat">{{ totalMesActual }} {{ t('totalSuffix') }}</span>
          </div>
          <div class="bars-wrapper active-month">
            <div 
              v-for="(day, index) in mesActual" 
              :key="'curr-' + index" 
              class="day-bar" 
              :style="{ height: day.value + '%' }"
              :title="`${t('dayLabel')} ${index + 1}: ${day.value}%`"
            ></div>
          </div>
        </div>

      </div>

      <div class="total-summary">
        <div class="summary-item">
          <span>{{ t('dailyAverage') }}</span>
          <strong>{{ promedioActual }} {{ t('attendanceSuffix') }}</strong>
        </div>
        <div class="summary-item text-right">
          <span>{{ t('growth') }}</span>
          <strong :class="porcentajeCrecimiento >= 0 ? 'text-success' : 'text-danger'">
            {{ porcentajeCrecimiento >= 0 ? '+' : '' }}{{ porcentajeCrecimiento }}%
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';

const settings = reactive({
  idioma: localStorage.getItem('app-idioma') || 'es'
});

const translations: Record<string, Record<string, string>> = {
  es: {
    attendanceTitle: "ASISTENCIA",
    attendanceHighlight: "(COMPARATIVA)",
    attendanceSubtitle: "Comportamiento diario vs. mes anterior",
    close: "Cerrar modal",
    prevMonth: "Mes Anterior",
    currMonth: "Mes Actual",
    totalSuffix: "total",
    dayLabel: "Día",
    dailyAverage: "Promedio Diario",
    attendanceSuffix: "asistencias",
    growth: "Crecimiento"
  },
  en: {
    attendanceTitle: "ATTENDANCE",
    attendanceHighlight: "(COMPARATIVE)",
    attendanceSubtitle: "Daily behavior vs. previous month",
    close: "Close modal",
    prevMonth: "Previous Month",
    currMonth: "Current Month",
    totalSuffix: "total",
    dayLabel: "Day",
    dailyAverage: "Daily Average",
    attendanceSuffix: "attendances",
    growth: "Growth"
  }
};

const t = (key: string) => {
  return translations[settings.idioma]?.[key] || translations['es']?.[key] || key;
};

const emit = defineEmits(['close']);

const generarDatos = () => Array.from({ length: 30 }, () => ({ value: Math.floor(Math.random() * 80) + 20 }));

const mesAnterior = ref(generarDatos());
const mesActual = ref(generarDatos());

// Cálculos dinámicos reales basados en los datos generados
const totalMesAnterior = computed(() => mesAnterior.value.reduce((acc, curr) => acc + curr.value, 0));
const totalMesActual = computed(() => mesActual.value.reduce((acc, curr) => acc + curr.value, 0));

const promedioActual = computed(() => Math.round(totalMesActual.value / mesActual.value.length));

const porcentajeCrecimiento = computed(() => {
  const prev = totalMesAnterior.value;
  const curr = totalMesActual.value;
  if (prev === 0) return 0;
  return Math.round(((curr - prev) / prev) * 100);
});

onMounted(() => {
  window.addEventListener('idioma-changed', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.idioma) settings.idioma = customEvent.detail.idioma;
  });
});
</script>

<style scoped>
.form-panel { 
  background: var(--bg-cards, #121214); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08)); 
  color: var(--color-texto-general, #fff); 
  border-radius: var(--app-border-radius, 20px); 
  padding: 24px; 
  width: 95%; 
  max-width: 480px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.panel-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 22px; 
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.form-title { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.15rem; 
  letter-spacing: 0.8px; 
  margin: 0;
  color: var(--color-titulos, #fff);
}

.form-subtitle {
  font-size: 0.78rem;
  color: var(--color-texto-secundario, #888);
  margin: 0;
}

/* Contenedor de comparación */
.comparison-container { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
}

.month-block { 
  display: flex; 
  flex-direction: column; 
  gap: 6px; 
}

.month-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-label { 
  font-size: 0.72rem; 
  color: var(--color-texto-secundario, #888); 
  text-transform: uppercase; 
  letter-spacing: 0.5px; 
  font-weight: 600;
}

.active-label {
  color: var(--color-highlight, #60a5fa);
}

.month-stat {
  font-size: 0.75rem;
  color: var(--color-texto-secundario, #aaa);
}

.highlight-stat {
  color: var(--color-titulos, #fff);
  font-weight: 500;
}

.bars-wrapper { 
  display: flex; 
  align-items: flex-end; 
  gap: 3px; 
  height: 85px; 
  background: var(--bg-input, #09090b); 
  padding: 10px 8px; 
  border-radius: var(--app-border-radius, 12px); 
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.04));
}

.active-month { 
  border-color: rgba(59, 130, 246, 0.3); 
  background: linear-gradient(to bottom, var(--bg-input, #09090b), #0d1224);
}

.day-bar { 
  flex: 1; 
  background: #27272a; 
  border-radius: 2px; 
  min-width: 3px; 
  transition: height 0.3s ease, background 0.2s;
}

.day-bar:hover {
  background: var(--color-texto-secundario, #71717a);
}

.active-month .day-bar { 
  background: var(--color-highlight, #3b82f6); 
}

.active-month .day-bar:hover { 
  background: #60a5fa; 
}

/* Footer / Resumen */
.total-summary { 
  display: flex; 
  justify-content: space-between; 
  border-top: 1px solid rgba(255, 255, 255, 0.06); 
  margin-top: 20px; 
  padding-top: 16px; 
}

.summary-item span { 
  font-size: 0.72rem; 
  color: var(--color-texto-secundario, #888); 
  display: block; 
  margin-bottom: 2px;
}

.summary-item strong { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.1rem; 
  color: var(--color-titulos, #fff); 
  letter-spacing: 0.5px;
}

.text-right {
  text-align: right;
}

.text-success { color: #34d399 !important; }
.text-danger { color: #f87171 !important; }
.highlight { color: var(--color-highlight, #3b82f6); }
.close-x { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  color: var(--color-texto-secundario, #aaa); 
  cursor: pointer; 
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-x:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-titulos, #fff);
}
</style>
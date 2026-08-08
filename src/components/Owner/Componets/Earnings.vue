<template>
  <div class="form-panel glass-effect">
    <div class="panel-header">
      <div class="title-group">
        <h2 class="form-title">{{ t('incomeTitle') }} <span class="highlight">{{ t('incomeHighlight') }}</span></h2>
        <p class="form-subtitle">{{ t('incomeSubtitle') }}</p>
      </div>
      <button class="close-x" @click="$emit('close')" :aria-label="t('close')">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <div class="form-body">
      <!-- Gráfica optimizada -->
      <div class="chart-container">
        <div v-for="mes in dataIngresos" :key="mes.nombre" class="bar-col">
          <div class="bar-track">
            <!-- Tooltip dinámico mejorado que se muestra en hover -->
            <div class="tooltip-badge">{{ mes.valor }}</div>
            <div class="bar-fill" :style="{ height: mes.porcentaje + '%' }"></div>
          </div>
          <span class="month-label">{{ getLocalizedMonth(mes.nombre) }}</span>
        </div>
      </div>

      <!-- Footer con estadísticas dinámicas -->
      <div class="stats-grid">
        <div class="total-stats">
          <span class="label">{{ t('monthlyAverage') }}</span>
          <span class="value">{{ promedioMensual }}</span>
        </div>
        <div class="total-stats">
          <span class="label">{{ t('highestPeak') }}</span>
          <span class="value text-success">{{ maxIngreso }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue';

interface IngresoItem {
  nombre: string;
  porcentaje: number;
  valor: string;
}

const emit = defineEmits(['close']);

const settings = reactive({
  idioma: localStorage.getItem('owner-idioma') || 'es'
});

const translations: Record<string, Record<string, string>> = {
  es: {
    incomeTitle: "INGRESOS",
    incomeHighlight: "(ÚLTIMOS 12 MESES)",
    incomeSubtitle: "Comportamiento financiero anual",
    close: "Cerrar modal",
    monthlyAverage: "Promedio mensual",
    highestPeak: "Pico más alto"
  },
  en: {
    incomeTitle: "INCOME",
    incomeHighlight: "(LAST 12 MONTHS)",
    incomeSubtitle: "Annual financial performance",
    close: "Close modal",
    monthlyAverage: "Monthly average",
    highestPeak: "Highest peak"
  }
};

const monthMap: Record<string, Record<string, string>> = {
  es: { Ene: 'Ene', Feb: 'Feb', Mar: 'Mar', Abr: 'Abr', May: 'May', Jun: 'Jun', Jul: 'Jul', Ago: 'Ago', Sep: 'Sep', Oct: 'Oct', Nov: 'Nov', Dic: 'Dic' },
  en: { Ene: 'Jan', Feb: 'Feb', Mar: 'Mar', Abr: 'Apr', May: 'May', Jun: 'Jun', Jul: 'Jul', Ago: 'Aug', Sep: 'Sep', Oct: 'Oct', Nov: 'Nov', Dic: 'Dec' }
};

const t = (key: string) => {
  return translations[settings.idioma]?.[key] || translations['es']?.[key] || key;
};

const getLocalizedMonth = (nombre: string) => {
  return monthMap[settings.idioma]?.[nombre] || monthMap['es']?.[nombre] || nombre;
};

const dataIngresos = ref<IngresoItem[]>([
  { nombre: 'Ene', porcentaje: 35, valor: '$9k' }, { nombre: 'Feb', porcentaje: 60, valor: '$15k' },
  { nombre: 'Mar', porcentaje: 40, valor: '$10k' }, { nombre: 'Abr', porcentaje: 85, valor: '$21k' },
  { nombre: 'May', porcentaje: 55, valor: '$13k' }, { nombre: 'Jun', porcentaje: 75, valor: '$18k' },
  { nombre: 'Jul', porcentaje: 50, valor: '$12k' }, { nombre: 'Ago', porcentaje: 30, valor: '$7k' },
  { nombre: 'Sep', porcentaje: 65, valor: '$16k' }, { nombre: 'Oct', porcentaje: 90, valor: '$22k' },
  { nombre: 'Nov', porcentaje: 55, valor: '$13k' }, { nombre: 'Dic', porcentaje: 70, valor: '$17k' }
]);

// Cálculo automático del promedio basado en los valores numéricos extraídos
const promedioMensual = computed(() => {
  const suma = dataIngresos.value.reduce((acc, curr) => {
    const num = parseInt(curr.valor.replace('$', '').replace('k', '')) * 1000;
    return acc + num;
  }, 0);
  const promedio = Math.round(suma / dataIngresos.value.length);
  const locale = settings.idioma === 'en' ? 'en-US' : 'es-MX';
  return `$${promedio.toLocaleString(locale)}.00`;
});

// Identificar el valor máximo para mostrarlo como pico más alto
const maxIngreso = computed(() => {
  const valoresNum = dataIngresos.value.map(curr => parseInt(curr.valor.replace('$', '').replace('k', '')) * 1000);
  const max = Math.max(...valoresNum);
  return `$${(max / 1000).toFixed(0)}k`;
});

onMounted(() => {
  window.addEventListener('idioma-changed', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.idioma) settings.idioma = customEvent.detail.idioma;
  });
});
</script>

<style scoped>
.highlight { color: var(--color-highlight, #3b82f6); }

.form-panel { 
  background: var(--bg-cards, #121214); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08)); 
  color: var(--color-texto-general, #fff); 
  border-radius: var(--app-border-radius, 20px); 
  padding: 24px; 
  width: 95%; 
  max-width: 500px; 
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
  color: var(--color-titulos, #fff); 
  margin: 0; 
  letter-spacing: 0.8px; 
}

.form-subtitle {
  font-size: 0.78rem;
  color: var(--color-texto-secundario, #888);
  margin: 0;
}

/* Contenedor de gráfica optimizado */
.chart-container { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-end; 
  height: 180px; 
  gap: 6px; 
  margin-bottom: 20px;
  background: var(--bg-input, #09090b);
  padding: 16px 12px 10px 12px;
  border-radius: var(--app-border-radius, 12px);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.04));
}

.bar-col { 
  display: flex; 
  flex-direction: column; 
  align-items: center; 
  flex: 1; 
  height: 100%;
}

.bar-track { 
  width: 100%; 
  height: 100%; 
  background: rgba(255, 255, 255, 0.02); 
  border-radius: 6px; 
  position: relative; 
  display: flex;
  align-items: flex-end;
}

.bar-fill { 
  width: 100%; 
  background: var(--color-highlight, linear-gradient(to top, #1c4fd6, #3b82f6)); 
  border-radius: 6px; 
  transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1), background 0.2s;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.25);
}

.bar-track:hover .bar-fill {
  background: linear-gradient(to top, #2563eb, #60a5fa);
}

/* Tooltip elegante al pasar el cursor */
.tooltip-badge {
  position: absolute;
  top: -26px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: #1e1e24;
  color: var(--color-texto-general, #fff);
  font-size: 0.65rem;
  font-family: 'Oswald', sans-serif;
  padding: 2px 5px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  white-space: nowrap;
  pointer-events: none;
  z-index: 10;
}

.bar-track:hover .tooltip-badge {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0);
}

.month-label { 
  font-size: 9px; 
  color: var(--color-texto-secundario, #888); 
  margin-top: 8px; 
  font-family: 'Oswald', sans-serif; 
  text-transform: uppercase; 
  letter-spacing: 0.5px;
  transition: color 0.2s;
}

.bar-col:hover .month-label {
  color: var(--color-titulos, #fff);
}

/* Grid de Estadísticas Inferiores */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.total-stats { 
  background: var(--bg-input, #09090b); 
  padding: 14px 16px; 
  border-radius: var(--app-border-radius, 12px); 
  display: flex; 
  flex-direction: column;
  gap: 4px;
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.04));
}

.total-stats .label { 
  color: var(--color-texto-secundario, #888); 
  font-size: 0.72rem; 
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
}

.total-stats .value { 
  color: var(--color-highlight, #60a5fa); 
  font-weight: bold; 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.15rem; 
  letter-spacing: 0.5px;
}

.text-success { color: #34d399 !important; }

@media (max-width: 480px) {
  .chart-container { height: 150px; gap: 4px; padding: 12px 6px 8px 6px; }
  .month-label { font-size: 8px; }
  .form-panel { padding: 18px; }
  .stats-grid { grid-template-columns: 1fr; }
}

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
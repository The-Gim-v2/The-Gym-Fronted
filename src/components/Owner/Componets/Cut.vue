<template>
  <div class="form-panel glass-effect">
    <NotificationSystem ref="toastRef" />
    
    <div class="panel-header">
      <div class="title-group">
        <h2 class="form-title">{{ t('addTitle') }} <span class="highlight">{{ t('addHighlight') }}</span></h2>
        <p class="form-subtitle">{{ t('addSubtitle') }}</p>
      </div>
      <button class="close-x" @click="$emit('close')" :aria-label="t('close')">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <div class="form-body">
      <!-- Selectores de tiempo -->
      <div class="time-row">
        <div class="input-group">
          <label>{{ t('start') }}</label>
          <select v-model.number="form.inicio" class="custom-select">
            <option v-for="n in 31" :key="'in-' + n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="input-group">
          <label>{{ t('end') }}</label>
          <select v-model.number="form.termino" class="custom-select">
            <option v-for="n in 31" :key="'ter-' + n" :value="n">{{ n }}</option>
          </select>
        </div>
        <div class="input-group">
          <label>{{ t('cutoff') }}</label>
          <select v-model.number="form.corte" class="custom-select">
            <option v-for="n in 31" :key="'cor-' + n" :value="n">{{ n }}</option>
          </select>
        </div>
      </div>
      
      <!-- Fila de Tipo de Pago y Acción -->
      <div class="payment-row">
        <div class="input-group" style="flex: 1">
          <label>{{ t('paymentType') }}</label>
          <select v-model="form.tipo" class="custom-select">
            <option value="Mensual">{{ t('monthly') }}</option>
            <option value="Quincenal">{{ t('biweekly') }}</option>
          </select>
        </div>
        <button class="btn-save" @click="addCorte" :title="t('addBtnTitle')">+</button>
      </div>

      <!-- Lista de elementos guardados -->
      <div v-if="cortes.length > 0" class="saved-box">
        <div class="saved-header">{{ t('activeConfigs') }}</div>
        <div v-for="(item, index) in cortes" :key="index" class="saved-item">
          <div class="item-info">
            <span class="range-badge">{{ item.inicio }} - {{ item.termino }}</span>
            <span class="type-badge" :class="item.tipo === 'Mensual' ? 'badge-mes' : 'badge-quin'">
              {{ item.tipo === 'Mensual' ? t('monthly') : t('biweekly') }}
            </span>
            <span class="corte-badge">{{ t('cutoffLabel') }}: <strong>{{ item.corte }}</strong></span>
          </div>
          <button class="icon-del" @click="removeCorte(index)" :title="t('delete')">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Calendario visualizador -->
      <div class="calendar-section">
        <div class="calendar-header-info">
          <span>{{ t('previewMonth') }}</span>
          <div class="calendar-legend">
            <span class="legend-item"><span class="dot dot-corte"></span> {{ t('cutoff') }}</span>
            <span class="legend-item"><span class="dot dot-mes"></span> {{ t('monthly') }}</span>
            <span class="legend-item"><span class="dot dot-quin"></span> {{ t('biweekly') }}</span>
          </div>
        </div>
        <div class="calendar-grid">
          <div 
            v-for="n in 31" 
            :key="n" 
            :class="['cal-day', getDayClass(n)]"
            :title="`${t('dayLabel')} ${n}`"
          >
            {{ n }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

interface CorteItem {
  inicio: number;
  termino: number;
  corte: number;
  tipo: string;
}

const settings = reactive({
  idioma: localStorage.getItem('owner-idioma') || 'es'
});

const translations: Record<string, Record<string, string>> = {
  es: {
    addTitle: "AGREGAR",
    addHighlight: "CORTE",
    addSubtitle: "Configuración de periodos y pagos",
    close: "Cerrar modal",
    start: "Inicio",
    end: "Término",
    cutoff: "Corte",
    paymentType: "Tipo de Pago",
    monthly: "Mensual",
    biweekly: "Quincenal",
    addBtnTitle: "Agregar corte",
    activeConfigs: "Configuraciones activas",
    cutoffLabel: "Corte",
    delete: "Eliminar",
    previewMonth: "Vista previa del mes",
    dayLabel: "Día",
    duplicateError: "Error: Configuración ya existente",
    successMsg: "Corte guardado con éxito",
    deleteMsg: "Corte eliminado"
  },
  en: {
    addTitle: "ADD",
    addHighlight: "CUTOFF",
    addSubtitle: "Periods and payments configuration",
    close: "Close modal",
    start: "Start",
    end: "End",
    cutoff: "Cutoff",
    paymentType: "Payment Type",
    monthly: "Monthly",
    biweekly: "Biweekly",
    addBtnTitle: "Add cutoff",
    activeConfigs: "Active configurations",
    cutoffLabel: "Cutoff",
    delete: "Delete",
    previewMonth: "Month preview",
    dayLabel: "Day",
    duplicateError: "Error: Configuration already exists",
    successMsg: "Cutoff saved successfully",
    deleteMsg: "Cutoff deleted"
  }
};

const t = (key: string) => {
  return translations[settings.idioma]?.[key] || translations['es']?.[key] || key;
};

const form = reactive<CorteItem>({ inicio: 1, termino: 15, corte: 2, tipo: 'Mensual' });
const cortes = ref<CorteItem[]>([]);
const toastRef = ref<any>(null);

const addCorte = () => {
  const isDuplicate = cortes.value.some(c => 
    c.tipo === form.tipo || 
    c.inicio === form.inicio || 
    c.termino === form.termino || 
    c.corte === form.corte
  );

  if (isDuplicate) {
    if (toastRef.value?.notify) {
      toastRef.value.notify(t('duplicateError'), 'error');
    }
    return;
  }
  
  cortes.value.push({ ...form });
  if (toastRef.value?.notify) {
    toastRef.value.notify(t('successMsg'), 'success');
  }
};

const removeCorte = (index: number) => {
  cortes.value.splice(index, 1);
  if (toastRef.value?.notify) {
    toastRef.value.notify(t('deleteMsg'), 'info');
  }
};

const getDayClass = (n: number) => {
  const corteMatch = cortes.value.find(c => Number(c.corte) === n);
  if (corteMatch) return 'is-corte';
  
  const rangeMatch = cortes.value.find(c => n >= c.inicio && n <= c.termino);
  if (!rangeMatch) return 'default-bg';
  
  return rangeMatch.tipo === 'Mensual' ? 'mes' : 'quin';
};

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
  color: var(--color-texto-general, #f5f5f4); 
  border-radius: var(--app-border-radius, 20px); 
  padding: 24px; 
  width: 95%; 
  max-width: 460px; 
  max-height: 90vh; 
  overflow-y: auto; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.panel-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 20px; 
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
  letter-spacing: 0.8px;
  margin: 0;
}

.form-subtitle {
  font-size: 0.78rem;
  color: var(--color-texto-secundario, #888);
  margin: 0;
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
}

.time-row { 
  display: grid; 
  grid-template-columns: repeat(3, 1fr); 
  gap: 10px; 
  margin-bottom: 12px;
}

.payment-row { 
  display: flex; 
  gap: 10px; 
  align-items: flex-end; 
  margin-bottom: 16px; 
}

.input-group label { 
  font-family: 'Oswald', sans-serif; 
  font-size: 0.72rem; 
  text-transform: uppercase; 
  display: block; 
  margin-bottom: 5px; 
  color: var(--color-texto-secundario, #888);
  letter-spacing: 0.5px;
  font-weight: 600;
}

.custom-select { 
  background: var(--bg-input, #09090b); 
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.08)); 
  color: var(--color-texto-input, var(--color-texto-general, white)); 
  padding: 10px 8px; 
  border-radius: var(--app-border-radius, 10px); 
  width: 100%; 
  font-size: 0.85rem; 
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
  cursor: pointer;
}

.custom-select:focus {
  border-color: var(--color-highlight, rgba(59, 130, 246, 0.5));
  background: var(--bg-cards, rgba(255, 255, 255, 0.02));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.saved-box { 
  background: var(--bg-input, #09090b); 
  padding: 12px 14px; 
  border-radius: var(--app-border-radius, 12px); 
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.04)); 
  margin-bottom: 16px; 
}

.saved-header {
  font-size: 0.72rem;
  text-transform: uppercase;
  color: var(--color-texto-secundario, #888);
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.saved-item { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  font-size: 0.85rem;
}

.saved-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.range-badge {
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.type-badge {
  font-size: 0.65rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-mes { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.badge-quin { background: rgba(34, 197, 94, 0.2); color: #4ade80; }

.corte-badge {
  font-size: 0.75rem;
  color: #fbbf24;
}

.btn-save { 
  background: var(--color-highlight, linear-gradient(135deg, #2563eb, #1d4ed8)); 
  color: white; 
  border: none; 
  border-radius: var(--app-border-radius, 10px); 
  cursor: pointer; 
  height: 41px; 
  width: 46px; 
  font-size: 20px; 
  font-weight: bold; 
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  transition: opacity 0.2s, transform 0.1s;
}

.btn-save:hover { opacity: 0.92; }
.btn-save:active { transform: scale(0.95); }

/* Calendario Estilos */
.calendar-section {
  background: var(--bg-input, #09090b);
  padding: 12px 14px;
  border-radius: var(--app-border-radius, 12px);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.04));
}

.calendar-header-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  font-size: 0.72rem;
  color: var(--color-texto-secundario, #888);
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-legend {
  display: flex;
  gap: 8px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 0.65rem;
  color: var(--color-texto-secundario, #aaa);
  text-transform: none;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.dot-corte { background: #fbbf24; }
.dot-mes { background: #3b82f6; }
.dot-quin { background: #22c55e; }

.calendar-grid { 
  display: grid; 
  grid-template-columns: repeat(7, 1fr); 
  gap: 5px; 
}

.cal-day { 
  padding: 6px 2px; 
  border-radius: 6px; 
  text-align: center; 
  font-size: 11px; 
  font-weight: bold; 
  font-family: 'Oswald', sans-serif; 
  transition: transform 0.1s;
}

@media (max-width: 480px) {
  .form-panel { padding: 16px; }
  .form-title { font-size: 1.05rem; }
  .custom-select { padding: 8px 4px; font-size: 0.8rem; }
  .cal-day { padding: 5px 1px; font-size: 10px; }
}

/* Colores de estados del calendario */
.is-corte { background: #fbbf24 !important; color: #000 !important; font-weight: bold; box-shadow: 0 0 8px rgba(251, 191, 36, 0.4); }
.mes { background: #1d4ed8; color: white; }
.quin { background: #15803d; color: white; }
.default-bg { background: #18181b; color: var(--color-texto-secundario, #52525b); border: 1px solid rgba(255, 255, 255, 0.02); }

.icon-del { 
  background: rgba(239, 68, 68, 0.1); 
  border: none; 
  color: #f87171; 
  cursor: pointer; 
  width: 26px;
  height: 26px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.icon-del:hover {
  background: rgba(239, 68, 68, 0.2);
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
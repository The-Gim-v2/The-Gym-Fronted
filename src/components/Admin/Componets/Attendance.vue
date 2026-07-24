<template>
  <div class="form-panel glass-effect">
    <div class="panel-header">
      <div class="title-group">
        <h2 class="form-title">ASISTENCIA <span class="highlight">(COMPARATIVA)</span></h2>
        <p class="form-subtitle">Comportamiento diario vs. mes anterior</p>
      </div>
      <button class="close-x" @click="$emit('close')" aria-label="Cerrar modal">
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
            <span class="month-label">Mes Anterior</span>
            <span class="month-stat">{{ totalMesAnterior }} total</span>
          </div>
          <div class="bars-wrapper">
            <div 
              v-for="(day, index) in mesAnterior" 
              :key="'prev-' + index" 
              class="day-bar" 
              :style="{ height: day.value + '%' }"
              :title="`Día ${index + 1}: ${day.value}%`"
            ></div>
          </div>
        </div>
        
        <!-- Mes actual -->
        <div class="month-block">
          <div class="month-header-info">
            <span class="month-label active-label">Mes Actual</span>
            <span class="month-stat highlight-stat">{{ totalMesActual }} total</span>
          </div>
          <div class="bars-wrapper active-month">
            <div 
              v-for="(day, index) in mesActual" 
              :key="'curr-' + index" 
              class="day-bar" 
              :style="{ height: day.value + '%' }"
              :title="`Día ${index + 1}: ${day.value}%`"
            ></div>
          </div>
        </div>

      </div>

      <div class="total-summary">
        <div class="summary-item">
          <span>Promedio Diario</span>
          <strong>{{ promedioActual }} asistencias</strong>
        </div>
        <div class="summary-item text-right">
          <span>Crecimiento</span>
          <strong :class="porcentajeCrecimiento >= 0 ? 'text-success' : 'text-danger'">
            {{ porcentajeCrecimiento >= 0 ? '+' : '' }}{{ porcentajeCrecimiento }}%
          </strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

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
</script>

<style scoped>
.form-panel { 
  background: #121214; 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  color: white; 
  border-radius: 20px; 
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
  color: #fff;
}

.form-subtitle {
  font-size: 0.78rem;
  color: #888;
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
  color: #888; 
  text-transform: uppercase; 
  letter-spacing: 0.5px; 
  font-weight: 600;
}

.active-label {
  color: #60a5fa;
}

.month-stat {
  font-size: 0.75rem;
  color: #aaa;
}

.highlight-stat {
  color: #fff;
  font-weight: 500;
}

.bars-wrapper { 
  display: flex; 
  align-items: flex-end; 
  gap: 3px; 
  height: 85px; 
  background: #09090b; 
  padding: 10px 8px; 
  border-radius: 12px; 
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.active-month { 
  border-color: rgba(59, 130, 246, 0.3); 
  background: linear-gradient(to bottom, #09090b, #0d1224);
}

.day-bar { 
  flex: 1; 
  background: #27272a; 
  border-radius: 2px; 
  min-width: 3px; 
  transition: height 0.3s ease, background 0.2s;
}

.day-bar:hover {
  background: #71717a;
}

.active-month .day-bar { 
  background: #3b82f6; 
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
  color: #888; 
  display: block; 
  margin-bottom: 2px;
}

.summary-item strong { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.1rem; 
  color: #fff; 
  letter-spacing: 0.5px;
}

.text-right {
  text-align: right;
}

.text-success { color: #34d399 !important; }
.text-danger { color: #f87171 !important; }
.highlight { color: #3b82f6; }
.close-x { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  color: #aaa; 
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
  color: #fff;
}
</style>
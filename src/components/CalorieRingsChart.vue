<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  data: { type: Array, required: true }, // [{ label: 'S1', value: 1850 }, ...]
  color: { type: String, default: '#f97316' },
  unit: { type: String, default: 'kcal' },
  max: { type: Number, default: null },
  titulo: { type: String, default: '' },
});

/* ---------------- IDIOMA (es/en) ---------------- */
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');
const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) currentLang.value = e.detail.idioma;
};
onMounted(() => window.addEventListener('idioma-changed', handleLangChange));
onUnmounted(() => window.removeEventListener('idioma-changed', handleLangChange));

const traducciones = {
  es: { prom: 'Prom.', mejor: 'Mejor semana', total: 'Total acumulado' },
  en: { prom: 'Avg.', mejor: 'Best week', total: 'Total accumulated' },
};
const t = computed(() => traducciones[currentLang.value] || traducciones.es);

const uid = `rc-${Math.random().toString(36).slice(2, 9)}`;
const hoverIndex = ref(null);

const RADIO = 24;
const CIRC = 2 * Math.PI * RADIO;

const maxFinal = computed(() => props.max ?? Math.max(...props.data.map(d => d.value), 1));

const promedio = computed(() => {
  const total = props.data.reduce((acc, d) => acc + d.value, 0);
  return total / props.data.length;
});

const totalGeneral = computed(() => {
  return props.data.reduce((acc, d) => acc + d.value, 0);
});

const mejorIndex = computed(() => {
  let idx = 0;
  props.data.forEach((d, i) => { if (d.value > props.data[idx].value) idx = i; });
  return idx;
});

const anillos = computed(() =>
  props.data.map((d, i) => {
    const frac = Math.min(1, d.value / maxFinal.value);
    return {
      ...d,
      frac,
      dashArray: `${frac * CIRC} ${CIRC}`,
      esMejor: i === mejorIndex.value,
      idx: i,
    };
  })
);
</script>

<template>
  <div class="ring-chart-block">
    <div v-if="titulo" class="chart-top-row">
      <div class="title-wrapper">
        <span class="fire-icon-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#facc15" stroke="#f97316" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 4-4 7-4 11a4 4 0 0 0 8 0c0-2-.5-3.5-1.5-5C15.5 10 16 12 16 12s2-2 2-4c0-3.5-3-6-6-6z"/></svg>
        </span>
        <span class="chart-titulo">{{ titulo }}</span>
      </div>
      <div class="chart-avg-badge">
        <span class="avg-label">{{ t.prom }}:</span>
        <span class="avg-value">{{ Math.round(promedio) }} <small>{{ unit }}</small></span>
      </div>
    </div>

    <div class="rings-container-scroll">
      <div class="rings-row">
        <div
          v-for="a in anillos" :key="a.idx"
          class="ring-col"
          @mouseenter="hoverIndex = a.idx"
          @mouseleave="hoverIndex = null"
          @click="hoverIndex = a.idx"
        >
          <div class="ring-svg-wrap" :class="{ activo: hoverIndex === a.idx, mejor: a.esMejor }">
            <svg viewBox="0 0 56 56" class="ring-svg">
              <defs>
                <linearGradient :id="`${uid}-grad-${a.idx}`" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" :stop-color="a.esMejor ? '#fde047' : '#fb923c'" />
                  <stop offset="100%" :stop-color="a.esMejor ? '#ea580c' : '#c2410c'" />
                </linearGradient>
                <filter :id="`${uid}-glow-${a.idx}`" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2.5" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <circle cx="28" cy="28" :r="RADIO" class="ring-track" />

              <circle
                cx="28" cy="28" :r="RADIO"
                fill="none"
                :stroke="`url(#${uid}-grad-${a.idx})`"
                :stroke-width="hoverIndex === a.idx ? 7 : 5.5"
                stroke-linecap="round"
                :stroke-dasharray="a.dashArray"
                transform="rotate(-90 28 28)"
                class="ring-arc"
                :filter="a.esMejor || hoverIndex === a.idx ? `url(#${uid}-glow-${a.idx})` : null"
              />
            </svg>
            <div class="ring-center">
              <span class="ring-flame" v-if="a.esMejor">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="#facc15" stroke="#f97316" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c0 4-4 7-4 11a4 4 0 0 0 8 0c0-2-.5-3.5-1.5-5C15.5 10 16 12 16 12s2-2 2-4c0-3.5-3-6-6-6z"/></svg>
              </span>
              <span class="ring-value">{{ a.value >= 1000 ? (a.value / 1000).toFixed(1) + 'k' : a.value }}</span>
            </div>
          </div>
          <span class="ring-label" :class="{ activo: hoverIndex === a.idx }">{{ a.label }}</span>
        </div>
      </div>
    </div>

    <div class="stats-footer" v-if="anillos[mejorIndex]">
      <div class="stat-item mejor-info">
        <span class="dot-mejor"></span>
        <span class="stat-text">{{ t.mejor }}: <strong>{{ anillos[mejorIndex].label }}</strong></span>
        <span class="stat-highlight">({{ anillos[mejorIndex].value }} {{ unit }})</span>
      </div>
      <div class="stat-item total-info">
        <span class="stat-text">{{ t.total }}: <strong>{{ totalGeneral.toLocaleString() }} {{ unit }}</strong></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ring-chart-block {
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  box-shadow: none;
  box-sizing: border-box;
}

.chart-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 6px;
}

.fire-icon-title {
  display: flex;
  align-items: center;
}

.chart-titulo {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(245, 245, 244, 0.8);
}

.chart-avg-badge {
  background: rgba(249, 115, 22, 0.12);
  border: 1px solid rgba(249, 115, 22, 0.3);
  padding: 3px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.avg-label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: #fdba74;
  font-weight: 500;
}

.avg-value {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: #fb923c;
}
.avg-value small {
  font-size: 8px;
  font-weight: 600;
}

.rings-container-scroll {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
  padding-bottom: 6px;
}
.rings-container-scroll::-webkit-scrollbar {
  height: 4px;
}
.rings-container-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
}

.rings-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  min-width: max-content;
}

.ring-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  flex: 0 0 auto;
  width: 44px;
  padding: 4px 0;
  transition: transform 0.2s ease;
}
.ring-col:hover {
  transform: translateY(-2px);
}

.ring-svg-wrap {
  position: relative;
  width: 44px;
  height: 44px;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.ring-svg-wrap.activo {
  transform: scale(1.15);
}
.ring-svg-wrap.mejor {
  filter: drop-shadow(0 0 8px rgba(250, 204, 21, 0.45));
}

.ring-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.06);
  stroke-width: 5.5;
}

.ring-arc {
  animation: dibujarAnillo 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
@keyframes dibujarAnillo {
  from { stroke-dasharray: 0 999; }
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  pointer-events: none;
}
.ring-flame {
  display: flex;
  align-items: center;
  line-height: 1;
  margin-bottom: 1px;
  animation: pulsoFuego 1.5s infinite alternate;
}
@keyframes pulsoFuego {
  0% { transform: scale(1); }
  100% { transform: scale(1.2); }
}

.ring-value {
  font-family: 'Inter', sans-serif;
  font-size: 8.5px;
  font-weight: 800;
  color: #fff;
  line-height: 1;
}

.ring-label {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  color: rgba(245, 245, 244, 0.4);
  font-weight: 600;
  transition: color 0.2s ease;
}
.ring-label.activo {
  color: #fb923c;
}

.stats-footer {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(245, 245, 244, 0.6);
}

.mejor-info strong {
  color: #facc15;
  font-weight: 700;
}
.stat-highlight {
  color: rgba(245, 245, 244, 0.4);
  font-size: 10px;
}

.total-info {
  font-size: 10.5px;
  color: rgba(245, 245, 244, 0.45);
}
.total-info strong {
  color: rgba(245, 245, 244, 0.9);
}

.dot-mejor {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #facc15;
  box-shadow: 0 0 8px #facc15;
  flex-shrink: 0;
}

@media (max-width: 380px) {
  .chart-top-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  .chart-avg-badge {
    align-self: flex-end;
  }
}
</style>
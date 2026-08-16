<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  segmentos: { type: Array, required: true }, // [{ label, value, color }]
  titulo: { type: String, default: '' },
  centroLabel: { type: String, default: '' },
  centroValor: { type: String, default: '' },
});

/* ---------------- IDIOMA (es/en) ---------------- */
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');
const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) currentLang.value = e.detail.idioma;
};
onMounted(() => window.addEventListener('idioma-changed', handleLangChange));
onUnmounted(() => window.removeEventListener('idioma-changed', handleLangChange));

const traducciones = {
  es: { total: 'Total' },
  en: { total: 'Total' },
};
const t = computed(() => traducciones[currentLang.value] || traducciones.es);

const uid = `dc-${Math.random().toString(36).slice(2, 9)}`;
const hoverIndex = ref(null);

const RADIO = 50;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;

const total = computed(() => props.segmentos.reduce((acc, s) => acc + s.value, 0));

const arcos = computed(() => {
  let acumulado = 0;
  return props.segmentos.map((s, i) => {
    const fraccion = total.value > 0 ? s.value / total.value : 0;
    const largo = fraccion * CIRCUNFERENCIA;
    const dashArray = `${largo} ${CIRCUNFERENCIA - largo}`;
    const dashOffset = -acumulado;
    acumulado += largo;
    return { ...s, dashArray, dashOffset, idx: i };
  });
});

// marcas decorativas alrededor del anillo
const ticks = computed(() => {
  const arr = [];
  const n = 36;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * 360;
    arr.push({ angle, mayor: i % 9 === 0 });
  }
  return arr;
});

const colorGlow = computed(() => props.segmentos[0]?.color || '#3b82f6');
</script>

<template>
  <div class="donut-block">
    <div v-if="titulo" class="chart-top-row">
      <span class="chart-titulo">{{ titulo }}</span>
    </div>

    <div class="donut-layout">
      <div class="donut-svg-wrap">
        <div class="donut-glow" :style="{ background: `radial-gradient(circle, ${colorGlow}66 0%, transparent 70%)` }"></div>

        <svg viewBox="0 0 120 120" class="donut-svg">
          <defs>
            <linearGradient v-for="a in arcos" :key="`grad-${a.idx}`" :id="`${uid}-grad-${a.idx}`" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" :stop-color="a.color" stop-opacity="1" />
              <stop offset="100%" :stop-color="a.color" stop-opacity="0.55" />
            </linearGradient>
            <filter :id="`${uid}-glow`" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <line v-for="(tk, i) in ticks" :key="i"
                x1="60" :y1="tk.mayor ? 1 : 3" x2="60" :y2="tk.mayor ? 8 : 6"
                :stroke="tk.mayor ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'"
                :stroke-width="tk.mayor ? 1.5 : 1"
                :transform="`rotate(${tk.angle} 60 60)`" />

          <circle cx="60" cy="60" :r="RADIO" class="donut-track" />

          <circle
            v-for="a in arcos" :key="a.idx"
            cx="60" cy="60" :r="RADIO"
            fill="none" :stroke="`url(#${uid}-grad-${a.idx})`"
            :stroke-width="hoverIndex === a.idx ? 15 : 12"
            :stroke-dasharray="a.dashArray"
            :stroke-dashoffset="a.dashOffset"
            stroke-linecap="round"
            class="donut-arc"
            :class="{ dim: hoverIndex !== null && hoverIndex !== a.idx }"
            :filter="hoverIndex === a.idx ? `url(#${uid}-glow)` : null"
            @mouseenter="hoverIndex = a.idx"
            @mouseleave="hoverIndex = null"
          />
        </svg>

        <div class="donut-center">
          <Transition name="donut-swap" mode="out-in">
            <div :key="hoverIndex" class="donut-center-inner">
              <span class="donut-center-value">
                {{ hoverIndex !== null ? `${segmentos[hoverIndex].value}%` : centroValor }}
              </span>
              <span class="donut-center-label">
                {{ hoverIndex !== null ? segmentos[hoverIndex].label : centroLabel }}
              </span>
            </div>
          </Transition>
        </div>
      </div>

      <div class="donut-legend">
        <div v-for="(s, i) in segmentos" :key="i" class="legend-row"
             :class="{ activo: hoverIndex === i }"
             @mouseenter="hoverIndex = i" @mouseleave="hoverIndex = null"
             @click="hoverIndex = i">
          <span class="legend-dot" :style="{ background: s.color, boxShadow: `0 0 10px ${s.color}` }"></span>
          <span class="legend-label">{{ s.label }}</span>
          <div class="legend-bar-track">
            <div class="legend-bar-fill" :style="{ width: (total ? (s.value / total) * 100 : 0) + '%', background: `linear-gradient(90deg, ${s.color}88, ${s.color})`, boxShadow: hoverIndex === i ? `0 0 8px ${s.color}` : 'none' }"></div>
          </div>
          <span class="legend-value">{{ s.value }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.donut-block { 
  width: 100%; 
}

.chart-top-row {
  margin-bottom: 12px;
}

.chart-titulo {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(245, 245, 244, 0.8);
}

.donut-layout {
  display: flex;
  align-items: center;
  gap: 18px;
}

.donut-svg-wrap {
  position: relative;
  width: 116px;
  height: 116px;
  flex-shrink: 0;
}

.donut-glow {
  position: absolute;
  inset: -14px;
  border-radius: 50%;
  filter: blur(12px);
  opacity: 0.6;
  pointer-events: none;
  z-index: 0;
}

.donut-svg {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
  overflow: visible;
}

.donut-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.05);
  stroke-width: 12;
}

.donut-arc {
  transition: stroke-width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
  cursor: pointer;
}
.donut-arc.dim { 
  opacity: 0.3; 
}

.donut-center {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.donut-center-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 0 4px;
}

.donut-swap-enter-active, .donut-swap-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.donut-swap-enter-from { opacity: 0; transform: scale(0.85); }
.donut-swap-leave-to { opacity: 0; transform: scale(1.1); }

.donut-center-value {
  font-family: 'Inter', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  line-height: 1.1;
}

.donut-center-label {
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  color: rgba(245, 245, 244, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 2px;
}

.donut-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 11.5px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}
.legend-row:hover { 
  transform: translateX(2px); 
}
.legend-row.activo {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.08);
}

.legend-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}
.legend-row.activo .legend-dot { 
  transform: scale(1.4); 
}

.legend-label {
  color: rgba(245, 245, 244, 0.65);
  font-weight: 500;
  flex-shrink: 0;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.legend-row.activo .legend-label { 
  color: #fff; 
  font-weight: 600;
}

.legend-bar-track {
  flex: 1;
  height: 5px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
  overflow: hidden;
  min-width: 15px;
}
.legend-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.2s ease;
}

.legend-value {
  color: #fff;
  font-weight: 700;
  flex-shrink: 0;
  width: 28px;
  text-align: right;
  font-size: 11px;
}

/* Responsivo para móviles */
@media (max-width: 420px) {
  .donut-layout {
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .donut-legend { 
    width: 100%; 
  }
  .legend-label {
    max-width: none;
    flex: 1;
  }
}
</style>
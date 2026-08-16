<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue';

const props = defineProps({
  data: { type: Array, required: true }, // [{ label: 'Ene', value: 70 }, ...]
  color: { type: String, default: '#3b82f6' },
  unit: { type: String, default: '' },
  height: { type: Number, default: 100 },
  titulo: { type: String, default: '' },
});

const uid = `lc-${Math.random().toString(36).slice(2, 9)}`;

const WIDTH = 320;
const PAD_X = 14;
const PAD_Y_TOP = 10;
const PAD_Y_BOT = 14;

const hoverIndex = ref(null);
const pathRef = ref(null);
const pathLength = ref(0);

const values = computed(() => props.data.map(d => d.value));
const minVal = computed(() => Math.min(...values.value));
const maxVal = computed(() => Math.max(...values.value));
const range = computed(() => (maxVal.value - minVal.value) || 1);

const usableH = props.height - PAD_Y_TOP - PAD_Y_BOT;

const points = computed(() => {
  const n = props.data.length;
  const usableW = WIDTH - PAD_X * 2;
  return props.data.map((d, i) => {
    const x = PAD_X + (n === 1 ? usableW / 2 : (i / (n - 1)) * usableW);
    const y = PAD_Y_TOP + usableH - ((d.value - minVal.value) / range.value) * usableH;
    return { x, y, ...d };
  });
});

const linePath = computed(() => {
  const pts = points.value;
  if (pts.length < 2) return '';
  let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)} `;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += `C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)} `;
  }
  return d;
});

const areaPath = computed(() => {
  const pts = points.value;
  if (!pts.length) return '';
  const base = props.height - PAD_Y_BOT;
  return `${linePath.value} L ${pts[pts.length - 1].x.toFixed(2)} ${base} L ${pts[0].x.toFixed(2)} ${base} Z`;
});

const gridLines = computed(() => {
  const steps = 2;
  const lines = [];
  for (let i = 0; i <= steps; i++) {
    const y = PAD_Y_TOP + (usableH / steps) * i;
    const val = maxVal.value - (range.value / steps) * i;
    lines.push({ y, val: Math.round(val * 10) / 10 });
  }
  return lines;
});

const primerValor = computed(() => props.data[0]?.value);
const ultimoValor = computed(() => props.data[props.data.length - 1]?.value);
const diferencia = computed(() => (ultimoValor.value - primerValor.value));
const tendenciaPositiva = computed(() => diferencia.value >= 0);

const puntoMax = computed(() => points.value.reduce((a, b) => (b.value > a.value ? b : a), points.value[0]));

async function medirPath() {
  await nextTick();
  if (pathRef.value) {
    try { pathLength.value = pathRef.value.getTotalLength(); } catch (e) { pathLength.value = 0; }
  }
}
onMounted(medirPath);
watch(() => props.data, medirPath, { deep: true });
</script>

<template>
  <div class="line-chart-block">
    <div v-if="titulo" class="chart-top-row">
      <span class="chart-titulo">{{ titulo }}</span>
      <span class="chart-delta" :class="{ up: tendenciaPositiva, down: !tendenciaPositiva }">
        {{ tendenciaPositiva ? '▲' : '▼' }} {{ tendenciaPositiva ? '+' : '' }}{{ diferencia.toFixed(1) }}{{ unit }}
      </span>
    </div>

    <div class="chart-svg-container">
      <svg :viewBox="`0 0 ${WIDTH} ${height}`" class="chart-svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient :id="`${uid}-area`" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" :stop-color="color" stop-opacity="0.35" />
            <stop offset="100%" :stop-color="color" stop-opacity="0" />
          </linearGradient>
          <linearGradient :id="`${uid}-line`" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" :stop-color="color" stop-opacity="0.6" />
            <stop offset="100%" :stop-color="color" />
          </linearGradient>
          <filter :id="`${uid}-glow`" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g v-for="(g, i) in gridLines" :key="i">
          <line :x1="PAD_X" :y1="g.y" :x2="WIDTH - PAD_X" :y2="g.y" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="2 3" />
          <text :x="WIDTH - PAD_X" :y="g.y - 3" text-anchor="end" class="grid-label">{{ g.val }}{{ unit }}</text>
        </g>

        <path :d="areaPath" :fill="`url(#${uid}-area)`" />

        <path
          ref="pathRef"
          :d="linePath"
          fill="none"
          :stroke="`url(#${uid}-line)`"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
          :filter="`url(#${uid}-glow)`"
          class="draw-line"
          :style="{ strokeDasharray: pathLength, strokeDashoffset: pathLength }"
        />

        <g v-if="puntoMax">
          <circle :cx="puntoMax.x" :cy="puntoMax.y" r="3.5" fill="#fff" :stroke="color" stroke-width="1.5" />
          <text :x="puntoMax.x" :y="puntoMax.y - 6" text-anchor="middle" class="peak-label">{{ puntoMax.value }}{{ unit }}</text>
        </g>

        <g v-for="(p, i) in points" :key="i"
           class="point-hit"
           @mouseenter="hoverIndex = i"
           @mouseleave="hoverIndex = null"
           @touchstart.passive="hoverIndex = i">
          <rect :x="p.x - 16" y="0" width="32" :height="height" fill="transparent" />
          <circle :cx="p.x" :cy="p.y" :r="hoverIndex === i ? 5 : 2.5" :fill="hoverIndex === i ? '#fff' : color"
                  :stroke="hoverIndex === i ? color : '#0f172a'" stroke-width="1.2" class="pt" />
          <g v-if="hoverIndex === i" class="tooltip-group">
            <rect :x="p.x - 18" :y="p.y - 22" width="36" height="15" rx="4" fill="#0f172a" stroke="rgba(255,255,255,0.15)" />
            <text :x="p.x" :y="p.y - 12" text-anchor="middle" class="tooltip-text">{{ p.value }}{{ unit }}</text>
          </g>
        </g>
      </svg>
    </div>

    <div class="chart-labels-row">
      <span v-for="(d, i) in data" :key="i" class="chart-label">{{ d.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.line-chart-block { 
  width: 100%; 
  height: 100%;
  display: flex; 
  flex-direction: column; 
  justify-content: space-between; 
}

.chart-top-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}
.chart-titulo {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: rgba(245, 245, 244, 0.5);
}
.chart-delta {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}
.chart-delta.up { color: #4ade80; background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.2); }
.chart-delta.down { color: #f87171; background: rgba(248, 113, 113, 0.1); border: 1px solid rgba(248, 113, 113, 0.2); }

.chart-svg-container {
  width: 100%;
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
}

.chart-svg { 
  width: 100%; 
  height: auto; 
  display: block; 
  overflow: visible; 
}

.draw-line {
  animation: dibujarLinea 1.2s ease-out forwards;
}
@keyframes dibujarLinea {
  to { stroke-dashoffset: 0; }
}

.grid-label {
  font-family: 'Inter', sans-serif;
  font-size: 7.5px;
  fill: rgba(245, 245, 244, 0.25);
  font-weight: 500;
}

.peak-label {
  font-family: 'Inter', sans-serif;
  font-size: 8px;
  font-weight: 700;
  fill: #fff;
}

.point-hit { cursor: pointer; }
.pt { transition: r 0.15s ease; }

.tooltip-text {
  font-family: 'Inter', sans-serif;
  font-size: 8.5px;
  font-weight: 700;
  fill: #fff;
  text-anchor: middle;
}

.tooltip-group {
  animation: apareceTooltip 0.15s ease-out;
}
@keyframes apareceTooltip {
  from { opacity: 0; transform: translateY(2px); }
  to { opacity: 1; transform: translateY(0); }
}

.chart-labels-row {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  padding: 0 4px;
}
.chart-label {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  color: rgba(245, 245, 244, 0.45);
  font-weight: 500;
}
</style>
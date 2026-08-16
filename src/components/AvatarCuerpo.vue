<script setup>
import { computed, ref, onMounted } from 'vue';

/*
  IndicadorFisico.vue (Multilenguaje: Español / Inglés)
  --------------------
  Prop `lang`: acepta 'es' o 'en'. Traduce dinámicamente todas las etiquetas.
*/

const props = defineProps({
  sexo: { type: String, default: 'mujer' },
  imc: { type: [String, Number], default: null },
  grasaCorporal: { type: [String, Number], default: null },
  peso: { type: [String, Number], default: null },
  altura: { type: [String, Number], default: null },
  tipoCuerpo: { type: String, default: null },
  mostrarEtiqueta: { type: Boolean, default: true },
  tamano: { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
  lang: { type: String, default: 'es' }   // 'es' | 'en'
});

const parseNum = (val) => {
  if (val === null || val === undefined || val === '') return null;
  const n = parseFloat(String(val).replace('%', '').replace(',', '.'));
  return isNaN(n) ? null : n;
};

const grasaNum = computed(() => parseNum(props.grasaCorporal));
const imcNum = computed(() => parseNum(props.imc));
const pesoNum = computed(() => parseNum(props.peso));
const alturaNum = computed(() => parseNum(props.altura));
const esMujer = computed(() => props.sexo === 'mujer');

function interpolarPuntos(valor, puntos) {
  if (valor <= puntos[0][0]) return puntos[0][1];
  const ultimo = puntos[puntos.length - 1];
  if (valor >= ultimo[0]) return ultimo[1];
  for (let i = 0; i < puntos.length - 1; i++) {
    const [x1, y1] = puntos[i];
    const [x2, y2] = puntos[i + 1];
    if (valor >= x1 && valor <= x2) {
      const t = (valor - x1) / (x2 - x1);
      return y1 + (y2 - y1) * t;
    }
  }
  return ultimo[1];
}

const PUNTOS_GRASA_MUJER = [[14, 0], [18, 0.25], [23, 0.5], [28, 0.75], [35, 1]];
const PUNTOS_GRASA_HOMBRE = [[8, 0], [12, 0.25], [16, 0.5], [20, 0.75], [28, 1]];
const PUNTOS_IMC = [[17, 0], [19, 0.2], [23, 0.5], [27, 0.75], [32, 1]];
const PUNTOS_PESO = [[30, 0], [40, 0.15], [50, 0.4], [60, 0.55], [80, 0.72], [100, 0.9], [120, 1]];

const factorCorporal = computed(() => {
  if (props.tipoCuerpo) {
    if (props.tipoCuerpo === 'delgado') return 0;
    if (props.tipoCuerpo === 'gordo') return 1;
    return 0.5;
  }
  if (grasaNum.value !== null) {
    const puntos = esMujer.value ? PUNTOS_GRASA_MUJER : PUNTOS_GRASA_HOMBRE;
    return interpolarPuntos(grasaNum.value, puntos);
  }
  if (imcNum.value !== null) return interpolarPuntos(imcNum.value, PUNTOS_IMC);
  if (pesoNum.value !== null && alturaNum.value !== null && alturaNum.value > 0) {
    const alturaM = alturaNum.value > 3 ? alturaNum.value / 100 : alturaNum.value;
    return interpolarPuntos(pesoNum.value / (alturaM * alturaM), PUNTOS_IMC);
  }
  if (pesoNum.value !== null) return interpolarPuntos(pesoNum.value, PUNTOS_PESO);
  return 0.5;
});

// Diccionarios de textos (Español / Inglés)
const TEXTOS = {
  es: {
    muyDelgado: 'Muy delgado',
    ligera: 'Complexión ligera',
    atletica: 'Composición atlética',
    definicion: 'En etapa de definición',
    robusta: 'Composición robusta',
    fuenteManual: 'Ajuste manual',
    fuenteGrasa: 'Según tu % de grasa corporal',
    fuenteImc: 'Según tu IMC',
    fuentePesoAltura: 'Según tu peso y estatura',
    fuentePeso: 'Según tu peso actual',
    fuentePromedio: 'Composición promedio',
    escalaDelgado: 'Delgado',
    escalaPromedio: 'Promedio',
    escalaDefinido: 'Definido'
  },
  en: {
    muyDelgado: 'Very lean',
    ligera: 'Light build',
    atletica: 'Athletic composition',
    definicion: 'Cutting phase',
    robusta: 'Robust composition',
    fuenteManual: 'Manual adjustment',
    fuenteGrasa: 'Based on body fat %',
    fuenteImc: 'Based on your BMI',
    fuentePesoAltura: 'Based on weight & height',
    fuentePeso: 'Based on current weight',
    fuentePromedio: 'Average composition',
    escalaDelgado: 'Lean',
    escalaPromedio: 'Average',
    escalaDefinido: 'Defined'
  }
};

const t = computed(() => TEXTOS[props.lang] || TEXTOS.es);

const etiquetaTexto = computed(() => {
  const f = factorCorporal.value;
  if (f < 0.15) return t.value.muyDelgado;
  if (f < 0.35) return t.value.ligera;
  if (f <= 0.65) return t.value.atletica;
  if (f <= 0.85) return t.value.definicion;
  return t.value.robusta;
});

const fuenteTexto = computed(() => {
  if (props.tipoCuerpo) return t.value.fuenteManual;
  if (grasaNum.value !== null) return t.value.fuenteGrasa;
  if (imcNum.value !== null) return t.value.fuenteImc;
  if (pesoNum.value !== null && alturaNum.value !== null) return t.value.fuentePesoAltura;
  if (pesoNum.value !== null) return t.value.fuentePeso;
  return t.value.fuentePromedio;
});

// --- Color continuo ---
const STOPS_COLOR = [
  { f: 0, rgb: [96, 165, 250] },   // #60a5fa
  { f: 0.5, rgb: [74, 222, 128] }, // #4ade80
  { f: 1, rgb: [251, 146, 60] },   // #fb923c
];
function colorParaFactor(f) {
  let a = STOPS_COLOR[0], b = STOPS_COLOR[1];
  if (f > 0.5) { a = STOPS_COLOR[1]; b = STOPS_COLOR[2]; }
  const span = b.f - a.f || 1;
  const tVal = Math.min(1, Math.max(0, (f - a.f) / span));
  const rgb = a.rgb.map((c, i) => Math.round(c + (b.rgb[i] - c) * tVal));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}
const colorActual = computed(() => colorParaFactor(factorCorporal.value));

// --- Geometría del gauge ---
const CX = 120, CY = 148, R = 90;
const DEG = Math.PI / 180;
function polar(angleDeg, r) {
  const rad = angleDeg * DEG;
  return { x: CX + r * Math.cos(rad), y: CY - r * Math.sin(rad) };
}
function arcPath(a1, a2, r) {
  const p1 = polar(a1, r), p2 = polar(a2, r);
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
}

const ZONAS = [
  { path: arcPath(180, 120, R), color: '#60a5fa' },
  { path: arcPath(120, 60, R), color: '#4ade80' },
  { path: arcPath(60, 0, R), color: '#fb923c' },
];

const marcas = [180, 120, 60, 0].map((ang) => {
  const p1 = polar(ang, R - 12);
  const p2 = polar(ang, R + 2);
  return { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y };
});

const animado = ref(false);
onMounted(() => { requestAnimationFrame(() => { animado.value = true; }); });
const rotacionAguja = computed(() => (animado.value ? factorCorporal.value * 180 - 90 : -90));

const siluetaPath = `M 50 8 a 11 11 0 1 0 0.1 0 Z
  M 30 30 Q 50 20 70 30 L 76 62 Q 66 58 58 60 L 60 118 L 68 118 L 66 78
  Q 50 84 34 78 L 32 118 L 40 118 L 42 60 Q 34 58 24 62 Z`;
</script>

<template>
  <div class="gauge-card" :class="`gauge-size-${tamano}`" :style="{ '--color-actual': colorActual }">
    <div class="gauge-bg-decor" aria-hidden="true">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <svg class="dot-grid" viewBox="0 0 240 190" preserveAspectRatio="none">
        <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1.2" cy="1.2" r="1.2" fill="rgba(255,255,255,0.09)" />
        </pattern>
        <rect width="240" height="190" fill="url(#dots)" />
      </svg>
      <svg class="watermark" viewBox="0 0 100 130" aria-hidden="true">
        <path :d="siluetaPath" :fill="colorActual" opacity="0.07" />
      </svg>
    </div>

    <svg viewBox="0 0 240 168" class="gauge-svg">
      <defs>
        <filter id="needleGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="0" stdDeviation="2.2" :flood-color="colorActual" flood-opacity="0.7" />
        </filter>
      </defs>

      <path :d="arcPath(180, 0, R)" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="18" stroke-linecap="round" />
      <path v-for="(z, i) in ZONAS" :key="'zona'+i" :d="z.path" fill="none" :stroke="z.color" stroke-width="14" stroke-linecap="round" opacity="0.9" />
      <line v-for="(m, i) in marcas" :key="'marca'+i" :x1="m.x1" :y1="m.y1" :x2="m.x2" :y2="m.y2" stroke="rgba(255,255,255,0.25)" stroke-width="1.5" />

      <g class="needle" filter="url(#needleGlow)" :style="{ transform: `rotate(${rotacionAguja}deg)`, transformOrigin: `${CX}px ${CY}px` }">
        <line :x1="CX" :y1="CY" :x2="CX" :y2="CY - (R - 20)" :stroke="colorActual" stroke-width="3.5" stroke-linecap="round" />
        <circle :cx="CX" :cy="CY" r="9" :fill="colorActual" />
        <circle :cx="CX" :cy="CY" r="4" fill="#0b1220" />
      </g>
    </svg>

    <div v-if="mostrarEtiqueta" class="gauge-readout">
      <span class="gauge-category" :style="{ color: colorActual }">{{ etiquetaTexto }}</span>
      <span class="gauge-caption">{{ fuenteTexto }}</span>
    </div>

    <div class="gauge-scale-labels">
      <span>{{ t.escalaDelgado }}</span>
      <span>{{ t.escalaPromedio }}</span>
      <span>{{ t.escalaDefinido }}</span>
    </div>
  </div>
</template>

<style scoped>
.gauge-card {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 6px 4px;
  border-radius: 16px;
  overflow: hidden;
  --color-actual: #4ade80;
}

.gauge-bg-decor {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.dot-grid { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.6; }
.watermark {
  position: absolute;
  top: 50%; left: 50%;
  width: 70%; height: auto;
  transform: translate(-50%, -46%);
  animation: breatheWatermark 6s ease-in-out infinite;
}
.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(36px);
  opacity: 0.5;
  transition: background 0.6s ease;
}
.glow-1 { width: 140px; height: 140px; top: -30px; left: -30px; background: radial-gradient(circle, var(--color-actual) 0%, transparent 70%); opacity: 0.22; }
.glow-2 { width: 160px; height: 160px; bottom: -50px; right: -40px; background: radial-gradient(circle, var(--color-actual) 0%, transparent 70%); opacity: 0.14; }

@keyframes breatheWatermark {
  0%, 100% { transform: translate(-50%, -46%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -46%) scale(1.035); opacity: 0.85; }
}

.gauge-svg { position: relative; z-index: 1; width: 100%; max-width: 240px; height: auto; }
.needle { transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1); }

.gauge-readout {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  margin-top: 2px;
}
.gauge-category {
  font-family: 'Oswald', 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
.gauge-caption {
  font-size: 10.5px;
  color: rgba(245, 245, 244, 0.55);
  font-weight: 500;
}

.gauge-scale-labels {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 220px;
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  padding: 0 6px;
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: rgba(245, 245, 244, 0.4);
}

.gauge-size-sm .gauge-svg { max-width: 170px; }
.gauge-size-md .gauge-svg { max-width: 230px; }
.gauge-size-lg .gauge-svg { max-width: 280px; }

@media (prefers-reduced-motion: reduce) {
  .needle { transition: none; }
  .watermark { animation: none; }
}
</style>
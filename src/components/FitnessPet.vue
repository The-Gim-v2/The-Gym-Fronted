<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  nombre: { type: String, default: 'Entrenador' },
  /* Solo se muestra si trae un número (ej. "Nivel 90"); si es el nombre de la etapa no se repite */
  nivel: { type: String, default: '' },
  racha: { type: Number, default: 0 },
  tipo: { type: String, default: 'perro' },
  /* ¿ya cumplió su objetivo de hoy? */
  activoHoy: { type: Boolean, default: true },
  /* 'kawaii' (tierno, para ellas) o 'rudo' (más real y fuerte, para ellos) */
  estilo: { type: String, default: '' },
  /* Alternativa a "estilo": 'mujer' → kawaii · 'hombre' → rudo */
  genero: { type: String, default: '' }
});

/* =========================================================
   ESTILO
========================================================= */

const estiloFinal = computed(() => {
  if (props.estilo === 'kawaii' || props.estilo === 'rudo') return props.estilo;
  const g = props.genero.toLowerCase();
  return ['hombre', 'masculino', 'male', 'm', 'h'].includes(g) ? 'rudo' : 'kawaii';
});

const esRudo = computed(() => estiloFinal.value === 'rudo');

/* =========================================================
   ETAPAS DE CRECIMIENTO
========================================================= */

const ETAPAS = ['huevo', 'bebe', 'adolescente', 'adulto', 'senior', 'musculoso', 'legendario'];
const UMBRALES = [0, 1, 10, 30, 100, 200, 365];

const NOMBRES = {
  kawaii: { huevo: 'Huevito', bebe: 'Bebé', adolescente: 'Joven', adulto: 'Adulto', senior: 'Sabio', musculoso: 'Radiante', legendario: 'Legendario' },
  rudo: { huevo: 'Huevo', bebe: 'Cría', adolescente: 'Joven', adulto: 'Adulto', senior: 'Veterano', musculoso: 'Bestia', legendario: 'Leyenda' }
};

const nombresEtapa = computed(() => NOMBRES[estiloFinal.value]);

const etapaMascota = computed(() => {
  const r = props.racha;
  if (r === 0) return 'huevo';
  if (r < 10) return 'bebe';
  if (r < 30) return 'adolescente';
  if (r < 100) return 'adulto';
  if (r < 200) return 'senior';
  if (r < 365) return 'musculoso';
  return 'legendario';
});

const idxEtapa = computed(() => ETAPAS.indexOf(etapaMascota.value));
const temaEvolucion = computed(() => `theme-${etapaMascota.value}`);

/* Cuánto crece (dentro del dibujo): se nota de verdad entre una etapa y otra */
const ESCALA = { huevo: 0.9, bebe: 0.6, adolescente: 0.76, adulto: 0.9, senior: 1, musculoso: 1.08, legendario: 1.16 };
const escala = computed(() => ESCALA[etapaMascota.value] || 1);

/* Musculatura (solo se nota en el estilo rudo) */
const mus = computed(
  () => ({ huevo: 0, bebe: 0, adolescente: 0.15, adulto: 0.35, senior: 0.55, musculoso: 0.85, legendario: 1 }[etapaMascota.value] || 0)
);

/* Cabeza: más grande en las crías; en rudo musculoso se achica para que el cuerpo luzca más poderoso */
const cabeza = computed(() => {
  const base = { bebe: 1.22, adolescente: 1.1 }[etapaMascota.value] || 1;
  if (!esRudo.value) return base;
  return { musculoso: 0.94, legendario: 0.9 }[etapaMascota.value] || base;
});

/* Hombros muy anchos, cintura casi igual → silueta en V */
const bw = computed(() => (esRudo.value ? 26 + 20 * mus.value : 30 + 3 * mus.value));
const bwa = computed(() => (esRudo.value ? 22 + 2 * mus.value : 28));



const siguiente = computed(() => {
  const i = idxEtapa.value;
  if (i >= ETAPAS.length - 1) return null;
  return {
    nombre: nombresEtapa.value[ETAPAS[i + 1]],
    dias: Math.max(UMBRALES[i + 1] - props.racha, 1)
  };
});

/* =========================================================
   ÁNIMO
========================================================= */

const animo = computed(() => {
  if (props.racha === 0) return 'dormido';
  return props.activoHoy ? 'feliz' : 'asustado';
});

const enRiesgo = computed(() => animo.value === 'asustado');
const claseAnimo = computed(() => `mood-${animo.value}`);

const claseAnimacionCuerpo = computed(() => {
  if (enRiesgo.value) return 'animate-tremble';
  if (esRudo.value) return 'animate-respirar';
  if (props.tipo === 'pinguino') return 'animate-waddle';
  if (props.tipo === 'oso_pardo' || props.tipo === 'oso_polar') return 'animate-sway';
  return 'animate-float';
});

const etiquetaEstado = computed(() => {
  const etapa = nombresEtapa.value[etapaMascota.value];
  const nivel = (props.nivel || '').trim();
  const base = /\d/.test(nivel) ? `${nivel} • ${etapa}` : etapa;
  return enRiesgo.value ? `${base} • ¡en riesgo!` : base;
});

/* =========================================================
   MOVIMIENTO (camina de un lado a otro) Y SALTO AL TOCAR
========================================================= */

const posX = ref(0);
const mirandoIzquierda = ref(false);

function moverAleatorio() {
  if (animo.value !== 'feliz') {
    posX.value = 0;
    return;
  }
  const nuevoX = Math.round(Math.random() * 32 - 16);
  mirandoIzquierda.value = nuevoX < posX.value;
  posX.value = nuevoX;
}

const saltando = ref(false);
let temporizadorSalto = null;

function saltar() {
  saltando.value = false;
  requestAnimationFrame(() => {
    saltando.value = true;
    clearTimeout(temporizadorSalto);
    temporizadorSalto = setTimeout(() => { saltando.value = false; }, 650);
  });
}

let temporizadorMovimiento = null;

onMounted(() => {
  temporizadorMovimiento = setInterval(moverAleatorio, 3500);
});

onUnmounted(() => {
  clearInterval(temporizadorMovimiento);
  clearTimeout(temporizadorSalto);
});

watch(animo, (nuevo) => {
  if (nuevo !== 'feliz') posX.value = 0;
});

/* =========================================================
   PARTÍCULAS DE AMBIENTE
========================================================= */

const PARTICULAS = {
  perro: ['🦴', '🐾'], gato: ['🐟', '🐾'], pinguino: ['🧊', '❄️'], zorro: ['🍃', '🌸'], rana: ['💧', '🍃'],
  oso_pardo: ['🍂', '🌲'], oso_polar: ['❄️', '🧊'], panda: ['🎋', '🍃'], conejo: ['🥕', '🌸']
};

const particulas = computed(() => {
  if (enRiesgo.value) return ['💧', '💧', '❗'];
  return [...(PARTICULAS[props.tipo] || ['⭐']), esRudo.value ? '🔥' : '✨'];
});

/* =========================================================
   FORMAS Y COLORES POR ANIMAL
========================================================= */

const FORMAS = {
  perro: { earK: 'floppy', earR: 'point', snout: 'muzzle', tail: 'curl', fangs: true, eyeSpot: true },
  gato: { earK: 'point', earR: 'point', snout: 'small', tail: 'long', whisk: true, fangs: true, stripes: true, slit: true },
  pinguino: { earK: 'none', earR: 'none', snout: 'beak', tail: null, mask: true, limbDark: true },
  zorro: { earK: 'point', earR: 'point', snout: 'muzzle', tail: 'fluffy', cheeks: true, fangs: true },
  rana: { earK: 'none', earR: 'none', snout: 'frog', tail: null, frog: true },
  oso_pardo: { earK: 'round', earR: 'round', snout: 'muzzle', tail: 'puff', fangs: true },
  oso_polar: { earK: 'round', earR: 'round', snout: 'muzzle', tail: 'puff', fangs: true },
  panda: { earK: 'round', earR: 'round', snout: 'muzzle', tail: 'puff', panda: true, limbDark: true },
  conejo: { earK: 'long', earR: 'long', snout: 'small', tail: 'puff', whisk: true, teeth: true },
  generico: { earK: 'round', earR: 'round', snout: 'muzzle', tail: 'puff' }
};

/* k = kawaii (pasteles, tierno) · r = rudo (tonos naturales, más real) */
const COLORES = {
  perro: {
    k: { c: '#f2c48d', d: '#9a5b25', belly: '#fff4e2', nose: '#3b2316', eye: '#3b2316', earC: '#c98b52', inner: '#f4b6a0' },
    r: { c: '#8b5a2b', d: '#2a170a', belly: '#d9b98a', nose: '#0f0805', eye: '#e0901f', earC: '#5a3516', inner: '#2a170a' }
  },
  gato: {
    k: { c: '#d8c4ff', d: '#7c4dbd', belly: '#ffffff', nose: '#f9a8d4', eye: '#5b21b6', earC: '#d8c4ff', inner: '#f9a8d4' },
    r: { c: '#7b8494', d: '#1b212b', belly: '#d5dbe4', nose: '#a35d6a', eye: '#a3e635', earC: '#7b8494', inner: '#3a2a30' }
  },
  pinguino: {
    k: { c: '#3b4a63', d: '#0f172a', belly: '#ffffff', nose: '#000000', eye: '#0f172a', beak: '#fb923c', foot: '#fb923c' },
    r: { c: '#161b26', d: '#000000', belly: '#e8eaee', nose: '#000000', eye: '#fbbf24', beak: '#d97706', foot: '#b45309' }
  },
  zorro: {
    k: { c: '#ff9a4d', d: '#a3400f', belly: '#fff7ed', nose: '#2b1a10', eye: '#2b1a10', earC: '#ff9a4d', inner: '#fbcfe8' },
    r: { c: '#c2410c', d: '#3b1105', belly: '#efe0cc', nose: '#0a0a0a', eye: '#facc15', earC: '#c2410c', inner: '#1c0a04' }
  },
  rana: {
    k: { c: '#86efac', d: '#15803d', belly: '#dcfce7', nose: '#15803d', eye: '#0f172a' },
    r: { c: '#4d7c0f', d: '#17250a', belly: '#a3b86a', nose: '#17250a', eye: '#f59e0b' }
  },
  oso_pardo: {
    k: { c: '#cf9564', d: '#7a4a28', belly: '#f6dcb4', nose: '#3b2316', eye: '#3b2316', earC: '#cf9564', inner: '#f6dcb4' },
    r: { c: '#5a3a1f', d: '#150c04', belly: '#8c6a45', nose: '#0a0a0a', eye: '#b45309', earC: '#5a3a1f', inner: '#150c04' }
  },
  oso_polar: {
    k: { c: '#ffffff', d: '#8aa0b8', belly: '#e8f0f8', nose: '#334155', eye: '#1e293b', earC: '#ffffff', inner: '#cbd5e1' },
    r: { c: '#e3e7ec', d: '#4b5563', belly: '#c4ccd6', nose: '#0a0a0a', eye: '#1e3a5f', earC: '#e3e7ec', inner: '#6b7280' }
  },
  panda: {
    k: { c: '#ffffff', d: '#2b3445', belly: '#f1f5f9', nose: '#2b3445', eye: '#000000', earC: '#2b3445', inner: '#2b3445' },
    r: { c: '#e5e7eb', d: '#0b0f14', belly: '#cfd4da', nose: '#0b0f14', eye: '#f59e0b', earC: '#0b0f14', inner: '#0b0f14' }
  },
  conejo: {
    k: { c: '#f4e4ee', d: '#b4789a', belly: '#ffffff', nose: '#f9a8d4', eye: '#3b1d3b', earC: '#f4e4ee', inner: '#f9a8d4' },
    r: { c: '#9aa0a6', d: '#2a2e33', belly: '#d2d5d8', nose: '#8a5a44', eye: '#b45309', earC: '#9aa0a6', inner: '#4a3a3a' }
  },
  generico: {
    k: { c: '#93c5fd', d: '#1d4ed8', belly: '#dbeafe', nose: '#1d4ed8', eye: '#1e3a8a', earC: '#93c5fd', inner: '#dbeafe' },
    r: { c: '#3b5f9a', d: '#0c1830', belly: '#8aa5cf', nose: '#0a0a0a', eye: '#fbbf24', earC: '#3b5f9a', inner: '#0c1830' }
  }
};

const hex2rgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const mix = (a, b, t) => {
  const A = hex2rgb(a);
  const B = hex2rgb(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};

const a = computed(() => {
  const tipo = FORMAS[props.tipo] ? props.tipo : 'generico';
  return { ...FORMAS[tipo], ...COLORES[tipo][esRudo.value ? 'r' : 'k'] };
});

const trazo = computed(() => (esRudo.value ? a.value.d : mix(a.value.c, '#000000', 0.4)));
const svgVars = computed(() => ({ '--trazo': trazo.value, '--sw': esRudo.value ? 3 : 2.4 }));

const limbC = computed(() => (a.value.limbDark ? a.value.d : a.value.c));
const footC = computed(() => a.value.foot || limbC.value);
const tuftC = computed(() => (a.value.cheeks ? a.value.belly : a.value.c));
const earTipo = computed(() => (esRudo.value ? a.value.earR : a.value.earK));

/* Ids únicos: en la galería hay muchas mascotas a la vez */
const uid = 'pc' + Math.random().toString(36).slice(2, 8);
const ref_ = (n) => `url(#${uid}-${n})`;
const gBody = ref_('body');
const gEgg = ref_('egg');
const gAura = ref_('aura');
const gGold = ref_('gold');
const fGlow = ref_('glow');

const colorBodyLight = computed(() => mix(a.value.c, '#ffffff', 0.35));
const colorBodyShade = computed(() => mix(a.value.c, '#000000', esRudo.value ? 0.25 : 0.1));
const eggA = computed(() => (esRudo.value ? '#b8b2a6' : '#fffaf2'));
const eggB = computed(() => (esRudo.value ? '#4a463f' : '#f5d0e6'));
const auraColor = computed(() => {
  if (etapaMascota.value === 'legendario') return '#fde047';
  return esRudo.value ? '#fb923c' : '#f9a8d4';
});
const mostrarAura = computed(() => !enRiesgo.value && ['musculoso', 'legendario'].includes(etapaMascota.value));

/* =========================================================
   GEOMETRÍA
========================================================= */

const HEAD_R = 'M 84 112 C 84 84 100 76 120 76 C 140 76 156 84 156 112 C 156 130 148 146 134 152 Q 120 158 106 152 C 92 146 84 130 84 112 Z';

const transformEscala = computed(() => `translate(120 205) scale(${escala.value}) translate(-120 -205)`);
const transformCabeza = computed(() => {
  const subir = esRudo.value ? -6 * mus.value : 0;
  return `translate(0 ${subir}) translate(120 152) scale(${cabeza.value}) translate(-120 -152)`;
});

/* Torso del estilo rudo: trapecios, hombros anchos, pecho abombado y cintura marcada (silueta en "V") */
const torso = computed(() => {
  const w = bw.value;
  const wa = bwa.value;
  const cuello = 14 + 4 * mus.value;
  const ty = 152 - 10 * mus.value;
  return `M ${120 - w} 154 Q ${120 - w * 0.6} ${ty + 4} ${120 - cuello} ${ty} L ${120 + cuello} ${ty} Q ${120 + w * 0.6} ${ty + 4} ${120 + w} 154 C ${120 + w + 4} 172 ${120 + wa + 7} 188 ${120 + wa} 203 L ${120 - wa} 203 C ${120 - wa - 7} 188 ${120 - w - 4} 172 ${120 - w} 154 Z`;
});

/* Brazos del estilo rudo (una sola silueta, con deltoides y bíceps) */
const BRAZO_BAJO = 'M -2 -8 C 10 -12 20 -6 22 5 C 24 15 26 24 22 33 C 21 40 18 45 14 46 L 4 46 C 2 40 0 30 -2 23 C -4 13 -6 2 -2 -8 Z';
const BRAZO_FLEX = 'M 0 10 C 14 16 36 16 50 11 C 60 8 64 0 62 -10 L 60 -38 L 40 -38 L 40 -12 C 34 -26 18 -30 8 -20 C 4 -16 0 -13 0 -8';
const kxBrazo = computed(() => 0.8 + 0.5 * mus.value);
const limbStroke = computed(() => (a.value.limbDark ? mix(a.value.c, '#ffffff', 0.3) : trazo.value));

/* Zona clara del abdomen (si hay músculo, empieza debajo del pecho) */
const vientre = computed(() => {
  const wa = bwa.value;
  const top = mus.value >= 0.3 ? 178 : 156;
  return `M ${120 - wa + 5} ${top} Q 120 ${top - 5} ${120 + wa - 5} ${top} L ${120 + wa - 4} 200 L ${120 - wa + 4} 200 Z`;
});

/* Seis cuadros del abdomen */
const abdominales = computed(() => {
  const ancho = bwa.value * 0.6;
  const filas = [];
  for (let r = 0; r < 3; r++) {
    for (const s of [-1, 1]) {
      filas.push({ k: `${r}_${s}`, x: s < 0 ? 119 - ancho : 121, y: 178 + r * 7, w: ancho });
    }
  }
  return filas;
});

const muz = computed(() => {
  const chico = a.value.snout === 'small';
  if (esRudo.value) return chico ? { cy: 133, rx: 14, ry: 11 } : { cy: 135, rx: 18, ry: 15 };
  return chico ? { cy: 130, rx: 11, ry: 8 } : { cy: 131, rx: 15, ry: 11 };
});

const NARIZ_R = 'M 110 126 Q 120 120 130 126 Q 126 135 120 135 Q 114 135 110 126 Z';
</script>

<template>
  <div class="pet-card-inner" :class="[temaEvolucion, claseAnimo, 'estilo-' + estiloFinal]">
    <div class="ambient-glow"></div>

    <div class="ambient-particles">
      <span v-for="(p, i) in particulas" :key="i" class="particle" :class="'p' + i">{{ p }}</span>
    </div>

    <div class="pet-stage" @click="saltar">
      <div
        class="pet-visual"
        :style="{ transform: `translateX(${posX}px) scaleX(${mirandoIzquierda ? -1 : 1})` }"
      >
        <svg
          viewBox="-12 -40 264 270"
          class="pet-svg"
          :class="[etapaMascota, claseAnimo, 'estilo-' + estiloFinal, { saltando }]"
          :style="svgVars"
        >
          <defs>
            <radialGradient :id="uid + '-body'" cx="35%" cy="30%" r="80%">
              <stop offset="0%" :stop-color="colorBodyLight" />
              <stop offset="55%" :stop-color="a.c" />
              <stop offset="100%" :stop-color="colorBodyShade" />
            </radialGradient>
            <radialGradient :id="uid + '-egg'" cx="35%" cy="28%" r="75%">
              <stop offset="0%" :stop-color="eggA" />
              <stop offset="100%" :stop-color="eggB" />
            </radialGradient>
            <radialGradient :id="uid + '-aura'" cx="50%" cy="50%" r="50%">
              <stop offset="0%" :stop-color="auraColor" stop-opacity="0.75" />
              <stop offset="100%" :stop-color="auraColor" stop-opacity="0" />
            </radialGradient>
            <linearGradient :id="uid + '-gold'" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#fef08a" />
              <stop offset="50%" stop-color="#facc15" />
              <stop offset="100%" stop-color="#b45309" />
            </linearGradient>
            <filter :id="uid + '-glow'" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          <!-- AURA (solo etapas altas) -->
          <circle
            v-if="mostrarAura"
            cx="120" cy="125"
            :r="etapaMascota === 'legendario' ? 112 : 90"
            :fill="gAura"
            class="animate-auraPulse"
          />

          <!-- Destellos / fuego alrededor (leyenda) -->
          <template v-if="etapaMascota === 'legendario' && !enRiesgo">
            <template v-if="!esRudo">
              <text x="26" y="40" font-size="20" class="twinkle">✨</text>
              <text x="196" y="60" font-size="18" class="twinkle t2">⭐</text>
              <text x="34" y="150" font-size="16" class="twinkle t3">✨</text>
              <text x="190" y="150" font-size="20" class="twinkle t2">✨</text>
            </template>
            <template v-else>
              <text x="40" y="206" font-size="26" class="twinkle">🔥</text>
              <text x="170" y="206" font-size="26" class="twinkle t2">🔥</text>
              <text x="24" y="70" font-size="16" class="twinkle t3">🔥</text>
              <text x="206" y="70" font-size="16" class="twinkle t3">🔥</text>
            </template>
          </template>

          <!-- Sombra (crece con la mascota) -->
          <ellipse cx="120" cy="208" :rx="40 * escala" ry="8" fill="rgba(0,0,0,0.4)" />

          <!-- ===================== HUEVO ===================== -->
          <g v-if="etapaMascota === 'huevo'" class="animate-huevo">
            <ellipse cx="120" cy="150" rx="46" ry="58" :fill="gEgg" class="o" />
            <ellipse cx="102" cy="116" rx="11" ry="7" fill="rgba(255,255,255,0.5)" />
            <template v-if="!esRudo">
              <circle cx="100" cy="136" r="6" fill="#f9a8d4" opacity="0.7" />
              <circle cx="140" cy="164" r="7" fill="#c4b5fd" opacity="0.7" />
              <circle cx="112" cy="182" r="5" fill="#fde68a" opacity="0.8" />
              <ellipse cx="102" cy="154" rx="6" ry="3.5" fill="#f9a8d4" opacity="0.8" />
              <ellipse cx="138" cy="154" rx="6" ry="3.5" fill="#f9a8d4" opacity="0.8" />
              <path d="M 112 156 Q 120 163 128 156" stroke="#9d6b8a" stroke-width="2.2" fill="none" stroke-linecap="round" />
            </template>
            <template v-else>
              <circle cx="104" cy="170" r="3" fill="#2a2724" opacity="0.7" />
              <circle cx="138" cy="150" r="3.5" fill="#2a2724" opacity="0.7" />
              <circle cx="128" cy="184" r="2.5" fill="#2a2724" opacity="0.7" />
              <path d="M 100 104 L 112 122 L 102 134 L 118 150 L 110 164" stroke="#1c1917" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round" />
              <path d="M 112 122 L 102 134" stroke="#f59e0b" stroke-width="1.5" fill="none" opacity="0.8" />
            </template>
            <text x="150" y="82" font-size="20" class="animate-zzz">💤</text>
          </g>

          <!-- ===================== MASCOTA ===================== -->
          <g v-else class="pet-root" :transform="transformEscala">
            <g :class="claseAnimacionCuerpo">

              <!-- Capa (leyenda rudo) -->
              <g v-if="esRudo && etapaMascota === 'legendario'">
                <path d="M 90 146 Q 52 188 60 214 Q 120 224 180 214 Q 188 188 150 146 Z" fill="#b91c1c" stroke="#450a0a" stroke-width="3" stroke-linejoin="round" />
                <path d="M 104 156 Q 84 192 90 214 Q 120 218 150 214 Q 156 192 136 156 Z" fill="#7f1d1d" opacity="0.7" />
              </g>

              <!-- Alas (kawaii: radiante / legendario) -->
              <g v-if="!esRudo && (etapaMascota === 'musculoso' || etapaMascota === 'legendario')">
                <g v-for="s in [0, 1]" :key="s" :transform="s ? 'translate(240 0) scale(-1 1)' : ''">
                  <g :class="s ? 'animate-ala-der' : 'animate-ala-izq'">
                    <path
                      d="M 96 150 C 60 142 26 112 18 66 C 38 82 50 80 58 72 C 58 90 70 98 80 98 C 76 110 88 120 98 122 Z"
                      :fill="etapaMascota === 'legendario' ? gGold : '#ffffff'"
                      :stroke="etapaMascota === 'legendario' ? '#b45309' : '#c7d2fe'"
                      stroke-width="2.5" stroke-linejoin="round"
                    />
                    <path d="M 84 128 C 60 118 40 100 30 80 M 90 138 C 68 132 50 118 40 100" :stroke="etapaMascota === 'legendario' ? '#b45309' : '#c7d2fe'" stroke-width="1.8" fill="none" stroke-linecap="round" />
                  </g>
                </g>
              </g>

              <!-- Cola -->
              <g class="animate-wag" v-if="a.tail">
                <path v-if="a.tail === 'curl'" :d="esRudo ? 'M 148 186 Q 174 194 178 172' : 'M 148 182 Q 176 176 170 150 Q 168 140 160 146'" :stroke="a.c" :stroke-width="esRudo ? 11 : 10" fill="none" stroke-linecap="round" />
                <path v-else-if="a.tail === 'long'" d="M 148 186 Q 188 182 178 142 Q 175 130 164 136" :stroke="a.c" stroke-width="9" fill="none" stroke-linecap="round" />
                <g v-else-if="a.tail === 'fluffy'">
                  <path d="M 146 188 Q 194 200 190 150 Q 188 130 170 126 Q 178 154 156 170 Z" :fill="a.c" class="o" />
                  <path d="M 190 150 Q 188 130 170 126 Q 180 140 180 154 Z" :fill="a.belly" />
                </g>
                <circle v-else cx="152" cy="192" :r="esRudo ? 9 : 11" :fill="a.belly" class="o" />
              </g>

              <!-- Patas traseras de rana -->
              <template v-if="a.frog">
                <ellipse v-for="s in [-1, 1]" :key="'rl' + s" :cx="120 + s * 42" cy="190" :rx="esRudo ? 24 : 20" :ry="esRudo ? 16 : 12" :fill="a.c" class="o" :transform="`rotate(${s * 20} ${120 + s * 42} 190)`" />
              </template>

              <!-- Muslos (rudo) -->
              <template v-if="esRudo">
                <ellipse v-for="s in [-1, 1]" :key="'mu' + s" :cx="120 + s * 17" cy="197" :rx="11 + 6 * mus" ry="10" :fill="limbC" class="o" :style="{ stroke: limbStroke }" />
              </template>

              <!-- TORSO -->
              <template v-if="!esRudo">
                <ellipse cx="120" cy="172" :rx="bw" ry="31" :fill="gBody" class="o" />
                <ellipse cx="120" cy="178" :rx="bw - 10" ry="22" :fill="a.belly" />
              </template>
              <template v-else>
                <path :d="torso" :fill="gBody" class="o" />
                <path :d="vientre" :fill="a.belly" opacity="0.85" />

                <!-- Pectorales -->
                <g v-if="mus >= 0.3">
                  <g v-for="s in [-1, 1]" :key="'pec' + s">
                    <path :d="`M 120 158 Q ${120 + s * bw * 0.55} 154 ${120 + s * (bw - 5)} 160 Q ${120 + s * bw * 0.6} 184 120 176 Z`" fill="#fff" opacity="0.14" />
                    <path :d="`M 120 176 Q ${120 + s * bw * 0.55} 187 ${120 + s * (bw - 6)} 163`" :stroke="a.d" stroke-width="2.4" fill="none" opacity="0.55" stroke-linecap="round" />
                  </g>
                  <path d="M 120 158 L 120 177" :stroke="a.d" stroke-width="2" fill="none" opacity="0.4" stroke-linecap="round" />
                </g>

                <!-- Abdominales -->
                <g v-if="mus >= 0.5" :stroke="a.d" stroke-width="1.6" fill="rgba(255,255,255,0.14)" opacity="0.75">
                  <rect v-for="r in abdominales" :key="r.k" :x="r.x" :y="r.y" :width="r.w" height="5.5" rx="2" />
                </g>
              </template>

              <!-- BRAZOS -->
              <template v-if="!esRudo">
                <ellipse v-for="s in [-1, 1]" :key="'ak' + s" :cx="120 + s * (bw + 1)" cy="170" rx="8" ry="15" :fill="limbC" class="o" :transform="`rotate(${-s * 16} ${120 + s * (bw + 1)} 170)`" />
              </template>
              <template v-else>
                <!-- Brazos gruesos a los lados, algo abiertos y con el puño cerrado -->
                <g v-for="s in [-1, 1]" :key="'ar' + s" :transform="`translate(${120 + s * (bw - 6)} 154) rotate(${-s * 9 * mus})`">
                  <g :transform="`scale(${s * kxBrazo} 1)`">
                    <path :d="BRAZO_BAJO" :fill="limbC" class="o" :style="{ stroke: limbStroke }" />
                    <ellipse cx="13" cy="3" rx="5.5" ry="3.2" fill="#fff" opacity="0.2" />
                    <path v-if="mus >= 0.3" d="M 12 9 q 5 6 2 14" :stroke="a.d" stroke-width="1.8" fill="none" opacity="0.45" stroke-linecap="round" />
                    <path v-if="mus >= 0.55" d="M 16 26 q 3 5 0 10" :stroke="a.d" stroke-width="1.6" fill="none" opacity="0.35" stroke-linecap="round" />
                    <circle cx="9" cy="51" :r="7.5 + 1.5 * mus" :fill="limbC" class="o" :style="{ stroke: limbStroke }" />
                  </g>
                </g>
              </template>

              <!-- PIES -->
              <g v-for="s in [-1, 1]" :key="'ft' + s">
                <ellipse :cx="120 + s * 20" cy="204" :rx="esRudo ? 15 : 13" :ry="esRudo ? 7.5 : 6.5" :fill="footC" class="o" />
                <path v-if="esRudo && !a.frog && !a.mask" :d="`M ${120 + s * 20 - 6} 207 v4 M ${120 + s * 20} 208 v4 M ${120 + s * 20 + 6} 207 v4`" stroke="#e5e7eb" stroke-width="2" stroke-linecap="round" />
              </g>

              <!-- Correa (veterano) y cinturón de campeón (rudo) -->
              <template v-if="esRudo">
                <path v-if="idxEtapa === 4" d="M 92 150 L 148 198" stroke="#5b3a1e" stroke-width="7" stroke-linecap="round" />
                <g v-if="idxEtapa >= 5">
                  <rect :x="120 - bwa - 2" y="198" :width="2 * bwa + 4" height="7" rx="2" fill="#4b2e14" stroke="#1c0f05" stroke-width="2" />
                  <rect x="113" y="196" width="14" height="11" rx="2" fill="#facc15" stroke="#92400e" stroke-width="1.5" />
                </g>
              </template>

              <!-- ===================== CABEZA ===================== -->
              <g :transform="transformCabeza">

                <!-- Orejas -->
                <g v-if="earTipo === 'point'">
                  <g :transform="enRiesgo ? 'rotate(-22 98 92)' : ''">
                    <path :d="esRudo ? 'M 88 96 L 80 44 L 112 78 Z' : 'M 86 96 L 76 52 L 110 80 Z'" :fill="a.earC" class="o" />
                    <path :d="esRudo ? 'M 92 88 L 87 58 L 104 78 Z' : 'M 90 88 L 84 62 L 102 80 Z'" :fill="a.inner" />
                  </g>
                  <g :transform="enRiesgo ? 'rotate(22 142 92)' : ''">
                    <path :d="esRudo ? 'M 152 96 L 160 44 L 128 78 Z' : 'M 154 96 L 164 52 L 130 80 Z'" :fill="a.earC" class="o" />
                    <path :d="esRudo ? 'M 148 88 L 153 58 L 136 78 Z' : 'M 150 88 L 156 62 L 138 80 Z'" :fill="a.inner" />
                  </g>
                </g>
                <g v-else-if="earTipo === 'round'">
                  <circle cx="90" :cy="enRiesgo ? 90 : 84" :r="esRudo ? 13 : 15" :fill="a.earC" class="o" />
                  <circle cx="150" :cy="enRiesgo ? 90 : 84" :r="esRudo ? 13 : 15" :fill="a.earC" class="o" />
                  <circle cx="90" :cy="enRiesgo ? 90 : 84" :r="esRudo ? 6 : 8" :fill="a.inner" />
                  <circle cx="150" :cy="enRiesgo ? 90 : 84" :r="esRudo ? 6 : 8" :fill="a.inner" />
                </g>
                <g v-else-if="earTipo === 'floppy'">
                  <ellipse cx="85" cy="114" rx="15" ry="28" :fill="a.earC" class="o" :transform="`rotate(${enRiesgo ? 24 : 14} 85 100)`" />
                  <ellipse cx="155" cy="114" rx="15" ry="28" :fill="a.earC" class="o" :transform="`rotate(${enRiesgo ? -24 : -14} 155 100)`" />
                </g>
                <g v-else-if="earTipo === 'long'">
                  <g :transform="enRiesgo ? 'rotate(-62 106 84)' : (esRudo ? 'rotate(-26 106 84)' : 'rotate(-8 106 84)')" :class="{ 'animate-oreja': !enRiesgo }">
                    <ellipse cx="106" cy="46" :rx="esRudo ? 9 : 11" ry="38" :fill="a.earC" class="o" />
                    <ellipse cx="106" cy="50" rx="4.5" ry="27" :fill="a.inner" />
                  </g>
                  <g :transform="enRiesgo ? 'rotate(62 134 84)' : (esRudo ? 'rotate(6 134 84)' : 'rotate(8 134 84)')" :class="{ 'animate-oreja-der': !enRiesgo }">
                    <ellipse cx="134" cy="46" :rx="esRudo ? 9 : 11" ry="38" :fill="a.earC" class="o" />
                    <ellipse cx="134" cy="50" rx="4.5" ry="27" :fill="a.inner" />
                  </g>
                </g>

                <!-- Mechones de las mejillas (rudo) -->
                <template v-if="esRudo && !a.frog && !a.mask">
                  <path d="M 86 112 L 70 122 L 84 124 L 74 138 L 90 132 Z" :fill="tuftC" class="o" />
                  <path d="M 86 112 L 70 122 L 84 124 L 74 138 L 90 132 Z" :fill="tuftC" class="o" transform="translate(240 0) scale(-1 1)" />
                </template>

                <!-- Forma de la cabeza -->
                <ellipse v-if="a.frog" cx="120" cy="122" :rx="esRudo ? 46 : 44" :ry="esRudo ? 28 : 30" :fill="gBody" class="o" />
                <ellipse v-else-if="!esRudo" cx="120" cy="116" rx="40" ry="37" :fill="gBody" class="o" />
                <path v-else :d="HEAD_R" :fill="gBody" class="o" />

                <!-- Manchas y marcas -->
                <template v-if="a.panda">
                  <ellipse cx="101" cy="114" rx="11" ry="13" :fill="a.d" transform="rotate(-20 101 114)" />
                  <ellipse cx="139" cy="114" rx="11" ry="13" :fill="a.d" transform="rotate(20 139 114)" />
                </template>
                <ellipse v-if="a.eyeSpot && !esRudo" cx="139" cy="110" rx="14" ry="15" :fill="a.d" opacity="0.85" />
                <g v-if="a.stripes && esRudo" :stroke="a.d" stroke-width="3.5" stroke-linecap="round" opacity="0.8">
                  <path d="M 112 82 L 113 96" /><path d="M 120 80 L 120 96" /><path d="M 128 82 L 127 96" />
                </g>
                <template v-if="a.cheeks && !esRudo">
                  <ellipse cx="92" cy="128" rx="15" ry="9" :fill="a.belly" />
                  <ellipse cx="148" cy="128" rx="15" ry="9" :fill="a.belly" />
                </template>
                <template v-if="a.mask">
                  <ellipse v-if="!esRudo" cx="120" cy="124" rx="29" ry="24" :fill="a.belly" />
                  <path v-else d="M 94 102 Q 120 94 146 102 Q 152 128 120 150 Q 88 128 94 102 Z" :fill="a.belly" />
                </template>

                <!-- Hocico -->
                <ellipse v-if="a.snout === 'muzzle' || a.snout === 'small'" cx="120" :cy="muz.cy" :rx="muz.rx" :ry="muz.ry" :fill="a.belly" class="o2" />

                <!-- Nariz -->
                <template v-if="a.snout === 'muzzle' || a.snout === 'small'">
                  <path v-if="esRudo" :d="NARIZ_R" :fill="a.nose" />
                  <ellipse v-else-if="a.snout === 'muzzle'" cx="120" cy="125" rx="5" ry="3.6" :fill="a.nose" />
                  <path v-else d="M 115 124 Q 120 120 125 124 L 120 130 Z" :fill="a.nose" />
                </template>
                <path
                  v-if="a.snout === 'beak'"
                  :d="esRudo ? 'M 104 124 Q 120 114 136 124 L 120 152 Z' : 'M 111 126 Q 120 118 129 126 L 120 139 Z'"
                  :fill="a.beak" class="o"
                />
                <g v-if="a.frog" :fill="a.nose">
                  <ellipse cx="114" cy="120" rx="2" ry="1.4" /><ellipse cx="126" cy="120" rx="2" ry="1.4" />
                </g>

                <!-- Bigotes -->
                <g v-if="a.whisk" :stroke="esRudo ? '#e5e7eb' : trazo" :stroke-width="esRudo ? 2 : 1.5" stroke-linecap="round" :opacity="esRudo ? 0.85 : 0.6" fill="none">
                  <path :d="esRudo ? 'M 100 134 L 66 126 M 100 138 L 66 140' : 'M 100 131 L 80 126 M 100 135 L 80 137'" />
                  <path :d="esRudo ? 'M 140 134 L 174 126 M 140 138 L 174 140' : 'M 140 131 L 160 126 M 140 135 L 160 137'" />
                </g>

                <!-- Mejillas rosas (kawaii) -->
                <template v-if="!esRudo">
                  <ellipse cx="84" cy="128" rx="7" ry="4" fill="#f9a8d4" opacity="0.75" />
                  <ellipse cx="156" cy="128" rx="7" ry="4" fill="#f9a8d4" opacity="0.75" />
                </template>

                <!-- ============ OJOS ============ -->
                <!-- Rana -->
                <template v-if="a.frog">
                  <g class="ojos-parpadeo">
                    <template v-if="!esRudo">
                      <circle cx="92" cy="94" r="14" fill="#ffffff" class="o" />
                      <circle cx="148" cy="94" r="14" fill="#ffffff" class="o" />
                      <circle cx="94" cy="96" r="8" :fill="a.eye" />
                      <circle cx="146" cy="96" r="8" :fill="a.eye" />
                      <circle cx="91" cy="92" r="3" fill="#fff" /><circle cx="143" cy="92" r="3" fill="#fff" />
                    </template>
                    <template v-else>
                      <circle cx="92" cy="94" r="13" fill="#fef3c7" class="o" />
                      <circle cx="148" cy="94" r="13" fill="#fef3c7" class="o" />
                      <circle cx="92" cy="96" r="9" :fill="a.eye" /><circle cx="148" cy="96" r="9" :fill="a.eye" />
                      <ellipse cx="92" cy="96" :rx="enRiesgo ? 7 : 7" :ry="enRiesgo ? 5 : 2.4" fill="#000" />
                      <ellipse cx="148" cy="96" :rx="enRiesgo ? 7 : 7" :ry="enRiesgo ? 5 : 2.4" fill="#000" />
                      <path d="M 79 95 A 13 13 0 0 1 105 91 Z" :fill="a.c" class="o" />
                      <path d="M 161 95 A 13 13 0 0 0 135 91 Z" :fill="a.c" class="o" />
                    </template>
                  </g>
                  <path v-if="!enRiesgo" :d="esRudo ? 'M 88 132 Q 120 144 152 132' : 'M 94 130 Q 120 148 146 130'" :stroke="trazo" :stroke-width="esRudo ? 3.5 : 2.6" fill="none" stroke-linecap="round" />
                  <ellipse v-else cx="120" cy="136" rx="5" ry="6" :fill="trazo" />
                  <g v-if="esRudo" :fill="a.d" opacity="0.55">
                    <circle cx="112" cy="104" r="2.4" /><circle cx="130" cy="108" r="2" /><circle cx="120" cy="100" r="1.8" />
                  </g>
                </template>

                <!-- Kawaii (ojos grandes) -->
                <g v-else-if="!esRudo" class="ojos-parpadeo">
                  <ellipse cx="102" cy="113" rx="8" ry="10" :fill="a.eye" />
                  <ellipse cx="138" cy="113" rx="8" ry="10" :fill="a.eye" />
                  <circle cx="99" cy="109" r="3.2" fill="#fff" /><circle cx="135" cy="109" r="3.2" fill="#fff" />
                  <circle cx="105" cy="117" r="1.5" fill="#fff" /><circle cx="141" cy="117" r="1.5" fill="#fff" />
                </g>

                <!-- Rudo (ojos reales, mirada seria) -->
                <template v-else>
                  <g class="ojos-parpadeo">
                    <g v-for="s in [-1, 1]" :key="'eye' + s">
                      <ellipse
                        :cx="120 + s * 18" cy="113" rx="7" ry="5.8"
                        :fill="etapaMascota === 'legendario' && !enRiesgo ? '#ef4444' : a.eye"
                        stroke="#000" stroke-width="1.6"
                        :filter="etapaMascota === 'legendario' && !enRiesgo ? fGlow : undefined"
                      />
                      <ellipse :cx="120 + s * 18" cy="113" :rx="(a.slit ? 1.6 : 3.2) * (enRiesgo ? 1.5 : 1)" :ry="a.slit ? 5.2 : 3.4" fill="#000" />
                      <circle :cx="120 + s * 18 - 2" cy="111.5" r="1.3" fill="#fff" />
                    </g>
                  </g>
                  <template v-if="!enRiesgo">
                    <path d="M 92 105 L 113 105 L 113 111 Z" :fill="a.c" class="o2" />
                    <path d="M 148 105 L 127 105 L 127 111 Z" :fill="a.c" class="o2" />
                    <path d="M 90 100 L 114 105 M 150 100 L 126 105" :stroke="a.d" stroke-width="3.5" stroke-linecap="round" opacity="0.85" />
                  </template>
                  <path v-else d="M 92 106 L 112 98 M 148 106 L 128 98" :stroke="a.d" stroke-width="3.5" stroke-linecap="round" opacity="0.9" />
                </template>

                <!-- ============ BOCA ============ -->
                <template v-if="!a.frog && a.snout !== 'beak'">
                  <template v-if="!esRudo">
                    <path v-if="!enRiesgo" d="M 120 134 L 120 136 M 111 136 Q 115.5 142 120 136 Q 124.5 142 129 136" :stroke="trazo" stroke-width="2" fill="none" stroke-linecap="round" />
                    <ellipse v-else cx="120" cy="141" rx="4" ry="5" :fill="trazo" />
                    <g v-if="a.teeth && !enRiesgo" fill="#fff" :stroke="trazo" stroke-width="1.2">
                      <rect x="116" y="138" width="4" height="6" rx="1" /><rect x="120.5" y="138" width="4" height="6" rx="1" />
                    </g>
                  </template>
                  <template v-else>
                    <path v-if="!enRiesgo" d="M 120 136 L 120 144 M 106 144 Q 120 151 134 144" :stroke="a.d" stroke-width="2.6" fill="none" stroke-linecap="round" />
                    <path v-else d="M 106 148 Q 113 143 120 148 Q 127 153 134 148" :stroke="a.d" stroke-width="2.6" fill="none" stroke-linecap="round" />
                    <g v-if="a.fangs && !enRiesgo" fill="#fff" :stroke="a.d" stroke-width="1.2" stroke-linejoin="round">
                      <path d="M 109 145 L 112 154 L 116 147 Z" /><path d="M 131 145 L 128 154 L 124 147 Z" />
                    </g>
                    <g v-if="a.teeth && !enRiesgo" fill="#fff" :stroke="a.d" stroke-width="1.5">
                      <rect x="114" y="147" width="5.5" height="9" rx="1" /><rect x="120.5" y="147" width="5.5" height="9" rx="1" />
                    </g>
                  </template>
                </template>
                <path v-if="a.snout === 'beak' && esRudo" d="M 108 134 L 132 134" :stroke="a.d" stroke-width="1.6" opacity="0.7" />

                <!-- Cicatriz (rudo adulto en adelante) -->
                <g v-if="esRudo && idxEtapa >= 3 && !a.mask" :stroke="idxEtapa >= 5 ? '#fca5a5' : '#e5c9c9'" stroke-width="2.6" stroke-linecap="round" fill="none">
                  <path d="M 93 90 L 109 130" />
                  <path d="M 96 100 l 6 -3 M 100 110 l 6 -3 M 104 120 l 6 -3" stroke-width="1.8" />
                </g>
                <g v-if="esRudo && idxEtapa >= 3 && a.mask" stroke="#fca5a5" stroke-width="2.6" stroke-linecap="round" fill="none">
                  <path d="M 126 96 L 140 124" />
                </g>

                <!-- Lágrima / sudor (en riesgo) -->
                <path v-if="enRiesgo" d="M 154 92 Q 161 106 154 112 Q 147 106 154 92 Z" fill="#60a5fa" stroke="#1d4ed8" stroke-width="1.4" />
                <path v-if="enRiesgo && !esRudo && !a.frog" d="M 96 126 Q 92 136 96 140 Q 100 136 96 126 Z" fill="#93c5fd" />

                <!-- ============ ACCESORIOS DE CABEZA ============ -->

                <!-- Cascarón (bebé) -->
                <g v-if="etapaMascota === 'bebe'">
                  <path
                    d="M 84 100 L 91 86 L 99 98 L 108 82 L 117 98 L 126 80 L 134 98 L 143 84 L 150 98 L 156 100 Q 158 70 120 62 Q 82 70 84 100 Z"
                    :fill="esRudo ? '#cfc6b3' : '#fffdf7'" :stroke="esRudo ? '#4a3f2a' : '#d9cdb4'" stroke-width="2.6" stroke-linejoin="round"
                  />
                  <path v-if="esRudo" d="M 108 70 L 114 82 L 108 90" stroke="#4a3f2a" stroke-width="2" fill="none" stroke-linecap="round" />
                </g>

                <!-- Moño (kawaii joven / adulto) -->
                <g v-if="!esRudo && (etapaMascota === 'adolescente' || etapaMascota === 'adulto')">
                  <path d="M 146 86 L 126 74 L 126 98 Z" fill="#f472b6" stroke="#be185d" stroke-width="2" stroke-linejoin="round" />
                  <path d="M 146 86 L 166 74 L 166 98 Z" fill="#f472b6" stroke="#be185d" stroke-width="2" stroke-linejoin="round" />
                  <circle cx="146" cy="86" r="6" fill="#ec4899" stroke="#be185d" stroke-width="2" />
                </g>

                <!-- Corona de flores (kawaii sabio / radiante) -->
                <g v-if="!esRudo && (etapaMascota === 'senior' || etapaMascota === 'musculoso')">
                  <g v-for="(f, i) in [[92, 90, '#f9a8d4'], [105, 80, '#fde68a'], [120, 76, '#ffffff'], [135, 80, '#c4b5fd'], [148, 90, '#f9a8d4']]" :key="i">
                    <circle :cx="f[0]" :cy="f[1]" r="7" :fill="f[2]" stroke="#be185d" stroke-width="1.4" />
                    <circle :cx="f[0]" :cy="f[1]" r="2.6" fill="#facc15" />
                  </g>
                  <path d="M 90 94 Q 120 70 150 94" stroke="#22c55e" stroke-width="2.4" fill="none" stroke-linecap="round" />
                </g>

                <!-- Banda de pelea (rudo) -->
                <g v-if="esRudo && idxEtapa >= 2 && idxEtapa <= 5">
                  <path d="M 84 96 Q 120 86 156 96 L 156 106 Q 120 96 84 106 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2.4" stroke-linejoin="round" />
                  <path d="M 156 98 L 174 90 L 170 104 Z M 156 102 L 172 114 L 160 112 Z" fill="#dc2626" stroke="#7f1d1d" stroke-width="2" stroke-linejoin="round" />
                </g>

                <!-- Corona (leyenda) -->
                <g v-if="etapaMascota === 'legendario'">
                  <path
                    :d="esRudo ? 'M 90 86 L 92 50 L 106 70 L 120 42 L 134 70 L 148 50 L 150 86 Z' : 'M 92 86 L 94 56 L 108 72 L 120 48 L 132 72 L 146 56 L 148 86 Q 120 94 92 86 Z'"
                    :fill="gGold" stroke="#78350f" stroke-width="2.6" stroke-linejoin="round"
                  />
                  <circle cx="120" cy="70" r="4.5" :fill="esRudo ? '#ef4444' : '#f472b6'" stroke="#78350f" stroke-width="1.4" />
                  <circle cx="102" cy="78" r="3" fill="#60a5fa" /><circle cx="138" cy="78" r="3" fill="#60a5fa" />
                </g>
              </g>

              <!-- ============ ACCESORIOS DE CUELLO / PECHO ============ -->

              <!-- Bufanda (kawaii adulto / sabio) -->
              <g v-if="!esRudo && (etapaMascota === 'adulto' || etapaMascota === 'senior')">
                <path d="M 90 150 Q 120 166 150 150 L 152 162 Q 120 178 88 162 Z" fill="#f472b6" stroke="#be185d" stroke-width="2" stroke-linejoin="round" />
                <path d="M 138 164 L 152 192 L 138 192 Z" fill="#ec4899" stroke="#be185d" stroke-width="2" stroke-linejoin="round" />
              </g>

              <!-- Corazón (kawaii radiante / legendario) -->
              <path
                v-if="!esRudo && (etapaMascota === 'musculoso' || etapaMascota === 'legendario')"
                d="M 120 190 C 100 176 106 162 120 172 C 134 162 140 176 120 190 Z"
                :fill="etapaMascota === 'legendario' ? gGold : '#fb7185'"
                :stroke="etapaMascota === 'legendario' ? '#b45309' : '#be123c'" stroke-width="2" stroke-linejoin="round"
              />

              <!-- Placa de identificación (rudo adulto en adelante) -->
              <g v-if="esRudo && idxEtapa >= 3">
                <path d="M 100 151 Q 120 174 140 151" stroke="#cbd5e1" stroke-width="2.6" fill="none" stroke-linecap="round" />
                <rect x="114" y="163" width="12" height="14" rx="2.5" fill="#94a3b8" stroke="#475569" stroke-width="2" />
              </g>

            </g>
          </g>
        </svg>
      </div>
    </div>

    <div class="pet-info-footer">
      <span class="pet-stage-tag" :class="{ 'tag-alert': enRiesgo }">{{ etiquetaEstado }}</span>

      <div class="stage-track" role="img" :aria-label="`Etapa ${idxEtapa + 1} de ${ETAPAS.length}`">
        <i
          v-for="(e, i) in ETAPAS"
          :key="e"
          :class="{ done: i < idxEtapa, now: i === idxEtapa }"
          :title="nombresEtapa[e]"
        ></i>
      </div>

      <h3 class="pet-name">{{ nombre }}</h3>

      <p v-if="enRiesgo" class="pet-alert-text">¡Cumple hoy o tu racha de {{ racha }} se pierde!</p>
      <p v-else-if="siguiente" class="pet-next">
        Siguiente: {{ siguiente.nombre }} en {{ siguiente.dias }} {{ siguiente.dias === 1 ? 'día' : 'días' }}
      </p>
      <p v-else class="pet-next">Etapa máxima alcanzada</p>
    </div>
  </div>
</template>

<style scoped>
.pet-card-inner {
  --acc: #94a3b8;

  width: 100%;
  height: 100%;
  min-height: 300px;
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  /* Sin cuadro: solo un resplandor suave que se desvanece */
  background: radial-gradient(ellipse 70% 55% at 50% 42%, color-mix(in srgb, var(--acc) 34%, transparent), transparent 100%);
  transition: background 0.5s ease;
}

/* Colores por etapa: kawaii = pasteles · rudo = metal, ámbar y rojo */
.theme-huevo { --acc: #94a3b8; }
.theme-bebe { --acc: #fbbf24; }
.theme-adolescente { --acc: #fb923c; }
.theme-adulto { --acc: #f472b6; }
.theme-senior { --acc: #a78bfa; }
.theme-musculoso { --acc: #60a5fa; }
.theme-legendario { --acc: #facc15; }

.estilo-rudo.theme-huevo { --acc: #78716c; }
.estilo-rudo.theme-bebe { --acc: #a8a29e; }
.estilo-rudo.theme-adolescente { --acc: #f97316; }
.estilo-rudo.theme-adulto { --acc: #ef4444; }
.estilo-rudo.theme-senior { --acc: #b45309; }
.estilo-rudo.theme-musculoso { --acc: #dc2626; }
.estilo-rudo.theme-legendario { --acc: #f59e0b; }

.mood-asustado.pet-card-inner::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 70% 55% at 50% 42%, rgba(239, 68, 68, 0.38), transparent 100%);
  pointer-events: none;
  z-index: 1;
  animation: alertGlow 1.8s ease-in-out infinite;
}

@keyframes alertGlow {
  0%, 100% { opacity: 0.45; }
  50% { opacity: 1; }
}

/* ---------- Partículas ---------- */

.ambient-particles { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1; }

.particle { position: absolute; font-size: 14px; opacity: 0.6; animation: floatParticle 4s ease-in-out infinite; }
.particle.p0 { top: 14%; left: 10%; animation-duration: 3.6s; }
.particle.p1 { top: 30%; right: 9%; animation-duration: 4.4s; animation-delay: 1.1s; }
.particle.p2 { top: 62%; left: 8%; animation-duration: 3.9s; animation-delay: 2.2s; }

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.35; }
  50% { transform: translateY(-12px) rotate(15deg); opacity: 0.9; }
}

/* ---------- Escenario ---------- */

.pet-stage {
  position: relative;
  flex: 1;
  width: 100%;
  min-height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  z-index: 2;
  cursor: pointer;
}

.pet-visual {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1.8s cubic-bezier(0.65, 0.05, 0.36, 1);
}

.pet-svg {
  width: min(100%, 242px);
  height: auto;
  aspect-ratio: 264 / 270;
  overflow: visible;
  transition: filter 0.5s ease;
}

.pet-svg.mood-asustado { filter: grayscale(0.5) brightness(0.9) saturate(0.8); }
.pet-svg.musculoso.estilo-kawaii { filter: drop-shadow(0 0 10px rgba(249, 168, 212, 0.55)); }
.pet-svg.musculoso.estilo-rudo { filter: drop-shadow(0 0 10px rgba(239, 68, 68, 0.5)); }
.pet-svg.legendario { filter: drop-shadow(0 0 14px rgba(250, 204, 21, 0.65)); }
.pet-svg.mood-asustado.musculoso,
.pet-svg.mood-asustado.legendario { filter: grayscale(0.5) brightness(0.9) saturate(0.8); }

.pet-svg.saltando { animation: hop 0.65s cubic-bezier(0.3, 0.7, 0.4, 1); }

@keyframes hop {
  0% { transform: translateY(0) scale(1, 1); }
  25% { transform: translateY(6px) scale(1.06, 0.92); }
  55% { transform: translateY(-22px) scale(0.96, 1.06); }
  100% { transform: translateY(0) scale(1, 1); }
}

/* Trazos compartidos por todas las formas */
.o { stroke: var(--trazo); stroke-width: var(--sw); stroke-linejoin: round; stroke-linecap: round; }
.o2 { stroke: var(--trazo); stroke-width: 1.4; stroke-linejoin: round; }

/* ---------- Animaciones del cuerpo ---------- */

@keyframes floatAnim { 0%, 100% { transform: translateY(0) scaleY(1); } 50% { transform: translateY(-6px) scaleY(1.02); } }
@keyframes respirar { 0%, 100% { transform: scale(1, 1); } 50% { transform: scale(1.02, 1.035); } }
@keyframes tremble {
  0%, 100% { transform: translate(0, 3px) rotate(0deg); }
  25% { transform: translate(-2px, 4px) rotate(-2deg); }
  75% { transform: translate(2px, 4px) rotate(2deg); }
}
@keyframes wag { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(9deg); } }
@keyframes auraPulse { 0%, 100% { opacity: 0.6; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }
@keyframes waddle { 0%, 100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-4px) rotate(4deg); } }
@keyframes sway { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-3px) rotate(2deg); } }
@keyframes huevoVida {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  10% { transform: translateY(-4px) rotate(0deg); }
  20% { transform: translateY(0) rotate(0deg); }
  82% { transform: translateY(0) rotate(0deg); }
  84% { transform: translateY(0) rotate(-5deg); }
  86% { transform: translateY(0) rotate(5deg); }
  88% { transform: translateY(0) rotate(-4deg); }
  90% { transform: translateY(0) rotate(0deg); }
}
@keyframes parpadeo { 0%, 88%, 100% { transform: scaleY(1); } 91%, 95% { transform: scaleY(0.1); } }
@keyframes orejaInquieta { 0%, 100% { translate: 0 0; } 50% { translate: 0 -2px; } }
@keyframes alaIzq { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-7deg); } }
@keyframes alaDer { 0%, 100% { transform: rotate(0deg); } 50% { transform: rotate(-7deg); } }
@keyframes brillo { 0%, 100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.15); } }

.animate-float { animation: floatAnim 3s ease-in-out infinite; transform-origin: 120px 205px; }
.animate-respirar { animation: respirar 3.2s ease-in-out infinite; transform-origin: 120px 205px; }
.animate-tremble { animation: tremble 0.35s ease-in-out infinite; transform-origin: 120px 205px; }
.animate-waddle { animation: waddle 1.1s ease-in-out infinite; transform-origin: 120px 205px; }
.animate-sway { animation: sway 2.6s ease-in-out infinite; transform-origin: 120px 205px; }
.animate-huevo { animation: huevoVida 6s ease-in-out infinite; transform-origin: 120px 205px; }
.animate-zzz { animation: floatAnim 2s ease-in-out infinite; }
.animate-wag { animation: wag 0.7s ease-in-out infinite; transform-origin: 148px 186px; }
.animate-auraPulse { animation: auraPulse 2.4s ease-in-out infinite; transform-origin: 120px 125px; }
.animate-oreja { animation: orejaInquieta 2.4s ease-in-out infinite; }
.animate-oreja-der { animation: orejaInquieta 2.8s ease-in-out infinite; }
.animate-ala-izq { animation: alaIzq 1.8s ease-in-out infinite; transform-origin: 96px 146px; }
.animate-ala-der { animation: alaDer 1.8s ease-in-out infinite; transform-origin: 96px 146px; }

.twinkle { animation: brillo 2.2s ease-in-out infinite; transform-box: fill-box; transform-origin: center; }
.twinkle.t2 { animation-delay: 0.7s; }
.twinkle.t3 { animation-delay: 1.4s; }

.ojos-parpadeo { transform-box: fill-box; transform-origin: center; animation: parpadeo 4.5s ease-in-out infinite; }

/* ---------- Pie de la tarjeta ---------- */

.pet-info-footer { text-align: center; z-index: 2; display: flex; flex-direction: column; align-items: center; gap: 6px; }

.pet-stage-tag {
  font-family: 'Oswald', sans-serif;
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 9px;
  background: rgba(0, 0, 0, 0.45);
  color: #facc15;
  border-radius: 6px;
  letter-spacing: 0.6px;
}

.estilo-rudo .pet-stage-tag { color: #fdba74; }
.pet-stage-tag.tag-alert { color: #fecaca; background: rgba(127, 29, 29, 0.55); }

/* Siete puntos: una por etapa */
.stage-track { display: flex; align-items: center; gap: 5px; }

.stage-track i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.14);
  transition: background 0.3s ease, transform 0.3s ease;
}

.estilo-rudo .stage-track i { border-radius: 2px; transform: rotate(45deg); }

.stage-track i.done { background: color-mix(in srgb, var(--acc) 70%, white 0%); }
.stage-track i.now { background: var(--acc); box-shadow: 0 0 0 3px color-mix(in srgb, var(--acc) 30%, transparent); transform: scale(1.25); }
.estilo-rudo .stage-track i.now { transform: rotate(45deg) scale(1.25); }

.pet-name {
  font-family: 'Anton', 'Oswald', sans-serif;
  font-size: 1.1rem;
  margin: 2px 0 0;
  color: #f5f5f4;
  letter-spacing: 0.5px;
}

.pet-next { margin: 0; font-size: 11px; color: rgba(245, 245, 244, 0.55); font-weight: 600; }
.pet-alert-text { margin: 0; font-size: 11px; color: #fca5a5; font-weight: 600; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
}
</style>
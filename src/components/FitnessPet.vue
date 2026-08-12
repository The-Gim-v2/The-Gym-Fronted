<script setup>
import { computed, ref, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  nombre: { type: String, default: 'Entrenador' },
  nivel: { type: String, default: 'Nivel 90' },
  racha: { type: Number, default: 0 },
  tipo: { type: String, default: 'perro' },
  // NUEVO: indica si el usuario ya cumplió su racha/objetivo del día de hoy
  activoHoy: { type: Boolean, default: true },
  // NUEVO: activa/desactiva los sonidos sintetizados
  sonidoActivado: { type: Boolean, default: true }
});

// Emite 'sonido' cada vez que la mascota "habla", con el tipo de animal y su ánimo.
// Útil si quieres reemplazar el sonido sintetizado por un audio real (mp3) desde el componente padre:
// <PetCard @sonido="({tipo, animo}) => reproducirAudioReal(tipo, animo)" />
const emit = defineEmits(['sonido']);

/* ---------- ETAPA DE CRECIMIENTO (según racha) ---------- */
const etapaMascota = computed(() => {
  if (props.racha === 0) return 'huevo';
  if (props.racha < 10) return 'bebe';
  if (props.racha < 30) return 'adolescente';
  if (props.racha < 100) return 'adulto';
  if (props.racha < 200) return 'senior';
  if (props.racha < 365) return 'musculoso';
  return 'legendario';
});

const escalaMascota = computed(() => {
  switch (etapaMascota.value) {
    case 'huevo': return 0.70;
    case 'bebe': return 0.65;
    case 'adolescente': return 0.85;
    case 'adulto': return 1.00;
    case 'senior': return 1.15;
    case 'musculoso': return 1.45;
    case 'legendario': return 1.65;
    default: return 1;
  }
});

const temaEvolucion = computed(() => `theme-${etapaMascota.value}`);

/* ---------- ESTADO DE ÁNIMO (según si cumplió hoy) ---------- */
// 'dormido'  -> todavía no nace (huevo, racha 0)
// 'feliz'    -> ya cumplió su racha hoy
// 'asustado' -> tiene racha activa pero HOY no ha cumplido (riesgo de perderla)
const animo = computed(() => {
  if (props.racha === 0) return 'dormido';
  return props.activoHoy ? 'feliz' : 'asustado';
});

const enRiesgo = computed(() => animo.value === 'asustado');

const claseAnimo = computed(() => `mood-${animo.value}`);
const claseAnimacionCuerpo = computed(() => {
  if (enRiesgo.value) return 'animate-tremble';
  if (props.tipo === 'pinguino') return 'animate-waddle';
  if (props.tipo === 'oso_pardo' || props.tipo === 'oso_polar') return 'animate-sway';
  return 'animate-float';
});

const etiquetaEstado = computed(() => {
  if (animo.value === 'dormido') return `${props.nivel} • por nacer`;
  if (enRiesgo.value) return `${props.nivel} • ¡en riesgo!`;
  return `${props.nivel} • ${etapaMascota.value}`;
});

/* ---------- MOVIMIENTO: la mascota camina de un lado a otro ---------- */
const posX = ref(0);
const mirandoIzquierda = ref(false);

function moverAleatorio() {
  // dormida o asustada: se queda quieta (asustada ya tiembla en su sitio)
  if (animo.value !== 'feliz') {
    posX.value = 0;
    return;
  }
  const nuevoX = Math.round(Math.random() * 60 - 30); // entre -30 y 30 px
  mirandoIzquierda.value = nuevoX < posX.value;
  posX.value = nuevoX;
}

/* ---------- SONIDO: cada raza "habla" con su propio sonido ---------- */
// AVISO IMPORTANTE: el navegador no permite incrustar grabaciones reales aquí,
// así que estos sonidos son SINTETIZADOS (osciladores + ruido filtrado) para
// aproximarse al timbre real de cada animal, no son audios reales.
// Si tienes archivos de audio reales, escucha el evento @sonido (ver arriba)
// y reprodúcelos tú desde el componente padre en lugar de estos.
let audioCtx = null;
function obtenerAudioCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = AC ? new AC() : null;
  }
  return audioCtx;
}

// Tono armónico (cuerdas vocales / silbido)
function tono({ freqInicio, freqFin = freqInicio, duracion = 0.2, tipoOnda = 'sine', volumen = 0.15, retraso = 0 }) {
  if (!props.sonidoActivado) return;
  const ctx = obtenerAudioCtx();
  if (!ctx) return;
  const inicio = ctx.currentTime + retraso;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = tipoOnda;
  osc.frequency.setValueAtTime(freqInicio, inicio);
  osc.frequency.exponentialRampToValueAtTime(Math.max(freqFin, 1), inicio + duracion);
  gain.gain.setValueAtTime(volumen, inicio);
  gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracion);
  osc.connect(gain).connect(ctx.destination);
  osc.start(inicio);
  osc.stop(inicio + duracion + 0.05);
}

// Ruido filtrado (aire, aspereza, "grano" de voz) — esto es lo que más ayuda
// a que un ladrido/gruñido/graznido deje de sonar a "beep" y suene más orgánico.
function ruido({ duracion = 0.12, volumen = 0.2, frecuencia = 1000, tipoFiltro = 'bandpass', q = 1.2, retraso = 0 }) {
  if (!props.sonidoActivado) return;
  const ctx = obtenerAudioCtx();
  if (!ctx) return;
  const inicio = ctx.currentTime + retraso;
  const muestras = Math.max(1, Math.floor(ctx.sampleRate * duracion));
  const buffer = ctx.createBuffer(1, muestras, ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < muestras; i++) datos[i] = Math.random() * 2 - 1;
  const fuente = ctx.createBufferSource();
  fuente.buffer = buffer;
  const filtro = ctx.createBiquadFilter();
  filtro.type = tipoFiltro;
  filtro.frequency.value = frecuencia;
  filtro.Q.value = q;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volumen, inicio);
  gain.gain.exponentialRampToValueAtTime(0.001, inicio + duracion);
  fuente.connect(filtro).connect(gain).connect(ctx.destination);
  fuente.start(inicio);
  fuente.stop(inicio + duracion + 0.02);
}

function ladrarPerro() {
  [0, 0.22].forEach(retraso => {
    ruido({ duracion: 0.08, volumen: 0.22, frecuencia: 650, tipoFiltro: 'bandpass', q: 1.4, retraso });
    tono({ freqInicio: 280, freqFin: 120, duracion: 0.13, tipoOnda: 'sawtooth', volumen: 0.15, retraso });
  });
}
function maullarGato() {
  ruido({ duracion: 0.05, volumen: 0.06, frecuencia: 2200, tipoFiltro: 'highpass', q: 0.6 });
  tono({ freqInicio: 550, freqFin: 900, duracion: 0.17, tipoOnda: 'sawtooth', volumen: 0.11 });
  tono({ freqInicio: 900, freqFin: 470, duracion: 0.26, tipoOnda: 'sawtooth', volumen: 0.09, retraso: 0.16 });
}
function piarPinguino() {
  [0, 0.15, 0.3].forEach(retraso => {
    ruido({ duracion: 0.05, volumen: 0.1, frecuencia: 1900, tipoFiltro: 'bandpass', q: 3, retraso });
    tono({ freqInicio: 850, freqFin: 1450, duracion: 0.09, tipoOnda: 'square', volumen: 0.1, retraso });
  });
}
function aullarZorro() {
  [0, 0.2].forEach(retraso => {
    ruido({ duracion: 0.07, volumen: 0.14, frecuencia: 1300, tipoFiltro: 'bandpass', q: 2, retraso });
    tono({ freqInicio: 950, freqFin: 470, duracion: 0.14, tipoOnda: 'sawtooth', volumen: 0.13, retraso });
  });
}
function croarRana() {
  [0, 0.08, 0.16, 0.24].forEach(retraso => {
    ruido({ duracion: 0.06, volumen: 0.16, frecuencia: 220, tipoFiltro: 'lowpass', q: 0.9, retraso });
    tono({ freqInicio: 150, freqFin: 95, duracion: 0.08, tipoOnda: 'sawtooth', volumen: 0.13, retraso });
  });
}
function gruñirOso() {
  ruido({ duracion: 0.55, volumen: 0.18, frecuencia: 180, tipoFiltro: 'lowpass', q: 0.7 });
  tono({ freqInicio: 100, freqFin: 55, duracion: 0.55, tipoOnda: 'sawtooth', volumen: 0.14 });
}
function balarPanda() {
  ruido({ duracion: 0.09, volumen: 0.05, frecuencia: 900, tipoFiltro: 'bandpass', q: 2, retraso: 0.02 });
  tono({ freqInicio: 420, freqFin: 300, duracion: 0.3, tipoOnda: 'triangle', volumen: 0.12 });
}
function chillarConejo() {
  ruido({ duracion: 0.04, volumen: 0.08, frecuencia: 3200, tipoFiltro: 'highpass', q: 1, retraso: 0.02 });
  tono({ freqInicio: 1300, freqFin: 1700, duracion: 0.08, tipoOnda: 'sine', volumen: 0.1, retraso: 0.02 });
}
function sonidoGenerico() {
  ruido({ duracion: 0.05, volumen: 0.06, frecuencia: 1500, tipoFiltro: 'bandpass', q: 1 });
  tono({ freqInicio: 500, freqFin: 700, duracion: 0.15, tipoOnda: 'sine', volumen: 0.12 });
}
function gemirTriste() {
  ruido({ duracion: 0.08, volumen: 0.05, frecuencia: 700, tipoFiltro: 'lowpass', q: 0.8 });
  tono({ freqInicio: 300, freqFin: 170, duracion: 0.4, tipoOnda: 'sine', volumen: 0.11 });
}
// Golpecitos suaves desde adentro del huevo (todavía no nace)
function tocarCascaron() {
  [0, 0.18].forEach(retraso => {
    ruido({ duracion: 0.035, volumen: 0.14, frecuencia: 950, tipoFiltro: 'bandpass', q: 5, retraso });
  });
  tono({ freqInicio: 90, freqFin: 70, duracion: 0.12, tipoOnda: 'sine', volumen: 0.06, retraso: 0.05 });
}

const emisorSonido = computed(() => {
  switch (props.tipo) {
    case 'perro': return ladrarPerro;
    case 'gato': return maullarGato;
    case 'pinguino': return piarPinguino;
    case 'zorro': return aullarZorro;
    case 'rana': return croarRana;
    case 'oso_pardo':
    case 'oso_polar': return gruñirOso;
    case 'panda': return balarPanda;
    case 'conejo': return chillarConejo;
    default: return sonidoGenerico;
  }
});

const textosSonidoPorTipo = {
  perro: ['¡Guau!', '¡Guau guau!'],
  gato: ['¡Miau!', '¡Miau~!'],
  pinguino: ['¡Nrak!', '¡Kwak!'],
  zorro: ['¡Ring-ding-ding!', '¡Yip!'],
  rana: ['¡Croac!'],
  oso_pardo: ['¡Grrr!'],
  oso_polar: ['¡Grrr!'],
  panda: ['¡Mmm!'],
  conejo: ['¡Squeak!']
};

const mostrarBurbuja = ref(false);
const textoBurbuja = ref('');
let temporizadorBurbuja = null;

function vocalizar() {
  if (animo.value === 'dormido') {
    textoBurbuja.value = ['Toc, toc...', '👀', '¿Ya casi?'][Math.floor(Math.random() * 3)];
    mostrarBurbuja.value = true;
    tocarCascaron();
    emit('sonido', { tipo: props.tipo, animo: 'dormido' });
    clearTimeout(temporizadorBurbuja);
    temporizadorBurbuja = setTimeout(() => { mostrarBurbuja.value = false; }, 1400);
    return;
  }

  emit('sonido', { tipo: props.tipo, animo: animo.value });

  const textos = animo.value === 'asustado'
    ? ['😥', '¿Hola...?', '¡Ayuda!']
    : (textosSonidoPorTipo[props.tipo] || ['¡Hola!']);
  textoBurbuja.value = textos[Math.floor(Math.random() * textos.length)];
  mostrarBurbuja.value = true;

  if (animo.value === 'asustado') {
    gemirTriste();
  } else {
    emisorSonido.value();
  }

  clearTimeout(temporizadorBurbuja);
  temporizadorBurbuja = setTimeout(() => { mostrarBurbuja.value = false; }, 1600);
}

/* ---------- CICLOS DE VIDA: arrancan/detienen movimiento y sonido ---------- */
let temporizadorMovimiento = null;
let temporizadorSonido = null;

function programarSonido() {
  clearTimeout(temporizadorSonido);
  const espera = (animo.value === 'dormido' ? 2500 : 4500) + Math.random() * 3500;
  temporizadorSonido = setTimeout(() => {
    vocalizar();
    programarSonido();
  }, espera);
}

function desbloquearAudio() {
  const ctx = obtenerAudioCtx();
  ctx?.resume?.();
}

onMounted(() => {
  window.addEventListener('click', desbloquearAudio, { once: true });
  temporizadorMovimiento = setInterval(moverAleatorio, 3500);
  programarSonido();
});

onUnmounted(() => {
  window.removeEventListener('click', desbloquearAudio);
  clearInterval(temporizadorMovimiento);
  clearTimeout(temporizadorSonido);
  clearTimeout(temporizadorBurbuja);
});

// Si la mascota se asusta de golpe, deja de caminar y suelta un quejido inmediato
watch(animo, (nuevo, anterior) => {
  if (nuevo === 'asustado' && anterior !== 'asustado') {
    posX.value = 0;
    vocalizar();
  }
});
</script>

<template>
  <div class="pet-card-inner" :class="[temaEvolucion, claseAnimo]">
    <div class="ambient-glow"></div>

    <!-- Partículas normales (feliz) -->
    <div class="ambient-particles" v-if="!enRiesgo">
      <template v-if="tipo === 'perro'">
        <span class="particle bone">🦴</span>
        <span class="particle star delay-1">✨</span>
        <span class="particle paw delay-2">🐾</span>
      </template>
      <template v-else-if="tipo === 'gato'">
        <span class="particle fish">🐟</span>
        <span class="particle star delay-1">✨</span>
        <span class="particle paw delay-2">🐾</span>
      </template>
      <template v-else-if="tipo === 'pinguino'">
        <span class="particle ice">🧊</span>
        <span class="particle ice delay-1">❄️</span>
        <span class="particle ice delay-2">✨</span>
      </template>
      <template v-else-if="tipo === 'zorro'">
        <span class="particle flower">🌸</span>
        <span class="particle flower delay-1">🌼</span>
        <span class="particle leaf delay-2">🍃</span>
      </template>
      <template v-else-if="tipo === 'oso_pardo' || tipo === 'oso_polar'">
        <span class="particle snow">❄️</span>
        <span class="particle snow delay-1">❄️</span>
        <span class="particle leaf delay-2">🍂</span>
      </template>
      <template v-else-if="tipo === 'panda'">
        <span class="particle bamboo">🎋</span>
        <span class="particle leaf delay-1">🍃</span>
        <span class="particle bamboo delay-2">🎋</span>
      </template>
      <template v-else-if="tipo === 'rana'">
        <span class="particle bubble">💧</span>
        <span class="particle leaf delay-1">🍃</span>
        <span class="particle bubble delay-2">💧</span>
      </template>
      <template v-else-if="tipo === 'conejo'">
        <span class="particle flower">🌸</span>
        <span class="particle star delay-1">✨</span>
        <span class="particle leaf delay-2">🍃</span>
      </template>
      <template v-else>
        <span class="particle star">✨</span>
        <span class="particle star delay-1">⭐</span>
      </template>
    </div>

    <!-- Partículas de alerta (asustado / racha en riesgo) -->
    <div class="ambient-particles" v-else>
      <span class="particle drop">💧</span>
      <span class="particle drop delay-1">💧</span>
      <span class="particle warn delay-2">❗</span>
    </div>

    <div class="pet-stage">
      <div
        v-if="mostrarBurbuja"
        class="speech-bubble"
        :style="{ transform: `translateX(${posX}px)` }"
      >{{ textoBurbuja }}</div>

      <div
        class="pet-visual"
        :style="{ transform: `translateX(${posX}px) scaleX(${mirandoIzquierda ? -1 : 1})` }"
      >
      <svg viewBox="0 0 200 200" class="pet-svg" :class="[etapaMascota, claseAnimo]">
        <defs>
          <radialGradient id="eggGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="30%" stop-color="#fdfbf7" />
            <stop offset="70%" stop-color="#e2d8c5" />
            <stop offset="100%" stop-color="#b5a48b" />
          </radialGradient>
          <radialGradient id="goldAura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#fde68a" stop-opacity="0.9" />
            <stop offset="100%" stop-color="#fde68a" stop-opacity="0" />
          </radialGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="4" flood-color="#000" flood-opacity="0.4" />
          </filter>
        </defs>

        <ellipse cx="100" cy="172" rx="42" ry="10" fill="rgba(0,0,0,0.35)" filter="blur(3px)" />

        <!-- AURA DORADA (etapa legendaria) -->
        <circle v-if="etapaMascota === 'legendario'" cx="100" cy="100" r="85" fill="url(#goldAura)" class="animate-auraPulse" />

        <!-- ESTADO: HUEVO -->
        <g v-if="etapaMascota === 'huevo'" class="body-group animate-huevo">
          <ellipse cx="100" cy="115" rx="44" ry="54" fill="url(#eggGrad)" stroke="#c4b59d" stroke-width="2" filter="url(#softShadow)" />
          <ellipse cx="82" cy="90" rx="12" ry="8" fill="rgba(255,255,255,0.45)" />
          <path d="M 85 110 Q 100 120 115 110" stroke="#b5a48b" stroke-width="2" fill="none" stroke-linecap="round" />
          <text x="105" y="55" font-size="18" class="animate-zzz">💤</text>
        </g>

        <!-- MASCOTAS -->
        <g v-else class="body-group" :class="claseAnimacionCuerpo" :transform="`translate(100, 115) scale(${escalaMascota}) translate(-100, -115)`" filter="url(#softShadow)">

          <!-- CORONA (etapa legendaria) -->
          <g v-if="etapaMascota === 'legendario'">
            <polygon points="82,58 88,38 100,52 112,38 118,58" fill="#facc15" stroke="#b45309" stroke-width="2" stroke-linejoin="round" />
            <circle cx="88" cy="38" r="3" fill="#fef08a" />
            <circle cx="100" cy="32" r="3.5" fill="#fef08a" />
            <circle cx="112" cy="38" r="3" fill="#fef08a" />
          </g>

          <!-- PINGÜINO SUPREMO KAWAII -->
          <template v-if="tipo === 'pinguino'">
            <ellipse cx="100" cy="132" rx="27" ry="31" fill="#1e293b" />
            <ellipse cx="100" cy="135" rx="18" ry="24" fill="#f8fafc" />
            <path d="M 74 120 Q 68 138 75 148" stroke="#1e293b" stroke-width="6" stroke-linecap="round" fill="none" class="animate-aleteo-izq" />
            <path d="M 126 120 Q 132 138 125 148" stroke="#1e293b" stroke-width="6" stroke-linecap="round" fill="none" class="animate-aleteo-der" />
            <circle cx="100" cy="94" r="26" fill="#1e293b" />
            <ellipse cx="90" cy="86" rx="7" ry="4" fill="rgba(255,255,255,0.25)" />
            <path d="M 76 90 Q 100 110 124 90 Z" fill="#f8fafc" />
            <path d="M 74 106 Q 100 116 126 106 Q 130 112 122 116 Q 100 124 78 116 Z" fill="#ef4444" />
            <path d="M 110 112 Q 118 140 112 158 Q 106 158 106 140 Z" fill="#ef4444" />
            <g class="ojos-parpadeo">
              <circle cx="89" cy="92" r="5" fill="#0f172a" />
              <circle cx="111" cy="92" r="5" fill="#0f172a" />
              <circle cx="91" cy="90" r="2" fill="#fff" />
              <circle cx="113" cy="90" r="2" fill="#fff" />
            </g>
            <ellipse cx="82" cy="98" rx="4" ry="2.5" fill="#f472b6" opacity="0.7" />
            <ellipse cx="118" cy="98" rx="4" ry="2.5" fill="#f472b6" opacity="0.7" />
            <polygon points="100,95 94,100 106,100" fill="#f97316" />
            <path d="M 76 82 Q 100 45 130 65 Q 110 82 76 82 Z" fill="#ef4444" />
            <circle cx="132" cy="62" r="6" fill="#f8fafc" />
            <ellipse cx="87" cy="164" rx="7" ry="4" fill="#f97316" />
            <ellipse cx="113" cy="164" rx="7" ry="4" fill="#f97316" />
            <template v-if="enRiesgo">
              <path d="M 81 82 Q 89 76 95 82" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
              <path d="M 119 82 Q 111 76 105 82" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
              <text x="118" y="72" font-size="13">💧</text>
            </template>
          </template>

          <!-- ZORRO NUEVA CARITA KAWAII -->
          <template v-else-if="tipo === 'zorro'">
            <path
              d="M 116 134 Q 146 138 152 112 Q 158 88 138 100"
              fill="#ea580c" stroke="#7c2d12" stroke-width="2"
              :class="{ 'animate-cola-zorro': !enRiesgo }"
              :transform="enRiesgo ? 'rotate(18 120 130)' : ''"
            />
            <ellipse cx="145" cy="102" rx="6" ry="8" fill="#f8fafc" transform="rotate(25 145 102)" />

            <ellipse cx="100" cy="132" rx="24" ry="20" fill="#ea580c" stroke="#7c2d12" stroke-width="2" />
            <path d="M 88 124 Q 100 134 112 124 Q 116 142 100 144 Q 84 142 88 124 Z" fill="#ffedd5" />

            <g :class="{ 'animate-oreja': !enRiesgo }">
              <polygon points="76,80 66,42 94,66" fill="#ea580c" stroke="#7c2d12" stroke-width="2" stroke-linejoin="round" :transform="enRiesgo ? 'rotate(-10 76 66)' : ''" />
              <polygon points="78,76 72,50 88,66" fill="#fbcfe8" :transform="enRiesgo ? 'rotate(-10 76 66)' : ''" />
            </g>
            <polygon points="124,80 134,42 106,66" fill="#ea580c" stroke="#7c2d12" stroke-width="2" stroke-linejoin="round" :transform="enRiesgo ? 'rotate(10 124 66)' : ''" />
            <polygon points="122,76 128,50 112,66" fill="#fbcfe8" :transform="enRiesgo ? 'rotate(10 124 66)' : ''" />

            <circle cx="100" cy="98" r="30" fill="#ea580c" stroke="#7c2d12" stroke-width="2" />
            <ellipse cx="90" cy="90" rx="7" ry="4" fill="rgba(255,255,255,0.2)" />
            <ellipse cx="100" cy="104" rx="15" ry="12" fill="#fff" stroke="#7c2d12" stroke-width="1.5" />

            <g class="ojos-parpadeo">
              <circle cx="87" cy="93" r="5" fill="#0f172a" />
              <circle cx="113" cy="93" r="5" fill="#0f172a" />
              <circle cx="85.5" cy="91.5" r="2" fill="#fff" />
              <circle cx="111.5" cy="91.5" r="2" fill="#fff" />
              <circle cx="88.5" cy="95" r="0.8" fill="#fff" />
              <circle cx="114.5" cy="95" r="0.8" fill="#fff" />
            </g>

            <ellipse cx="76" cy="101" rx="5" ry="3" fill="#f472b6" opacity="0.75" />
            <ellipse cx="124" cy="101" rx="5" ry="3" fill="#f472b6" opacity="0.75" />

            <polygon points="100,101 96,96 104,96" fill="#0f172a" />
            <path v-if="!enRiesgo" d="M 94 106 Q 100 111 106 106" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
            <template v-else>
              <path d="M 81 84 Q 89 79 95 83" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
              <path d="M 119 84 Q 111 79 105 83" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
              <ellipse cx="100" cy="107" rx="3" ry="4" fill="#0f172a" />
              <text x="122" y="74" font-size="13">💧</text>
            </template>
          </template>

          <!-- PERRITO KAWAII -->
          <template v-else-if="tipo === 'perro'">
            <ellipse cx="100" cy="138" rx="26" ry="20" fill="#fff" stroke="#451a03" stroke-width="2.5" />
            <path d="M 108 128 Q 126 128 124 148 Q 110 148 108 138 Z" fill="#78350f" />
            <path d="M 124 130 Q 142 115 138 128" stroke="#451a03" stroke-width="4" stroke-linecap="round" fill="none" :class="{ 'animate-wag': !enRiesgo }" />
            <ellipse cx="88" cy="154" rx="6" ry="12" fill="#fff" stroke="#451a03" stroke-width="2.5" />
            <ellipse cx="112" cy="154" rx="6" ry="12" fill="#fff" stroke="#451a03" stroke-width="2.5" />
            <path d="M 76 90 Q 50 110 60 135 Q 75 135 80 115 Z" fill="#78350f" stroke="#451a03" stroke-width="2.5" :transform="enRiesgo ? 'rotate(-8 70 100)' : ''" />
            <path d="M 124 90 Q 150 110 140 135 Q 125 135 120 115 Z" fill="#78350f" stroke="#451a03" stroke-width="2.5" :transform="enRiesgo ? 'rotate(8 130 100)' : ''" />
            <circle cx="100" cy="98" r="34" fill="#fff" stroke="#451a03" stroke-width="2.5" />
            <ellipse cx="88" cy="88" rx="8" ry="5" fill="rgba(120,53,15,0.15)" />
            <g class="ojos-parpadeo">
              <ellipse cx="87" cy="94" rx="9" ry="11" fill="#451a03" />
              <ellipse cx="113" cy="94" rx="9" ry="11" fill="#451a03" />
              <circle cx="84" cy="91" r="3.5" fill="#fff" />
              <circle cx="110" cy="91" r="3.5" fill="#fff" />
            </g>
            <ellipse cx="76" cy="104" rx="6" ry="3.5" fill="#f472b6" opacity="0.6" />
            <ellipse cx="124" cy="104" rx="6" ry="3.5" fill="#f472b6" opacity="0.6" />
            <ellipse cx="100" cy="106" rx="12" ry="9" fill="#fff" stroke="#451a03" stroke-width="1.5" />
            <ellipse cx="100" cy="101" rx="4.5" ry="3.5" fill="#451a03" />
            <path v-if="!enRiesgo" d="M 94 110 Q 100 114 106 110" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
            <template v-else>
              <path d="M 79 84 Q 87 79 93 84" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
              <path d="M 121 84 Q 113 79 107 84" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
              <ellipse cx="100" cy="111" rx="3" ry="4" fill="#451a03" />
              <text x="122" y="74" font-size="13">💧</text>
            </template>
          </template>

          <!-- GATO KAWAII -->
          <template v-else-if="tipo === 'gato'">
            <ellipse cx="100" cy="138" rx="26" ry="20" fill="#fff" stroke="#581c87" stroke-width="2.5" />
            <circle cx="112" cy="134" r="6" fill="#d8b4fe" />
            <path d="M 124 135 Q 145 120 138 100" stroke="#581c87" stroke-width="4" stroke-linecap="round" fill="none" :class="{ 'animate-wag': !enRiesgo }" />
            <ellipse cx="88" cy="154" rx="6" ry="12" fill="#fff" stroke="#581c87" stroke-width="2.5" />
            <ellipse cx="112" cy="154" rx="6" ry="12" fill="#fff" stroke="#581c87" stroke-width="2.5" />
            <polygon points="72,78 60,42 90,64" fill="#c084fc" stroke="#581c87" stroke-width="2.5" stroke-linejoin="round" :transform="enRiesgo ? 'rotate(-8 72 64)' : ''" />
            <polygon points="128,78 140,42 110,64" fill="#c084fc" stroke="#581c87" stroke-width="2.5" stroke-linejoin="round" :transform="enRiesgo ? 'rotate(8 128 64)' : ''" />
            <circle cx="100" cy="98" r="34" fill="#fff" stroke="#581c87" stroke-width="2.5" />
            <ellipse cx="88" cy="88" rx="8" ry="5" fill="rgba(88,28,135,0.1)" />
            <g class="ojos-parpadeo">
              <ellipse cx="87" cy="94" rx="9" ry="11" fill="#581c87" />
              <ellipse cx="113" cy="94" rx="9" ry="11" fill="#581c87" />
              <circle cx="84" cy="91" r="3.5" fill="#fff" />
              <circle cx="110" cy="91" r="3.5" fill="#fff" />
            </g>
            <polygon points="100,103 96,99 104,99" fill="#f472b6" />
            <path v-if="!enRiesgo" d="M 94 105 Q 97 109 100 105 Q 103 109 106 105" stroke="#581c87" stroke-width="2" fill="none" stroke-linecap="round" />
            <template v-else>
              <path d="M 79 84 Q 87 79 93 84" stroke="#581c87" stroke-width="2" fill="none" stroke-linecap="round" />
              <path d="M 121 84 Q 113 79 107 84" stroke="#581c87" stroke-width="2" fill="none" stroke-linecap="round" />
              <ellipse cx="100" cy="106" rx="3" ry="4" fill="#581c87" />
              <text x="122" y="74" font-size="13">💧</text>
            </template>
          </template>

          <!-- RANA KAWAII -->
          <template v-else-if="tipo === 'rana'">
            <ellipse cx="75" cy="152" rx="14" ry="8" fill="#16a34a" stroke="#14532d" stroke-width="2" />
            <ellipse cx="125" cy="152" rx="14" ry="8" fill="#16a34a" stroke="#14532d" stroke-width="2" />
            <ellipse cx="100" cy="138" rx="28" ry="22" fill="#22c55e" stroke="#14532d" stroke-width="2" />
            <ellipse cx="100" cy="142" rx="16" ry="12" fill="#86efac" class="animate-garganta" />
            <circle cx="84" cy="142" r="5" fill="#16a34a" stroke="#14532d" stroke-width="1.5" />
            <circle cx="116" cy="142" r="5" fill="#16a34a" stroke="#14532d" stroke-width="1.5" />
            <ellipse cx="100" cy="98" rx="36" ry="28" fill="#22c55e" stroke="#14532d" stroke-width="2" />
            <ellipse cx="88" cy="86" rx="10" ry="5" fill="rgba(255,255,255,0.2)" />
            <g class="ojos-parpadeo">
              <ellipse cx="80" cy="88" rx="11" ry="13" fill="#0f172a" />
              <circle cx="77" cy="84" r="4" fill="#fff" />
              <ellipse cx="120" cy="88" rx="11" ry="13" fill="#0f172a" />
              <circle cx="117" cy="84" r="4" fill="#fff" />
            </g>
            <ellipse cx="69" cy="98" rx="6" ry="3.5" fill="#f472b6" opacity="0.7" />
            <ellipse cx="131" cy="98" rx="6" ry="3.5" fill="#f472b6" opacity="0.7" />
            <path v-if="!enRiesgo" d="M 92 104 Q 100 112 108 104" stroke="#14532d" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <template v-else>
              <path d="M 68 74 Q 76 68 84 74" stroke="#14532d" stroke-width="2.5" fill="none" stroke-linecap="round" />
              <path d="M 116 74 Q 124 68 132 74" stroke="#14532d" stroke-width="2.5" fill="none" stroke-linecap="round" />
              <ellipse cx="100" cy="106" rx="3.5" ry="4.5" fill="#14532d" />
              <text x="130" y="68" font-size="13">💧</text>
            </template>
          </template>

          <!-- OSO PARDO -->
          <template v-else-if="tipo === 'oso_pardo'">
            <circle cx="74" cy="72" r="12" fill="#78350f" stroke="#451a03" stroke-width="2" />
            <circle cx="126" cy="72" r="12" fill="#78350f" stroke="#451a03" stroke-width="2" />
            <ellipse cx="100" cy="135" rx="30" ry="24" fill="#92400e" stroke="#451a03" stroke-width="2" />
            <circle cx="100" cy="98" r="34" fill="#92400e" stroke="#451a03" stroke-width="2" />
            <ellipse cx="88" cy="88" rx="8" ry="5" fill="rgba(255,255,255,0.15)" />
            <ellipse cx="100" cy="106" rx="16" ry="12" fill="#fde68a" />
            <circle cx="100" cy="101" r="5.5" fill="#451a03" />
            <g class="ojos-parpadeo">
              <circle cx="87" cy="92" r="4" fill="#451a03" />
              <circle cx="113" cy="92" r="4" fill="#451a03" />
            </g>
            <path v-if="!enRiesgo" d="M 94 113 Q 100 118 106 113" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
            <template v-else>
              <path d="M 79 82 Q 87 77 93 82" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
              <path d="M 121 82 Q 113 77 107 82" stroke="#451a03" stroke-width="2" fill="none" stroke-linecap="round" />
              <ellipse cx="100" cy="114" rx="3" ry="4" fill="#451a03" />
              <text x="122" y="70" font-size="13">💧</text>
            </template>
          </template>

          <!-- OSO POLAR -->
          <template v-else-if="tipo === 'oso_polar'">
            <circle cx="74" cy="72" r="12" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
            <circle cx="126" cy="72" r="12" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
            <ellipse cx="100" cy="135" rx="30" ry="24" fill="#f1f5f9" stroke="#334155" stroke-width="2" />
            <circle cx="100" cy="98" r="34" fill="#f1f5f9" stroke="#334155" stroke-width="2" />
            <ellipse cx="88" cy="88" rx="8" ry="5" fill="rgba(148,163,184,0.25)" />
            <ellipse cx="100" cy="106" rx="16" ry="12" fill="#e2e8f0" />
            <circle cx="100" cy="101" r="5.5" fill="#0f172a" />
            <g class="ojos-parpadeo">
              <circle cx="87" cy="92" r="4" fill="#0f172a" />
              <circle cx="113" cy="92" r="4" fill="#0f172a" />
            </g>
            <path v-if="!enRiesgo" d="M 94 113 Q 100 118 106 113" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
            <template v-else>
              <path d="M 79 82 Q 87 77 93 82" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
              <path d="M 121 82 Q 113 77 107 82" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
              <ellipse cx="100" cy="114" rx="3" ry="4" fill="#0f172a" />
              <text x="122" y="70" font-size="13">💧</text>
            </template>
          </template>

          <!-- PANDA -->
          <template v-else-if="tipo === 'panda'">
            <circle cx="72" cy="74" r="13" fill="#1e293b" />
            <circle cx="128" cy="74" r="13" fill="#1e293b" />
            <ellipse cx="100" cy="135" rx="30" ry="24" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />
            <circle cx="100" cy="98" r="34" fill="#f8fafc" stroke="#1e293b" stroke-width="2" />
            <ellipse cx="88" cy="88" rx="8" ry="5" fill="rgba(0,0,0,0.05)" />
            <g class="ojos-parpadeo">
              <ellipse cx="86" cy="96" rx="10" ry="12" fill="#1e293b" transform="rotate(-15 86 96)" />
              <ellipse cx="114" cy="96" rx="10" ry="12" fill="#1e293b" transform="rotate(15 114 96)" />
              <circle cx="85" cy="95" r="3.5" fill="#fff" />
              <circle cx="115" cy="95" r="3.5" fill="#fff" />
            </g>
            <ellipse cx="100" cy="104" rx="6" ry="4" fill="#1e293b" />
            <path v-if="!enRiesgo" d="M 96 112 Q 100 116 104 112" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round" />
            <template v-else>
              <ellipse cx="100" cy="113" rx="3" ry="4" fill="#1e293b" />
              <text x="122" y="70" font-size="13">💧</text>
            </template>
          </template>

          <!-- CONEJO -->
          <template v-else-if="tipo === 'conejo'">
            <ellipse cx="84" cy="60" rx="8" ry="25" fill="#cbd5e1" stroke="#334155" stroke-width="2" :class="{ 'animate-oreja': !enRiesgo }" :transform="enRiesgo ? 'rotate(-25 84 85)' : ''" />
            <ellipse cx="116" cy="60" rx="8" ry="25" fill="#cbd5e1" stroke="#334155" stroke-width="2" :class="{ 'animate-oreja-der': !enRiesgo }" :transform="enRiesgo ? 'rotate(25 116 85)' : ''" />
            <ellipse cx="100" cy="135" rx="26" ry="22" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
            <circle cx="100" cy="100" r="32" fill="#e2e8f0" stroke="#334155" stroke-width="2" />
            <ellipse cx="88" cy="90" rx="8" ry="5" fill="rgba(255,255,255,0.4)" />
            <g class="ojos-parpadeo">
              <circle cx="87" cy="94" r="4" fill="#0f172a" />
              <circle cx="113" cy="94" r="4" fill="#0f172a" />
            </g>
            <ellipse cx="100" cy="102" rx="5" ry="3.5" fill="#f472b6" />
            <path v-if="!enRiesgo" d="M 96 110 Q 100 114 104 110" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
            <template v-else>
              <path d="M 81 84 Q 89 79 95 84" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
              <path d="M 119 84 Q 111 79 105 84" stroke="#0f172a" stroke-width="2" fill="none" stroke-linecap="round" />
              <ellipse cx="100" cy="111" rx="3" ry="4" fill="#0f172a" />
              <text x="122" y="74" font-size="13">💧</text>
            </template>
          </template>

          <!-- GENÉRICO -->
          <template v-else>
            <circle cx="100" cy="130" r="26" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
            <circle cx="85" cy="90" r="11" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
            <circle cx="115" cy="90" r="11" fill="#3b82f6" stroke="#1d4ed8" stroke-width="2" />
            <path v-if="!enRiesgo" d="M 88 112 Q 100 122 112 112" stroke="#1d4ed8" stroke-width="2.5" fill="none" stroke-linecap="round" />
            <template v-else>
              <ellipse cx="100" cy="115" rx="4" ry="5" fill="#1d4ed8" />
              <text x="122" y="74" font-size="13">💧</text>
            </template>
          </template>

        </g>
      </svg>
      </div>
    </div>

    <div class="pet-info-footer">
      <span class="pet-stage-tag" :class="{ 'tag-alert': enRiesgo }">{{ etiquetaEstado }}</span>
      <h3 class="pet-name">{{ nombre }}</h3>
      <p v-if="enRiesgo" class="pet-alert-text">¡Cumple hoy o tu racha de {{ racha }} se pierde!</p>
    </div>
  </div>
</template>

<style scoped>
.pet-card-inner {
  width: 100%;
  height: 100%;
  min-height: 250px;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  transition: background 0.5s ease, border-color 0.5s ease;
  box-sizing: border-box;
}

.theme-huevo { background: linear-gradient(135deg, rgba(148, 163, 184, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(148, 163, 184, 0.3); }
.theme-bebe { background: linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(234, 179, 8, 0.4); }
.theme-adolescente { background: linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(249, 115, 22, 0.4); }
.theme-adulto { background: linear-gradient(135deg, rgba(236, 72, 153, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(236, 72, 153, 0.4); }
.theme-senior { background: linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(168, 85, 247, 0.4); }
.theme-musculoso { background: linear-gradient(135deg, rgba(59, 130, 246, 0.35) 0%, rgba(15, 23, 42, 0.9) 100%); border: 1px solid rgba(59, 130, 246, 0.5); }
.theme-legendario { background: linear-gradient(135deg, rgba(250, 204, 21, 0.4) 0%, rgba(88, 28, 135, 0.85) 100%); border: 1px solid rgba(250, 204, 21, 0.6); }

/* Estado de alerta: overlay rojizo pulsante sobre el tema actual */
.mood-asustado {
  border-color: rgba(239, 68, 68, 0.6) !important;
  animation: alertPulse 1.8s ease-in-out infinite;
}
.mood-asustado::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 30%, rgba(239, 68, 68, 0.25), transparent 70%);
  pointer-events: none;
  z-index: 1;
}

@keyframes alertPulse {
  0%, 100% { box-shadow: inset 0 0 0 rgba(239, 68, 68, 0); }
  50% { box-shadow: inset 0 0 24px rgba(239, 68, 68, 0.35); }
}

.ambient-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.particle {
  position: absolute;
  font-size: 14px;
  animation: floatParticle 4s ease-in-out infinite;
  opacity: 0.7;
}

.particle.bone, .particle.fish, .particle.flower { top: 20%; left: 15%; animation-duration: 3.5s; }
.particle.ice { top: 25%; right: 18%; animation-duration: 4s; }
.particle.snow { top: 15%; left: 75%; animation-duration: 4.5s; }
.particle.bamboo { top: 30%; left: 12%; animation-duration: 5s; }
.particle.bubble { top: 22%; right: 20%; animation-duration: 3s; }
.particle.leaf { top: 70%; left: 15%; animation-duration: 4.2s; }
.particle.paw { top: 75%; right: 15%; animation-duration: 3.8s; }
.particle.star { top: 20%; right: 25%; animation-duration: 3.2s; }
.particle.drop { top: 18%; left: 20%; animation-duration: 2.6s; color: #60a5fa; }
.particle.warn { top: 22%; right: 20%; animation-duration: 2.2s; }

.particle.delay-1 { animation-delay: 1.2s; left: 80%; top: 60%; }
.particle.delay-2 { animation-delay: 2.4s; left: 45%; top: 15%; }

@keyframes floatParticle {
  0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.4; }
  50% { transform: translateY(-12px) rotate(15deg); opacity: 0.9; }
}

.pet-stage {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  z-index: 2;
  overflow: hidden;
}

.pet-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 1.8s cubic-bezier(0.65, 0.05, 0.36, 1);
}

.pet-svg {
  width: 140px;
  height: 140px;
  transition: transform 0.5s ease, filter 0.5s ease;
}

.speech-bubble {
  position: absolute;
  top: 4%;
  left: 50%;
  translate: -50% 0;
  background: #fff;
  color: #1e1e1e;
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 12px;
  z-index: 3;
  transition: transform 1.8s cubic-bezier(0.65, 0.05, 0.36, 1), opacity 0.25s ease;
  animation: burbujaAparece 0.25s ease-out;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.speech-bubble::after {
  content: '';
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 6px 6px 0 6px;
  border-style: solid;
  border-color: #fff transparent transparent transparent;
}

@keyframes burbujaAparece {
  from { opacity: 0; transform: translateY(6px) scale(0.85); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.pet-svg.mood-asustado {
  filter: grayscale(0.45) brightness(0.92) saturate(0.8);
}

@keyframes floatAnim {
  0%, 100% { transform: translateY(0) scaleY(1); }
  50% { transform: translateY(-6px) scaleY(1.02); }
}

@keyframes tremble {
  0%, 100% { transform: translate(0, 3px) rotate(0deg); }
  25% { transform: translate(-2px, 4px) rotate(-2deg); }
  75% { transform: translate(2px, 4px) rotate(2deg); }
}

@keyframes wag {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(8deg); }
}

@keyframes pulseGlow {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.08); opacity: 1; }
}

@keyframes auraPulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.06); }
}

@keyframes waddle {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-4px) rotate(4deg); }
}

@keyframes sway {
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-3px) rotate(2deg); }
}

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

@keyframes parpadeo {
  0%, 88%, 100% { transform: scaleY(1); }
  91%, 95% { transform: scaleY(0.1); }
}

@keyframes colaZorro {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-10deg); }
}

@keyframes orejaInquieta {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
}

@keyframes orejaInquietaDer {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-5deg); }
}

@keyframes aleteo {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(-12deg); }
}

@keyframes aleteoDer {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(12deg); }
}

@keyframes respirarGarganta {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12, 0.9); }
}

.animate-float { animation: floatAnim 3s ease-in-out infinite; }
.animate-tremble { animation: tremble 0.35s ease-in-out infinite; transform-origin: 100px 130px; }
.animate-zzz { animation: floatAnim 2s ease-in-out infinite; }
.animate-wag { animation: wag 0.6s ease-in-out infinite; transform-origin: 124px 128px; }
.animate-auraPulse { animation: auraPulse 2.4s ease-in-out infinite; }
.animate-waddle { animation: waddle 1.1s ease-in-out infinite; transform-origin: 100px 165px; }
.animate-sway { animation: sway 2.6s ease-in-out infinite; transform-origin: 100px 165px; }
.animate-huevo { animation: huevoVida 6s ease-in-out infinite; transform-origin: 100px 165px; }

.ojos-parpadeo {
  transform-box: fill-box;
  transform-origin: center;
  animation: parpadeo 4.5s ease-in-out infinite;
}

.animate-cola-zorro {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: colaZorro 1.4s ease-in-out infinite;
}

.animate-oreja {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: orejaInquieta 2.4s ease-in-out infinite;
}

.animate-oreja-der {
  transform-box: fill-box;
  transform-origin: bottom center;
  animation: orejaInquietaDer 2.6s ease-in-out infinite;
}

.animate-aleteo-izq {
  transform-box: fill-box;
  transform-origin: top center;
  animation: aleteo 1.6s ease-in-out infinite;
}

.animate-aleteo-der {
  transform-box: fill-box;
  transform-origin: top center;
  animation: aleteoDer 1.6s ease-in-out infinite;
}

.animate-garganta {
  transform-box: fill-box;
  transform-origin: center;
  animation: respirarGarganta 1.3s ease-in-out infinite;
}

.musculoso, .legendario {
  filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.5));
}
.legendario {
  filter: drop-shadow(0 0 14px rgba(250, 204, 21, 0.6));
}

.pet-info-footer {
  text-align: center;
  z-index: 2;
}

.pet-stage-tag {
  font-family: 'Oswald', sans-serif;
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  padding: 3px 8px;
  background: rgba(0, 0, 0, 0.4);
  color: #facc15;
  border-radius: 6px;
  letter-spacing: 0.5px;
}

.pet-stage-tag.tag-alert {
  color: #fecaca;
  background: rgba(127, 29, 29, 0.55);
}

.pet-name {
  font-family: 'Anton', sans-serif;
  font-size: 1.1rem;
  margin: 6px 0 0;
  color: #f5f5f4;
  letter-spacing: 0.5px;
}

.pet-alert-text {
  margin: 4px 0 0;
  font-size: 11px;
  color: #fca5a5;
  font-weight: 600;
}
</style>

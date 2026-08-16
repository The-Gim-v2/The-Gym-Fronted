<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import FitnessPet from '@/components/FitnessPet.vue';

const props = defineProps({
  // racha total en días (histórico completo del usuario)
  diasTotales: { type: Number, default: 0 },
  activoHoy: { type: Boolean, default: true },
  sonidoActivado: { type: Boolean, default: true },
});

/* ---------------- IDIOMA (es/en) ---------------- */
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');
const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) currentLang.value = e.detail.idioma;
};
onMounted(() => window.addEventListener('idioma-changed', handleLangChange));
onUnmounted(() => window.removeEventListener('idioma-changed', handleLangChange));

const traducciones = {
  es: {
    coleccionTitulo: 'Compañeros conseguidos',
    activa: 'Activa',
    generacion: 'Gen.',
    legendario: 'Legendario',
    nivel: 'Nivel',
    generacionLarga: 'Generación',
    faltan1: 'Te faltan',
    faltan2: 'días de racha para desbloquear tu próximo compañero.',
  },
  en: {
    coleccionTitulo: 'Companions unlocked',
    activa: 'Active',
    generacion: 'Gen.',
    legendario: 'Legendary',
    nivel: 'Level',
    generacionLarga: 'Generation',
    faltan1: 'You need',
    faltan2: 'more streak days to unlock your next companion.',
  },
};
const t = computed(() => traducciones[currentLang.value] || traducciones.es);

const NOMBRES = {
  es: {
    perro: 'Tu compañero perro fitness',
    gato: 'Tu compañero gato fitness',
    zorro: 'Tu compañero zorro fitness',
    pinguino: 'Tu compañero pingüino fitness',
    panda: 'Tu compañero panda fitness',
    conejo: 'Tu compañero conejo fitness',
    rana: 'Tu compañera rana fitness',
    oso_pardo: 'Tu compañero oso fitness',
    oso_polar: 'Tu compañero oso polar fitness',
  },
  en: {
    perro: 'Your fitness dog companion',
    gato: 'Your fitness cat companion',
    zorro: 'Your fitness fox companion',
    pinguino: 'Your fitness penguin companion',
    panda: 'Your fitness panda companion',
    conejo: 'Your fitness rabbit companion',
    rana: 'Your fitness frog companion',
    oso_pardo: 'Your fitness bear companion',
    oso_polar: 'Your fitness polar bear companion',
  },
};

/* ---------------- SISTEMA DE GENERACIONES ---------------- */
const CICLO_DIAS = 400;
const ESPECIES = ['perro', 'gato', 'zorro', 'pinguino', 'panda', 'conejo', 'rana', 'oso_pardo', 'oso_polar'];

function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function especieAlAzar(generacion) {
  const rand = mulberry32(generacion * 9301 + 49297);
  return ESPECIES[Math.floor(rand() * ESPECIES.length)];
}

const generacionesCompletas = computed(() => Math.floor(props.diasTotales / CICLO_DIAS));
const diasGeneracionActual = computed(() => props.diasTotales % CICLO_DIAS);

const especieActual = computed(() => especieAlAzar(generacionesCompletas.value));
const nombreActual = computed(() => (NOMBRES[currentLang.value] || NOMBRES.es)[especieActual.value]);
const nivelActual = computed(() => `${t.value.nivel} ${generacionesCompletas.value + 1} · ${t.value.generacionLarga} ${generacionesCompletas.value + 1}`);

const companeros = computed(() => {
  const lista = [];
  for (let i = 0; i < generacionesCompletas.value; i++) {
    const tipo = especieAlAzar(i);
    lista.push({
      tipo,
      nombre: (NOMBRES[currentLang.value] || NOMBRES.es)[tipo],
      gen: i + 1,
    });
  }
  return lista;
});

const faltanParaSiguiente = computed(() => CICLO_DIAS - diasGeneracionActual.value);

/* ---------------- SELECCIÓN DE MASCOTA A MOSTRAR ---------------- */
const listaCompleta = computed(() => [
  ...companeros.value.map(c => ({
    key: `gen-${c.gen}`,
    tipo: c.tipo,
    nombre: c.nombre,
    nivel: `${t.value.legendario} · ${t.value.generacion} ${c.gen}`,
    racha: 399,
    esActual: false,
    gen: c.gen,
  })),
  {
    key: 'actual',
    tipo: especieActual.value,
    nombre: nombreActual.value,
    nivel: nivelActual.value,
    racha: diasGeneracionActual.value,
    esActual: true,
    gen: generacionesCompletas.value + 1,
  },
]);

const seleccionadaKey = ref('actual');
const mascotaMostrada = computed(() =>
  listaCompleta.value.find(m => m.key === seleccionadaKey.value) || listaCompleta.value[listaCompleta.value.length - 1]
);

function seleccionar(key) {
  seleccionadaKey.value = key;
}
</script>

<template>
  <div class="coleccion-wrap">
    <div class="mascota-activa">
      <FitnessPet
        :key="mascotaMostrada.key"
        :nombre="mascotaMostrada.nombre"
        :nivel="mascotaMostrada.nivel"
        :racha="mascotaMostrada.racha"
        :tipo="mascotaMostrada.tipo"
        :activo-hoy="mascotaMostrada.esActual ? activoHoy : true"
        :sonido-activado="mascotaMostrada.esActual ? sonidoActivado : false"
      />
    </div>

    <div class="coleccion-footer">
      <div class="coleccion-header-row">
        <span class="coleccion-titulo">{{ t.coleccionTitulo }}</span>
        <span class="coleccion-contador">{{ listaCompleta.length }} 🏆</span>
      </div>

      <div class="coleccion-scroll-container">
        <div class="coleccion-grid">
          <button
            v-for="m in listaCompleta" :key="m.key"
            type="button"
            class="mini-mascota-box"
            :class="{ activa: seleccionadaKey === m.key }"
            @click="seleccionar(m.key)"
          >
            <div class="mini-mascota-inner">
              <FitnessPet
                :nombre="m.nombre"
                :nivel="m.nivel"
                :racha="m.racha"
                :tipo="m.tipo"
                :activo-hoy="true"
                :sonido-activado="false"
              />
            </div>
            <span class="mini-mascota-tag" :class="{ 'tag-actual': m.esActual }">
              {{ m.esActual ? t.activa : `${t.generacion} ${m.gen}` }}
            </span>
          </button>
        </div>
      </div>

      <p v-if="faltanParaSiguiente < CICLO_DIAS" class="siguiente-meta">
        {{ t.faltan1 }} <strong>{{ faltanParaSiguiente }}</strong> {{ t.faltan2 }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.coleccion-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.mascota-activa {
  width: 100%;
}

.coleccion-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 14px;
}

.coleccion-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.coleccion-titulo {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(245, 245, 244, 0.65);
}

.coleccion-contador {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 800;
  color: #facc15;
}

/* Contenedor de scroll horizontal optimizado */
.coleccion-scroll-container {
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding-bottom: 6px;
}
.coleccion-scroll-container::-webkit-scrollbar {
  display: none;
}

.coleccion-grid {
  display: flex;
  gap: 10px;
  width: max-content;
}

/* Tarjetas miniatura rediseñadas con mejor aspecto visual */
.mini-mascota-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  background: linear-gradient(135deg, rgba(25, 25, 30, 0.6) 0%, rgba(15, 15, 20, 0.8) 100%);
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 8px 6px 8px;
  cursor: pointer;
  font: inherit;
  color: inherit;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  width: 76px;
  flex-shrink: 0;
}

.mini-mascota-box:hover {
  transform: translateY(-3px);
  background: linear-gradient(135deg, rgba(35, 35, 45, 0.8) 0%, rgba(20, 20, 28, 0.9) 100%);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.mini-mascota-box.activa {
  border-color: #facc15;
  background: linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, rgba(20, 20, 25, 0.9) 100%);
  box-shadow: 0 0 12px rgba(250, 204, 21, 0.25);
}

/* Contenedor interno perfectamente centrado para la mascota escalada */
.mini-mascota-inner {
  width: 60px;
  height: 60px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.25);
  pointer-events: none;
}

.mini-mascota-inner :deep(.pet-card-inner) {
  min-height: 0 !important;
  padding: 0 !important;
  border: none !important;
  background: transparent !important;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.32);
  width: 180px;
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mini-mascota-inner :deep(.pet-info-footer),
.mini-mascota-inner :deep(.ambient-particles),
.mini-mascota-inner :deep(.ambient-glow),
.mini-mascota-inner :deep(.speech-bubble) {
  display: none !important;
}

.mini-mascota-tag {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  color: rgba(245, 245, 244, 0.55);
  text-transform: uppercase;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.mini-mascota-tag.tag-actual {
  color: #facc15;
  font-weight: 800;
}

.siguiente-meta {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(245, 245, 244, 0.55);
  margin: 12px 0 0;
  line-height: 1.4;
}

.siguiente-meta strong {
  color: #facc15;
  font-weight: 700;
}
</style>
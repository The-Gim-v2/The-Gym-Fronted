<template>
  <div class="form-panel">
    <NotificationSystem ref="toastRef" />

    <!-- HEADER -->
    <header class="panel-header">
      <div class="header-left">
        <div class="header-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="4" width="18" height="17" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        <div class="title-group">
          <span class="section-kicker">{{ t('billingConfig') }}</span>
          <h2 class="form-title">
            {{ t('selectTitle') }}
            <span class="highlight">{{ t('selectHighlight') }}</span>
          </h2>
          <p class="form-subtitle">{{ t('selectSubtitle') }}</p>
        </div>
      </div>

      <button type="button" class="close-x" @click="$emit('close')" :aria-label="t('close')">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </header>

    <div class="form-body">
      <!-- CORTES DISPONIBLES -->
      <section class="card saved-section">
        <div class="section-heading">
          <div class="section-icon">
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 6h13M8 12h13M8 18h13" />
              <path d="M3 6h.01M3 12h.01M3 18h.01" />
            </svg>
          </div>
          <div class="heading-grow">
            <h3>{{ t('availableCuts') }}</h3>
            <p>
              {{ cortes.length }}
              {{ cortes.length === 1 ? t('availableRule') : t('availableRules') }}
            </p>
          </div>
          <span v-if="cortes.length" class="count-badge">{{ cortes.length }}</span>
        </div>

        <div v-if="cortes.length === 0" class="empty-state">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7">
              <rect x="3" y="4" width="18" height="17" rx="2" />
              <path d="M3 10h18M8 2v4M16 2v4" />
            </svg>
          </div>
          <div>
            <strong>{{ t('noConfigs') }}</strong>
            <p>{{ t('noConfigsDesc') }}</p>
          </div>
        </div>

        <div v-else class="saved-list" role="radiogroup" :aria-label="t('availableCuts')">
          <button
            v-for="(item, index) in cortes"
            :key="index"
            type="button"
            role="radio"
            :aria-checked="selectedIndex === index"
            class="saved-item"
            :class="{ active: selectedIndex === index }"
            @click="selectedIndex = index"
          >
            <div class="saved-item-accent" :class="item.tipo === 'Mensual' ? 'monthly-accent' : 'biweekly-accent'"></div>

            <div class="saved-main">
              <div class="saved-top">
                <strong class="saved-range">
                  {{ t('dayLabel') }} {{ item.inicio }}
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                  {{ t('dayLabel') }} {{ item.termino }}
                </strong>

                <span class="type-badge" :class="item.tipo === 'Mensual' ? 'badge-mes' : 'badge-quin'">
                  {{ item.tipo === 'Mensual' ? t('monthly') : t('biweekly') }}
                </span>
              </div>

              <div class="saved-bottom">
                <span class="meta cutoff-info">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
                  {{ t('cutoffLabel') }} <strong>{{ item.corte }}</strong>
                </span>
                <span class="meta">{{ diasEnRango(item) }} {{ t('daysUnit') }}</span>
                <span v-if="cruzaMes(item)" class="meta wrap-meta">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" /><path d="M21 3v5h-5" /></svg>
                  {{ t('crossesMonth') }}
                </span>
              </div>
            </div>

            <span class="radio-dot"></span>
          </button>
        </div>
      </section>

      <!-- CALENDARIO -->
      <section class="card calendar-section">
        <div class="calendar-header-info">
          <div class="section-heading no-margin">
            <div class="section-icon">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M3 10h18M8 2v4M16 2v4" />
              </svg>
            </div>
            <div>
              <h3>{{ t('previewMonth') }}</h3>
              <p>{{ t('calendarDesc') }}</p>
            </div>
          </div>

          <div class="calendar-legend">
            <span class="legend-item"><span class="dot dot-corte"></span>{{ t('cutoff') }}</span>
            <span class="legend-item"><span class="dot dot-mes"></span>{{ t('monthly') }}</span>
            <span class="legend-item"><span class="dot dot-quin"></span>{{ t('biweekly') }}</span>
          </div>
        </div>

        <div class="calendar-grid">
          <div
            v-for="n in 31"
            :key="n"
            :class="['cal-day', getDayClass(n)]"
            :title="`${t('dayLabel')} ${n}`"
          >
            <span>{{ n }}</span>
            <svg v-if="getDayClass(n) === 'is-corte'" class="cut-icon" viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.4"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          </div>
        </div>

        <div v-if="!seleccionado" class="calendar-hint">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8h.01M11 12h1v4h1" />
          </svg>
          {{ t('calendarHint') }}
        </div>
      </section>

      <!-- CONFIRMAR SELECCIÓN -->
      <div class="rule-preview">
        <div class="rule-preview-content">
          <span class="rule-label">{{ t('selectedCut') }}</span>

          <template v-if="seleccionado">
            <strong class="rule-range">
              {{ t('dayLabel') }} {{ seleccionado.inicio }}
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
              {{ t('dayLabel') }} {{ seleccionado.termino }}
            </strong>

            <div class="rule-tags">
              <span class="tag tag-days">{{ diasEnRango(seleccionado) }} {{ t('daysUnit') }}</span>
              <span class="tag tag-cutoff">{{ t('cutoff') }} · {{ t('dayLabel') }} {{ seleccionado.corte }}</span>
              <span class="tag" :class="seleccionado.tipo === 'Mensual' ? 'tag-mes' : 'tag-quin'">
                {{ seleccionado.tipo === 'Mensual' ? t('monthly') : t('biweekly') }}
              </span>
              <span v-if="cruzaMes(seleccionado)" class="tag tag-wrap">{{ t('crossesMonth') }}</span>
            </div>
          </template>

          <p v-else class="none-selected">{{ t('noneSelected') }}</p>
        </div>

        <button type="button" class="btn-save" :disabled="!seleccionado" @click="confirmarSeleccion" :title="t('selectBtnTitle')">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12l5 5L20 7" />
          </svg>
          <span>{{ t('selectBtn') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

interface CorteItem {
  inicio: number;
  termino: number;
  corte: number;
  tipo: string;
}

/*
  - cortes:   lista de cortes que configuró el propietario (solo lectura)
  - selected: corte que el gerente tiene activo actualmente (opcional)
*/
const props = withDefaults(
  defineProps<{
    cortes?: CorteItem[];
    selected?: CorteItem | null;
  }>(),
  {
    cortes: () => [],
    selected: null
  }
);

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'select', corte: CorteItem): void;
}>();

const settings = reactive({
  idioma: localStorage.getItem('GYM_MANAGER-idioma') || 'es'
});

const translations: Record<string, Record<string, string>> = {
  es: {
    selectTitle: 'SELECCIONAR',
    selectHighlight: 'CORTE',
    selectSubtitle: 'Elige uno de los cortes configurados por el propietario.',
    billingConfig: 'Configuración de cobros',
    close: 'Cerrar modal',
    cutoff: 'Corte',
    monthly: 'Mensual',
    biweekly: 'Quincenal',
    availableCuts: 'Cortes disponibles',
    availableRule: 'corte disponible',
    availableRules: 'cortes disponibles',
    cutoffLabel: 'Día de corte',
    previewMonth: 'Vista previa del mes',
    dayLabel: 'Día',
    noConfigs: 'Sin cortes disponibles',
    noConfigsDesc: 'El propietario aún no ha configurado ningún corte.',
    calendarDesc: 'Así se distribuye el corte que elijas.',
    calendarHint: 'Selecciona un corte para ver sus días en el calendario.',
    daysUnit: 'días',
    crossesMonth: 'Cruza de mes',
    selectedCut: 'Corte seleccionado',
    noneSelected: 'Aún no has elegido ningún corte.',
    selectBtn: 'Seleccionar corte',
    selectBtnTitle: 'Usar este corte',
    selectedMsg: 'Corte seleccionado con éxito'
  },
  en: {
    selectTitle: 'SELECT',
    selectHighlight: 'CUTOFF',
    selectSubtitle: 'Choose one of the cutoffs set up by the owner.',
    billingConfig: 'Billing configuration',
    close: 'Close modal',
    cutoff: 'Cutoff',
    monthly: 'Monthly',
    biweekly: 'Biweekly',
    availableCuts: 'Available cutoffs',
    availableRule: 'available cutoff',
    availableRules: 'available cutoffs',
    cutoffLabel: 'Cutoff day',
    previewMonth: 'Month preview',
    dayLabel: 'Day',
    noConfigs: 'No cutoffs available',
    noConfigsDesc: 'The owner has not set up any cutoff yet.',
    calendarDesc: 'This is how the cutoff you choose is laid out.',
    calendarHint: 'Select a cutoff to see its days on the calendar.',
    daysUnit: 'days',
    crossesMonth: 'Crosses months',
    selectedCut: 'Selected cutoff',
    noneSelected: 'You have not chosen a cutoff yet.',
    selectBtn: 'Select cutoff',
    selectBtnTitle: 'Use this cutoff',
    selectedMsg: 'Cutoff selected successfully'
  }
};

const t = (key: string) =>
  translations[settings.idioma]?.[key] || translations.es?.[key] || key;

const toastRef = ref<any>(null);
const selectedIndex = ref<number | null>(null);

const cortes = computed(() => props.cortes);

const seleccionado = computed<CorteItem | null>(() =>
  selectedIndex.value !== null ? cortes.value[selectedIndex.value] ?? null : null
);

/* Si ya hay un corte activo, se marca al abrir (o cuando cambie la lista) */
const mismoCorte = (a: CorteItem, b: CorteItem) =>
  a.inicio === b.inicio &&
  a.termino === b.termino &&
  a.corte === b.corte &&
  a.tipo === b.tipo;

watch(
  () => [props.cortes, props.selected] as const,
  () => {
    if (!props.selected) {
      selectedIndex.value = null;
      return;
    }
    const idx = props.cortes.findIndex((c) => mismoCorte(c, props.selected as CorteItem));
    selectedIndex.value = idx >= 0 ? idx : null;
  },
  { immediate: true, deep: true }
);

/* =========================================================
   RANGOS (permiten cruzar de un mes al siguiente)
========================================================= */

const cruzaMes = (c: { inicio: number; termino: number }) =>
  c.inicio > c.termino;

const diasEnRango = (c: { inicio: number; termino: number }) =>
  cruzaMes(c)
    ? 31 - c.inicio + 1 + c.termino
    : c.termino - c.inicio + 1;

const enRango = (n: number, c: CorteItem) =>
  cruzaMes(c)
    ? n >= c.inicio || n <= c.termino
    : n >= c.inicio && n <= c.termino;

/* =========================================================
   ACCIONES
========================================================= */

const confirmarSeleccion = () => {
  if (!seleccionado.value) return;

  emit('select', { ...seleccionado.value });
  toastRef.value?.notify?.(t('selectedMsg'), 'success');
};

/* =========================================================
   CALENDARIO (muestra solo el corte seleccionado)
========================================================= */

const getDayClass = (n: number) => {
  const c = seleccionado.value;
  if (!c) return 'default-bg';

  if (Number(c.corte) === n) return 'is-corte';
  if (!enRango(n, c)) return 'default-bg';

  return c.tipo === 'Mensual' ? 'mes' : 'quin';
};

/* =========================================================
   IDIOMA
========================================================= */

const handleLanguageChange = (e: Event) => {
  const customEvent = e as CustomEvent;
  if (customEvent.detail?.idioma) {
    settings.idioma = customEvent.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLanguageChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLanguageChange);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600;700&family=Oswald:wght@500;600;700&display=swap');

* {
  box-sizing: border-box;
}

.form-panel {
  --accent: var(--color-highlight, #3b82f6);
  --card-bg: var(--bg-cards, #111317);
  --surface: color-mix(in srgb, var(--card-bg) 90%, black);
  --surface-2: color-mix(in srgb, var(--card-bg) 80%, black);
  --text: var(--color-texto-general, #f4f4f5);
  --title: var(--color-titulos, #ffffff);
  --muted: color-mix(in srgb, var(--text) 62%, transparent);
  --muted-2: color-mix(in srgb, var(--text) 42%, transparent);
  --line: color-mix(in srgb, var(--text) 11%, transparent);
  --line-strong: color-mix(in srgb, var(--text) 20%, transparent);
  --blue: #60a5fa;
  --green: #4ade80;
  --amber: #fbbf24;
  --red: #f87171;

  width: min(96vw, 720px);
  max-height: 92vh;
  overflow-y: auto;
  padding: 26px;
  border: 1px solid var(--line);
  border-radius: var(--app-border-radius, 16px);
  background: var(--card-bg);
  color: var(--text);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.58);
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--text) 18%, transparent) transparent;
}

.form-panel::-webkit-scrollbar { width: 6px; }
.form-panel::-webkit-scrollbar-track { background: transparent; }
.form-panel::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: color-mix(in srgb, var(--text) 18%, transparent);
}

/* HEADER */

.panel-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--line);
}

.header-left {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
}

.header-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 12px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}

.title-group { min-width: 0; }

.section-kicker {
  display: block;
  margin-bottom: 2px;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 600;
}

.form-title {
  margin: 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 1.6rem;
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: 0.4px;
}

.highlight { color: var(--accent); }

.form-subtitle {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
  line-height: 1.45;
}

.close-x {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  color: var(--muted);
  cursor: pointer;
  transition: background 0.17s ease, border-color 0.17s ease, color 0.17s ease;
}

.close-x:hover {
  border-color: var(--line-strong);
  background: color-mix(in srgb, var(--text) 7%, var(--surface));
  color: var(--text);
}

/* BODY / CARDS */

.form-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--surface);
}

.section-heading {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 18px;
}

.section-heading.no-margin { margin-bottom: 0; }
.heading-grow { flex: 1; min-width: 0; }

.section-icon {
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
}

.section-heading h3 {
  margin: 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.section-heading p {
  margin: 2px 0 0;
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.4;
}

.count-badge {
  min-width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 9px;
  border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  border-radius: 8px;
  color: var(--accent);
  background: color-mix(in srgb, var(--accent) 10%, transparent);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.82rem;
  font-weight: 700;
}

/* EMPTY */

.empty-state {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border: 1px dashed var(--line-strong);
  border-radius: 12px;
  background: var(--surface-2);
}

.empty-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 11px;
  color: var(--muted);
  background: color-mix(in srgb, var(--text) 5%, transparent);
}

.empty-state strong { display: block; color: var(--text); font-size: 0.95rem; }
.empty-state p { margin: 3px 0 0; color: var(--muted); font-size: 0.85rem; }

/* LISTA SELECCIONABLE */

.saved-list { display: flex; flex-direction: column; gap: 10px; }

.saved-item {
  width: 100%;
  display: grid;
  grid-template-columns: 4px 1fr auto;
  align-items: center;
  gap: 14px;
  padding: 13px 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface-2);
  color: var(--text);
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.17s ease, background 0.17s ease;
}

.saved-item:hover { border-color: var(--line-strong); }

.saved-item.active {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 8%, var(--surface-2));
}

.saved-item:focus-visible,
.btn-save:focus-visible,
.close-x:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.saved-item-accent { align-self: stretch; width: 4px; border-radius: 5px; }
.monthly-accent { background: #3b82f6; }
.biweekly-accent { background: #22c55e; }

.saved-main { min-width: 0; }

.saved-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.saved-range {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  color: var(--text);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
}

.saved-range svg { color: var(--muted-2); }

.type-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 10px;
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
}

.badge-mes { background: rgba(59, 130, 246, 0.14); color: var(--blue); }
.badge-quin { background: rgba(34, 197, 94, 0.13); color: var(--green); }

.saved-bottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px 14px;
  margin-top: 7px;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: var(--muted);
  font-size: 0.82rem;
}

.cutoff-info { color: var(--muted); }
.cutoff-info svg { color: var(--amber); }
.cutoff-info strong { color: var(--amber); font-family: 'IBM Plex Mono', monospace; }
.wrap-meta { color: var(--accent); }

.radio-dot {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  border: 2px solid var(--line-strong);
  border-radius: 50%;
  transition: border-color 0.17s ease, background 0.17s ease;
}

.saved-item.active .radio-dot {
  border-color: var(--accent);
  background: radial-gradient(circle, var(--accent) 0 45%, transparent 50%);
}

/* CALENDARIO */

.calendar-header-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.calendar-legend { display: flex; align-items: center; flex-wrap: wrap; gap: 14px; }

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted);
  font-size: 0.8rem;
  font-weight: 500;
}

.dot { width: 9px; height: 9px; flex-shrink: 0; border-radius: 50%; }
.dot-corte { background: var(--amber); }
.dot-mes { background: #3b82f6; }
.dot-quin { background: #22c55e; }

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
  gap: 7px;
}

.cal-day {
  position: relative;
  min-height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 9px;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.92rem;
  font-weight: 600;
}

.cut-icon { position: absolute; top: 4px; right: 4px; }

.default-bg {
  border-color: var(--line);
  background: var(--surface-2);
  color: var(--muted-2);
}

.mes {
  border-color: rgba(59, 130, 246, 0.35);
  background: rgba(59, 130, 246, 0.15);
  color: #93c5fd;
}

.quin {
  border-color: rgba(34, 197, 94, 0.35);
  background: rgba(34, 197, 94, 0.14);
  color: #86efac;
}

.is-corte {
  border-color: rgba(251, 191, 36, 0.6) !important;
  background: rgba(251, 191, 36, 0.18) !important;
  color: var(--amber) !important;
}

.calendar-hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.85rem;
}

/* CONFIRMAR SELECCIÓN */

.rule-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 16px;
  border: 1px solid color-mix(in srgb, var(--accent) 28%, var(--line));
  border-radius: 12px;
  background: color-mix(in srgb, var(--accent) 5%, var(--surface-2));
}

.rule-preview-content { min-width: 0; flex: 1; }

.rule-label {
  display: block;
  color: var(--accent);
  font-size: 0.78rem;
  font-weight: 600;
}

.rule-range {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 3px;
  color: var(--title);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.15rem;
}

.rule-range svg { color: var(--muted-2); }

.none-selected {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.88rem;
}

.rule-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 10px;
}

.tag {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--text) 8%, transparent);
  color: var(--muted);
  font-size: 0.76rem;
  font-weight: 600;
}

.tag-cutoff { background: rgba(251, 191, 36, 0.12); color: var(--amber); }
.tag-mes { background: rgba(59, 130, 246, 0.14); color: var(--blue); }
.tag-quin { background: rgba(34, 197, 94, 0.13); color: var(--green); }
.tag-wrap {
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  color: var(--accent);
}

.btn-save {
  min-height: 48px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 0 20px;
  border: 0;
  border-radius: 10px;
  background: var(--color-botones, #2563eb);
  color: var(--color-texto-botones, #ffffff);
  font-family: 'Inter', sans-serif;
  font-size: 0.92rem;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}

.btn-save:hover { filter: brightness(1.1); }
.btn-save:active { transform: scale(0.97); }

.btn-save:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  filter: none;
}

.btn-save:disabled:active { transform: none; }

/* RESPONSIVE */

@media (max-width: 640px) {
  .form-panel { width: min(97vw, 560px); padding: 18px; }

  .card { padding: 16px; }

  .rule-preview { flex-direction: column; align-items: stretch; }
  .btn-save { width: 100%; }
}

@media (max-width: 480px) {
  .form-panel {
    width: calc(100vw - 12px);
    max-height: 96vh;
    padding: 14px;
    border-radius: 13px;
  }

  .form-title { font-size: 1.35rem; }
  .header-icon { width: 42px; height: 42px; }

  .calendar-grid {
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 5px;
  }

  .cal-day { min-height: 40px; font-size: 0.82rem; }
}

@media (prefers-reduced-motion: reduce) {
  .close-x, .saved-item, .btn-save, .radio-dot {
    transition: none !important;
  }
}
</style>
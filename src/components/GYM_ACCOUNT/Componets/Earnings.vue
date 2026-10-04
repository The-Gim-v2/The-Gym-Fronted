<template>
  <div class="form-panel">
    <div class="panel-header">
      <div class="title-group">
        <h2 class="form-title">{{ t('title') }} <span class="highlight">{{ t('highlight') }}</span></h2>
        <p class="form-subtitle">{{ t('subtitle') }}</p>
      </div>
      <button class="close-x" @click="$emit('close')" :aria-label="t('close')">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <!-- TABS -->
    <div class="tabs" role="tablist">
      <button v-for="tb in tabs" :key="tb" class="tab" :class="{ active: tab === tb }" role="tab" :aria-selected="tab === tb" @click="tab = tb">
        {{ t('tab_' + tb) }}
      </button>
    </div>

    <div class="form-body">
      <!-- POR MEMBRESÍA -->
      <div v-if="tab === 'membership'" class="section">
        <div v-if="membershipRows.length" class="rows">
          <div v-for="r in membershipRows" :key="r.name" class="row">
            <div class="row-head">
              <span class="row-name"><i class="dot" :class="r.cls"></i>{{ r.name }}</span>
              <span class="row-value">{{ money(r.amount) }}</span>
            </div>
            <div class="track"><div class="fill" :class="r.cls" :style="{ width: r.percent + '%' }"></div></div>
            <div class="row-foot">
              <span>{{ r.count }} {{ t('members') }}</span>
              <span>{{ r.percent }}%</span>
            </div>
          </div>
        </div>
        <p v-else class="empty">{{ t('empty') }}</p>
        <div v-if="topMembership" class="insight">
          <span class="insight-label">{{ t('topMembership') }}</span>
          <span class="insight-value">{{ topMembership.name }} · {{ topMembership.percent }}%</span>
        </div>
      </div>

      <!-- POR TIPO DE PAGO -->
      <div v-else-if="tab === 'payment'" class="section">
        <template v-if="total > 0">
          <div class="split-bar">
            <div v-for="p in paymentRows" :key="p.key" class="split-seg" :class="p.cls" :style="{ width: p.percent + '%' }"></div>
          </div>
          <div class="pay-grid">
            <div v-for="p in paymentRows" :key="p.key" class="pay-card" :class="p.cls">
              <span class="pay-label"><i class="dot" :class="p.cls"></i>{{ t(p.key) }}</span>
              <span class="pay-value">{{ money(p.amount) }}</span>
              <span class="pay-sub">{{ p.count }} {{ t('members') }} · {{ p.percent }}%</span>
              <span class="pay-sub">{{ t('ticket') }}: {{ money(p.count ? p.amount / p.count : 0) }}</span>
            </div>
          </div>
        </template>
        <p v-else class="empty">{{ t('empty') }}</p>
      </div>

      <!-- TENDENCIA -->
      <div v-else class="section">
        <div class="chart-container">
          <div v-for="m in monthly" :key="m.key" class="bar-col">
            <div class="bar-track">
              <div class="tooltip-badge">{{ m.label }}</div>
              <div class="bar-fill" :class="{ best: m.key === bestMonth.key }" :style="{ height: m.percent + '%' }"></div>
            </div>
            <span class="month-label">{{ monthName(m.key) }}</span>
          </div>
        </div>
        <div class="kpi-grid">
          <div class="kpi">
            <span class="kpi-label">{{ t('lastMonth') }}</span>
            <span class="kpi-value" :class="delta >= 0 ? 'up' : 'down'">{{ delta >= 0 ? '▲' : '▼' }} {{ Math.abs(delta) }}%</span>
          </div>
          <div class="kpi">
            <span class="kpi-label">{{ t('bestMonth') }}</span>
            <span class="kpi-value up">{{ monthName(bestMonth.key) }} · {{ bestMonth.label }}</span>
          </div>
        </div>
        <p class="note">{{ t('sampleNote') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue';

interface IncomeUser {
  membership: string;
  amount: string;
  mensualidad: string;
}

const props = withDefaults(defineProps<{ users?: IncomeUser[] }>(), { users: () => [] });
defineEmits(['close']);

const settings = reactive({ idioma: localStorage.getItem('GYM_ACCOUNT-idioma') || 'es' });
const onLang = (e: Event) => {
  const d = (e as CustomEvent<{ idioma?: string }>).detail;
  if (d?.idioma) settings.idioma = d.idioma;
};
onMounted(() => window.addEventListener('idioma-changed', onLang as EventListener));
onUnmounted(() => window.removeEventListener('idioma-changed', onLang as EventListener));

const translations: Record<string, Record<string, string>> = {
  es: {
    title: 'ANÁLISIS', highlight: 'DE INGRESOS', subtitle: 'De dónde vienen tus ingresos', close: 'Cerrar modal',
    tab_membership: 'Membresía', tab_payment: 'Tipo de pago', tab_trend: 'Tendencia',
    members: 'miembros', empty: 'No hay datos con los filtros actuales.',
    topMembership: 'Membresía que más aporta', ticket: 'Ticket promedio',
    monthly: 'Mensual', fortnightly: 'Quincenal',
    lastMonth: 'Último mes vs anterior', bestMonth: 'Mejor mes',
    sampleNote: 'Datos de ejemplo: conecta aquí tu historial mensual real.'
  },
  en: {
    title: 'INCOME', highlight: 'ANALYSIS', subtitle: 'Where your income comes from', close: 'Close modal',
    tab_membership: 'Membership', tab_payment: 'Payment type', tab_trend: 'Trend',
    members: 'members', empty: 'No data with the current filters.',
    topMembership: 'Top contributing membership', ticket: 'Average ticket',
    monthly: 'Monthly', fortnightly: 'Fortnightly',
    lastMonth: 'Last month vs previous', bestMonth: 'Best month',
    sampleNote: 'Sample data: plug in your real monthly history here.'
  }
};
const t = (k: string): string => translations[settings.idioma]?.[k] ?? translations['es']?.[k] ?? k;

const locale = computed(() => (settings.idioma === 'en' ? 'en-US' : 'es-MX'));
const money = (v: number) => new Intl.NumberFormat(locale.value, { style: 'currency', currency: 'MXN' }).format(v);
const parseAmount = (s: string) => parseFloat(s.replace(/[^0-9.]/g, '')) || 0;

const tabs = ['membership', 'payment', 'trend'] as const;
const tab = ref<(typeof tabs)[number]>('membership');

const total = computed(() => props.users.reduce((s, u) => s + parseAmount(u.amount), 0));
const pct = (v: number) => (total.value ? Math.round((v / total.value) * 100) : 0);

const membershipClass: Record<string, string> = {
  '1 Mes': 'c-red', '2 Meses': 'c-blue', '3 Meses': 'c-green',
  '4 Meses': 'c-purple', '5 Meses': 'c-orange', '6 Meses': 'c-pink'
};

const membershipRows = computed(() => {
  const map = new Map<string, { amount: number; count: number }>();
  props.users.forEach(u => {
    const cur = map.get(u.membership) || { amount: 0, count: 0 };
    cur.amount += parseAmount(u.amount);
    cur.count += 1;
    map.set(u.membership, cur);
  });
  return [...map.entries()]
    .map(([name, v]) => ({ name, ...v, percent: pct(v.amount), cls: membershipClass[name] || 'c-default' }))
    .sort((a, b) => b.amount - a.amount);
});
const topMembership = computed(() => membershipRows.value[0] || null);

const paymentRows = computed(() =>
  (['Mensual', 'Quincenal'] as const).map(k => {
    const list = props.users.filter(u => u.mensualidad === k);
    const amount = list.reduce((s, u) => s + parseAmount(u.amount), 0);
    return { key: k === 'Mensual' ? 'monthly' : 'fortnightly', count: list.length, amount, percent: pct(amount), cls: k === 'Mensual' ? 'c-blue' : 'c-purple' };
  })
);

// Tendencia (datos de ejemplo, reemplazar por historial real)
interface MonthPoint { key: string; value: number; label: string; percent: number }
const sample: number[] = [9, 15, 10, 21, 13, 18, 12, 7, 16, 22, 13, 17];
const monthKeys = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const monthEn: Record<string, string> = { Ene: 'Jan', Abr: 'Apr', Ago: 'Aug', Dic: 'Dec' };
const monthName = (k: string): string => (settings.idioma === 'en' ? monthEn[k] ?? k : k);
const maxSample = Math.max(...sample, 1);
const monthly: MonthPoint[] = monthKeys.map((key, i) => {
  const value = sample[i] ?? 0;
  return { key, value, label: `$${value}k`, percent: Math.round((value / maxSample) * 100) };
});
const emptyMonth: MonthPoint = { key: 'Ene', value: 0, label: '$0k', percent: 0 };
const bestMonth = monthly.reduce<MonthPoint>((a, b) => (b.value > a.value ? b : a), emptyMonth);
const lastValue = sample[sample.length - 1] ?? 0;
const prevValue = sample[sample.length - 2] ?? 0;
const delta = prevValue ? Math.round(((lastValue - prevValue) / prevValue) * 100) : 0;
</script>

<style scoped>
.highlight { color: var(--color-highlight, #3b82f6); }

.form-panel {
  background: var(--bg-cards, #121214);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  color: var(--color-texto-general, #fff);
  border-radius: var(--app-border-radius, 20px);
  padding: 24px;
  width: 95%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  font-family: 'Inter', system-ui, sans-serif;
}
.form-panel *, .form-panel *::before, .form-panel *::after { box-sizing: border-box; }

.panel-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px; }
.title-group { display: flex; flex-direction: column; gap: 3px; }
.form-title { font-family: 'Oswald', sans-serif; font-size: 1.15rem; color: var(--color-titulos, #fff); margin: 0; letter-spacing: 0.8px; }
.form-subtitle { font-size: 0.78rem; color: var(--color-texto-secundario, #888); margin: 0; }

.close-x {
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--color-texto-secundario, #aaa); cursor: pointer; width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center; transition: all 0.2s; flex-shrink: 0;
}
.close-x:hover { background: rgba(255, 255, 255, 0.1); color: var(--color-titulos, #fff); }

/* TABS */
.tabs { display: flex; gap: 4px; padding: 4px; margin-bottom: 16px; border-radius: 11px; background: var(--bg-input, #09090b); border: 1px solid var(--border-input, rgba(255, 255, 255, 0.05)); }
.tab {
  flex: 1; min-height: 34px; padding: 0 8px; border: none; border-radius: 8px; background: transparent;
  color: var(--color-texto-secundario, #888); font-family: 'Inter', sans-serif; font-size: 0.74rem; font-weight: 600;
  cursor: pointer; transition: background 0.18s ease, color 0.18s ease;
}
.tab:hover { color: var(--color-titulos, #fff); }
.tab.active { background: color-mix(in srgb, var(--color-highlight, #3b82f6) 18%, transparent); color: var(--color-highlight, #60a5fa); }

.section { display: flex; flex-direction: column; gap: 14px; }
.empty { margin: 30px 0; text-align: center; color: var(--color-texto-secundario, #888); font-size: 0.82rem; }

.dot { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; background: var(--c); }
.c-red { --c: #f87171; } .c-blue { --c: #60a5fa; } .c-green { --c: #34d399; }
.c-purple { --c: #c084fc; } .c-orange { --c: #fb923c; } .c-pink { --c: #f472b6; } .c-default { --c: #cbd5e1; }

/* MEMBRESÍA */
.rows { display: flex; flex-direction: column; gap: 14px; }
.row { display: flex; flex-direction: column; gap: 6px; }
.row-head { display: flex; justify-content: space-between; align-items: center; }
.row-name { display: inline-flex; align-items: center; font-size: 0.82rem; font-weight: 600; color: var(--color-titulos, #fff); }
.row-value { font-family: 'Oswald', sans-serif; font-size: 0.95rem; color: var(--color-titulos, #fff); }
.track { height: 8px; border-radius: 999px; background: rgba(255, 255, 255, 0.05); overflow: hidden; }
.fill { height: 100%; border-radius: 999px; background: var(--c); transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.row-foot { display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--color-texto-secundario, #888); }

.insight { display: flex; flex-direction: column; gap: 3px; padding: 13px 15px; border-radius: 12px; background: var(--bg-input, #09090b); border: 1px solid var(--border-input, rgba(255, 255, 255, 0.05)); }
.insight-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-texto-secundario, #888); }
.insight-value { font-family: 'Oswald', sans-serif; font-size: 1.1rem; color: #34d399; }

/* PAGO */
.split-bar { display: flex; height: 12px; border-radius: 999px; overflow: hidden; background: rgba(255, 255, 255, 0.05); }
.split-seg { background: var(--c); transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
.pay-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.pay-card { display: flex; flex-direction: column; gap: 5px; padding: 15px; border-radius: 12px; background: var(--bg-input, #09090b); border: 1px solid var(--border-input, rgba(255, 255, 255, 0.05)); border-top: 2px solid var(--c); }
.pay-label { display: inline-flex; align-items: center; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--color-texto-secundario, #888); }
.pay-value { font-family: 'Oswald', sans-serif; font-size: 1.2rem; color: var(--color-titulos, #fff); }
.pay-sub { font-size: 0.72rem; color: var(--color-texto-secundario, #888); }

/* TENDENCIA */
.chart-container {
  display: flex; justify-content: space-between; align-items: flex-end; height: 170px; gap: 6px;
  background: var(--bg-input, #09090b); padding: 18px 12px 10px; border-radius: var(--app-border-radius, 12px);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.04));
}
.bar-col { display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; }
.bar-track { width: 100%; height: 100%; background: rgba(255, 255, 255, 0.02); border-radius: 6px; position: relative; display: flex; align-items: flex-end; }
.bar-fill { width: 100%; background: var(--color-highlight, #3b82f6); opacity: 0.75; border-radius: 6px; transition: height 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s; }
.bar-fill.best { background: #34d399; opacity: 1; }
.bar-track:hover .bar-fill { opacity: 1; }
.tooltip-badge {
  position: absolute; top: -24px; left: 50%; transform: translateX(-50%) translateY(4px);
  background: #1e1e24; color: var(--color-texto-general, #fff); font-size: 0.65rem; font-family: 'Oswald', sans-serif;
  padding: 2px 5px; border-radius: 4px; border: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0; visibility: hidden; transition: all 0.2s ease; white-space: nowrap; pointer-events: none; z-index: 10;
}
.bar-track:hover .tooltip-badge { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0); }
.month-label { font-size: 9px; color: var(--color-texto-secundario, #888); margin-top: 8px; font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.5px; }

.kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.kpi { display: flex; flex-direction: column; gap: 4px; padding: 13px 15px; border-radius: 12px; background: var(--bg-input, #09090b); border: 1px solid var(--border-input, rgba(255, 255, 255, 0.05)); }
.kpi-label { font-size: 0.68rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; color: var(--color-texto-secundario, #888); }
.kpi-value { font-family: 'Oswald', sans-serif; font-size: 1.1rem; }
.up { color: #34d399; }
.down { color: #f87171; }
.note { margin: 0; font-size: 0.68rem; color: var(--color-texto-secundario, #888); opacity: 0.8; }

@media (max-width: 480px) {
  .form-panel { padding: 18px; }
  .pay-grid, .kpi-grid { grid-template-columns: 1fr; }
  .chart-container { height: 150px; gap: 4px; padding: 14px 6px 8px; }
  .month-label { font-size: 8px; }
  .tab { font-size: 0.7rem; }
}

@media (prefers-reduced-motion: reduce) {
  .fill, .split-seg, .bar-fill, .tab, .tooltip-badge { transition: none !important; }
}
</style>
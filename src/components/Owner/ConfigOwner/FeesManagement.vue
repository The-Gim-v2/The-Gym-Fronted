<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import HeadingOwner from '../HeadingOwner.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';
import { traducciones } from '../i18n.js';

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
});

const toastRef = ref(null);
const graceDays = ref(3);

const settings = ref({
  pendingStatus: true,
  inactiveStatus: true,
  blockTurnstile: true,
  paymentType: 'membresia',
  fineAmount: 800,
  recurrence: 'unica',
  maxFineLimit: 2500
});

const incrementDays = () => {
  graceDays.value++;
  guardarCambiosRapidos();
};

const decrementDays = () => {
  if (graceDays.value > 0) {
    graceDays.value--;
    guardarCambiosRapidos();
  }
};

const guardarCambiosRapidos = () => {
  if (toastRef.value) toastRef.value.notify(t('quickSettingsUpdatedToast'), 'success');
};

const guardarConfiguracionGeneral = () => {
  if (toastRef.value) toastRef.value.notify(t('generalSettingsSavedToast'), 'success');
};

// --- Ayudas puramente visuales (no alteran el estado persistido) ---
const graceDayPips = computed(() => Array.from({ length: Math.min(graceDays.value, 10) }));
const graceOverflow = computed(() => Math.max(graceDays.value - 10, 0));

const finePercent = computed(() => {
  const max = Number(settings.value.maxFineLimit) || 0;
  const fine = Number(settings.value.fineAmount) || 0;
  if (max <= 0) return 0;
  return Math.min(Math.round((fine / max) * 100), 100);
});
</script>

<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content-promos">

      <!-- CUADRO IZQUIERDO: REGLAS DE MOROSIDAD -->
      <section class="promo-box-container accent-amber">
        <div class="box-header">
          <div class="header-top">
            <span class="header-icon-badge">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v4"></path><path d="M12 17h.01"></path><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"></path></svg>
            </span>
            <div class="header-text">
              <h2>{{ t('delinquencyRulesTitlePart1') }} <span class="highlight">{{ t('delinquencyRulesTitleHighlight') }}</span></h2>
              <p class="box-subtitle">{{ t('delinquencyRulesSubtitle') }}</p>
            </div>
          </div>
        </div>

        <div class="box-content">
          <!-- Aplicar recargos a: Pendientes -->
          <div class="item-row" :class="{ 'is-on': settings.pendingStatus }" id="tutorial-step-0">
            <div class="item-info">
              <div class="icon-wrapper">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div class="text-grow">
                <h4>{{ t('statusPendingTitle') }}</h4>
                <p>{{ t('statusPendingDesc') }}</p>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.pendingStatus" @change="guardarCambiosRapidos" />
              <span class="toggle-track"><span class="toggle-knob"></span></span>
            </label>
          </div>

          <!-- Aplicar recargos a: Inactivos -->
          <div class="item-row" :class="{ 'is-on': settings.inactiveStatus }" id="tutorial-step-1">
            <div class="item-info">
              <div class="icon-wrapper">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div class="text-grow">
                <h4>{{ t('statusInactiveTitle') }}</h4>
                <p>{{ t('statusInactiveDesc') }}</p>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.inactiveStatus" @change="guardarCambiosRapidos" />
              <span class="toggle-track"><span class="toggle-knob"></span></span>
            </label>
          </div>

          <!-- Bloqueo automático de acceso en torniquete -->
          <div class="item-row" :class="{ 'is-on': settings.blockTurnstile }" id="tutorial-step-2">
            <div class="item-info">
              <div class="icon-wrapper">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div class="text-grow">
                <h4>{{ t('turnstileBlockTitle') }}</h4>
                <p>{{ t('turnstileBlockDesc') }}</p>
              </div>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" v-model="settings.blockTurnstile" @change="guardarCambiosRapidos" />
              <span class="toggle-track"><span class="toggle-knob"></span></span>
            </label>
          </div>

          <!-- Periodo de Gracia -->
          <div class="item-row vertical-layout grace-row" id="tutorial-step-3">
            <div class="item-info full-width">
              <div class="icon-wrapper">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="text-grow">
                <h4>{{ t('gracePeriodTitle') }}</h4>
                <p>{{ t('gracePeriodDesc') }}</p>
              </div>
            </div>

            <div class="grace-period-control">
              <button class="btn-counter" @click="decrementDays" type="button" :disabled="graceDays === 0" aria-label="Restar día">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <div class="days-display-wrap">
                <span class="days-display">{{ graceDays }}</span>
                <span class="days-label">{{ t('daysDisplayLabel') }}</span>
              </div>
              <button class="btn-counter" @click="incrementDays" type="button" aria-label="Sumar día">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>

            <div class="grace-pips" aria-hidden="true">
              <span v-for="(p, i) in graceDayPips" :key="i" class="pip"></span>
              <span v-if="graceOverflow > 0" class="pip-overflow">+{{ graceOverflow }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CUADRO DERECHO: COSTO Y FRECUENCIA -->
      <section class="promo-box-container accent-blue">
        <div class="box-header">
          <div class="header-top">
            <span class="header-icon-badge badge-blue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </span>
            <div class="header-text">
              <h2>{{ t('costFrequencyTitlePart1') }} <span class="highlight">{{ t('costFrequencyTitleHighlight') }}</span></h2>
              <p class="box-subtitle">{{ t('costFrequencySubtitle') }}</p>
            </div>
          </div>
        </div>

        <div class="box-content">
          <div class="form-column-layout">
            <div class="input-group" id="tutorial-step-4">
              <label>{{ t('affectedServiceLabel') }}</label>
              <div class="select-wrap">
                <select v-model="settings.paymentType" class="custom-select">
                  <option value="membresia">{{ t('serviceMembershipOption') }}</option>
                  <option value="clases">{{ t('serviceClassesOption') }}</option>
                  <option value="taquilla">{{ t('serviceLockerOption') }}</option>
                  <option value="todos">{{ t('serviceAllOption') }}</option>
                </select>
                <svg class="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div class="fine-grid">
              <div class="input-group" id="tutorial-step-5">
                <label>{{ t('fineAmountLabel') }}</label>
                <div class="input-money-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" v-model="settings.fineAmount" class="custom-input mono" min="0">
                </div>
              </div>

              <div class="input-group" id="tutorial-step-7">
                <label>{{ t('maxFineLimitLabel') }}</label>
                <div class="input-money-wrapper">
                  <span class="currency-symbol">$</span>
                  <input type="number" v-model="settings.maxFineLimit" class="custom-input mono" min="0">
                </div>
              </div>
            </div>

            <div class="fine-ratio-bar" aria-hidden="true">
              <div class="fine-ratio-track">
                <div class="fine-ratio-fill" :style="{ width: finePercent + '%' }"></div>
              </div>
              <span class="fine-ratio-label">{{ finePercent }}%</span>
            </div>

            <div class="input-group" id="tutorial-step-6">
              <label>{{ t('recurrenceLabel') }}</label>
              <div class="select-wrap">
                <select v-model="settings.recurrence" class="custom-select">
                  <option value="unica">{{ t('recurrenceSingleOption') }}</option>
                  <option value="diaria">{{ t('recurrenceDailyOption') }}</option>
                  <option value="semanal">{{ t('recurrenceWeeklyOption') }}</option>
                  <option value="mensual">{{ t('recurrenceMonthlyOption') }}</option>
                </select>
                <svg class="select-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>

            <div class="button-container">
              <button class="btn-primary-action" @click="guardarConfiguracionGeneral">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                {{ t('saveConfigurationBtn') }}
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>
  </HeadingOwner>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.main-content-promos {
  --accent-amber: #f59e0b;
  --accent-amber-soft: rgba(245, 158, 11, 0.12);
  --accent-amber-border: rgba(245, 158, 11, 0.32);
  --accent-blue-soft: rgba(59, 130, 246, 0.12);
  --accent-blue-border: rgba(59, 130, 246, 0.32);

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(18px, 3vw, 30px);
  padding: clamp(16px, 3vw, 30px);
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--color-texto-general, #e5e5e5);
  font-family: 'Inter', sans-serif;
}

.highlight {
  color: var(--color-highlight, #3b82f6);
}

.promo-box-container {
  background: var(--bg-cards, rgba(18, 18, 18, 0.85));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.1));
  border-radius: var(--app-border-radius, 22px);
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
}

.promo-box-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--accent-amber), transparent);
}

.accent-blue::before {
  background: linear-gradient(90deg, transparent, var(--color-highlight, #3b82f6), transparent);
}

.box-header {
  background: var(--bg-cards, rgba(25, 25, 25, 0.5));
  padding: 22px 24px;
  text-align: left;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.06));
}

.header-top {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.header-icon-badge {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: var(--accent-amber-soft);
  border: 1px solid var(--accent-amber-border);
  color: var(--accent-amber);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon-badge.badge-blue {
  background: var(--accent-blue-soft);
  border-color: var(--accent-blue-border);
  color: var(--color-highlight, #3b82f6);
}

.header-icon-badge svg {
  width: 22px;
  height: 22px;
}

.header-text {
  min-width: 0;
}

.box-header h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  color: var(--color-titulos, #fff);
  font-size: clamp(1.25rem, 1rem + 1vw, 1.55rem);
  margin: 0 0 4px 0;
  letter-spacing: 0.2px;
  line-height: 1.2;
}

.box-subtitle {
  font-family: 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.8;
}

.box-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item-row {
  background: var(--bg-cards, rgba(25, 25, 25, 0.5));
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.06));
  border-radius: var(--app-border-radius, 14px);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
}

.item-row:hover {
  border-color: var(--color-highlight, rgba(59, 130, 246, 0.3));
  background: var(--bg-cards, rgba(30, 30, 30, 0.7));
}

.item-row.is-on {
  border-color: var(--accent-amber-border);
  background: linear-gradient(180deg, var(--accent-amber-soft), transparent 70%);
}

.vertical-layout {
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
}

.form-column-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.item-info.full-width {
  width: 100%;
}

.text-grow {
  flex-grow: 1;
  min-width: 0;
}

.icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-tag {
  width: 20px;
  height: 20px;
  color: var(--color-highlight, #3b82f6);
}

.item-info h4 {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.02rem;
  font-weight: 600;
  margin: 0 0 2px 0;
  letter-spacing: 0.2px;
}

.item-info p {
  font-family: 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
}

/* Toggle switch */
.toggle-switch {
  position: relative;
  display: inline-flex;
  width: 48px;
  height: 28px;
  flex-shrink: 0;
  cursor: pointer;
}

.toggle-switch input {
  position: absolute;
  inset: 0;
  opacity: 0;
  margin: 0;
  cursor: pointer;
  z-index: 1;
}

.toggle-track {
  position: absolute;
  inset: 0;
  background: var(--bg-input, #3f3f46);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.1));
  border-radius: 999px;
  transition: background 0.25s ease, border-color 0.25s ease;
}

.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toggle-switch input:checked + .toggle-track {
  background: var(--accent-amber);
  border-color: var(--accent-amber);
}

.toggle-switch input:checked + .toggle-track .toggle-knob {
  transform: translateX(20px);
}
:deep(.notification-container),
:deep(.toast-container) {
  width: calc(100% - 32px) !important;
  max-width: 480px !important;
  box-sizing: border-box !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  right: auto !important;
  margin: 0 auto !important;
}

.toggle-switch input:focus-visible + .toggle-track {
  box-shadow: 0 0 0 3px var(--accent-amber-soft);
}

/* Grace period */
.grace-period-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-input, rgba(15, 15, 15, 0.6));
  padding: 10px 16px;
  border-radius: var(--app-border-radius, 12px);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.08));
}

.btn-counter {
  width: 36px;
  height: 36px;
  border-radius: var(--app-border-radius, 10px);
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, #fff);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.2s, transform 0.1s, opacity 0.2s;
}

.btn-counter:hover:not(:disabled) { filter: brightness(1.1); }
.btn-counter:active:not(:disabled) { transform: scale(0.92); }
.btn-counter:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-counter svg { width: 16px; height: 16px; }

.days-display-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
  min-width: 64px;
}

.days-display {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-texto-general, #fff);
}

.days-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: var(--color-texto-general, #94a3b8);
  opacity: 0.75;
}

.grace-pips {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  padding: 0 4px;
}

.pip {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-amber);
  opacity: 0.9;
}

.pip-overflow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
  color: var(--accent-amber);
  font-weight: 600;
}

/* Form fields */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.input-group label {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-etiquetas, var(--color-texto-general, #cbd5e1));
  font-size: 0.88rem;
  font-weight: 600;
  letter-spacing: 0.2px;
}

.fine-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.select-wrap {
  position: relative;
}

.custom-select, .custom-input {
  background: var(--bg-input, rgba(20, 20, 20, 0.8));
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  padding: 11px 14px;
  font-family: 'Inter', sans-serif;
  outline: none;
  font-size: 0.92rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.custom-input.mono {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
}

.custom-select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 38px;
  cursor: pointer;
}

.select-chevron {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-texto-general, #94a3b8);
  pointer-events: none;
}

.custom-select:focus, .custom-input:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-money-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.currency-symbol {
  position: absolute;
  left: 14px;
  color: var(--color-highlight, #94a3b8);
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
  font-size: 0.95rem;
}

.input-money-wrapper .custom-input {
  padding-left: 32px;
}

.fine-ratio-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 2px;
}

.fine-ratio-track {
  flex: 1;
  height: 8px;
  border-radius: 999px;
  background: var(--bg-input, rgba(255, 255, 255, 0.08));
  overflow: hidden;
}

.fine-ratio-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--color-highlight, #3b82f6), var(--accent-amber));
  transition: width 0.4s ease;
}

.fine-ratio-label {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.75rem;
  color: var(--color-texto-general, #94a3b8);
  min-width: 36px;
  text-align: right;
}

.button-container {
  margin-top: 6px;
}

.btn-primary-action {
  padding: 12px;
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 10px);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.btn-primary-action svg {
  width: 18px;
  height: 18px;
}

.btn-primary-action:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(59, 130, 246, 0.4);
}

.btn-primary-action:active { transform: scale(0.98); }

@media (max-width: 900px) {
  .main-content-promos {
    flex-direction: column;
    align-items: center;
  }

  .promo-box-container {
    max-width: 100%;
    height: auto !important;
  }
}

@media (max-width: 480px) {
  .box-header {
    padding: 18px;
  }

  .box-content {
    padding: 16px;
  }

  .grace-period-control {
    padding: 8px 12px;
  }

  .btn-counter {
    width: 40px;
    height: 40px;
  }

  .toggle-switch {
    width: 46px;
    height: 27px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .item-row, .btn-counter, .toggle-track, .toggle-knob, .btn-primary-action, .fine-ratio-fill {
    transition: none !important;
  }
}
</style>
<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import HeadingRecepcion from '../HeadingRecepcion.vue';
import Promo from './Promos.vue';
import ReciboPago from './ReciboPago.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';
import { traducciones } from '../i18n.js';

const currentLang = ref(localStorage.getItem('Recepcion-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const localStrings = {
  es: {
    confirmBeforeDownload: 'Primero confirma el pago para generar el recibo.',
    receiptReadyToast: 'Recibo generado. Descárgalo en PNG o PDF.'
  },
  en: {
    confirmBeforeDownload: 'Confirm the payment first to generate the receipt.',
    receiptReadyToast: 'Receipt ready. Download it as PNG or PDF.'
  }
};
const lt = (key) => localStrings[currentLang.value]?.[key] || localStrings.es[key] || key;

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

const router = useRouter();
const activeModal = ref(null);
const toastRef = ref(null);
const reciboRef = ref(null);

const clienteActual = 'José Luis Ramírez';

const montoRecibir = ref(null);
const tipoPago = ref('');
const folioReferencia = ref('');
const ofertaSeleccionada = ref(null);

const ultimoPago = ref(null);
const reciboVisible = ref(false);

// Fechas calculadas automáticamente por el sistema
const fechaProximoCorte = computed(() => {
  const hoy = new Date();
  return hoy.toISOString().slice(0, 10);
});

const fechaNuevoCorte = computed(() => {
  const fecha = new Date();
  const meses = ofertaSeleccionada.value?.meses || 1;
  fecha.setMonth(fecha.getMonth() + meses);
  return fecha.toISOString().slice(0, 10);
});

// Watcher para manejar el folio cuando el pago es en efectivo
watch(tipoPago, (nuevoTipo) => {
  if (nuevoTipo === 'Efectivo') {
    folioReferencia.value = generarFolio();
  } else if (folioReferencia.value.startsWith('OP-')) {
    // Si cambia de efectivo a otro método, se puede limpiar o dejar
    folioReferencia.value = '';
  }
});

const isButtonDisabled = computed(() => !montoRecibir.value || montoRecibir.value <= 100 || !tipoPago.value);
const reciboLocale = computed(() => (currentLang.value === 'en' ? 'en-US' : 'es-MX'));

const handleSelectOferta = (oferta) => {
  ofertaSeleccionada.value = oferta;
  montoRecibir.value = oferta.precio;
  activeModal.value = null;
  if (toastRef.value) {
    toastRef.value.notify(`${t('offerAppliedToast')} ${oferta.nombre}`, 'success');
  }
};

const generarFolio = () => `OP-${Date.now().toString().slice(-8)}`;

const confirmPayment = () => {
  if (!tipoPago.value) {
    if (toastRef.value) toastRef.value.notify(t('selectPaymentTypeError'), 'error');
    return;
  }
  if (isButtonDisabled.value) {
    if (toastRef.value) toastRef.value.notify(t('amountGreaterThanError'), 'error');
    return;
  }

  // Si es efectivo y no tiene folio, se genera uno automáticamente
  if (tipoPago.value === 'Efectivo' && !folioReferencia.value) {
    folioReferencia.value = generarFolio();
  }

  ultimoPago.value = {
    folio: folioReferencia.value ? folioReferencia.value : generarFolio(),
    fecha: new Date().toISOString().slice(0, 10),
    cliente: clienteActual,
    metodo: tipoPago.value,
    monto: Number(montoRecibir.value),
    concepto: ofertaSeleccionada.value ? 'membership' : 'monthly',
    plan: ofertaSeleccionada.value ? ofertaSeleccionada.value.nombre : t('monthlyOption')
  };

  if (toastRef.value) toastRef.value.notify(t('paymentConfirmedToast'), 'success');
};

const downloadReceipt = () => {
  if (!ultimoPago.value) {
    if (toastRef.value) toastRef.value.notify(lt('confirmBeforeDownload'), 'error');
    return;
  }
  reciboVisible.value = true;
};

const handleReciboNotify = (payload) => {
  if (toastRef.value && payload) toastRef.value.notify(payload.message, payload.type);
};
</script>

<template>
  <HeadingRecepcion>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <!-- Columna Izquierda: Tarjeta de Perfil -->
      <div class="profile-card-container">
        <div class="profile-card glass-effect floating-animation">
          <h1 class="main-title">JOSÉ LUIS <br> <span class="highlight">RAMÍREZ</span></h1>

          <div class="avatar-wrapper">
            <span class="avatar-ring"></span>
            <div class="avatar-circle">
              <img src="../../../assets/humano.jpg" :alt="t('userAvatarAlt')" class="user-avatar-img" />
            </div>
          </div>

          <p class="user-id">ID: GymPer001</p>

          <div class="status-badge">
            <span class="status-dot"></span>
            {{ t('statusActive') }}
          </div>
        </div>
      </div>

      <!-- Columna Derecha: Panel de Operaciones / Pago -->
      <div class="right-column">
        <div id="tutorial-step-0" class="input-group search-bar-half">
          <label>{{ t('searchClientLabel') }}</label>
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" :placeholder="t('searchClientPlaceholder')">
          </div>
        </div>

        <div id="tutorial-step-1" class="login-card glass-effect">
          <div class="form-grid">
            <div class="input-group">
              <label>{{ t('nextCutLabel') }}</label>
              <input type="date" class="custom-input" :value="fechaProximoCorte" disabled>
            </div>
            <div class="input-group">
              <label>{{ t('newCutLabel') }}</label>
              <input type="date" class="custom-input" :value="fechaNuevoCorte" disabled>
            </div>
          </div>

          <div class="header-row">
            <div class="input-group-label">{{ t('accountStatusLabel') }}</div>
            <button class="btn-promos" type="button" @click="activeModal = 'promo'">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
              </svg>
              {{ t('promosBtn') }}
            </button>
          </div>

          <div class="styled-box">
          <div class="amount-info">
            <span class="amount-label">{{ t('totalToPayLabel') }}</span>
            <div class="amount-row">
              <span class="currency">$</span>
              <span class="amount-val">{{ montoRecibir ? Number(montoRecibir).toFixed(2) : '450.00' }}</span>
            </div>
          </div>
          <div class="recargo-container">
            <span class="red">+ $50 {{ t('surchargeLabel') }}</span>
            <span class="mensual-text">{{ ofertaSeleccionada ? ofertaSeleccionada.nombre : t('monthlyOption') }}</span>
          </div>
        </div>

          <!-- Sección Tipo de Pago y Folio -->
          <div class="payment-details-grid">
            <div class="input-group">
              <label>{{ t('paymentTypeLabel') }}</label>
              <div class="input-wrapper select-wrapper-container">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <select v-model="tipoPago" class="custom-select">
                  <option disabled value="">{{ t('selectOption') }}</option>
                  <option value="Efectivo">{{ t('cashOption') }}</option>
                  <option value="Transferencia">{{ t('transferOption') }}</option>
                  <option value="Tarjeta">{{ t('cardOption') }}</option>
                </select>
                <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div class="input-group">
              <label>{{ t('folioReferenceLabel') }}</label>
              <div class="input-wrapper input-with-icon-simple">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <input 
                  type="text" 
                  v-model="folioReferencia" 
                  :placeholder="t('voucherPlaceholder')"
                  :disabled="tipoPago === 'Efectivo'"
                  :class="{ 'disabled': tipoPago === 'Efectivo' }"
                >
              </div>
            </div>
          </div>

          <div class="input-group">
            <label>{{ t('amountToReceiveLabel') }}</label>
            <div class="input-with-symbol">
              <span class="symbol">$</span>
              <input type="number" v-model="montoRecibir" placeholder="0.00" class="mono">
            </div>
          </div>

          <div id="tutorial-step-2" class="action-buttons">
            <button class="btn-primary" :disabled="isButtonDisabled" :class="{ 'disabled': isButtonDisabled }" @click="confirmPayment">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M20 6 9 17l-5-5"/></svg>
              {{ t('confirmPaymentBtn') }}
            </button>

            <button class="btn-secondary" :class="{ 'is-ready': ultimoPago }" @click="downloadReceipt">
              <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon" width="16" height="16">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              {{ t('downloadReceiptBtn') }}
              <span v-if="ultimoPago" class="ready-dot" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <transition name="pop">
      <div v-if="activeModal === 'promo'" class="modal-wrapper" @click.self="activeModal = null">
        <Promo @select-oferta="handleSelectOferta" @close="activeModal = null" />
      </div>
    </transition>

    <ReciboPago
      ref="reciboRef"
      :visible="reciboVisible"
      :pago="ultimoPago"
      :locale="reciboLocale"
      @close="reciboVisible = false"
      @notify="handleReciboNotify"
    />
  </HeadingRecepcion>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');

.main-content {
  display: grid;
  grid-template-columns: 360px minmax(0, 540px);
  align-items: start;
  justify-content: center;
  gap: 32px;
  padding: 32px clamp(20px, 5vw, 60px);
  min-height: 80vh;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  max-width: 1100px;
  margin: 0 auto;
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

@keyframes floatCard {
  0% { transform: translateY(0px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.1); }
  50% { transform: translateY(-10px); box-shadow: 0 30px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.25); }
  100% { transform: translateY(0px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.1); }
}

.floating-animation {
  animation: floatCard 4s ease-in-out infinite;
}

.profile-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.profile-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.85));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 28px);
  padding: 36px 28px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  will-change: transform;
  position: relative;
  overflow: hidden;
}

.profile-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-highlight, #3b82f6), transparent);
}

.main-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: clamp(1.6rem, 1.3rem + 1vw, 1.9rem);
  color: var(--color-titulos, #fff);
  margin: 0 0 24px 0;
  line-height: 1.15;
  letter-spacing: 0.3px;
}

.highlight {
  color: var(--color-highlight, #3b82f6);
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 20px;
  width: 170px;
  height: 170px;
}

.avatar-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1.5px dashed rgba(59, 130, 246, 0.4);
  animation: spin 18s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.avatar-circle {
  width: 170px;
  height: 170px;
  background: var(--bg-input, #09090b);
  border-radius: 50%;
  border: 3px solid var(--color-highlight, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.3);
  overflow: hidden;
  position: relative;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  background: #22c55e;
  padding: 8px 26px;
  border-radius: 999px;
  font-weight: 700;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.9rem;
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.35);
  letter-spacing: 0.6px;
  text-transform: uppercase;
  margin-top: 4px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.35);
}

.user-id {
  margin: 0 0 16px 0;
  color: var(--color-texto-secundario, #94a3b8);
  font-weight: 500;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.search-bar-half {
  width: 100%;
  max-width: 280px;
  align-self: flex-end;
  margin-bottom: 0;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--color-texto-secundario, #71717a);
  pointer-events: none;
}

.search-input-wrapper input {
  padding-left: 36px !important;
}

.login-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.7));
  backdrop-filter: blur(20px);
  padding: 24px;
  border-radius: var(--app-border-radius, 24px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  position: relative;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--color-highlight, #3b82f6), transparent);
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(6px);
  padding: 16px;
  box-sizing: border-box;
}

.pop-enter-active, .pop-leave-active {
  transition: opacity 0.3s ease;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
}

.btn-promos {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid var(--color-highlight, #3b82f6);
  color: var(--color-highlight, #3b82f6);
  border-radius: 999px;
  padding: 5px 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: 0.25s;
}

.btn-promos:hover {
  background: rgba(59, 130, 246, 0.16);
}

.btn-primary {
  padding: 15px 36px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 12px);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.02rem;
  cursor: pointer;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 16px rgba(28, 79, 214, 0.4);
  width: 100%;
}

.btn-primary.disabled {
  background: #3a3a3f;
  color: #8a8a8f;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  width: 100%;
  padding: 14px;
  background: transparent;
  border: 1px solid var(--color-highlight, #3b82f6);
  color: var(--color-highlight, #3b82f6);
  border-radius: var(--app-border-radius, 12px);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.btn-secondary:hover {
  background: rgba(59, 130, 246, 0.06);
}

.btn-secondary.is-ready {
  border-color: #22c55e;
  color: #22c55e;
}

.btn-secondary.is-ready:hover {
  background: rgba(34, 197, 94, 0.08);
}

.ready-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.25);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 25px;
}

.payment-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 5px;
}

.select-wrapper-container, .input-with-icon-simple {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--color-texto-secundario, #71717a);
  pointer-events: none;
  z-index: 2;
}

.custom-select {
  width: 100%;
  background: var(--bg-cards, #141414);
  border: 1px solid var(--border-input, #333);
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  padding: 11px 32px 11px 36px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  text-overflow: ellipsis;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.custom-select:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.custom-select option {
  background-color: #18181b;
  color: #fff;
  padding: 8px;
}

.select-arrow {
  position: absolute;
  right: 12px;
  color: var(--color-texto-secundario, #71717a);
  pointer-events: none;
}

.input-with-icon-simple input {
  width: 100%;
  background: var(--bg-cards, #141414);
  border: 1px solid var(--border-input, #333);
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  padding: 11px 11px 11px 36px !important;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-with-icon-simple input:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-with-symbol {
  display: flex;
  align-items: center;
  background: var(--bg-cards, #141414);
  border: 1px solid var(--border-input, #333);
  border-radius: var(--app-border-radius, 10px);
  padding: 0 15px;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-with-symbol:focus-within {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-with-symbol .symbol {
  color: var(--color-texto-general, #fff);
  font-size: 1.2rem;
  font-weight: bold;
  margin-right: 8px;
  font-family: 'IBM Plex Mono', monospace;
}

.input-with-symbol input {
  background: transparent;
  border: none;
  padding: 15px 0;
  font-size: 1.2rem;
  color: var(--color-texto-general, #fff);
  width: 100%;
  outline: none;
}

.input-with-symbol input.mono {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.input-group label, .input-group-label {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 14px;
  font-weight: 600;
}

input:not(.input-with-symbol input, .input-with-icon-simple input) {
  background: var(--bg-cards, #141414);
  border: 1px solid var(--border-input, #333);
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-general, #fff);
  padding: 11px;
  font-family: 'Inter', sans-serif;
  outline: none;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input:not(.input-with-symbol input, .input-with-icon-simple input):focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.styled-box {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), var(--bg-cards, #141414) 55%);
  border: 1px solid rgba(59, 130, 246, 0.25);
  border-radius: var(--app-border-radius, 12px);
  padding: 16px 18px;
  display: flex;
  align-items: flex-end; /* <--- Cambiar de center a flex-end */
  justify-content: space-between;
  color: var(--color-texto-general, #fff);
  margin-bottom: 20px;
}

.amount-info {
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: 0.72rem;
  color: var(--color-texto-secundario, #94a3b8);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 3px;
}

.amount-row {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.currency {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-texto-general, #ffffff);
  font-family: 'IBM Plex Mono', monospace;
}

.amount-val {
  font-size: 1.85rem;
  font-weight: 600;
  color: var(--color-texto-general, #ffffff);
  letter-spacing: 0.2px;
  line-height: 1;
  font-family: 'IBM Plex Mono', monospace;
}

.recargo-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.red {
  color: #f87171;
  font-weight: 700;
  font-size: 0.85rem;
  font-family: 'IBM Plex Mono', monospace;
}

.mensual-text {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-titulos, #fff);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

@media (hover: hover) {
  .btn-primary:hover:not(:disabled),
  .btn-secondary:hover,
  .btn-promos:hover {
    transform: scale(1.03);
  }
}

.btn-primary:active:not(:disabled),
.btn-secondary:active,
.btn-promos:active {
  transform: scale(0.96);
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 16px;
    max-width: 100%;
  }
  .profile-card-container,
  .profile-card {
    width: 100%;
    max-width: 100%;
  }
  .profile-card {
    padding: 26px 18px;
  }
  .right-column {
    width: 100%;
    max-width: 100%;
  }
  .search-bar-half {
    width: 100%;
    max-width: 100%;
    align-self: center;
  }
  .form-grid, .payment-details-grid {
    grid-template-columns: 1fr;
  }
  .login-card {
    padding: 18px;
  }
  .styled-box {
    padding: 12px 16px;
    margin-bottom: 14px;
  }
  .amount-val {
    font-size: 1.5rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .floating-animation, .avatar-ring {
    animation: none !important;
  }
}
</style>
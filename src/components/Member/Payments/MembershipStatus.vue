<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';
import HeadingMember from '../HeadingMember.vue';

/* ---------------- IDIOMA (es/en) ----------------
   Mismo patrón que el resto de vistas de Member: localStorage + evento
   global 'idioma-changed'. Autocontenido, sin depender de rutas de
   import inciertas. */
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');
const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) currentLang.value = e.detail.idioma;
};
onMounted(() => window.addEventListener('idioma-changed', handleLangChange));
onUnmounted(() => window.removeEventListener('idioma-changed', handleLangChange));

const traducciones = {
  es: {
    pageTitlePrefix: 'Mi',
    pageTitleHighlight: 'Membresía',
    pageSubtitle: 'Consulta tu estado de cuenta y paga tu mensualidad de forma segura.',
    statusActive: 'ACTIVA',
    statusExpiringSoon: 'POR VENCER',
    statusExpired: 'VENCIDA',
    daysRemaining: 'días restantes',
    daysOverdue: 'días de atraso',
    dueDate: 'Vence el',
    reviewPill: 'Transferencia en revisión',
    choosePlan: 'Elige tu plan',
    save: 'AHORRA',
    totalToPay: 'Total a pagar',
    surcharge: 'recargo por atraso',
    paymentMethod: 'Método de pago',
    selectOption: 'Selecciona una opción',
    cardOption: 'Tarjeta de crédito / débito',
    transferOption: 'Transferencia bancaria',
    cardNumberLabel: 'Número de tarjeta',
    expiryLabel: 'Vencimiento',
    cvvLabel: 'CVV',
    viewBankDetailsBtn: 'Ver datos para depósito',
    bankDetailsTitle: 'Datos bancarios',
    bankDetailsSubtitle: 'Realiza tu depósito o transferencia a esta cuenta',
    bankNameLabel: 'Banco',
    accountHolderLabel: 'Titular',
    accountNumberLabel: 'Número de cuenta',
    clabeLabel: 'CLABE interbancaria',
    conceptLabel: 'Concepto',
    copyBtn: 'Copiar',
    copiedToast: 'Copiado al portapapeles',
    closeBtn: 'Cerrar',
    gotItBtn: 'Ya tengo los datos',
    transferReferenceLabel: 'Folio de tu transferencia',
    transferReferencePlaceholder: 'Ej. 00123456',
    transferNote: 'Después de depositar, ingresa el folio del comprobante para que el gimnasio verifique tu pago.',
    submitTransferBtn: 'Enviar comprobante',
    payButton: 'Pagar mensualidad',
    processingLabel: 'Procesando…',
    selectPaymentTypeError: 'Selecciona un método de pago',
    formInvalidError: 'Revisa los datos de pago antes de continuar',
    folioRequiredError: 'Ingresa el folio de tu transferencia',
    paymentConfirmedToast: 'Pago confirmado',
    transferPendingToast: 'Comprobante enviado. Tu pago quedará pendiente de verificación por el gimnasio.',
    cashNote: 'Los pagos en efectivo se registran directamente en recepción.',
  },
  en: {
    pageTitlePrefix: 'My',
    pageTitleHighlight: 'Membership',
    pageSubtitle: 'Check your account status and pay your membership securely.',
    statusActive: 'ACTIVE',
    statusExpiringSoon: 'EXPIRING SOON',
    statusExpired: 'EXPIRED',
    daysRemaining: 'days remaining',
    daysOverdue: 'days overdue',
    dueDate: 'Due on',
    reviewPill: 'Transfer under review',
    choosePlan: 'Choose your plan',
    save: 'SAVE',
    totalToPay: 'Total to pay',
    surcharge: 'late fee',
    paymentMethod: 'Payment method',
    selectOption: 'Select an option',
    cardOption: 'Credit / debit card',
    transferOption: 'Bank transfer',
    cardNumberLabel: 'Card number',
    expiryLabel: 'Expiry',
    cvvLabel: 'CVV',
    viewBankDetailsBtn: 'View deposit details',
    bankDetailsTitle: 'Bank details',
    bankDetailsSubtitle: 'Make your deposit or transfer to this account',
    bankNameLabel: 'Bank',
    accountHolderLabel: 'Account holder',
    accountNumberLabel: 'Account number',
    clabeLabel: 'CLABE / IBAN',
    conceptLabel: 'Reference concept',
    copyBtn: 'Copy',
    copiedToast: 'Copied to clipboard',
    closeBtn: 'Close',
    gotItBtn: 'I have the details',
    transferReferenceLabel: 'Your transfer reference',
    transferReferencePlaceholder: 'e.g. 00123456',
    transferNote: 'After depositing, enter the receipt reference so the gym can verify your payment.',
    submitTransferBtn: 'Submit proof of payment',
    payButton: 'Pay membership',
    processingLabel: 'Processing…',
    selectPaymentTypeError: 'Select a payment method',
    formInvalidError: 'Check your payment details before continuing',
    folioRequiredError: 'Enter your transfer reference',
    paymentConfirmedToast: 'Payment confirmed',
    transferPendingToast: 'Proof submitted. Your payment will be pending verification by the gym.',
    cashNote: 'Cash payments are registered directly at the front desk.',
  },
};

const t = computed(() => traducciones[currentLang.value] || traducciones.es);

const toastRef = ref(null);

// --- Datos del socio (reemplazar por fetch real / store) ---
const socio = reactive({
  nombre: 'ANA SOFÍA',
  apellido: 'TORRES',
  id: 'GymAth045',
});

const iniciales = computed(() => {
  const a = socio.nombre?.trim()?.[0] || '';
  const b = socio.apellido?.trim()?.[0] || '';
  return (a + b).toUpperCase();
});

// --- Estado de membresía ---
const fechaVencimiento = ref(new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)); // demo: vence en 6 días
const duracionCicloDias = ref(30);
const transferenciaEnRevision = ref(false);

const diasRestantes = computed(() => {
  const ms = fechaVencimiento.value.getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
});

const estadoMembresia = computed(() => {
  if (diasRestantes.value < 0) return { label: t.value.statusExpired, color: '#ef4444' };
  if (diasRestantes.value <= 5) return { label: t.value.statusExpiringSoon, color: '#f59e0b' };
  return { label: t.value.statusActive, color: '#4ade80' };
});

const localeActual = computed(() => (currentLang.value === 'en' ? 'en-US' : 'es-MX'));
const fechaFormateada = computed(() =>
  fechaVencimiento.value.toLocaleDateString(localeActual.value, { day: '2-digit', month: 'short', year: 'numeric' })
);

// --- Anillo de progreso (elemento visual: cuenta regresiva del ciclo) ---
const RADIO = 54;
const CIRCUNFERENCIA = 2 * Math.PI * RADIO;
const progresoRestante = computed(() => {
  const pct = Math.min(1, Math.max(0, diasRestantes.value / duracionCicloDias.value));
  return pct;
});
const dashOffset = computed(() => CIRCUNFERENCIA * (1 - progresoRestante.value));

// --- Planes disponibles ---
const planesBase = [
  { id: 'mensual', nombreEs: 'Mensual', nombreEn: 'Monthly', precio: 450, dias: 30, ahorro: null },
  { id: 'trimestral', nombreEs: 'Trimestral', nombreEn: 'Quarterly', precio: 1230, dias: 90, ahorro: '10%' },
  { id: 'semestral', nombreEs: 'Semestral', nombreEn: 'Biannual', precio: 2250, dias: 180, ahorro: '17%' },
  { id: 'anual', nombreEs: 'Anual', nombreEn: 'Annual', precio: 4050, dias: 365, ahorro: '25%' },
];
const planes = computed(() =>
  planesBase.map(p => ({ ...p, nombre: currentLang.value === 'en' ? p.nombreEn : p.nombreEs }))
);
const planSeleccionado = ref('mensual');
const plan = computed(() => planes.value.find(p => p.id === planSeleccionado.value));

const recargoPorVencida = computed(() => (diasRestantes.value < 0 ? 50 : 0));
const totalAPagar = computed(() => (plan.value ? plan.value.precio + recargoPorVencida.value : 0));

// --- Método de pago ---
const tipoPago = ref('');
const numeroTarjeta = ref('');
const vencimientoTarjeta = ref('');
const cvvTarjeta = ref('');
const folioTransferencia = ref('');
const modalDatosBancarios = ref(false);
const campoCopiado = ref('');

const numeroTarjetaFormateado = computed({
  get: () => numeroTarjeta.value,
  set: (val) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    numeroTarjeta.value = digits.replace(/(.{4})/g, '$1 ').trim();
  }
});

// --- Datos bancarios reales para depósito (reemplazar por los del gimnasio) ---
const datosBancarios = computed(() => ({
  banco: 'BBVA',
  titular: 'Iron Fit Gym S.A. de C.V.',
  cuenta: '0123456789',
  clabe: '012180001234567895',
  concepto: `Mensualidad ${socio.id}`,
}));

const copiarDato = async (valor, campo) => {
  try {
    await navigator.clipboard.writeText(valor);
  } catch {
    const temp = document.createElement('textarea');
    temp.value = valor;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand('copy');
    document.body.removeChild(temp);
  }
  campoCopiado.value = campo;
  toastRef.value?.notify(t.value.copiedToast, 'success');
  setTimeout(() => { if (campoCopiado.value === campo) campoCopiado.value = ''; }, 1500);
};

const procesando = ref(false);

const formularioTarjetaValido = computed(() =>
  numeroTarjeta.value.replace(/\s/g, '').length === 16
  && vencimientoTarjeta.value.length === 5
  && cvvTarjeta.value.length >= 3
);

const seleccionarPlan = (id) => {
  planSeleccionado.value = id;
};

// Pago con tarjeta: se procesa (simulado) y se refleja de inmediato.
const pagarConTarjeta = () => {
  if (!formularioTarjetaValido.value) {
    toastRef.value?.notify(t.value.formInvalidError, 'error');
    return;
  }
  procesando.value = true;
  setTimeout(() => {
    procesando.value = false;
    aplicarRenovacion();
    numeroTarjeta.value = '';
    vencimientoTarjeta.value = '';
    cvvTarjeta.value = '';
    tipoPago.value = '';
    toastRef.value?.notify(`${t.value.paymentConfirmedToast} · ${plan.value.nombre}`, 'success');
  }, 1100);
};

// Transferencia: es un pago real fuera de la app. Aquí solo se registra el
// folio del comprobante; el estado queda "en revisión" hasta que el
// gimnasio lo concilie con el depósito recibido (ver panel de Owner).
const enviarComprobanteTransferencia = () => {
  if (!folioTransferencia.value.trim()) {
    toastRef.value?.notify(t.value.folioRequiredError, 'error');
    return;
  }
  procesando.value = true;
  setTimeout(() => {
    procesando.value = false;
    transferenciaEnRevision.value = true;
    folioTransferencia.value = '';
    tipoPago.value = '';
    toastRef.value?.notify(t.value.transferPendingToast, 'success');
  }, 900);
};

const aplicarRenovacion = () => {
  const base = diasRestantes.value < 0 ? new Date() : fechaVencimiento.value;
  const nuevaFecha = new Date(base.getTime());
  nuevaFecha.setDate(nuevaFecha.getDate() + plan.value.dias);
  fechaVencimiento.value = nuevaFecha;
  duracionCicloDias.value = plan.value.dias;
};
</script>

<template>
    <HeadingMember>
          <NotificationSystem ref="toastRef" />

  <main class="main-content">
    <div class="page-container">

      <div class="view-header-flex">
        <div class="view-header">
          <h1 class="title">{{ t.pageTitlePrefix }} <span class="highlight-text">{{ t.pageTitleHighlight }}</span></h1>
          <span class="title-underline"></span>
          <p class="subtitle">{{ t.pageSubtitle }}</p>
        </div>
      </div>

      <div class="membership-grid">

        <!-- Columna Izquierda: Estado actual -->
        <div class="status-card">
          <div class="avatar-ring-wrapper">
            <svg class="progress-ring" viewBox="0 0 120 120">
              <circle class="progress-ring__bg" cx="60" cy="60" r="54" />
              <circle
                class="progress-ring__value"
                cx="60" cy="60" r="54"
                :style="{
                  stroke: estadoMembresia.color,
                  strokeDasharray: `${2 * Math.PI * 54}px`,
                  strokeDashoffset: `${dashOffset}px`
                }"
              />
            </svg>
            <div class="avatar-circle">
              <span class="avatar-initials">{{ iniciales }}</span>
            </div>
          </div>

          <h2 class="member-name">{{ socio.nombre }} <br> <span class="highlight-text">{{ socio.apellido }}</span></h2>
          <p class="user-id">ID: {{ socio.id }}</p>

          <div class="status-badge" :style="{ background: estadoMembresia.color }">
            {{ estadoMembresia.label }}
          </div>

          <div v-if="transferenciaEnRevision" class="review-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ t.reviewPill }}
          </div>

          <div class="dias-restantes">
            <span class="dias-numero" :style="{ color: estadoMembresia.color }">
              {{ diasRestantes >= 0 ? diasRestantes : 0 }}
            </span>
            <span class="dias-label">{{ diasRestantes >= 0 ? t.daysRemaining : t.daysOverdue }}</span>
          </div>

          <div class="vencimiento-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {{ t.dueDate }} {{ fechaFormateada }}
          </div>
        </div>

        <!-- Columna Derecha: Pago -->
        <div class="payment-card">
          <div class="section-subtitle-small"><span class="subtitle-dot"></span>{{ t.choosePlan }}</div>

          <div class="planes-grid">
            <button
              v-for="p in planes"
              :key="p.id"
              type="button"
              class="plan-chip"
              :class="{ active: planSeleccionado === p.id }"
              @click="seleccionarPlan(p.id)"
            >
              <span v-if="p.ahorro" class="plan-tag">{{ t.save }} {{ p.ahorro }}</span>
              <span class="plan-nombre">{{ p.nombre }}</span>
              <span class="plan-precio">${{ p.precio.toFixed(2) }}</span>
            </button>
          </div>

          <div class="styled-box">
            <div class="amount-info">
              <span class="amount-label">{{ t.totalToPay }}</span>
              <div class="amount-row">
                <span class="currency">$</span>
                <span class="amount-val">{{ totalAPagar.toFixed(2) }}</span>
              </div>
            </div>
            <div class="recargo-container">
              <span v-if="recargoPorVencida" class="red">+ $50 {{ t.surcharge }}</span>
              <span class="mensual-text">{{ plan?.nombre }}</span>
            </div>
          </div>

          <div class="input-group">
            <label>{{ t.paymentMethod }}</label>
            <div class="input-wrapper select-wrapper-container">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <select v-model="tipoPago" class="custom-select">
                <option disabled value="">{{ t.selectOption }}</option>
                <option value="Tarjeta">{{ t.cardOption }}</option>
                <option value="Transferencia">{{ t.transferOption }}</option>
              </select>
              <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <transition name="fade-slide">
            <!-- ===== Flujo tarjeta ===== -->
            <div v-if="tipoPago === 'Tarjeta'" class="card-fields">
              <div class="input-group">
                <label>{{ t.cardNumberLabel }}</label>
                <input type="text" v-model="numeroTarjetaFormateado" placeholder="0000 0000 0000 0000" maxlength="19" inputmode="numeric">
              </div>
              <div class="payment-details-grid">
                <div class="input-group">
                  <label>{{ t.expiryLabel }}</label>
                  <input type="text" v-model="vencimientoTarjeta" placeholder="MM/AA" maxlength="5">
                </div>
                <div class="input-group">
                  <label>{{ t.cvvLabel }}</label>
                  <input type="text" v-model="cvvTarjeta" placeholder="123" maxlength="4" inputmode="numeric">
                </div>
              </div>

              <div class="action-buttons">
                <button
                  class="btn-primary"
                  :disabled="!formularioTarjetaValido || procesando"
                  :class="{ disabled: !formularioTarjetaValido || procesando }"
                  @click="pagarConTarjeta"
                >
                  <span v-if="!procesando">{{ t.payButton }}</span>
                  <span v-else>{{ t.processingLabel }}</span>
                </button>
              </div>
            </div>

            <!-- ===== Flujo transferencia (real): ver datos → depositar → registrar folio ===== -->
            <div v-else-if="tipoPago === 'Transferencia'" class="card-fields">
              <button type="button" class="btn-bank-details" @click="modalDatosBancarios = true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="10" width="18" height="10" rx="1"></rect>
                  <path d="M3 10l9-6 9 6"></path>
                  <line x1="7" y1="14" x2="7" y2="16"></line>
                  <line x1="12" y1="14" x2="12" y2="16"></line>
                  <line x1="17" y1="14" x2="17" y2="16"></line>
                </svg>
                {{ t.viewBankDetailsBtn }}
              </button>

              <div class="input-group">
                <label>{{ t.transferReferenceLabel }}</label>
                <div class="input-wrapper input-with-icon-simple">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <input type="text" v-model="folioTransferencia" :placeholder="t.transferReferencePlaceholder">
                </div>
              </div>
              <p class="transfer-note">{{ t.transferNote }}</p>

              <div class="action-buttons">
                <button
                  class="btn-primary"
                  :disabled="!folioTransferencia.trim() || procesando"
                  :class="{ disabled: !folioTransferencia.trim() || procesando }"
                  @click="enviarComprobanteTransferencia"
                >
                  <span v-if="!procesando">{{ t.submitTransferBtn }}</span>
                  <span v-else>{{ t.processingLabel }}</span>
                </button>
              </div>
            </div>
          </transition>

          <p class="cash-note">{{ t.cashNote }}</p>
        </div>
      </div>
    </div>

    <!-- Modal: datos bancarios -->
    <transition name="pop">
      <div v-if="modalDatosBancarios" class="modal-wrapper" @click.self="modalDatosBancarios = false">
        <div class="bank-modal">
          <h3 class="bank-modal-title">{{ t.bankDetailsTitle }}</h3>
          <p class="bank-modal-subtitle">{{ t.bankDetailsSubtitle }}</p>

          <div class="bank-field">
            <div class="bank-field-info">
              <span class="bank-field-label">{{ t.bankNameLabel }}</span>
              <span class="bank-field-value">{{ datosBancarios.banco }}</span>
            </div>
          </div>
          <div class="bank-field">
            <div class="bank-field-info">
              <span class="bank-field-label">{{ t.accountHolderLabel }}</span>
              <span class="bank-field-value">{{ datosBancarios.titular }}</span>
            </div>
          </div>
          <div class="bank-field">
            <div class="bank-field-info">
              <span class="bank-field-label">{{ t.accountNumberLabel }}</span>
              <span class="bank-field-value mono">{{ datosBancarios.cuenta }}</span>
            </div>
            <button class="btn-copy" @click="copiarDato(datosBancarios.cuenta, 'cuenta')">
              {{ campoCopiado === 'cuenta' ? '✓' : t.copyBtn }}
            </button>
          </div>
          <div class="bank-field">
            <div class="bank-field-info">
              <span class="bank-field-label">{{ t.clabeLabel }}</span>
              <span class="bank-field-value mono">{{ datosBancarios.clabe }}</span>
            </div>
            <button class="btn-copy" @click="copiarDato(datosBancarios.clabe, 'clabe')">
              {{ campoCopiado === 'clabe' ? '✓' : t.copyBtn }}
            </button>
          </div>
          <div class="bank-field">
            <div class="bank-field-info">
              <span class="bank-field-label">{{ t.conceptLabel }}</span>
              <span class="bank-field-value mono">{{ datosBancarios.concepto }}</span>
            </div>
            <button class="btn-copy" @click="copiarDato(datosBancarios.concepto, 'concepto')">
              {{ campoCopiado === 'concepto' ? '✓' : t.copyBtn }}
            </button>
          </div>

          <div class="action-buttons">
            <button class="btn-primary" @click="modalDatosBancarios = false">{{ t.gotItBtn }}</button>
          </div>
        </div>
      </div>
    </transition>
  </main>
  </HeadingMember>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

* { box-sizing: border-box; }

.main-content {
  min-height: calc(100vh - 80px);
  background: transparent;
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  padding: 24px 32px;
  position: relative;
}

.page-container { max-width: 1100px; margin: 0 auto; }

.view-header-flex { display: flex; justify-content: space-between; align-items: flex-end; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
.view-header { flex: 1; min-width: 240px; }
.title { font-family: 'Anton', sans-serif; font-size: clamp(1.7rem, 5vw, 2.4rem); color: var(--color-titulos, #fff); margin: 0; letter-spacing: 1px; text-transform: uppercase; }
.highlight-text { color: var(--color-highlight, #3b82f6); }
.title-underline {
  display: block;
  width: 64px;
  height: 4px;
  margin: 4px 0 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-highlight, #3b82f6), transparent);
}
.subtitle { font-size: 0.85rem; color: rgba(245, 245, 244, 0.6); margin: 0; line-height: 1.4; font-weight: 400; }

@keyframes floatCard {
  0% { transform: translateY(0px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.1); }
  50% { transform: translateY(-10px); box-shadow: 0 30px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.25); }
  100% { transform: translateY(0px); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.1); }
}

.membership-grid {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 24px;
  align-items: start;
}

.status-card, .payment-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 24px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  position: relative;
}

.status-card {
  padding: 32px 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  animation: floatCard 4s ease-in-out infinite;
  will-change: transform;
}

.avatar-ring-wrapper { position: relative; width: 160px; height: 160px; margin-bottom: 20px; }
.progress-ring { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.progress-ring__bg { fill: none; stroke: rgba(255,255,255,0.08); stroke-width: 6; }
.progress-ring__value { fill: none; stroke-width: 6; stroke-linecap: round; transition: stroke-dashoffset 0.6s ease, stroke 0.3s ease; }

.avatar-circle {
  position: absolute;
  top: 10px; left: 10px; right: 10px; bottom: 10px;
  background: var(--bg-input, #09090b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.25);
}
.avatar-initials { font-family: 'Anton', sans-serif; font-size: 2.4rem; color: var(--color-highlight, #3b82f6); letter-spacing: 1px; }

.member-name { font-family: 'Anton', sans-serif; font-size: 1.6rem; color: var(--color-titulos, #fff); margin: 0 0 6px 0; line-height: 1.1; letter-spacing: 1px; text-transform: uppercase; }
.user-id { margin: 0 0 16px 0; color: rgba(245, 245, 244, 0.6); font-weight: 600; font-size: 0.9rem; letter-spacing: 0.5px; }

.status-badge {
  padding: 8px 28px;
  border-radius: var(--app-border-radius, 20px);
  font-weight: 700;
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  color: #ffffff;
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.review-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.35);
  padding: 5px 14px;
  border-radius: 20px;
  font-size: 0.72rem;
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 16px;
}

.dias-restantes { display: flex; flex-direction: column; align-items: center; margin-bottom: 14px; }
.dias-numero { font-family: 'Anton', sans-serif; font-size: 2.4rem; line-height: 1; }
.dias-label { font-family: 'Oswald', sans-serif; font-size: 0.82rem; color: rgba(245, 245, 244, 0.55); text-transform: uppercase; letter-spacing: 0.5px; }

.vencimiento-row { display: flex; align-items: center; gap: 6px; color: rgba(245, 245, 244, 0.6); font-size: 0.85rem; }

.payment-card { padding: 26px; }

.section-subtitle-small {
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-highlight, #3b82f6);
  margin-bottom: 12px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.subtitle-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-highlight, #3b82f6); box-shadow: 0 0 6px var(--color-highlight, #3b82f6); flex-shrink: 0; }

.planes-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }

.plan-chip {
  position: relative;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 10px);
  padding: 14px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-texto-general, #f5f5f4);
}
.plan-chip:hover { border-color: var(--color-highlight, #3b82f6); }
.plan-chip.active { border-color: var(--color-highlight, #3b82f6); background: rgba(59, 130, 246, 0.12); box-shadow: 0 0 0 1px var(--color-highlight, #3b82f6) inset; }

.plan-tag { position: absolute; top: -9px; font-size: 0.58rem; background: #4ade80; color: #052e16; padding: 2px 8px; border-radius: 20px; font-family: 'Oswald', sans-serif; letter-spacing: 0.5px; font-weight: 700; }
.plan-nombre { font-family: 'Oswald', sans-serif; font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.3px; }
.plan-precio { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.95rem; color: var(--color-highlight, #3b82f6); }

.styled-box {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 8px);
  padding: 14px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}
.amount-info { display: flex; flex-direction: column; }
.amount-label { font-size: 0.72rem; color: rgba(245, 245, 244, 0.55); font-family: 'Oswald', sans-serif; text-transform: uppercase; margin-bottom: 2px; }
.amount-row { display: flex; align-items: baseline; gap: 4px; }
.currency { font-size: 1.2rem; font-weight: 700; }
.amount-val { font-size: 1.8rem; font-weight: 800; letter-spacing: 0.5px; line-height: 1; }
.recargo-container { display: flex; flex-direction: column; align-items: flex-end; }
.red { color: #f87171; font-weight: 700; font-size: 0.82rem; }
.mensual-text { font-family: 'Oswald', sans-serif; font-size: 0.88rem; color: var(--color-titulos, #fff); }

.input-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; }
.input-group label { font-family: 'Oswald', sans-serif; color: var(--color-titulos, #fff); font-size: 13px; }

.select-wrapper-container, .input-with-icon-simple { position: relative; display: flex; align-items: center; width: 100%; }
.input-icon { position: absolute; left: 12px; color: rgba(245, 245, 244, 0.45); pointer-events: none; z-index: 2; }

.custom-select {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-line, rgba(255, 255, 255, 0.1));
  border-radius: var(--app-border-radius, 8px);
  color: var(--color-texto-general, #f5f5f4);
  padding: 10px 32px 10px 36px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  box-sizing: border-box;
}
.custom-select option { background-color: #18181b; color: #fff; }
.select-arrow { position: absolute; right: 12px; color: rgba(245, 245, 244, 0.45); pointer-events: none; }

.input-with-icon-simple input {
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-line, rgba(255, 255, 255, 0.1));
  border-radius: var(--app-border-radius, 8px);
  color: var(--color-texto-general, #f5f5f4);
  padding: 10px 10px 10px 36px !important;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

.card-fields input:not(.input-with-icon-simple input) {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid var(--border-line, rgba(255, 255, 255, 0.1));
  border-radius: var(--app-border-radius, 8px);
  color: var(--color-texto-general, #f5f5f4);
  padding: 10px;
  font-family: 'Inter', sans-serif;
  outline: none;
  width: 100%;
  box-sizing: border-box;
}

.payment-details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.btn-bank-details {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: var(--color-highlight, #3b82f6);
  border-radius: var(--app-border-radius, 10px);
  padding: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}
.btn-bank-details:hover { background: rgba(59, 130, 246, 0.18); }

.transfer-note { font-size: 0.78rem; color: rgba(245, 245, 244, 0.5); line-height: 1.4; margin: -6px 0 16px; }
.cash-note { font-size: 0.75rem; color: rgba(245, 245, 244, 0.4); text-align: center; margin: 18px 0 0; font-style: italic; }

.fade-slide-enter-active, .fade-slide-leave-active { transition: all 0.25s ease; }
.fade-slide-enter-from, .fade-slide-leave-to { opacity: 0; transform: translateY(-6px); }

.action-buttons { display: flex; flex-direction: column; gap: 10px; margin-top: 6px; }

.btn-primary {
  padding: 15px 32px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 12px);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 16px rgba(28, 79, 214, 0.4);
}
.btn-primary.disabled { background: #444; color: #888; cursor: not-allowed; box-shadow: none; }

@media (hover: hover) {
  .btn-primary:hover:not(:disabled) { transform: scale(1.03); }
  .plan-chip:hover { transform: translateY(-2px); }
}
.btn-primary:active:not(:disabled) { transform: scale(0.97); }

/* --- Modal datos bancarios --- */
.modal-wrapper {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(6px);
  padding: 16px;
}
.pop-enter-active, .pop-leave-active { transition: opacity 0.25s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; }

.bank-modal {
  width: 100%;
  max-width: 420px;
  background: var(--bg-cards, #141414);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.14));
  border-radius: var(--app-border-radius, 20px);
  padding: 26px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.7);
}
.bank-modal-title { font-family: 'Anton', sans-serif; color: var(--color-titulos, #fff); font-size: 1.3rem; margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.5px; }
.bank-modal-subtitle { font-size: 0.82rem; color: rgba(245, 245, 244, 0.55); margin: 0 0 20px; }

.bank-field {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 10px);
  padding: 10px 14px;
  margin-bottom: 10px;
}
.bank-field-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.bank-field-label { font-size: 0.68rem; color: rgba(245, 245, 244, 0.5); font-family: 'Oswald', sans-serif; text-transform: uppercase; letter-spacing: 0.4px; }
.bank-field-value { font-size: 0.92rem; color: var(--color-texto-general, #f5f5f4); font-weight: 600; overflow-wrap: anywhere; }
.bank-field-value.mono { font-family: 'Inter', monospace; letter-spacing: 0.5px; }

.btn-copy {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid var(--color-highlight, #3b82f6);
  color: var(--color-highlight, #3b82f6);
  border-radius: var(--app-border-radius, 8px);
  padding: 6px 12px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.75rem;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 44px;
}
.btn-copy:hover { background: rgba(59, 130, 246, 0.12); }

@media (max-width: 900px) {
  .membership-grid { grid-template-columns: 1fr; }
  .status-card { max-width: 420px; margin: 0 auto; width: 100%; }
}

@media (max-width: 640px) {
  .main-content { padding: 14px 12px; }
  .payment-card { padding: 18px; }
  .status-card { padding: 24px 18px; }
  .planes-grid { grid-template-columns: 1fr 1fr; }
  .payment-details-grid { grid-template-columns: 1fr; }
  .amount-val { font-size: 1.4rem; }
  .bank-modal { padding: 20px; }
}

@media (prefers-reduced-motion: reduce) {
  .status-card { animation: none; }
  .progress-ring__value { transition: none; }
}
</style>
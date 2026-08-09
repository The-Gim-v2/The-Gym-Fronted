<template>
  <div class="modal-container glass-card animate-pop">
    
    <!-- Encabezado del Modal -->
    <div class="modal-header">
      <div class="header-title-box">
        <div class="lock-badge-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        </div>
        <h2>{{ t('modalTitle') }}</h2>
      </div>
      <button class="close-btn" @click="$emit('close')">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    </div>

    <!-- Contenido General (Scrollable) -->
    <div class="modal-body-scroll">
      <div class="modal-grid-layout">
        
        <!-- COLUMNA IZQUIERDA: Métodos, Tarjeta y Formularios -->
        <div class="payment-methods-col">
          <p class="section-instruction">{{ t('step1Payment') }}</p>

          <!-- Selector de Métodos de Pago -->
          <div class="payment-tabs">
            <button class="pay-tab-btn" :class="{ active: paymentMethod === 'spei' }" @click="paymentMethod = 'spei'">SPEI</button>
            <button class="pay-tab-btn" :class="{ active: paymentMethod === 'card' }" @click="paymentMethod = 'card'">{{ t('payCard') }}</button>
            <button class="pay-tab-btn" :class="{ active: paymentMethod === 'oxxo' }" @click="paymentMethod = 'oxxo'">OXXO</button>
            <button class="pay-tab-btn" :class="{ active: paymentMethod === 'paypal' }" @click="paymentMethod = 'paypal'">PayPal</button>
          </div>

          <!-- TARJETA DE CRÉDITO ORIGINAL -->
          <div v-if="paymentMethod === 'card'" class="card-preview-wrapper-desktop">
            <div class="credit-card-desktop" :class="{ flipped: isCvvFocused }">
              <!-- Frente -->
              <div class="card-face card-front">
                <div class="card-top-row">
                  <div class="card-chip"></div>
                  <div class="card-brands-badges">
                    <span class="brand-badge active">VISA</span>
                    <span class="brand-badge">MC</span>
                    <span class="brand-badge">AMEX</span>
                  </div>
                </div>
                <div class="card-number-display">{{ formattedCardNumber }}</div>
                <div class="card-bottom-row">
                  <div class="card-info-group">
                    <span class="card-label-mini">{{ t('cardHolderLabel') }}</span>
                    <span class="card-value-mini">{{ cardName || 'NOMBRE APELLIDO' }}</span>
                  </div>
                  <div class="card-info-group text-right">
                    <span class="card-label-mini">{{ t('cardExpLabel') }}</span>
                    <span class="card-value-mini">{{ cardExp || 'MM/AA' }}</span>
                  </div>
                </div>
              </div>
              <!-- Reverso -->
              <div class="card-face card-back">
                <div class="card-black-stripe"></div>
                <div class="card-cvv-strip">
                  <span class="cvv-label-mini">{{ t('cardCvvLabel') }}</span>
                  <div class="cvv-value-box">{{ cardCvv || '•••' }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Formulario dinámico -->
          <div class="payment-form-container">
            
            <!-- SPEI / OXXO -->
            <div v-if="paymentMethod === 'spei' || paymentMethod === 'oxxo'" class="payment-subbox">
              <div class="info-pill-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                {{ paymentMethod === 'spei' ? t('speiInfo') : t('oxxoInfo') }}
              </div>
              <div v-if="paymentMethod === 'spei'" class="input-group">
                <label>{{ t('bankOrigin') }}</label>
                <select v-model="bankOrigin" class="custom-input">
                  <option value="" disabled>{{ t('selectBank') }}</option>
                  <option value="bbva">BBVA México</option>
                  <option value="santander">Santander</option>
                  <option value="azteca">Banco Azteca</option>
                  <option value="nu">Nu México</option>
                </select>
              </div>
              <div class="input-group">
                <label>{{ t('emailLabel') }}</label>
                <input type="email" v-model="userEmail" placeholder="tucorreo@dominio.com" class="custom-input" />
              </div>
            </div>

            <!-- TARJETA (Inputs con espacio holgado arriba y abajo) -->
            <div v-if="paymentMethod === 'card'" class="payment-subbox">
              <div class="input-group">
                <label>{{ t('inputCardHolder') }}</label>
                <input type="text" v-model="cardName" :placeholder="t('placeholderHolder')" class="custom-input" @focus="isCvvFocused = false" />
              </div>
              <div class="input-group">
                <label>{{ t('inputCardNumber') }}</label>
                <input type="text" v-model="cardNumber" maxlength="16" placeholder="0000 0000 0000 0000" class="custom-input" @focus="isCvvFocused = false" />
              </div>
              <div class="card-row-inputs">
                <div class="input-group">
                  <label>{{ t('inputCardExp') }}</label>
                  <input type="text" v-model="cardExp" maxlength="5" placeholder="MM/AA" class="custom-input" @focus="isCvvFocused = false" />
                </div>
                <div class="input-group">
                  <label>{{ t('inputCardCvv') }}</label>
                  <input type="password" v-model="cardCvv" maxlength="4" placeholder="123" class="custom-input" @focus="isCvvFocused = true" @blur="isCvvFocused = false" />
                </div>
              </div>
            </div>

            <!-- PAYPAL -->
            <div v-if="paymentMethod === 'paypal'" class="payment-subbox text-center-box">
              <p>{{ t('paypalDesc') }}</p>
            </div>

          </div>
        </div>

        <!-- COLUMNA DERECHA: Plan y Resumen -->
        <div class="summary-plan-col">
          <p class="section-instruction">{{ t('step2Plan') }}</p>

          <div class="plans-selector-box">
            <div class="plan-option-card" :class="{ active: selectedPlan === 'prueba' }" @click="selectedPlan = 'prueba'">
              <div class="radio-circle"><div v-if="selectedPlan === 'prueba'" class="radio-inner"></div></div>
              <div class="plan-info-text">
                <div class="plan-title-row">
                  <span class="p-name">{{ t('planFreeName') }}</span>
                  <span class="badge-days">{{ t('planFreeBadge') }}</span>
                </div>
                <span class="p-desc">{{ t('planFreeDesc') }}</span>
              </div>
              <span class="p-price">$0 <small>MXN</small></span>
            </div>

            <div class="plan-option-card" :class="{ active: selectedPlan === 'basica' }" @click="selectedPlan = 'basica'">
              <div class="radio-circle"><div v-if="selectedPlan === 'basica'" class="radio-inner"></div></div>
              <div class="plan-info-text">
                <span class="p-name">{{ t('planBasicName') }}</span>
                <span class="p-desc">{{ t('planBasicDesc') }}</span>
              </div>
              <span class="p-price">$650 <small>MXN/mes</small></span>
            </div>

            <div class="plan-option-card" :class="{ active: selectedPlan === 'intermedia' }" @click="selectedPlan = 'intermedia'">
              <div class="radio-circle"><div v-if="selectedPlan === 'intermedia'" class="radio-inner"></div></div>
              <div class="plan-info-text">
                <span class="p-name">{{ t('planInterName') }}</span>
                <span class="p-desc">{{ t('planInterDesc') }}</span>
              </div>
              <span class="p-price">$850 <small>MXN/mes</small></span>
            </div>

            <div class="plan-option-card" :class="{ active: selectedPlan === 'avanzada' }" @click="selectedPlan = 'avanzada'">
              <div class="radio-circle"><div v-if="selectedPlan === 'avanzada'" class="radio-inner"></div></div>
              <div class="plan-info-text">
                <span class="p-name">{{ t('planAdvName') }}</span>
                <span class="p-desc">{{ t('planAdvDesc') }}</span>
              </div>
              <span class="p-price">$1,200 <small>MXN/mes</small></span>
            </div>
          </div>

          <div class="summary-receipt-box">
            <div class="receipt-row">
              <span>{{ t('subtotalLabel') }}</span>
              <span class="receipt-val">{{ planPriceFormatted.subtotal }}</span>
            </div>
            <div class="receipt-row">
              <span>{{ t('taxLabel') }}</span>
              <span class="receipt-val">$0.00 MXN</span>
            </div>
            <div class="receipt-divider"></div>
            <div class="receipt-total-row">
              <span>{{ t('totalLabel') }}</span>
              <span class="total-highlight">{{ planPriceFormatted.total }}</span>
            </div>
          </div>

          <button class="btn-confirm-payment" @click="executePayment">
            {{ t('confirmBtn') }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';

const emit = defineEmits(['close']);
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');

const paymentMethod = ref('card');
const selectedPlan = ref('basica');
const bankOrigin = ref('');
const userEmail = ref('');

const cardNumber = ref('');
const cardName = ref('');
const cardExp = ref('');
const cardCvv = ref('');
const isCvvFocused = ref(false);

const formattedCardNumber = computed(() => {
  const clean = cardNumber.value.replace(/\D/g, '').padEnd(16, '•');
  return clean.match(/.{1,4}/g)?.join(' ') || '•••• •••• •••• ••••';
});

const planPriceFormatted = computed(() => {
  switch(selectedPlan.value) {
    case 'prueba': return { subtotal: '$0.00 MXN', total: '$0.00' };
    case 'basica': return { subtotal: '$650.00 MXN', total: '$650.00' };
    case 'intermedia': return { subtotal: '$850.00 MXN', total: '$850.00' };
    case 'avanzada': return { subtotal: '$1,200.00 MXN', total: '$1,200.00' };
    default: return { subtotal: '$0.00 MXN', total: '$0.00' };
  }
});

const executePayment = () => {
  alert(`¡Pago procesado con éxito! Plan: ${selectedPlan.value.toUpperCase()}`);
  emit('close');
};

const traducciones = {
  es: {
    modalTitle: 'Pasarela de Pago Segura',
    step1Payment: '1. Selecciona tu método de pago',
    payCard: 'Tarjeta',
    cardHolderLabel: 'TITULAR',
    cardExpLabel: 'EXPIRA',
    cardCvvLabel: 'CVV / CVC',
    speiInfo: 'Se generará una CLABE única para tu transferencia SPEI instantánea.',
    oxxoInfo: 'Se generará un código de barras para pagar en tiendas OXXO.',
    bankOrigin: 'Banco emisor',
    selectBank: 'Selecciona tu banco',
    emailLabel: 'Correo para tu comprobante',
    inputCardHolder: 'Nombre en la tarjeta',
    placeholderHolder: 'Ej. Juan Carlos Guzmán',
    inputCardNumber: 'Número de la tarjeta',
    inputCardExp: 'Caducidad',
    inputCardCvv: 'CVV / CVC',
    paypalDesc: 'Autoriza el cargo de tu membresía de forma segura desde PayPal.',
    step2Plan: '2. Resumen del Plan',
    planFreeName: 'Prueba Gratuita',
    planFreeBadge: '7 Días',
    planFreeDesc: 'Acceso completo sin tarjeta.',
    planBasicName: 'Básica',
    planBasicDesc: 'Funciones esenciales.',
    planInterName: 'Intermedia',
    planInterDesc: 'Capacidades ampliadas.',
    planAdvName: 'Avanzada',
    planAdvDesc: 'Herramientas robustas.',
    subtotalLabel: 'Subtotal',
    taxLabel: 'Impuestos (IVA 16% incl.)',
    totalLabel: 'Total a Pagar hoy',
    confirmBtn: 'CONFIRMAR Y PAGAR'
  },
  en: {
    modalTitle: 'Secure Payment Gateway',
    step1Payment: '1. Select your payment method',
    payCard: 'Card',
    cardHolderLabel: 'CARDHOLDER',
    cardExpLabel: 'EXPIRES',
    cardCvvLabel: 'CVV / CVC',
    speiInfo: 'A unique CLABE will be generated for your instant SPEI transfer.',
    oxxoInfo: 'A barcode will be generated to pay at OXXO stores.',
    bankOrigin: 'Issuing Bank',
    selectBank: 'Select your bank',
    emailLabel: 'Email for receipt',
    inputCardHolder: 'Name on card',
    placeholderHolder: 'E.g. John Doe',
    inputCardNumber: 'Card number',
    inputCardExp: 'Expiration',
    inputCardCvv: 'CVV / CVC',
    paypalDesc: 'Safely authorize your membership charge through PayPal.',
    step2Plan: '2. Plan Summary',
    planFreeName: 'Free Trial',
    planFreeBadge: '7 Days',
    planFreeDesc: 'Full access without card.',
    planBasicName: 'Basic',
    planBasicDesc: 'Essential features.',
    planInterName: 'Intermediate',
    planInterDesc: 'Expanded capabilities.',
    planAdvName: 'Advanced',
    planAdvDesc: 'Robust tools.',
    subtotalLabel: 'Subtotal',
    taxLabel: 'Taxes (VAT 16% incl.)',
    totalLabel: 'Total to Pay today',
    confirmBtn: 'CONFIRM AND PAY'
  }
};

const t = (key) => {
  const table = traducciones[currentLang.value] || traducciones.es;
  return table[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

onMounted(() => { window.addEventListener('idioma-changed', handleLangChange); });
onUnmounted(() => { window.removeEventListener('idioma-changed', handleLangChange); });
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;700&display=swap');

.modal-container {
  width: 100%;
  max-width: 980px;
  max-height: 96vh;
  background: linear-gradient(145deg, #141418 0%, #0d0d10 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 18px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #f5f5f4;
  box-sizing: border-box;
}

.modal-header {
  padding: 20px 26px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.02);
  flex-shrink: 0;
}

.header-title-box { display: flex; align-items: center; gap: 14px; }
.lock-badge-icon {
  width: 42px; height: 42px; background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.35); color: #3b82f6;
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.modal-header h2 { margin: 0; font-family: 'Oswald', sans-serif; font-size: 1.35rem; color: #fff; letter-spacing: 0.5px; }
.close-btn {
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center;
  justify-content: center; color: #fff; cursor: pointer; transition: background 0.2s;
  flex-shrink: 0;
}
.close-btn:hover { background: rgba(255, 255, 255, 0.15); }

.modal-body-scroll {
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(96vh - 84px);
  width: 100%;
  box-sizing: border-box;
}

.modal-grid-layout { 
  display: grid; 
  grid-template-columns: 1.1fr 0.9fr; 
  gap: 26px; 
  padding: 26px; 
  width: 100%;
  box-sizing: border-box;
}

.payment-methods-col, .summary-plan-col {
  min-width: 0;
}

.section-instruction { font-size: 0.9rem; font-weight: 700; color: #fff; margin: 0 0 14px 0; font-family: 'Oswald', sans-serif; letter-spacing: 0.5px; }

.payment-tabs { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 18px; }
.pay-tab-btn {
  background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(245, 245, 244, 0.7); padding: 11px 6px; border-radius: 10px;
  font-size: 0.8rem; font-weight: 600; cursor: pointer; text-align: center; transition: all 0.2s;
  white-space: nowrap;
}
.pay-tab-btn:hover { background: rgba(255, 255, 255, 0.08); color: #fff; }
.pay-tab-btn.active { background: #161922; border-color: #3b82f6; color: #60a5fa; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2); }

/* TARJETA DE CRÉDITO ORIGINAL */
.card-preview-wrapper-desktop {
  perspective: 1000px;
  margin-bottom: 18px;
  width: 100%;
  display: flex;
  justify-content: center;
}

.credit-card-desktop {
  width: 100%;
  max-width: 380px;
  height: 215px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1);
}

.credit-card-desktop.flipped {
  transform: rotateY(180deg);
}

.card-face {
  position: absolute;
  inset: 0;
  border-radius: 14px;
  backface-visibility: hidden;
  box-shadow: 0 12px 30px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.15);
  box-sizing: border-box;
}

.card-front {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 60%, #1e1b4b 100%);
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-top-row { display: flex; justify-content: space-between; align-items: center; }
.card-chip {
  width: 44px;
  height: 34px;
  background: linear-gradient(135deg, #fde047 0%, #ca8a04 100%);
  border-radius: 4px;
}

.card-brands-badges { display: flex; gap: 4px; }
.brand-badge {
  font-size: 0.55rem; font-weight: 700; color: rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.05); padding: 3px 6px; border-radius: 4px;
}
.brand-badge.active { color: #fff; background: rgba(255,255,255,0.15); }

.card-number-display {
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  letter-spacing: 2px;
  color: #fff;
  text-align: center;
}

.card-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.card-info-group { display: flex; flex-direction: column; max-width: 190px; }
.card-info-group.text-right { text-align: right; }
.card-label-mini { font-size: 0.55rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; }
.card-value-mini { font-size: 0.82rem; font-weight: 600; color: #fff; font-family: 'Oswald', sans-serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.5px; }

.card-back {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  padding-top: 20px;
}

.card-black-stripe {
  width: 100%;
  height: 44px;
  background: #000;
  margin-bottom: 18px;
}

.card-cvv-strip {
  padding: 0 22px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.cvv-label-mini { font-size: 0.6rem; color: rgba(255,255,255,0.6); margin-bottom: 4px; }
.cvv-value-box {
  background: #fff;
  color: #000;
  width: 75px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-weight: bold;
  font-size: 0.9rem;
}

.payment-form-container {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-sizing: border-box;
}

.info-pill-badge {
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #93c5fd;
  font-size: 0.8rem;
  padding: 10px 14px;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  line-height: 1.4;
  margin-bottom: 6px;
}

/* ESPACIADO VERTICAL AMPLIADO ARRIBA Y ABAJO DE CADA INPUT GROUP */
.input-group { 
  display: flex; 
  flex-direction: column; 
  margin-top: 8px;   /* Espacio de separación hacia arriba */
  margin-bottom: 8px; /* Espacio de separación hacia abajo */
} 

.input-group label { 
  font-size: 0.82rem; 
  color: rgba(245, 245, 244, 0.85); 
  font-weight: 600; 
  letter-spacing: 0.3px;
  margin-bottom: 8px; /* Margen superior exacto entre el texto y el input */
}

.custom-input {
  background: rgba(255, 255, 255, 0.04); 
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 10px; 
  padding: 12px 16px; 
  color: #fff; 
  font-size: 0.92rem; 
  outline: none; 
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.custom-input:focus { border-color: #3b82f6; }
.custom-input option { background: #141418; color: #fff; }

.card-row-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.text-center-box { display: flex; align-items: center; justify-content: center; text-align: center; color: rgba(245, 245, 244, 0.75); font-size: 0.9rem; min-height: 110px; padding: 10px; }

/* Selector de Planes Derecha */
.plans-selector-box { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
.plan-option-card {
  background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px; padding: 12px 14px; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: all 0.2s;
  box-sizing: border-box;
  min-height: 60px;
}
.plan-option-card:hover { background: rgba(255, 255, 255, 0.05); }
.plan-option-card.active { background: rgba(22, 25, 34, 0.85); border-color: #3b82f6; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.15); }
.radio-circle {
  width: 18px; height: 18px; border-radius: 50%; border: 2px solid rgba(255, 255, 255, 0.3);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.plan-option-card.active .radio-circle { border-color: #3b82f6; }
.radio-inner { width: 9px; height: 9px; background: #3b82f6; border-radius: 50%; }

.plan-info-text { flex: 1; display: flex; flex-direction: column; min-width: 0; gap: 2px; }
.plan-title-row { display: flex; align-items: center; gap: 8px; }
.p-name { font-size: 0.9rem; font-weight: 700; color: #fff; font-family: 'Oswald', sans-serif; }
.badge-days { background: #3b82f6; color: #fff; font-size: 0.6rem; font-weight: 700; padding: 2px 6px; border-radius: 4px; text-transform: uppercase; }
.p-desc { font-size: 0.75rem; color: rgba(245, 245, 244, 0.55); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.p-price { font-size: 0.95rem; font-weight: 700; color: #fff; font-family: 'Oswald', sans-serif; white-space: nowrap; }
.p-price small { font-size: 0.6rem; color: rgba(245, 245, 244, 0.5); font-weight: 400; }

.summary-receipt-box {
  background: rgba(0, 0, 0, 0.25); border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;
  box-sizing: border-box;
}
.receipt-row { display: flex; justify-content: space-between; font-size: 0.82rem; color: rgba(245, 245, 244, 0.65); }
.receipt-val { color: #fff; font-weight: 500; }
.receipt-divider { height: 1px; background: rgba(255, 255, 255, 0.08); margin: 4px 0; }
.receipt-total-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; font-weight: 600; color: #fff; }
.total-highlight { font-family: 'Oswald', sans-serif; font-size: 1.35rem; color: #60a5fa; }

.btn-confirm-payment {
  width: 100%; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: #fff; border: none; padding: 14px; border-radius: 12px;
  font-size: 0.95rem; font-weight: 700; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.4);
  box-sizing: border-box;
  letter-spacing: 0.5px;
}
.btn-confirm-payment:hover { opacity: 0.95; transform: translateY(-1px); }

.animate-pop { animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes popIn {
  0% { opacity: 0; transform: scale(0.95); }
  100% { opacity: 1; transform: scale(1); }
}

/* RESPONSIVO MÓVIL */
@media(max-width: 768px) {
  .modal-container {
    width: 96vw;
    max-width: 96vw;
    height: auto;
    max-height: 92vh;
    border-radius: 16px;
    margin: 0 auto;
  }
  
  .modal-body-scroll {
    max-height: calc(92vh - 78px);
  }

  .modal-grid-layout {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 18px;
  }

  .credit-card-desktop {
    max-width: 100%;
    height: 195px;
  }

  .summary-plan-col {
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    padding-top: 18px;
  }
}
</style>
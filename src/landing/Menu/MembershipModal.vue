<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue';

const props = defineProps<{
  modelValue?: string;
}>();

const emit = defineEmits(['close', 'success', 'update:modelValue']);

const activeTab = ref('spei'); // 'spei' | 'card' | 'oxxo' | 'paypal'
const isLoading = ref(false);

const paymentForm = reactive({
  cardName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  selectedPackage: props.modelValue || 'Prueba Gratuita',
  speiBank: '',
  speiEmail: ''
});

// Diccionario centralizado con los 7 planes exactos y sus precios correspondientes
const PLANS_CONFIG: Record<string, { name: string; price: number; formattedPrice: string }> = {
  'Prueba Gratuita': { name: 'Prueba Gratuita', price: 0, formattedPrice: '$0.00' },
  'Básica': { name: 'Básica', price: 650, formattedPrice: '$650.00' },
  'Intermedia': { name: 'Intermedia', price: 850, formattedPrice: '$850.00' },
  'Avanzada': { name: 'Avanzada', price: 1200, formattedPrice: '$1,200.00' },
  'Pro': { name: 'Pro', price: 2100, formattedPrice: '$2,100.00' },
  'Sistema Permanente': { name: 'Sistema Permanente', price: 11000, formattedPrice: '$11,000.00' },
  'Sistema Avanzado': { name: 'Sistema Avanzado', price: 26000, formattedPrice: '$26,000.00' },
};

// Plan actual computado de manera limpia
const currentPlan = computed(() => {
  return PLANS_CONFIG[paymentForm.selectedPackage] ?? PLANS_CONFIG['Prueba Gratuita'];
});

// Sincronizar si cambia desde el componente padre
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal !== paymentForm.selectedPackage) {
    paymentForm.selectedPackage = newVal;
  }
});

const updateSelectedPackage = (pkg: string) => {
  paymentForm.selectedPackage = pkg;
  emit('update:modelValue', pkg);
};

// Detectar tipo de tarjeta básico
const detectedBrand = computed(() => {
  const num = paymentForm.cardNumber.replace(/\s+/g, '');
  if (num.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mc';
  if (/^3[47]/.test(num)) return 'amex';
  return '';
});

const formatCardNumber = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  value = value.substring(0, 16);
  paymentForm.cardNumber = value.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpiry = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  if (value.length >= 3) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  paymentForm.expiryDate = value;
};

const formatCvv = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  paymentForm.cvv = value.substring(0, 4);
};

const handleProcessPayment = () => {
  isLoading.value = true;
  const isFreeTrial = paymentForm.selectedPackage === 'Prueba Gratuita';

  setTimeout(() => {
    isLoading.value = false;
    if (isFreeTrial) {
      emit('success', '¡Prueba gratuita de 7 días activada! Ya puedes registrar tu gimnasio.');
    } else {
      emit('success', '¡Pago procesado y membresía renovada con éxito! Ya puedes registrar tu gimnasio.');
    }
  }, 1500);
};
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container payment-modal-container animate-modal">
      
      <div class="modal-header">
        <div class="header-title-wrapper">
          <svg class="header-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h3>{{ paymentForm.selectedPackage === 'Prueba Gratuita' ? 'Activación de Prueba Gratuita' : 'Pasarela de Pago Segura' }}</h3>
        </div>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body payment-modal-body">
        <form @submit.prevent="handleProcessPayment" class="payment-grid">
          
          <div class="payment-col">
            <template v-if="paymentForm.selectedPackage === 'Prueba Gratuita'">
              <label class="payment-section-label">1. Activación sin costo</label>
              <div class="spei-container">
                <div class="spei-box">
                  <div class="spei-badge-top bg-trial">Plan de 7 Días</div>
                  <p class="spei-desc">Has seleccionado la prueba gratuita de 7 días. No se requiere tarjeta de crédito ni pago inmediato para comenzar a registrar tu gimnasio.</p>
                </div>
              </div>
            </template>

            <template v-else>
              <label class="payment-section-label">1. Selecciona tu método de pago</label>
              
              <div class="payment-tabs">
                <button type="button" class="tab-btn" :class="{ active: activeTab === 'spei' }" @click="activeTab = 'spei'">
                  <span>SPEI</span>
                </button>
                <button type="button" class="tab-btn" :class="{ active: activeTab === 'card' }" @click="activeTab = 'card'">
                  <span>Tarjeta</span>
                </button>
                <button type="button" class="tab-btn" :class="{ active: activeTab === 'oxxo' }" @click="activeTab = 'oxxo'">
                  <span>OXXO</span>
                </button>
                <button type="button" class="tab-btn" :class="{ active: activeTab === 'paypal' }" @click="activeTab = 'paypal'">
                  <span>PayPal</span>
                </button>
              </div>

              <template v-if="activeTab === 'spei'">
                <div class="spei-container">
                  <div class="spei-box">
                    <div class="spei-badge-top">Más elegido / Depósito desde tu banco</div>
                    <p class="spei-desc">Se generará una CLABE interbancaria única para realizar tu transferencia SPEI.</p>
                    
                    <div class="input-group mt-2">
                      <label>Banco de origen</label>
                      <select v-model="paymentForm.speiBank" class="select-input" required>
                        <option value="" disabled selected>Selecciona tu banco</option>
                        <option value="bbva">BBVA México</option>
                        <option value="banamex">Citibanamex</option>
                        <option value="santander">Santander</option>
                        <option value="hsbc">HSBC</option>
                        <option value="scotiabank">Scotiabank</option>
                        <option value="azteca">Banco Azteca</option>
                        <option value="other">Otro banco</option>
                      </select>
                    </div>

                    <div class="input-group mt-2">
                      <label>Correo electrónico</label>
                      <input type="email" v-model="paymentForm.speiEmail" placeholder="tucorreo@dominio.com" required />
                    </div>
                  </div>
                </div>
              </template>

              <template v-else-if="activeTab === 'card'">
                <div class="virtual-card">
                  <div class="card-chip"></div>
                  <div class="card-brand-display">
                    <span :class="['brand-badge visa', { active: detectedBrand === 'visa' }]">VISA</span>
                    <span :class="['brand-badge mc', { active: detectedBrand === 'mc' }]">MC</span>
                    <span :class="['brand-badge amex', { active: detectedBrand === 'amex' }]">AMEX</span>
                  </div>
                  <div class="virtual-card-number">{{ paymentForm.cardNumber || '•••• •••• •••• ••••' }}</div>
                  <div class="virtual-card-footer">
                    <div class="v-card-holder">
                      <small>Titular</small>
                      <span>{{ paymentForm.cardName || 'NOMBRE APELLIDO' }}</span>
                    </div>
                    <div class="v-card-expires">
                      <small>Expira</small>
                      <span>{{ paymentForm.expiryDate || 'MM/AA' }}</span>
                    </div>
                  </div>
                </div>

                <div class="input-group mt-3">
                  <label>Nombre en la tarjeta</label>
                  <input type="text" v-model="paymentForm.cardName" placeholder="Ej. Juan Carlos Guzmán" required />
                </div>

                <div class="input-group mt-3">
                  <label>Número de la tarjeta</label>
                  <input type="text" :value="paymentForm.cardNumber" @input="formatCardNumber" placeholder="0000 0000 0000 0000" maxlength="19" required />
                </div>

                <div class="payment-row mt-3">
                  <div class="input-group">
                    <label>Caducidad</label>
                    <input type="text" :value="paymentForm.expiryDate" @input="formatExpiry" placeholder="MM/AA" maxlength="5" required />
                  </div>
                  <div class="input-group">
                    <label>CVV / CVC</label>
                    <input type="password" :value="paymentForm.cvv" @input="formatCvv" placeholder="123" maxlength="4" required />
                  </div>
                </div>
              </template>

              <template v-else-if="activeTab === 'oxxo'">
                <div class="oxxo-container">
                  <div class="oxxo-box">
                    <div class="oxxo-badge-lg">OXXO Pay</div>
                    <p>Se generará un voucher con código de barras para pago en efectivo.</p>
                  </div>
                </div>
              </template>

              <template v-else-if="activeTab === 'paypal'">
                <div class="paypal-container">
                  <div class="paypal-box">
                    <p>Serás redirigido de forma segura a PayPal para autorizar tu suscripción.</p>
                    <div class="paypal-badge-lg">PayPal Express Checkout</div>
                  </div>
                </div>
              </template>
            </template>
          </div>

          <div class="payment-col summary-col">
            <label class="payment-section-label">2. Resumen del Plan</label>
            
            <div class="packages-selection-list">
              <!-- 1. Prueba Gratuita -->
              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'Prueba Gratuita' }">
                <input type="radio" value="Prueba Gratuita" :checked="paymentForm.selectedPackage === 'Prueba Gratuita'" @change="updateSelectedPackage('Prueba Gratuita')" />
                <div class="pkg-info">
                  <span class="pkg-name">Prueba Gratuita <span class="badge-ahorro bg-trial">7 Días</span></span>
                  <span class="pkg-desc">Acceso completo sin tarjeta.</span>
                </div>
                <span class="pkg-price">$0 <sub>MXN</sub></span>
              </label>

              <!-- 2. Básica -->
              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'Básica' }">
                <input type="radio" value="Básica" :checked="paymentForm.selectedPackage === 'Básica'" @change="updateSelectedPackage('Básica')" />
                <div class="pkg-info">
                  <span class="pkg-name">Básica</span>
                  <span class="pkg-desc">Funciones esenciales.</span>
                </div>
                <span class="pkg-price">$650 <sub>MXN/mes</sub></span>
              </label>

              <!-- 3. Intermedia -->
              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'Intermedia' }">
                <input type="radio" value="Intermedia" :checked="paymentForm.selectedPackage === 'Intermedia'" @change="updateSelectedPackage('Intermedia')" />
                <div class="pkg-info">
                  <span class="pkg-name">Intermedia</span>
                  <span class="pkg-desc">Capacidades ampliadas.</span>
                </div>
                <span class="pkg-price">$850 <sub>MXN/mes</sub></span>
              </label>

              <!-- 4. Avanzada -->
              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'Avanzada' }">
                <input type="radio" value="Avanzada" :checked="paymentForm.selectedPackage === 'Avanzada'" @change="updateSelectedPackage('Avanzada')" />
                <div class="pkg-info">
                  <span class="pkg-name">Avanzada</span>
                  <span class="pkg-desc">Herramientas robustas.</span>
                </div>
                <span class="pkg-price">$1,200 <sub>MXN/mes</sub></span>
              </label>

              <!-- 5. Pro -->
              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'Pro' }">
                <input type="radio" value="Pro" :checked="paymentForm.selectedPackage === 'Pro'" @change="updateSelectedPackage('Pro')" />
                <div class="pkg-info">
                  <span class="pkg-name">Pro <span class="badge-ahorro">Completo</span></span>
                  <span class="pkg-desc">Acceso ilimitado e IA.</span>
                </div>
                <span class="pkg-price">$2,100 <sub>MXN/mes</sub></span>
              </label>

              <!-- 6. Sistema Permanente -->
              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'Sistema Permanente' }">
                <input type="radio" value="Sistema Permanente" :checked="paymentForm.selectedPackage === 'Sistema Permanente'" @change="updateSelectedPackage('Sistema Permanente')" />
                <div class="pkg-info">
                  <span class="pkg-name">Sistema Permanente</span>
                  <span class="pkg-desc">Pago único.</span>
                </div>
                <span class="pkg-price">$11,000 <sub>MXN</sub></span>
              </label>

              <!-- 7. Sistema Avanzado -->
              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'Sistema Avanzado' }">
                <input type="radio" value="Sistema Avanzado" :checked="paymentForm.selectedPackage === 'Sistema Avanzado'" @change="updateSelectedPackage('Sistema Avanzado')" />
                <div class="pkg-info">
                  <span class="pkg-name">Sistema Avanzado</span>
                  <span class="pkg-desc">Pago único completo.</span>
                </div>
                <span class="pkg-price">$26,000 <sub>MXN</sub></span>
              </label>
            </div>

            <div class="receipt-box">
              <div class="receipt-line">
                <span>Subtotal</span>
                <span>{{ currentPlan?.formattedPrice }} MXN</span>
              </div>
              <div class="receipt-line">
                <span>Impuestos (IVA 16% incl.)</span>
                <span>$0.00 MXN</span>
              </div>
              <div class="receipt-line total">
                <span>Total a Pagar hoy</span>
                <span class="total-amount">{{ currentPlan?.formattedPrice }}</span>
              </div>
            </div>

            <div class="payment-submit-wrapper">
              <button type="submit" class="btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner"></span>
                <span v-else>{{ paymentForm.selectedPackage === 'Prueba Gratuita' ? 'Activar y Registrar Gimnasio' : 'Confirmar y Pagar' }}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>


<style scoped>
.animate-modal {
  animation: modalScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-overlay {
  position: fixed;
  top: 0; 
  left: 0; 
  width: 100%; 
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 16px;
  box-sizing: border-box;
}

.modal-container {
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.7);
}

.modal-header {
  padding: 16px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1c1c1c;
  flex-shrink: 0;
}

.header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-svg-icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  flex-shrink: 0;
}

.modal-header h3 {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.15rem;
  margin: 0;
  letter-spacing: 0.5px;
}

.close-btn {
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 1.8rem;
  cursor: pointer;
  line-height: 1;
  padding: 0 4px;
  transition: color 0.2s;
}

.close-btn:hover { color: #fff; }

.modal-body {
  padding: 20px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.payment-section-label {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.05rem;
  margin-bottom: 12px;
  display: block;
  letter-spacing: 0.5px;
}

.payment-tabs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin-bottom: 16px;
}

.tab-btn {
  background: #222;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #aaa;
  padding: 8px 4px;
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  text-align: center;
  min-height: 48px;
}

.tab-btn span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.tab-svg {
  width: 15px;
  height: 15px;
  flex-shrink: 0;
}

.tab-btn.active {
  background: rgba(28, 79, 214, 0.15);
  border-color: #1c4fd6;
  color: #fff;
}

.spei-container, .oxxo-container {
  padding: 4px 0;
  display: flex;
  justify-content: center;
}

.spei-box, .oxxo-box {
  background: #1f1f1f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 16px;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
}

.spei-badge-top {
  background: rgba(28, 79, 214, 0.2);
  color: #8fb4f8;
  font-size: 0.68rem;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 700;
  align-self: flex-start;
  font-family: 'Inter', sans-serif;
}

.spei-desc, .oxxo-box p {
  color: #aaa;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  margin: 0;
  line-height: 1.4;
}

.spei-steps-preview {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.72rem;
  color: #888;
  font-family: 'Inter', sans-serif;
  background: #151515;
  padding: 8px 10px;
  border-radius: 8px;
}

.oxxo-badge-lg {
  background: #e63946;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
}

.virtual-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #111 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 16px;
  color: white;
  position: relative;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  margin-bottom: 16px;
  box-sizing: border-box;
}

.card-chip {
  width: 32px;
  height: 24px;
  background: linear-gradient(135deg, #d4af37 0%, #aa771c 100%);
  border-radius: 4px;
}

.card-brand-display {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  gap: 4px;
}

.brand-badge {
  font-size: 0.6rem;
  font-weight: 800;
  padding: 2px 5px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #555;
  transition: all 0.3s;
}

.brand-badge.visa.active { background: #1a1f71; color: #fff; }
.brand-badge.mc.active { background: #eb001b; color: #fff; }
.brand-badge.amex.active { background: #0070ba; color: #fff; }

.virtual-card-number {
  font-family: monospace;
  font-size: 1.1rem;
  letter-spacing: 1.5px;
  color: #f1f1f1;
  word-break: break-all;
}

.virtual-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 10px;
}

.v-card-holder, .v-card-expires {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.v-card-holder small, .v-card-expires small {
  font-size: 0.58rem;
  color: #888;
  text-transform: uppercase;
}

.v-card-holder span, .v-card-expires span {
  font-size: 0.75rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.packages-selection-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  max-height: 240px;
  overflow-y: auto;
  padding-right: 2px;
  -webkit-overflow-scrolling: touch;
}

.package-option-card {
  background: #1f1f1f;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.package-option-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.package-option-card.selected {
  background: rgba(28, 79, 214, 0.08);
  border-color: #1c4fd6;
}

.package-option-card input[type="radio"] {
  accent-color: #1c4fd6;
  width: 16px;
  height: 16px;
  cursor: pointer;
  flex-shrink: 0;
}

.pkg-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  min-width: 0;
}

.pkg-name {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.badge-ahorro {
  background: #10b981;
  color: #000;
  font-size: 0.58rem;
  padding: 2px 5px;
  border-radius: 4px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
}

.bg-trial {
  background: #3b82f6;
  color: #fff;
}

.pkg-desc {
  font-family: 'Inter', sans-serif;
  color: #888;
  font-size: 0.68rem;
  margin-top: 2px;
  line-height: 1.3;
}

.pkg-price {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 0.95rem;
  text-align: right;
  flex-shrink: 0;
}

.pkg-price sub {
  font-size: 0.58rem;
  color: #888;
  font-family: 'Inter', sans-serif;
}

.receipt-box {
  background: #1c1c1c;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 16px;
}

.receipt-line {
  display: flex;
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  color: #aaa;
  gap: 8px;
}

.receipt-line.total {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 8px;
  margin-top: 4px;
  color: #fff;
  font-weight: 600;
}

.total-amount {
  font-family: 'Oswald', sans-serif;
  font-size: 1.05rem;
  color: #3b82f6;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

label {
  font-family: 'Oswald', sans-serif;
  color: #d1d5db;
  font-size: 0.76rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

input[type="text"], 
input[type="password"], 
input[type="email"], 
.select-input {
  background: #121212;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  padding: 10px 12px;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  transition: border-color 0.2s;
}

.select-input {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 12px center;
  background-size: 15px;
  padding-right: 35px;
  cursor: pointer;
}

input:focus, .select-input:focus {
  outline: none;
  border-color: #1c4fd6;
}

.payment-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.mt-2 { margin-top: 8px; }
.mt-3 { margin-top: 12px; }

.payment-submit-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  width: 100%;
  padding: 13px;
  background: #1c4fd6;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(28, 79, 214, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 46px;
}

.btn-primary:hover:not(:disabled) {
  background: #1742be;
  transform: translateY(-1px);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secure-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  color: #888;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  text-align: center;
}

.secure-svg {
  width: 12px;
  height: 12px;
  color: #10b981;
  flex-shrink: 0;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.paypal-container {
  padding: 10px 0;
  display: flex;
  justify-content: center;
}

.paypal-box {
  background: #1f1f1f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}

.paypal-box p {
  color: #aaa;
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  margin: 0;
}

.paypal-badge-lg {
  background: #0070ba;
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .modal-overlay {
    padding: 12px;
    align-items: center;
  }

  .modal-container {
    max-height: 92vh;
    border-radius: 20px;
    width: 100%;
    margin: 0;
  }

  .modal-body {
    padding: 16px;
  }

  .payment-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .payment-tabs {
    grid-template-columns: repeat(4, 1fr);
  }

  .packages-selection-list {
    max-height: 220px;
  }
}
</style>
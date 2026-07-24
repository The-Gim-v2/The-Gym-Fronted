<script setup lang="ts">
import { reactive, ref, computed } from 'vue';

const emit = defineEmits(['close', 'success']);

const activeTab = ref('card'); // 'card' o 'paypal'
const isLoading = ref(false);

const paymentForm = reactive({
  cardName: '',
  cardNumber: '',
  expiryDate: '',
  cvv: '',
  selectedPackage: 'mensualidad_pro'
});

// Detectar tipo de tarjeta básico según el primer dígito
const detectedBrand = computed(() => {
  const num = paymentForm.cardNumber.replace(/\s+/g, '');
  if (num.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mc';
  if (/^3[47]/.test(num)) return 'amex';
  return '';
});

// Formatear número de tarjeta automáticamente en bloques de 4
const formatCardNumber = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  value = value.substring(0, 16);
  paymentForm.cardNumber = value.replace(/(\d{4})(?=\d)/g, '$1 ');
};

// Formatear fecha de caducidad MM/AA
const formatExpiry = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');
  if (value.length >= 3) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4);
  }
  paymentForm.expiryDate = value;
};

const handleProcessPayment = () => {
  isLoading.value = true;
  
  // Simular proceso de pasarela de pago segura
  setTimeout(() => {
    isLoading.value = false;
    emit('success', '¡Pago procesado y membresía renovada con éxito!');
  }, 1500);
};
</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-container payment-modal-container animate-modal">
      
      <!-- Header -->
      <div class="modal-header">
        <div class="header-title-wrapper">
          <!-- SVG Icono Candado Seguridad -->
          <svg class="header-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h3>Pasarela de Pago Segura</h3>
        </div>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="modal-body payment-modal-body">
        <form @submit.prevent="handleProcessPayment" class="payment-grid">
          
          <!-- COLUMNA IZQUIERDA: Métodos de Pago y Datos -->
          <div class="payment-col">
            <label class="payment-section-label">1. Selecciona tu método de pago</label>
            
            <div class="payment-tabs">
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: activeTab === 'card' }"
                @click="activeTab = 'card'"
              >
                <!-- SVG Tarjeta -->
                <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                Tarjeta Crédito / Débito
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                :class="{ active: activeTab === 'paypal' }"
                @click="activeTab = 'paypal'"
              >
                <!-- SVG PayPal / Cartera -->
                <svg class="tab-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
                  <path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path>
                  <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path>
                </svg>
                PayPal
              </button>
            </div>

            <!-- VISTA: TARJETA BANCARIA -->
            <template v-if="activeTab === 'card'">
              <!-- Tarjeta Visual Interactiva -->
              <div class="virtual-card">
                <div class="card-chip"></div>
                <div class="card-brand-display">
                  <span :class="['brand-badge visa', { active: detectedBrand === 'visa' }]">VISA</span>
                  <span :class="['brand-badge mc', { active: detectedBrand === 'mc' }]">MC</span>
                  <span :class="['brand-badge amex', { active: detectedBrand === 'amex' }]">AMEX</span>
                </div>
                <div class="virtual-card-number">
                  {{ paymentForm.cardNumber || '•••• •••• •••• ••••' }}
                </div>
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
                <label>Nombre como aparece en la tarjeta</label>
                <input 
                  type="text" 
                  v-model="paymentForm.cardName" 
                  placeholder="Ej. Juan Carlos Guzmán" 
                  required 
                />
              </div>

              <div class="input-group mt-3">
                <label>Número de la tarjeta</label>
                <input 
                  type="text" 
                  :value="paymentForm.cardNumber"
                  @input="formatCardNumber"
                  placeholder="0000 0000 0000 0000" 
                  maxlength="19" 
                  required 
                />
              </div>

              <div class="payment-row mt-3">
                <div class="input-group">
                  <label>Fecha de caducidad</label>
                  <input 
                    type="text" 
                    :value="paymentForm.expiryDate"
                    @input="formatExpiry"
                    placeholder="MM/AA" 
                    maxlength="5" 
                    required 
                  />
                </div>
                <div class="input-group">
                  <label>CVV / CVC</label>
                  <input 
                    type="password" 
                    v-model="paymentForm.cvv" 
                    placeholder="123" 
                    maxlength="4" 
                    required 
                  />
                </div>
              </div>
            </template>

            <!-- VISTA: PAYPAL SIMULADO -->
            <template v-else>
              <div class="paypal-container">
                <div class="paypal-box">
                  <p>Al hacer clic en pagar, serás redirigido de forma segura a PayPal para autorizar el cargo de tu suscripción de manera automática.</p>
                  <div class="paypal-badge-lg">PayPal Express Checkout</div>
                </div>
              </div>
            </template>
          </div>

          <!-- COLUMNA DERECHA: Resumen de Suscripción y Total -->
          <div class="payment-col summary-col">
            <label class="payment-section-label">2. Resumen del Plan</label>
            
            <div class="packages-selection-list">
              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'mensualidad_pro' }">
                <input type="radio" value="mensualidad_pro" v-model="paymentForm.selectedPackage" />
                <div class="pkg-info">
                  <span class="pkg-name">Plan Pro Mensual</span>
                  <span class="pkg-desc">Acceso ilimitado a todas las funciones avanzadas.</span>
                </div>
                <span class="pkg-price">$450 <sub>MXN/mes</sub></span>
              </label>

              <label class="package-option-card" :class="{ selected: paymentForm.selectedPackage === 'anualidad_pro' }">
                <input type="radio" value="anualidad_pro" v-model="paymentForm.selectedPackage" />
                <div class="pkg-info">
                  <span class="pkg-name">Plan Pro Anual <span class="badge- ahorro">Ahorra 20%</span></span>
                  <span class="pkg-desc">Pago único anual con beneficios exclusivos.</span>
                </div>
                <span class="pkg-price">$4,320 <sub>MXN/año</sub></span>
              </label>
            </div>

            <!-- Desglose de Pago -->
            <div class="receipt-box">
              <div class="receipt-line">
                <span>Subtotal</span>
                <span>{{ paymentForm.selectedPackage === 'mensualidad_pro' ? '$450.00 MXN' : '$4,320.00 MXN' }}</span>
              </div>
              <div class="receipt-line">
                <span>Impuestos (IVA 16% incl.)</span>
                <span>$0.00 MXN</span>
              </div>
              <div class="receipt-line total">
                <span>Total a Pagar hoy</span>
                <span class="total-amount">{{ paymentForm.selectedPackage === 'mensualidad_pro' ? '$450.00' : '$4,320.00' }}</span>
              </div>
            </div>

            <div class="payment-submit-wrapper">
              <button type="submit" class="btn-primary" :disabled="isLoading">
                <span v-if="isLoading" class="spinner"></span>
                <span v-else>Confirmar y Pagar</span>
              </button>
              <p class="secure-text">
                <!-- SVG Escudo de seguridad -->
                <svg class="secure-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                Pago 100% cifrado y seguro vía SSL
              </p>
            </div>
          </div>

        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Transiciones y Animaciones estándar */
.animate-modal {
  animation: modalScale 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-container {
  background: #161616;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0,0,0,0.7);
}

.modal-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1c1c1c;
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
}

.modal-header h3 {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.25rem;
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
  transition: color 0.2s;
}

.close-btn:hover { color: #fff; }

.modal-body {
  padding: 30px;
  overflow-y: auto;
}

.payment-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.payment-section-label {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.05rem;
  margin-bottom: 15px;
  display: block;
  letter-spacing: 0.5px;
}

/* Pestañas de métodos de pago */
.payment-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-bottom: 20px;
}

.tab-btn {
  background: #222;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  color: #aaa;
  padding: 10px 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-svg {
  width: 16px;
  height: 16px;
}

.tab-btn.active {
  background: rgba(28, 79, 214, 0.15);
  border-color: #1c4fd6;
  color: #fff;
}

/* Tarjeta Virtual Interactiva */
.virtual-card {
  background: linear-gradient(135deg, #2a2a2a 0%, #111 100%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 14px;
  padding: 20px;
  color: white;
  position: relative;
  height: 170px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 10px 25px rgba(0,0,0,0.4);
  margin-bottom: 20px;
}

.card-chip {
  width: 35px;
  height: 26px;
  background: linear-gradient(135deg, #d4af37 0%, #aa771c 100%);
  border-radius: 4px;
}

.card-brand-display {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 5px;
}

.brand-badge {
  font-size: 0.65rem;
  font-weight: 800;
  padding: 2px 6px;
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
  font-size: 1.2rem;
  letter-spacing: 2px;
  color: #f1f1f1;
}

.virtual-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.v-card-holder, .v-card-expires {
  display: flex;
  flex-direction: column;
}

.v-card-holder small, .v-card-expires small {
  font-size: 0.6rem;
  color: #888;
  text-transform: uppercase;
}

.v-card-holder span, .v-card-expires span {
  font-size: 0.8rem;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
  max-width: 180px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Paquetes */
.packages-selection-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.package-option-card {
  background: #1f1f1f;
  border: 1.5px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
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
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.pkg-info {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.pkg-name {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge-ahorro {
  background: #10b981;
  color: #000;
  font-size: 0.6rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
}

.pkg-desc {
  font-family: 'Inter', sans-serif;
  color: #888;
  font-size: 0.75rem;
  margin-top: 2px;
}

.pkg-price {
  font-family: 'Oswald', sans-serif;
  color: #fff;
  font-size: 1.1rem;
  text-align: right;
}

.pkg-price sub {
  font-size: 0.65rem;
  color: #888;
  font-family: 'Inter', sans-serif;
}

/* Recibo */
.receipt-box {
  background: #1c1c1c;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 20px;
}

.receipt-line {
  display: flex;
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #aaa;
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
  font-size: 1.2rem;
  color: #3b82f6;
}

/* Inputs */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-family: 'Oswald', sans-serif;
  color: #d1d5db;
  font-size: 0.8rem;
  font-weight: 500;
  letter-spacing: 0.5px;
}

input[type="text"], input[type="password"] {
  background: #121212;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: #fff;
  padding: 11px 14px;
  width: 100%;
  box-sizing: border-box;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  transition: border-color 0.2s;
}

input:focus {
  outline: none;
  border-color: #1c4fd6;
}

.payment-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.mt-3 { margin-top: 18px; }

/* Botones y Seguridad */
.payment-submit-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.btn-primary {
  width: 100%;
  padding: 14px;
  background: #1c4fd6;
  color: white;
  border: none;
  border-radius: 12px;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(28, 79, 214, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
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
  font-size: 0.75rem;
  color: #888;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 5px;
}

.secure-svg {
  width: 13px;
  height: 13px;
  color: #10b981;
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* PayPal */
.paypal-container {
  padding: 40px 20px;
  display: flex;
  justify-content: center;
}

.paypal-box {
  background: #1f1f1f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.paypal-box p {
  color: #aaa;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  margin: 0;
}

.paypal-badge-lg {
  background: #0070ba;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
}

@media (max-width: 768px) {
  .payment-grid {
    grid-template-columns: 1fr;
  }
  .modal-container {
    max-height: 95vh;
  }
}
</style>
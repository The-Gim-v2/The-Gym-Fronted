<script setup lang="ts">
import { reactive, ref, computed, watch, onMounted, onUnmounted } from 'vue';

const props = defineProps<{ modelValue?: string }>();
const emit = defineEmits(['close', 'success', 'update:modelValue']);

type PaymentTab = 'spei' | 'card' | 'oxxo' | 'paypal';

const activeTab = ref<PaymentTab>('spei');
const isLoading = ref(false);

const paymentForm = reactive({
  cardName: '', cardNumber: '', expiryDate: '', cvv: '',
  selectedPackage: props.modelValue || 'Prueba Gratuita',
  speiBank: '', speiEmail: ''
});

const PLANS_CONFIG: Record<string, { name: string; price: number; formattedPrice: string; description: string; period: string }> = {
  'Prueba Gratuita': { name: 'Prueba Gratuita', price: 0, formattedPrice: '$0.00', description: 'Acceso completo durante 7 días', period: '7 días' },
  'Básica': { name: 'Básica', price: 650, formattedPrice: '$650.00', description: 'Funciones esenciales para tu gimnasio', period: '/ mes' },
  'Intermedia': { name: 'Intermedia', price: 850, formattedPrice: '$850.00', description: 'Capacidades ampliadas de administración', period: '/ mes' },
  'Avanzada': { name: 'Avanzada', price: 1200, formattedPrice: '$1,200.00', description: 'Herramientas avanzadas de gestión', period: '/ mes' },
  'Pro': { name: 'Pro', price: 2100, formattedPrice: '$2,100.00', description: 'Acceso completo a todas las funciones', period: '/ mes' },
  'Sistema Permanente': { name: 'Sistema Permanente', price: 11000, formattedPrice: '$11,000.00', description: 'Licencia permanente del sistema', period: 'pago único' },
  'Sistema Avanzado': { name: 'Sistema Avanzado', price: 26000, formattedPrice: '$26,000.00', description: 'Sistema completo con funciones avanzadas', period: 'pago único' }
};

const currentPlan = computed(() => PLANS_CONFIG[paymentForm.selectedPackage] ?? PLANS_CONFIG['Prueba Gratuita']);
const isFreeTrial = computed(() => paymentForm.selectedPackage === 'Prueba Gratuita');

watch(() => props.modelValue, newVal => {
  if (newVal && newVal !== paymentForm.selectedPackage) paymentForm.selectedPackage = newVal;
});

const updateSelectedPackage = (pkg: string) => {
  paymentForm.selectedPackage = pkg;
  emit('update:modelValue', pkg);
};

const detectedBrand = computed(() => {
  const num = paymentForm.cardNumber.replace(/\s+/g, '');
  if (num.startsWith('4')) return 'visa';
  if (/^5[1-5]/.test(num) || /^2[2-7]/.test(num)) return 'mc';
  if (/^3[47]/.test(num)) return 'amex';
  return '';
});

const formatCardNumber = (e: Event) => {
  const value = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 16);
  paymentForm.cardNumber = value.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpiry = (e: Event) => {
  let value = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 4);
  if (value.length >= 3) value = value.substring(0, 2) + '/' + value.substring(2);
  paymentForm.expiryDate = value;
};

const formatCvv = (e: Event) => {
  paymentForm.cvv = (e.target as HTMLInputElement).value.replace(/\D/g, '').substring(0, 4);
};

const handleProcessPayment = () => {
  isLoading.value = true;
  setTimeout(() => {
    isLoading.value = false;
    emit('success', isFreeTrial.value
      ? '¡Prueba gratuita de 7 días activada! Ya puedes registrar tu gimnasio.'
      : '¡Pago procesado y membresía renovada con éxito! Ya puedes registrar tu gimnasio.');
  }, 1500);
};

// Evita el doble scroll: bloquea el scroll de la página mientras el modal está abierto
let prevBody = '';
let prevHtml = '';
onMounted(() => {
  prevBody = document.body.style.overflow;
  prevHtml = document.documentElement.style.overflow;
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = prevBody;
  document.documentElement.style.overflow = prevHtml;
});
</script>

<template>
  <div class="payment-overlay" @click.self="$emit('close')">
    <div class="checkout">

      <!-- HEADER -->
      <header class="checkout-header">
        <div class="checkout-brand">
          <div class="secure-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2.5" y="4.5" width="16" height="11.5" rx="2.5"/><path d="M2.5 9h16"/><path d="M6 13h3"/>
              <circle cx="17.5" cy="16.5" r="4.6" fill="#101112"/><path d="m15.4 16.6 1.4 1.4 2.8-2.9" stroke="#65c68b" stroke-width="2"/>
            </svg>
          </div>
          <div>
            <h2>{{ isFreeTrial ? 'Activar prueba gratuita' : 'Finalizar compra' }}</h2>
            <p>{{ isFreeTrial ? 'Comienza tu periodo de prueba sin ingresar datos bancarios.' : 'Completa el pago de tu membresía de forma segura.' }}</p>
          </div>
        </div>
        <button type="button" class="close-btn" aria-label="Cerrar" @click="$emit('close')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>
        </button>
      </header>

      <form class="checkout-body" @submit.prevent="handleProcessPayment">

        <!-- IZQUIERDA -->
        <section class="payment-panel">
          <div class="section-heading">
            <span class="step-number">1</span>
            <div>
              <h3>{{ isFreeTrial ? 'Activa tu prueba' : 'Método de pago' }}</h3>
              <p v-if="!isFreeTrial">Selecciona cómo deseas realizar tu pago.</p>
              <p v-else>No necesitas registrar una tarjeta para comenzar.</p>
            </div>
          </div>

          <!-- PRUEBA GRATUITA -->
          <template v-if="isFreeTrial">
            <div class="trial-card">
              <div class="trial-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 12v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-7"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 1 1 2.45-3c.5 1.5 2.05 3 2.05 3Z"/><path d="M12 7h4.5a2.5 2.5 0 1 0-2.45-3C13.55 5.5 12 7 12 7Z"/></svg>
              </div>
              <div class="trial-content">
                <span class="trial-badge">7 días gratis</span>
                <h4>Prueba todas las funciones</h4>
                <p>Puedes comenzar a configurar tu gimnasio ahora. No se realizará ningún cargo.</p>
                <div class="trial-features">
                  <span><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>Sin tarjeta</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>Sin cargos</span>
                  <span><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg>Acceso inmediato</span>
                </div>
              </div>
            </div>
          </template>

          <!-- MÉTODOS DE PAGO -->
          <template v-else>
            <div class="payment-methods">
              <button type="button" class="method-btn" :class="{ active: activeTab === 'spei' }" @click="activeTab = 'spei'">
                <div class="method-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10h18"/><path d="M5 10V8l7-4 7 4v2"/><path d="M6 10v7M10 10v7M14 10v7M18 10v7"/><path d="M3 17h18M2 21h20"/></svg></div>
                <span><strong>SPEI</strong><small>Transferencia</small></span>
                <span class="method-radio"><span></span></span>
              </button>

              <button type="button" class="method-btn" :class="{ active: activeTab === 'card' }" @click="activeTab = 'card'">
                <div class="method-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/><path d="M6 15h4"/></svg></div>
                <span><strong>Tarjeta</strong><small>Crédito o débito</small></span>
                <span class="method-radio"><span></span></span>
              </button>

              <button type="button" class="method-btn" :class="{ active: activeTab === 'oxxo' }" @click="activeTab = 'oxxo'">
                <div class="method-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M8 8v8M11 8v8M15 8v8M18 8v8"/></svg></div>
                <span><strong>OXXO</strong><small>Pago en efectivo</small></span>
                <span class="method-radio"><span></span></span>
              </button>

              <button type="button" class="method-btn" :class="{ active: activeTab === 'paypal' }" @click="activeTab = 'paypal'">
                <div class="method-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 19 9.5 5h5.2c3.1 0 4.8 1.5 4.3 4.2-.5 2.8-2.5 4.4-5.5 4.4H11L10 19H7Z"/></svg></div>
                <span><strong>PayPal</strong><small>Cuenta PayPal</small></span>
                <span class="method-radio"><span></span></span>
              </button>
            </div>

            <!-- SPEI -->
            <div v-if="activeTab === 'spei'" class="method-content">
              <div class="method-title">
                <div>
                  <span class="recommended-badge">Recomendado</span>
                  <h4>Transferencia bancaria SPEI</h4>
                  <p>Generaremos una CLABE única para identificar tu pago.</p>
                </div>
                <svg class="method-title-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 10h18"/><path d="M5 10V8l7-4 7 4v2"/><path d="M6 10v7M10 10v7M14 10v7M18 10v7"/><path d="M3 17h18"/></svg>
              </div>

              <div class="form-group">
                <label for="speiBank">Banco de origen</label>
                <div class="select-wrapper">
                  <select id="speiBank" v-model="paymentForm.speiBank" required>
                    <option value="" disabled>Selecciona tu banco</option>
                    <option value="bbva">BBVA México</option>
                    <option value="banamex">Citibanamex</option>
                    <option value="santander">Santander</option>
                    <option value="hsbc">HSBC</option>
                    <option value="scotiabank">Scotiabank</option>
                    <option value="azteca">Banco Azteca</option>
                    <option value="other">Otro banco</option>
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 10 5 5 5-5"/></svg>
                </div>
              </div>

              <div class="form-group">
                <label for="speiEmail">Correo para recibir instrucciones</label>
                <input id="speiEmail" v-model="paymentForm.speiEmail" type="email" placeholder="tucorreo@dominio.com" required />
              </div>

              <div class="info-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>
                <p>Después de confirmar, recibirás la CLABE y las instrucciones para completar la transferencia.</p>
              </div>
            </div>

            <!-- TARJETA -->
            <div v-else-if="activeTab === 'card'" class="method-content">
              <div class="card-preview">
                <div class="card-preview-top">
                  <div class="card-chip"><span></span></div>
                  <div class="brands">
                    <span class="brand visa" :class="{ active: detectedBrand === 'visa' }">VISA</span>
                    <span class="brand" :class="{ active: detectedBrand === 'mc' }">MC</span>
                    <span class="brand" :class="{ active: detectedBrand === 'amex' }">AMEX</span>
                  </div>
                </div>
                <div class="preview-number">{{ paymentForm.cardNumber || '•••• •••• •••• ••••' }}</div>
                <div class="preview-footer">
                  <div><small>Titular</small><span>{{ paymentForm.cardName || 'NOMBRE DEL TITULAR' }}</span></div>
                  <div><small>Expira</small><span>{{ paymentForm.expiryDate || 'MM/AA' }}</span></div>
                </div>
              </div>

              <div class="form-group">
                <label for="cardName">Nombre en la tarjeta</label>
                <input id="cardName" v-model="paymentForm.cardName" type="text" placeholder="Como aparece en la tarjeta" autocomplete="cc-name" required />
              </div>

              <div class="form-group">
                <label for="cardNumber">Número de tarjeta</label>
                <div class="card-number-field">
                  <input id="cardNumber" type="text" inputmode="numeric" :value="paymentForm.cardNumber" placeholder="0000 0000 0000 0000" maxlength="19" autocomplete="cc-number" required @input="formatCardNumber" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2.5" y="5" width="19" height="14" rx="3"/><path d="M2.5 10h19"/></svg>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="expiry">Fecha de expiración</label>
                  <input id="expiry" type="text" inputmode="numeric" :value="paymentForm.expiryDate" placeholder="MM/AA" maxlength="5" autocomplete="cc-exp" required @input="formatExpiry" />
                </div>
                <div class="form-group">
                  <label for="cvv">Código de seguridad</label>
                  <div class="cvv-field">
                    <input id="cvv" type="password" inputmode="numeric" :value="paymentForm.cvv" placeholder="CVV" maxlength="4" autocomplete="cc-csc" required @input="formatCvv" />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M9.7 9a2.5 2.5 0 0 1 4.8 1c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- OXXO -->
            <div v-else-if="activeTab === 'oxxo'" class="method-content">
              <div class="alternative-payment">
                <div class="alternative-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 4h16v16H4z"/><path d="M8 8v8M11 8v8M15 8v8M18 8v8"/></svg></div>
                <h4>Pago en efectivo</h4>
                <p>Generaremos una referencia y código de barras para realizar el pago en una sucursal OXXO.</p>
                <div class="process-steps">
                  <div><span>1</span><p>Genera tu referencia</p></div>
                  <div><span>2</span><p>Paga en una sucursal</p></div>
                  <div><span>3</span><p>Activamos tu plan</p></div>
                </div>
              </div>
            </div>

            <!-- PAYPAL -->
            <div v-else class="method-content">
              <div class="alternative-payment">
                <div class="alternative-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 19 9.5 5h5.2c3.1 0 4.8 1.5 4.3 4.2-.5 2.8-2.5 4.4-5.5 4.4H11L10 19H7Z"/></svg></div>
                <h4>Pagar con PayPal</h4>
                <p>Al continuar serás redirigido a PayPal para autorizar el pago de forma segura.</p>
                <div class="external-payment">Serás redirigido para completar el pago
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M7 17 17 7M8 7h9v9"/></svg>
                </div>
              </div>
            </div>
          </template>
        </section>

        <!-- DERECHA / RESUMEN -->
        <aside class="summary-panel">
          <div class="summary-sticky">
            <div class="section-heading summary-heading">
              <span class="step-number">2</span>
              <div><h3>Resumen de compra</h3><p>Revisa tu plan antes de continuar.</p></div>
            </div>

            <div class="selected-plan">
              <div class="selected-plan-top">
                <span class="plan-label">Plan seleccionado</span>
                <span v-if="paymentForm.selectedPackage === 'Pro'" class="popular-badge">Completo</span>
              </div>
              <div class="selected-plan-main">
                <div><h4>{{ currentPlan?.name }}</h4><p>{{ currentPlan?.description }}</p></div>
                <div class="selected-price"><strong>{{ currentPlan?.formattedPrice }}</strong><span>MXN {{ currentPlan?.period }}</span></div>
              </div>
            </div>

            <details class="plans-dropdown">
              <summary>
                <span>Cambiar plan</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 10 5 5 5-5"/></svg>
              </summary>
              <div class="plans-list">
                <label v-for="plan in PLANS_CONFIG" :key="plan.name" class="plan-option" :class="{ selected: paymentForm.selectedPackage === plan.name }">
                  <input type="radio" name="plan" :value="plan.name" :checked="paymentForm.selectedPackage === plan.name" @change="updateSelectedPackage(plan.name)" />
                  <span class="plan-radio"><span></span></span>
                  <span class="plan-info"><strong>{{ plan.name }}</strong><small>{{ plan.description }}</small></span>
                  <span class="plan-option-price">{{ plan.formattedPrice }}</span>
                </label>
              </div>
            </details>

            <div class="receipt">
              <div class="receipt-row"><span>Subtotal</span><strong>{{ currentPlan?.formattedPrice }} MXN</strong></div>
              <div class="receipt-row"><span>IVA</span><strong>Incluido</strong></div>
              <div class="receipt-divider"></div>
              <div class="receipt-total">
                <div><span>Total a pagar hoy</span><small>Importe final en pesos mexicanos</small></div>
                <strong>{{ currentPlan?.formattedPrice }} <small>MXN</small></strong>
              </div>
            </div>

            <button type="submit" class="pay-btn" :disabled="isLoading">
              <span v-if="isLoading" class="spinner"></span>
              <template v-else>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>
                <span>{{ isFreeTrial ? 'Activar prueba gratuita' : `Pagar ${currentPlan?.formattedPrice} MXN` }}</span>
              </template>
            </button>

            <div class="security-footer">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>
              <div><strong>Pago protegido</strong><span>Tu información de pago se procesa de forma segura.</span></div>
            </div>
          </div>
        </aside>

      </form>
    </div>
  </div>
</template>

<style scoped>
*{box-sizing:border-box}

.payment-overlay{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;overflow:hidden;overscroll-behavior:contain;background:rgba(0,0,0,.82);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px)}

.checkout{width:min(1120px,100%);max-height:94vh;display:flex;flex-direction:column;overflow:hidden;background:#101112;border:1px solid #303236;border-radius:20px;color:#f5f5f4;font-family:Inter,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-shadow:0 35px 90px rgba(0,0,0,.72);animation:checkoutIn .24s cubic-bezier(.16,1,.3,1)}
@keyframes checkoutIn{from{opacity:0;transform:translateY(10px) scale(.985)}to{opacity:1;transform:none}}
@media(prefers-reduced-motion:reduce){.checkout{animation:none}.spinner{animation-duration:2s}}

/* HEADER */
.checkout-header{min-height:82px;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:17px 22px;border-bottom:1px solid #292b2e;background:#151617}
.checkout-brand{min-width:0;display:flex;align-items:center;gap:13px}
.secure-icon{width:42px;height:42px;flex:0 0 42px;display:grid;place-items:center;border-radius:12px;background:linear-gradient(145deg,#2d64e8,#1b3f9c);color:#fff;box-shadow:0 8px 20px rgba(35,88,220,.35),inset 0 1px 0 rgba(255,255,255,.18)}
.secure-icon svg{width:22px;height:22px}
.checkout-brand h2{margin:0 0 4px;color:#fff;font-size:18px;font-weight:750;letter-spacing:-.25px}
.checkout-brand p{margin:0;color:#999ca3;font-size:12px;line-height:1.45}
.close-btn{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;padding:0;border:1px solid #303236;border-radius:10px;background:#191a1c;color:#a4a6ab;cursor:pointer;transition:.2s}
.close-btn:hover{background:#242527;border-color:#424448;color:#fff}
.close-btn svg{width:18px;height:18px}

/* BODY */
.checkout-body{min-height:0;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(350px,.8fr);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#293b5d transparent}
.payment-panel{min-width:0;padding:26px 28px 30px}
.summary-panel{min-width:0;padding:26px;background:#0d0e0f;border-left:1px solid #292b2e}
.summary-sticky{display:flex;flex-direction:column;gap:16px}

/* SECTION HEADINGS */
.section-heading{display:flex;align-items:flex-start;gap:11px;margin-bottom:20px}
.step-number{width:26px;height:26px;flex:0 0 26px;display:grid;place-items:center;border-radius:7px;background:#173574;color:#82a9ff;font-size:11px;font-weight:800}
.section-heading h3{margin:1px 0 4px;color:#f7f7f7;font-size:16px;font-weight:720}
.section-heading p{margin:0;color:#92959b;font-size:11.5px;line-height:1.45}
.summary-heading{margin-bottom:2px}

/* PAYMENT METHODS */
.payment-methods{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin-bottom:16px}
.method-btn{min-width:0;min-height:82px;position:relative;display:flex;flex-direction:column;align-items:flex-start;justify-content:center;gap:7px;padding:12px;border:1px solid #34363a;border-radius:11px;background:#18191b;color:#f5f5f4;font-family:inherit;text-align:left;cursor:pointer;transition:border-color .2s,background .2s,transform .2s}
.method-btn:hover{background:#1d1e20;border-color:#4a4d52}
.method-btn.active{background:#111a2d;border-color:#356ee8;box-shadow:inset 0 0 0 1px rgba(53,110,232,.08)}
.method-icon{width:25px;height:25px;display:grid;place-items:center;color:#9da0a6}
.method-icon svg{width:19px;height:19px}
.method-btn.active .method-icon{color:#76a1ff}
.method-btn>span:nth-child(2){min-width:0;display:flex;flex-direction:column;gap:2px}
.method-btn strong{color:#f1f1f1;font-size:12px;font-weight:700}
.method-btn small{overflow:hidden;max-width:100%;color:#8e9197;font-size:9.5px;white-space:nowrap;text-overflow:ellipsis}
.method-radio{position:absolute;top:11px;right:11px;width:13px;height:13px;display:grid;place-items:center;border:1px solid #64676d;border-radius:50%}
.method-radio span{width:5px;height:5px;border-radius:50%;background:#74a0ff;opacity:0}
.method-btn.active .method-radio{border-color:#74a0ff}
.method-btn.active .method-radio span{opacity:1}

/* METHOD CONTENT */
.method-content{padding:19px;border:1px solid #303236;border-radius:13px;background:#151617}
.method-title{display:flex;justify-content:space-between;gap:16px;margin-bottom:17px}
.method-title h4{margin:8px 0 4px;color:#f4f4f4;font-size:14px;font-weight:700}
.method-title p{margin:0;color:#96999f;font-size:11.5px;line-height:1.5}
.method-title-icon{width:23px;height:23px;flex-shrink:0;color:#81848a}
.recommended-badge{display:inline-flex;padding:4px 7px;border-radius:5px;background:#183873;color:#86aaff;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.3px}

/* FORM */
.form-group{display:flex;flex-direction:column;gap:7px;margin-top:14px}
.form-group label{color:#c3c5c9;font-size:11.5px;font-weight:650}
.form-group input,.form-group select{width:100%;height:48px;padding:0 14px;border:1px solid #383a3e;border-radius:10px;outline:none;background:#111213;color:#f1f1f1;font-family:inherit;font-size:13px;transition:.2s}
.form-group input::placeholder{color:#696c72}
.form-group input:hover,.form-group select:hover{border-color:#505359}
.form-group input:focus,.form-group select:focus{border-color:#3d73e6;box-shadow:0 0 0 3px rgba(48,103,222,.13)}
.select-wrapper{position:relative}
.select-wrapper select{appearance:none;-webkit-appearance:none;padding-right:40px;cursor:pointer}
.select-wrapper>svg{position:absolute;top:50%;right:13px;width:15px;height:15px;transform:translateY(-50%);color:#96999f;pointer-events:none}
.select-wrapper option{background:#17181a;color:#f5f5f4}
.form-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}

.info-box{display:flex;align-items:flex-start;gap:9px;margin-top:16px;padding:12px;border:1px solid #273e69;border-radius:9px;background:#121b2d;color:#b2bed4}
.info-box svg{width:15px;height:15px;flex-shrink:0;margin-top:1px;color:#78a0f5}
.info-box p{margin:0;font-size:10.5px;line-height:1.5}

/* CREDIT CARD */
.card-preview{width:100%;aspect-ratio:1.586/1;max-height:220px;display:flex;flex-direction:column;justify-content:space-between;position:relative;overflow:hidden;padding:22px;margin-bottom:20px;border:1px solid #3b3e44;border-radius:17px;background:radial-gradient(circle at 90% 5%,rgba(55,91,170,.22),transparent 42%),linear-gradient(135deg,#1b1d20 0%,#111214 58%,#12192a 100%);box-shadow:0 16px 35px rgba(0,0,0,.32)}
.card-preview:after{content:"";position:absolute;width:180px;height:180px;right:-85px;bottom:-105px;border:1px solid rgba(255,255,255,.04);border-radius:50%;pointer-events:none}
.card-preview-top,.preview-footer{position:relative;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:12px}

.card-chip{width:39px;height:29px;position:relative;overflow:hidden;border-radius:6px;background:linear-gradient(135deg,#e0c36f,#a47d26);box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
.card-chip:before,.card-chip:after{content:"";position:absolute;background:rgba(83,56,5,.28)}
.card-chip:before{left:50%;top:0;width:1px;height:100%}
.card-chip:after{left:0;top:50%;width:100%;height:1px}
.card-chip span{position:absolute;left:7px;right:7px;top:9px;height:11px;border:1px solid rgba(83,56,5,.3);border-radius:3px;background:transparent}

.brands{display:flex;align-items:center;gap:5px}
.brand{padding:3px 5px;border-radius:4px;background:#25272b;color:#73767c;font-size:8px;font-weight:800;letter-spacing:.15px}
.brand.active{background:#294b91;color:#fff}

.preview-number{position:relative;z-index:1;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#f2f2f3;font-size:clamp(16px,2.2vw,21px);font-weight:600;letter-spacing:2.1px;text-shadow:0 1px 2px rgba(0,0,0,.35)}

.preview-footer>div{min-width:0;display:flex;flex-direction:column;gap:4px}
.preview-footer>div:last-child{align-items:flex-end}
.preview-footer small{color:#83868d;font-size:8px;font-weight:650;text-transform:uppercase;letter-spacing:.7px}
.preview-footer span{overflow:hidden;max-width:240px;color:#e2e2e3;font-size:10.5px;font-weight:700;white-space:nowrap;text-overflow:ellipsis}

.card-number-field,.cvv-field{position:relative}
.card-number-field input,.cvv-field input{padding-right:40px}
.card-number-field svg,.cvv-field svg{position:absolute;top:50%;right:13px;width:16px;height:16px;transform:translateY(-50%);color:#82858b}

/* ALTERNATIVE PAYMENTS */
.alternative-payment{display:flex;flex-direction:column;align-items:center;padding:18px 8px 8px;text-align:center}
.alternative-icon{width:48px;height:48px;display:grid;place-items:center;margin-bottom:13px;border-radius:12px;background:#111b30;border:1px solid #203a69;color:#78a1f6}
.alternative-icon svg{width:23px;height:23px}
.alternative-payment h4{margin:0 0 6px;color:#f4f4f4;font-size:14px;font-weight:700}
.alternative-payment>p{max-width:390px;margin:0;color:#95989e;font-size:11.5px;line-height:1.55}

.process-steps{width:100%;display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:18px}
.process-steps div{padding:12px 7px;border:1px solid #292b2e;border-radius:9px;background:#121315}
.process-steps span{width:22px;height:22px;display:grid;place-items:center;margin:0 auto 7px;border-radius:50%;background:#17336c;color:#8badf7;font-size:9px;font-weight:800}
.process-steps p{margin:0;color:#a2a5aa;font-size:9.5px;line-height:1.35}

.external-payment{display:flex;align-items:center;gap:7px;margin-top:18px;padding:10px 12px;border:1px solid #292b2e;border-radius:8px;background:#121315;color:#9b9ea4;font-size:10px}
.external-payment svg{width:13px;height:13px}

/* FREE TRIAL */
.trial-card{display:flex;gap:15px;padding:20px;border:1px solid #294d93;border-radius:13px;background:#111a2b}
.trial-icon{width:46px;height:46px;flex:0 0 46px;display:grid;place-items:center;border-radius:11px;background:#17346e;color:#84aaff}
.trial-icon svg{width:22px;height:22px}
.trial-content{min-width:0}
.trial-badge{display:inline-flex;padding:4px 8px;border-radius:5px;background:#21458d;color:#a4beff;font-size:9px;font-weight:800;text-transform:uppercase}
.trial-content h4{margin:10px 0 6px;color:#f5f5f5;font-size:15px;font-weight:700}
.trial-content>p{margin:0;color:#9da0a6;font-size:11.5px;line-height:1.5}
.trial-features{display:flex;flex-wrap:wrap;gap:9px 14px;margin-top:14px}
.trial-features span{display:flex;align-items:center;gap:5px;color:#afb1b6;font-size:10px}
.trial-features svg{width:12px;height:12px;fill:none;stroke:#65c68b;stroke-width:2.2}

/* SELECTED PLAN */
.selected-plan{padding:16px;border:1px solid #31549a;border-radius:12px;background:#111827}
.selected-plan-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}
.plan-label{color:#9297a2;font-size:9px;font-weight:750;text-transform:uppercase;letter-spacing:.55px}
.popular-badge{padding:4px 7px;border-radius:5px;background:#143d2b;color:#83d2a2;font-size:8px;font-weight:800;text-transform:uppercase}
.selected-plan-main{display:flex;justify-content:space-between;align-items:flex-start;gap:16px}
.selected-plan-main>div:first-child{min-width:0}
.selected-plan h4{margin:0 0 5px;color:#fff;font-size:15px;font-weight:720}
.selected-plan p{margin:0;color:#969ba4;font-size:10.5px;line-height:1.45}
.selected-price{flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:3px}
.selected-price strong{color:#fff;font-size:17px;font-weight:750}
.selected-price span{color:#92969e;font-size:9px}

/* PLANS DROPDOWN */
.plans-dropdown{border:1px solid #303236;border-radius:11px;background:#141517}
.plans-dropdown summary{min-height:44px;display:flex;align-items:center;justify-content:space-between;gap:10px;padding:0 13px;color:#c1c3c7;font-size:11px;font-weight:650;cursor:pointer;list-style:none}
.plans-dropdown summary::-webkit-details-marker{display:none}
.plans-dropdown summary svg{width:14px;height:14px;color:#888b91;transition:transform .2s}
.plans-dropdown[open] summary svg{transform:rotate(180deg)}
.plans-list{max-height:240px;display:flex;flex-direction:column;gap:4px;overflow-y:auto;padding:6px;border-top:1px solid #292b2e}
.plan-option{display:flex;align-items:center;gap:9px;padding:10px;border:1px solid transparent;border-radius:8px;cursor:pointer;transition:.15s}
.plan-option:hover{background:#1b1c1e}
.plan-option.selected{background:#111a2c;border-color:#294b8f}
.plan-option input{display:none}
.plan-radio{width:14px;height:14px;flex:0 0 14px;display:grid;place-items:center;border:1px solid #6c6f75;border-radius:50%}
.plan-radio span{width:6px;height:6px;border-radius:50%;background:#6f9cf7;opacity:0}
.plan-option.selected .plan-radio{border-color:#6f9cf7}
.plan-option.selected .plan-radio span{opacity:1}
.plan-info{min-width:0;flex:1;display:flex;flex-direction:column;gap:3px}
.plan-info strong{color:#e5e5e6;font-size:11px;font-weight:650}
.plan-info small{overflow:hidden;color:#8f9298;font-size:9px;white-space:nowrap;text-overflow:ellipsis}
.plan-option-price{flex-shrink:0;color:#d5d6d8;font-size:10.5px;font-weight:700}

/* RECEIPT */
.receipt{display:flex;flex-direction:column;gap:11px;padding:15px;border:1px solid #303236;border-radius:11px;background:#151617}
.receipt-row{display:flex;justify-content:space-between;gap:10px;color:#a5a7ac;font-size:10.5px}
.receipt-row strong{color:#d2d3d5;font-weight:600}
.receipt-divider{height:1px;margin:3px 0;background:#303236}
.receipt-total{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
.receipt-total>div{display:flex;flex-direction:column;gap:3px}
.receipt-total span{color:#f0f0f1;font-size:11.5px;font-weight:700}
.receipt-total>div small{color:#81848a;font-size:8.5px}
.receipt-total>strong{color:#fff;font-size:21px;font-weight:780;white-space:nowrap}
.receipt-total>strong small{color:#92959b;font-size:8px;font-weight:550}

/* PAY BUTTON */
.pay-btn{width:100%;min-height:50px;display:flex;align-items:center;justify-content:center;gap:8px;padding:11px 15px;border:0;border-radius:10px;background:#2358dc;color:#fff;font-family:inherit;font-size:12.5px;font-weight:750;cursor:pointer;box-shadow:0 10px 24px rgba(28,79,214,.24);transition:.2s}
.pay-btn:hover:not(:disabled){background:#2d64e8;transform:translateY(-1px);box-shadow:0 13px 28px rgba(28,79,214,.3)}
.pay-btn:disabled{opacity:.65;cursor:not-allowed}
.pay-btn svg{width:15px;height:15px}
.spinner{width:17px;height:17px;border:2px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}

/* SECURITY FOOTER */
.security-footer{display:flex;align-items:center;justify-content:center;gap:8px;padding-top:3px}
.security-footer>svg{width:15px;height:15px;flex-shrink:0;color:#62c38a}
.security-footer>div{display:flex;flex-direction:column;gap:2px}
.security-footer strong{color:#c1c3c7;font-size:9.5px;font-weight:650}
.security-footer span{color:#82858b;font-size:8.5px}

/* TABLET */
@media(max-width:850px){
  .payment-overlay{padding:12px}
  .checkout{max-height:96vh;border-radius:17px}
  .checkout-body{grid-template-columns:1fr}
  .summary-panel{border-left:0;border-top:1px solid #292b2e}
  .payment-panel,.summary-panel{padding:22px}
  .summary-sticky{max-width:none}
  .card-preview{max-width:540px}
}

/* MOBILE */
@media(max-width:560px){
  .payment-overlay{padding:0;align-items:flex-end;background:rgba(0,0,0,.88)}
  .checkout{width:100%;height:100dvh;max-height:100dvh;border-radius:0;border-left:0;border-right:0;border-bottom:0}
  .checkout-header{min-height:70px;padding:13px 15px}
  .secure-icon{width:38px;height:38px;flex-basis:38px}
  .checkout-brand h2{font-size:16px}
  .checkout-brand p{display:none}
  .close-btn{width:36px;height:36px;flex-basis:36px}

  .payment-panel,.summary-panel{padding:20px 15px}
  .section-heading{margin-bottom:17px}
  .section-heading h3{font-size:15px}
  .section-heading p{font-size:10.5px}

  .payment-methods{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .method-btn{min-height:78px;padding:11px}
  .method-btn strong{font-size:11.5px}
  .method-btn small{font-size:9px}

  .method-content{padding:15px}
  .method-title h4{font-size:13.5px}
  .method-title p{font-size:10.5px}

  .form-group label{font-size:11px}
  .form-group input,.form-group select{height:48px;font-size:13px}

  .card-preview{width:100%;height:auto;max-height:none;aspect-ratio:1.586/1;padding:17px;border-radius:14px}
  .card-chip{width:34px;height:25px}
  .preview-number{font-size:clamp(14px,4.5vw,18px);letter-spacing:1.4px}
  .preview-footer small{font-size:7px}
  .preview-footer span{max-width:180px;font-size:9px}

  .selected-plan-main{gap:10px}
  .selected-plan h4{font-size:14px}
  .selected-price strong{font-size:15px}

  .plans-list{max-height:none;overflow:visible}

  .receipt-total>strong{font-size:19px}
  .pay-btn{min-height:50px;font-size:12px}

  .alternative-payment{padding:14px 4px 5px}
  .alternative-payment>p{font-size:10.5px}
  .process-steps{grid-template-columns:repeat(3,1fr);gap:5px}
  .process-steps div{padding:10px 4px}
  .process-steps p{font-size:8px}
}

/* SMALL MOBILE */
@media(max-width:390px){
  .payment-panel,.summary-panel{padding:18px 13px}
  .method-content{padding:13px}
  .form-row{grid-template-columns:1fr;gap:0}
  .card-preview{padding:15px}
  .preview-number{font-size:13.5px;letter-spacing:1.1px}
  .preview-footer span{max-width:145px;font-size:8.5px}
  .selected-plan-main{flex-direction:column}
  .selected-price{align-items:flex-start}
  .receipt-total{align-items:flex-start;flex-direction:column}
  .process-steps{grid-template-columns:1fr}
}

/* MUY PEQUEÑO */
@media(max-width:330px){
  .payment-methods{grid-template-columns:1fr}
  .method-btn{min-height:64px}
}
</style>
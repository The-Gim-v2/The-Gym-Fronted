<template>
  <div class="modal-overlay">
    <div class="form-panel glass-effect">
      <NotificationSystem ref="toastRef" />
      
      <div class="panel-header">
        <div class="title-group">
          <h2 class="form-title">{{ t('reactivateTitle') }} <span class="highlight">{{ t('account') }}</span></h2>
          <p class="form-subtitle">{{ t('reactivateSubtitle') }}</p>
        </div>
        <button class="close-x" @click="$emit('close')" :aria-label="t('close')">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>
      
      <form class="form-body" @submit.prevent="handleSubmit">
        <div class="input-group">
          <label for="usuario">{{ t('accountOrEmail') }}</label>
          <div class="input-wrapper">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <input id="usuario" v-model="form.usuario" type="text" placeholder="usuario@correo.com" required />
          </div>
        </div>

        <div class="desglose-grid">
          <div class="input-group">
            <label for="deuda">{{ t('pendingDebt') }} ($)</label>
            <div class="input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <line x1="12" y1="1" x2="12" y2="23"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              <input id="deuda" v-model.number="form.deudaPendiente" type="number" min="0" step="0.01" required />
            </div>
          </div>

          <div class="input-group">
            <label for="recargo">{{ t('activationFee') }} ($)</label>
            <div class="input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <input id="recargo" v-model.number="form.recargoTiempo" type="number" min="0" step="0.01" required />
            </div>
          </div>
        </div>

        <div class="total-card">
          <div class="total-info">
            <span class="total-label">{{ t('totalToCharge') }}</span>
            <span class="total-sub">{{ t('totalSub') }}</span>
          </div>
          <div class="total-amount">
            ${{ totalAPagar.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
        </div>

        <div class="row-inputs">
          <div class="input-group">
            <label for="metodo">{{ t('paymentMethod') }}</label>
            <div class="input-wrapper select-wrapper-container">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <select id="metodo" v-model="form.metodoPago" required>
                <option disabled value="">{{ t('select') }}</option>
                <option value="Efectivo">{{ t('cash') }}</option>
                <option value="Transferencia">{{ t('transfer') }}</option>
                <option value="Tarjeta">{{ t('card') }}</option>
              </select>
              <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </div>
          </div>

          <div class="input-group">
            <label for="referencia">{{ t('reference') }}</label>
            <div class="input-wrapper">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              <input id="referencia" v-model="form.referencia" type="text" :placeholder="t('referencePlaceholder')" />
            </div>
          </div>
        </div>

        <button type="submit" class="submit-btn">
          <span>{{ t('btnProcess') }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted } from 'vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

const emit = defineEmits(['close', 'reactivate']);
const toastRef = ref<any>(null);

const settings = reactive({
  idioma: localStorage.getItem('Recepcion-idioma') || 'es'
});

const translations: Record<string, Record<string, string>> = {
  es: {
    reactivateTitle: "REACTIVAR",
    account: "CUENTA",
    reactivateSubtitle: "Desglose de adeudo, recargos y pago para reactivación",
    close: "Cerrar modal",
    accountOrEmail: "Cuenta o Correo",
    pendingDebt: "Deuda Pendiente",
    activationFee: "Recargo Activación",
    totalToCharge: "TOTAL A COBRAR",
    totalSub: "Adeudo + recargo por baja",
    paymentMethod: "Método de Pago",
    select: "Seleccionar",
    cash: "Efectivo",
    transfer: "Transferencia",
    card: "Tarjeta",
    reference: "Folio / Referencia",
    referencePlaceholder: "N° de comprobante",
    btnProcess: "Procesar Pago y Reactivar",
    toastSuccess: "¡Cuenta de {user} reactivada con éxito!"
  },
  en: {
    reactivateTitle: "REACTIVATE",
    account: "ACCOUNT",
    reactivateSubtitle: "Debt breakdown, surcharges, and payment for reactivation",
    close: "Close modal",
    accountOrEmail: "Account or Email",
    pendingDebt: "Pending Debt",
    activationFee: "Activation Fee",
    totalToCharge: "TOTAL TO CHARGE",
    totalSub: "Debt + reactivation surcharge",
    paymentMethod: "Payment Method",
    select: "Select",
    cash: "Cash",
    transfer: "Wire Transfer",
    card: "Credit/Debit Card",
    reference: "Folio / Reference",
    referencePlaceholder: "Voucher number",
    btnProcess: "Process Payment and Reactivate",
    toastSuccess: "Account {user} reactivated successfully!"
  }
};

const t = (key: string) => {
  return translations[settings.idioma]?.[key] || translations['es']?.[key] || key;
};

const form = reactive({
  usuario: '',
  deudaPendiente: 500,
  recargoTiempo: 200,
  metodoPago: '',
  referencia: ''
});

const totalAPagar = computed(() => (Number(form.deudaPendiente) || 0) + (Number(form.recargoTiempo) || 0));

const handleSubmit = () => {
  if (toastRef.value?.notify) {
    const msg = t('toastSuccess').replace('{user}', form.usuario || 'usuario');
    toastRef.value.notify(msg, 'success');
  }
  emit('reactivate', { ...form, total: totalAPagar.value });
};

onMounted(() => {
  window.addEventListener('idioma-changed', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.idioma) settings.idioma = customEvent.detail.idioma;
  });
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  padding: 12px;
  box-sizing: border-box;
}

.form-panel { 
  background: var(--bg-cards, #121214); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08)); 
  color: var(--color-texto-general, #f5f5f4); 
  border-radius: var(--app-border-radius, 20px); 
  padding: 24px; 
  width: 100%; 
  max-width: 480px; 
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
}

.panel-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 18px; 
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.form-title { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.2rem; 
  color: var(--color-titulos, #fff); 
  letter-spacing: 0.8px;
  margin: 0;
}

.form-subtitle {
  font-size: 0.78rem;
  color: var(--color-texto-secundario, #888);
  margin: 0;
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
}

.form-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.desglose-grid, .row-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.input-group label {
  font-size: 0.75rem;
  color: var(--color-texto-secundario, #a1a1aa);
  font-family: 'Oswald', sans-serif;
  letter-spacing: 0.5px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--color-texto-secundario, #71717a);
  pointer-events: none;
  z-index: 2;
}

.input-wrapper input,
.input-wrapper select {
  width: 100%;
  background: var(--bg-input, #09090b);
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 12px);
  padding: 11px 12px 11px 38px;
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  font-size: 0.88rem;
  outline: none;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

/* Estilo y corrección absoluta para el select */
.input-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  padding-right: 32px;
  text-overflow: ellipsis;
}

.select-wrapper-container {
  position: relative;
}

.select-arrow {
  position: absolute;
  right: 12px;
  color: var(--color-texto-secundario, #71717a);
  pointer-events: none;
}

.input-wrapper select option {
  background-color: var(--bg-input, #18181b);
  color: var(--color-texto-general, #fff);
  padding: 12px;
}

.input-wrapper input:focus,
.input-wrapper select:focus {
  border-color: var(--color-highlight, rgba(59, 130, 246, 0.5));
  background: var(--bg-cards, rgba(255, 255, 255, 0.02));
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.total-card {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: var(--app-border-radius, 14px);
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.total-label {
  font-family: 'Oswald', sans-serif;
  font-size: 0.85rem;
  color: #60a5fa;
  letter-spacing: 0.5px;
}

.total-sub {
  font-size: 0.68rem;
  color: var(--color-texto-secundario, #71717a);
}

.total-amount {
  font-family: 'Oswald', sans-serif;
  font-size: 1.4rem;
  color: #34d399;
  letter-spacing: 0.5px;
}

.submit-btn {
  background: var(--color-highlight, #3b82f6);
  color: #fff;
  border: none;
  border-radius: var(--app-border-radius, 12px);
  padding: 13px;
  font-family: 'Oswald', sans-serif;
  font-size: 0.95rem;
  letter-spacing: 0.8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 4px;
  transition: background 0.2s, transform 0.2s;
}

.submit-btn:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.close-x { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.08); 
  color: var(--color-texto-secundario, #aaa); 
  cursor: pointer; 
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-x:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-titulos, #fff);
}

/* Responsividad mejorada para móviles */
@media (max-width: 520px) {
  .modal-overlay {
    padding: 8px;
  }
  .form-panel { 
    padding: 16px; 
    border-radius: 16px;
    max-height: 95vh;
  }
  .desglose-grid, .row-inputs { 
    grid-template-columns: 1fr; 
    gap: 12px;
  }
  .form-title {
    font-size: 1.1rem;
  }
  .total-amount {
    font-size: 1.25rem;
  }
}
</style>
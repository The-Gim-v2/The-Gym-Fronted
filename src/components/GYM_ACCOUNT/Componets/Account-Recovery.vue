<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <section class="reactivate-panel" role="dialog" aria-modal="true" :aria-label="t('reactivateTitle')">
      <NotificationSystem ref="toastRef" />
      <header class="panel-header">
        <div class="header-copy">
          <span class="eyebrow"><i></i>{{ t('operationLabel') }}</span>
          <h2>{{ t('reactivateTitle') }} <strong>{{ t('account') }}</strong></h2>
          <p>{{ t('reactivateSubtitle') }}</p>
        </div>
        <button type="button" class="close-button" @click="emit('close')" :aria-label="t('close')">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>
      </header>

      <form class="form-body" @submit.prevent="handleSubmit">
        <section class="form-section account-section">
          <div class="section-heading">
            <span class="section-number">01</span>
            <div><strong>{{ t('accountData') }}</strong><small>{{ t('accountDataSub') }}</small></div>
          </div>
          <div class="input-group full-width">
            <label for="usuario">{{ t('accountOrEmail') }}</label>
            <div class="field-control">
              <svg class="field-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <input id="usuario" v-model.trim="form.usuario" type="text" placeholder="usuario@correo.com" autocomplete="username" required />
            </div>
          </div>
        </section>

        <section class="form-section debt-section">
          <div class="section-heading">
            <span class="section-number">02</span>
            <div><strong>{{ t('debtBreakdown') }}</strong><small>{{ t('debtBreakdownSub') }}</small></div>
          </div>
          <div class="debt-grid">
            <div class="input-group">
              <label for="deuda">{{ t('pendingDebt') }} ($)</label>
              <div class="field-control money-field">
                <span class="currency-symbol">$</span>
                <input id="deuda" v-model.number="form.deudaPendiente" type="number" min="0" step="0.01" inputmode="decimal" required />
                <span class="currency-code">MXN</span>
              </div>
            </div>
            <div class="input-group">
              <label for="recargo">{{ t('activationFee') }} ($)</label>
              <div class="field-control money-field">
                <span class="currency-symbol">$</span>
                <input id="recargo" v-model.number="form.recargoTiempo" type="number" min="0" step="0.01" inputmode="decimal" required />
                <span class="currency-code">MXN</span>
              </div>
            </div>
          </div>
        </section>

        <section class="charge-summary">
          <div class="summary-copy">
            <span class="summary-kicker">{{ t('totalToCharge') }}</span>
            <strong>{{ t('totalSub') }}</strong>
            <small>{{ t('summaryHint') }}</small>
          </div>
          <div class="summary-amount"><span>$</span><strong>{{ formattedTotal }}</strong><small>MXN</small></div>
        </section>

        <section class="form-section payment-section">
          <div class="section-heading">
            <span class="section-number">03</span>
            <div><strong>{{ t('paymentData') }}</strong><small>{{ t('paymentDataSub') }}</small></div>
          </div>
          <div class="payment-grid">
            <div class="input-group">
              <label for="metodo">{{ t('paymentMethod') }}</label>
              <div class="field-control">
                <svg class="field-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>
                <select id="metodo" v-model="form.metodoPago" required>
                  <option disabled value="">{{ t('select') }}</option>
                  <option value="Efectivo">{{ t('cash') }}</option>
                  <option value="Transferencia">{{ t('transfer') }}</option>
                  <option value="Tarjeta">{{ t('card') }}</option>
                </select>
                <svg class="select-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5"/></svg>
              </div>
            </div>
            <div class="input-group">
              <label for="referencia">{{ t('reference') }}</label>
              <div class="field-control">
                <svg class="field-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h5"/></svg>
                <input id="referencia" v-model.trim="form.referencia" type="text" :placeholder="t('referencePlaceholder')" />
              </div>
            </div>
          </div>
        </section>

        <div class="transaction-review">
          <div><span>{{ t('reviewLabel') }}</span><strong>{{ t('reviewTitle') }}</strong></div>
          <div class="review-status"><i></i>{{ t('ready') }}</div>
        </div>

        <footer class="panel-actions">
          <button type="button" class="secondary-button" @click="emit('close')">{{ t('cancel') }}</button>
          <button type="submit" class="submit-button">
            <span class="button-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6"/></svg></span>
            <span class="button-copy"><strong>{{ t('btnProcess') }}</strong><small>{{ t('btnProcessSub') }}</small></span>
            <svg class="button-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </footer>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref, onMounted, onUnmounted } from 'vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'reactivate', payload: { usuario: string; deudaPendiente: number; recargoTiempo: number; metodoPago: string; referencia: string; total: number }): void;
}>();

const toastRef = ref<InstanceType<typeof NotificationSystem> | null>(null);
const settings = reactive({ idioma: localStorage.getItem('GYM_ACCOUNT-idioma') || 'es' });

const translations: Record<string, Record<string, string>> = {
  es: {
    operationLabel: 'OPERACIONES / REACTIVACIÓN', reactivateTitle: 'REACTIVAR', account: 'CUENTA',
    reactivateSubtitle: 'Regulariza el adeudo y registra el pago para habilitar nuevamente la cuenta.', close: 'Cerrar modal',
    accountData: 'Cuenta del cliente', accountDataSub: 'Identifica la cuenta que será reactivada.', accountOrEmail: 'Cuenta o correo',
    debtBreakdown: 'Desglose del adeudo', debtBreakdownSub: 'Verifica los importes antes de procesar el cobro.', pendingDebt: 'Deuda pendiente', activationFee: 'Recargo de activación',
    totalToCharge: 'TOTAL A COBRAR', totalSub: 'Adeudo + recargo por reactivación', summaryHint: 'Importe final que se registrará en la operación.',
    paymentData: 'Datos del pago', paymentDataSub: 'Selecciona el método y registra la referencia correspondiente.', paymentMethod: 'Método de pago',
    select: 'Seleccionar', cash: 'Efectivo', transfer: 'Transferencia', card: 'Tarjeta', reference: 'Folio / Referencia', referencePlaceholder: 'N° de comprobante',
    reviewLabel: 'RESUMEN', reviewTitle: 'Operación lista para procesar', ready: 'Listo', cancel: 'Cancelar', btnProcess: 'Procesar pago y reactivar', btnProcessSub: 'Registrar operación',
    toastSuccess: '¡Cuenta de {user} reactivada con éxito!'
  },
  en: {
    operationLabel: 'OPERATIONS / REACTIVATION', reactivateTitle: 'REACTIVATE', account: 'ACCOUNT',
    reactivateSubtitle: 'Settle the balance and register the payment to enable the account again.', close: 'Close modal',
    accountData: 'Client account', accountDataSub: 'Identify the account that will be reactivated.', accountOrEmail: 'Account or email',
    debtBreakdown: 'Debt breakdown', debtBreakdownSub: 'Verify the amounts before processing the payment.', pendingDebt: 'Pending debt', activationFee: 'Activation fee',
    totalToCharge: 'TOTAL TO CHARGE', totalSub: 'Debt + reactivation surcharge', summaryHint: 'Final amount that will be registered in the transaction.',
    paymentData: 'Payment details', paymentDataSub: 'Select the method and enter the corresponding reference.', paymentMethod: 'Payment method',
    select: 'Select', cash: 'Cash', transfer: 'Wire transfer', card: 'Credit/Debit card', reference: 'Folio / Reference', referencePlaceholder: 'Voucher number',
    reviewLabel: 'SUMMARY', reviewTitle: 'Transaction ready to process', ready: 'Ready', cancel: 'Cancel', btnProcess: 'Process payment and reactivate', btnProcessSub: 'Register transaction',
    toastSuccess: 'Account {user} reactivated successfully!'
  }
};

const t = (key: string) => translations[settings.idioma]?.[key] || translations.es?.[key] || key;
const form = reactive({ usuario: '', deudaPendiente: 500, recargoTiempo: 200, metodoPago: '', referencia: '' });
const totalAPagar = computed(() => (Number(form.deudaPendiente) || 0) + (Number(form.recargoTiempo) || 0));
const formattedTotal = computed(() => new Intl.NumberFormat(settings.idioma === 'en' ? 'en-US' : 'es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(totalAPagar.value));

const handleSubmit = () => {
  const msg = t('toastSuccess').replace('{user}', form.usuario || (settings.idioma === 'en' ? 'user' : 'usuario'));
  toastRef.value?.notify(msg, 'success');
  emit('reactivate', { ...form, total: totalAPagar.value });
};

const handleLanguageChange = (event: Event) => {
  const customEvent = event as CustomEvent<{ idioma?: string }>;
  if (customEvent.detail?.idioma) settings.idioma = customEvent.detail.idioma;
};

onMounted(() => window.addEventListener('idioma-changed', handleLanguageChange));
onUnmounted(() => window.removeEventListener('idioma-changed', handleLanguageChange));
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600;700&family=Oswald:wght@500;600;700&display=swap');
*{box-sizing:border-box}.modal-overlay{--accent:var(--color-highlight,#3b82f6);--card:var(--bg-cards,#111317);--text:var(--color-texto-general,#f5f7fa);--title:var(--color-titulos,#fff);--button:var(--color-botones,#2563eb);--button-text:var(--color-texto-botones,#fff);--muted:color-mix(in srgb,var(--text) 58%,transparent);--muted-2:color-mix(in srgb,var(--text) 40%,transparent);--line:color-mix(in srgb,var(--text) 10%,transparent);--line-strong:color-mix(in srgb,var(--text) 17%,transparent);--input-bg:color-mix(in srgb,var(--card) 84%,black);position:fixed;inset:0;z-index:5000;display:flex;align-items:center;justify-content:center;padding:24px;background:rgba(0,0,0,.78);font-family:'Inter',sans-serif;color:var(--text)}
.reactivate-panel{width:min(760px,100%);max-height:min(92vh,860px);overflow:auto;border:1px solid var(--line-strong);border-radius:18px;background:var(--card);box-shadow:0 28px 80px rgba(0,0,0,.58)}.reactivate-panel::-webkit-scrollbar{width:7px}.reactivate-panel::-webkit-scrollbar-thumb{border-radius:999px;background:color-mix(in srgb,var(--text) 16%,transparent)}
.panel-header{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;padding:25px 28px 22px;border-bottom:1px solid var(--line);background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 7%,transparent),transparent 45%)}.header-copy{min-width:0}.eyebrow{display:flex;align-items:center;gap:8px;margin-bottom:8px;color:var(--accent);font-size:.67rem;font-weight:800;letter-spacing:.13em}.eyebrow i{width:18px;height:2px;border-radius:99px;background:var(--accent);box-shadow:0 0 12px color-mix(in srgb,var(--accent) 60%,transparent)}.panel-header h2{margin:0;color:var(--title);font-family:'Anton',sans-serif;font-size:clamp(1.55rem,4vw,2.05rem);font-weight:400;line-height:1;letter-spacing:.025em}.panel-header h2 strong{color:var(--accent);font-weight:400}.panel-header p{max-width:540px;margin:9px 0 0;color:var(--muted);font-size:.82rem;line-height:1.55}.close-button{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;padding:0;border:1px solid var(--line);border-radius:10px;background:color-mix(in srgb,var(--card) 88%,white);color:var(--muted);cursor:pointer;transition:background .16s ease,color .16s ease,border-color .16s ease}.close-button:hover{border-color:rgba(248,113,113,.35);background:rgba(248,113,113,.1);color:#f87171}.close-button svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.form-body{display:grid;gap:16px;padding:22px 28px 28px}.form-section{padding:18px;border:1px solid var(--line);border-radius:14px;background:color-mix(in srgb,var(--card) 94%,white)}.section-heading{display:flex;align-items:center;gap:11px;margin-bottom:16px}.section-number{width:30px;height:30px;flex:0 0 30px;display:grid;place-items:center;border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);border-radius:8px;background:color-mix(in srgb,var(--accent) 10%,transparent);color:var(--accent);font-family:'IBM Plex Mono',monospace;font-size:.68rem;font-weight:700}.section-heading>div{display:flex;flex-direction:column;gap:2px}.section-heading strong{color:var(--title);font-family:'Oswald',sans-serif;font-size:.94rem;font-weight:600}.section-heading small{color:var(--muted);font-size:.72rem;line-height:1.4}.input-group{min-width:0;display:flex;flex-direction:column;gap:7px}.input-group label{color:color-mix(in srgb,var(--text) 72%,transparent);font-size:.71rem;font-weight:700;letter-spacing:.025em}.debt-grid,.payment-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.field-control{min-width:0;height:44px;position:relative;display:flex;align-items:center;border:1px solid var(--line-strong);border-radius:10px;background:var(--input-bg);transition:border-color .16s ease,box-shadow .16s ease}.field-control:focus-within{border-color:color-mix(in srgb,var(--accent) 65%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 10%,transparent)}.field-control input,.field-control select{width:100%;height:100%;min-width:0;padding:0 38px;border:0;outline:0;background:transparent;color:var(--text);font:500 .82rem 'Inter',sans-serif}.field-control input::placeholder{color:var(--muted-2)}.field-control select{appearance:none;-webkit-appearance:none;cursor:pointer}.field-control select option{background:var(--card);color:var(--text)}.field-icon{width:16px;height:16px;position:absolute;left:12px;z-index:1;fill:none;stroke:var(--muted);stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}.select-arrow{width:14px;height:14px;position:absolute;right:12px;fill:none;stroke:var(--muted);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}.money-field input{padding-left:31px;padding-right:50px;font-family:'IBM Plex Mono',monospace;font-weight:600}.currency-symbol{position:absolute;left:12px;color:var(--muted);font-family:'IBM Plex Mono',monospace;font-size:.78rem}.currency-code{position:absolute;right:11px;color:var(--muted-2);font-size:.59rem;font-weight:800;letter-spacing:.08em}
.charge-summary{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:19px 20px;border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);border-radius:14px;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 13%,transparent),color-mix(in srgb,var(--accent) 3%,transparent))}.summary-copy{min-width:0;display:flex;flex-direction:column;gap:3px}.summary-kicker{color:var(--accent);font-size:.65rem;font-weight:800;letter-spacing:.1em}.summary-copy strong{color:var(--title);font-size:.84rem}.summary-copy small{color:var(--muted);font-size:.69rem}.summary-amount{display:flex;align-items:baseline;gap:4px;white-space:nowrap}.summary-amount>span{color:var(--accent);font-family:'IBM Plex Mono',monospace;font-size:1rem;font-weight:700}.summary-amount strong{color:#6ee7b7;font-family:'IBM Plex Mono',monospace;font-size:1.55rem;line-height:1;font-weight:700}.summary-amount small{color:var(--muted);font-size:.6rem;font-weight:800;letter-spacing:.08em}
.transaction-review{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:13px 15px;border:1px solid var(--line);border-radius:11px;background:color-mix(in srgb,var(--card) 91%,black)}.transaction-review>div:first-child{display:flex;flex-direction:column;gap:2px}.transaction-review span{color:var(--accent);font-size:.59rem;font-weight:800;letter-spacing:.11em}.transaction-review strong{color:var(--title);font-size:.76rem}.review-status{display:flex!important;flex-direction:row!important;align-items:center;gap:6px;color:#6ee7b7!important;font-size:.68rem!important;font-weight:700!important;letter-spacing:0!important}.review-status i{width:7px;height:7px;border-radius:50%;background:#34d399;box-shadow:0 0 10px rgba(52,211,153,.65)}
.panel-actions{display:grid;grid-template-columns:130px minmax(0,1fr);gap:10px}.secondary-button,.submit-button{min-height:48px;border-radius:11px;font-family:'Inter',sans-serif;cursor:pointer}.secondary-button{border:1px solid var(--line-strong);background:transparent;color:var(--muted);font-size:.76rem;font-weight:700;transition:background .16s ease,color .16s ease}.secondary-button:hover{background:var(--line);color:var(--title)}.submit-button{display:flex;align-items:center;gap:11px;padding:7px 12px;border:1px solid color-mix(in srgb,var(--button) 80%,white);background:var(--button);color:var(--button-text);text-align:left;box-shadow:0 8px 22px color-mix(in srgb,var(--button) 25%,transparent);transition:filter .16s ease,transform .16s ease}.submit-button:hover{filter:brightness(1.08);transform:translateY(-1px)}.button-icon{width:31px;height:31px;flex:0 0 31px;display:grid;place-items:center;border-radius:8px;background:rgba(255,255,255,.13)}.button-icon svg,.button-arrow{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}.button-copy{min-width:0;flex:1;display:flex;flex-direction:column;gap:1px}.button-copy strong{font-size:.77rem;font-weight:800}.button-copy small{color:color-mix(in srgb,var(--button-text) 72%,transparent);font-size:.64rem}.button-arrow{flex:0 0 16px}
@media(max-width:680px){.modal-overlay{align-items:flex-end;padding:0}.reactivate-panel{width:100%;max-height:94dvh;border-right:0;border-bottom:0;border-left:0;border-radius:20px 20px 0 0}.panel-header{padding:20px 18px 17px}.form-body{gap:13px;padding:16px 14px calc(18px + env(safe-area-inset-bottom))}.form-section{padding:15px}.debt-grid,.payment-grid{grid-template-columns:1fr}.charge-summary{align-items:flex-start;padding:16px}.summary-copy small{display:none}.summary-amount strong{font-size:1.3rem}.panel-actions{grid-template-columns:1fr}.secondary-button{order:2}.submit-button{order:1}.transaction-review{padding:12px}.panel-header h2{font-size:1.55rem}}
@media(max-width:390px){.panel-header p{font-size:.75rem}.section-heading small{display:none}.charge-summary{flex-direction:column;gap:10px}.summary-amount strong{font-size:1.45rem}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important}}
</style>

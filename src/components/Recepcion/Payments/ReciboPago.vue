<script setup>
import { ref, computed } from 'vue';
import { useLang } from '../useLang.js';

const props = defineProps({
  visible: { type: Boolean, default: false },
  pago: { type: Object, default: null },
  locale: { type: String, default: 'es-MX' }
});

const emit = defineEmits(['close', 'notify']);
const reciboRef = ref(null);
const modalContentRef = ref(null);
const generando = ref(false);

const { lang } = useLang();

// Diccionario de traducciones sincronizado con useLang
const traducciones = {
  es: {
    modalTitle: 'RECIBO DE PAGO',
    modalSubtitle: 'Vista previa antes de descargar',
    subTitle: 'COMPROBANTE DE TRANSACCIÓN BANCARIA',
    date: 'Fecha',
    time: 'Hora',
    operationNum: 'NÚMERO DE OPERACIÓN',
    client: 'CLIENTE',
    registeredBy: 'REGISTRADO POR',
    mainCashier: 'CAJA PRINCIPAL',
    paymentMethod: 'MÉTODO DE PAGO',
    status: 'ESTADO',
    paid: 'PAGADO',
    conceptPlan: 'CONCEPTO / PLAN',
    amount: 'IMPORTE',
    monthly: 'Mensualidad',
    monthlySurcharge: 'Mensualidad + Recargo',
    membership: 'Membresía',
    subtotal: 'Subtotal',
    vat: 'IVA (0%)',
    totalAmount: 'IMPORTE TOTAL',
    authCode: 'CÓDIGO DE VERIFICACIÓN AUTORIZADO',
    footer1: 'Conserve este comprobante para cualquier aclaración.',
    footer2: 'Gracias por su preferencia.',
    genPng: 'Generando recibo PNG...',
    genPdf: 'Generando recibo PDF...',
    successPng: 'Recibo descargado con éxito',
    successPdf: 'Recibo PDF descargado con éxito',
    errorPng: 'Error al generar la imagen PNG',
    errorPdf: 'Error al generar el PDF. Verifica que jspdf esté instalado.',
    btnPng: 'PNG',
    btnPdf: 'PDF',
    btnClose: 'Cerrar',
    generating: 'Generando…'
  },
  en: {
    modalTitle: 'PAYMENT RECEIPT',
    modalSubtitle: 'Preview before downloading',
    subTitle: 'BANK TRANSACTION RECEIPT',
    date: 'Date',
    time: 'Time',
    operationNum: 'OPERATION NUMBER',
    client: 'CLIENT',
    registeredBy: 'REGISTERED BY',
    mainCashier: 'MAIN CASHIER',
    paymentMethod: 'PAYMENT METHOD',
    status: 'STATUS',
    paid: 'PAID',
    conceptPlan: 'CONCEPT / PLAN',
    amount: 'AMOUNT',
    monthly: 'Monthly',
    monthlySurcharge: 'Monthly + Surcharge',
    membership: 'Membership',
    subtotal: 'Subtotal',
    vat: 'VAT (0%)',
    totalAmount: 'TOTAL AMOUNT',
    authCode: 'AUTHORIZED VERIFICATION CODE',
    footer1: 'Keep this receipt for any inquiries.',
    footer2: 'Thank you for your preference.',
    genPng: 'Generating PNG receipt...',
    genPdf: 'Generating PDF receipt...',
    successPng: 'Receipt downloaded successfully',
    successPdf: 'PDF receipt downloaded successfully',
    errorPng: 'Error generating PNG image',
    errorPdf: 'Error generating PDF. Verify jspdf is installed.',
    btnPng: 'PNG',
    btnPdf: 'PDF',
    btnClose: 'Close',
    generating: 'Generating…'
  }
};

const t = computed(() => traducciones[lang.value] || traducciones.es);

const formatFecha = (iso) => {
  if (!iso) return '';
  return new Date(iso + 'T00:00:00').toLocaleDateString(props.locale, { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const formatHora = () => {
  const now = new Date();
  return now.toLocaleTimeString(props.locale, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
};

const montoFormateado = computed(() => {
  const val = Number(props.pago?.monto) || 0;
  return val.toFixed(2);
});

const conceptoTexto = computed(() => {
  const c = props.pago?.concepto;
  if (c === 'monthly') return t.value.monthly;
  if (c === 'monthlySurcharge') return t.value.monthlySurcharge;
  return t.value.membership;
});

const cerrar = () => {
  if (generando.value) return;
  emit('close');
};

const liberarRecorteParaCaptura = async () => {
  const el = reciboRef.value;
  const contenedor = modalContentRef.value;

  const original = {
    elOverflow: el.style.overflow,
    elMaxHeight: el.style.maxHeight,
    elHeight: el.style.height,
    contOverflow: contenedor?.style.overflow,
    contMaxHeight: contenedor?.style.maxHeight,
  };

  el.style.overflow = 'visible';
  el.style.maxHeight = 'none';
  el.style.height = 'auto';
  if (contenedor) {
    contenedor.style.overflow = 'visible';
    contenedor.style.maxHeight = 'none';
  }

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  await new Promise((resolve) => setTimeout(resolve, 50));

  return () => {
    el.style.overflow = original.elOverflow;
    el.style.maxHeight = original.elMaxHeight;
    el.style.height = original.elHeight;
    if (contenedor) {
      contenedor.style.overflow = original.contOverflow;
      contenedor.style.maxHeight = original.contMaxHeight;
    }
  };
};

const capturarTicketCompleto = async () => {
  const html2canvas = (await import('html2canvas')).default;
  const el = reciboRef.value;
  const restaurar = await liberarRecorteParaCaptura();

  try {
    const canvas = await html2canvas(el, {
      scale: 2,
      backgroundColor: '#ffffff',
      useCORS: true,
      logging: false,
    });
    return canvas;
  } finally {
    restaurar();
  }
};

const descargarPng = async () => {
  if (!reciboRef.value || generando.value) return;
  generando.value = true;
  emit('notify', { message: t.value.genPng, type: 'info' });

  try {
    const canvas = await capturarTicketCompleto();
    const image = canvas.toDataURL('image/png');

    const link = document.createElement('a');
    link.href = image;
    link.download = `Ticket_${props.pago?.folio || 'pago'}.png`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    emit('notify', { message: t.value.successPng, type: 'success' });
  } catch (error) {
    console.error('Error al generar PNG:', error);
    emit('notify', { message: t.value.errorPng, type: 'error' });
  } finally {
    generando.value = false;
  }
};

const descargarPdf = async () => {
  if (!reciboRef.value || generando.value) return;
  generando.value = true;
  emit('notify', { message: t.value.genPdf, type: 'info' });

  try {
    const canvas = await capturarTicketCompleto();
    const { jsPDF } = await import('jspdf');

    const imgData = canvas.toDataURL('image/png');
    const anchoMm = 80;
    const altoMm = (canvas.height * anchoMm) / canvas.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [anchoMm, altoMm],
    });

    pdf.addImage(imgData, 'PNG', 0, 0, anchoMm, altoMm);
    pdf.save(`Ticket_${props.pago?.folio || 'pago'}.pdf`);

    emit('notify', { message: t.value.successPdf, type: 'success' });
  } catch (error) {
    console.error('Error al generar PDF:', error);
    emit('notify', { message: t.value.errorPdf, type: 'error' });
  } finally {
    generando.value = false;
  }
};
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click.self="cerrar">
    <div ref="modalContentRef" class="modal-content-container">

      <!-- Cabecera del modal (fuera del área capturada) -->
      <div class="modal-chrome-header">
        <div>
          <h3 class="chrome-title">{{ t.modalTitle }}</h3>
          <p class="chrome-subtitle">{{ t.modalSubtitle }}</p>
        </div>
        <button class="close-x" type="button" :disabled="generando" @click="cerrar" aria-label="close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <div class="ticket-scroll-area">
        <div ref="reciboRef" class="receipt-ticket">

          <div class="ticket-brand-bar">
            <div class="bank-name">ELITE GYM FITNESS CENTER</div>
            <div class="bank-sub">{{ t.subTitle }}</div>
            <div class="bank-sub small">RFC: EGY210415XYZ</div>
          </div>

          <div class="status-pill-wrap">
            <span class="status-pill">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg>
              {{ t.paid }}
            </span>
          </div>

          <div class="ticket-info-top">
            <div class="info-line"><span class="mini-label">{{ t.date }}</span><span class="mini-value">{{ formatFecha(pago?.fecha) }}</span></div>
            <div class="info-line"><span class="mini-label">{{ t.time }}</span><span class="mini-value">{{ formatHora() }}</span></div>
          </div>

          <div class="ticket-divider"></div>

          <div class="receipt-body">
            <div class="row">
              <span class="label">{{ t.operationNum }}</span>
              <span class="value bold mono">{{ pago?.folio }}</span>
            </div>
            <div class="row">
              <span class="label">{{ t.client }}</span>
              <span class="value">{{ pago?.cliente }}</span>
            </div>
            <div class="row">
              <span class="label">{{ t.registeredBy }}</span>
              <span class="value">{{ t.mainCashier }}</span>
            </div>
            <div class="row">
              <span class="label">{{ t.paymentMethod }}</span>
              <span class="value uppercase">{{ pago?.metodo }}</span>
            </div>
          </div>

          <div class="ticket-divider"></div>

          <div class="receipt-items">
            <div class="item-header-row">
              <span>{{ t.conceptPlan }}</span>
              <span>{{ t.amount }}</span>
            </div>
            <div class="item-row">
              <div class="item-desc">
                <span class="bold">{{ conceptoTexto }}</span>
                <span class="sub-desc">({{ pago?.plan }})</span>
              </div>
              <span class="bold mono">${{ montoFormateado }}</span>
            </div>
          </div>

          <div class="ticket-divider"></div>

          <div class="receipt-totals">
            <div class="row muted">
              <span>{{ t.subtotal }}</span>
              <span class="mono">${{ montoFormateado }}</span>
            </div>
            <div class="row muted">
              <span>{{ t.vat }}</span>
              <span class="mono">$0.00</span>
            </div>
            <div class="row total-final">
              <span>{{ t.totalAmount }}</span>
              <span class="mono">${{ montoFormateado }} MXN</span>
            </div>
          </div>

          <div class="ticket-divider dashed"></div>

          <div class="ticket-barcode">
            <div class="barcode-visual" aria-hidden="true">
              <span v-for="n in 28" :key="n" class="bar" :style="{ width: (n % 3 === 0 ? '3px' : '1.5px') }"></span>
            </div>
            <div class="barcode-folio">{{ pago?.folio || '00000000' }}</div>
            <div class="barcode-text">{{ t.authCode }}</div>
          </div>

          <div class="receipt-footer">
            <p>{{ t.footer1 }}</p>
            <p>{{ t.footer2 }}</p>
          </div>
        </div>
      </div>

      <div class="modal-actions-bar">
        <button class="btn-action png" type="button" :disabled="generando" @click="descargarPng">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          {{ generando ? t.generating : t.btnPng }}
        </button>
        <button class="btn-action pdf" type="button" :disabled="generando" @click="descargarPdf">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          {{ generando ? t.generating : t.btnPdf }}
        </button>
        <button class="btn-action close" type="button" :disabled="generando" @click="cerrar">
          {{ t.btnClose }}
        </button>
      </div>

    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 12px;
}

.modal-content-container {
  background: #1a1a1e;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  width: 100%;
  max-width: 400px;
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.55);
}

/* Cabecera del modal, fuera del ticket capturado */
.modal-chrome-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
  padding: 18px 18px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.chrome-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  color: #fff;
  margin: 0 0 2px 0;
  letter-spacing: 0.4px;
}

.chrome-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  color: #9ca3af;
  margin: 0;
}

.close-x {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #a1a1aa;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-x:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

.close-x:disabled { opacity: 0.5; cursor: not-allowed; }

.ticket-scroll-area {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  background: #0d0d0f;
  padding: 18px;
}

/* --- El ticket: esto es lo que se captura con html2canvas --- */
.receipt-ticket {
  background: #ffffff;
  color: #18181b;
  font-family: 'IBM Plex Mono', 'Courier New', monospace;
  font-size: 0.78rem;
  line-height: 1.35;
  width: 100%;
  max-width: 320px;
  margin: 0 auto;
  box-sizing: border-box;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
}

.ticket-brand-bar {
  background: #1c4fd6;
  color: #ffffff;
  text-align: center;
  padding: 18px 16px 14px;
}

.bank-name {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  letter-spacing: 0.6px;
  margin-bottom: 4px;
}

.bank-sub {
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.85);
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
}

.bank-sub.small {
  font-size: 0.62rem;
  color: rgba(255, 255, 255, 0.65);
}

.status-pill-wrap {
  display: flex;
  justify-content: center;
  margin-top: -12px;
  margin-bottom: 10px;
}

.status-pill {
  background: #16a34a;
  color: #fff;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.68rem;
  letter-spacing: 0.6px;
  padding: 5px 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.35);
}

.ticket-info-top {
  display: flex;
  justify-content: space-between;
  padding: 0 18px;
  margin-bottom: 10px;
  font-size: 0.72rem;
}

.info-line {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.mini-label {
  color: #9ca3af;
  font-size: 0.6rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  font-family: 'Inter', sans-serif;
}

.mini-value {
  font-weight: 600;
  color: #18181b;
}

.ticket-divider {
  height: 1px;
  margin: 10px 18px;
  background: repeating-linear-gradient(90deg, #d4d4d8 0, #d4d4d8 4px, transparent 4px, transparent 8px);
}

.ticket-divider.dashed {
  background: repeating-linear-gradient(90deg, #a1a1aa 0, #a1a1aa 3px, transparent 3px, transparent 7px);
}

.receipt-body, .receipt-items, .receipt-totals {
  padding: 0 18px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.row.muted {
  color: #6b7280;
  font-size: 0.75rem;
}

.label {
  color: #6b7280;
  font-size: 0.72rem;
  font-family: 'Inter', sans-serif;
}

.value {
  text-align: right;
  word-break: break-word;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
}

.value.mono, .mono {
  font-family: 'IBM Plex Mono', monospace;
}

.value.bold, .bold {
  font-weight: 700;
  color: #18181b;
}

.uppercase {
  text-transform: uppercase;
}

.item-header-row {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: #6b7280;
  font-family: 'Inter', sans-serif;
  border-bottom: 1px solid #e4e4e7;
  padding-bottom: 5px;
  margin-bottom: 4px;
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-desc {
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
}

.sub-desc {
  font-size: 0.68rem;
  color: #6b7280;
  margin-top: 1px;
}

.total-final {
  font-weight: 700;
  font-size: 0.92rem;
  margin-top: 4px;
  padding-top: 8px;
  border-top: 1.5px solid #18181b;
  color: #18181b;
}

.ticket-barcode {
  text-align: center;
  margin: 4px 18px 10px;
}

.barcode-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5px;
  height: 34px;
  margin-bottom: 6px;
}

.bar {
  background: #18181b;
  height: 100%;
  display: inline-block;
}

.barcode-folio {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.78rem;
  letter-spacing: 2px;
  font-weight: 600;
  color: #18181b;
}

.barcode-text {
  font-size: 0.6rem;
  color: #9ca3af;
  margin-top: 3px;
  font-family: 'Inter', sans-serif;
  letter-spacing: 0.3px;
}

.receipt-footer {
  text-align: center;
  font-size: 0.65rem;
  color: #9ca3af;
  margin-top: 6px;
  padding: 0 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: 'Inter', sans-serif;
}

/* Barra de acciones (fuera del ticket capturado) */
.modal-actions-bar {
  display: flex;
  gap: 8px;
  padding: 14px 18px;
  background: #18181b;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
}

.btn-action {
  flex: 1;
  min-width: 90px;
  padding: 11px 8px;
  border-radius: 10px;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: filter 0.2s, transform 0.15s;
  border: none;
}

.btn-action:disabled { opacity: 0.55; cursor: not-allowed; }

@media (hover: hover) {
  .btn-action:hover:not(:disabled) { filter: brightness(1.1); }
}

.btn-action:active:not(:disabled) { transform: scale(0.96); }

.btn-action.png { background: #3b82f6; color: #fff; }
.btn-action.pdf { background: #ef4444; color: #fff; }
.btn-action.close { background: #3f3f46; color: #f4f4f5; }

@media (max-width: 480px) {
  .modal-overlay { padding: 6px; }
  .modal-content-container { max-width: 100%; max-height: 96vh; }
  .ticket-scroll-area { padding: 14px 10px; }
  .modal-chrome-header { padding: 14px 14px 12px; }
  .modal-actions-bar { flex-direction: column; gap: 6px; padding: 12px; }
  .btn-action { width: 100%; padding: 13px; font-size: 0.88rem; }
}

@media (prefers-reduced-motion: reduce) {
  .btn-action, .close-x { transition: none !important; }
}
</style>
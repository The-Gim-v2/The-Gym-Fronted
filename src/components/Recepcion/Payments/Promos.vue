<template>
  <div class="form-panel glass-effect">
    <NotificationSystem ref="toastRef" />

    <div class="panel-header">
      <div class="header-top">
        <span class="header-icon-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
            <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
          </svg>
        </span>
        <div class="title-group">
          <h2 class="form-title">{{ t('offerTitle') }} <span class="highlight">{{ t('offerHighlight') }}</span></h2>
          <p class="form-subtitle">{{ t('offerSubtitle') }}</p>
        </div>
      </div>
      <button class="close-x" @click="$emit('close')" :aria-label="t('close')">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <div class="form-body">
      <div class="oferta-list">
        <div
          v-for="oferta in ofertas"
          :key="oferta.nombre"
          class="oferta-item"
          @click="seleccionar(oferta)"
        >
          <div class="oferta-info">
            <div class="icon-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
            <span class="nombre-oferta">{{ getLocalizedOfferName(oferta.nombre) }}</span>
          </div>

          <div class="oferta-precio">
            <span class="precio">${{ oferta.precio.toLocaleString(settings.idioma === 'en' ? 'en-US' : 'es-MX') }}</span>
            <div class="arrow-wrapper">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

interface OfertaItem {
  nombre: string;
  precio: number;
}

const emit = defineEmits(['close', 'select-oferta']);

const toastRef = ref<any>(null);

const settings = reactive({
  idioma: localStorage.getItem('Recepcion-idioma') || 'es'
});

const translations: Record<string, Record<string, string>> = {
  es: {
    offerTitle: "SELECCIONAR",
    offerHighlight: "OFERTA",
    offerSubtitle: "Elige un plan o paquete disponible",
    close: "Cerrar modal",
    selectedPrefix: "Seleccionaste: "
  },
  en: {
    offerTitle: "SELECT",
    offerHighlight: "OFFER",
    offerSubtitle: "Choose an available plan or package",
    close: "Close modal",
    selectedPrefix: "Selected: "
  }
};

const offerNameMap: Record<string, Record<string, string>> = {
  es: { '3 Meses': '3 Meses', '1 Semana': '1 Semana', '12 Meses': '12 Meses', '1 Mes': '1 Mes' },
  en: { '3 Meses': '3 Months', '1 Semana': '1 Week', '12 Meses': '12 Months', '1 Mes': '1 Month' }
};

const t = (key: string) => {
  return translations[settings.idioma]?.[key] || translations['es']?.[key] || key;
};

const getLocalizedOfferName = (nombre: string) => {
  return offerNameMap[settings.idioma]?.[nombre] || offerNameMap['es']?.[nombre] || nombre;
};

const ofertas = ref<OfertaItem[]>([
  { nombre: '3 Meses', precio: 1200 },
  { nombre: '1 Semana', precio: 150 },
  { nombre: '12 Meses', precio: 4000 },
  { nombre: '1 Mes', precio: 650 }
]);

const seleccionar = (oferta: OfertaItem) => {
  if (toastRef.value?.notify) {
    toastRef.value.notify(`${t('selectedPrefix')}${getLocalizedOfferName(oferta.nombre)}`, 'success');
  }

  emit('select-oferta', oferta);
};

onMounted(() => {
  window.addEventListener('idioma-changed', (e: Event) => {
    const customEvent = e as CustomEvent;
    if (customEvent.detail?.idioma) settings.idioma = customEvent.detail.idioma;
  });
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@500;600&display=swap');

.form-panel {
  --accent-blue: var(--color-highlight, #3b82f6);
  --accent-blue-soft: rgba(59, 130, 246, 0.12);
  --accent-blue-border: rgba(59, 130, 246, 0.32);
  --accent-amber: #f59e0b;
  --accent-amber-soft: rgba(245, 158, 11, 0.12);
  --accent-amber-border: rgba(245, 158, 11, 0.3);

  background: var(--bg-cards, #121214);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  color: var(--color-texto-general, #f5f5f4);
  border-radius: var(--app-border-radius, 22px);
  padding: 26px;
  width: 95%;
  max-width: 440px;
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(10px);
  font-family: 'Inter', sans-serif;
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}

.form-panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--accent-blue), transparent);
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 22px;
}

.header-top {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.header-icon-badge {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: var(--accent-amber-soft);
  border: 1px solid var(--accent-amber-border);
  color: var(--accent-amber);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.form-title {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  font-size: 1.15rem;
  color: var(--color-titulos, #fff);
  letter-spacing: 0.4px;
  margin: 0;
}

.form-subtitle {
  font-size: 0.78rem;
  color: var(--color-texto-secundario, #888);
  margin: 0;
}

.highlight {
  color: var(--accent-blue);
}

.oferta-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.oferta-item {
  background: var(--bg-input, #09090b);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: var(--app-border-radius, 14px);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.06));
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.oferta-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--accent-amber);
  opacity: 0.7;
  transition: opacity 0.2s, width 0.2s;
}

.oferta-item:hover {
  background: var(--bg-cards, rgba(255, 255, 255, 0.04));
  border-color: var(--accent-blue-border);
  transform: translateY(-2px);
}

.oferta-item:hover::before {
  opacity: 1;
  width: 4px;
}

.oferta-info {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.icon-wrapper {
  background: var(--accent-amber-soft);
  color: var(--accent-amber);
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--accent-amber-border);
  flex-shrink: 0;
}

.nombre-oferta {
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  color: var(--color-titulos, #fff);
  font-size: 0.98rem;
  letter-spacing: 0.2px;
}

.oferta-precio {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #34d399;
  font-weight: 700;
  flex-shrink: 0;
}

.precio {
  font-size: 1.05rem;
  letter-spacing: 0.2px;
  font-family: 'IBM Plex Mono', monospace;
}

.arrow-wrapper {
  color: var(--color-texto-secundario, #52525b);
  display: flex;
  align-items: center;
  transition: transform 0.2s, color 0.2s;
}

.oferta-item:hover .arrow-wrapper {
  color: var(--accent-blue);
  transform: translateX(3px);
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

@media (max-width: 380px) {
  .form-panel { padding: 18px; }
  .nombre-oferta { font-size: 0.9rem; }
  .precio { font-size: 0.95rem; }
  .header-icon-badge { width: 36px; height: 36px; }
}

@media (prefers-reduced-motion: reduce) {
  .oferta-item, .arrow-wrapper, .oferta-item::before {
    transition: none !important;
  }
}
</style>
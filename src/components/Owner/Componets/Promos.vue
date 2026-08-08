<template>
  <div class="form-panel glass-effect">
    <NotificationSystem ref="toastRef" />
    
    <div class="panel-header">
      <div class="title-group">
        <h2 class="form-title">{{ t('offerTitle') }} <span class="highlight">{{ t('offerHighlight') }}</span></h2>
        <p class="form-subtitle">{{ t('offerSubtitle') }}</p>
      </div>
      <button class="close-x" @click="$emit('close')" :aria-label="t('close')">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ef4444">
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

// Definimos los eventos que puede emitir este componente
const emit = defineEmits(['close', 'select-oferta']);

const toastRef = ref<any>(null);

const settings = reactive({
  idioma: localStorage.getItem('owner-idioma') || 'es'
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
.form-panel { 
  background: var(--bg-cards, #121214); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08)); 
  color: var(--color-texto-general, #f5f5f4); 
  border-radius: var(--app-border-radius, 20px); 
  padding: 24px; 
  width: 95%; 
  max-width: 440px; 
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
}

.panel-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: flex-start; 
  margin-bottom: 20px; 
}

.title-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.form-title { 
  font-family: 'Oswald', sans-serif; 
  font-size: 1.15rem; 
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
  padding: 12px 16px; 
  border-radius: var(--app-border-radius, 12px); 
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.04));
  cursor: pointer;
  transition: all 0.2s ease;
}

.oferta-item:hover { 
  background: var(--bg-cards, rgba(255, 255, 255, 0.03)); 
  border-color: var(--color-highlight, rgba(59, 130, 246, 0.3));
  transform: translateY(-1px);
}

.oferta-info { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.icon-wrapper {
  background: rgba(239, 68, 68, 0.1);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.nombre-oferta { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-titulos, #fff); 
  font-size: 0.95rem; 
  letter-spacing: 0.5px;
}

.oferta-precio { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  color: #34d399; 
  font-weight: 700; 
  font-family: 'Oswald', sans-serif; 
}

.precio { 
  font-size: 1.05rem; 
  letter-spacing: 0.5px;
}

.arrow-wrapper {
  color: var(--color-texto-secundario, #52525b);
  display: flex;
  align-items: center;
  transition: transform 0.2s, color 0.2s;
}

.oferta-item:hover .arrow-wrapper {
  color: var(--color-highlight, #60a5fa);
  transform: translateX(3px);
}

@media (max-width: 380px) {
  .form-panel { padding: 18px; }
  .nombre-oferta { font-size: 0.9rem; }
  .precio { font-size: 0.95rem; }
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
}

.close-x:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-titulos, #fff);
}
</style>
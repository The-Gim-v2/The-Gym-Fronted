<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import HeadingOwner from '../HeadingOwner.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';
import { traducciones } from '../i18n.js';

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');

const t = (key) => {
  const langTable = traducciones[currentLang.value] || traducciones.es;
  return langTable[key] || traducciones.es[key] || key;
};

const handleLangChange = (e) => {
  if (e.detail && e.detail.idioma) {
    currentLang.value = e.detail.idioma;
  }
};

onMounted(() => {
  window.addEventListener('idioma-changed', handleLangChange);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
});

const toastRef = ref(null);

const promociones = ref([
  { id: 1, nombre: 'Promocion Amigos', meses: 3, precio: 1800 },
  { id: 2, nombre: 'Paquete entrenador', meses: 1, precio: 800 }
]);

const preciosSistema = ref([
  { id: 1, concepto: 'Mensualidad Fija', monto: 500 },
  { id: 2, concepto: 'Costo Semanal', monto: 150 },
  { id: 3, concepto: 'Paquete entrenador', monto: 800, duracion: '1 mes' }
]);

const modalConfig = reactive({
  isOpen: false,
  type: '',
  title: '',
  isNew: false,
  form: {
    id: null,
    nombre: '',
    meses: '',
    precio: '',
    concepto: '',
    monto: '',
    duracion: ''
  }
});

const deleteModalConfig = reactive({
  isOpen: false,
  idItemToDelete: null
});

const abrirModalAgregarPromo = () => {
  modalConfig.isOpen = true;
  modalConfig.type = 'promo';
  modalConfig.title = t('modalAddPromoTitle');
  modalConfig.isNew = true;
  modalConfig.form = { id: null, nombre: '', meses: '', precio: '' };
};

const abrirModalEditarPromocion = (promo) => {
  modalConfig.isOpen = true;
  modalConfig.type = 'promo';
  modalConfig.title = `${t('modalEditPromoTitle')}: ${promo.nombre}`;
  modalConfig.isNew = false;
  modalConfig.form = { ...promo };
};

const confirmarEliminarPromocion = (promo) => {
  deleteModalConfig.idItemToDelete = promo.id;
  deleteModalConfig.isOpen = true;
};

const ejecutarEliminacion = () => {
  promociones.value = promociones.value.filter(p => p.id !== deleteModalConfig.idItemToDelete);
  deleteModalConfig.isOpen = false;
  if (toastRef.value) toastRef.value.notify(t('promoDeletedToast'), 'success');
};

const abrirModalEditarPrecio = (precio) => {
  modalConfig.isOpen = true;
  modalConfig.type = 'precio';
  modalConfig.title = `${t('modalEditPriceTitle')}: ${precio.concepto}`;
  modalConfig.isNew = false;
  modalConfig.form = { ...precio };
};

const cerrarModal = () => {
  modalConfig.isOpen = false;
};

const guardarDatos = () => {
  if (modalConfig.type === 'promo') {
    if (modalConfig.isNew) {
      const nuevaPromo = {
        id: Date.now(),
        nombre: modalConfig.form.nombre,
        meses: modalConfig.form.meses,
        precio: modalConfig.form.precio
      };
      promociones.value.push(nuevaPromo);
      if (toastRef.value) toastRef.value.notify(t('promoAddedToast'), 'success');
    } else {
      const index = promociones.value.findIndex(p => p.id === modalConfig.form.id);
      if (index !== -1) {
        promociones.value[index] = { ...modalConfig.form };
        if (toastRef.value) toastRef.value.notify(t('promoUpdatedToast'), 'success');
      }
    }
  } else if (modalConfig.type === 'precio') {
    const index = preciosSistema.value.findIndex(p => p.id === modalConfig.form.id);
    if (index !== -1) {
      preciosSistema.value[index] = { ...modalConfig.form };
      if (toastRef.value) toastRef.value.notify(t('priceUpdatedToast'), 'success');
    }
  }
  cerrarModal();
};
</script>

<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content-promos">

      <!-- CUADRO IZQUIERDO: PROMOCIONES -->
      <section class="promo-box-container accent-blue" id="tutorial-step-0">
        <div class="box-header">
          <div class="header-top">
            <span class="header-icon-badge badge-blue">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
            </span>
            <h2>{{ t('promotionsTitle') }}</h2>
          </div>
        </div>

        <div class="box-content">
          <div v-for="promo in promociones" :key="promo.id" class="item-row ticket-row">
            <div class="item-info">
              <div class="row-icon-wrap">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
              </div>
              <div class="row-text">
                <h4>{{ promo.nombre }}</h4>
                <div class="chip-row">
                  <span class="chip chip-duration">{{ promo.meses }} {{ t('monthsLabel') }}</span>
                  <span class="chip chip-price">${{ promo.precio }}</span>
                </div>
              </div>
            </div>
            <div class="item-actions">
              <button class="icon-action-btn edit-btn" @click="abrirModalEditarPromocion(promo)" :title="t('editPromoTooltip')">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <button class="icon-action-btn delete-btn" @click="confirmarEliminarPromocion(promo)" :title="t('deletePromoTooltip')">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            </div>
          </div>

          <div v-if="promociones.length === 0" class="empty-state">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.59 13.41 12 22l-9-9V3h10l7.59 7.59a2 2 0 0 1 0 2.82Z"></path><circle cx="7.5" cy="7.5" r="1.5"></circle></svg>
            <p>{{ t('emptyPromotionsText') }}</p>
          </div>
        </div>

        <!-- Botón para agregar promoción -->
        <button class="floating-add-btn" @click="abrirModalAgregarPromo" :title="t('addPromoButtonTitle')">
          <svg class="add-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <span class="add-text-mobile">{{ t('addPromoButtonText') }}</span>
        </button>
      </section>

      <!-- CUADRO DERECHO: CAMBIOS DE PRECIOS -->
      <section class="promo-box-container accent-violet" id="tutorial-step-1">
        <div class="box-header">
          <div class="header-top">
            <span class="header-icon-badge badge-violet">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
            </span>
            <h2>{{ t('priceChangesTitlePart1') }} <span class="highlight highlight-violet">{{ t('priceChangesTitleHighlight') }}</span></h2>
          </div>
        </div>

        <div class="box-content">
          <div v-for="precio in preciosSistema" :key="precio.id" class="item-row ticket-row price-row">
            <div class="item-info">
              <div class="row-icon-wrap wrap-violet">
                <svg class="icon-tag icon-violet" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              </div>
              <div class="row-text">
                <h4>{{ precio.concepto }}</h4>
                <div class="chip-row">
                  <span class="chip chip-price">${{ precio.monto }}</span>
                  <span v-if="precio.duracion" class="chip chip-duration">{{ precio.duracion }}</span>
                </div>
              </div>
            </div>
            <div class="item-actions">
              <button class="icon-action-btn edit-btn" @click="abrirModalEditarPrecio(precio)" :title="t('editPriceTooltip')">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

    </main>

    <!-- MODAL PARA AGREGAR / EDITAR -->
    <transition name="pop">
      <div v-if="modalConfig.isOpen" class="modal-wrapper" @click.self="cerrarModal">
        <div class="custom-modal-card" :class="modalConfig.type === 'promo' ? 'modal-accent-blue' : 'modal-accent-violet'">
          <div class="modal-icon-badge" :class="modalConfig.type === 'promo' ? 'badge-blue' : 'badge-violet'">
            <svg v-if="modalConfig.type === 'promo'" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
          </div>

          <h3>{{ modalConfig.title }}</h3>

          <form @submit.prevent="guardarDatos">
            <template v-if="modalConfig.type === 'promo'">
              <div class="input-group">
                <label>{{ t('promoNameLabel') }}</label>
                <input type="text" v-model="modalConfig.form.nombre" :placeholder="t('promoNamePlaceholder')" required>
              </div>
              <div class="form-grid-modal">
                <div class="input-group">
                  <label>{{ t('monthsFieldLabel') }}</label>
                  <input type="number" v-model="modalConfig.form.meses" placeholder="Ej. 3" min="1" required class="mono">
                </div>
                <div class="input-group">
                  <label>{{ t('priceFieldLabel') }}</label>
                  <input type="number" v-model="modalConfig.form.precio" placeholder="Ej. 1800" min="0" required class="mono">
                </div>
              </div>
            </template>

            <template v-if="modalConfig.type === 'precio'">
              <div class="input-group">
                <label>{{ t('conceptFieldLabel') }}</label>
                <input type="text" v-model="modalConfig.form.concepto" :placeholder="t('conceptPlaceholder')" required :disabled="!modalConfig.isNew">
              </div>
              <div class="input-group">
                <label>{{ t('newPriceFieldLabel') }}</label>
                <input type="number" v-model="modalConfig.form.monto" placeholder="0.00" required class="mono">
              </div>
              <div class="input-group" v-if="modalConfig.form.duracion !== undefined">
                <label>{{ t('durationFieldLabel') }}</label>
                <input type="text" v-model="modalConfig.form.duracion" :placeholder="t('durationPlaceholder')">
              </div>
            </template>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="cerrarModal">{{ t('btnCancel') }}</button>
              <button type="submit" class="btn-primary">{{ t('btnSave') }}</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- MODAL DE CONFIRMACIÓN PARA ELIMINAR -->
    <transition name="pop">
      <div v-if="deleteModalConfig.isOpen" class="modal-wrapper" @click.self="deleteModalConfig.isOpen = false">
        <div class="custom-modal-card text-center modal-accent-danger">
          <div class="warning-icon-wrapper">
            <span class="warning-ring"></span>
            <svg viewBox="0 0 24 24" fill="currentColor" class="warning-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h3>{{ t('deleteModalTitle') }}</h3>
          <p class="delete-msg">{{ t('deletePromoMsg') }}</p>

          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="deleteModalConfig.isOpen = false">{{ t('btnCancel') }}</button>
            <button type="button" class="btn-danger" @click="ejecutarEliminacion">{{ t('btnConfirm') }}</button>
          </div>
        </div>
      </div>
    </transition>

  </HeadingOwner>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@500;600&display=swap');

.main-content-promos {
  --accent-blue: var(--color-highlight, #3b82f6);
  --accent-blue-soft: rgba(59, 130, 246, 0.12);
  --accent-blue-border: rgba(59, 130, 246, 0.32);
  --accent-violet: #8b5cf6;
  --accent-violet-soft: rgba(139, 92, 246, 0.12);
  --accent-violet-border: rgba(139, 92, 246, 0.32);
  --accent-green: #22c55e;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(18px, 3vw, 40px);
  padding: clamp(16px, 3vw, 40px);
  box-sizing: border-box;
  width: 100%;
  color: var(--color-texto-general, #e5e5e5);
  font-family: 'Inter', sans-serif;
}

.highlight {
  color: var(--color-highlight, #3b82f6);
}

.highlight-violet {
  color: var(--accent-violet);
}

.promo-box-container {
  background: var(--bg-cards, rgba(18, 18, 18, 0.75));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 24px);
  width: 100%;
  max-width: 480px;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.55);
  padding-bottom: 20px;
}

.promo-box-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--accent-blue), transparent);
}

.accent-violet::before {
  background: linear-gradient(90deg, transparent, var(--accent-violet), transparent);
}

.box-header {
  background: var(--bg-cards, #222);
  padding: 20px;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
}

.header-top {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
}

.header-icon-badge {
  width: 42px;
  height: 42px;
  border-radius: 13px;
  background: var(--accent-blue-soft);
  border: 1px solid var(--accent-blue-border);
  color: var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.header-icon-badge.badge-violet {
  background: var(--accent-violet-soft);
  border-color: var(--accent-violet-border);
  color: var(--accent-violet);
}

.header-icon-badge svg {
  width: 21px;
  height: 21px;
}

.box-header h2 {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: clamp(1.3rem, 1rem + 1vw, 1.6rem);
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.3px;
}

.box-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item-row {
  background: var(--bg-cards, rgba(25, 25, 25, 0.9));
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 14px);
  padding: 15px 15px 15px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.ticket-row::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--accent-blue);
}

.price-row::before {
  background: var(--accent-violet);
}

.item-row:hover {
  border-color: var(--accent-blue-border);
  transform: translateY(-2px);
}

.price-row:hover {
  border-color: var(--accent-violet-border);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 0;
  flex: 1;
}

.row-text {
  min-width: 0;
}

.row-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: var(--accent-blue-soft);
  border: 1px solid var(--accent-blue-border);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.row-icon-wrap.wrap-violet {
  background: var(--accent-violet-soft);
  border-color: var(--accent-violet-border);
}

.icon-tag {
  width: 20px;
  height: 20px;
  color: var(--accent-blue);
}

.icon-tag.icon-violet {
  color: var(--accent-violet);
}

.item-info h4 {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 6px 0;
  word-break: break-word;
}

.chip-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  line-height: 1.6;
  white-space: nowrap;
}

.chip-duration {
  background: var(--accent-blue-soft);
  color: var(--accent-blue);
  font-family: 'Inter', sans-serif;
}

.price-row .chip-duration {
  background: var(--accent-violet-soft);
  color: var(--accent-violet);
}

.chip-price {
  background: rgba(34, 197, 94, 0.14);
  color: var(--accent-green);
  font-family: 'IBM Plex Mono', monospace;
}

.item-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
}

.icon-action-btn {
  background: var(--bg-input, rgba(255, 255, 255, 0.05));
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.1));
  border-radius: var(--app-border-radius, 10px);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: var(--color-texto-general, #fff);
}

@media (hover: hover) {
  .delete-btn:hover {
    background: rgba(220, 38, 38, 0.2);
    border-color: #dc2626;
    color: #dc2626;
  }

  .edit-btn:hover {
    background: var(--accent-blue-soft);
    border-color: var(--accent-blue);
    color: var(--accent-blue);
  }

  .price-row .edit-btn:hover {
    background: var(--accent-violet-soft);
    border-color: var(--accent-violet);
    color: var(--accent-violet);
  }
}

.icon-action-btn svg {
  width: 20px;
  height: 20px;
}

/* Botón flotante en escritorio */
.floating-add-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: 50%;
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.45);
  transition: transform 0.2s, box-shadow 0.2s, filter 0.2s;
  z-index: 10;
}

.add-text-mobile {
  display: none;
}

.add-icon-svg {
  width: 28px;
  height: 28px;
}

@media (hover: hover) {
  .floating-add-btn:hover {
    filter: brightness(0.97);
    transform: scale(1.08);
    box-shadow: 0 8px 26px rgba(59, 130, 246, 0.55);
  }
}

.floating-add-btn:active {
  transform: scale(0.95);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  color: var(--color-texto-general, #777);
  font-family: 'Inter', sans-serif;
  margin-top: 50px;
  opacity: 0.75;
}

.empty-icon {
  width: 46px;
  height: 46px;
  opacity: 0.5;
}

.empty-state p {
  margin: 0;
  font-size: 0.9rem;
}

/* Ajustes optimizados para las notificaciones (ancho máximo y centrado en escritorio y móvil) */
:deep(.notification-container),
:deep(.toast-container) {
  width: calc(100% - 32px) !important;
  max-width: 480px !important;
  box-sizing: border-box !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  right: auto !important;
  margin: 0 auto !important;
}

/* Estilos de Modales */
.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(8px);
  padding: 16px;
  box-sizing: border-box;
}

.custom-modal-card {
  background: var(--bg-cards, #18181b);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.15));
  border-radius: var(--app-border-radius, 22px);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.65);
  position: relative;
  overflow: hidden;
}

.custom-modal-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent-blue);
}

.modal-accent-violet::before {
  background: var(--accent-violet);
}

.modal-accent-danger::before {
  background: #ef4444;
}

.modal-icon-badge {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: var(--accent-blue-soft);
  border: 1px solid var(--accent-blue-border);
  color: var(--accent-blue);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 14px auto;
}

.modal-icon-badge.badge-violet {
  background: var(--accent-violet-soft);
  border-color: var(--accent-violet-border);
  color: var(--accent-violet);
}

.modal-icon-badge svg {
  width: 24px;
  height: 24px;
}

.custom-modal-card.text-center {
  text-align: center;
}

.warning-icon-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.warning-ring {
  position: absolute;
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid rgba(239, 68, 68, 0.4);
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.8); opacity: 0; }
}

.warning-icon {
  width: 45px;
  height: 45px;
  color: #ef4444;
  position: relative;
}

.delete-msg {
  color: var(--color-texto-general, #94a3b8);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.custom-modal-card h3 {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.4rem;
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 18px;
  text-align: center;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
}

.form-grid-modal {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.input-group label {
  font-family: 'Space Grotesk', sans-serif;
  color: var(--color-etiquetas, var(--color-texto-general, #cbd5e1));
  font-size: 13px;
  font-weight: 600;
}

.input-group input {
  background: var(--bg-input, #121212);
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.15));
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  padding: 12px;
  font-family: 'Inter', sans-serif;
  outline: none;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-group input.mono {
  font-family: 'IBM Plex Mono', monospace;
  font-weight: 600;
}

.input-group input:focus {
  border-color: var(--accent-blue);
  box-shadow: 0 0 0 3px var(--accent-blue-soft);
}

.input-group input:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  gap: 10px;
  margin-top: 25px;
}

.btn-primary {
  flex: 1;
  padding: 12px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 10px);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: filter 0.2s;
}

@media (hover: hover) {
  .btn-primary:hover {
    filter: brightness(0.95);
  }
}

.btn-danger {
  flex: 1;
  padding: 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: var(--app-border-radius, 10px);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger:hover {
  background: #b91c1c;
}

.btn-secondary {
  flex: 1;
  padding: 12px;
  background: transparent;
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.2));
  color: var(--color-texto-general, #fff);
  border-radius: var(--app-border-radius, 10px);
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

@media (hover: hover) {
  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.05);
  }
}

.pop-enter-active, .pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@media (max-width: 480px) {
  .item-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .item-actions {
    justify-content: flex-end;
    border-top: 1px dashed var(--border-input, rgba(255, 255, 255, 0.12));
    padding-top: 10px;
  }

  .floating-add-btn {
    position: relative;
    bottom: auto;
    right: auto;
    width: calc(100% - 30px);
    margin: 10px auto 0 auto;
    height: 48px;
    border-radius: var(--app-border-radius, 12px);
    gap: 8px;
    box-shadow: none;
  }

  .add-text-mobile {
    display: inline;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;
    font-size: 1rem;
  }

  .add-icon-svg {
    width: 22px;
    height: 22px;
  }
}

@media (max-width: 900px) {
  .main-content-promos {
    flex-direction: column;
    align-items: center;
  }
  .promo-box-container {
    max-width: 100%;
    min-height: auto;
    height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .item-row, .icon-action-btn, .floating-add-btn, .btn-primary, .btn-secondary, .btn-danger, .warning-ring {
    transition: none !important;
    animation: none !important;
  }
}
</style>
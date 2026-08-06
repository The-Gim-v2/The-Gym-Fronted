<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content-promos">
      
      <!-- CUADRO IZQUIERDO: PROMOCIONES -->
      <div class="promo-box-container" id="tutorial-step-0">
        <div class="box-header">
          <h2>Promociones</h2>
        </div>
        
        <div class="box-content">
          <div v-for="promo in promociones" :key="promo.id" class="item-row">
            <div class="item-info">
              <svg class="icon-tag" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/></svg>
              <div>
                <h4>{{ promo.nombre }}</h4>
                <p>{{ promo.meses }} meses por ${{ promo.precio }}</p>
              </div>
            </div>
            <div class="item-actions">
              <button class="icon-action-btn edit-btn" @click="abrirModalEditarPromocion(promo)" title="Editar Promoción">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
              <button class="icon-action-btn delete-btn" @click="confirmarEliminarPromocion(promo)" title="Eliminar Promoción">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              </button>
            </div>
          </div>

          <div v-if="promociones.length === 0" class="empty-state">
            No hay promociones registradas.
          </div>
        </div>

        <!-- Botón para agregar promoción -->
        <button class="floating-add-btn" @click="abrirModalAgregarPromo" title="Agregar Promoción">
          <svg class="add-icon-svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <span class="add-text-mobile">Agregar Promoción</span>
        </button>
      </div>

      <!-- CUADRO DERECHO: CAMBIOS DE PRECIOS -->
      <div class="promo-box-container" id="tutorial-step-1">
        <div class="box-header">
          <h2>Cambios de <span class="highlight">Precios</span></h2>
        </div>

        <div class="box-content">
          <div v-for="precio in preciosSistema" :key="precio.id" class="item-row">
            <div class="item-info">
              <svg class="icon-tag" viewBox="0 0 24 24" fill="currentColor"><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              <div>
                <h4>{{ precio.concepto }}</h4>
                <div class="price-details">
                  <span class="price-val">${{ precio.monto }}</span>
                  <span v-if="precio.duracion" class="duration-val">{{ precio.duracion }}</span>
                </div>
              </div>
            </div>
            <div class="item-actions">
              <button class="icon-action-btn edit-btn" @click="abrirModalEditarPrecio(precio)" title="Editar Precio">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>

    <!-- MODAL PARA AGREGAR / EDITAR -->
    <transition name="pop">
      <div v-if="modalConfig.isOpen" class="modal-wrapper" @click.self="cerrarModal">
        <div class="custom-modal-card">
          <h3>{{ modalConfig.title }}</h3>
          
          <form @submit.prevent="guardarDatos">
            <template v-if="modalConfig.type === 'promo'">
              <div class="input-group">
                <label>Nombre de la Promoción</label>
                <input type="text" v-model="modalConfig.form.nombre" placeholder="Ej. Promoción Amigos" required>
              </div>
              <div class="form-grid-modal">
                <div class="input-group">
                  <label>Meses</label>
                  <input type="number" v-model="modalConfig.form.meses" placeholder="Ej. 3" min="1" required>
                </div>
                <div class="input-group">
                  <label>Precio ($)</label>
                  <input type="number" v-model="modalConfig.form.precio" placeholder="Ej. 1800" min="0" required>
                </div>
              </div>
            </template>

            <template v-if="modalConfig.type === 'precio'">
              <div class="input-group">
                <label>Concepto</label>
                <input type="text" v-model="modalConfig.form.concepto" placeholder="Ej. Mensualidad Fija" required :disabled="!modalConfig.isNew">
              </div>
              <div class="input-group">
                <label>Nuevo Precio ($)</label>
                <input type="number" v-model="modalConfig.form.monto" placeholder="0.00" required>
              </div>
              <div class="input-group" v-if="modalConfig.form.duracion !== undefined">
                <label>Duración (Opcional)</label>
                <input type="text" v-model="modalConfig.form.duracion" placeholder="Ej. 1 mes">
              </div>
            </template>

            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="cerrarModal">Cancelar</button>
              <button type="submit" class="btn-primary">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- MODAL DE CONFIRMACIÓN PARA ELIMINAR -->
    <transition name="pop">
      <div v-if="deleteModalConfig.isOpen" class="modal-wrapper" @click.self="deleteModalConfig.isOpen = false">
        <div class="custom-modal-card text-center">
          <div class="warning-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="currentColor" class="warning-icon">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <h3>¿Desea eliminarlo?</h3>
          <p class="delete-msg">Esta acción eliminará la promoción permanentemente.</p>
          
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="deleteModalConfig.isOpen = false">Cancelar</button>
            <button type="button" class="btn-danger" @click="ejecutarEliminacion">Confirmar</button>
          </div>
        </div>
      </div>
    </transition>

  </HeadingOwner>
</template>

<script setup>
import { ref, reactive } from 'vue';
import HeadingOwner from '../HeadingOwner.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

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
  modalConfig.title = 'Agregar Nueva Promoción';
  modalConfig.isNew = true;
  modalConfig.form = { id: null, nombre: '', meses: '', precio: '' };
};

const abrirModalEditarPromocion = (promo) => {
  modalConfig.isOpen = true;
  modalConfig.type = 'promo';
  modalConfig.title = `Editar Promoción: ${promo.nombre}`;
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
  toastRef.value.notify('Promoción eliminada correctamente', 'success');
};

const abrirModalEditarPrecio = (precio) => {
  modalConfig.isOpen = true;
  modalConfig.type = 'precio';
  modalConfig.title = `Editar Precio: ${precio.concepto}`;
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
      toastRef.value.notify('Promoción agregada exitosamente', 'success');
    } else {
      const index = promociones.value.findIndex(p => p.id === modalConfig.form.id);
      if (index !== -1) {
        promociones.value[index] = { ...modalConfig.form };
        toastRef.value.notify('Promoción actualizada correctamente', 'success');
      }
    }
  } else if (modalConfig.type === 'precio') {
    const index = preciosSistema.value.findIndex(p => p.id === modalConfig.form.id);
    if (index !== -1) {
      preciosSistema.value[index] = { ...modalConfig.form };
      toastRef.value.notify('Precio actualizado correctamente', 'success');
    }
  }
  cerrarModal();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;700;800&family=Oswald:wght@400;700&display=swap');

.main-content-promos {
  display: flex;
  justify-content: center;
  gap: 40px;
  padding: 40px;
  min-height: 80vh;
  box-sizing: border-box;
  width: 100%;
  color: var(--color-texto-general, #e5e5e5);
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
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
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  padding-bottom: 20px;
}

.box-header {
  background: var(--bg-cards, #222);
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.08));
}

.box-header h2 {
  font-family: 'Anton', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.8rem;
  margin: 0;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.box-content {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.item-row {
  background: var(--bg-cards, rgba(25, 25, 25, 0.9));
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.08));
  border-radius: var(--app-border-radius, 14px);
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s ease;
}

.item-row:hover {
  border-color: var(--color-highlight, rgba(59, 130, 246, 0.4));
  transform: translateY(-2px);
}

.item-info {
  display: flex;
  align-items: center;
  gap: 15px;
  min-width: 0;
  flex: 1;
}

.item-info div {
  min-width: 0;
}

.icon-tag {
  width: 28px;
  height: 28px;
  color: var(--color-highlight, #3b82f6);
  flex-shrink: 0;
}

.item-info h4 {
  font-family: 'Oswald', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.1rem;
  margin: 0 0 4px 0;
  word-break: break-word;
}

.item-info p {
  font-family: 'Inter', sans-serif;
  color: var(--color-highlight, #94a3b8);
  font-size: 0.9rem;
  margin: 0;
  word-break: break-word;
}

.price-details {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.price-val {
  font-family: 'Inter', sans-serif;
  color: var(--color-texto-general, #fff);
  font-weight: 800;
  font-size: 1.1rem;
}

.duration-val {
  font-family: 'Inter', sans-serif;
  color: var(--color-highlight, #3b82f6);
  font-size: 0.85rem;
  font-weight: 600;
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
    background: rgba(59, 130, 246, 0.2);
    border-color: var(--color-highlight, #3b82f6);
    color: var(--color-highlight, #3b82f6);
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
  width: 55px;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  transition: transform 0.2s, background 0.2s;
  z-index: 10;
}

.add-text-mobile {
  display: none;
}

.add-icon-svg {
  width: 30px;
  height: 30px;
}

@media (hover: hover) {
  .floating-add-btn:hover {
    filter: brightness(0.95);
    transform: scale(1.08);
  }
}

.empty-state {
  text-align: center;
  color: var(--color-highlight, #777);
  font-family: 'Inter', sans-serif;
  margin-top: 50px;
}

/* Ajustes globales/profundos para que las notificaciones no se salgan del margen en móvil */
:deep(.notification-container),
:deep(.notification),
:deep(.toast-container) {
  max-width: calc(100vw - 30px) !important;
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
}

.custom-modal-card {
  background: var(--bg-cards, #18181b);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.15));
  border-radius: var(--app-border-radius, 20px);
  padding: 30px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
}

.custom-modal-card.text-center {
  text-align: center;
}

.warning-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
}

.warning-icon {
  width: 45px;
  height: 45px;
  color: #ef4444;
}

.delete-msg {
  color: var(--color-highlight, #94a3b8);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.custom-modal-card h3 {
  font-family: 'Anton', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.5rem;
  margin-top: 0;
  margin-bottom: 10px;
  text-transform: uppercase;
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
  font-family: 'Oswald', sans-serif;
  color: var(--color-etiquetas, var(--color-texto-general, #cbd5e1));
  font-size: 13px;
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

.input-group input:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
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
  font-family: 'Oswald', sans-serif;
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
  font-family: 'Oswald', sans-serif;
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
  font-family: 'Oswald', sans-serif;
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
    border-top: 1px solid rgba(255, 255, 255, 0.06);
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
    font-family: 'Oswald', sans-serif;
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
    gap: 20px;
    padding: 15px;
  }
  .promo-box-container {
    max-width: 100%;
    min-height: auto;
    height: auto;
  }
}
</style>
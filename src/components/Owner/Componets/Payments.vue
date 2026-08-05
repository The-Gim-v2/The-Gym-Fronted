<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content">
      <!-- Columna Izquierda: Tarjeta de Perfil con Animación de Flotación -->
      <div class="profile-card-container">
        <div class="profile-card glass-effect floating-animation">
          <h1 class="main-title">JOSÉ LUIS <br> <span class="highlight">RAMÍREZ</span></h1>
          
          <div class="avatar-wrapper">
            <div class="avatar-circle">
              <img src="../../../assets/humano.jpg" alt="Avatar del usuario" class="user-avatar-img" />
            </div>
          </div>

          <p class="user-id">ID: GymPer001</p>
          
          <div class="status-badge">ACTIVO</div>
        </div>
      </div>

      <!-- Columna Derecha: Panel de Operaciones / Pago -->
      <div class="right-column">
        <div class="input-group search-bar-half">
          <label>Buscar Cliente</label>
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Buscar por nombre o ID...">
          </div>
        </div>

        <div class="login-card glass-effect">
          <div class="form-grid">
            <div class="input-group">
              <label>Próximo Corte</label>
              <input type="date" class="custom-input">
            </div>
            <div class="input-group">
              <label>Nuevo Corte</label>
              <input type="date" class="custom-input">
            </div>
          </div>

          <div class="header-row">
            <div class="input-group-label">Estado de Cuenta</div>
            <button class="btn-promos" type="button" @click="activeModal = 'promo'">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
              </svg>
              Promos
            </button>
          </div>
          
          <div class="styled-box">
            <div class="amount-info">
              <span class="amount-label">Total a pagar</span>
              <div class="amount-row">
                <span class="currency">$</span>
                <span class="amount-val">{{ montoRecibir ? montoRecibir.toFixed(2) : '450.00' }}</span>
              </div>
            </div>
            <div class="recargo-container">
              <span class="red">+ $50 Recargo</span>
              <span class="mensual-text">{{ ofertaSeleccionada ? ofertaSeleccionada.nombre : 'Mensual' }}</span>
            </div>
          </div>

          <!-- Sección Tipo de Pago y Folio -->
          <div class="payment-details-grid">
            <div class="input-group">
              <label>Tipo de Pago</label>
              <div class="input-wrapper select-wrapper-container">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                  <line x1="1" y1="10" x2="23" y2="10"></line>
                </svg>
                <select v-model="tipoPago" class="custom-select">
                  <option disabled value="">Seleccionar</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia">Transferencia</option>
                  <option value="Tarjeta">Tarjeta</option>
                </select>
                <svg class="select-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
            </div>

            <div class="input-group">
              <label>Folio / Referencia</label>
              <div class="input-wrapper input-with-icon-simple">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="input-icon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="7 10 12 15 17 10"></polyline>
                  <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                <input type="text" v-model="folioReferencia" placeholder="N° de comprobante">
              </div>
            </div>
          </div>

          <div class="input-group">
            <label>Monto a Recibir</label>
            <div class="input-with-symbol">
              <span class="symbol">$</span>
              <input type="number" v-model="montoRecibir" placeholder="0.00">
            </div>
          </div>
          
          <div class="action-buttons">
            <button class="btn-primary" :disabled="isButtonDisabled" :class="{ 'disabled': isButtonDisabled }" @click="confirmPayment">
              Confirmar Pago
            </button>
            
            <button class="btn-secondary" @click="downloadReceipt">
              <svg viewBox="0 0 24 24" fill="currentColor" class="btn-icon" width="16" height="16">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
              </svg>
              Descargar Recibo
            </button>
          </div>
        </div>
      </div>
    </main>

    <transition name="pop">
      <div v-if="activeModal === 'promo'" class="modal-wrapper" @click.self="activeModal = null">
        <Promo @select-oferta="handleSelectOferta" @close="activeModal = null" />
      </div>
    </transition>  
  </HeadingOwner>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router'; 
import HeadingOwner from '../HeadingOwner.vue';
import Promo from './Promos.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue'; 

const router = useRouter();
const activeModal = ref(null);
const toastRef = ref(null);

const montoRecibir = ref(null);
const tipoPago = ref('');
const folioReferencia = ref('');
const ofertaSeleccionada = ref(null);

const isButtonDisabled = computed(() => !montoRecibir.value || montoRecibir.value <= 100 || !tipoPago.value);

const handleSelectOferta = (oferta) => {
  ofertaSeleccionada.value = oferta;
  montoRecibir.value = oferta.precio;
  activeModal.value = null; 
  if (toastRef.value) {
    toastRef.value.notify(`Oferta aplicada: ${oferta.nombre}`, 'success');
  }
};

const confirmPayment = () => {
  if (!tipoPago.value) {
    if (toastRef.value) toastRef.value.notify('Selecciona el tipo de pago', 'error');
    return;
  }
  if (isButtonDisabled.value) {
    if (toastRef.value) toastRef.value.notify('El monto debe ser mayor a 100', 'error');
    return;
  }
  if (toastRef.value) toastRef.value.notify('Pago confirmado correctamente', 'success');
};

const downloadReceipt = () => {
  if (toastRef.value) toastRef.value.notify('Descargando recibo...', 'success');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;600;700&display=swap');

.main-content { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 60px; 
  padding: 40px; 
  min-height: 80vh; 
  box-sizing: border-box;
}

/* Animación de flotación suave (Floating Animation) */
@keyframes floatCard {
  0% {
    transform: translateY(0px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.1);
  }
  50% {
    transform: translateY(-10px);
    box-shadow: 0 30px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.25);
  }
  100% {
    transform: translateY(0px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(59, 130, 246, 0.1);
  }
}

.floating-animation {
  animation: floatCard 4s ease-in-out infinite;
}

/* Contenedor y diseño exacto tipo Card de la imagen */
.profile-card-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-card {
  background: var(--bg-cards, rgba(18, 18, 18, 0.85));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 28px);
  padding: 35px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 320px;
  box-sizing: border-box;
  will-change: transform;
}

.main-title { 
  font-family: 'Anton', sans-serif; 
  font-size: 2.3rem; 
  color: var(--color-titulos, #fff); 
  margin: 0 0 24px 0; 
  line-height: 1.05; 
  letter-spacing: 1px;
  text-transform: uppercase;
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
}

.avatar-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.avatar-circle { 
  width: 170px; 
  height: 170px; 
  background: var(--bg-input, #09090b); 
  border-radius: 50%; 
  border: 3px solid var(--color-highlight, #3b82f6); 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  box-shadow: 0 0 25px rgba(59, 130, 246, 0.3);
  overflow: hidden;
}

.user-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge { 
  background: #22c55e; 
  padding: 8px 30px; 
  border-radius: var(--app-border-radius, 20px); 
  font-weight: 700; 
  font-family: 'Oswald', sans-serif; 
  font-size: 1rem; 
  color: #ffffff; 
  box-shadow: 0 4px 15px rgba(34, 197, 94, 0.35);
  letter-spacing: 1px;
  text-transform: uppercase;
  margin-top: 6px;
}

.user-id { 
  margin: 0 0 18px 0; 
  color: var(--color-texto-secundario, #94a3b8); 
  font-weight: 600; 
  font-family: 'Inter', sans-serif; 
  font-size: 1.05rem; 
  letter-spacing: 0.5px;
}

.right-column { 
  display: flex; 
  flex-direction: column; 
  gap: 16px; 
  width: 100%; 
  max-width: 420px; 
}

.search-bar-half { 
  width: 50%; 
  align-self: flex-end; 
}

.search-input-wrapper {
  
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 12px;
  color: var(--color-texto-secundario, #71717a);
  pointer-events: none;
}

.search-input-wrapper input {
  padding-left: 36px !important;
}

.login-card { 
  background: var(--bg-cards, rgba(18, 18, 18, 0.7)); 
  backdrop-filter: blur(20px); 
  padding: 24px; 
  border-radius: var(--app-border-radius, 24px); 
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.12)); 
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
}

.header-row { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 10px; 
}

.modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.85); 
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; 
  backdrop-filter: blur(6px);
}

.pop-enter-active, .pop-leave-active {
  transition: opacity 0.3s ease;
}
.pop-enter-from, .pop-leave-to {
  opacity: 0;
}

.btn-promos { 
  background: transparent; 
  border: 1px solid var(--color-highlight, #3b82f6); 
  color: var(--color-highlight, #3b82f6); 
  border-radius: var(--app-border-radius, 20px); 
  padding: 4px 12px; 
  display: flex; 
  align-items: center; 
  gap: 6px; 
  font-family: 'Oswald', sans-serif; 
  cursor: pointer; 
  transition: 0.3s; 
}

.btn-promos:hover {
  background: rgba(59, 130, 246, 0.1);
}

.btn-primary {
  padding: 16px 36px;
  background: var(--color-botones, #1c4fd6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 12px);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1.05rem;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 16px rgba(28, 79, 214, 0.4);
}

.btn-primary.disabled { 
  background: #444; 
  color: #888;
  cursor: not-allowed; 
}

.btn-secondary { 
  width: 100%; 
  padding: 14px; 
  background: transparent; 
  border: 1px solid var(--color-highlight, #3b82f6); 
  color: var(--color-highlight, #3b82f6); 
  border-radius: var(--app-border-radius, 12px); 
  font-family: 'Oswald', sans-serif; 
  font-weight: 700; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  gap: 8px; 
  cursor: pointer; 
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: rgba(59, 130, 246, 0.05);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 25px;
}

.payment-details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 5px;
}

.select-wrapper-container, .input-with-icon-simple {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.input-icon {
  position: absolute;
  left: 12px;
  color: var(--color-texto-secundario, #71717a);
  pointer-events: none;
  z-index: 2;
}

.custom-select {
  width: 100%;
  background: var(--bg-cards, #141414); 
  border: 1px solid var(--border-input, #333);
  border-radius: var(--app-border-radius, 8px);
  color: var(--color-texto-general, #fff);
  padding: 10px 32px 10px 36px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  cursor: pointer;
  text-overflow: ellipsis;
  box-sizing: border-box;
}

.custom-select option {
  background-color: #18181b;
  color: #fff;
  padding: 8px;
}

.select-arrow {
  position: absolute;
  right: 12px;
  color: var(--color-texto-secundario, #71717a);
  pointer-events: none;
}



.input-with-icon-simple input {
  width: 100%;
  background: var(--bg-cards, #141414); 
  border: 1px solid var(--border-input, #333);
  border-radius: var(--app-border-radius, 8px);
  color: var(--color-texto-general, #fff);
  padding: 10px 10px 10px 36px !important;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  box-sizing: border-box;
}

.input-with-symbol { 
  display: flex; 
  align-items: center; 
  background: var(--bg-cards, #141414); 
  border: 1px solid var(--border-input, #333); 
  border-radius: var(--app-border-radius, 8px); 
  padding: 0 15px; 
  box-sizing: border-box;
}

.input-with-symbol .symbol { 
  color: var(--color-texto-general, #fff); 
  font-size: 1.2rem; 
  font-weight: bold; 
  margin-right: 8px; 
}

.input-with-symbol input { 
  background: transparent; 
  border: none; 
  padding: 15px 0; 
  font-size: 1.2rem; 
  color: var(--color-texto-general, #fff); 
  width: 100%; 
  outline: none; 
}

.input-group { 
  display: flex; 
  flex-direction: column; 
  gap: 8px; 
  margin-bottom: 15px; 
}

.input-group label, .input-group-label { 
  font-family: 'Oswald', sans-serif; 
  color: var(--color-titulos, #fff); 
  font-size: 14px; 
}

input:not(.input-with-symbol input, .input-with-icon-simple input) { 
  background: var(--bg-cards, #141414); 
  border: 1px solid var(--border-input, #333); 
  border-radius: var(--app-border-radius, 8px); 
  color: var(--color-texto-general, #fff); 
  padding: 10px; 
  font-family: 'Inter', sans-serif; 
  outline: none; 
  width: 100%;
  box-sizing: border-box;
}

.styled-box { 
  background: var(--bg-cards, #141414); 
  border: 1px solid var(--border-input, #333); 
  border-radius: var(--app-border-radius, 8px); 
  padding: 14px 18px; 
  display: flex; 
  align-items: center; 
  justify-content: space-between; 
  color: var(--color-texto-general, #fff); 
  margin-bottom: 20px; 
}

.amount-info {
  display: flex;
  flex-direction: column;
}

.amount-label {
  font-size: 0.75rem;
  color: var(--color-texto-secundario, #94a3b8);
  font-family: 'Oswald', sans-serif;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.amount-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.currency {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-texto-general, #ffffff);
}

.amount-val { 
  font-size: 1.8rem; 
  font-weight: 800; 
  color: var(--color-texto-general, #ffffff);
  letter-spacing: 0.5px;
  line-height: 1;
}

.recargo-container { 
  display: flex; 
  flex-direction: column; 
  align-items: flex-end; 
}

.red { 
  color: #dc2626; 
  font-weight: 700; 
  font-size: 0.9rem; 
}

.mensual-text { 
  font-family: 'Oswald', sans-serif; 
  font-size: 0.9rem; 
  color: var(--color-titulos, #fff); 
}

.form-grid { 
  display: grid; 
  grid-template-columns: 1fr 1fr; 
  gap: 10px; 
  width: 100%;
  box-sizing: border-box;
}

.btn-icon { 
  width: 18px; 
  height: 18px; 
}

@media (hover: hover) {
  .btn-primary:hover:not(:disabled), 
  .btn-secondary:hover, 
  .btn-promos:hover {
    transform: scale(1.05);
  }
}

.btn-primary:active:not(:disabled), 
.btn-secondary:active, 
.btn-promos:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .main-content { 
    flex-direction: column; 
    gap: 20px; 
    padding: 12px; 
    width: 100%;
    max-width: 100vw;
    overflow-x: hidden;
  }
  .profile-card-container,
  .profile-card {
    width: 100%;
    max-width: 100%;
  }
  .profile-card {
    padding: 24px 16px;
  }
  .right-column { 
    width: 100%; 
    max-width: 100%;
  }
  .search-bar-half { 
    width: 100%; 
    align-self: center; 
  }
  .form-grid, .payment-details-grid { 
    grid-template-columns: 1fr; 
  }
  .login-card {
    padding: 16px;
    width: 100%;
    box-sizing: border-box;
  }
  .styled-box {
    padding: 10px 14px;
    margin-bottom: 14px;
  }
  .amount-val {
    font-size: 1.4rem;
  }
}
</style>
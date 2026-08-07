<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content-promos">
      
      <!-- CUADRO IZQUIERDO: REGLAS DE MOROSIDAD -->
      <div class="promo-box-container">
        <div class="box-header">
          <h2>Reglas de <span class="highlight">Morosidad</span></h2>
          <p class="box-subtitle">Define las políticas automáticas para pagos vencidos</p>
        </div>
        
        <div class="box-content">
          <!-- Aplicar recargos a: Pendientes -->
          <div class="item-row" id="tutorial-step-0">
            <div class="item-info">
              <div class="icon-wrapper">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h4>Estatus: Pendientes</h4>
                <p>Usuarios con pago vencido pero aún activos.</p>
              </div>
            </div>
            <input type="checkbox" class="toggle-switch" v-model="settings.pendingStatus" @change="guardarCambiosRapidos" />
          </div>

          <!-- Aplicar recargos a: Inactivos -->
          <div class="item-row" id="tutorial-step-1">
            <div class="item-info">
              <div class="icon-wrapper">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <div>
                <h4>Estatus: Inactivos</h4>
                <p>Usuarios con cuenta suspendida por falta de pago.</p>
              </div>
            </div>
            <input type="checkbox" class="toggle-switch" v-model="settings.inactiveStatus" @change="guardarCambiosRapidos" />
          </div>

          <!-- Bloqueo automático de acceso en torniquete -->
          <div class="item-row" id="tutorial-step-2">
            <div class="item-info">
              <div class="icon-wrapper">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              </div>
              <div>
                <h4>Bloqueo en Torniquete</h4>
                <p>Denegar acceso al gimnasio automáticamente por morosidad.</p>
              </div>
            </div>
            <input type="checkbox" class="toggle-switch" v-model="settings.blockTurnstile" @change="guardarCambiosRapidos" />
          </div>

          <!-- Periodo de Gracia -->
          <div class="item-row vertical-layout" id="tutorial-step-3">
            <div class="item-info full-width">
              <div class="icon-wrapper">
                <svg class="icon-tag" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <div class="text-grow">
                <h4>Periodo de Gracia</h4>
                <p>Días de tolerancia después del vencimiento antes de aplicar la multa:</p>
              </div>
            </div>
            <div class="grace-period-control">
              <button class="btn-counter" @click="decrementDays" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <span class="days-display">{{ graceDays }} Días</span>
              <button class="btn-counter" @click="incrementDays" type="button">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CUADRO DERECHO: COSTO Y FRECUENCIA -->
      <div class="promo-box-container">
        <div class="box-header">
          <h2>Costo y <span class="highlight">Frecuencia</span></h2>
          <p class="box-subtitle">Configura montos, multas y recargos aplicables</p>
        </div>

        <div class="box-content">
          <div class="form-column-layout">
            <div class="input-group" id="tutorial-step-4">
              <label>Tipo de membresía o servicio afectado:</label>
              <select v-model="settings.paymentType" class="custom-select">
                <option value="membresia">Membresía General / Anualidad</option>
                <option value="clases">Paquete de Clases / Entrenador</option>
                <option value="taquilla">Renta de Casillero / Taquilla</option>
                <option value="todos">Todos los conceptos del gimnasio</option>
              </select>
            </div>

            <div class="input-group" id="tutorial-step-5">
              <label>Monto de la multa por retraso ($):</label>
              <div class="input-money-wrapper">
                <span class="currency-symbol">$</span>
                <input type="number" v-model="settings.fineAmount" class="custom-input" min="0">
              </div>
            </div>

            <div class="input-group" id="tutorial-step-6">
              <label>Frecuencia del recargo en cuenta:</label>
              <select v-model="settings.recurrence" class="custom-select">
                <option value="unica">Cargo único por vencimiento</option>
                <option value="diaria">Acumulativo diario</option>
                <option value="semanal">Recargo semanal</option>
                <option value="mensual">Recargo mensual acumulado</option>
              </select>
            </div>

            <div class="input-group" id="tutorial-step-7">
              <label>Límite máximo de acumulación de multas ($):</label>
              <div class="input-money-wrapper">
                <span class="currency-symbol">$</span>
                <input type="number" v-model="settings.maxFineLimit" class="custom-input" min="0">
              </div>
            </div>

            <div class="button-container">
              <button class="btn-primary-action" @click="guardarConfiguracionGeneral">
                Guardar Configuración
              </button>
            </div>
          </div>
        </div>
      </div>

    </main>
  </HeadingOwner>
</template>

<script setup>
import { ref } from 'vue';
import HeadingOwner from '../HeadingOwner.vue';
import NotificationSystem from '../../Modals/NotificationSystem.vue';

const toastRef = ref(null);
const graceDays = ref(3);

const settings = ref({
  pendingStatus: true,
  inactiveStatus: true,
  blockTurnstile: true,
  paymentType: 'membresia',
  fineAmount: 800,
  recurrence: 'unica',
  maxFineLimit: 2500
});

const incrementDays = () => {
  graceDays.value++;
  guardarCambiosRapidos();
};

const decrementDays = () => {
  if (graceDays.value > 0) {
    graceDays.value--;
    guardarCambiosRapidos();
  }
};

const guardarCambiosRapidos = () => {
  toastRef.value.notify('Configuración actualizada automáticamente', 'success');
};

const guardarConfiguracionGeneral = () => {
  toastRef.value.notify('Configuración general guardada con éxito', 'success');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600;700&family=Oswald:wght@400;600;700&display=swap');

.main-content-promos {
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 30px 20px;
  box-sizing: border-box;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  color: var(--color-texto-general, #e5e5e5);
}

.highlight { 
  color: var(--color-highlight, #3b82f6); 
}

.promo-box-container {
  background: var(--bg-cards, rgba(18, 18, 18, 0.85));
  backdrop-filter: blur(20px);
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.1));
  border-radius: var(--app-border-radius, 20px);
  width: 100%;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.4);
}

.box-header {
  background: var(--bg-cards, rgba(25, 25, 25, 0.5));
  padding: 22px 24px;
  text-align: left;
  border-bottom: 1px solid var(--border-line, rgba(255, 255, 255, 0.06));
}

.box-header h2 {
  font-family: 'Anton', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.6rem;
  margin: 0 0 4px 0;
  letter-spacing: 0.8px;
  text-transform: uppercase;
}

.box-subtitle {
  font-family: 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  font-size: 0.85rem;
  margin: 0;
  opacity: 0.8;
}

.box-content {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.item-row {
  background: var(--bg-cards, rgba(25, 25, 25, 0.5));
  border: 1px solid var(--border-cards, rgba(255, 255, 255, 0.06));
  border-radius: var(--app-border-radius, 12px);
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: all 0.2s ease;
}

.item-row:hover {
  border-color: var(--color-highlight, rgba(59, 130, 246, 0.3));
  background: var(--bg-cards, rgba(30, 30, 30, 0.7));
}

.vertical-layout {
  flex-direction: column;
  align-items: stretch;
  gap: 14px;
}

.form-column-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.item-info.full-width {
  width: 100%;
}

.text-grow {
  flex-grow: 1;
}

.icon-wrapper {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-tag {
  width: 20px;
  height: 20px;
  color: var(--color-highlight, #3b82f6);
}

.item-info h4 {
  font-family: 'Oswald', sans-serif;
  color: var(--color-titulos, #fff);
  font-size: 1.05rem;
  font-weight: 600;
  margin: 0 0 2px 0;
  letter-spacing: 0.3px;
}

.item-info p {
  font-family: 'Inter', sans-serif;
  color: var(--color-texto-general, #94a3b8);
  font-size: 0.85rem;
  margin: 0;
  line-height: 1.4;
}

.grace-period-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-input, rgba(15, 15, 15, 0.6));
  padding: 8px 14px;
  border-radius: var(--app-border-radius, 10px);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.08));
}

.btn-counter {
  width: 34px;
  height: 34px;
  border-radius: var(--app-border-radius, 8px);
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, #fff);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.2s, transform 0.1s;
}

.btn-counter:hover { filter: brightness(1.1); }
.btn-counter:active { transform: scale(0.92); }
.btn-counter svg { width: 16px; height: 16px; }

.days-display {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-texto-general, #fff);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.input-group label {
  font-family: 'Oswald', sans-serif;
  color: var(--color-etiquetas, var(--color-texto-general, #cbd5e1));
  font-size: 0.9rem;
  letter-spacing: 0.3px;
}

.custom-select, .custom-input {
  background: var(--bg-input, rgba(20, 20, 20, 0.8));
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.12));
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  padding: 11px 14px;
  font-family: 'Inter', sans-serif;
  outline: none;
  font-size: 0.92rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}

.custom-select:focus, .custom-input:focus {
  border-color: var(--color-highlight, #3b82f6);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}

.input-money-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}

.currency-symbol {
  position: absolute;
  left: 14px;
  color: var(--color-highlight, #94a3b8);
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
}

.input-money-wrapper .custom-input {
  padding-left: 32px;
}

.button-container {
  margin-top: 6px;
}

.btn-primary-action {
  padding: 12px;
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 10px);
  font-family: 'Oswald', sans-serif;
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.btn-primary-action:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-primary-action:active { transform: scale(0.98); }

.toggle-switch {
  appearance: none;
  width: 44px;
  height: 24px;
  background: var(--bg-input, #3f3f46);
  border: 1px solid var(--border-input, rgba(255, 255, 255, 0.1));
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
  outline: none;
  flex-shrink: 0;
}

.toggle-switch:checked {
  background: var(--color-botones, #3b82f6);
  border-color: var(--color-botones, #3b82f6);
}

.toggle-switch::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch:checked::before {
  transform: translateX(20px);
}

@media (max-width: 900px) {
  .main-content-promos {
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 12px;
    height: auto;
  }
  
  .promo-box-container {
    max-width: 100%;
    height: auto !important;
  }
}
</style>
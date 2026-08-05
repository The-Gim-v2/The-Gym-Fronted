<template>
  <HeadingOwner>
    <NotificationSystem ref="toastRef" />
    <main class="main-content-promos">
      
      <!-- CUADRO IZQUIERDO: REGLAS DE MOROSIDAD Y ESTILOS -->
      <div class="promo-box-container">
        <div class="box-header">
          <h2>Reglas de <span class="highlight">Morosidad</span></h2>
        </div>
        
        <div class="box-content">
          <!-- Aplicar recargos a: Pendientes -->
          <div class="item-row">
            <div class="item-info">
              <svg class="icon-tag" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <div>
                <h4>Estatus: Pendientes</h4>
                <p>Usuarios con pago vencido pero aún activos.</p>
              </div>
            </div>
            <input type="checkbox" class="toggle-switch" v-model="settings.pendingStatus" @change="guardarCambiosRapidos" />
          </div>

          <!-- Aplicar recargos a: Inactivos -->
          <div class="item-row">
            <div class="item-info">
              <svg class="icon-tag" viewBox="0 0 24 24" fill="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <div>
                <h4>Estatus: Inactivos</h4>
                <p>Usuarios con cuenta suspendida por falta de pago.</p>
              </div>
            </div>
            <input type="checkbox" class="toggle-switch" v-model="settings.inactiveStatus" @change="guardarCambiosRapidos" />
          </div>

          <!-- Bloqueo automático de acceso en torniquete -->
          <div class="item-row">
            <div class="item-info">
              <svg class="icon-tag" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
              <div>
                <h4>Bloqueo en Torniquete</h4>
                <p>Denegar acceso al gimnasio automáticamente por morosidad.</p>
              </div>
            </div>
            <input type="checkbox" class="toggle-switch" v-model="settings.blockTurnstile" @change="guardarCambiosRapidos" />
          </div>

          <!-- Periodo de Gracia -->
          <div class="item-row vertical-layout">
            <div class="item-info full-width">
              <svg class="icon-tag" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <div class="text-grow">
                <h4>Periodo de Gracia</h4>
                <p>Días de tolerancia después del vencimiento antes de aplicar la multa:</p>
              </div>
            </div>
            <div class="grace-period-control">
              <button class="btn-counter" @click="decrementDays">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <span class="days-display">{{ graceDays }} Días</span>
              <button class="btn-counter" @click="incrementDays">
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
        </div>

        <div class="box-content">
          <div class="item-row form-column-layout">
            <div class="input-group full-width">
              <label>Tipo de membresía o servicio afectado:</label>
              <select v-model="settings.paymentType" class="custom-select">
                <option value="membresia">Membresía General / Anualidad</option>
                <option value="clases">Paquete de Clases / Entrenador</option>
                <option value="taquilla">Renta de Casillero / Taquilla</option>
                <option value="todos">Todos los conceptos del gimnasio</option>
              </select>
            </div>

            <div class="input-group full-width">
              <label>Monto de la multa por retraso ($):</label>
              <div class="input-money-wrapper">
                <span class="currency-symbol">$</span>
                <input type="number" v-model="settings.fineAmount" class="custom-input" min="0">
              </div>
            </div>

            <div class="input-group full-width">
              <label>Frecuencia del recargo en cuenta:</label>
              <select v-model="settings.recurrence" class="custom-select">
                <option value="unica">Cargo único por vencimiento</option>
                <option value="diaria">Acumulativo diario</option>
                <option value="semanal">Recargo semanal</option>
                <option value="mensual">Recargo mensual acumulado</option>
              </select>
            </div>

            <div class="input-group full-width">
              <label>Límite máximo de acumulación de multas ($):</label>
              <div class="input-money-wrapper">
                <span class="currency-symbol">$</span>
                <input type="number" v-model="settings.maxFineLimit" class="custom-input" min="0">
              </div>
            </div>

            <button class="btn-primary-action" @click="guardarConfiguracionGeneral">
              Guardar Configuración
            </button>
          </div>
        </div>
      </div>

    </main>
  </HeadingOwner>
</template>

<script setup>
import { ref, reactive } from 'vue';
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
  height: 650px;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
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
  transition: all 0.2s ease;
}

.item-row:hover {
  border-color: var(--color-highlight, rgba(59, 130, 246, 0.4));
}

.vertical-layout {
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
}

.form-column-layout {
  flex-direction: column;
  align-items: stretch;
  gap: 12px;
  background: transparent;
  border: none;
  padding: 0;
}

.form-column-layout:hover {
  border-color: transparent;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 15px;
}

.item-info.full-width {
  width: 100%;
}

.text-grow {
  flex-grow: 1;
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
}

.item-info p {
  font-family: 'Inter', sans-serif;
  color: var(--color-highlight, #94a3b8);
  font-size: 0.9rem;
  margin: 0;
}

/* Control de Periodo de Gracia */
.grace-period-control {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-input, rgba(18, 18, 18, 0.6));
  padding: 8px 12px;
  border-radius: var(--app-border-radius, 10px);
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.1));
}

.btn-counter {
  width: 32px;
  height: 32px;
  border-radius: var(--app-border-radius, 8px);
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, #fff);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}

@media (hover: hover) {
  .btn-counter:hover {
    filter: brightness(0.95);
  }
}

.btn-counter svg {
  width: 16px;
  height: 16px;
}

.days-display {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-texto-general, #fff);
}

/* Campos del Formulario */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
}

.input-group.full-width {
  width: 100%;
}

.input-group label {
  font-family: 'Oswald', sans-serif;
  color: var(--color-etiquetas, var(--color-texto-general, #cbd5e1));
  font-size: 12px;
}

.custom-select, .custom-input {
  background: var(--bg-input, rgba(25, 25, 25, 0.9));
  border: 1.5px solid var(--border-input, rgba(255, 255, 255, 0.15));
  border-radius: var(--app-border-radius, 10px);
  color: var(--color-texto-input, var(--color-texto-general, #fff));
  padding: 10px 12px;
  font-family: 'Inter', sans-serif;
  outline: none;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s;
}

.custom-select:focus, .custom-input:focus {
  border-color: var(--color-highlight, #3b82f6);
  background: var(--bg-input-focus, var(--bg-cards, rgba(25, 25, 25, 0.9)));
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
  left: 12px;
  color: var(--color-highlight, #94a3b8);
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
}

.input-money-wrapper .custom-input {
  padding-left: 28px;
}

/* Botón de Guardar General */
.btn-primary-action {
  margin-top: 5px;
  padding: 12px;
  background: var(--color-botones, #3b82f6);
  color: var(--color-texto-botones, white);
  border: none;
  border-radius: var(--app-border-radius, 10px);
  font-family: 'Oswald', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  width: 100%;
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

@media (hover: hover) {
  .btn-primary-action:hover {
    transform: translateY(-1px);
    filter: brightness(0.95);
    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  }
}

.btn-primary-action:active {
  transform: scale(0.97);
}

/* Toggle Switch Estilizado con Variables */
.toggle-switch {
  appearance: none;
  width: 44px;
  height: 24px;
  background: var(--bg-input, #3f3f46);
  border: 1.5px solid var(--border-input, transparent);
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background 0.3s, border-color 0.3s;
  outline: none;
  flex-shrink: 0;
}

.toggle-switch:checked {
  background: var(--color-botones, #3b82f6);
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
  transition: transform 0.3s;
}

.toggle-switch:checked::before {
  transform: translateX(20px);
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
    height: auto;
    min-height: 550px;
  }
}
</style>
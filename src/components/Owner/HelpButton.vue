<template>
  <div>
    <!-- Botón flotante: Solo aparece si el tutorial está activo y existen pasos para la ruta actual -->
    <button v-if="tutorialEnabled && steps.length > 0" class="btn-help" @click="startTutorial">
      <svg viewBox="0 0 24 24" width="24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>
    </button>

    <!-- Modal de Tutorial -->
    <div v-if="activeStep !== null" class="help-modal-overlay" @click="activeStep = null">
      <div class="help-modal" @click.stop>
        <h3>{{ steps[activeStep].title }}</h3>
        <p>{{ steps[activeStep].description }}</p>
        <div class="modal-footer">
          <span>{{ activeStep + 1 }} de {{ steps.length }}</span>
          <button class="nav-btn" @click="nextStep">
            {{ activeStep < steps.length - 1 ? 'Siguiente →' : 'Finalizar' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeStep = ref(null);
const tutorialEnabled = ref(localStorage.getItem('tutorialActivo') === 'true');

// Diccionario de tutoriales
// Dentro de tu HelpButton.vue, en la sección <script setup>
const tutoriales = {
  'Owner-dashboard': [
    { title: "Dashboard", description: "Vista general de la actividad del sistema." }
  ],
  'register-clients': [
    { title: "Registro de Clientes", description: "Ingresa los datos personales del nuevo cliente." },
    { title: "Detalles", description: "Asegúrate de llenar los campos obligatorios." }
  ],
  'register-staff': [
    { title: "Registro de Staff", description: "Da de alta a nuevos miembros del equipo." }
  ],
  'view-clients': [
    { title: "Gestión de Clientes", description: "Visualiza la lista completa de usuarios." },
    { title: "Filtros", description: "Usa la barra de búsqueda para encontrar clientes rápidamente." }
  ],
  'view-staff': [
    { title: "Personal", description: "Lista de empleados registrados y sus roles." }
  ],
  'edit-user': [
    { title: "Editar Cliente", description: "Modifica la información del usuario seleccionado." }
  ],
  'edit-staff': [
    { title: "Editar Staff", description: "Actualiza los permisos y datos del personal." }
  ],
  'pay': [
    { title: "Pagos", description: "Procesa el pago correspondiente al cliente." }
  ],
  'recovery': [
    { title: "Recuperación", description: "Opciones para recuperar acceso a cuentas." }
  ],
  'statistics': [
    { title: "Estadísticas", description: "Analiza el rendimiento y métricas detalladas." }
  ],
  'payments': [
    { title: "Pagos", description: "Control central de transacciones." }
  ],
  'pricing-management': [
    { title: "Precios", description: "Configura las tarifas y costos del sistema." }
  ],
  'fees-management': [
    { title: "Cuotas", description: "Owneristra los cargos y cuotas vigentes." }
  ],
  'attendance-log': [
    { title: "Bitácora de Asistencia", description: "Registro diario de entradas y salidas." }
  ],
  'debtors-list': [
    { title: "Deudores", description: "Lista de clientes con pagos pendientes." }
  ],
  'renewals': [
    { title: "Renovaciones", description: "Gestiona los clientes que están por vencer." }
  ],
  'revenue-log': [
    { title: "Ingresos", description: "Historial detallado de los ingresos totales." }
  ],
  'Owner-settings': [
    { title: "Configuración", description: "Ajustes globales del sistema." }
  ],
  'profile': [
    { title: "Perfil", description: "Edita tu información de usuario." }
  ],
  'graph': [
    { title: "Gráficas", description: "Visualización de datos de asistencia." }
  ],
  'earnings': [
    { title: "Ganancias", description: "Resumen financiero del periodo." }
  ],
  'help': [
    { title: "Centro de Ayuda", description: "Documentación y soporte técnico." }
  ],
  'mail': [
    { title: "Mensajería", description: "Envío y recepción de notificaciones vía correo." }
  ],
  'cut': [
    { title: "Corte de Caja", description: "Realiza el cierre financiero del día." }
  ],
  'bulk-email': [
    { title: "Correo Masivo", description: "Envía comunicados a todos los usuarios." }
  ],
  'promos': [
    { title: "Promociones", description: "Gestiona ofertas y descuentos activos." }
  ]
};

// Computado para obtener los pasos de la ruta actual
const steps = computed(() => tutoriales[route.name] || []);

const startTutorial = () => {
  if (steps.value.length > 0) activeStep.value = 0;
};

const nextStep = () => {
  if (activeStep.value < steps.value.length - 1) {
    activeStep.value++;
  } else {
    activeStep.value = null;
  }
};

const updateTutorialStatus = () => {
  tutorialEnabled.value = localStorage.getItem('tutorialActivo') === 'true';
};

onMounted(() => {
  window.addEventListener('tutorial-updated', updateTutorialStatus);
});

onUnmounted(() => {
  window.removeEventListener('tutorial-updated', updateTutorialStatus);
});
</script>

<style scoped>
/* Botón flotante */
.btn-help {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.2s;
}

.btn-help:hover { transform: scale(1.1); }

/* Modal */
.help-modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.help-modal {
  background: white;
  color: #333;
  padding: 25px;
  border-radius: 12px;
  width: 320px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
}

.help-modal h3 { margin-top: 0; font-family: 'Oswald', sans-serif; color: #1a1a1a; }
.help-modal p { font-size: 0.95rem; line-height: 1.4; color: #666; }

.modal-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
  font-family: 'Oswald', sans-serif;
}

.nav-btn {
  padding: 8px 16px;
  border: none;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
</style>
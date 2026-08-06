<template>
  <div>
    <!-- Botón flotante de ayuda -->
    <button v-if="tutorialEnabled && steps.length > 0" class="btn-help" @click="startTutorial">
      <svg viewBox="0 0 24 24" width="24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>
    </button>

    <!-- Overlay con efecto Spotlight -->
    <div v-if="activeStep !== null" class="tutorial-overlay" @click="closeTutorial">
      <!-- Recuadro iluminado (Spotlight) sobre la tarjeta actual -->
      <div 
        v-if="targetRect" 
        class="spotlight-box" 
        :style="{
          top: targetRect.top + 'px',
          left: targetRect.left + 'px',
          width: targetRect.width + 'px',
          height: targetRect.height + 'px'
        }"
      ></div>

      <!-- Tarjeta de explicación flotante -->
      <div 
        v-if="steps[activeStep]" 
        class="help-popover" 
        :class="{ 'mobile-hidden-text': isMobile && !textRevealed }"
        :style="popoverStyle"
        @click.stop
      >
        <div class="popover-header">
          <h3>{{ steps[activeStep].title }}</h3>
          <button class="close-btn" @click="closeTutorial">×</button>
        </div>
        <p>{{ steps[activeStep].description }}</p>
        <div class="modal-footer">
          <span>{{ activeStep + 1 }} de {{ steps.length }}</span>
          <div class="buttons-group">
            <button v-if="isMobile && !textRevealed" class="nav-btn" @click="revealTextNow">
              Mostrar texto
            </button>
            <button v-if="activeStep > 0" class="nav-btn secondary" @click="prevStep">Anterior</button>
            <button class="nav-btn" @click="nextStep">
              {{ activeStep < steps.length - 1 ? 'Siguiente →' : 'Finalizar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const activeStep = ref(null);
const tutorialEnabled = ref(localStorage.getItem('tutorialActivo') === 'true');
const targetRect = ref(null);
const windowWidth = ref(window.innerWidth);

// Control para la revelación del texto en móvil tras 10 segundos o botón
const textRevealed = ref(false);
let revealTimer = null;

const isMobile = computed(() => windowWidth.value <= 768);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (activeStep.value !== null) {
    updateTargetPosition();
  }
};

// Diccionario de tutoriales
const tutoriales = {
  'Owner-dashboard': [
    { title: "Encabezado y Estatus", description: "Este es el nombre del gimnasio registrado y la sucursal. Cuenta con botones para definir si está abierto o cerrado, y muestra tu estatus de pago al corriente.", selector: '#tutorial-step-0' },
    { title: "Métricas de Actividad", description: "Visualiza rápidamente las entradas del día, las personas que se encuentran actualmente en las instalaciones y las membresías por vencer.", selector: '#tutorial-step-1' },
    { title: "Control de Acceso", description: "Gestiona el ingreso mediante asistencia facial con reconocimiento biométrico por IA o utilizando el escáner de códigos QR para validar pases digitales.", selector: '#tutorial-step-2' },
    { title: "Administración y Turnos", description: "Configura turnos, clases y consulta el calendario activo que opera de lunes a domingo.", selector: '#tutorial-step-3' }
  ],
  'register-clients': [
    { title: "Fotografía del Cliente", description: "Sube o captura una fotografía reciente del cliente para identificarlo rápidamente.", selector: '#tutorial-step-0' },
    { title: "Datos Personales", description: "Ingresa la información básica de identificación del nuevo miembro.", selector: '#tutorial-step-1' },
    { title: "Registro Físico", description: "Captura las medidas corporales iniciales del cliente.", selector: '#tutorial-step-2' },
    { title: "Datos de Membresía y Vigencia", description: "Selecciona el esquema de cobro y define fechas de inscripción.", selector: '#tutorial-step-3' }
  ],
  'register-staff': [
    { title: "Fotografía del Empleado", description: "Sube una fotografía oficial para integrarla al expediente.", selector: '#tutorial-step-0' },
    { title: "Credenciales y Rol", description: "Define el rol y asigna el correo electrónico de acceso.", selector: '#tutorial-step-1' },
    { title: "Datos del Empleado", description: "Captura la información oficial y de contacto del colaborador.", selector: '#tutorial-step-2' },
    { title: "Horario de Trabajo", description: "Establece las horas de entrada y salida para el control de asistencia.", selector: '#tutorial-step-3' }
  ],
  'view-clients': [
    { title: "Filtros y Búsqueda General", description: "Filtra la lista de usuarios por tipo de membresía o estatus.", selector: '#tutorial-step-0' },
    { title: "Listado de Clientes", description: "Visualiza la información resumida de cada usuario.", selector: '#tutorial-step-1' },
    { title: "Acciones por Usuario", description: "Realiza acciones específicas como enviar correos o ver código QR.", selector: '#tutorial-step-2' }
  ],
  'view-staff': [
    { title: "Filtros y Búsqueda de Personal", description: "Filtra al personal por su rol en el sistema.", selector: '#tutorial-step-0' },
    { title: "Listado de Personal", description: "Visualiza la información clave de cada empleado.", selector: '#tutorial-step-1' },
    { title: "Acciones por Empleado", description: "Gestiona las acciones individuales para cada miembro.", selector: '#tutorial-step-2' }
  ],
  'payments': [
    { title: "Filtros y Búsqueda de Pagos", description: "Filtra el listado por tipo de mensualidad o estatus actual.", selector: '#tutorial-step-0' },
    { title: "Listado de Pagos", description: "Visualiza la información general de cada registro.", selector: '#tutorial-step-1' },
    { title: "Acciones de Pago", description: "Registra un pago, edita los datos o elimina el registro.", selector: '#tutorial-step-2' }
  ],
  'pricing-management': [
    { title: "Promociones", description: "Visualiza y administra las promociones vigentes.", selector: '#tutorial-step-0' },
    { title: "Cambios de Precios", description: "Administra y modifica los costos de las mensualidades.", selector: '#tutorial-step-1' }
  ],
  'fees-management': [
    { title: "Estatus: Pendientes", description: "Activa o desactiva la aplicación automática de recargos.", selector: '#tutorial-step-0' },
    { title: "Estatus: Inactivos", description: "Define si el sistema debe cambiar a inactivo cuentas vencidas.", selector: '#tutorial-step-1' },
    { title: "Bloqueo en Torniquete", description: "Habilita el bloqueo automático para denegar ingreso.", selector: '#tutorial-step-2' },
    { title: "Periodo de Gracia", description: "Configura días de tolerancia tras el vencimiento.", selector: '#tutorial-step-3' },
    { title: "Tipo de Servicio Afectado", description: "Selecciona a qué membresías aplican estas reglas.", selector: '#tutorial-step-4' },
    { title: "Monto de la Multa", description: "Establece la cantidad monetaria fija por retraso.", selector: '#tutorial-step-5' },
    { title: "Frecuencia del Recargo", description: "Determina si el cargo es único o acumulativo.", selector: '#tutorial-step-6' },
    { title: "Límite Máximo de Multas", description: "Establece el tope máximo acumulable.", selector: '#tutorial-step-7' }
  ],
  'revenue-log': [
    { title: "Filtros y Resumen de Ingresos", description: "Filtra los pagos o consulta el total recaudado.", selector: '#tutorial-step-0' },
    { title: "Tabla de Ingresos", description: "Visualiza el detalle completo de cada transacción.", selector: '#tutorial-step-1' }
  ],
  'debtors-list': [
    { title: "Filtros y Búsqueda", description: "Filtra los deudores por tipo de membresía o estatus.", selector: '#tutorial-step-0' },
    { title: "Listado de Deudores", description: "Visualiza la información clave de cada usuario con adeudo.", selector: '#tutorial-step-1' },
    { title: "Acciones Rápidas", description: "Comunícate por correo o WhatsApp.", selector: '#tutorial-step-2' }
  ],
  'attendance-log': [
    { title: "Filtros y Reportes de Asistencia", description: "Filtra la asistencia por día de la semana.", selector: '#tutorial-step-0' },
    { title: "Listado de Asistencia", description: "Visualiza la información clave de cada usuario.", selector: '#tutorial-step-1' }
  ],
  'renewals': [
    { title: "Búsqueda de Usuarios", description: "Busca de forma específica a los usuarios que necesitan renovación.", selector: '#tutorial-step-0' },
    { title: "Listado de Renovaciones", description: "Visualiza cuentas con membresía vencida o próxima a vencer.", selector: '#tutorial-step-1' },
    { title: "Acciones Rápidas", description: "Realiza renovación inmediata o elimina el registro.", selector: '#tutorial-step-2' }
  ],
  'Owner-settings': [
    { title: "Guardar Cambios", description: "Aplica y almacena modificaciones.", selector: '#btn-guardar-cambios' },
    { title: "Temas y Combinaciones", description: "Selecciona estilos visuales.", selector: '#panel-temas' },
    { title: "Notificaciones", description: "Activa o desactiva alertas.", selector: '#row-notificaciones' },
    { title: "Tutorial", description: "Habilita o deshabilita la guía.", selector: '#row-tutorial' },
    { title: "Idioma de la Interfaz", description: "Selecciona idioma principal.", selector: '#row-idioma' },
    { title: "Paleta de Colores Detallada", description: "Personaliza colores de componentes.", selector: '#row-paleta-colores' },
    { title: "Densidad de la Interfaz", description: "Elige espaciado general.", selector: '#row-densidad' },
    { title: "Estilo de Bordes", description: "Define curvatura visual.", selector: '#row-border-radius' },
    { title: "Exportación de Datos", description: "Descarga respaldos y bitácoras.", selector: '#panel-exportacion' }
  ],
  'profile': [
    { title: "Logotipo del Gimnasio", description: "Sube o cambia la imagen del logotipo.", selector: '#tutor-5' },
    { title: "Información del Establecimiento", description: "Modifica el nombre oficial y consulta CURP.", selector: '#tutor-13' },
    { title: "Membresía del Sitio", description: "Consulta plan activo actual.", selector: '#tutor-20' },
    { title: "Acciones Pro", description: "Agrega sedes e interactúa con IA.", selector: '#tutor-23' },
    { title: "Datos del Administrador", description: "Actualiza información personal y de contacto.", selector: '#tutor-27' },
    { title: "Ubicación del Gimnasio", description: "Configura la dirección física completa.", selector: '#tutor-40' },
    { title: "Configuración de Operación", description: "Define días de apertura y tarifas.", selector: '#tutor-50' },
    { title: "Guardar Cambios", description: "Aplica modificaciones en el perfil.", selector: '#tutor-64' }
  ]
};

const steps = computed(() => tutoriales[route.name] || []);

const setupStepTimer = () => {
  textRevealed.value = false;
  if (revealTimer) clearTimeout(revealTimer);

  if (isMobile.value) {
    // Revelar texto automáticamente después de 10 segundos en móvil
    revealTimer = setTimeout(() => {
      textRevealed.value = true;
    }, 10000);
  } else {
    textRevealed.value = true;
  }
};

const revealTextNow = () => {
  if (revealTimer) clearTimeout(revealTimer);
  textRevealed.value = true;
};

const updateTargetPosition = () => {
  if (activeStep.value === null || !steps.value[activeStep.value]) return;
  
  const stepConfig = steps.value[activeStep.value];
  const el = document.querySelector(stepConfig.selector);

  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const rect = el.getBoundingClientRect();
      targetRect.value = {
        top: rect.top - 8,
        left: rect.left - 8,
        width: rect.width + 16,
        height: rect.height + 16
      };
    }, 250);
  } else {
    targetRect.value = null;
  }
};

const popoverStyle = computed(() => {
  if (!targetRect.value) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  
  const rect = targetRect.value;

  // En móvil, si el cuadro es grande o pequeño, aseguramos que el popover se encime exactamente encima del spotlight box
  if (isMobile.value) {
    return {
      top: rect.top + 'px',
      left: rect.left + 'px',
      width: rect.width + 'px',
      height: rect.height + 'px',
      transform: 'none',
      maxWidth: 'none',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    };
  }

  // Vista de Escritorio (Desktop) mantiene su posición libre afuera del elemento
  const popoverHeight = 220;
  const spaceBelow = window.innerHeight - (rect.top + rect.height);
  if (spaceBelow > popoverHeight + 20) {
    return {
      top: (rect.top + rect.height + 12) + 'px',
      left: Math.max(20, Math.min(rect.left, window.innerWidth - 360)) + 'px',
      transform: 'none',
      width: '340px'
    };
  } else {
    return {
      top: Math.max(20, rect.top - popoverHeight - 12) + 'px',
      left: Math.max(20, Math.min(rect.left, window.innerWidth - 360)) + 'px',
      transform: 'none',
      width: '340px'
    };
  }
});

const startTutorial = () => {
  if (steps.value.length > 0) {
    activeStep.value = 0;
    setupStepTimer();
    nextTick(() => {
      updateTargetPosition();
    });
  }
};

const nextStep = () => {
  if (activeStep.value < steps.value.length - 1) {
    activeStep.value++;
    setupStepTimer();
    updateTargetPosition();
  } else {
    closeTutorial();
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
    setupStepTimer();
    updateTargetPosition();
  }
};

const closeTutorial = () => {
  if (revealTimer) clearTimeout(revealTimer);
  activeStep.value = null;
  targetRect.value = null;
  textRevealed.value = false;
};

const updateTutorialStatus = () => {
  tutorialEnabled.value = localStorage.getItem('tutorialActivo') === 'true';
};

onMounted(() => {
  window.addEventListener('tutorial-updated', updateTutorialStatus);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (revealTimer) clearTimeout(revealTimer);
  window.removeEventListener('tutorial-updated', updateTutorialStatus);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.btn-help {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;
  background: var(--color-botones, #1c4fd6);
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

.tutorial-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  overflow: hidden;
}

.spotlight-box {
  position: absolute;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(93, 91, 233, 0.8);
  border: 2px solid #5558f7;
  transition: top 0.3s ease, left 0.3s ease, width 0.3s ease, height 0.3s ease;
  pointer-events: none;
}

.help-popover {
  position: absolute;
  background: #1b232e;
  color: #fff;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10000;
  transition: top 0.3s ease, left 0.3s ease, transform 0.3s ease;
  box-sizing: border-box;
}

/* Ocultar contenido del texto en móvil hasta que se revele */
.mobile-hidden-text .popover-header,
.mobile-hidden-text p {
  opacity: 0;
  pointer-events: none;
}

.mobile-hidden-text .modal-footer span {
  display: none;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.help-popover h3 { 
  margin: 0; 
  font-size: 1.1rem; 
  font-family: 'Oswald', sans-serif; 
  color: #fff; 
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #aaa;
  padding: 0 4px;
}

.close-btn:hover { color: #fff; }

.help-popover p { 
  font-size: 0.92rem; 
  line-height: 1.4; 
  color: #cbd5e1; 
  margin-bottom: 16px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Oswald', sans-serif;
}

.buttons-group {
  display: flex;
  gap: 8px;
  width: 100%;
  justify-content: flex-end;
}

.nav-btn {
  padding: 7px 14px;
  border: none;
  background: var(--color-botones, #1c4fd6);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.85rem;
}

.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.nav-btn:hover {
  opacity: 0.9;
}
</style>
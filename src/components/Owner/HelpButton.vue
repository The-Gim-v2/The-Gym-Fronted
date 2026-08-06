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

// Diccionario limpio apuntando directamente a los IDs que acabamos de colocar
const tutoriales = {
  'Owner-dashboard': [
    { 
      title: "Encabezado y Estatus", 
      description: "Este es el nombre del gimnasio registrado y la sucursal. Cuenta con botones para definir si está abierto o cerrado, y muestra tu estatus de pago al corriente.",
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Métricas de Actividad", 
      description: "Visualiza rápidamente las entradas del día, las personas que se encuentran actualmente en las instalaciones y las membresías por vencer.",
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Control de Acceso", 
      description: "Gestiona el ingreso mediante asistencia facial con reconocimiento biométrico por IA o utilizando el escáner de códigos QR para validar pases digitales.",
      selector: '#tutorial-step-2' 
    },
    { 
      title: "Administración y Turnos", 
      description: "Configura turnos, clases y consulta el calendario activo que opera de lunes a domingo.",
      selector: '#tutorial-step-3' 
    }
  ],
  'register-clients': [
    { 
      title: "Fotografía del Cliente", 
      description: "Sube o captura una fotografía reciente del cliente. Esto es fundamental para identificarlo rápidamente en el sistema al momento de registrar su asistencia.",
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Datos Personales", 
      description: "Ingresa la información básica de identificación del nuevo miembro, incluyendo su nombre completo, fecha de nacimiento, número celular y correo electrónico.",
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Registro Físico", 
      description: "Captura las medidas corporales iniciales del cliente como su peso en kilogramos y su altura para llevar un seguimiento de su progreso.",
      selector: '#tutorial-step-2' 
    },
    { 
      title: "Datos de Membresía y Vigencia", 
      description: "Selecciona el esquema de cobro (por mes o semana), define las fechas de inscripción y el día de corte correspondiente para mantener sus accesos activos.",
      selector: '#tutorial-step-3' 
    }
  ],
  'register-staff': [
    { 
      title: "Fotografía del Empleado", 
      description: "Sube una fotografía oficial o reciente para integrarla al expediente del colaborador dentro de la plataforma.",
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Datos del Empleado", 
      description: "Captura la información oficial y de contacto del colaborador, incluyendo su CURP, nombre completo, fecha de nacimiento, teléfono y perfiles de redes sociales.",
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Credenciales y Rol", 
      description: "Define el rol que desempeñará en el sistema (permisos de acceso) y asigna el correo electrónico con el que iniciará sesión.",
      selector: '#tutorial-step-2' 
    },
    { 
      title: "Horario de Trabajo", 
      description: "Establece las horas de entrada y salida correspondientes para llevar el control de asistencia y turnos del personal.",
      selector: '#tutorial-step-3' 
    }
  ],
  'view-clients': [
    { 
      title: "Filtros y Búsqueda General", 
      description: "Filtra la lista de usuarios por tipo de membresía, su estatus actual (Activo/Inactivo), envía notificaciones masivas o busca a un cliente por su nombre de forma rápida.",
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Listado de Clientes", 
      description: "Visualiza la información resumida de cada usuario: foto de perfil, nombre completo, correo electrónico, número de celular y su estatus vigente.",
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Acciones por Usuario", 
      description: "Realiza acciones específicas para cada cliente: enviar correos individuales, cambiar estatus, ver su código QR de acceso, editar sus datos o eliminar el registro.",
      selector: '#tutorial-step-2' 
    }
  ],
  'view-staff': [
    { 
      title: "Filtros y Búsqueda de Personal", 
      description: "Filtra al personal por su rol en el sistema (Recepcionista, Entrenador), envía correos masivos o busca rápidamente a un empleado por su nombre.",
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Listado de Personal", 
      description: "Visualiza la información clave de cada empleado: foto de perfil, nombre completo, correo electrónico, número celular y el rol asignado.",
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Acciones por Empleado", 
      description: "Gestiona las acciones individuales para cada miembro del personal: enviar correo, cambiar estatus, editar su información o eliminar el registro.",
      selector: '#tutorial-step-2' 
    }
  ],
  'payments': [
    { 
      title: "Filtros y Búsqueda de Pagos", 
      description: "Filtra el listado por tipo de mensualidad, su estatus actual (Activo, Pendiente, Inactivo), envía correos masivos o busca usuarios por su nombre de forma rápida.", 
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Listado de Pagos", 
      description: "Visualiza la información general de cada registro: foto de perfil, nombre completo, correo electrónico, fecha a vencer y el estatus actual de su pago.", 
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Acciones de Pago", 
      description: "Realiza acciones específicas para cada registro: registrar un pago, editar los datos del usuario o eliminar el registro.", 
      selector: '#tutorial-step-2' 
    }
  ]

};

const steps = computed(() => tutoriales[route.name] || []);

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
    }, 300);
  } else {
    targetRect.value = null;
  }
};


const popoverStyle = computed(() => {
  if (!targetRect.value) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  
  const rect = targetRect.value;
  const spaceBelow = window.innerHeight - (rect.top + rect.height);
  const popoverHeight = 220; // Altura estimada del popover
  
  // Si no cabe abajo y tampoco arriba de forma cómoda, lo centramos o adaptamos para móviles
  if (window.innerWidth <= 768) {
    return {
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '90%',
      maxWidth: '340px'
    };
  }

  // Si hay suficiente espacio abajo, lo ponemos abajo; si no, lo colocamos arriba del elemento
  if (spaceBelow > popoverHeight + 20) {
    return {
      top: (rect.top + rect.height + 12) + 'px',
      left: Math.max(20, Math.min(rect.left, window.innerWidth - 360)) + 'px',
      transform: 'none'
    };
  } else {
    return {
      top: Math.max(20, rect.top - popoverHeight - 12) + 'px',
      left: Math.max(20, Math.min(rect.left, window.innerWidth - 360)) + 'px',
      transform: 'none'
    };
  }
});
const startTutorial = () => {
  if (steps.value.length > 0) {
    activeStep.value = 0;
    updateTargetPosition();
  }
};

const nextStep = () => {
  if (activeStep.value < steps.value.length - 1) {
    activeStep.value++;
    updateTargetPosition();
  } else {
    closeTutorial();
  }
};

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value--;
    updateTargetPosition();
  }
};

const closeTutorial = () => {
  activeStep.value = null;
  targetRect.value = null;
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
.btn-help {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 60px;
  height: 60px;
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

/* El foco brillante exacto como en el video */
.spotlight-box {
  position: absolute;
  border-radius: 12px;
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(93, 91, 233, 0.8);
  border: 2px solid #5558f7;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.help-popover {
  position: absolute;
  background: #1b232e;
  color: #fff;
  padding: 20px;
  border-radius: 12px;
  width: 340px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 10000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
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
  font-size: 1.3rem;
  cursor: pointer;
  color: #aaa;
}

.close-btn:hover { color: #fff; }

.help-popover p { 
  font-size: 0.92rem; 
  line-height: 1.4; 
  color: #cbd5e1; 
  margin-bottom: 20px;
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
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
  
  if (spaceBelow > 240) {
    return {
      top: (rect.top + rect.height + 15) + 'px',
      left: Math.max(20, Math.min(rect.left, window.innerWidth - 360)) + 'px'
    };
  } else {
    return {
      top: (rect.top - 230) + 'px',
      left: Math.max(20, Math.min(rect.left, window.innerWidth - 360)) + 'px'
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
  box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.75), 0 0 20px rgba(147, 51, 234, 0.8);
  border: 2px solid #a855f7;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.help-popover {
  position: absolute;
  background: #1e1b2e;
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
  background: #9333ea;
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
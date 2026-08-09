<template>
  <div>
    <!-- Botón flotante de ayuda -->
    <button v-if="tutorialEnabled && steps.length > 0" class="btn-help" @click="startTutorial">
      <svg viewBox="0 0 24 24" width="24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
      </svg>
    </button>

    <!-- Overlay transparente -->
    <div v-if="activeStep !== null" class="tutorial-overlay" @click="closeTutorial">
      <!-- Recuadro iluminado (Spotlight): Su sombra oscurece el exterior y deja el centro transparente -->
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

      <!-- Tarjeta de explicación flotante fuera del spotlight -->
      <div 
        v-if="steps[activeStep] && (!isMobile || textRevealed)" 
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
          <span class="step-badge">{{ activeStep + 1 }} {{ t('of') }} {{ steps.length }}</span>
          <div class="buttons-group">
            <button v-if="isMobile && !textRevealed" class="nav-btn secondary" @click="revealTextNow">
              {{ t('showText') }}
            </button>
            <button v-if="activeStep > 0" class="nav-btn secondary" @click="prevStep">{{ t('prev') }}</button>
            <button class="nav-btn primary" @click="nextStep">
              {{ activeStep < steps.length - 1 ? t('next') : t('finish') }}
            </button>
          </div>
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
const targetRect = ref(null);
const windowWidth = ref(window.innerWidth);

// Estado para el idioma actual sincronizado con localStorage
const currentLang = ref(localStorage.getItem('member-idioma') || 'es');

// Control de revelación de texto en móvil tras 1.5 segundos
const textRevealed = ref(false);
let revealTimer = null;

const isMobile = computed(() => windowWidth.value <= 768);

const handleResize = () => {
  windowWidth.value = window.innerWidth;
  if (activeStep.value !== null) {
    updateTargetPosition();
  }
};

// Diccionarios de textos traducidos para la interfaz del tutorial
const tutorialUiTranslations = {
  es: {
    of: 'de',
    showText: 'Mostrar texto',
    prev: 'Anterior',
    next: 'Siguiente →',
    finish: 'Finalizar'
  },
  en: {
    of: 'of',
    showText: 'Show text',
    prev: 'Previous',
    next: 'Next →',
    finish: 'Finish'
  }
};

const t = (key) => {
  const table = tutorialUiTranslations[currentLang.value] || tutorialUiTranslations.es;
  return table[key] || tutorialUiTranslations.es[key] || key;
};

// Diccionario de tutoriales bilingües
const tutoriales = {
  'Member-dashboard': {
    es: [
      { 
        title: "Identidad y Estatus", 
        description: "Visualiza el nombre de la sucursal, el estado actual del gimnasio (abierto o cerrado) y tu estatus de suscripción de pago.", 
        selector: '#turtor1' 
      },
      { 
        title: "Métricas Personales", 
        description: "Consulta de un vistazo tus días restantes de membresía, las asistencias acumuladas en el mes y tus clases reservadas.", 
        selector: '#turtor2' 
      },
      { 
        title: "Categoría de Accesos", 
        description: "Sección principal que agrupa las herramientas de acceso rápido y control personal del miembro.", 
        selector: '#turtor3' 
      },
      { 
        title: "Código QR de Acceso", 
        description: "Genera y muestra tu código QR digital personal para agilizar tu ingreso directo a las instalaciones del gimnasio.", 
        selector: '#turtor4' 
      },
      { 
        title: "Mi Rutina", 
        description: "Consulta el detalle de los ejercicios, series y repeticiones asignadas en tu plan de entrenamiento actual.", 
        selector: '#turtor5' 
      },
      { 
        title: "Categoría de Clases y Salud", 
        description: "Apartado destinado a la gestión de actividades grupales, disciplinas y bienestar nutricional.", 
        selector: '#turtor6' 
      },
      { 
        title: "Reservación de Clases", 
        description: "Aparta tu lugar de forma rápida en las diferentes clases y disciplinas disponibles en el horario del gimnasio.", 
        selector: '#turtor7' 
      },
      { 
        title: "Plan de Nutrición", 
        description: "Revisa tu guía nutricional y recomendaciones dietéticas personalizadas para complementar tus objetivos físicos.", 
        selector: '#turtor8' 
      }
    ],
    en: [
      { 
        title: "Identity and Status", 
        description: "View the branch name, current gym status (open or closed), and your payment subscription status.", 
        selector: '#turtor1' 
      },
      { 
        title: "Personal Metrics", 
        description: "Quickly check your remaining membership days, monthly accumulated attendances, and booked classes.", 
        selector: '#turtor2' 
      },
      { 
        title: "Access Category", 
        description: "Main section grouping quick access tools and personal member controls.", 
        selector: '#turtor3' 
      },
      { 
        title: "Access QR Code", 
        description: "Generate and display your personal digital QR code to streamline your direct entry into the gym facilities.", 
        selector: '#turtor4' 
      },
      { 
        title: "My Routine", 
        description: "Check the details of the exercises, sets, and repetitions assigned in your current training plan.", 
        selector: '#turtor5' 
      },
      { 
        title: "Classes & Health Category", 
        description: "Section dedicated to managing group activities, disciplines, and nutritional wellness.", 
        selector: '#turtor6' 
      },
      { 
        title: "Class Booking", 
        description: "Quickly reserve your spot in the different classes and disciplines available in the gym schedule.", 
        selector: '#turtor7' 
      },
      { 
        title: "Nutrition Plan", 
        description: "Review your personalized nutritional guide and dietary recommendations to complement your fitness goals.", 
        selector: '#turtor8' 
      }
    ]
  },
  'member-gyms-list': {
    es: [
      { 
        title: "Título de la Sección", 
        description: "Encabezado principal que introduce el listado de sedes y gimnasios disponibles para el miembro.", 
        selector: '#turtor1' 
      },
      { 
        title: "Sede Principal", 
        description: "Apartado que agrupa tu sede principal o registrada en el sistema.", 
        selector: '#turtor2' 
      },
      { 
        title: "Tarjeta de Sede Principal", 
        description: "Muestra la información en tiempo real de tu gimnasio base, incluyendo estatus de apertura, afluencia en vivo y detalles de ubicación.", 
        selector: '#turtor3' 
      },
      { 
        title: "Gimnasios Locales", 
        description: "Listado de sucursales y centros de entrenamiento disponibles dentro de tu localidad para entrenar de forma directa.", 
        selector: '#turtor4' 
      },
      { 
        title: "Gimnasios Nacionales", 
        description: "Sección de sedes ubicadas en otras ciudades del país, las cuales se encuentran protegidas y requieren una actualización de plan.", 
        selector: '#turtor5' 
      }
    ],
    en: [
      { 
        title: "Section Title", 
        description: "Main header introducing the list of branches and gyms available to the member.", 
        selector: '#turtor1' 
      },
      { 
        title: "Main Branch", 
        description: "Section grouping your main or registered branch in the system.", 
        selector: '#turtor2' 
      },
      { 
        title: "Main Branch Card", 
        description: "Displays real-time information of your base gym, including opening status, live attendance, and location details.", 
        selector: '#turtor3' 
      },
      { 
        title: "Local Gyms", 
        description: "List of branches and training centers available within your location to train directly.", 
        selector: '#turtor4' 
      },
      { 
        title: "National Gyms", 
        description: "Section of locations in other cities of the country, which are protected and require a plan upgrade.", 
        selector: '#turtor5' 
      }
    ]
  },
  'member-gym-detail': {
    es: [
      { 
        title: "Navegación", 
        description: "Utiliza este botón para regresar al listado general de sucursales y explorar otras opciones.", 
        selector: '#tutor-back-btn' 
      },
      { 
        title: "Información de la Sede", 
        description: "Aquí verás el nombre, logo, categoría y la ubicación exacta de la sucursal seleccionada.", 
        selector: '#tutor-hero-card' 
      },
      { 
        title: "Mapa Interactivo", 
        description: "Visualiza la ubicación en el mapa. Puedes solicitar la ruta GPS directa hacia el gimnasio desde tu posición actual.", 
        selector: '#tutor-map-panel' 
      },
      { 
        title: "Ruta GPS", 
        description: "Al presionar este botón, el sistema calculará la mejor ruta para llegar a la sucursal usando tu ubicación en tiempo real.", 
        selector: '#tutor-route-btn' 
      },
      { 
        title: "Acerca del Gimnasio", 
        description: "Aquí encontrarás una breve descripción del gimnasio, su enfoque y lo que ofrece a sus miembros.", 
        selector: '#tutor-about-box' 
      },
      { 
        title: "Servicios y Amenidades", 
        description: "Conoce todas las comodidades que ofrece esta sede, como estacionamiento, áreas de sauna y conexión Wi-Fi.", 
        selector: '#tutor-amenities-box' 
      },
      { 
        title: "Contacto Directo", 
        description: "Información de contacto, teléfono y el responsable a cargo de esta sucursal para cualquier duda.", 
        selector: '#tutor-contact-card' 
      },
      { 
        title: "Cambio de Sucursal", 
        description: "Selecciona entre las diferentes sedes disponibles para ver la información específica de cada una.", 
        selector: '#tutor-branches-box' 
      },
      { 
        title: "Horarios de Atención", 
        description: "Consulta los horarios de apertura y cierre vigentes para días laborales y fines de semana.", 
        selector: '#tutor-schedule-box' 
      },
      { 
        title: "Inscripción", 
        description: "Haz clic aquí para iniciar el proceso de inscripción y comenzar a entrenar en esta sede.", 
        selector: '#tutor-join-btn' 
      }
    ],
    en: [
      { 
        title: "Navigation", 
        description: "Use this button to return to the general list of branches and explore other options.", 
        selector: '#tutor-back-btn' 
      },
      { 
        title: "Branch Information", 
        description: "Here you will see the name, logo, category, and exact location of the selected branch.", 
        selector: '#tutor-hero-card' 
      },
      { 
        title: "Interactive Map", 
        description: "View the location on the map. You can request direct GPS routing to the gym from your current position.", 
        selector: '#tutor-map-panel' 
      },
      { 
        title: "GPS Route", 
        description: "By pressing this button, the system will calculate the best route to reach the branch using your real-time location.", 
        selector: '#tutor-route-btn' 
      },
      { 
        title: "About the Gym", 
        description: "Here you will find a brief description of the gym, its focus, and what it offers to its members.", 
        selector: '#tutor-about-box' 
      },
      { 
        title: "Services & Amenities", 
        description: "Discover all the comforts this location offers, such as parking, sauna areas, and Wi-Fi connection.", 
        selector: '#tutor-amenities-box' 
      },
      { 
        title: "Direct Contact", 
        description: "Contact info, phone number, and the manager in charge of this branch for any questions.", 
        selector: '#tutor-contact-card' 
      },
      { 
        title: "Branch Switch", 
        description: "Select among the different available locations to view specific details for each one.", 
        selector: '#tutor-branches-box' 
      },
      { 
        title: "Opening Hours", 
        description: "Check current opening and closing times valid for weekdays and weekends.", 
        selector: '#tutor-schedule-box' 
      },
      { 
        title: "Registration", 
        description: "Click here to start the registration process and begin training at this location.", 
        selector: '#tutor-join-btn' 
      }
    ]
  },

  'member-settings': {
    es: [
  { 
    title: "Guardar Cambios", 
    description: "Aplica y almacena de forma permanente todas las modificaciones realizadas en la configuración del sitio.", 
    selector: '#btn-guardar-cambios' 
  },
  { 
    title: "Temas y Combinaciones", 
    description: "Selecciona rápidamente entre 24 estilos y combinaciones predefinidas para cambiar la apariencia visual de todo el sistema.", 
    selector: '#panel-temas' 
  },
  { 
    title: "Notificaciones", 
    description: "Activa o desactiva la recepción y envío automático de alertas y preferencias de notificación.", 
    selector: '#row-notificaciones' 
  },
  { 
    title: "Tutorial", 
    description: "Habilita o deshabilita la guía interactiva para aprender a utilizar todas las funcionalidades de la plataforma.", 
    selector: '#row-tutorial' 
  },
  { 
    title: "Idioma de la Interfaz", 
    description: "Selecciona el idioma principal en el que se mostrarán los textos y menús del sistema.", 
    selector: '#row-idioma' 
  },
  { 
    title: "Paleta de Colores Detallada", 
    description: "Personaliza de forma independiente el color de cada componente de la interfaz, tablas, botones y encabezados.", 
    selector: '#row-paleta-colores' 
  },
  { 
    title: "Densidad de la Interfaz", 
    description: "Elige el espaciado general entre los elementos para una vista espaciosa, normal o más compacta.", 
    selector: '#row-densidad' 
  },
  { 
    title: "Estilo de Bordes", 
    description: "Define el nivel de curvatura y redondeo visual para los paneles, botones y contenedores de la aplicación.", 
    selector: '#row-border-radius' 
  }
],
  en: [
{ 
    title: "Save Changes", 
    description: "Apply and permanently store all modifications made to the site configuration.", 
    selector: '#btn-guardar-cambios' 
  },
  { 
    title: "Themes and Combinations", 
    description: "Quickly select from 24 predefined styles and combinations to change the visual appearance of the entire system.", 
    selector: '#panel-temas' 
  },
  { 
    title: "Notifications", 
    description: "Enable or disable the automatic reception and sending of alerts and notification preferences.", 
    selector: '#row-notificaciones' 
  },
  { 
    title: "Tutorial", 
    description: "Enable or disable the interactive guide to learn how to use all the platform's features.", 
    selector: '#row-tutorial' 
  },
  { 
    title: "Interface Language", 
    description: "Select the main language in which system texts and menus will be displayed.", 
    selector: '#row-idioma' 
  },
  { 
    title: "Detailed Color Palette", 
    description: "Independently customize the color of each interface component, tables, buttons, and headers.", 
    selector: '#row-paleta-colores' 
  },
  { 
    title: "Interface Density", 
    description: "Choose the general spacing between elements for a spacious, normal, or more compact view.", 
    selector: '#row-densidad' 
  },
  { 
    title: "Border Style", 
    description: "Define the level of curvature and visual rounding for application panels, buttons, and containers.", 
    selector: '#row-border-radius' 
  }
  ]
  },
};

const steps = computed(() => {
  const routeTutorials = tutoriales[route.name];
  if (!routeTutorials) return [];
  return routeTutorials[currentLang.value] || routeTutorials.es;
});

const setupStepTimer = () => {
  textRevealed.value = false;
  if (revealTimer) clearTimeout(revealTimer);

  if (isMobile.value) {
    revealTimer = setTimeout(() => {
      textRevealed.value = true;
    }, 1500);
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
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        targetRect.value = {
          top: rect.top - 8,
          left: rect.left - 8,
          width: rect.width + 16,
          height: rect.height + 16
        };
      });
    }, 350);
  } else {
    targetRect.value = null;
  }
};

const popoverStyle = computed(() => {
  if (!targetRect.value) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  
  const rect = targetRect.value;
  const popoverHeight = 220; 

  if (isMobile.value) {
    const spaceBelow = window.innerHeight - (rect.top + rect.height);
    if (spaceBelow > popoverHeight + 20) {
      return {
        top: (rect.top + rect.height + 12) + 'px',
        left: '16px',
        right: '16px',
        width: 'auto',
        transform: 'none'
      };
    } else {
      return {
        top: Math.max(16, rect.top - popoverHeight - 12) + 'px',
        left: '16px',
        right: '16px',
        width: 'auto',
        transform: 'none'
      };
    }
  }

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
    updateTargetPosition();
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

// Listener para actualizar el idioma en tiempo real si se modifica en la app
const handleLanguageUpdate = () => {
  currentLang.value = localStorage.getItem('member-idioma') || 'es';
};

onMounted(() => {
  window.addEventListener('tutorial-updated', updateTutorialStatus);
  window.addEventListener('language-updated', handleLanguageUpdate);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  if (revealTimer) clearTimeout(revealTimer);
  window.removeEventListener('tutorial-updated', updateTutorialStatus);
  window.removeEventListener('language-updated', handleLanguageUpdate);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.btn-help {
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--color-botones, #1c4fd6), #3b82f6);
  color: white;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-help:hover { transform: scale(1.12); }

.tutorial-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: transparent; 
  z-index: 9999;
  overflow: hidden;
}

.spotlight-box {
  position: absolute;
  border-radius: 14px;
  box-shadow: 0 0 0 9999px rgba(2, 6, 23, 0.85), 0 0 25px rgba(85, 88, 247, 0.9);
  border: 2px solid #6366f1;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.help-popover {
  position: absolute;
  background: linear-gradient(145deg, #161e29, #0f172a);
  color: #fff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.7), 0 0 30px rgba(85, 88, 247, 0.25);
  border: 1px solid rgba(99, 102, 241, 0.3);
  z-index: 10000;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.help-popover h3 { 
  margin: 0; 
  font-size: 1.2rem; 
  font-family: 'Oswald', sans-serif; 
  background: linear-gradient(90deg, #ffffff, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.5px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover { 
  background: rgba(239, 68, 68, 0.2);
  color: #f87171; 
}

.help-popover p { 
  font-size: 0.95rem; 
  line-height: 1.5; 
  color: #cbd5e1; 
  margin-bottom: 22px;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Oswald', sans-serif;
}

.step-badge {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.buttons-group {
  display: flex;
  gap: 8px;
}

.nav-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.2s ease;
}

.nav-btn.primary {
  background: linear-gradient(135deg, var(--color-botones, #1c4fd6), #4f46e5);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.4);
}

.nav-btn.primary:hover {
  filter: brightness(1.1);
  transform: translateY(-1px);
}

.nav-btn.secondary {
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
</style>
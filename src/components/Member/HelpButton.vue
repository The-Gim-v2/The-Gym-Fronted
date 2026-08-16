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

      <!-- Tarjeta de explicación: en escritorio flota junto al elemento, en móvil es una hoja inferior fija -->
      <div
        v-if="steps[activeStep] && (!isMobile || textRevealed)"
        class="help-popover"
        :class="{ 'mobile-sheet': isMobile }"
        :style="isMobile ? {} : popoverStyle"
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

// Seguimiento continuo (requestAnimationFrame) de la posición del elemento resaltado
let rafId = null;
let previousBodyOverflow = '';

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
      { title: "Identidad y Estatus", description: "Visualiza el nombre de la sucursal, el estado actual del gimnasio (abierto o cerrado) y tu estatus de suscripción de pago.", selector: '#turtor1' },
      { title: "Métricas Personales", description: "Consulta de un vistazo tus días restantes de membresía, las asistencias acumuladas en el mes y tus clases reservadas.", selector: '#turtor2' },
      { title: "Categoría de Accesos", description: "Sección principal que agrupa las herramientas de acceso rápido y control personal del miembro.", selector: '#turtor3' },
      { title: "Código QR de Acceso", description: "Genera y muestra tu código QR digital personal para agilizar tu ingreso directo a las instalaciones del gimnasio.", selector: '#turtor4' },
      { title: "Mi Rutina", description: "Consulta el detalle de los ejercicios, series y repeticiones asignadas en tu plan de entrenamiento actual.", selector: '#turtor5' },
      { title: "Categoría de Clases y Salud", description: "Apartado destinado a la gestión de actividades grupales, disciplinas y bienestar nutricional.", selector: '#turtor6' },
      { title: "Reservación de Clases", description: "Aparta tu lugar de forma rápida en las diferentes clases y disciplinas disponibles en el horario del gimnasio.", selector: '#turtor7' },
      { title: "Plan de Nutrición", description: "Revisa tu guía nutricional y recomendaciones dietéticas personalizadas para complementar tus objetivos físicos.", selector: '#turtor8' }
    ],
    en: [
      { title: "Identity and Status", description: "View the branch name, current gym status (open or closed), and your payment subscription status.", selector: '#turtor1' },
      { title: "Personal Metrics", description: "Quickly check your remaining membership days, monthly accumulated attendances, and booked classes.", selector: '#turtor2' },
      { title: "Access Category", description: "Main section grouping quick access tools and personal member controls.", selector: '#turtor3' },
      { title: "Access QR Code", description: "Generate and display your personal digital QR code to streamline your direct entry into the gym facilities.", selector: '#turtor4' },
      { title: "My Routine", description: "Check the details of the exercises, sets, and repetitions assigned in your current training plan.", selector: '#turtor5' },
      { title: "Classes & Health Category", description: "Section dedicated to managing group activities, disciplines, and nutritional wellness.", selector: '#turtor6' },
      { title: "Class Booking", description: "Quickly reserve your spot in the different classes and disciplines available in the gym schedule.", selector: '#turtor7' },
      { title: "Nutrition Plan", description: "Review your personalized nutritional guide and dietary recommendations to complement your fitness goals.", selector: '#turtor8' }
    ]
  },
  'member-gyms-list': {
    es: [
      { title: "Título de la Sección", description: "Encabezado principal que introduce el listado de sedes y gimnasios disponibles para el miembro.", selector: '#turtor1' },
      { title: "Sede Principal", description: "Apartado que agrupa tu sede principal o registrada en el sistema.", selector: '#turtor2' },
      { title: "Tarjeta de Sede Principal", description: "Muestra la información en tiempo real de tu gimnasio base, incluyendo estatus de apertura, afluencia en vivo y detalles de ubicación.", selector: '#turtor3' },
      { title: "Gimnasios Locales", description: "Listado de sucursales y centros de entrenamiento disponibles dentro de tu localidad para entrenar de forma directa.", selector: '#turtor4' },
      { title: "Gimnasios Nacionales", description: "Sección de sedes ubicadas en otras ciudades del país, las cuales se encuentran protegidas y requieren una actualización de plan.", selector: '#turtor5' }
    ],
    en: [
      { title: "Section Title", description: "Main header introducing the list of branches and gyms available to the member.", selector: '#turtor1' },
      { title: "Main Branch", description: "Section grouping your main or registered branch in the system.", selector: '#turtor2' },
      { title: "Main Branch Card", description: "Displays real-time information of your base gym, including opening status, live attendance, and location details.", selector: '#turtor3' },
      { title: "Local Gyms", description: "List of branches and training centers available within your location to train directly.", selector: '#turtor4' },
      { title: "National Gyms", description: "Section of locations in other cities of the country, which are protected and require a plan upgrade.", selector: '#turtor5' }
    ]
  },
  'member-gym-detail': {
    es: [
      { title: "Navegación", description: "Utiliza este botón para regresar al listado general de sucursales y explorar otras opciones.", selector: '#tutor-back-btn' },
      { title: "Información de la Sede", description: "Aquí verás el nombre, logo, categoría y la ubicación exacta de la sucursal seleccionada.", selector: '#tutor-hero-card' },
      { title: "Mapa Interactivo", description: "Visualiza la ubicación en el mapa. Puedes solicitar la ruta GPS directa hacia el gimnasio desde tu posición actual.", selector: '#tutor-map-panel' },
      { title: "Ruta GPS", description: "Al presionar este botón, el sistema calculará la mejor ruta para llegar a la sucursal usando tu ubicación en tiempo real.", selector: '#tutor-route-btn' },
      { title: "Acerca del Gimnasio", description: "Aquí encontrarás una breve descripción del gimnasio, su enfoque y lo que ofrece a sus miembros.", selector: '#tutor-about-box' },
      { title: "Servicios y Amenidades", description: "Conoce todas las comodidades que ofrece esta sede, como estacionamiento, áreas de sauna y conexión Wi-Fi.", selector: '#tutor-amenities-box' },
      { title: "Contacto Directo", description: "Información de contacto, teléfono y el responsable a cargo de esta sucursal para cualquier duda.", selector: '#tutor-contact-card' },
      { title: "Cambio de Sucursal", description: "Selecciona entre las diferentes sedes disponibles para ver la información específica de cada una.", selector: '#tutor-branches-box' },
      { title: "Horarios de Atención", description: "Consulta los horarios de apertura y cierre vigentes para días laborales y fines de semana.", selector: '#tutor-schedule-box' },
      { title: "Inscripción", description: "Haz clic aquí para iniciar el proceso de inscripción y comenzar a entrenar en esta sede.", selector: '#tutor-join-btn' }
    ],
    en: [
      { title: "Navigation", description: "Use this button to return to the general list of branches and explore other options.", selector: '#tutor-back-btn' },
      { title: "Branch Information", description: "Here you will see the name, logo, category, and exact location of the selected branch.", selector: '#tutor-hero-card' },
      { title: "Interactive Map", description: "View the location on the map. You can request direct GPS routing to the gym from your current position.", selector: '#tutor-map-panel' },
      { title: "GPS Route", description: "By pressing this button, the system will calculate the best route to reach the branch using your real-time location.", selector: '#tutor-route-btn' },
      { title: "About the Gym", description: "Here you will find a brief description of the gym, its focus, and what it offers to its members.", selector: '#tutor-about-box' },
      { title: "Services & Amenities", description: "Discover all the comforts this location offers, such as parking, sauna areas, and Wi-Fi connection.", selector: '#tutor-amenities-box' },
      { title: "Direct Contact", description: "Contact info, phone number, and the manager in charge of this branch for any questions.", selector: '#tutor-contact-card' },
      { title: "Branch Switch", description: "Select among the different available locations to view specific details for each one.", selector: '#tutor-branches-box' },
      { title: "Opening Hours", description: "Check current opening and closing times valid for weekdays and weekends.", selector: '#tutor-schedule-box' },
      { title: "Registration", description: "Click here to start the registration process and begin training at this location.", selector: '#tutor-join-btn' }
    ]
  },
  'member-settings': {
    es: [
      { title: "Guardar Cambios", description: "Aplica y almacena de forma permanente todas las modificaciones realizadas en la configuración del sitio.", selector: '#btn-guardar-cambios' },
      { title: "Temas y Combinaciones", description: "Selecciona rápidamente entre 24 estilos y combinaciones predefinidas para cambiar la apariencia visual de todo el sistema.", selector: '#panel-temas' },
      { title: "Notificaciones", description: "Activa o desactiva la recepción y envío automático de alertas y preferencias de notificación.", selector: '#row-notificaciones' },
      { title: "Tutorial", description: "Habilita o deshabilita la guía interactiva para aprender a utilizar todas las funcionalidades de la plataforma.", selector: '#row-tutorial' },
      { title: "Idioma de la Interfaz", description: "Selecciona el idioma principal en el que se mostrarán los textos y menús del sistema.", selector: '#row-idioma' },
      { title: "Paleta de Colores Detallada", description: "Personaliza de forma independiente el color de cada componente de la interfaz, tablas, botones y encabezados.", selector: '#row-paleta-colores' },
      { title: "Densidad de la Interfaz", description: "Elige el espaciado general entre los elementos para una vista espaciosa, normal o más compacta.", selector: '#row-densidad' },
      { title: "Estilo de Bordes", description: "Define el nivel de curvatura y redondeo visual para los paneles, botones y contenedores de la aplicación.", selector: '#row-border-radius' }
    ],
    en: [
      { title: "Save Changes", description: "Apply and permanently store all modifications made to the site configuration.", selector: '#btn-guardar-cambios' },
      { title: "Themes and Combinations", description: "Quickly select from 24 predefined styles and combinations to change the visual appearance of the entire system.", selector: '#panel-temas' },
      { title: "Notifications", description: "Enable or disable the automatic reception and sending of alerts and notification preferences.", selector: '#row-notificaciones' },
      { title: "Tutorial", description: "Enable or disable the interactive guide to learn how to use all the platform's features.", selector: '#row-tutorial' },
      { title: "Interface Language", description: "Select the main language in which system texts and menus will be displayed.", selector: '#row-idioma' },
      { title: "Detailed Color Palette", description: "Independently customize the color of each interface component, tables, buttons, and headers.", selector: '#row-paleta-colores' },
      { title: "Interface Density", description: "Choose the general spacing between elements for a spacious, normal, or more compact view.", selector: '#row-densidad' },
      { title: "Border Style", description: "Define the level of curvature and visual rounding for application panels, buttons, and containers.", selector: '#row-border-radius' }
    ]
  },
  'member-routines': {
    es: [
      { title: "Panel Principal y Resumen", description: "Aquí visualizas el catálogo oficial de ejercicios y el contador en tiempo real de tus rutinas guardadas.", selector: '#tutorial-1' },
      { title: "Perfil Antropométrico", description: "Ingresa tus datos físicos actuales (edad, peso, altura, género y objetivo) para calcular métricas clave como tu IMC y somatotipo.", selector: '#tutorial-2' },
      { title: "Parámetros Físicos", description: "Modifica estos valores numéricos y desplegables para adaptar las recomendaciones de entrenamiento a tu condición exacta.", selector: '#tutorial-3' },
      { title: "Calcular Rutinas", description: "Haz clic en este botón para procesar tus datos antropométricos y generar una selección de ejercicios óptima para ti.", selector: '#tutorial-4' },
      { title: "Filtros Avanzados", description: "Filtra el catálogo de manera rápida seleccionando partes específicas del cuerpo, niveles de dificultad o equipo disponible.", selector: '#tutorial-5' },
      { title: "Catálogo Segmentado", description: "Explora los bloques de ejercicios divididos por grupos musculares y recomendaciones personalizadas según tu perfil.", selector: '#tutorial-6' },
      { title: "Tarjeta de Ejercicio", description: "Cada tarjeta muestra la vista previa, series sugeridas, repeticiones adaptadas y un botón rápido para guardar la rutina.", selector: '#tutorial-7' },
      { title: "Detalles Completos", description: "Presiona este botón para abrir una vista detallada con instrucciones paso a paso, tiempos de descanso óptimos y multimedia.", selector: '#tutorial-8' },
      { title: "Contador de Guardados", description: "Lleva el control exacto de cuántas rutinas tienes almacenadas en tu lista personal de entrenamientos.", selector: '#tutorial-9' }
    ],
    en: [
      { title: "Main Panel & Summary", description: "Here you view the official exercise catalog and a real-time counter of your saved routines.", selector: '#tutorial-1' },
      { title: "Anthropometric Profile", description: "Enter your current physical data (age, weight, height, gender, and goal) to calculate key metrics like BMI and somatotype.", selector: '#tutorial-2' },
      { title: "Physical Parameters", description: "Modify these numeric values and dropdowns to tailor training recommendations to your exact condition.", selector: '#tutorial-3' },
      { title: "Calculate Routines", description: "Click this button to process your anthropometric data and generate an optimal selection of exercises for you.", selector: '#tutorial-4' },
      { title: "Advanced Filters", description: "Quickly filter the catalog by selecting specific body parts, difficulty levels, or available equipment.", selector: '#tutorial-5' },
      { title: "Segmented Catalog", description: "Explore exercise blocks divided by muscle groups along with personalized recommendations based on your profile.", selector: '#tutorial-6' },
      { title: "Exercise Card", description: "Each card displays a preview, suggested sets, adapted repetitions, and a quick button to save the routine.", selector: '#tutorial-7' },
      { title: "Full Details", description: "Press this button to open a detailed view featuring step-by-step instructions, optimal rest times, and media.", selector: '#tutorial-8' },
      { title: "Saved Counter", description: "Keep track of exactly how many routines you have stored in your personal workout list.", selector: '#tutorial-9' }
    ]
  },
  'member-my-routines': {
    es: [
      { title: "Encabezado y Panel General", description: "Visualiza el estado actual de tu planificación semanal, el título principal y las notificaciones de guardado en tiempo real.", selector: '#tutorial-1' },
      { title: "Resumen Semanal", description: "Lleva el conteo exacto de tus días de entrenamiento, días de descanso y el total de ejercicios programados para la semana.", selector: '#tutorial-2' },
      { title: "Acciones del Plan", description: "Utiliza estos botones para generar una semana de entrenamiento automáticamente o guardar todos los cambios realizados.", selector: '#tutorial-3' },
      { title: "Biblioteca de Rutinas", description: "Explora tu repertorio guardado, filtra por nombre y arrastra las rutinas directamente hacia los días de la semana.", selector: '#tutorial-4' },
      { title: "Selector de Días", description: "Alterna de manera rápida entre los diferentes días de la semana mediante la barra de navegación o fichas deslizables.", selector: '#tutorial-5' },
      { title: "Detalle del Día", description: "Panel principal donde administras los ejercicios asignados a la jornada actual o configuras el día como descanso.", selector: '#tutorial-6' },
      { title: "Cuadrícula de Rutinas", description: "Visualiza las tarjetas de ejercicio cargadas en el día activo con sus series, repeticiones, y opciones de administración.", selector: '#tutorial-7' },
      { title: "Estado Global Vacío", description: "Mensaje de aviso que aparece cuando aún no dispones de rutinas guardadas en tu cuenta para planificar la semana.", selector: '#tutorial-8' }
    ],
    en: [
      { title: "Header & General Panel", description: "View the current status of your weekly planning, main title, and real-time save notifications.", selector: '#tutorial-1' },
      { title: "Weekly Summary", description: "Keep an exact count of your training days, rest days, and total exercises scheduled for the week.", selector: '#tutorial-2' },
      { title: "Plan Actions", description: "Use these buttons to automatically generate a training week or save all changes made.", selector: '#tutorial-3' },
      { title: "Routine Library", description: "Explore your saved repertory, filter by name, and drag routines directly into the days of the week.", selector: '#tutorial-4' },
      { title: "Day Selector", description: "Quickly switch between different days of the week using the navigation bar or swipe chips.", selector: '#tutorial-5' },
      { title: "Day Detail", description: "Main panel where you manage exercises assigned to the current day or configure it as a rest day.", selector: '#tutorial-6' },
      { title: "Routine Grid", description: "View exercise cards loaded into the active day with their sets, reps, and management options.", selector: '#tutorial-7' },
      { title: "Global Empty State", description: "Warning message displayed when you don't have saved routines in your account yet to plan the week.", selector: '#tutorial-8' }
    ]
  },
  'member-trainer-routines': {
    es: [
      { title: "Encabezado de Entrenadores", description: "Visualiza la sección general de entrenadores y la descripción informativa del programa seleccionado.", selector: '#tutorial-1' },
      { title: "Tu Entrenador Asignado", description: "Consulta los datos de contacto, biografía y rutinas principales asignadas por tu profesional principal.", selector: '#tutorial-2' },
      { title: "Otros Entrenadores", description: "Explora otros profesionales del gimnasio. Requiere membresía activa para desbloquear y ver sus programas.", selector: '#tutorial-3' },
      { title: "Biblioteca de Rutinas del Entrenador", description: "Filtra y arrastra las rutinas especializadas del entrenador seleccionado hacia tus días de la semana.", selector: '#tutorial-4' },
      { title: "Selector de Días", description: "Navega rápidamente entre los días de la semana para organizar tu distribución de entrenamiento.", selector: '#tutorial-5' },
      { title: "Detalle del Día Seleccionado", description: "Administra los ejercicios del día activo o marca la jornada como día de descanso.", selector: '#tutorial-6' },
      { title: "Cuadrícula de Rutinas Asignadas", description: "Visualiza el detalle de cada rutina cargada en el día, marca tus avances y consulta los estados.", selector: '#tutorial-7' },
      { title: "Estado Vacío o Descanso", description: "Mensaje indicador cuando la jornada está configurada como descanso o no contiene rutinas agregadas.", selector: '#tutorial-8' }
    ],
    en: [
      { title: "Trainers Header", description: "View the general trainers section and the informative description of the selected program.", selector: '#tutorial-1' },
      { title: "Your Assigned Trainer", description: "Check the contact info, bio, and main routines assigned by your primary professional.", selector: '#tutorial-2' },
      { title: "Other Trainers", description: "Explore other gym professionals. Requires an active membership to unlock and view their programs.", selector: '#tutorial-3' },
      { title: "Trainer Routine Library", description: "Filter and drag specialized routines from the selected trainer directly into your days of the week.", selector: '#tutorial-4' },
      { title: "Day Selector", description: "Quickly navigate between days of the week to organize your training schedule.", selector: '#tutorial-5' },
      { title: "Selected Day Detail", description: "Manage exercises for the active day or configure the schedule as a rest day.", selector: '#tutorial-6' },
      { title: "Assigned Routines Grid", description: "View details for each routine loaded into the day, track your progress, and check statuses.", selector: '#tutorial-7' },
      { title: "Empty State or Rest", description: "Indicator message when the day is configured as rest or contains no added routines.", selector: '#tutorial-8' }
    ]
  },
  'member-profile': {
    es: [
      { title: "Resumen del Perfil", description: "Visualiza tu foto de perfil, nombre completo y el estatus actual de tu cuenta dentro de la plataforma.", selector: '#tutorial-profile-sidebar' },
      { title: "Credenciales y Sistema", description: "Consulta tu rol asignado dentro del sistema y actualiza tu dirección de correo electrónico de acceso.", selector: '#tutorial-credentials-card' },
      { title: "Datos Personales y Antropometría", description: "Edita tu número celular, datos de ubicación y mantén al día tus medidas físicas y corporales (peso, grasa, medidas).", selector: '#tutorial-personal-data-card' },
      { title: "Membresía del Gimnasio", description: "Consulta el historial de tu tipo de membresía presencial, fechas de inscripción, cortes y montos pagados.", selector: '#tutorial-gym-membership-card' },
      { title: "Suscripción Web y Sincronización", description: "Revisa tu plan web activo actual y utiliza el botón de sincronización o gestiona la cancelación de tu suscripción.", selector: '#tutorial-web-subscription-card' },
      { title: "Seguridad y Contraseña", description: "Establece una nueva contraseña de acceso segura para proteger tu cuenta de atleta.", selector: '#tutorial-security-card' },
      { title: "Guardar Cambios", description: "Presiona este botón para aplicar y guardar de forma permanente todas las modificaciones realizadas en tu perfil.", selector: '#tutorial-save-btn' }
    ],
    en: [
      { title: "Profile Summary", description: "View your profile picture, full name, and the current status of your account within the platform.", selector: '#tutorial-profile-sidebar' },
      { title: "Credentials and System", description: "Check your assigned system role and update your account login email address.", selector: '#tutorial-credentials-card' },
      { title: "Personal Data & Anthropometry", description: "Edit your mobile number, location data, and keep your body measurements up to date (weight, body fat, dimensions).", selector: '#tutorial-personal-data-card' },
      { title: "Gym Membership", description: "Review your gym membership type history, enrollment dates, cutoff dates, and paid amounts.", selector: '#tutorial-gym-membership-card' },
      { title: "Web Subscription & Sync", description: "Check your active web plan and use the sync button or manage your subscription cancellation.", selector: '#tutorial-web-subscription-card' },
      { title: "Security & Password", description: "Set a new secure access password to keep your athlete account protected.", selector: '#tutorial-security-card' },
      { title: "Save Changes", description: "Click this button to permanently apply and save all modifications made to your profile.", selector: '#tutorial-save-btn' }
    ]
  },
  'member-membership': {
    es: [
      { title: "Estado de la Membresía", description: "Visualiza de forma rápida tu progreso de días restantes, tu fecha exacta de vencimiento y el estatus actual de tu cuenta.", selector: '#tutorial-member-status-card' },
      { title: "Fechas de Corte", description: "Consulta tu fecha de corte actual y calcula automáticamente cuál será tu próxima fecha límite al realizar un nuevo pago.", selector: '#tutorial-billing-cuts' },
      { title: "Selección de Planes", description: "Elige entre los diferentes esquemas de pago disponibles (mensual, trimestral, semestral o anual) y aprovecha los descuentos por ahorro.", selector: '#tutorial-payment-plans' },
      { title: "Resumen de Cuenta", description: "Revisa el monto total a pagar, incluyendo de forma automática cualquier recargo aplicable por membresía vencida.", selector: '#tutorial-account-summary' },
      { title: "Método de Pago", description: "Selecciona tu modalidad preferida entre tarjeta de crédito/débito o transferencia bancaria para desplegar los campos correspondientes.", selector: '#tutorial-payment-method-select' },
      { title: "Confirmar Pago", description: "Completa tus datos de tarjeta o ingresa el folio de tu transferencia para procesar y registrar tu pago de forma segura.", selector: '#tutorial-pay-action-btn' }
    ],
    en: [
      { title: "Membership Status", description: "Quickly view your remaining days progress, exact expiration date, and current account status.", selector: '#tutorial-member-status-card' },
      { title: "Billing Cut Dates", description: "Check your current billing cut date and automatically calculate your next deadline when making a new payment.", selector: '#tutorial-billing-cuts' },
      { title: "Payment Plans", description: "Choose among the available payment schedules (monthly, quarterly, biannual, or annual) and take advantage of savings discounts.", selector: '#tutorial-payment-plans' },
      { title: "Account Summary", description: "Review the total amount to pay, automatically including any applicable late fees for expired memberships.", selector: '#tutorial-account-summary' },
      { title: "Payment Method", description: "Select your preferred payment method between credit/debit card or bank transfer to display the corresponding fields.", selector: '#tutorial-payment-method-select' },
      { title: "Confirm Payment", description: "Complete your card details or enter your transfer reference folio to safely process and register your payment.", selector: '#tutorial-pay-action-btn' }
    ]
  },
  'member-payments-history': {
    es: [
      { title: "Historial de Pagos", description: "Explora el registro completo de todas tus transacciones, membresías anteriores y el estado de tus cuentas.", selector: '#tutorial-history-header' },
      { title: "Monto del Periodo", description: "Visualiza de forma rápida la suma acumulada de los pagos realizados durante el periodo seleccionado.", selector: '#tutorial-total-period' },
      { title: "Filtros de Búsqueda", description: "Filtra tu historial escribiendo conceptos específicos, o bien seleccionando el método de pago y el rango de tiempo deseado.", selector: '#tutorial-history-filters' },
      { title: "Tabla de Transacciones", description: "Consulta los detalles de cada pago, incluyendo fecha, concepto, folio, estatus y la opción para descargar tus comprobantes.", selector: '#tutorial-payments-table' }
    ],
    en: [
      { title: "Payment History", description: "Explore the complete record of all your transactions, previous memberships, and your account status.", selector: '#tutorial-history-header' },
      { title: "Period Total", description: "Quickly view the accumulated sum of payments made during the selected period.", selector: '#tutorial-total-period' },
      { title: "Search Filters", description: "Filter your history by typing specific concepts, or by selecting your preferred payment method and time range.", selector: '#tutorial-history-filters' },
      { title: "Transactions Table", description: "Check the details of each payment, including date, concept, folio, status, and the option to download your receipts.", selector: '#tutorial-payments-table' }
    ]
  },
  'member-trainers-list': {
  es: [
    { title: "Directorio y Sedes", description: "Consulta el resumen general de instructores disponibles en tu ciudad y red de sucursales.", selector: '#tutorial-dashboard-header' },
    { title: "Buscador Rápido", description: "Encuentra instructores o sedes específicas escribiendo su nombre o especialidad al instante.", selector: '#tutorial-dashboard-search' },
    { title: "Tu Sede Asignada", description: "Visualiza el equipo de instructores y horarios correspondientes a tu sucursal principal.", selector: '#tutorial-my-headquarters' },
    { title: "Otras Sedes Locales", description: "Explora las alternativas y entrenadores disponibles en otras sucursales dentro de tu localidad.", selector: '#tutorial-other-headquarters' },
    { title: "Red Nacional", description: "Descubre instructores en otros estados de la república y desbloquea el acceso total al actualizar tu membresía.", selector: '#tutorial-national-network' }
  ],
  en: [
    { title: "Directory & Headquarters", description: "Check the general summary of available trainers in your city and branch network.", selector: '#tutorial-dashboard-header' },
    { title: "Quick Search", description: "Instantly find specific trainers or locations by typing their name or specialty.", selector: '#tutorial-dashboard-search' },
    { title: "Your Home Branch",description: "View the team of trainers and schedules corresponding to your main branch.", selector: '#tutorial-my-headquarters' },
    { title: "Other Local Branches", description: "Explore alternative locations and trainers available within your local area.", selector: '#tutorial-other-headquarters' },
    { title: "National Network", description: "Discover trainers in other states and unlock full access by upgrading your membership.", selector: '#tutorial-national-network' }
  ]
},
'member-trainers-chat': {
  es: [
    { 
      title: "Perfil del Entrenador", 
      description: "Conoce la información principal, especialidad y datos generales del instructor seleccionado.", 
      selector: '#tutorial-trainer-header' 
    },
    { 
      title: "Estadísticas Clave", 
      description: "Visualiza rápidamente su experiencia, cantidad de alumnos entrenados y calificación promedio.", 
      selector: '#tutorial-trainer-stats' 
    },
    { 
      title: "Biografía y Especialidades", 
      description: "Lee una breve descripción sobre su trayectoria y enfoque profesional.", 
      selector: '#tutorial-trainer-bio' 
    },
    { 
      title: "Ubicación y Rutas", 
      description: "Identifica la sucursal exacta donde labora y obtén indicaciones para llegar fácilmente.", 
      selector: '#tutorial-trainer-location' 
    },
    { 
      title: "Medios de Contacto", 
      description: "Comunícate directamente a través de su teléfono o redes sociales oficiales.", 
      selector: '#tutorial-trainer-contact' 
    },
    { 
      title: "Reseñas de Alumnos", 
      description: "Consulta las opiniones y calificaciones compartidas por otros miembros de la comunidad.", 
      selector: '#tutorial-trainer-reviews' 
    }
  ],
  en: [
    { 
      title: "Trainer Profile", 
      description: "Check the main information, specialty, and general details of the selected instructor.", 
      selector: '#tutorial-trainer-header' 
    },
    { 
      title: "Key Statistics", 
      description: "Quickly view their experience, number of trained students, and average rating.", 
      selector: '#tutorial-trainer-stats' 
    },
    { 
      title: "Biography & Specialties", 
      description: "Read a brief description of their background and professional focus.", 
      selector: '#tutorial-trainer-bio' 
    },
    { 
      title: "Location & Routes", 
      description: "Identify the exact branch where they work and get directions to get there easily.", 
      selector: '#tutorial-trainer-location' 
    },
    { 
      title: "Contact Methods", 
      description: "Reach out directly through their phone number or official social media channels.", 
      selector: '#tutorial-trainer-contact' 
    },
    { 
      title: "Student Reviews", 
      description: "Check the feedback and ratings shared by other community members.", 
      selector: '#tutorial-trainer-reviews' 
    }
  ]
}
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

const stopTracking = () => {
  if (rafId) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
};

// Recalcula la posición del elemento resaltado en cada frame para que el
// recuadro se mueva de forma fluida y siempre quede bien alineado, aun si
// hay animaciones o cambios de layout mientras el tutorial está activo.
const trackPosition = () => {
  if (activeStep.value === null || !steps.value[activeStep.value]) {
    stopTracking();
    return;
  }

  const stepConfig = steps.value[activeStep.value];
  const el = document.querySelector(stepConfig.selector);

  if (el) {
    const rect = el.getBoundingClientRect();
    targetRect.value = {
      top: rect.top - 8,
      left: rect.left - 8,
      width: rect.width + 16,
      height: rect.height + 16
    };
  } else {
    targetRect.value = null;
  }

  rafId = requestAnimationFrame(trackPosition);
};

const updateTargetPosition = () => {
  stopTracking();

  if (activeStep.value === null || !steps.value[activeStep.value]) return;

  const stepConfig = steps.value[activeStep.value];
  const el = document.querySelector(stepConfig.selector);

  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: isMobile.value ? 'start' : 'center' });

    setTimeout(() => {
      trackPosition();
    }, 350);
  } else {
    targetRect.value = null;
  }
};

// Bloquea el scroll de la página mientras el tutorial está activo, así el
// recuadro nunca se desalinea con el elemento que señala al desplazarse.
const lockScroll = () => {
  previousBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
};

const unlockScroll = () => {
  document.body.style.overflow = previousBodyOverflow;
};

const popoverStyle = computed(() => {
  if (!targetRect.value) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

  const rect = targetRect.value;
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
    lockScroll();
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
  stopTracking();
  unlockScroll();
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
  stopTracking();
  unlockScroll();
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
  transition: top 0.25s cubic-bezier(0.4, 0, 0.2, 1), left 0.25s cubic-bezier(0.4, 0, 0.2, 1),
              width 0.25s cubic-bezier(0.4, 0, 0.2, 1), height 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: top, left, width, height;
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
  transition: top 0.3s cubic-bezier(0.4, 0, 0.2, 1), left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-sizing: border-box;
}

/* En pantallas chicas la tarjeta se convierte en una hoja fija en la parte
   inferior, con altura máxima y scroll interno, en vez de intentar
   posicionarse junto al elemento (lo que en móvil se veía cortado o mal
   ubicado). */
.help-popover.mobile-sheet {
  position: fixed;
  top: auto;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 100%;
  max-height: 70vh;
  overflow-y: auto;
  border-radius: 20px 20px 0 0;
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  animation: slideUpSheet 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.help-popover.mobile-sheet::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.2);
}

.help-popover.mobile-sheet .popover-header {
  margin-top: 10px;
}

@keyframes slideUpSheet {
  from { transform: translateY(100%); opacity: 0.4; }
  to { transform: translateY(0); opacity: 1; }
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
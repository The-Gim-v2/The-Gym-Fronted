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
          <span class="step-badge">{{ activeStep + 1 }} de {{ steps.length }}</span>
          <div class="buttons-group">
            <button v-if="isMobile && !textRevealed" class="nav-btn secondary" @click="revealTextNow">
              Mostrar texto
            </button>
            <button v-if="activeStep > 0" class="nav-btn secondary" @click="prevStep">Anterior</button>
            <button class="nav-btn primary" @click="nextStep">
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

// Control de revelación de texto en móvil tras 10 segundos
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
      title: "Credenciales y Rol", 
      description: "Define el rol que desempeñará en el sistema (permisos de acceso) y asigna el correo electrónico con el que iniciará sesión.",
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Datos del Empleado", 
      description: "Captura la información oficial y de contacto del colaborador, incluyendo su CURP, nombre completo, fecha de nacimiento, teléfono y perfiles de redes sociales.",
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
  ],
  'pricing-management': [
    { 
      title: "Promociones", 
      description: "Visualiza y administra las promociones vigentes (como Promocion Amigos o Paquete entrenador), con opciones para editarlas, eliminarlas o agregar nuevas mediante el botón flotante.", 
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Cambios de Precios", 
      description: "Administra y modifica los costos de las mensualidades y tarifas del sistema (como la Mensualidad Fija o el Costo Semanal).", 
      selector: '#tutorial-step-1' 
    }
  ],
  'fees-management': [
    { 
      title: "Estatus: Pendientes", 
      description: "Activa o desactiva la aplicación automática de recargos para usuarios con pago vencido pero que aún se mantienen activos.", 
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Estatus: Inactivos", 
      description: "Define si el sistema debe cambiar automáticamente a estatus inactivo a los usuarios con cuenta suspendida por falta de pago.", 
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Bloqueo en Torniquete", 
      description: "Habilita el bloqueo automático para denegar el ingreso al gimnasio en la puerta o torniquete por motivos de morosidad.", 
      selector: '#tutorial-step-2' 
    },
    { 
      title: "Periodo de Gracia", 
      description: "Configura los días de tolerancia otorgados después de la fecha de vencimiento antes de aplicar multas o restricciones.", 
      selector: '#tutorial-step-3' 
    },
    { 
      title: "Tipo de Servicio Afectado", 
      description: "Selecciona a qué membresías, clases, casilleros o conceptos generales aplican estas reglas de morosidad.", 
      selector: '#tutorial-step-4' 
    },
    { 
      title: "Monto de la Multa", 
      description: "Establece la cantidad monetaria fija que se cobrará por concepto de retraso o penalización.", 
      selector: '#tutorial-step-5' 
    },
    { 
      title: "Frecuencia del Recargo", 
      description: "Determina si el cargo por mora se aplica una sola vez por vencimiento o si se acumula de forma diaria, semanal o mensual.", 
      selector: '#tutorial-step-6' 
    },
    { 
      title: "Límite Máximo de Multas", 
      description: "Establece el tope máximo acumulable que una multa o recargo puede alcanzar en la cuenta del usuario.", 
      selector: '#tutorial-step-7' 
    }
  ],
  'revenue-log': [
    { 
      title: "Filtros y Resumen de Ingresos", 
      description: "Filtra los pagos por tipo de membresía, consulta el total recaudado en tiempo real o busca a un usuario específico mediante la barra de búsqueda.", 
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Tabla de Ingresos", 
      description: "Visualiza el detalle completo de cada transacción: foto del usuario, nombre completo, correo electrónico, fecha de vencimiento, tipo de membresía adquirida y el monto pagado.", 
      selector: '#tutorial-step-1' 
    }
  ],
  'debtors-list': [
    { 
      title: "Filtros y Búsqueda", 
      description: "Filtra los deudores por tipo de membresía o estatus, realiza búsquedas específicas y envía correos masivos de cobranza.", 
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Listado de Deudores", 
      description: "Visualiza la información clave de cada usuario con adeudo: nombre, correo, fecha de vencimiento y el monto pendiente.", 
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Acciones Rápidas", 
      description: "Comunícate de inmediato con el deudor enviándole un correo electrónico o un mensaje directo por WhatsApp.", 
      selector: '#tutorial-step-2' 
    }
  ],
  'attendance-log': [
    { 
      title: "Filtros y Reportes de Asistencia", 
      description: "Filtra la asistencia por día de la semana, consulta la gráfica de reportes o busca a un usuario específico mediante la barra de búsqueda.", 
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Listado de Asistencia", 
      description: "Visualiza la información clave de cada usuario: foto, nombre completo, correo electrónico, tipo de membresía, fecha a vencer y su estatus actual.", 
      selector: '#tutorial-step-1' 
    }
  ],
  'renewals': [
    { 
      title: "Búsqueda de Usuarios", 
      description: "Busca de forma específica a los usuarios que necesitan renovación mediante la barra de búsqueda.", 
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Listado de Renovaciones", 
      description: "Visualiza la información clave de cada usuario con membresía vencida o próxima a vencer: foto, nombre completo, correo, fecha de vencimiento y su adeudo.", 
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Acciones Rápidas", 
      description: "Gestiona las cuentas realizando la renovación inmediata de la membresía o eliminando el registro del usuario según sea necesario.", 
      selector: '#tutorial-step-2' 
    }
  ],
  'Owner-settings': [
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
    },
    { 
      title: "Exportación de Datos", 
      description: "Descarga respaldos y bitácoras completas del sistema en formatos compatibles como Excel o YML.", 
      selector: '#panel-exportacion' 
    }
  ],
  'profile': [
    { 
      title: "Logotipo del Gimnasio", 
      description: "Sube o cambia la imagen del logotipo oficial del establecimiento que se muestra en el perfil y encabezados.", 
      selector: '#tutor-5' 
    },
    { 
      title: "Información del Establecimiento", 
      description: "Modifica el nombre oficial del gimnasio y consulta información de registro intransferible como el CURP.", 
      selector: '#tutor-13' 
    },
    { 
      title: "Membresía del Sitio", 
      description: "Consulta el plan activo actual, actualiza tu suscripción o realiza la cancelación del servicio si lo requieres.", 
      selector: '#tutor-20' 
    },
    { 
      title: "Acciones Pro", 
      description: "Agrega nuevas sedes de operación o interactúa con el asistente de inteligencia artificial exclusivo para cuentas Pro.", 
      selector: '#tutor-23' 
    },
    { 
      title: "Datos del Administrador", 
      description: "Actualiza la información personal, datos de contacto, correo electrónico y credenciales de acceso del administrador.", 
      selector: '#tutor-27' 
    },
    { 
      title: "Ubicación del Gimnasio", 
      description: "Configura la dirección física completa del establecimiento incluyendo entidad, municipio, colonia y código postal.", 
      selector: '#tutor-40' 
    },
    { 
      title: "Configuración de Operación", 
      description: "Define los días de apertura de la semana y establece las tarifas predeterminadas para mensualidades y semanas.", 
      selector: '#tutor-50' 
    },
    { 
      title: "Guardar Cambios", 
      description: "Aplica y almacena de forma definitiva todas las modificaciones realizadas en el perfil del gimnasio y del administrador.", 
      selector: '#tutor-64' 
    }
  ],
  'pay': [
    { 
      title: "Búsqueda de Cliente", 
      description: "Busca rápidamente al cliente por su nombre o ID de usuario para gestionar su estado de cuenta y pagos.", 
      selector: '#tutorial-step-0' 
    },
    { 
      title: "Detalles del Pago y Fechas", 
      description: "Consulta y modifica los cortes de fechas, revisa el estado de cuenta actual, calcula recargos e ingresa los datos del tipo de pago y folio.", 
      selector: '#tutorial-step-1' 
    },
    { 
      title: "Acciones de Confirmación", 
      description: "Confirma el registro del pago una vez completados los datos obligatorios o descarga el recibo correspondiente.", 
      selector: '#tutorial-step-2' 
    }
  ],
  'edit-user': [
    { 
      title: "Búsqueda de Cliente", 
      description: "Localiza rápidamente a cualquier cliente registrado mediante su nombre o número de identificación.", 
      selector: '#tutor-0' 
    },
    { 
      title: "Perfil del Cliente", 
      description: "Visualiza la información general, el avatar, el estado de actividad y accede a las acciones rápidas del usuario.", 
      selector: '#tutor-1' 
    },
    { 
      title: "Fotografía de Perfil", 
      description: "Muestra la imagen oficial actual del cliente en el sistema.", 
      selector: '#tutor-2' 
    },
    { 
      title: "Estadísticas del Usuario", 
      description: "Consulta el historial detallado y las métricas de rendimiento o asistencia del cliente.", 
      selector: '#tutor-3' 
    },
    { 
      title: "Cambiar Fotografía", 
      description: "Sube o actualiza la imagen de perfil del cliente desde tus archivos locales.", 
      selector: '#tutor-4' 
    },
    { 
      title: "Identificador Único", 
      description: "Muestra el código de registro intransferible asignado al cliente en el sistema.", 
      selector: '#tutor-5' 
    },
    { 
      title: "Estado de Actividad", 
      description: "Indica si la membresía o el estatus actual del cliente se encuentra activo.", 
      selector: '#tutor-6' 
    },
    { 
      title: "Datos Personales", 
      description: "Consulta y edita la información general, nombres, apellidos y datos de contacto del cliente.", 
      selector: '#tutor-7' 
    },
    { 
      title: "Seguimiento Físico", 
      description: "Registra y monitorea los cambios en el peso y la altura inicial del usuario.", 
      selector: '#tutor-14' 
    },
    { 
      title: "Membresía", 
      description: "Administra la sede asignada y el estado actual del plan contratado por el cliente.", 
      selector: '#tutor-17' 
    },
    { 
      title: "Guardar Cambios", 
      description: "Aplica y almacena de forma definitiva todas las modificaciones realizadas en el perfil y datos del cliente.", 
      selector: '#tutor-20' 
    }
  ],
  'edit-staff': [
    { 
      title: "Búsqueda de Personal", 
      description: "Localiza rápidamente a cualquier colaborador registrado mediante su nombre o número de identificación.", 
      selector: '#tutor-0' 
    },
    { 
      title: "Perfil del Personal", 
      description: "Visualiza la información general, el avatar y el estado de actividad del colaborador.", 
      selector: '#tutor-1' 
    },
    { 
      title: "Fotografía de Perfil", 
      description: "Muestra la imagen oficial actual del colaborador en el sistema.", 
      selector: '#tutor-2' 
    },
    { 
      title: "Cambiar Fotografía", 
      description: "Sube o actualiza la imagen de perfil del colaborador desde tus archivos locales.", 
      selector: '#tutor-3' 
    },
    { 
      title: "Identificador Único", 
      description: "Muestra el código de registro intransferible asignado al personal en el sistema.", 
      selector: '#tutor-4' 
    },
    { 
      title: "Estado de Actividad", 
      description: "Indica si el estatus actual del colaborador se encuentra activo.", 
      selector: '#tutor-5' 
    },
    { 
      title: "Datos Personales", 
      description: "Consulta y edita la información general, CURP, nombres, apellidos y redes sociales del colaborador.", 
      selector: '#tutor-6' 
    },
    { 
      title: "CURP", 
      description: "Ingresa o actualiza la Clave Única de Registro de Población del colaborador.", 
      selector: '#tutor-7' 
    },
    { 
      title: "Nombres", 
      description: "Establece el nombre o nombres del colaborador.", 
      selector: '#tutor-8' 
    },
    { 
      title: "Apellido Paterno", 
      description: "Registra el apellido paterno del colaborador.", 
      selector: '#tutor-9' 
    },
    { 
      title: "Apellido Materno", 
      description: "Registra el apellido materno del colaborador.", 
      selector: '#tutor-10' 
    },
    { 
      title: "Fecha de Nacimiento", 
      description: "Especifica la fecha de nacimiento del colaborador.", 
      selector: '#tutor-11' 
    },
    { 
      title: "Celular", 
      description: "Indica el número de teléfono celular de contacto.", 
      selector: '#tutor-12' 
    },
    { 
      title: "Facebook", 
      description: "Añade el enlace o usuario de Facebook del colaborador.", 
      selector: '#tutor-13' 
    },
    { 
      title: "Instagram", 
      description: "Añade el perfil o cuenta de Instagram del colaborador.", 
      selector: '#tutor-14' 
    },
    { 
      title: "Tiktok", 
      description: "Añade la cuenta de TikTok del colaborador.", 
      selector: '#tutor-15' 
    },
    { 
      title: "Otras app", 
      description: "Registra otras aplicaciones o redes sociales de contacto.", 
      selector: '#tutor-16' 
    },
    { 
      title: "Credenciales", 
      description: "Administra el correo, la sede asignada, el rol en el sistema y la especialidad.", 
      selector: '#tutor-17' 
    },
    { 
      title: "Correo electrónico", 
      description: "Establece la dirección de correo electrónico institucional o de contacto.", 
      selector: '#tutor-18' 
    },
    { 
      title: "Sede", 
      description: "Indica la sucursal o sede asignada al colaborador.", 
      selector: '#tutor-19' 
    },
    { 
      title: "Rol en el sistema", 
      description: "Define el rol o puesto que desempeña el colaborador en el sistema.", 
      selector: '#tutor-20' 
    },
    { 
      title: "Especialidad", 
      description: "Especifica el área de especialización o disciplina del colaborador.", 
      selector: '#tutor-21' 
    },
    { 
      title: "Horario de trabajo", 
      description: "Configura las horas de entrada y salida de la jornada laboral.", 
      selector: '#tutor-22' 
    },
    { 
      title: "Entrada", 
      description: "Define la hora de inicio de la jornada laboral.", 
      selector: '#tutor-23' 
    },
    { 
      title: "Salida", 
      description: "Define la hora de finalización de la jornada laboral.", 
      selector: '#tutor-24' 
    },
    { 
      title: "Guardar Cambios", 
      description: "Aplica y almacena de forma definitiva todas las modificaciones realizadas en el perfil del personal.", 
      selector: '#tutor-25' 
    }
  ],
  'statistics': [
    { 
      title: "Búsqueda de Usuario", 
      description: "Localiza rápidamente a cualquier usuario registrado mediante su nombre o número de identificación.", 
      selector: '#tutor-0' 
    },
    { 
      title: "Perfil del Usuario", 
      description: "Visualiza la tarjeta general de información, estado y métricas principales del usuario.", 
      selector: '#tutor-1' 
    },
    { 
      title: "Avatar del Usuario", 
      description: "Muestra el identificador visual o icono del usuario en el sistema.", 
      selector: '#tutor-2' 
    },
    { 
      title: "Porcentaje de Asistencia", 
      description: "Indica el nivel general de asistencia acumulada del usuario.", 
      selector: '#tutor-3' 
    },
    { 
      title: "Nombre del Usuario", 
      description: "Muestra el nombre completo registrado del usuario.", 
      selector: '#tutor-4' 
    },
    { 
      title: "Identificador Único", 
      description: "Muestra el código de registro del usuario en el sistema.", 
      selector: '#tutor-5' 
    },
    { 
      title: "Composición Corporal Principal", 
      description: "Contiene las métricas clave como peso inicial, actual, estatura, porcentaje de grasa, masa muscular y calorías.", 
      selector: '#tutor-6' 
    },
    { 
      title: "Peso Inicial", 
      description: "Muestra el peso registrado al inicio del seguimiento.", 
      selector: '#tutor-7' 
    },
    { 
      title: "Peso Actual", 
      description: "Muestra el peso más reciente del usuario.", 
      selector: '#tutor-8' 
    },
    { 
      title: "Estatura", 
      description: "Indica la altura registrada del usuario.", 
      selector: '#tutor-9' 
    },
    { 
      title: "Porcentaje de Grasa", 
      description: "Muestra el nivel de grasa corporal estimado.", 
      selector: '#tutor-10' 
    },
    { 
      title: "Masa Muscular", 
      description: "Muestra el valor de la masa muscular en kilogramos.", 
      selector: '#tutor-11' 
    },
    { 
      title: "Calorías Promedio", 
      description: "Muestra el estimado de calorías quemadas o consumidas por día.", 
      selector: '#tutor-12' 
    },
    { 
      title: "Indicadores Avanzados", 
      description: "Muestra métricas detalladas de agua corporal, índice IMC y aumento de fuerza.", 
      selector: '#tutor-13' 
    },
    { 
      title: "Agua Corporal", 
      description: "Indica el porcentaje de agua corporal del usuario.", 
      selector: '#tutor-14' 
    },
    { 
      title: "Índice IMC", 
      description: "Muestra el Índice de Masa Corporal calculado.", 
      selector: '#tutor-15' 
    },
    { 
      title: "Aumento de Fuerza", 
      description: "Muestra el progreso en la ganancia de fuerza.", 
      selector: '#tutor-16' 
    },
    { 
      title: "Eficiencia de Ganancia Muscular", 
      description: "Gráfica y barra de progreso que detalla el rendimiento mensual.", 
      selector: '#tutor-17' 
    },
    { 
      title: "Información de Contacto e Inscripción", 
      description: "Muestra los detalles de fecha de alta, celular y correo electrónico.", 
      selector: '#tutor-18' 
    },
    { 
      title: "Fecha de Inscripción", 
      description: "Indica cuándo se registró por primera vez el usuario.", 
      selector: '#tutor-19' 
    },
    { 
      title: "Celular", 
      description: "Número telefónico de contacto del usuario.", 
      selector: '#tutor-20' 
    },
    { 
      title: "Correo Electrónico", 
      description: "Dirección de email registrada del usuario.", 
      selector: '#tutor-21' 
    },
    { 
      title: "Próximo Corte", 
      description: "Muestra la fecha límite del siguiente pago o renovación.", 
      selector: '#tutor-22' 
    },
    { 
      title: "Saldo a Pagar", 
      description: "Indica la cantidad monetaria pendiente del usuario.", 
      selector: '#tutor-23' 
    },
    { 
      title: "Calendario de Asistencia", 
      description: "Vista detallada de los días del mes con los estados de asistencia (asistió, faltó, hoy).", 
      selector: '#tutor-24' 
    },
    { 
      title: "Mascota y Racha", 
      description: "Muestra la evolución de la mascota virtual y los días seguidos de racha del usuario.", 
      selector: '#tutor-25' 
    }
  ]
};

const steps = computed(() => tutoriales[route.name] || []);

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
  background: transparent; /* Fondo totalmente transparente para no afectar los componentes */
  z-index: 9999;
  overflow: hidden;
}

.spotlight-box {
  position: absolute;
  border-radius: 14px;
  /* La sombra gigante oscurece todo el exterior de la caja, dejando el centro transparente y nítido */
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
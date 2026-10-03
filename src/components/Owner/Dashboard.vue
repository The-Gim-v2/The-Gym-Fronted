<template>
  <HeadingAdmin :isGymOpen="isGymOpen" :billingStatus="billingStatus">
    <div class="dashboard">
      <main class="dashboard-container">

        <!-- 1. ENCABEZADO -->
        <section class="hero">
          <div class="hero-main">
            <span class="branch-badge">{{ t.sucursal }}</span>
            <span class="eyebrow">{{ ui.ownerPanel }}</span>
            <h1>ULTRA <span>FITNESS</span> CENTER</h1>
            <p>{{ t.panelControl }}</p>
          </div>

          <div class="hero-status">
            <button
              type="button"
              class="status-pill"
              :class="isGymOpen ? 'open' : 'closed'"
              @click="toggleGymStatus"
            >
              <span class="status-dot"></span>
              {{ isGymOpen ? t.gymAbierto : t.gymCerrado }}
            </button>

            <div class="billing-pill" :class="billingStatus">
              <span class="billing-dot"></span>
              {{ billingStatusText }}
            </div>
          </div>
        </section>

        <!-- 2. INDICADORES CLAVE -->
        <section class="kpi-grid">
          <article class="kpi-card">
            <div class="kpi-icon">
              <svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div class="kpi-body">
              <strong>142</strong>
              <span>{{ t.entradasHoy }}</span>
            </div>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon accent">
              <svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/></svg>
            </div>
            <div class="kpi-body">
              <strong class="highlight">28</strong>
              <span>{{ t.enInstalaciones }}</span>
            </div>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon success">
              <svg viewBox="0 0 24 24"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <div class="kpi-body">
              <strong>$5,708</strong>
              <span>{{ ui.incomeToday }}</span>
            </div>
          </article>

          <article class="kpi-card">
            <div class="kpi-icon warning">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
            </div>
            <div class="kpi-body">
              <strong>3</strong>
              <span>{{ t.porVencer }}</span>
            </div>
          </article>
        </section>

        <!-- 3. ALERTAS + FINANZAS -->
        <section class="two-col">
          <article class="panel alerts-panel">
            <div class="panel-header">
              <div>
                <span class="section-eyebrow">{{ ui.attention }}</span>
                <h2>{{ ui.alerts }}</h2>
              </div>
              <span class="alert-count">{{ alerts.length }}</span>
            </div>

            <div class="alert-list">
              <button
                v-for="alert in alerts"
                :key="alert.title"
                type="button"
                class="alert-row"
                @click="go(alert.route)"
              >
                <span class="alert-icon" :class="alert.level">
                  <svg viewBox="0 0 24 24"><path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                </span>
                <span class="alert-info">
                  <strong>{{ alert.title }}</strong>
                  <small>{{ alert.subtitle }}</small>
                </span>
                <svg class="chevron" viewBox="0 0 24 24"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </article>

          <article class="panel finance-panel">
            <div class="panel-header">
              <div>
                <span class="section-eyebrow">{{ ui.finance }}</span>
                <h2>{{ ui.financialSummary }}</h2>
              </div>
              <button type="button" class="link-btn" @click="go('/Owner/revenue')">{{ ui.details }} →</button>
            </div>

            <div class="finance-main">
              <span>{{ ui.monthIncome }}</span>
              <strong>$82,450</strong>
              <small>↑ 18.4% {{ ui.vsLastMonth }}</small>
            </div>

            <div class="finance-stats">
              <div><span>{{ ui.todayIncome }}</span><strong>$5,708</strong></div>
              <div><span>{{ ui.pending }}</span><strong>$3,200</strong></div>
              <div><span>{{ ui.overdue }}</span><strong>4.2%</strong></div>
            </div>
          </article>
        </section>

        <!-- 4. ACCIONES RÁPIDAS + ACTIVIDAD -->
        <section class="two-col">
          <article class="panel quick-panel">
            <div class="panel-header">
              <div>
                <span class="section-eyebrow">{{ ui.management }}</span>
                <h2>{{ ui.quickActions }}</h2>
              </div>
            </div>

            <div class="quick-grid">
              <button
                v-for="action in quickActions"
                :key="action.label"
                type="button"
                class="quick-action"
                @click="runQuickAction(action)"
              >
                <span class="quick-icon">
                  <svg viewBox="0 0 24 24"><path :d="action.icon"/></svg>
                </span>
                <span class="quick-copy">
                  <strong>{{ action.label }}</strong>
                  <small>{{ action.description }}</small>
                </span>
              </button>
            </div>
          </article>

          <article class="panel activity-panel">
            <div class="panel-header">
              <div>
                <span class="section-eyebrow">{{ ui.today }}</span>
                <h2>{{ ui.recentActivity }}</h2>
              </div>
              <button type="button" class="link-btn" @click="go('/Owner/attendance')">{{ ui.viewAll }} →</button>
            </div>

            <div class="activity-list">
              <div
                v-for="item in recentActivity"
                :key="item.name + item.time"
                class="activity-row"
              >
                <div class="avatar" :class="item.type">{{ item.initials }}</div>
                <div class="activity-info">
                  <strong>{{ item.name }}</strong>
                  <span>{{ item.text }}</span>
                </div>
                <time>{{ item.time }}</time>
              </div>
            </div>
          </article>
        </section>

        <!-- 5. RENDIMIENTO SEMANAL -->
        <section class="panel chart-panel">
          <div class="panel-header">
            <div>
              <span class="section-eyebrow">{{ ui.last7 }}</span>
              <h2>{{ ui.weeklyPerformance }}</h2>
            </div>
            <div class="chart-summary">
              <strong>742</strong>
              <span>{{ ui.weekAccess }}</span>
              <em>↑ 12.8%</em>
            </div>
          </div>

          <div class="bar-chart">
            <div
              v-for="day in weeklyData"
              :key="day.day"
              class="bar-column"
              :class="{ peak: day.peak }"
            >
              <span>{{ day.value }}</span>
              <div class="bar-track">
                <div class="bar-fill" :style="{ height: day.height + '%' }"></div>
              </div>
              <small>{{ day.day }}</small>
            </div>
          </div>
        </section>

        <!-- 6. OPERACIÓN Y CONFIGURACIÓN (menos frecuente) -->
        <section class="tools">
          <div class="tools-title">
            <span>{{ ui.moreTools }}</span>
            <i></i>
          </div>

          <div class="modules-grid">
            <div class="module-section">
              <div class="section-header">
                <span class="section-eyebrow">{{ ui.operation }}</span>
                <h2>{{ t.controlAcceso }}</h2>
              </div>

              <div class="action-list">
                <button type="button" class="action-card" @click="openCamera('facial')">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24"><circle cx="9" cy="10" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2M17 8a3 3 0 0 1 0 6M21 21v-2a5 5 0 0 0-3-4.58"/></svg>
                  </div>
                  <div class="action-info">
                    <strong>{{ t.asistenciaFacial }}</strong>
                    <span>{{ t.reconocimientoBio }}</span>
                  </div>
                  <ArrowIcon />
                </button>

                <button type="button" class="action-card" @click="openCamera('scanner')">
                  <div class="action-icon">
                    <svg viewBox="0 0 24 24"><path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h3v2h-3zM18 13h2v2h-2zM13 17h2v3h-2zM17 17h3v3h-3z"/></svg>
                  </div>
                  <div class="action-info">
                    <strong>{{ t.escanerQr }}</strong>
                    <span>{{ t.validacionPase }}</span>
                  </div>
                  <ArrowIcon />
                </button>
              </div>
            </div>

            <div class="module-section">
              <div class="section-header">
                <span class="section-eyebrow">{{ ui.schedule }}</span>
                <h2>{{ t.adminTurnos }}</h2>
              </div>

              <div class="action-list">
                <button type="button" class="action-card" @click="activeModal = 'add-schedule'">
                  <div class="action-icon accent">
                    <svg viewBox="0 0 24 24"><path d="M19 4H5a2 2 0 0 0-2 2v14h18V6a2 2 0 0 0-2-2ZM8 2v4M16 2v4M3 9h18M8 13h3v3H8z"/></svg>
                  </div>
                  <div class="action-info">
                    <strong>{{ t.anadirHorario }}</strong>
                    <span>{{ t.gestionTurnos }}</span>
                  </div>
                  <ArrowIcon />
                </button>

                <button type="button" class="action-card" @click="activeModal = 'view-schedule'">
                  <div class="action-icon accent">
                    <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
                  </div>
                  <div class="action-info">
                    <strong>{{ t.verHorario }}</strong>
                    <span>{{ t.calendarioActivo }}</span>
                  </div>
                  <ArrowIcon />
                </button>
              </div>
            </div>

            <div class="module-section">
              <div class="section-header">
                <span class="section-eyebrow">{{ ui.expansion }}</span>
                <h2>{{ ui.branches }}</h2>
              </div>

              <div class="action-list">
                <button type="button" class="action-card" @click="go('/Owner/settings')">
                  <div class="action-icon accent">
                    <svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-5h6v5"/></svg>
                  </div>
                  <div class="action-info">
                    <strong>{{ ui.mainBranch }}</strong>
                    <span><i class="online-dot"></i>28 {{ ui.peopleInside }}</span>
                  </div>
                  <ArrowIcon />
                </button>

                <button type="button" class="action-card add-branch" @click="openBranchModal">
                  <div class="action-icon accent">
                    <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>
                  </div>
                  <div class="action-info">
                    <strong>{{ ui.addBranch }}</strong>
                    <span>{{ ui.addBranchDescription }}</span>
                  </div>
                  <ArrowIcon />
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <!-- MODALES -->
      <transition name="pop">
        <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
          <AddScheduleModal v-if="activeModal === 'add-schedule'" @close="closeModal" />
          <ViewScheduleModal v-if="activeModal === 'view-schedule'" @close="closeModal" />
          <CorreoMasivo v-if="activeModal === 'enviomasivo'" @close="closeModal" />
          <AddCorteComponent v-if="activeModal === 'corte'" @close="closeModal" />

          <div v-if="activeModal === 'facial' || activeModal === 'scanner'" class="camera-panel">
            <div class="camera-header">
              <div>
                <span>{{ ui.accessControl }}</span>
                <h3>{{ activeModal === 'facial' ? t.escaneoFacialTitle : t.escaneandoQrTitle }}</h3>
              </div>
              <button type="button" @click="closeModal">&times;</button>
            </div>

            <div class="camera-container">
              <video ref="videoPlayer" autoplay playsinline></video>
              <div v-if="activeModal === 'facial'" class="face-overlay"></div>
              <div v-else class="qr-overlay"><div class="scanner-line"></div></div>
            </div>

            <div class="camera-footer">
              <p>{{ activeModal === 'facial' ? t.instruccionFacial : t.instruccionQr }}</p>
              <button type="button" @click="closeModal">{{ t.cancelar }}</button>
            </div>
          </div>
        </div>
      </transition>

      <transition name="pop">
        <div v-if="showBranchModal" class="branch-modal-overlay" @click.self="closeBranchModal">
          <div class="branch-modal">
            <header class="branch-modal-header">
              <div class="branch-modal-title">
                <div class="branch-modal-icon">+</div>
                <div>
                  <span>{{ ui.branchManagement }}</span>
                  <h2>{{ ui.registerBranch }}</h2>
                </div>
              </div>
              <button type="button" class="branch-modal-close" @click="closeBranchModal">&times;</button>
            </header>

            <div class="branch-modal-body">
              <RegisterGymModal @close="closeBranchModal" />
            </div>
          </div>
        </div>
      </transition>
    </div>
  </HeadingAdmin>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, onBeforeUnmount, h } from 'vue';
import { useRouter } from 'vue-router';
import { traducciones } from './i18n.js';
import AddScheduleModal from '../Modals/AddScheduleModal.vue';
import ViewScheduleModal from '../Modals/ViewScheduleModal.vue';
import RegisterGymModal from '../Record/Record-Gym.vue';
import CorreoMasivo from './Componets/Bulk-Email.vue';
import AddCorteComponent from './Componets/Cut.vue';
import HeadingAdmin from './HeadingOwner.vue';

const router = useRouter();

const currentLang = ref(localStorage.getItem('owner-idioma') || 'es');
const activeModal = ref(null);
const showBranchModal = ref(false);
const videoPlayer = ref(null);
const isGymOpen = ref(true);
const billingStatus = ref('active');

let stream = null;

/* =========================================================
   UTILIDADES
========================================================= */

const ArrowIcon = () =>
  h('div', { class: 'action-arrow' }, [
    h('svg', { viewBox: '0 0 24 24' }, [h('path', { d: 'm9 18 6-6-6-6' })])
  ]);

const go = (path) => router.push(path);

/* =========================================================
   TRADUCCIONES
========================================================= */

const t = computed(() => {
  const lang = traducciones[currentLang.value] || traducciones.es;
  const fallback = traducciones.es;

  return new Proxy({}, {
    get(_, key) {
      return lang[key] !== undefined ? lang[key] : fallback[key];
    }
  });
});

const dashboardTranslations = {
  es: {
    ownerPanel: 'PANEL DEL PROPIETARIO',
    operation: 'OPERACIÓN',
    schedule: 'AGENDA',
    expansion: 'EXPANSIÓN',
    moreTools: 'Operación y configuración',
    branches: 'Sucursales',
    addBranch: 'Agregar sucursal',
    addBranchDescription: 'Registra una nueva sede en tu cuenta.',
    accessControl: 'CONTROL DE ACCESO',
    branchManagement: 'GESTIÓN DE SUCURSALES',
    registerBranch: 'Registrar nueva sede',
    cameraError: 'No se pudo acceder a la cámara. Verifica los permisos.',
    incomeToday: 'INGRESOS HOY',
    today: 'ACTIVIDAD',
    recentActivity: 'Actividad reciente',
    viewAll: 'Ver todo',
    finance: 'FINANZAS',
    financialSummary: 'Resumen financiero',
    details: 'Detalles',
    monthIncome: 'Ingresos del mes',
    vsLastMonth: 'vs. mes anterior',
    todayIncome: 'Hoy',
    pending: 'Pendiente',
    overdue: 'Morosidad',
    attention: 'ATENCIÓN',
    alerts: 'Alertas importantes',
    last7: 'ÚLTIMOS 7 DÍAS',
    weeklyPerformance: 'Rendimiento semanal',
    attendance: 'Asistencias',
    weekAccess: 'accesos esta semana',
    management: 'GESTIÓN',
    quickActions: 'Acciones rápidas',
    mainBranch: 'Gimnasio Principal',
    peopleInside: 'personas dentro'
  },
  en: {
    ownerPanel: 'OWNER PANEL',
    operation: 'OPERATIONS',
    schedule: 'SCHEDULE',
    expansion: 'EXPANSION',
    moreTools: 'Operations & settings',
    branches: 'Branches',
    addBranch: 'Add branch',
    addBranchDescription: 'Register a new location in your account.',
    accessControl: 'ACCESS CONTROL',
    branchManagement: 'BRANCH MANAGEMENT',
    registerBranch: 'Register new location',
    cameraError: 'Camera access failed. Check your permissions.',
    incomeToday: 'TODAY INCOME',
    today: 'ACTIVITY',
    recentActivity: 'Recent activity',
    viewAll: 'View all',
    finance: 'FINANCE',
    financialSummary: 'Financial summary',
    details: 'Details',
    monthIncome: 'Monthly income',
    vsLastMonth: 'vs. last month',
    todayIncome: 'Today',
    pending: 'Pending',
    overdue: 'Overdue',
    attention: 'ATTENTION',
    alerts: 'Important alerts',
    last7: 'LAST 7 DAYS',
    weeklyPerformance: 'Weekly performance',
    attendance: 'Attendance',
    weekAccess: 'accesses this week',
    management: 'MANAGEMENT',
    quickActions: 'Quick actions',
    mainBranch: 'Main Gym',
    peopleInside: 'people inside'
  }
};

const ui = computed(
  () => dashboardTranslations[currentLang.value] || dashboardTranslations.es
);

/* =========================================================
   DATOS (de prueba)
========================================================= */

const recentActivity = computed(() =>
  currentLang.value === 'es'
    ? [
        { initials: 'JR', name: 'José Ramírez', text: 'Pago recibido · $500.00', time: 'Hace 5 min', type: 'payment' },
        { initials: 'AL', name: 'Andrea López', text: 'Acceso autorizado al gimnasio', time: 'Hace 12 min', type: 'access' },
        { initials: 'CH', name: 'Carlos Hernández', text: 'Membresía mensual renovada', time: 'Hace 20 min', type: 'renewal' },
        { initials: 'MG', name: 'Mariana García', text: 'Nuevo cliente registrado', time: 'Hace 35 min', type: 'client' }
      ]
    : [
        { initials: 'JR', name: 'José Ramírez', text: 'Payment received · $500.00', time: '5 min ago', type: 'payment' },
        { initials: 'AL', name: 'Andrea López', text: 'Gym access authorized', time: '12 min ago', type: 'access' },
        { initials: 'CH', name: 'Carlos Hernández', text: 'Monthly membership renewed', time: '20 min ago', type: 'renewal' },
        { initials: 'MG', name: 'Mariana García', text: 'New client registered', time: '35 min ago', type: 'client' }
      ]
);

/* Las alertas se ordenan por urgencia: danger → warning → info */
const alertOrder = { danger: 0, warning: 1, info: 2 };

const alerts = computed(() => {
  const list =
    currentLang.value === 'es'
      ? [
          { title: '3 membresías por vencer', subtitle: 'Próximas 48 horas', level: 'warning', route: '/Owner/renewals' },
          { title: '5 clientes con adeudo', subtitle: 'Requieren seguimiento', level: 'danger', route: '/Owner/debtors' },
          { title: '2 pagos pendientes', subtitle: 'Pendientes de conciliación', level: 'warning', route: '/Owner/payments' },
          { title: '1 incidencia de acceso', subtitle: 'Revisar bitácora', level: 'info', route: '/Owner/attendance' }
        ]
      : [
          { title: '3 memberships expiring', subtitle: 'Next 48 hours', level: 'warning', route: '/Owner/renewals' },
          { title: '5 clients with debt', subtitle: 'Follow-up required', level: 'danger', route: '/Owner/debtors' },
          { title: '2 pending payments', subtitle: 'Awaiting reconciliation', level: 'warning', route: '/Owner/payments' },
          { title: '1 access incident', subtitle: 'Review attendance log', level: 'info', route: '/Owner/attendance' }
        ];

  return [...list].sort((a, b) => alertOrder[a.level] - alertOrder[b.level]);
});

const weeklyData = computed(() => {
  const days =
    currentLang.value === 'es'
      ? [
          { day: 'Lun', value: 94, height: 63 },
          { day: 'Mar', value: 118, height: 79 },
          { day: 'Mié', value: 103, height: 69 },
          { day: 'Jue', value: 126, height: 84 },
          { day: 'Vie', value: 142, height: 95 },
          { day: 'Sáb', value: 101, height: 68 },
          { day: 'Dom', value: 58, height: 39 }
        ]
      : [
          { day: 'Mon', value: 94, height: 63 },
          { day: 'Tue', value: 118, height: 79 },
          { day: 'Wed', value: 103, height: 69 },
          { day: 'Thu', value: 126, height: 84 },
          { day: 'Fri', value: 142, height: 95 },
          { day: 'Sat', value: 101, height: 68 },
          { day: 'Sun', value: 58, height: 39 }
        ];

  const max = Math.max(...days.map((d) => d.value));

  return days.map((d) => ({ ...d, peak: d.value === max }));
});

/*
  icon  = path de un SVG de 24x24
  modal = si existe, la acción abre un modal en vez de navegar
*/
const quickActions = computed(() => {
  const icons = {
    client: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M19 8v6M22 11h-6',
    payment: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
    staff: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8',
    mail: 'M4 4h16v16H4zM4 7l8 6 8-6',
    promo: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',
    cash: 'M4 4h16v16H4zM8 8h8M8 12h3M8 16h3M14 12h2M14 16h2'
  };

  return currentLang.value === 'es'
    ? [
        { label: 'Registrar cliente', description: 'Nueva membresía', route: '/Owner/register-clients', icon: icons.client },
        { label: 'Registrar pago', description: 'Cobrar membresía', route: '/Owner/payments', icon: icons.payment },
        { label: 'Registrar personal', description: 'Nuevo colaborador', route: '/Owner/register-staff', icon: icons.staff },
        { label: 'Correo masivo', description: 'Comunicar a clientes', modal: 'enviomasivo', icon: icons.mail },
        { label: 'Crear promoción', description: 'Campañas y descuentos', route: '/Owner/pricing', icon: icons.promo },
        { label: 'Corte de caja', description: 'Resumen de operación', modal: 'corte', icon: icons.cash }
      ]
    : [
        { label: 'Register client', description: 'New membership', route: '/Owner/register-clients', icon: icons.client },
        { label: 'Register payment', description: 'Charge membership', route: '/Owner/payments', icon: icons.payment },
        { label: 'Register staff', description: 'New collaborator', route: '/Owner/register-staff', icon: icons.staff },
        { label: 'Bulk email', description: 'Message clients', modal: 'enviomasivo', icon: icons.mail },
        { label: 'Create promotion', description: 'Campaigns and discounts', route: '/Owner/pricing', icon: icons.promo },
        { label: 'Cash close', description: 'Operation summary', modal: 'corte', icon: icons.cash }
      ];
});

const runQuickAction = (action) => {
  if (action.modal) {
    activeModal.value = action.modal;
    return;
  }

  go(action.route);
};

/* =========================================================
   ESTADO DEL GIMNASIO
========================================================= */

const billingStatusText = computed(() => {
  if (billingStatus.value === 'active') return t.value.cuentaCorriente;
  if (billingStatus.value === 'pending') return t.value.pendientePago;
  return t.value.bloqueadoPago;
});

const toggleGymStatus = () => {
  isGymOpen.value = !isGymOpen.value;
  localStorage.setItem('isGymOpen', JSON.stringify(isGymOpen.value));
};

/* =========================================================
   IDIOMA
========================================================= */

const handleLangChange = (event) => {
  if (!event.detail?.idioma) return;

  currentLang.value = event.detail.idioma;
  localStorage.setItem('owner-idioma', event.detail.idioma);
};

/* =========================================================
   MODALES
========================================================= */

const openBranchModal = () => {
  showBranchModal.value = true;
  document.body.style.overflow = 'hidden';
};

const closeBranchModal = () => {
  showBranchModal.value = false;
  document.body.style.overflow = '';
};

const openCamera = async (type) => {
  activeModal.value = type;

  setTimeout(async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('getUserMedia no disponible');
      }

      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: type === 'scanner' ? 'environment' : 'user' }
      });

      if (videoPlayer.value) {
        videoPlayer.value.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      alert(ui.value.cameraError);
      activeModal.value = null;
    }
  }, 100);
};

const closeModal = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  activeModal.value = null;
};

/* Cerrar modales con Escape */
const handleKeydown = (event) => {
  if (event.key !== 'Escape') return;

  if (showBranchModal.value) {
    closeBranchModal();
    return;
  }

  if (activeModal.value) {
    closeModal();
  }
};

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(() => {
  const saved = localStorage.getItem('isGymOpen');

  if (saved !== null) {
    try {
      isGymOpen.value = JSON.parse(saved);
    } catch {
      /* valor inválido: se queda el predeterminado */
    }
  }

  window.addEventListener('idioma-changed', handleLangChange);
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('idioma-changed', handleLangChange);
  window.removeEventListener('keydown', handleKeydown);
  document.body.style.overflow = '';
});

onBeforeUnmount(closeModal);
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap');

* {
  box-sizing: border-box;
}

button {
  font: inherit;
}

/* =========================================================
   BASE
========================================================= */

.dashboard {
  --hl: var(--color-highlight, #3b82f6);
  --hl-soft: color-mix(in srgb, var(--hl) 11%, transparent);
  --hl-line: color-mix(in srgb, var(--hl) 45%, transparent);
  --card: var(--bg-cards, #121212);
  --line: rgba(255, 255, 255, 0.08);
  --line2: rgba(255, 255, 255, 0.14);
  --title: var(--color-titulos, #fff);
  --text2: rgba(245, 245, 244, 0.63);
  --text3: rgba(245, 245, 244, 0.43);

  min-height: calc(100vh - 65px);
  background: var(--bg-custom, var(--color-interfaz, #090909));
  color: var(--color-texto-general, #f5f5f4);
  font-family: 'Inter', sans-serif;
  -webkit-font-smoothing: antialiased;
}

.dashboard-container {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 32px 56px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.eyebrow,
.section-eyebrow {
  display: block;
  margin-bottom: 6px;
  color: var(--hl);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.3px;
}

.highlight {
  color: var(--hl) !important;
}

/* =========================================================
   1. ENCABEZADO
========================================================= */

.hero {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 24px;
  padding: 26px 30px;
  background:
    radial-gradient(circle at 100% 0%, var(--hl-soft), transparent 55%),
    linear-gradient(140deg, var(--card), rgba(14, 14, 14, 0.92));
  border: 1px solid var(--line);
  border-radius: 22px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.3);
}

.hero::after {
  content: '';
  position: absolute;
  right: -90px;
  bottom: -170px;
  width: 280px;
  height: 280px;
  border: 1px solid var(--hl-soft);
  border-radius: 50%;
  pointer-events: none;
}

.hero-main,
.hero-status {
  position: relative;
  z-index: 1;
}

.branch-badge {
  display: inline-block;
  margin-bottom: 16px;
  padding: 5px 11px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--text2);
  font-size: 10.5px;
  font-weight: 800;
  letter-spacing: 0.5px;
}

.hero-main h1 {
  margin: 0;
  color: var(--title);
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(26px, 3.2vw, 38px);
  line-height: 1.1;
}

.hero-main h1 span {
  color: var(--hl);
}

.hero-main p {
  margin: 8px 0 0;
  color: var(--text2);
  font-size: 13.5px;
}

.hero-status {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 210px;
}

.status-pill,
.billing-pill {
  height: 38px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-pill {
  cursor: pointer;
  transition: filter 0.15s ease;
}

.status-pill:hover {
  filter: brightness(1.15);
}

.status-pill.open,
.billing-pill.active {
  color: #34d399;
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.status-pill.closed,
.billing-pill.blocked {
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.3);
}

.billing-pill.pending {
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.1);
  border-color: rgba(245, 158, 11, 0.3);
}

.status-dot,
.billing-dot {
  width: 7px;
  height: 7px;
  flex: none;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 9px currentColor;
}

/* =========================================================
   2. INDICADORES CLAVE
========================================================= */

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.kpi-card {
  min-width: 0;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.kpi-card:hover {
  transform: translateY(-2px);
  border-color: var(--line2);
}

.kpi-icon {
  width: 46px;
  height: 46px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.05);
  border-radius: 13px;
}

.kpi-icon.accent { color: var(--hl); background: var(--hl-soft); }
.kpi-icon.success { color: #34d399; background: rgba(16, 185, 129, 0.1); }
.kpi-icon.warning { color: #f59e0b; background: rgba(245, 158, 11, 0.1); }

.kpi-icon svg {
  width: 22px;
  height: 22px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.kpi-body {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.kpi-body strong {
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 30px;
  line-height: 1;
}

.kpi-body span {
  overflow: hidden;
  color: var(--text3);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.4px;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

/* =========================================================
   PANELES
========================================================= */

.two-col {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.panel {
  min-width: 0;
  padding: 22px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 20px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
}

.panel-header {
  min-height: 42px;
  margin-bottom: 14px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.panel-header .section-eyebrow {
  margin-bottom: 3px;
  font-size: 9px;
}

.panel-header h2,
.section-header h2 {
  margin: 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 19px;
  font-weight: 600;
}

.link-btn {
  padding: 3px 0;
  color: var(--hl);
  font-size: 11.5px;
  font-weight: 700;
  cursor: pointer;
  background: none;
  border: 0;
  white-space: nowrap;
}

.link-btn:hover {
  text-decoration: underline;
}

/* =========================================================
   3. ALERTAS
========================================================= */

.alert-count {
  min-width: 28px;
  height: 28px;
  padding: 0 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fbbf24;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.alert-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.alert-row {
  width: 100%;
  min-height: 56px;
  padding: 9px 12px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 16px;
  align-items: center;
  gap: 12px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--line);
  border-radius: 13px;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
}

.alert-row:hover {
  transform: translateX(2px);
  background: rgba(255, 255, 255, 0.045);
  border-color: var(--line2);
}

.alert-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
}

.alert-icon svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.alert-icon.danger { color: #f87171; background: rgba(239, 68, 68, 0.12); }
.alert-icon.warning { color: #fbbf24; background: rgba(245, 158, 11, 0.12); }
.alert-icon.info { color: #60a5fa; background: rgba(59, 130, 246, 0.12); }

.alert-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.alert-info strong {
  overflow: hidden;
  color: var(--title);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-info small {
  color: var(--text3);
  font-size: 10.5px;
}

.chevron {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: var(--text3);
  stroke-width: 2;
}

/* =========================================================
   3. FINANZAS
========================================================= */

.finance-main {
  padding: 18px;
  background: var(--hl-soft);
  border: 1px solid var(--hl-line);
  border-radius: 15px;
}

.finance-main > span {
  display: block;
  color: var(--text2);
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.finance-main strong {
  display: block;
  margin: 5px 0 3px;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 36px;
  line-height: 1.1;
}

.finance-main small {
  color: #34d399;
  font-size: 11px;
  font-weight: 700;
}

.finance-stats {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.finance-stats div {
  padding: 13px 6px;
  text-align: center;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--line);
  border-radius: 12px;
}

.finance-stats span {
  display: block;
  color: var(--text3);
  font-size: 9px;
  text-transform: uppercase;
}

.finance-stats strong {
  display: block;
  margin-top: 5px;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 18px;
}

/* =========================================================
   4. ACCIONES RÁPIDAS
========================================================= */

.quick-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px;
}

.quick-action {
  min-height: 66px;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 11px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--line);
  border-radius: 13px;
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.quick-action:hover {
  transform: translateY(-2px);
  border-color: var(--hl-line);
  background: var(--hl-soft);
}

.quick-icon {
  width: 36px;
  height: 36px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hl);
  background: var(--hl-soft);
  border: 1px solid var(--hl-line);
  border-radius: 10px;
}

.quick-icon svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.9;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.quick-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.quick-copy strong {
  overflow: hidden;
  color: var(--title);
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.quick-copy small {
  overflow: hidden;
  color: var(--text3);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================================================
   4. ACTIVIDAD
========================================================= */

.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-row {
  min-height: 58px;
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--line);
}

.activity-row:first-child {
  border-top: 0;
}

.avatar {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: var(--hl);
  border-radius: 10px;
  font-size: 10.5px;
  font-weight: 800;
}

.avatar.payment { background: #059669; }
.avatar.renewal { background: #7c3aed; }
.avatar.client { background: #d97706; }

.activity-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-info strong {
  overflow: hidden;
  color: var(--title);
  font-size: 12.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-info span,
.activity-row time {
  color: var(--text3);
  font-size: 10.5px;
}

.activity-info span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-row time {
  white-space: nowrap;
}

/* =========================================================
   5. GRÁFICA
========================================================= */

.chart-summary {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.chart-summary strong {
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 28px;
  line-height: 1;
}

.chart-summary span {
  color: var(--text3);
  font-size: 11px;
}

.chart-summary em {
  color: #34d399;
  font-size: 11px;
  font-style: normal;
  font-weight: 700;
}

.bar-chart {
  height: 170px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  align-items: end;
  gap: 14px;
}

.bar-column {
  height: 100%;
  display: grid;
  grid-template-rows: 18px 1fr 22px;
  align-items: end;
  text-align: center;
}

.bar-column > span {
  color: var(--text3);
  font-size: 10px;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.bar-column:hover > span,
.bar-column.peak > span {
  opacity: 1;
}

.bar-track {
  width: 100%;
  max-width: 54px;
  height: 100%;
  margin: auto;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.035);
  border-radius: 8px 8px 4px 4px;
}

.bar-fill {
  width: 100%;
  position: absolute;
  bottom: 0;
  background: linear-gradient(180deg, color-mix(in srgb, var(--hl) 55%, transparent), color-mix(in srgb, var(--hl) 15%, transparent));
  border-radius: 8px 8px 4px 4px;
  transition: height 0.4s ease;
}

.bar-column.peak .bar-fill {
  background: linear-gradient(180deg, var(--hl), color-mix(in srgb, var(--hl) 35%, transparent));
}

.bar-column small {
  padding-top: 6px;
  color: var(--text3);
  font-size: 10px;
}

.bar-column.peak small {
  color: var(--title);
  font-weight: 700;
}

/* =========================================================
   6. OPERACIÓN Y CONFIGURACIÓN
========================================================= */

.tools {
  margin-top: 6px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tools-title {
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--text3);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.tools-title i {
  height: 1px;
  flex: 1;
  background: var(--line);
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
  align-items: start;
}

.module-section {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  flex-direction: column;
}

.section-header .section-eyebrow {
  margin-bottom: 3px;
  font-size: 9px;
}

.section-header h2 {
  font-size: 17px;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.action-card {
  width: 100%;
  min-height: 78px;
  padding: 13px 15px;
  display: flex;
  align-items: center;
  gap: 13px;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.18);
  transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
}

.action-card:hover {
  transform: translateY(-2px);
  border-color: var(--hl-line);
  background: rgba(255, 255, 255, 0.025);
}

.action-card.add-branch {
  border-style: dashed;
  border-color: var(--hl-line);
  background: var(--hl-soft);
}

.action-icon {
  width: 44px;
  height: 44px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.85);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line2);
  border-radius: 13px;
}

.action-icon.accent {
  color: var(--hl);
  background: var(--hl-soft);
  border-color: var(--hl-line);
}

.action-icon svg {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.action-info {
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.action-info strong {
  overflow: hidden;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 15.5px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.action-info span {
  overflow: hidden;
  color: var(--text2);
  font-size: 11.5px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.online-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-right: 5px;
  background: #34d399;
  border-radius: 50%;
  box-shadow: 0 0 7px #34d399;
}

.action-arrow {
  width: 28px;
  height: 28px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.3);
  border-radius: 9px;
  transition: color 0.2s ease, background 0.2s ease;
}

.action-arrow svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.action-card:hover .action-arrow {
  color: var(--hl);
  background: var(--hl-soft);
}

/* =========================================================
   MODALES
========================================================= */

.modal-overlay,
.branch-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 5000;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  background: rgba(0, 0, 0, 0.84);
}

.camera-panel {
  width: min(460px, 94vw);
  padding: 25px;
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 21px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.55);
}

.camera-header {
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.camera-header span,
.branch-modal-title span {
  color: var(--hl);
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 1px;
}

.camera-header h3,
.branch-modal-title h2 {
  margin: 4px 0 0;
  color: var(--title);
  font-family: 'Oswald', sans-serif;
  font-size: 20px;
}

.camera-header button,
.branch-modal-close {
  width: 37px;
  height: 37px;
  color: rgba(255, 255, 255, 0.65);
  font-size: 21px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--line);
  border-radius: 10px;
}

.camera-container {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: #000;
  border: 1px solid var(--line2);
  border-radius: 15px;
}

.camera-container video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.face-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  mask: radial-gradient(circle, transparent 49%, #000 50%);
}

.qr-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 210px;
  height: 210px;
  transform: translate(-50%, -50%);
  border: 2px solid var(--hl);
  border-radius: 15px;
  box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.5);
}

.scanner-line {
  position: absolute;
  width: 100%;
  height: 2px;
  background: var(--hl);
  box-shadow: 0 0 10px var(--hl);
  animation: scan 2s infinite ease-in-out;
}

.camera-footer {
  text-align: center;
}

.camera-footer p {
  margin: 17px 0;
  color: var(--text2);
  font-size: 13px;
}

.camera-footer button {
  width: 100%;
  padding: 12px;
  color: #fff;
  cursor: pointer;
  background: transparent;
  border: 1px solid var(--line2);
  border-radius: 10px;
}

.branch-modal {
  width: min(1280px, 96vw);
  max-height: 92vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--card);
  border: 1px solid var(--line2);
  border-radius: 21px;
}

.branch-modal-header {
  min-height: 72px;
  padding: 13px 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--line);
}

.branch-modal-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.branch-modal-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--hl);
  background: var(--hl-soft);
  border: 1px solid var(--hl-line);
  border-radius: 11px;
  font-size: 22px;
}

.branch-modal-body {
  padding: 19px;
  overflow-y: auto;
}

.pop-enter-active,
.pop-leave-active {
  transition: opacity 0.2s;
}

.pop-enter-from,
.pop-leave-to {
  opacity: 0;
}

@keyframes scan {
  0%, 100% { top: 0; }
  50% { top: 100%; }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .modules-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .two-col {
    grid-template-columns: 1fr;
  }

  .kpi-card {
    padding: 16px;
    gap: 12px;
  }
}

@media (max-width: 760px) {
  .kpi-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   MÓVIL (≤ 680px)
========================================================= */

@media (max-width: 680px) {
  .dashboard-container {
    padding: 14px 12px 40px;
    gap: 14px;
  }

  /* ---- Encabezado compacto ---- */
  .hero {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 18px 16px;
    border-radius: 18px;
  }

  .branch-badge {
    margin-bottom: 12px;
    padding: 4px 9px;
    font-size: 9.5px;
  }

  .hero-main h1 {
    font-size: 24px;
  }

  .hero-main p {
    margin-top: 6px;
    font-size: 12.5px;
  }

  .hero-status {
    min-width: 0;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-pill,
  .billing-pill {
    height: 32px;
    padding: 0 12px;
    font-size: 11px;
  }

  /* ---- Indicadores 2x2, en vertical ---- */
  .kpi-grid {
    gap: 8px;
  }

  .kpi-card {
    padding: 14px 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    border-radius: 15px;
  }

  .kpi-icon {
    width: 36px;
    height: 36px;
    border-radius: 11px;
  }

  .kpi-icon svg {
    width: 18px;
    height: 18px;
  }

  .kpi-body {
    width: 100%;
    gap: 4px;
  }

  .kpi-body strong {
    font-size: 26px;
  }

  .kpi-body span {
    font-size: 9.5px;
  }

  /* ---- Paneles ---- */
  .panel {
    padding: 16px 14px;
    border-radius: 16px;
  }

  .panel-header {
    min-height: 0;
    margin-bottom: 12px;
  }

  .panel-header h2 {
    font-size: 17px;
  }

  .alert-row {
    min-height: 52px;
    padding: 8px 10px;
    gap: 10px;
  }

  .finance-main {
    padding: 15px;
  }

  .finance-main strong {
    font-size: 30px;
  }

  /* ---- Acciones rápidas: mosaicos de 3 columnas ---- */
  .quick-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .quick-action {
    min-height: 92px;
    padding: 12px 6px 10px;
    flex-direction: column;
    justify-content: center;
    gap: 8px;
    text-align: center;
  }

  .quick-icon {
    width: 38px;
    height: 38px;
    border-radius: 11px;
  }

  .quick-copy {
    width: 100%;
    align-items: center;
  }

  .quick-copy strong {
    display: -webkit-box;
    font-size: 11px;
    line-height: 1.25;
    white-space: normal;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .quick-copy small {
    display: none;
  }

  /* ---- Actividad ---- */
  .activity-row {
    grid-template-columns: 36px minmax(0, 1fr);
  }

  .activity-row time {
    display: none;
  }

  /* ---- Gráfica ---- */
  .panel-header:has(.chart-summary) {
    flex-direction: column;
    gap: 8px;
  }

  .bar-chart {
    height: 140px;
    gap: 6px;
  }

  /* ---- Herramientas ---- */
  .tools {
    gap: 12px;
  }

  .modules-grid {
    gap: 18px;
  }

  .action-card {
    min-height: 66px;
    padding: 10px 12px;
    gap: 11px;
    border-radius: 14px;
  }

  .action-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }

  .action-info strong {
    font-size: 14.5px;
  }

  .action-info span {
    font-size: 11px;
  }

  /* ---- Modales ---- */
  .modal-overlay,
  .branch-modal-overlay {
    padding: 8px;
  }

  .camera-panel {
    padding: 19px;
  }

  .branch-modal {
    width: 100%;
    max-height: 96vh;
    border-radius: 15px;
  }
}

@media (max-width: 380px) {
  .finance-stats {
    grid-template-columns: 1fr;
  }

  .kpi-body strong {
    font-size: 23px;
  }

  .quick-grid {
    gap: 6px;
  }

  .quick-action {
    padding: 10px 4px 8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    transition: none !important;
    animation-duration: 0.01ms !important;
  }
}
</style>
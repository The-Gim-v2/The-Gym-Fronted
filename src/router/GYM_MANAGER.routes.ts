export const GYM_MANAGERRoutes = [
  {
    path: '/GYM_MANAGER',
    component: () => import('@/views/GYM_MANAGER/GYM_MANAGERLayout.vue'),
    meta: { allowedRole: 'GYM_MANAGER' },
    children: [
      // --- DASHBOARD ---
      {
        path: 'dashboard',
        name: 'GYM_MANAGER-dashboard',
        component: () => import('@/components/GYM_MANAGER/Dashboard.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },

      // --- GRUPO DE REGISTRO ---
      {
        path: 'register-clients',
        name: 'GYM_MANAGER-register-clients',
        component: () => import('@/components/GYM_MANAGER/Register/RegisterClients.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'register-staff',
        name: 'GYM_MANAGER-register-staff',
        component: () => import('@/components/GYM_MANAGER/Register/RegisterStaff.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },

      // --- GRUPO DE VISTAS DE USUARIOS ---
      {
        path: 'view-clients',
        name: 'GYM_MANAGER-view-clients',
        component: () => import('@/components/GYM_MANAGER/Views/ViewClients.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'view-staff',
        name: 'GYM_MANAGER-view-staff',
        component: () => import('@/components/GYM_MANAGER/Views/ViewStaff.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },

      // --- GRUPO DE EDICIONES Y ACCIONES POR ID ---
      {
        path: 'editar-usuario/:id',
        name: 'GYM_MANAGER-edit-user',
        component: () => import('@/components/GYM_MANAGER/Edits/EditUser.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'editar-staff/:id',
        name: 'GYM_MANAGER-edit-staff',
        component: () => import('@/components/GYM_MANAGER/Edits/EditStaff.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'pay/:id',
        name: 'GYM_MANAGER-pay',
        component: () => import('@/components/GYM_MANAGER/Payments/Payments.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'recovery/:id',
        name: 'GYM_MANAGER-recovery',
        component: () => import('@/components/GYM_MANAGER/Componets/Account-Recovery.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'statistics/:id',
        name: 'GYM_MANAGER-statistics',
        component: () => import('@/components/GYM_MANAGER/Statistics/Statistics.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'mail/:id',
        name: 'GYM_MANAGER-mail',
        component: () => import('@/components/GYM_MANAGER/Componets/Mail.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },

      // --- BITÁCORAS Y REPORTES ---
      {
        path: 'attendance',
        name: 'GYM_MANAGER-attendance-log',
        component: () => import('@/components/GYM_MANAGER/Bitacora/AttendanceLog.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'debtors',
        name: 'GYM_MANAGER-debtors-list',
        component: () => import('@/components/GYM_MANAGER/Bitacora/DebtorsList.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'renewals',
        name: 'GYM_MANAGER-renewals',
        component: () => import('@/components/GYM_MANAGER/Bitacora/Renewals.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'revenue',
        name: 'GYM_MANAGER-revenue-log',
        component: () => import('@/components/GYM_MANAGER/Bitacora/RevenueLog.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },

      // --- FINANZAS, PAGOS Y CORTES ---
      {
        path: 'payments',
        name: 'GYM_MANAGER-payments',
        component: () => import('@/components/GYM_MANAGER/Payments/PaymentsList.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'earnings',
        name: 'GYM_MANAGER-earnings',
        component: () => import('@/components/GYM_MANAGER/Componets/Earnings.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'cut',
        name: 'GYM_MANAGER-cut',
        component: () => import('@/components/GYM_MANAGER/Componets/Cut.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },

      // --- CONFIGURACIÓN Y GESTIÓN ---
      {
        path: 'pricing',
        name: 'GYM_MANAGER-pricing-management',
        component: () => import('@/components/GYM_MANAGER/ConfigGYM_MANAGER/PricingManagement.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'fees',
        name: 'GYM_MANAGER-fees-management',
        component: () => import('@/components/GYM_MANAGER/ConfigGYM_MANAGER/FeesManagement.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'settings',
        name: 'GYM_MANAGER-settings',
        component: () => import('@/components/GYM_MANAGER/Settings.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },

      // --- HERRAMIENTAS ADICIONALES Y MARKETING ---
      {
        path: 'graph',
        name: 'GYM_MANAGER-graph',
        component: () => import('@/components/GYM_MANAGER/Componets/Attendance.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'bulk-email',
        name: 'GYM_MANAGER-bulk-email',
        component: () => import('@/components/GYM_MANAGER/Componets/Bulk-Email.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'promos',
        name: 'GYM_MANAGER-promos',
        component: () => import('@/components/GYM_MANAGER/Payments/Promos.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'help',
        name: 'GYM_MANAGER-help',
        component: () => import('@/components/GYM_MANAGER/Componets/Help.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      },
      {
        path: 'profile',
        name: 'GYM_MANAGER-profile',
        component: () => import('@/components/GYM_MANAGER/Componets/Profile.vue'),
        meta: { allowedRole: 'GYM_MANAGER' }
      }
    ]
  }
];
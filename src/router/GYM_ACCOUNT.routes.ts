export const GYM_ACCOUNTRoutes = [
  {
    path: '/GYM_ACCOUNT',
    component: () => import('@/views/GYM_ACCOUNT/GYM_ACCOUNTLayout.vue'),
    meta: { allowedRole: 'GYM_ACCOUNT' },
    children: [
      // --- DASHBOARD ---
      {
        path: 'dashboard',
        name: 'GYM_ACCOUNT-dashboard',
        component: () => import('@/components/GYM_ACCOUNT/Dashboard.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },

      // --- GRUPO DE REGISTRO ---
      {
        path: 'register-clients',
        name: 'register-clients',
        component: () => import('@/components/GYM_ACCOUNT/Register/RegisterClients.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'register-staff',
        name: 'register-staff',
        component: () => import('@/components/GYM_ACCOUNT/Register/RegisterStaff.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },

      // --- GRUPO DE VISTAS DE USUARIOS ---
      {
        path: 'view-clients',
        name: 'view-clients',
        component: () => import('@/components/GYM_ACCOUNT/Views/ViewClients.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'view-staff',
        name: 'view-staff',
        component: () => import('@/components/GYM_ACCOUNT/Views/ViewStaff.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },

      // --- GRUPO DE EDICIONES Y ACCIONES POR ID ---
      {
        path: 'editar-usuario/:id',
        name: 'edit-user',
        component: () => import('@/components/GYM_ACCOUNT/Edits/EditUser.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'editar-staff/:id',
        name: 'edit-staff',
        component: () => import('@/components/GYM_ACCOUNT/Edits/EditStaff.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'pay/:id',
        name: 'pay',
        component: () => import('@/components/GYM_ACCOUNT/Payments/Payments.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'recovery/:id',
        name: 'recovery',
        component: () => import('@/components/GYM_ACCOUNT/Componets/Account-Recovery.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'statistics/:id',
        name: 'statistics',
        component: () => import('@/components/GYM_ACCOUNT/Statistics/Statistics.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'mail/:id',
        name: 'mail',
        component: () => import('@/components/GYM_ACCOUNT/Componets/Mail.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },

      // --- BITÁCORAS Y REPORTES ---
      {
        path: 'attendance',
        name: 'attendance-log',
        component: () => import('@/components/GYM_ACCOUNT/Bitacora/AttendanceLog.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'debtors',
        name: 'debtors-list',
        component: () => import('@/components/GYM_ACCOUNT/Bitacora/DebtorsList.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'renewals',
        name: 'renewals',
        component: () => import('@/components/GYM_ACCOUNT/Bitacora/Renewals.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'revenue',
        name: 'revenue-log',
        component: () => import('@/components/GYM_ACCOUNT/Bitacora/RevenueLog.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },

      // --- FINANZAS, PAGOS Y CORTES ---
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@/components/GYM_ACCOUNT/Payments/PaymentsList.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'earnings',
        name: 'earnings',
        component: () => import('@/components/GYM_ACCOUNT/Componets/Earnings.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'cut',
        name: 'cut',
        component: () => import('@/components/GYM_ACCOUNT/Componets/Cut.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },

      // --- CONFIGURACIÓN Y GESTIÓN ---
      {
        path: 'pricing',
        name: 'pricing-management',
        component: () => import('@/components/GYM_ACCOUNT/ConfigGYM_ACCOUNT/PricingManagement.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'fees',
        name: 'fees-management',
        component: () => import('@/components/GYM_ACCOUNT/ConfigGYM_ACCOUNT/FeesManagement.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'settings',
        name: 'GYM_ACCOUNT-settings',
        component: () => import('@/components/GYM_ACCOUNT/Settings.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },

      // --- HERRAMIENTAS ADICIONALES Y MARKETING ---
      {
        path: 'graph',
        name: 'graph',
        component: () => import('@/components/GYM_ACCOUNT/Componets/Attendance.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'bulk-email',
        name: 'bulk-email',
        component: () => import('@/components/GYM_ACCOUNT/Componets/Bulk-Email.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'promos',
        name: 'promos',
        component: () => import('@/components/GYM_ACCOUNT/Payments/Promos.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('@/components/GYM_ACCOUNT/Componets/Help.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/components/GYM_ACCOUNT/Componets/Profile.vue'),
        meta: { allowedRole: 'GYM_ACCOUNT' }
      }
    ]
  }
];
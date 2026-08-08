export const OwnerRoutes = [
  {
    path: '/Owner',
    component: () => import('@/views/Owner/OwnerLayout.vue'),
    meta: { allowedRole: 'Owner' },
    children: [
      // --- DASHBOARD ---
      {
        path: 'dashboard',
        name: 'Owner-dashboard',
        component: () => import('@/components/Owner/Dashboard.vue'),
        meta: { allowedRole: 'Owner' }
      },

      // --- GRUPO DE REGISTRO ---
      {
        path: 'register-clients',
        name: 'register-clients',
        component: () => import('@/components/Owner/Register/RegisterClients.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'register-staff',
        name: 'register-staff',
        component: () => import('@/components/Owner/Register/RegisterStaff.vue'),
        meta: { allowedRole: 'Owner' }
      },

      // --- GRUPO DE VISTAS DE USUARIOS ---
      {
        path: 'view-clients',
        name: 'view-clients',
        component: () => import('@/components/Owner/Views/ViewClients.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'view-staff',
        name: 'view-staff',
        component: () => import('@/components/Owner/Views/ViewStaff.vue'),
        meta: { allowedRole: 'Owner' }
      },

      // --- GRUPO DE EDICIONES Y ACCIONES POR ID ---
      {
        path: 'editar-usuario/:id',
        name: 'edit-user',
        component: () => import('@/components/Owner/Edits/EditUser.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'editar-staff/:id',
        name: 'edit-staff',
        component: () => import('@/components/Owner/Edits/EditStaff.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'pay/:id',
        name: 'pay',
        component: () => import('@/components/Owner/Componets/Payments.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'recovery/:id',
        name: 'recovery',
        component: () => import('@/components/Owner/Componets/Account-Recovery.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'statistics/:id',
        name: 'statistics',
        component: () => import('@/components/Owner/Statistics/Statistics.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'mail/:id',
        name: 'mail',
        component: () => import('@/components/Owner/Componets/Mail.vue'),
        meta: { allowedRole: 'Owner' }
      },

      // --- BITÁCORAS Y REPORTES ---
      {
        path: 'attendance',
        name: 'attendance-log',
        component: () => import('@/components/Owner/Bitacora/AttendanceLog.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'debtors',
        name: 'debtors-list',
        component: () => import('@/components/Owner/Bitacora/DebtorsList.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'renewals',
        name: 'renewals',
        component: () => import('@/components/Owner/Bitacora/Renewals.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'revenue',
        name: 'revenue-log',
        component: () => import('@/components/Owner/Bitacora/RevenueLog.vue'),
        meta: { allowedRole: 'Owner' }
      },

      // --- FINANZAS, PAGOS Y CORTES ---
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@/components/Owner/Payments.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'earnings',
        name: 'earnings',
        component: () => import('@/components/Owner/Componets/Earnings.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'cut',
        name: 'cut',
        component: () => import('@/components/Owner/Componets/Cut.vue'),
        meta: { allowedRole: 'Owner' }
      },

      // --- CONFIGURACIÓN Y GESTIÓN ---
      {
        path: 'pricing',
        name: 'pricing-management',
        component: () => import('@/components/Owner/ConfigOwner/PricingManagement.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'fees',
        name: 'fees-management',
        component: () => import('@/components/Owner/ConfigOwner/FeesManagement.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'settings',
        name: 'Owner-settings',
        component: () => import('@/components/Owner/Settings.vue'),
        meta: { allowedRole: 'Owner' }
      },

      // --- HERRAMIENTAS ADICIONALES Y MARKETING ---
      {
        path: 'graph',
        name: 'graph',
        component: () => import('@/components/Owner/Componets/Attendance.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'bulk-email',
        name: 'bulk-email',
        component: () => import('@/components/Owner/Componets/Bulk-Email.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'promos',
        name: 'promos',
        component: () => import('@/components/Owner/Componets/Promos.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'help',
        name: 'help',
        component: () => import('@/components/Owner/Componets/Help.vue'),
        meta: { allowedRole: 'Owner' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/components/Owner/Componets/Profile.vue'),
        meta: { allowedRole: 'Owner' }
      }
    ]
  }
];
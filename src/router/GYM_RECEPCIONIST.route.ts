export const GYM_RECEPCIONISTRoutes = [
  {
    path: '/GYM_RECEPCIONIST',
    component: () => import('@/views/GYM_RECEPCIONIST/GYM_RECEPCIONISTLayout.vue'),
    meta: { allowedRole: 'GYM_RECEPCIONIST' },
    children: [
      // --- DASHBOARD ---
      {
        path: 'dashboard',
        name: 'GYM_RECEPCIONIST-dashboard',
        component: () => import('@/components/GYM_RECEPCIONIST/Dashboard.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },

      // --- REGISTRO ---
      {
        path: 'register-clients',
        name: 'GYM_RECEPCIONIST-register-clients',
        component: () => import('@/components/GYM_RECEPCIONIST/Register/RegisterClients.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },

      // --- VISTAS Y EDICIÓN DE CLIENTES ---
      {
        path: 'view-clients',
        name: 'GYM_RECEPCIONIST-view-clients',
        component: () => import('@/components/GYM_RECEPCIONIST/Views/ViewClients.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },
      {
        path: 'editar-usuario/:id',
        name: 'GYM_RECEPCIONIST-edit-user',
        component: () => import('@/components/GYM_RECEPCIONIST/Edits/EditUser.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },
      {
        path: 'statistics/:id',
        name: 'GYM_RECEPCIONIST-statistics',
        component: () => import('@/components/GYM_RECEPCIONIST/Statistics/Statistics.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },

      // --- PAGOS Y FINANZAS ---
      {
        path: 'payments',
        name: 'GYM_RECEPCIONIST-payments',
        component: () => import('@/components/GYM_RECEPCIONIST/Payments/PaymentsList.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },
      {
        path: 'pay/:id',
        name: 'GYM_RECEPCIONIST-pay',
        component: () => import('@/components/GYM_RECEPCIONIST/Payments/Payments.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },

      // --- CONFIGURACIÓN Y PERFIL ---
      {
        path: 'settings',
        name: 'GYM_RECEPCIONIST-settings',
        component: () => import('@/components/GYM_RECEPCIONIST/Settings.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },
      {
        path: 'profile',
        name: 'GYM_RECEPCIONIST-profile',
        component: () => import('@/components/GYM_RECEPCIONIST/Componets/Profile.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },{
        path: 'promos',
        name: 'promos',
        component: () => import('@/components/GYM_RECEPCIONIST/Payments/Promos.vue'),
        meta: { allowedRole: 'GYM_RECEPCIONIST' }
      },
    ]
  }
];
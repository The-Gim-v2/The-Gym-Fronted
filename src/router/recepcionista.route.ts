export const recepcionRoutes = [
  {
    path: '/recepcion',
    component: () => import('@/views/recepcion/RecepcionLayout.vue'),
    meta: { allowedRole: 'recepcion' },
    children: [
      // --- DASHBOARD ---
      {
        path: 'dashboard',
        name: 'recepcion-dashboard',
        component: () => import('@/components/Recepcion/Dashboard.vue'),
        meta: { allowedRole: 'recepcion' }
      },

      // --- REGISTRO ---
      {
        path: 'register-clients',
        name: 'recepcion-register-clients',
        component: () => import('@/components/Recepcion/Register/RegisterClients.vue'),
        meta: { allowedRole: 'recepcion' }
      },

      // --- VISTAS Y EDICIÓN DE CLIENTES ---
      {
        path: 'view-clients',
        name: 'recepcion-view-clients',
        component: () => import('@/components/Recepcion/Views/ViewClients.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'editar-usuario/:id',
        name: 'recepcion-edit-user',
        component: () => import('@/components/Recepcion/Edits/EditUser.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'statistics/:id',
        name: 'recepcion-statistics',
        component: () => import('@/components/Recepcion/Statistics/Statistics.vue'),
        meta: { allowedRole: 'recepcion' }
      },

      // --- PAGOS Y FINANZAS ---
      {
        path: 'payments',
        name: 'recepcion-payments',
        component: () => import('@/components/Recepcion/Payments.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'pay/:id',
        name: 'recepcion-pay',
        component: () => import('@/components/Recepcion/Componets/Payments.vue'),
        meta: { allowedRole: 'recepcion' }
      },

      // --- CONFIGURACIÓN Y PERFIL ---
      {
        path: 'settings',
        name: 'recepcion-settings',
        component: () => import('@/components/Recepcion/Settings.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'profile',
        name: 'recepcion-profile',
        component: () => import('@/components/Recepcion/Componets/Profile.vue'),
        meta: { allowedRole: 'recepcion' }
      }
    ]
  }
];
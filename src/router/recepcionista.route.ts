export const recepcionRoutes = [
  {
    path: '/recepcion',
    component: () => import('@/views/recepcion/RecepcionLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'recepcion-dashboard', // Único
        component: () => import('@/components/Recepcion/Dashboard.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'register-clients',
        name: 'recepcion-register-clients', // Único (antes repetido)
        component: () => import('@/components/Recepcion/Register/RegisterClients.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'view-clients',
        name: 'recepcion-view-clients', // Único
        component: () => import('@/components/Recepcion/Views/ViewClients.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'editar-usuario/:id',
        name: 'recepcion-edit-user', // Único
        component: () => import('@/components/Recepcion/Edits/EditUser.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'payments',
        name: 'recepcion-payments', // Único
        component: () => import('@/components/Recepcion/Payments.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'pay/:id',
        name: 'recepcion-pay', // Único
        component: () => import('@/components/Recepcion/Componets/Payments.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'statistics/:id',
        name: 'recepcion-statistics', // Único
        component: () => import('@/components/Recepcion/Statistics/Statistics.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'profile',
        name: 'recepcion-profile', // Único
        component: () => import('@/components/Recepcion/Componets/Profile.vue'),
        meta: { allowedRole: 'recepcion' }
      },
      {
        path: 'settings',
        name: 'recepcion-settings',
        component: () => import('@/components/Recepcion/Settings.vue'),
         meta: { allowedRole: 'recepcion' }
      },
    ]
  }
]
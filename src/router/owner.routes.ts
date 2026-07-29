export const OwnerRoutes = [
  {
    path: '/Owner',
    component: () => import('@/views/Owner/OwnerLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Owner-dashboard',
        component: () => import('@/components/Owner/Dashboard.vue'),
        meta: { allowedRole: 'Owner' }
      },
      // Grupo de Registro
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
      // Grupo de Vistas/Usuarios
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
      // Pagos y Configuración
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@/components/Owner/Payments.vue'),
         meta: { allowedRole: 'Owner' }
      },
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
      // Bitácora
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
      // Ajustes generales
      {
        path: 'settings',
        name: 'Owner-settings',
        component: () => import('@/components/Owner/Settings.vue'),
         meta: { allowedRole: 'Owner' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/components/Owner/Componets/Profile.vue'),
         meta: { allowedRole: 'Owner' }
      },
      {
        path: 'graph',
        name: 'graph',
        component: () => import('@/components/Owner/Componets/Attendance.vue')
      },
       {
        path: 'earnings',
        name: 'earnings',
        component: () => import('@/components/Owner/Componets/Earnings.vue')
      },
       {
        path: 'help',
        name: 'help',
        component: () => import('@/components/Owner/Componets/Help.vue')
      },
       {
        path: 'mail/:id',
        name: 'mail',
        component: () => import('@/components/Owner/Componets/Mail.vue')
      },
      
       {
        path: 'cut',
        name: 'cut',
        component: () => import('@/components/Owner/Componets/Cut.vue')
      },
      {
        path: 'bulk-email',
        name: 'bulk-email',
        component: () => import('@/components/Owner/Componets/Bulk-Email.vue')
      },
       {
        path: 'promos',
        name: 'promos',
        component: () => import('@/components/Owner/Componets/Promos.vue')
      },

    ]
  }
]
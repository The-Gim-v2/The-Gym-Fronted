export const adminRoutes = [
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'admin-dashboard',
        component: () => import('@/components/Admin/Dashboard.vue'),
        meta: { allowedRole: 'admin' }
      },
      // Grupo de Registro
      {
        path: 'register-clients',
        name: 'register-clients',
        component: () => import('@/components/Admin/Register/RegisterClients.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'register-staff',
        name: 'register-staff',
        component: () => import('@/components/Admin/Register/RegisterStaff.vue'),
         meta: { allowedRole: 'admin' }
      },
      // Grupo de Vistas/Usuarios
      {
        path: 'view-clients',
        name: 'view-clients',
        component: () => import('@/components/Admin/Views/ViewClients.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'view-staff',
        name: 'view-staff',
        component: () => import('@/components/Admin/Views/ViewStaff.vue'),
         meta: { allowedRole: 'admin' }
      },

      {
        path: 'editar-usuario/:id',
        name: 'edit-user',
        component: () => import('@/components/Admin/Edits/EditUser.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'editar-staff/:id',
        name: 'edit-staff',
        component: () => import('@/components/Admin/Edits/EditStaff.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'pay/:id',
        name: 'pay',
        component: () => import('@/components/Admin/Componets/Payments.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'recovery/:id',
        name: 'recovery',
        component: () => import('@/components/Admin/Componets/Account-Recovery.vue'),
         meta: { allowedRole: 'admin' }
      },
     {
        path: 'statistics/:id',
        name: 'statistics',
        component: () => import('@/components/Admin/Statistics/Statistics.vue'),
         meta: { allowedRole: 'admin' }
      },
      // Pagos y Configuración
      {
        path: 'payments',
        name: 'payments',
        component: () => import('@/components/Admin/Payments.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'pricing',
        name: 'pricing-management',
        component: () => import('@/components/Admin/ConfigAdmin/PricingManagement.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'fees',
        name: 'fees-management',
        component: () => import('@/components/Admin/ConfigAdmin/FeesManagement.vue'),
         meta: { allowedRole: 'admin' }
      },
      // Bitácora
      {
        path: 'attendance',
        name: 'attendance-log',
        component: () => import('@/components/Admin/Bitacora/AttendanceLog.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'debtors',
        name: 'debtors-list',
        component: () => import('@/components/Admin/Bitacora/DebtorsList.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'renewals',
        name: 'renewals',
        component: () => import('@/components/Admin/Bitacora/Renewals.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'revenue',
        name: 'revenue-log',
        component: () => import('@/components/Admin/Bitacora/RevenueLog.vue'),
         meta: { allowedRole: 'admin' }
      },
      // Ajustes generales
      {
        path: 'settings',
        name: 'admin-settings',
        component: () => import('@/components/Admin/Settings.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('@/components/Admin/Componets/Profile.vue'),
         meta: { allowedRole: 'admin' }
      },
      {
        path: 'graph',
        name: 'graph',
        component: () => import('@/components/Admin/Componets/Attendance.vue')
      },
       {
        path: 'earnings',
        name: 'earnings',
        component: () => import('@/components/Admin/Componets/Earnings.vue')
      },
       {
        path: 'help',
        name: 'help',
        component: () => import('@/components/Admin/Componets/Help.vue')
      },
       {
        path: 'mail/:id',
        name: 'mail',
        component: () => import('@/components/Admin/Componets/Mail.vue')
      },
      
       {
        path: 'cut',
        name: 'cut',
        component: () => import('@/components/Admin/Componets/Cut.vue')
      },
      {
        path: 'bulk-email',
        name: 'bulk-email',
        component: () => import('@/components/Admin/Componets/Bulk-Email.vue')
      },
       {
        path: 'promos',
        name: 'promos',
        component: () => import('@/components/Admin/Componets/Promos.vue')
      },

    ]
  }
]
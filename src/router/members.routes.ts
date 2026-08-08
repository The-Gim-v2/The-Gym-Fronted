export const MemberRoutes = [
  {
    path: '/Member',
    component: () => import('@/views/Member/MemberLayout.vue'),
    meta: { allowedRole: 'Member' },
    children: [
      // Dashboard principal del cliente
      {
        path: 'dashboard',
        name: 'Member-dashboard',
        component: () => import('@/components/Member/Dashboard.vue'),
        meta: { allowedRole: 'Member' }
      },

      // --- EXPLORACIÓN DE GIMNASIOS Y SEDES ---
      {
        path: 'gyms',
        name: 'member-gyms-list',
        component: () => import('@/components/Member/Gyms/GymsList.vue'),
        meta: { allowedRole: 'Member' }
      },
      {
        path: 'gyms/:id',
        name: 'member-gym-detail',
        component: () => import('@/components/Member/Gyms/GymDetail.vue'),
        meta: { allowedRole: 'Member' }
      },

      // --- MÓDULO DE RUTINAS Y ENTRENAMIENTO ---
      {
        path: 'routines',
        name: 'member-routines',
        component: () => import('@/components/Member/Routines/Routines.vue'),
        meta: { allowedRole: 'Member' }
      },
      {
        path: 'my-routines',
        name: 'member-my-routines',
        component: () => import('@/components/Member/Routines/MyRoutines.vue'),
        meta: { allowedRole: 'Member' }
      },
      {
        path: 'trainer-routines',
        name: 'member-trainer-routines',
        component: () => import('@/components/Member/Routines/TrainerRoutines.vue'),
        meta: { allowedRole: 'Member' }
      },

      // --- HERRAMIENTAS CORPORALES Y SALUD (Calculadoras) ---
      {
        path: 'body-calculator',
        name: 'member-body-calculator',
        component: () => import('@/components/Member/Tools/BodyCalculator.vue'),
        meta: { allowedRole: 'Member' }
      },
      {
        path: 'nutrition-plan',
        name: 'member-nutrition-plan',
        component: () => import('@/components/Member/Tools/NutritionPlan.vue'),
        meta: { allowedRole: 'Member' }
      },

      // --- CLASES GRUPALES Y RESERVAS ---
      {
        path: 'classes',
        name: 'member-classes-booking',
        component: () => import('@/components/Member/Classes/ClassesBooking.vue'),
        meta: { allowedRole: 'Member' }
      },

      // --- MÓDULO DE ENTRENADORES Y COMUNICACIÓN ---
      {
        path: 'trainers',
        name: 'member-trainers-list',
        component: () => import('@/components/Member/Trainers/TrainersList.vue'),
        meta: { allowedRole: 'Member' }
      },
      {
        path: 'trainers-chat/:id',
        name: 'member-trainers-chat',
        component: () => import('@/components/Member/Trainers/TrainersChat.vue'),
        meta: { allowedRole: 'Member' }
      },

      // --- PROGRESO Y ESTADÍSTICAS ---
      {
        path: 'statistics',
        name: 'member-statistics',
        component: () => import('@/components/Member/Statistics/Statistics.vue'),
        meta: { allowedRole: 'Member' }
      },

      // --- PAGOS Y MEMBRESÍA DEL CLIENTE ---
      {
        path: 'membership',
        name: 'member-membership',
        component: () => import('@/components/Member/Payments/MembershipStatus.vue'),
        meta: { allowedRole: 'Member' }
      },
      {
        path: 'payments-history',
        name: 'member-payments-history',
        component: () => import('@/components/Member/Payments/PaymentHistory.vue'),
        meta: { allowedRole: 'Member' }
      },

      // --- AJUSTES Y PERFIL PERSONAL ---
      {
        path: 'profile',
        name: 'member-profile',
        component: () => import('@/components/Member/Componets/Profile.vue'),
        meta: { allowedRole: 'Member' }
      },
      {
        path: 'settings',
        name: 'member-settings',
        component: () => import('@/components/Member/Settings.vue'),
        meta: { allowedRole: 'Member' }
      },
      {
        path: 'help',
        name: 'member-help',
        component: () => import('@/components/Member/Componets/Help.vue'),
        meta: { allowedRole: 'Member' }
      }
    ]
  }
];
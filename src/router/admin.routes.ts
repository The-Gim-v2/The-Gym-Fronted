export const AdminRoutes = [
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { allowedRole: 'Admin' },
    children: [
      {
        path: 'dashboard',
        name: 'Admin-dashboard',
        component: () => import('@/components/Admin/Dashboard.vue'),
        meta: { allowedRole: 'Admin' }
      },
    ]
  }
]
export const AdminRoutes = [
  {
    path: '/Admin',
    component: () => import('@/views/Admin/AdminLayout.vue'),
    children: [
      {
        path: 'dashboard',
        name: 'Admin-dashboard',
        component: () => import('@/components/Admin/Dashboard.vue'),
        meta: { allowedRole: 'Admin' }
      },
      // Grupo de Registro
      {
        path: 'editar-usuario/:id',
        name: 'edit-user',
        component: () => import('@/components/Admin/Edits/EditUser.vue'),
         meta: { allowedRole: 'Admin' }
      },
      
   ]
  }
]
import { createRouter, createWebHistory } from 'vue-router'
import { OwnerRoutes } from './owner.routes.ts'
import { recepcionRoutes } from './recepcionista.route.ts'
import { AdminRoutes } from './admin.routes.ts'
import Main from '@/landing/Main.vue'
import Login from '@/landing/Menu/Login.vue'
import RecoverPassword from '@/landing/Menu/Recover-password.vue'
import Record from '@/landing/Menu/Record.vue'
import LoginClient from '@/components/Login.vue'
import RecoverPasswordClient from '@/components/Record/Recover-password.vue'
import RecordClient from '@/components/Record/Record-Client.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/loginclient',
      name: 'loginclient', 
      component: LoginClient,
    },
    {
      path: '/recover-password',
      name: 'recover-password',
      component: RecoverPassword,
    },
    {
      path: '/recover-password-client',
      name: 'recover-password-client',
      component: RecoverPasswordClient,
    },
    {
      path: '/record',
      name: 'record',
      component: Record,
    },
    {
      path: '/record-client', 
      name: 'record-client',
      component: RecordClient,
    },
    ...OwnerRoutes,
    ...recepcionRoutes,
    ...AdminRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/components/NotFound.vue') 
    }
  ],
})

router.beforeEach((to) => {
  const userRole = localStorage.getItem('user_role');

  const roleRequerido = to.meta.allowedRole;
  if (roleRequerido && userRole !== roleRequerido) {
     return { name: 'home' };
  }

  // Resto de tu guardia...
});

export default router
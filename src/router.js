import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import HomePage from '@/views/HomePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/calendar',
    name: 'calendar',
    component: () => import('@/views/CalendarPage.vue'),
  },
  {
    path: '/links',
    name: 'links',
    component: () => import('@/views/LinksPage.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { guestOnly: true, title: 'Sign In' }
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/RegisterPage.vue'),
    meta: { guestOnly: true, title: 'Create Account' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/calendar'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  
  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { name: 'calendar' }
  }
})

export default router
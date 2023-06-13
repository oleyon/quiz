import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/RegisterView.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/createquiz',
      name: 'createquiz',
      component: () => import('../views/CreateQuizView.vue')
    },
    {
      path: '/room/create',
      name: 'createroom',
      component: () => import('../views/CreateRoomView.vue')
    },
    {
      path: '/room/join/:roomId',
      name: 'room',
      component: () => import('../views/RoomView.vue')
    }
  ]
})

export default router

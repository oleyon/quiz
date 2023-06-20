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
      path: '/room',
      name: 'room',
      component: () => import('../views/RoomView.vue'),
      props: (route) => ({
        roomId: route.query.roomId,
        password: route.query.password
      })
    }
  ]
})

export default router

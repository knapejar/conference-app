import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Program from '../views/Program.vue'
import Home from '../views/Home.vue'
import People from '../views/People.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  }, {
    path: '/program',
    name: 'Program',
    component: Program
  }, {
    path: '/questions/:id',
    name: 'Questions',
    component: () => import('../views/Questions.vue')
  }, {
    path: '/home',
    name: 'Home',
    component: Home
  }, {
    path: '/people',
    name: 'People',
    component: People
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Program from '../views/Program.vue'
import Home from '../views/Home.vue'
import People from '../views/People.vue'
import Questions from '../views/Questions.vue'
import Welcome from '../views/Welcome.vue'

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
    component: Questions
  }, {
    path: '/home',
    name: 'Home',
    component: Home
  }, {
    path: '/people',
    name: 'People',
    component: People
  }, {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router

import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Program from '../views/Program.vue'
import Home from '../views/Home.vue'
import People from '../views/People.vue'
import Questions from '../views/Questions.vue'
import Admin from '../views/Admin.vue'
import Registration from '@/components/registration/Registration.vue';
import Settings from '@/components/settings/Settings.vue';
import WelcomeScreen from '@/components/welcome/WelcomeScreen.vue';
import PresentationDetail from '@/components/presentations/PresentationDetail.vue';
import ConferenceBlockEditor from '@/components/admin/ConferenceBlockEditor.vue';
import PresentationEditor from '@/components/admin/PresentationEditor.vue';
import PresenterEditor from '@/components/admin/PresenterEditor.vue';
import AdminQuestionsView from '@/components/admin/AdminQuestionsView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  }, {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomeScreen
  }, {
    path: '/program',
    name: 'Program',
    component: Program
  }, {
    path: '/presentations/:id',
    name: 'PresentationDetail',
    component: PresentationDetail
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
    path: '/registration',
    name: 'Registration',
    component: Registration
  }, {
    path: '/admin',
    name: 'Admin',
    component: Admin
  }, {
    path: '/admin/blocks/new',
    name: 'NewBlock',
    component: ConferenceBlockEditor
  }, {
    path: '/admin/blocks/:id',
    name: 'EditBlock',
    component: ConferenceBlockEditor
  }, {
    path: '/admin/presentations/new',
    name: 'NewPresentation',
    component: PresentationEditor
  }, {
    path: '/admin/presentations/:id',
    name: 'EditPresentation',
    component: PresentationEditor
  }, {
    path: '/admin/presenters/new',
    name: 'NewPresenter',
    component: PresenterEditor
  }, {
    path: '/admin/presenters/:id',
    name: 'EditPresenter',
    component: PresenterEditor
  }, {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }, {
    path: '/admin/presentations/:id/questions',
    name: 'AdminQuestions',
    component: AdminQuestionsView,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guard to check if user needs to see welcome screen
router.beforeEach((to, from, next) => {
  if (to.path === '/welcome') {
    next()
    return
  }

  const savedSettings = localStorage.getItem('userSettings')
  if (!savedSettings) {
    next('/welcome')
    return
  }

  const settings = JSON.parse(savedSettings)
  if (!settings.name) {
    next('/welcome')
    return
  }

  next()
})

export default router

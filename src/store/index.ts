import { createStore } from 'vuex'
import { RootState } from './types'
import questions from './modules/questions'
import settings from './modules/settings'
import conference from './modules/conference'
import presentations from './modules/presentations'
import people from './modules/people'
import announcements from './modules/announcements'
import admin from './modules/admin'
import toast from './modules/toast'
import notifications from './modules/notifications'

export default createStore<RootState>({
  modules: {
    questions,
    settings,
    conference,
    presentations,
    people,
    announcements,
    admin,
    toast,
    notifications
  }
})

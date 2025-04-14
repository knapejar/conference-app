import { createStore } from 'vuex'
// @ts-ignore
import questions from './modules/questions'
// @ts-ignore
import settings from './modules/settings'
// @ts-ignore
import conference from './modules/conference'
// @ts-ignore
import presentations from './modules/presentations'
// @ts-ignore
import people from './modules/people'

export default createStore({
  modules: {
    questions,
    settings,
    conference,
    presentations,
    people
  }
})

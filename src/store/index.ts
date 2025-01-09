import { createStore } from 'vuex';
import { ref } from 'vue'
import { getDebugToken, getInitialUpdate } from '@/api';

const store = createStore({
    state: {
        deviceToken: '',
        userId: -1,
        conference: {
            id: -1,
            name: "",
            description: "",
            welcomeImage: "",
        },
        announcements: ref([]),
        blocks: ref([]),
        presenters: ref([]),
    },
    getters: {
        conference(state) {
            return state.conference;
        },
        announcements(state) {
            return state.announcements;
        },
        blocks(state) {
            return state.blocks;
        },
        presenters(state) {
            return state.presenters;
        },
    },
    actions: {
        async initializeApp({ commit }) {
            const deviceToken = await getDebugToken();
            this.state.deviceToken = deviceToken

            try {
                const { announcements, blocks, conference, presenters } = await getInitialUpdate(this.state.deviceToken);
                commit('setAnnouncements', announcements);
                commit('setBlocks', blocks);
                commit('setConference', { conference });
                commit('setPresenters', presenters);
            } catch (error) {
                console.error('Error initializing app:', error);
            }
        }
    },
    mutations: {
        setConference(state, data) {
            Object.assign(state, data);
        },
        setAnnouncements(state, announcements) {
            state.announcements = announcements;
        },
        setBlocks(state, blocks) {
            state.blocks = blocks;
        },
        setPresenters(state, presenters) {
            state.presenters = presenters;
        },
    }
});

export default store;

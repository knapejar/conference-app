import { getConference } from '@/api';
import { Module } from 'vuex';

interface ConferenceState {
    name: string;
    description: string;
    welcomeImage: string;
    isLoggedIn: boolean;
    userId: string | null;
    loading: boolean;
    error: string | null;
}

interface LoginState {
    isLoggedIn: boolean;
    userId: string | null;
}

const conferenceModule: Module<ConferenceState, any> = {
    namespaced: true,
    state: {
        name: 'Conference App',
        description: 'Welcome to our conference application. This is a platform for managing conference presentations, questions, and networking.',
        welcomeImage: 'https://via.placeholder.com/800x400?text=Welcome+to+Conference',
        isLoggedIn: false,
        userId: null,
        loading: false,
        error: null
    },
    mutations: {
        setConferenceData(state: ConferenceState, data: Partial<ConferenceState>) {
            state.name = data.name || state.name;
            state.description = data.description || state.description;
            state.welcomeImage = data.welcomeImage || state.welcomeImage;
        },
        setLoginState(state: ConferenceState, { isLoggedIn, userId }: LoginState) {
            state.isLoggedIn = isLoggedIn;
            state.userId = userId;
        },
        setLoading(state: ConferenceState, loading: boolean) {
            state.loading = loading;
        },
        setError(state: ConferenceState, error: string | null) {
            state.error = error;
        }
    },
    actions: {
        initializeApp({ commit, dispatch }) {
            // Load conference data from localStorage if available
            const savedData = localStorage.getItem('conferenceData');
            if (savedData) {
                commit('setConferenceData', JSON.parse(savedData));
            }
            
            // Check if user is logged in
            const userId = localStorage.getItem('userId');
            if (userId) {
                commit('setLoginState', { isLoggedIn: true, userId });
            }
            
            // Fetch initial data from API
            dispatch('fetchConferenceData');
        },
        async fetchConferenceData({ commit }) {
            commit('setLoading', true);
            commit('setError', null);
            
            try {
                const conference = await getConference();
                if (conference) {
                    commit('setConferenceData', conference);
                    // Save to localStorage
                    localStorage.setItem('conferenceData', JSON.stringify(conference));
                }
            } catch (error) {
                console.error('Error fetching conference data:', error);
                commit('setError', error instanceof Error ? error.message : 'Failed to fetch conference data');
            } finally {
                commit('setLoading', false);
            }
        },
        updateConferenceData({ commit, state }, data: Partial<ConferenceState>) {
            commit('setConferenceData', data);
            localStorage.setItem('conferenceData', JSON.stringify(state));
        },
        login({ commit }, userId: string) {
            commit('setLoginState', { isLoggedIn: true, userId });
            localStorage.setItem('userId', userId);
        },
        logout({ commit }) {
            commit('setLoginState', { isLoggedIn: false, userId: null });
            localStorage.removeItem('userId');
        }
    },
    getters: {
        getConferenceData: (state: ConferenceState) => ({
            name: state.name,
            description: state.description,
            welcomeImage: state.welcomeImage
        }),
        isLoggedIn: (state: ConferenceState) => state.isLoggedIn,
        getUserId: (state: ConferenceState) => state.userId,
        isLoading: (state: ConferenceState) => state.loading,
        getError: (state: ConferenceState) => state.error
    }
};

export default conferenceModule; 
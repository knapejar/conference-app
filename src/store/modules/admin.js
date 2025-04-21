import { verifyAdminAccess } from '@/api/admin';

export default {
    namespaced: true,
    state: {
        isAuthenticated: false,
        password: localStorage.getItem('adminPassword') || null,
        loading: false,
        error: null
    },
    mutations: {
        setAuthenticated(state, isAuthenticated) {
            state.isAuthenticated = isAuthenticated;
        },
        setPassword(state, password) {
            state.password = password;
            if (password) {
                localStorage.setItem('adminPassword', password);
            } else {
                localStorage.removeItem('adminPassword');
            }
        },
        setLoading(state, loading) {
            state.loading = loading;
        },
        setError(state, error) {
            state.error = error;
        }
    },
    actions: {
        async verifyAccess({ commit, state }) {
            if (!state.password) {
                return false;
            }

            commit('setLoading', true);
            commit('setError', null);

            try {
                await verifyAdminAccess(state.password);
                commit('setAuthenticated', true);
                return true;
            } catch (error) {
                commit('setAuthenticated', false);
                commit('setError', error.message || 'Failed to verify admin access');
                return false;
            } finally {
                commit('setLoading', false);
            }
        },
        async login({ commit, dispatch }, password) {
            commit('setLoading', true);
            commit('setError', null);

            try {
                await verifyAdminAccess(password);
                commit('setPassword', password);
                commit('setAuthenticated', true);
                return true;
            } catch (error) {
                commit('setError', error.message || 'Invalid admin password');
                return false;
            } finally {
                commit('setLoading', false);
            }
        },
        logout({ commit }) {
            commit('setPassword', null);
            commit('setAuthenticated', false);
        }
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        isLoading: state => state.loading,
        getError: state => state.error
    }
}; 
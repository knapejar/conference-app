import { verifyAdminAccess } from '@/api/admin';
import { Module } from 'vuex';
import { AdminState, RootState } from '@/store/types';

const adminModule: Module<AdminState, RootState> = {
    namespaced: true,
    state: {
        isAuthenticated: false,
        password: localStorage.getItem('adminPassword') || null,
        loading: false,
        error: null
    },
    mutations: {
        setAuthenticated(state: AdminState, isAuthenticated: boolean) {
            state.isAuthenticated = isAuthenticated;
        },
        setPassword(state: AdminState, password: string | null) {
            state.password = password;
            if (password) {
                localStorage.setItem('adminPassword', password);
            } else {
                localStorage.removeItem('adminPassword');
            }
        },
        setLoading(state: AdminState, loading: boolean) {
            state.loading = loading;
        },
        setError(state: AdminState, error: string | null) {
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
                commit('setError', error instanceof Error ? error.message : 'Failed to verify admin access');
                return false;
            } finally {
                commit('setLoading', false);
            }
        },
        async login({ commit, dispatch }, password: string) {
            commit('setLoading', true);
            commit('setError', null);

            try {
                await verifyAdminAccess(password);
                commit('setPassword', password);
                commit('setAuthenticated', true);
                return true;
            } catch (error) {
                commit('setError', error instanceof Error ? error.message : 'Invalid admin password');
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
        isAuthenticated: (state: AdminState) => state.isAuthenticated,
        isLoading: (state: AdminState) => state.loading,
        getError: (state: AdminState) => state.error
    }
};

export default adminModule; 
import { getInitialUpdate } from '@/api';

export default {
  namespaced: true,
  state: {
    people: [],
    loading: false,
    error: null
  },
  mutations: {
    setPeople(state, people) {
      state.people = people;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    }
  },
  actions: {
    async fetchPeople({ commit }) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        console.log('Fetching people...');
        const data = await getInitialUpdate();
        console.log('Received data:', data);
        if (data && data.presenters) {
          // Transform presenters to include presentation info
          const transformedPresenters = data.presenters.map(presenter => ({
            ...presenter,
            presentationInfo: presenter.presentation ? {
              title: presenter.presentation.title,
              start: presenter.presentation.start,
              end: presenter.presentation.end,
              blockName: presenter.presentation.block.blockName
            } : null
          }));
          console.log('Transformed presenters:', transformedPresenters);
          commit('setPeople', transformedPresenters);
        } else {
          console.warn('No presenters data received');
          commit('setPeople', []);
        }
      } catch (error) {
        console.error('Error fetching people:', error);
        commit('setError', error.message || 'Failed to fetch people');
        commit('setPeople', []);
      } finally {
        commit('setLoading', false);
      }
    }
  },
  getters: {
    getPeople: state => state.people,
    getPersonById: state => id => state.people.find(p => p.id === id),
    getPeopleByPresentationId: state => presentationId => state.people.filter(p => p.presentationId === presentationId),
    isLoading: state => state.loading,
    getError: state => state.error
  }
} 
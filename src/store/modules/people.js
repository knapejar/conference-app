import { getPeople } from '@/api';

function loadPeople() {
  const stored = localStorage.getItem('people');
  return stored ? JSON.parse(stored) : [];
}

export default {
  namespaced: true,
  state: {
    people: loadPeople(),
    loading: false,
    error: null
  },
  mutations: {
    setPeople(state, people) {
      state.people = people;
      localStorage.setItem('people', JSON.stringify(people));
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      if (state.people.length === 0) {
        state.error = error;
      } else {
        state.error = null;
      }
    }
  },
  actions: {
    async fetchPeople({ commit, state }) {
      if (state.people.length === 0) {
        commit('setLoading', true);
      }
      commit('setError', null);
      
      try {
        const presenters = await getPeople();
        if (presenters) {
          const transformedPresenters = presenters.map(presenter => ({
            ...presenter,
            presentationInfo: presenter.presentation ? {
              title: presenter.presentation.title,
              start: presenter.presentation.start,
              end: presenter.presentation.end,
              blockName: presenter.presentation.block.blockName
            } : null
          }));
          commit('setPeople', transformedPresenters);
        } else {
          console.warn('No presenters data received');
          if (state.people.length === 0) {
            commit('setPeople', []);
          }
        }
      } catch (error) {
        console.error('Error fetching people:', error);
        if (state.people.length === 0) {
          commit('setError', error.message || 'Failed to fetch people');
        } else {
          console.error('Network error, using cached people:', error);
        }
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
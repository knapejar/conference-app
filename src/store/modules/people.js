import { getInitialUpdate } from '@/api';

// Helper function to load people from localStorage
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
      // Only set error if we don't have any cached data
      if (state.people.length === 0) {
        state.error = error;
      } else {
        // Just log the error to console but don't show it to the user
        console.error('Network error, using cached people:', error);
        state.error = null;
      }
    }
  },
  actions: {
    async fetchPeople({ commit, state }) {
      // Only set loading if we don't have any data yet
      if (state.people.length === 0) {
        commit('setLoading', true);
      }
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
          // Don't clear data if we have cached data
          if (state.people.length === 0) {
            commit('setPeople', []);
          }
        }
      } catch (error) {
        console.error('Error fetching people:', error);
        // Only set error if we don't have any cached data
        if (state.people.length === 0) {
          commit('setError', error.message || 'Failed to fetch people');
        } else {
          // Just log the error to console but don't show it to the user
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
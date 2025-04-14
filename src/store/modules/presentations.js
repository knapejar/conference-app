import { getInitialUpdate } from '@/api';

// Helper function to load starred presentations from localStorage
function loadStarredPresentations() {
  const stored = localStorage.getItem('starredPresentations');
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

export default {
  namespaced: true,
  state: {
    blocks: [],
    presentations: [],
    starredPresentations: loadStarredPresentations(),
    loading: false,
    error: null
  },
  mutations: {
    setBlocks(state, blocks) {
      state.blocks = blocks;
    },
    setPresentations(state, presentations) {
      state.presentations = presentations;
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      state.error = error;
    },
    toggleStarredPresentation(state, presentationId) {
      if (state.starredPresentations.has(presentationId)) {
        state.starredPresentations.delete(presentationId);
      } else {
        state.starredPresentations.add(presentationId);
      }
      // Save to localStorage
      localStorage.setItem('starredPresentations', JSON.stringify([...state.starredPresentations]));
    }
  },
  actions: {
    async fetchPresentations({ commit }) {
      commit('setLoading', true);
      commit('setError', null);
      
      try {
        console.log('Fetching presentations...');
        const data = await getInitialUpdate();
        console.log('Received data:', data);
        if (data && data.blocks) {
          // Store the blocks
          commit('setBlocks', data.blocks);
          console.log('Stored blocks:', data.blocks);
          
          // Extract all presentations from blocks
          const allPresentations = data.blocks.reduce((acc, block) => {
            return acc.concat(block.presentations.map(presentation => ({
              ...presentation,
              blockName: block.blockName,
              blockId: block.id
            })));
          }, []);
          
          commit('setPresentations', allPresentations);
          console.log('Stored presentations:', allPresentations);
        } else {
          console.warn('No blocks data received');
          commit('setBlocks', []);
          commit('setPresentations', []);
        }
      } catch (error) {
        console.error('Error fetching presentations:', error);
        commit('setError', error.message || 'Failed to fetch presentations');
        commit('setBlocks', []);
        commit('setPresentations', []);
      } finally {
        commit('setLoading', false);
      }
    },
    toggleStar({ commit }, presentationId) {
      commit('toggleStarredPresentation', presentationId);
    }
  },
  getters: {
    getBlocks: state => state.blocks,
    getPresentations: state => state.presentations,
    getPresentationById: state => id => state.presentations.find(p => p.id === id),
    getPresentationsByBlockId: state => blockId => state.presentations.filter(p => p.blockId === blockId),
    isPresentationStarred: state => id => state.starredPresentations.has(id),
    getStarredPresentations: state => state.presentations.filter(p => state.starredPresentations.has(p.id)),
    isLoading: state => state.loading,
    getError: state => state.error
  }
} 
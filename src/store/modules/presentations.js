import { getInitialUpdate } from '@/api';

// Helper function to load starred presentations from localStorage
function loadStarredPresentations() {
  const stored = localStorage.getItem('starredPresentations');
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

// Helper function to load presentations from localStorage
function loadPresentations() {
  const stored = localStorage.getItem('presentations');
  return stored ? JSON.parse(stored) : [];
}

// Helper function to load blocks from localStorage
function loadBlocks() {
  const stored = localStorage.getItem('blocks');
  return stored ? JSON.parse(stored) : [];
}

export default {
  namespaced: true,
  state: {
    blocks: loadBlocks(),
    presentations: loadPresentations(),
    starredPresentations: loadStarredPresentations(),
    loading: false,
    error: null
  },
  mutations: {
    setBlocks(state, blocks) {
      state.blocks = blocks;
      localStorage.setItem('blocks', JSON.stringify(blocks));
    },
    setPresentations(state, presentations) {
      state.presentations = presentations;
      localStorage.setItem('presentations', JSON.stringify(presentations));
    },
    setLoading(state, loading) {
      state.loading = loading;
    },
    setError(state, error) {
      // Only set error if we don't have any cached data
      if (state.presentations.length === 0) {
        state.error = error;
      } else {
        // Just log the error to console but don't show it to the user
        console.error('Network error, using cached data:', error);
        state.error = null;
      }
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
    async fetchPresentations({ commit, state }) {
      // Only set loading if we don't have any data yet
      if (state.presentations.length === 0) {
        commit('setLoading', true);
      }
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
          // Don't clear data if we have cached data
          if (state.presentations.length === 0) {
            commit('setBlocks', []);
            commit('setPresentations', []);
          }
        }
      } catch (error) {
        console.error('Error fetching presentations:', error);
        // Only set error if we don't have any cached data
        if (state.presentations.length === 0) {
          commit('setError', error.message || 'Failed to fetch presentations');
        } else {
          // Just log the error to console but don't show it to the user
          console.error('Network error, using cached data:', error);
        }
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
import { getInitialUpdate } from '@/api';

export default {
  namespaced: true,
  state: {
    blocks: [],
    presentations: [],
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
    }
  },
  getters: {
    getBlocks: state => state.blocks,
    getPresentations: state => state.presentations,
    getPresentationById: state => id => state.presentations.find(p => p.id === id),
    getPresentationsByBlockId: state => blockId => state.presentations.filter(p => p.blockId === blockId),
    isLoading: state => state.loading,
    getError: state => state.error
  }
} 
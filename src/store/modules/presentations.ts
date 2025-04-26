import { getPresentations } from '@/api';
import { Module } from 'vuex';

interface Block {
    id: string;
    blockName: string;
    presentations: Presentation[];
}

interface Presentation {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    blockId: string;
    presenterId: string;
    blockName?: string;
}

interface PresentationsState {
    blocks: Block[];
    presentations: Presentation[];
    starredPresentations: Set<string>;
    loading: boolean;
    error: string | null;
}

function loadStarredPresentations(): Set<string> {
    const stored = localStorage.getItem('starredPresentations');
    return stored ? new Set(JSON.parse(stored)) : new Set();
}

function loadPresentations(): Presentation[] {
    const stored = localStorage.getItem('presentations');
    return stored ? JSON.parse(stored) : [];
}

function loadBlocks(): Block[] {
    const stored = localStorage.getItem('blocks');
    return stored ? JSON.parse(stored) : [];
}

const presentationsModule: Module<PresentationsState, any> = {
    namespaced: true,
    state: {
        blocks: loadBlocks(),
        presentations: loadPresentations(),
        starredPresentations: loadStarredPresentations(),
        loading: false,
        error: null
    },
    mutations: {
        setBlocks(state: PresentationsState, blocks: Block[]) {
            state.blocks = blocks;
            localStorage.setItem('blocks', JSON.stringify(blocks));
        },
        setPresentations(state: PresentationsState, presentations: Presentation[]) {
            state.presentations = presentations;
            localStorage.setItem('presentations', JSON.stringify(presentations));
        },
        setLoading(state: PresentationsState, loading: boolean) {
            state.loading = loading;
        },
        setError(state: PresentationsState, error: string | null) {
            if (state.presentations.length === 0) {
                state.error = error;
            } else {
                state.error = null;
            }
        },
        toggleStarredPresentation(state: PresentationsState, presentationId: string) {
            if (state.starredPresentations.has(presentationId)) {
                state.starredPresentations.delete(presentationId);
            } else {
                state.starredPresentations.add(presentationId);
            }
            localStorage.setItem('starredPresentations', JSON.stringify([...state.starredPresentations]));
        }
    },
    actions: {
        async fetchPresentations({ commit, state }) {
            if (state.presentations.length === 0) {
                commit('setLoading', true);
            }
            commit('setError', null);
            
            try {
                const blocks = await getPresentations();
                if (blocks) {
                    commit('setBlocks', blocks);
                    
                    const allPresentations = blocks.reduce((acc: Presentation[], block: Block) => {
                        return acc.concat(block.presentations.map(presentation => ({
                            ...presentation,
                            blockName: block.blockName,
                            blockId: block.id
                        })));
                    }, []);
                    
                    commit('setPresentations', allPresentations);
                } else {
                    console.warn('No blocks data received');
                    if (state.presentations.length === 0) {
                        commit('setBlocks', []);
                        commit('setPresentations', []);
                    }
                }
            } catch (error) {
                console.error('Error fetching presentations:', error);
                if (state.presentations.length === 0) {
                    commit('setError', error instanceof Error ? error.message : 'Failed to fetch presentations');
                } else {
                    console.error('Network error, using cached data:', error);
                }
            } finally {
                commit('setLoading', false);
            }
        },
        toggleStar({ commit }, presentationId: string) {
            commit('toggleStarredPresentation', presentationId);
        }
    },
    getters: {
        getBlocks: (state: PresentationsState) => state.blocks,
        getPresentations: (state: PresentationsState) => state.presentations,
        getPresentationById: (state: PresentationsState) => (id: string) => 
            state.presentations.find(p => p.id === id),
        getPresentationsByBlockId: (state: PresentationsState) => (blockId: string) => 
            state.presentations.filter(p => p.blockId === blockId),
        isPresentationStarred: (state: PresentationsState) => (id: string) => 
            state.starredPresentations.has(id),
        getStarredPresentations: (state: PresentationsState) => 
            state.presentations.filter(p => state.starredPresentations.has(p.id)),
        isLoading: (state: PresentationsState) => state.loading,
        getError: (state: PresentationsState) => state.error
    }
};

export default presentationsModule; 
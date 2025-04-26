import { getPeople } from '@/api';
import { Module } from 'vuex';

interface Person {
    id: string;
    name: string;
    title: string;
    bio: string;
    imageUrl: string;
    presentationId?: string;
    presentationInfo?: {
        title: string;
        start: string;
        end: string;
        blockName: string;
    };
}

interface PeopleState {
    people: Person[];
    loading: boolean;
    error: string | null;
}

function loadPeople(): Person[] {
    const stored = localStorage.getItem('people');
    return stored ? JSON.parse(stored) : [];
}

const peopleModule: Module<PeopleState, any> = {
    namespaced: true,
    state: {
        people: loadPeople(),
        loading: false,
        error: null
    },
    mutations: {
        setPeople(state: PeopleState, people: Person[]) {
            state.people = people;
            localStorage.setItem('people', JSON.stringify(people));
        },
        setLoading(state: PeopleState, loading: boolean) {
            state.loading = loading;
        },
        setError(state: PeopleState, error: string | null) {
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
                    commit('setError', error instanceof Error ? error.message : 'Failed to fetch people');
                } else {
                    console.error('Network error, using cached people:', error);
                }
            } finally {
                commit('setLoading', false);
            }
        }
    },
    getters: {
        getPeople: (state: PeopleState) => state.people,
        getPersonById: (state: PeopleState) => (id: string) => state.people.find(p => p.id === id),
        getPeopleByPresentationId: (state: PeopleState) => (presentationId: string) => 
            state.people.filter(p => p.presentationId === presentationId),
        isLoading: (state: PeopleState) => state.loading,
        getError: (state: PeopleState) => state.error
    }
};

export default peopleModule; 
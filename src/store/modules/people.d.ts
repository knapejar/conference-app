declare module './people' {
  interface Person {
    id: string;
    name: string;
    role: string;
    bio: string;
    imageUrl: string;
    [key: string]: any;
  }

  interface PeopleState {
    people: Person[];
    loading: boolean;
    error: string | null;
  }

  interface PeopleModule {
    namespaced: boolean;
    state: PeopleState;
    mutations: {
      setPeople(state: PeopleState, people: Person[]): void;
      setLoading(state: PeopleState, loading: boolean): void;
      setError(state: PeopleState, error: string | null): void;
    };
    actions: {
      fetchPeople({ commit }: { commit: Function }): Promise<void>;
    };
    getters: {
      getPeople: (state: PeopleState) => Person[];
      getPersonById: (state: PeopleState) => (id: string) => Person | undefined;
      isLoading: (state: PeopleState) => boolean;
      getError: (state: PeopleState) => string | null;
    };
  }

  const people: PeopleModule;
  export default people;
} 
declare module './conference' {
  interface ConferenceState {
    name: string;
    description: string;
    welcomeImage: string;
    isLoggedIn: boolean;
    userId: string | null;
    loading: boolean;
    error: string | null;
  }

  interface ConferenceModule {
    namespaced: boolean;
    state: ConferenceState;
    mutations: {
      setConferenceData(state: ConferenceState, data: Partial<ConferenceState>): void;
      setLoginState(state: ConferenceState, { isLoggedIn, userId }: { isLoggedIn: boolean; userId: string | null }): void;
      setLoading(state: ConferenceState, loading: boolean): void;
      setError(state: ConferenceState, error: string | null): void;
    };
    actions: {
      initializeApp({ commit, dispatch }: { commit: Function; dispatch: Function }): void;
      fetchConferenceData({ commit }: { commit: Function }): Promise<void>;
      updateConferenceData({ commit, state }: { commit: Function; state: ConferenceState }, data: Partial<ConferenceState>): void;
      login({ commit }: { commit: Function }, userId: string): void;
      logout({ commit }: { commit: Function }): void;
    };
    getters: {
      getConferenceData: (state: ConferenceState) => { name: string; description: string; welcomeImage: string };
      isLoggedIn: (state: ConferenceState) => boolean;
      getUserId: (state: ConferenceState) => string | null;
      isLoading: (state: ConferenceState) => boolean;
      getError: (state: ConferenceState) => string | null;
    };
  }

  const conference: ConferenceModule;
  export default conference;
} 
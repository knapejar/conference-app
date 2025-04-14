declare module './presentations' {
  interface Presentation {
    id: string;
    title: string;
    description: string;
    speakerId: string;
    startTime: string;
    endTime: string;
    room: string;
    [key: string]: any;
  }

  interface PresentationsState {
    presentations: Presentation[];
    loading: boolean;
    error: string | null;
  }

  interface PresentationsModule {
    namespaced: boolean;
    state: PresentationsState;
    mutations: {
      setPresentations(state: PresentationsState, presentations: Presentation[]): void;
      setLoading(state: PresentationsState, loading: boolean): void;
      setError(state: PresentationsState, error: string | null): void;
    };
    actions: {
      fetchPresentations({ commit }: { commit: Function }): Promise<void>;
    };
    getters: {
      getPresentations: (state: PresentationsState) => Presentation[];
      getPresentationById: (state: PresentationsState) => (id: string) => Presentation | undefined;
      isLoading: (state: PresentationsState) => boolean;
      getError: (state: PresentationsState) => string | null;
    };
  }

  const presentations: PresentationsModule;
  export default presentations;
} 
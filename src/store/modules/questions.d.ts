declare module './questions' {
  interface Question {
    id: string;
    text: string;
    presentationId: string;
    createdAt: string;
    isLiked?: boolean;
  }

  interface QuestionsState {
    likedQuestions: Set<string>;
    questions: Question[];
  }

  interface QuestionsModule {
    namespaced: boolean;
    state: QuestionsState;
    getters: {
      getQuestions: (state: QuestionsState) => Question[];
      isQuestionLiked: (state: QuestionsState) => (questionId: string) => boolean;
    };
    mutations: {
      setQuestions(state: QuestionsState, questions: Question[]): void;
      setLikedQuestions(state: QuestionsState, questionIds: string[]): void;
      toggleQuestionLike(state: QuestionsState, questionId: string): void;
    };
    actions: {
      fetchQuestions({ commit }: { commit: Function }, presentationId: string): Promise<void>;
      createNewQuestion({ commit }: { commit: Function }, { presentationId, question }: { presentationId: string; question: string }): Promise<void>;
      toggleLike({ commit, state }: { commit: Function; state: QuestionsState }, questionId: string): Promise<void>;
      deleteQuestion({ commit }: { commit: Function }, questionId: string): Promise<void>;
    };
  }

  const questions: QuestionsModule;
  export default questions;
} 
import { ref } from 'vue';
import { 
    getQuestions, 
    createQuestion, 
    likeQuestion as likeQuestionAPI, 
    unlikeQuestion, 
    deleteQuestion 
} from '@/api';
import { Module } from 'vuex';

interface Question {
    id: string;
    presentationId: string;
    content: string;
    author: string;
    authorToken: string;
    likes: number;
    createdAt: string;
    isLiked?: boolean;
    owned?: boolean;
}

interface QuestionsState {
    likedQuestions: Set<string>;
    questions: { [key: string]: Question[] };
    currentPresentationId: string | null;
    myQuestions: Set<string>;
}

function loadQuestions(): { [key: string]: Question[] } {
    const stored = localStorage.getItem('questions');
    return stored ? JSON.parse(stored) : {};
}

function loadLikedQuestions(): Set<string> {
    const stored = localStorage.getItem('likedQuestions');
    return stored ? new Set(JSON.parse(stored)) : new Set();
}

function loadMyQuestions(): Set<string> {
    const stored = localStorage.getItem('myQuestions');
    return stored ? new Set(JSON.parse(stored)) : new Set();
}

const questionsModule: Module<QuestionsState, any> = {
    namespaced: true,
    state: {
        likedQuestions: loadLikedQuestions(),
        questions: loadQuestions(),
        currentPresentationId: null,
        myQuestions: loadMyQuestions()
    },
    getters: {
        getQuestions: (state: QuestionsState) => (presentationId: string) => {
            const questions = state.questions[presentationId];
            if (!questions || !Array.isArray(questions)) {
                return [];
            }
            return questions.map(question => ({
                ...question,
                isLiked: state.likedQuestions.has(question.id),
                owned: state.myQuestions.has(question.id)
            }));
        },
        isQuestionLiked: (state: QuestionsState) => (questionId: string) => 
            state.likedQuestions.has(questionId),
    },
    mutations: {
        setQuestions(state: QuestionsState, { presentationId, questions }: { presentationId: string; questions: Question[] }) {
            if (!Array.isArray(questions)) {
                console.error('Questions must be an array');
                return;
            }
            state.questions[presentationId] = questions;
            state.currentPresentationId = presentationId;
            localStorage.setItem('questions', JSON.stringify(state.questions));
        },
        setLikedQuestions(state: QuestionsState, questionIds: string[]) {
            state.likedQuestions = new Set(questionIds);
            localStorage.setItem('likedQuestions', JSON.stringify([...state.likedQuestions]));
        },
        toggleQuestionLike(state: QuestionsState, questionId: string) {
            if (state.likedQuestions.has(questionId)) {
                state.likedQuestions.delete(questionId);
            } else {
                state.likedQuestions.add(questionId);
            }
            localStorage.setItem('likedQuestions', JSON.stringify([...state.likedQuestions]));
        },
        addMyQuestion(state: QuestionsState, questionId: string) {
            state.myQuestions.add(questionId);
            localStorage.setItem('myQuestions', JSON.stringify([...state.myQuestions]));
        },
        removeMyQuestion(state: QuestionsState, questionId: string) {
            state.myQuestions.delete(questionId);
            localStorage.setItem('myQuestions', JSON.stringify([...state.myQuestions]));
        }
    },
    actions: {
        async fetchQuestions({ commit }, presentationId: string) {
            try {
                const questions = await getQuestions(presentationId);
                if (!Array.isArray(questions)) {
                    throw new Error('Received questions is not an array');
                }
                commit('setQuestions', { presentationId, questions });
                return questions;
            } catch (error) {
                console.error('Failed fetching questions:', error);
                throw error;
            }
        },
        async createNewQuestion({ commit, rootState }, { presentationId, question }: { presentationId: string; question: string }) {
            try {
                const authorToken = rootState.settings.authorToken;
                if (!authorToken) {
                    throw new Error('Author token not initialized');
                }
                const author = rootState.settings.userSettings.name || 'Anonymous';
                
                const questions = await createQuestion(presentationId, question, author, authorToken);
                if (!Array.isArray(questions)) {
                    throw new Error('Received questions is not an array');
                }
                commit('setQuestions', { presentationId, questions });
                commit('addMyQuestion', questions[questions.length - 1].id);
                
                return questions;
            } catch (error) {
                console.error('Error creating question:', error);
                throw error;
            }
        },
        async toggleLike({ commit, state }, questionId: string) {
            try {
                const isLiked = state.likedQuestions.has(questionId);
                const questions = isLiked 
                    ? await unlikeQuestion(questionId)
                    : await likeQuestionAPI(questionId);
                
                if (!Array.isArray(questions)) {
                    throw new Error('Received questions is not an array');
                }
                
                commit('setQuestions', { 
                    presentationId: state.currentPresentationId || '', 
                    questions 
                });
                commit('toggleQuestionLike', questionId);
                return questions;
            } catch (error) {
                console.error('Error toggling like:', error);
                throw error;
            }
        },
        async deleteQuestion({ commit, state }, { questionId, authorToken }: { questionId: string; authorToken: string }) {
            try {
                await deleteQuestion(questionId, authorToken);
                commit('removeMyQuestion', questionId);
                if (state.currentPresentationId) {
                    const questions = state.questions[state.currentPresentationId].filter((q: Question) => q.id !== questionId);
                    commit('setQuestions', { 
                        presentationId: state.currentPresentationId, 
                        questions 
                    });
                }
                return questionId;
            } catch (error) {
                console.error('Error deleting question:', error);
                throw error;
            }
        },
    },
};

export default questionsModule; 
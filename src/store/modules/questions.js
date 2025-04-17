import { ref } from 'vue';
import { 
    getQuestions, 
    createQuestion, 
    likeQuestion as likeQuestionAPI, 
    unlikeQuestion, 
    deleteQuestion 
} from '@/api';

function loadQuestions() {
    const stored = localStorage.getItem('questions');
    return stored ? JSON.parse(stored) : {};
}

function loadLikedQuestions() {
    const stored = localStorage.getItem('likedQuestions');
    return stored ? new Set(JSON.parse(stored)) : new Set();
}

export default {
    namespaced: true,
    state: {
        likedQuestions: ref(loadLikedQuestions()),
        questions: ref(loadQuestions()),
        currentPresentationId: ref(null),
    },
    getters: {
        getQuestions: (state) => (presentationId) => {
            const questions = state.questions[presentationId];
            if (!questions || !Array.isArray(questions)) {
                return [];
            }
            return questions.map(question => ({
                ...question,
                isLiked: state.likedQuestions.has(question.id),
            }));
        },
        isQuestionLiked: (state) => (questionId) => state.likedQuestions.has(questionId),
    },
    mutations: {
        setQuestions(state, { presentationId, questions }) {
            if (!Array.isArray(questions)) {
                console.error('Questions must be an array');
                return;
            }
            state.questions[presentationId] = questions;
            state.currentPresentationId = presentationId;
            localStorage.setItem('questions', JSON.stringify(state.questions));
        },
        setLikedQuestions(state, questionIds) {
            state.likedQuestions = new Set(questionIds);
            localStorage.setItem('likedQuestions', JSON.stringify([...state.likedQuestions]));
        },
        toggleQuestionLike(state, questionId) {
            if (state.likedQuestions.has(questionId)) {
                state.likedQuestions.delete(questionId);
            } else {
                state.likedQuestions.add(questionId);
            }
            localStorage.setItem('likedQuestions', JSON.stringify([...state.likedQuestions]));
        },
    },
    actions: {
        async fetchQuestions({ commit }, presentationId) {
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
        async createNewQuestion({ commit }, { presentationId, question }) {
            try {
                const questions = await createQuestion(presentationId, question);
                if (!Array.isArray(questions)) {
                    throw new Error('Received questions is not an array');
                }
                commit('setQuestions', { presentationId, questions });
                return questions;
            } catch (error) {
                console.error('Error creating question:', error);
                throw error;
            }
        },
        async toggleLike({ commit, state }, questionId) {
            try {
                const isLiked = state.likedQuestions.has(questionId);
                const questions = isLiked 
                    ? await unlikeQuestion(questionId)
                    : await likeQuestionAPI(questionId);
                
                if (!Array.isArray(questions)) {
                    throw new Error('Received questions is not an array');
                }
                
                commit('setQuestions', { 
                    presentationId: state.currentPresentationId, 
                    questions 
                });
                commit('toggleQuestionLike', questionId);
                return questions;
            } catch (error) {
                console.error('Error toggling like:', error);
                throw error;
            }
        },
        async deleteQuestion({ commit, state }, questionId) {
            try {
                const questions = await deleteQuestion(questionId);
                if (!Array.isArray(questions)) {
                    throw new Error('Received questions is not an array');
                }
                commit('setQuestions', { 
                    presentationId: state.currentPresentationId, 
                    questions 
                });
                return questions;
            } catch (error) {
                console.error('Error deleting question:', error);
                throw error;
            }
        },
    },
};
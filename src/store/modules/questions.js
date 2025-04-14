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
    return stored ? JSON.parse(stored) : [];
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
    },
    getters: {
        // Return questions with isLiked property computed dynamically.
        getQuestions: (state) => state.questions.map(question => ({
            ...question,
            isLiked: state.likedQuestions.has(question.id),
        })),
        isQuestionLiked: (state) => (questionId) => state.likedQuestions.has(questionId),
    },
    mutations: {
        setQuestions(state, questions) {
            state.questions = questions;
            localStorage.setItem('questions', JSON.stringify(questions));
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
                commit('setQuestions', questions);
                return questions;
            } catch (error) {
                console.error('Failed fetching questions:', error);
                throw error;
            }
        },
        async createNewQuestion({ commit }, { presentationId, question }) {
            try {
                const questions = await createQuestion(presentationId, question);
                commit('setQuestions', questions);
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
                
                commit('setQuestions', questions);
                commit('toggleQuestionLike', questionId);
                return questions;
            } catch (error) {
                console.error('Error toggling like:', error);
                throw error;
            }
        },
        async deleteQuestion({ commit }, questionId) {
            try {
                const questions = await deleteQuestion(questionId);
                commit('setQuestions', questions);
                return questions;
            } catch (error) {
                console.error('Error deleting question:', error);
                throw error;
            }
        },
    },
};
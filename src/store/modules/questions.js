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

function loadMyQuestions() {
    const stored = localStorage.getItem('myQuestions');
    return stored ? new Set(JSON.parse(stored)) : new Set();
}

export default {
    namespaced: true,
    state: {
        likedQuestions: ref(loadLikedQuestions()),
        questions: ref(loadQuestions()),
        currentPresentationId: ref(null),
        myQuestions: loadMyQuestions()
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
                owned: state.myQuestions.has(question.id)
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
        addMyQuestion(state, questionId) {
            state.myQuestions.add(questionId);
            localStorage.setItem('myQuestions', JSON.stringify([...state.myQuestions]));
        },
        removeMyQuestion(state, questionId) {
            state.myQuestions.delete(questionId);
            localStorage.setItem('myQuestions', JSON.stringify([...state.myQuestions]));
        }
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
        async createNewQuestion({ commit, rootState }, { presentationId, question }) {
            try {
                const authorToken = await this.dispatch('settings/generateAuthorToken', null, { root: true });
                const author = rootState.settings.userSettings.name || 'Anonymous';
                
                const questions = await createQuestion(presentationId, question, author, authorToken);
                if (!Array.isArray(questions)) {
                    throw new Error('Received questions is not an array');
                }
                commit('setQuestions', { presentationId, questions });
                commit('addMyQuestion', questions[questions.length - 1].id);

                // test print all my questions
                console.log('My Questions:', [...this.state.questions.myQuestions]);
                // test print all liked questions
                console.log('Liked Questions:', [...this.state.questions.likedQuestions]);
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
        async deleteQuestion({ commit, state }, { questionId, authorToken }) {
            try {
                await deleteQuestion(questionId, authorToken);
                commit('removeMyQuestion', questionId);
                const questions = state.questions[state.currentPresentationId].filter(q => q.id !== questionId);
                commit('setQuestions', { 
                    presentationId: state.currentPresentationId, 
                    questions 
                });
                return questionId;
            } catch (error) {
                console.error('Error deleting question:', error);
                throw error;
            }
        },
    },
};
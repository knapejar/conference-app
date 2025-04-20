import axios from 'axios';
import store from '../store';

const API_BASE = process.env.VITE_API_BASE || 'https://konference.jk9.eu/server'; //'https://konference.jk9.eu/server';

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const handleError = (error) => {
  // Check if it's a network error (server down, no internet, etc.)
  if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
    store.dispatch('toast/showOfflineWarning');
  } else if (error.response?.status && error.response.status !== 200) {
    store.dispatch('toast/showError');
  }
  console.error('API Error:', error);
  throw error;
};

export const init = async () => {
    // Initialization code if needed.
};

export const getQuestions = async (presentationId) => {
    if (!presentationId) {
        throw new Error('Presentation ID is required.');
    }
    try {
        const response = await axios.get('/questions', {
            params: { presentationId }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const createQuestion = async (presentationId, content, author = "Anonymous", authorToken = "Anonymous") => {
    if (!presentationId) {
        throw new Error('Presentation ID is required.');
    }
    if (!content || typeof content !== 'string') {
        throw new Error('Valid content is required to create a question.');
    }
    try {
        const response = await axios.post('/questions', {
            presentationId,
            content,
            author,
            authorToken
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const likeQuestion = async (questionId) => {
    if (!questionId) {
        throw new Error('Question ID is required.');
    }
    try {
        const response = await axios.post(`/questions/${questionId}/like`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const unlikeQuestion = async (questionId) => {
    if (!questionId) {
        throw new Error('Question ID is required.');
    }
    try {
        const response = await axios.post(`/questions/${questionId}/unlike`);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const deleteQuestion = async (questionId, authorToken) => {
    if (!questionId) {
        throw new Error('Question ID is required.');
    }
    if (!authorToken) {
        throw new Error('Author token is required.');
    }
    try {
        const response = await axios.delete(`/questions/${questionId}`, {
            data: { authorToken }
        });
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getPresentations = async () => {
    try {
        const response = await axios.get('/presentations');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getAnnouncements = async () => {
    try {
        const response = await axios.get('/announcements');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getPeople = async () => {
    try {
        const response = await axios.get('/people');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export const getConference = async () => {
    try {
        const response = await axios.get('/conference');
        return response.data;
    } catch (error) {
        handleError(error);
    }
};
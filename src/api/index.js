import axios from 'axios';

const API_BASE = process.env.API_BASE || 'https://konference.jk9.eu/server'; //'https://konference.jk9.eu/server';

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export const init = async () => {
    // Initialization code if needed.
};

export const getInitialUpdate = async () => {
    const response = await axios.get('/initial-update', {
        params: { }
    });
    return response.data;
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
        console.error('Error in getQuestions:', error);
        throw error;
    }
};

export const createQuestion = async (presentationId, content) => {
    if (!presentationId) {
        throw new Error('Presentation ID is required.');
    }
    if (!content || typeof content !== 'string') {
        throw new Error('Valid content is required to create a question.');
    }
    try {
        const response = await axios.post('/questions', {
            presentationId,
            content
        });
        return response.data;
    } catch (error) {
        console.error('Error in createQuestion:', error);
        throw error;
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
        console.error('Error in likeQuestion:', error);
        throw error;
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
        console.error('Error in unlikeQuestion:', error);
        throw error;
    }
};

export const deleteQuestion = async (questionId) => {
    if (!questionId) {
        throw new Error('Question ID is required.');
    }
    try {
        const response = await axios.delete(`/questions/${questionId}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteQuestion:', error);
        throw error;
    }
};
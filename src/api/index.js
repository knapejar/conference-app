import axios from 'axios';

const API_BASE = process.env.VITE_API_BASE || 'https://konference.jk9.eu/server'; //'https://konference.jk9.eu/server';

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

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
        console.error('Error in getQuestions:', error);
        throw error;
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
        console.error('Error in deleteQuestion:', error);
        throw error;
    }
};

export const getPresentations = async () => {
    try {
        const response = await axios.get('/presentations');
        return response.data;
    } catch (error) {
        console.error('Error in getPresentations:', error);
        throw error;
    }
};

export const getAnnouncements = async () => {
    try {
        const response = await axios.get('/announcements');
        return response.data;
    } catch (error) {
        console.error('Error in getAnnouncements:', error);
        throw error;
    }
};

export const getPeople = async () => {
    try {
        const response = await axios.get('/people');
        return response.data;
    } catch (error) {
        console.error('Error in getPeople:', error);
        throw error;
    }
};

export const getConference = async () => {
    try {
        const response = await axios.get('/conference');
        return response.data;
    } catch (error) {
        console.error('Error in getConference:', error);
        throw error;
    }
};
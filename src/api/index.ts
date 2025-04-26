import axios from 'axios';
import store from '../store';

const API_BASE = process.env.VITE_API_BASE || 'https://konference.jk9.eu/server';

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

interface Question {
    id: string;
    presentationId: string;
    content: string;
    author: string;
    authorToken: string;
    likes: number;
    createdAt: string;
}

interface Presentation {
    id: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    blockId: string;
    presenterId: string;
}

interface Person {
    id: string;
    name: string;
    title: string;
    bio: string;
    imageUrl: string;
    presentationId?: string;
}

interface Conference {
    name: string;
    description: string;
    welcomeImage: string;
}

interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

const handleError = (error: any): never => {
    if (error.code === 'ERR_NETWORK' || !navigator.onLine) {
        store.dispatch('toast/showOfflineWarning');
    } else if (error.response?.status && error.response.status !== 200) {
        store.dispatch('toast/showError');
    }
    console.error('API Error:', error);
    throw error;
};

export const init = async (): Promise<void> => {
    // Initialization code if needed.
};

export const getQuestions = async (presentationId: string): Promise<Question[]> => {
    if (!presentationId) {
        throw new Error('Presentation ID is required.');
    }
    try {
        const response = await axios.get('/questions', {
            params: { presentationId }
        });
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const createQuestion = async (
    presentationId: string, 
    content: string, 
    author: string = "Anonymous", 
    authorToken: string = "Anonymous"
): Promise<Question> => {
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
        return handleError(error);
    }
};

export const likeQuestion = async (questionId: string): Promise<Question> => {
    if (!questionId) {
        throw new Error('Question ID is required.');
    }
    try {
        const response = await axios.post(`/questions/${questionId}/like`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const unlikeQuestion = async (questionId: string): Promise<Question> => {
    if (!questionId) {
        throw new Error('Question ID is required.');
    }
    try {
        const response = await axios.post(`/questions/${questionId}/unlike`);
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const deleteQuestion = async (questionId: string, authorToken: string): Promise<void> => {
    if (!questionId) {
        throw new Error('Question ID is required.');
    }
    if (!authorToken) {
        throw new Error('Author token is required.');
    }
    try {
        await axios.delete(`/questions/${questionId}`, {
            data: { authorToken }
        });
    } catch (error) {
        return handleError(error);
    }
};

export const getPresentations = async (): Promise<Presentation[]> => {
    try {
        const response = await axios.get('/presentations');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getAnnouncements = async (): Promise<Announcement[]> => {
    try {
        const response = await axios.get('/announcements');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getPeople = async (): Promise<Person[]> => {
    try {
        const response = await axios.get('/people');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
};

export const getConference = async (): Promise<Conference> => {
    try {
        const response = await axios.get('/conference');
        return response.data;
    } catch (error) {
        return handleError(error);
    }
}; 
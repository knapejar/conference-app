import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = process.env.API_BASE || 'https://konference.jk9.eu/server';

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const socket = io(API_BASE, {
    path: '/server/socket.io',
    query: { deviceToken: localStorage.getItem('deviceToken') || '' }
});
  

export const init = async() => {
};

export const getDebugToken = async() => {
    const response = await axios.get(API_BASE + '/debug-get-test-token');
    localStorage.setItem('deviceToken', response.data.token);
    return response.data.token;
};

export const getInitialUpdate = async(deviceToken) => {
    const response = await axios.get(API_BASE + '/initial-update', {
        params: {
            deviceToken: deviceToken
        }
    });
    return response.data;
};

export const requestQuestions = async (presentationId) => {
    return new Promise((resolve) => {
        socket.emit('requestQuestions', {
            presentationId,
            deviceToken: localStorage.getItem('deviceToken')
        });
        socket.once('questions', (questions) => {
            resolve(questions);
        });
    });
};
export const postQuestion = async (question) => {
    socket.emit('newQuestion', question);
};
export const onNewQuestion = (callback) => {
    socket.on('newQuestion', callback);
};
export const likeQuestion = async (questionId) => {
    socket.emit('likeQuestion', {
        questionId,
        deviceToken: localStorage.getItem('deviceToken')
    });
}
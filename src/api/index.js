import axios from 'axios';
import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:3000';
//const socket = io(API_BASE);

export const init = async() => {
    axios.defaults.baseURL = 'http://localhost:3000';
    axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
    axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
};

export const getDebugToken = async() => {
    const response = await axios.get('http://localhost:3000/debug-get-test-token');
    return response.data.token;
};
export const getInitialUpdate = async(deviceToken) => {
    const response = await axios.get('http://localhost:3000/initial-update', {
        params: {
            deviceToken: deviceToken
        }
    });
    return response.data;
};


export const fetchQuestions = async (presentationId) => {
    const response = await axios.get(`${API_BASE}/presentations/${presentationId}/questions`);
    return response.data;
};

export const postQuestion = async (question) => {
    const response = await axios.post(`${API_BASE}/questions`, question);
    return response.data;
};

export const onNewQuestion = (callback) => {
    //socket.on('newQuestion', callback);
};
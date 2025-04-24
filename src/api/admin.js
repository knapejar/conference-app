import axios from 'axios';
const API_BASE = process.env.VITE_API_BASE || 'https://konference.jk9.eu/server'; //'https://konference.jk9.eu/server';

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

export const verifyAdminAccess = async (hashedPassword) => {
    try {
        const response = await axios.get(`${API_BASE}/admin/test`, {
            headers: {
                Authorization: `Bearer ${hashedPassword}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Conference related API calls
export const getConference = async () => {
    try {
        const response = await axios.get(`${API_BASE}/conference`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateConference = async (conferenceData) => {
    try {
        const formData = new FormData();
        formData.append('name', conferenceData.name);
        formData.append('description', conferenceData.description);
        if (conferenceData.welcomeImage) {
            formData.append('welcomeImage', conferenceData.welcomeImage);
        }

        const response = await axios.put(`${API_BASE}/admin/conference`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${hashedPassword}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}; 
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Helper function to hash password using Web Crypto API
const hashPassword = async (password) => {
    // Convert password to ArrayBuffer
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    
    // Hash the password using SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    
    // Convert hash to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
};

export const verifyAdminAccess = async (password) => {
    try {
        const hashedPassword = await hashPassword(password);
        const response = await axios.get(`${API_URL}/admin/test`, {
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
        const response = await axios.get(`${API_URL}/conference`);
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

        const response = await axios.put(`${API_URL}/admin/conference`, formData, {
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
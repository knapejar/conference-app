import axios from 'axios';
const API_BASE = process.env.VITE_API_BASE || 'https://konference.jk9.eu/server';

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

export const updateConference = async (conferenceData, adminPassword) => {
    try {
        const formData = new FormData();
        formData.append('name', conferenceData.name || '');
        formData.append('description', conferenceData.description || '');
        
        if (conferenceData.welcomeImage instanceof File) {
            formData.append('welcomeImage', conferenceData.welcomeImage);
        } else if (conferenceData.welcomeImageUrl) {
            formData.append('welcomeImage', conferenceData.welcomeImageUrl);
        }

        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        console.log('Sending conference data:', {
            name: conferenceData.name,
            description: conferenceData.description,
            hasImage: !!conferenceData.welcomeImage,
            hasImageUrl: !!conferenceData.welcomeImageUrl
        });

        const response = await axios.put(`${API_BASE}/admin/conference`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in updateConference:', error);
        throw error;
    }
};

// Conference Blocks API calls
export const createBlock = async (blockData, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.post(`${API_BASE}/admin/presentations/blocks`, blockData, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in createBlock:', error);
        throw error;
    }
};

export const updateBlock = async (blockId, blockData, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.put(`${API_BASE}/admin/presentations/blocks/${blockId}`, blockData, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in updateBlock:', error);
        throw error;
    }
};

export const deleteBlock = async (blockId, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.delete(`${API_BASE}/admin/presentations/blocks/${blockId}`, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in deleteBlock:', error);
        throw error;
    }
};

// Presentation API calls
export const createPresentation = async (presentationData, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.post(`${API_BASE}/admin/presentations`, presentationData, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in createPresentation:', error);
        throw error;
    }
};

export const updatePresentation = async (presentationId, presentationData, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.put(`${API_BASE}/admin/presentations/${presentationId}`, presentationData, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in updatePresentation:', error);
        throw error;
    }
};

export const deletePresentation = async (presentationId, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.delete(`${API_BASE}/admin/presentations/${presentationId}`, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in deletePresentation:', error);
        throw error;
    }
};

// Presenter API calls
export const createPresenter = async (presenterData, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.post(`${API_BASE}/admin/people`, presenterData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in createPresenter:', error);
        throw error;
    }
};

export const updatePresenter = async (presenterId, presenterData, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.put(`${API_BASE}/admin/people/${presenterId}`, presenterData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in updatePresenter:', error);
        throw error;
    }
};

export const deletePresenter = async (presenterId, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.delete(`${API_BASE}/admin/people/${presenterId}`, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in deletePresenter:', error);
        throw error;
    }
};

export const deleteQuestion = async (questionId, adminPassword) => {
    try {
        if (!adminPassword) {
            throw new Error('Admin password not found');
        }

        const response = await axios.delete(`${API_BASE}/admin/questions/${questionId}`, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error in deleteQuestion:', error);
        throw error;
    }
};

export const updateQuestion = async (questionId, data, adminPassword) => {
    if (!adminPassword) {
        throw new Error('Admin password is required');
    }
    try {
        const response = await axios.put(`${API_BASE}/admin/questions/${questionId}`, data, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating question:', error);
        throw error;
    }
};

export const createAnnouncement = async (announcementData, adminPassword) => {
    if (!adminPassword) {
        throw new Error('Admin password is required');
    }
    try {
        const response = await axios.post(`${API_BASE}/admin/announcements`, announcementData, {
            headers: {
                'Authorization': `Bearer ${adminPassword}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating announcement:', error);
        throw error;
    }
}; 
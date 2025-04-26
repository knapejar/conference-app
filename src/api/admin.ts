import axios from 'axios';

const API_BASE = process.env.VITE_API_BASE || 'https://konference.jk9.eu/server';

axios.defaults.baseURL = API_BASE;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

interface ConferenceData {
    name?: string;
    description?: string;
    welcomeImage?: File | string;
    welcomeImageUrl?: string;
}

interface BlockData {
    [key: string]: any;
}

interface PresentationData {
    [key: string]: any;
}

interface PresenterData {
    [key: string]: any;
}

interface AnnouncementData {
    [key: string]: any;
}

export const verifyAdminAccess = async (hashedPassword: string): Promise<any> => {
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

export const getConference = async (): Promise<any> => {
    try {
        const response = await axios.get(`${API_BASE}/conference`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateConference = async (conferenceData: ConferenceData, adminPassword: string): Promise<any> => {
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

export const createBlock = async (blockData: BlockData, adminPassword: string): Promise<any> => {
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

export const updateBlock = async (blockId: string, blockData: BlockData, adminPassword: string): Promise<any> => {
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

export const deleteBlock = async (blockId: string, adminPassword: string): Promise<any> => {
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

export const createPresentation = async (presentationData: PresentationData, adminPassword: string): Promise<any> => {
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

export const updatePresentation = async (presentationId: string, presentationData: PresentationData, adminPassword: string): Promise<any> => {
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

export const deletePresentation = async (presentationId: string, adminPassword: string): Promise<any> => {
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

export const createPresenter = async (presenterData: PresenterData, adminPassword: string): Promise<any> => {
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

export const updatePresenter = async (presenterId: string, presenterData: PresenterData, adminPassword: string): Promise<any> => {
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

export const deletePresenter = async (presenterId: string, adminPassword: string): Promise<any> => {
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

export const deleteQuestion = async (questionId: string, adminPassword: string): Promise<any> => {
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

export const updateQuestion = async (questionId: string, data: any, adminPassword: string): Promise<any> => {
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

export const createAnnouncement = async (announcementData: AnnouncementData, adminPassword: string): Promise<any> => {
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
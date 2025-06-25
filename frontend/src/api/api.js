import axios from 'axios';

export const registerUser = async (baseUrl, username, password) => {
    const response = await axios.post(`${baseUrl}/api/register`, { username, password });
    return response.data;
};

export const loginUser = async (baseUrl, username, password) => {
    const response = await axios.post(`${baseUrl}/api/login`, { username, password });
    return response.data;
};

export const makeAppointment = async (baseUrl, token, appointmentData) => {
    const response = await axios.post(`${baseUrl}/api/appointments`, appointmentData, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const getUserAppointments = async (baseUrl, token) => {
    const response = await axios.get(`${baseUrl}/api/user-appointments`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const cancelAppointment = async (baseUrl, token, appointmentId) => {
    const response = await axios.delete(`${baseUrl}/api/appointments/${appointmentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
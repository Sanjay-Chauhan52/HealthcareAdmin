import axios from 'axios';

const API_BASE_URL = '/api';

// Patients API
export const getPatients = () => axios.get(`${API_BASE_URL}/patients`);
export const getPatient = (id) => axios.get(`${API_BASE_URL}/patients/${id}`);
export const createPatient = (data) => axios.post(`${API_BASE_URL}/patients`, data);
export const updatePatient = (id, data) => axios.put(`${API_BASE_URL}/patients/${id}`, data);
export const deletePatient = (id) => axios.delete(`${API_BASE_URL}/patients/${id}`);

// Appointments API
export const getAppointments = () => axios.get(`${API_BASE_URL}/appointments`);
export const getAppointment = (id) => axios.get(`${API_BASE_URL}/appointments/${id}`);
export const createAppointment = (data) => axios.post(`${API_BASE_URL}/appointments`, data);
export const updateAppointment = (id, data) => axios.put(`${API_BASE_URL}/appointments/${id}`, data);
export const deleteAppointment = (id) => axios.delete(`${API_BASE_URL}/appointments/${id}`);

// Checkups API
export const getCheckups = () => axios.get(`${API_BASE_URL}/checkups`);
export const getCheckup = (id) => axios.get(`${API_BASE_URL}/checkups/${id}`);
export const getCheckupsByPatient = (patientId) => axios.get(`${API_BASE_URL}/checkups/patient/${patientId}`);
export const createCheckup = (data) => axios.post(`${API_BASE_URL}/checkups`, data);
export const updateCheckup = (id, data) => axios.put(`${API_BASE_URL}/checkups/${id}`, data);
export const deleteCheckup = (id) => axios.delete(`${API_BASE_URL}/checkups/${id}`);

// Dashboard API
export const getDashboardStats = () => axios.get(`${API_BASE_URL}/dashboard/stats`);
export const getAppointmentsChart = () => axios.get(`${API_BASE_URL}/dashboard/appointments-chart`);


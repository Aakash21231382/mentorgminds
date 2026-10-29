import axiosInstance from './axiosInstance';

export const leadsApi = {
  submitCallback:  (data) => axiosInstance.post('/leads/callback',  data),
  submitAdmission: (data) => axiosInstance.post('/leads/admission', data),
};

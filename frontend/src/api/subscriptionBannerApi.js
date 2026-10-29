import axiosInstance from './axiosInstance';

export const subscriptionBannerApi = {
  getSubscriptionBanner: () => axiosInstance.get('/subscription-banner'),
};

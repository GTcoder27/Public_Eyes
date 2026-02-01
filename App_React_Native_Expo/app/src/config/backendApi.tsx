import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const backendApi = axios.create({
  baseURL: 'http://10.211.223.4:8080/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

backendApi.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log("No token found in SecureStore");
      }
    } catch (error) {
      console.error('Error fetching token', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default backendApi;
import axios from 'axios';
const backendApi = axios.create({
  baseURL: 'http://10.211.223.4:8080/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default backendApi;
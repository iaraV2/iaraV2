import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/iara', // O prefixo que definimos no app.js do back
});

export default api;
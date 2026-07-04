import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5273/api', // ✅ Porta correta 5273
  timeout: 8000
});

export default api;
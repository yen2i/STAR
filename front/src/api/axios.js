import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // 변경 시 여기만 수정
  withCredentials: true
});

export default instance;
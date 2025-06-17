import api from '../api/instance';

const instance = api.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api`,
  withCredentials: true,
});

export default instance;
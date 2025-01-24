import Vue from "vue"
import axios from "axios"
import store from '@/store';

axios.defaults.baseURL = "https://dev-api.aiscreen.io/api/v1"
axios.interceptors.request.use(
    (config) => {
      const token = store.state.profile.token
  
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
  
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

Vue.prototype.$axios = axios
// import axios from 'axios';
// import { HOST_API } from '../config';

// const axiosInstance = axios.create({
//   baseURL: HOST_API,
// });

// const token =
//   window.self === window.top
//     ? window.location.pathname.includes('/bo')
//       ? localStorage.getItem('accessTokenBoIClosed')
//       : localStorage.getItem('accessTokenIClosed')
//     : null;

// axiosInstance.interceptors.request.use(
//   (config) => {
//     try {
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//       }
//       return config;
//     } catch (error) {
//       console.log('[AXIOS]', 'REQUEST', JSON.stringify({ error }));
//       return config;
//     }
//   },
//   (error) => Promise.reject(error.response)
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Logging Out User if Status is 401
//     if (error?.response?.status === 401) {
//       if (!error?.response?.config?.url?.includes("rolePermissions")) {
//         handleExpireToken()
//       }
//     }

//     if (error.code == 'ERR_NETWORK') {
//       showNetworkErrorToast();
//     }
//     return Promise.reject((error.response && error.response.data) || 'Something went wrong');
//   }
// );

// export default axiosInstance;

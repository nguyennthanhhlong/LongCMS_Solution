// import axios from 'axios';

// const axiosClient = axios.create({
//     baseURL: 'http://localhost:5151/api',
//     headers: {
//         'Content-Type': 'application/json',
//     },
//     timeout: 10000,
// });

// // Can thiệp bóc tách dữ liệu JSON tự động khi nhận phản hồi từ Server
// axiosClient.interceptors.response.use(
//     (response) => {
//         return response.data;
//     },
//     (error) => {
//         console.error('Lỗi kết nối API:', error.message);
//         return Promise.reject(error);
//     }
// );

// export default axiosClient;
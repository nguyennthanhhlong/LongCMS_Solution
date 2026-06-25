import axios from 'axios';

// Cấu hình URL cơ sở cho tất cả các API
// Trong dự án này, Backend chạy ở cổng 5000 hoặc theo cấu hình
const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5151/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Thêm interceptor nếu cần đính kèm token sau này
export default api;

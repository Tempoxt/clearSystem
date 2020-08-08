const axiosRestClient = require('axios-rest-client')
const api = axiosRestClient.default({
    baseUrl: process.env.VUE_APP_BASEAPI,
    timeout: 15000, // 请求超时时间
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
})
api.axios().interceptors.request.use(function (config) {
    return config;
}, function (error) {
    return Promise.reject(error);
});

api.endpoint('account', {
    login: {
        url: 'login',
        method: 'get'
    }
})

export default api

import axios from "axios";

const api = axios.create({
    baseURL: "https://eventsphere-server-mfdb.onrender.com"
})                  // It creates a Axios Instance

api.interceptors.request.use((request) => {
    request.headers.Retam = "Front_End_Course";             // adding here...all request will by default take this header
    return request
}, (error) => { })

api.interceptors.response.use((response)=>{
    return response.data.data                               // Response Destructuring is happening here....
}, (error) => { })


export default api;
// Now everywhere we can use api.get rather than axios.get

// Find common or base url?
// api.interceptors.request.use(onFullfilled, onReject)
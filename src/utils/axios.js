import axios from "axios";

axios.defaults.baseURL = "http://localhost:8080"; // your backend
axios.defaults.withCredentials = true;

export default axios;

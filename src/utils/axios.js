import axios from "axios";

axios.defaults.baseURL = "https://vercel-backend-xi-jade.vercel.app"; // your backend
axios.defaults.withCredentials = true;

export default axios;

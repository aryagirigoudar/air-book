import axios from "axios";
import { API_BASE_URL } from "./constants";

//Create a axios client
const client = axios.create({
//   withCredentials: true,
  //baseUrl
  baseURL: API_BASE_URL,
  //headers
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default client;
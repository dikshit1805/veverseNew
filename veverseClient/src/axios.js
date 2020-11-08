import axios from "axios";
const instance = axios.create ({
  baseURL:"https://firstinstance-dot-veversenew.uc.r.appspot.com/"
  //baseURL: "http://localhost:8080/"
});

export default instance;
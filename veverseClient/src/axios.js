import axios from "axios";
const instance = axios.create ({
  // baseURL:"https://firstinstance-dot-veversenew.uc.r.appspot.com/"
  crossdomain:"true",
  baseURL:"https://us-central1-veversedikshit.cloudfunctions.net"
  //baseURL: "http://localhost:8080/"
  // baseURL : "https://uploadvideo-dot-veversedikshit.uc.r.appspot.com/"
});

export default instance;

// recommendation 
// searchvideo
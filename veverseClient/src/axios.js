import axios from "axios";
const instance = axios.create ({
  // baseURL:"https://firstinstance-dot-veversenew.uc.r.appspot.com/"
  crossdomain:"true",
  baseURL:"https://us-central1-veversedikshit.cloudfunctions.net"
  //baseURL: "http://localhost:8080/"
});

export default instance;

// recommendation 
// searchvideo
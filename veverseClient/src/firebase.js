// import firebase from "firebase";
// import "firebase/storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyBh63k3zdFH0TVavgG-TPRxD5bUX872srk",
//   authDomain: "veversedikshit.firebaseapp.com",
//   databaseURL: "https://veversedikshit.firebaseio.com",
//   projectId: "veversedikshit",
//   storageBucket: "veversestorage",
//   messagingSenderId: "487479074983",
//   appId: "1:487479074983:web:c609cc047f1f5ae22a7b82"
// };


// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth()

// export {auth};


import firebase from "firebase/app"
import "firebase/auth"

const app = firebase.initializeApp({
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_APP_ID
  apiKey: "AIzaSyBh63k3zdFH0TVavgG-TPRxD5bUX872srk",
  authDomain: "veversedikshit.firebaseapp.com",
  databaseURL: "https://veversedikshit.firebaseio.com",
  projectId: "veversedikshit",
  storageBucket: "veversestorage",
  messagingSenderId: "487479074983",
  appId: "1:487479074983:web:c609cc047f1f5ae22a7b82"
})

export const auth = app.auth()
export default app





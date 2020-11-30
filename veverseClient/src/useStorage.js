import React, {useState, useEffect} from 'react'
import  firebase  from 'firebase';

const useStorage = (path, file) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null); 
  
  useEffect(() => {
    const storageRef = firebase.storage().ref(path);
    storageRef.put(file).on('state_changed', (snap)=>{
      let percentage = (snap.bytesTransferred /snap.totalBytes) * 100;
      setProgress(percentage);
    },
    (err) => {
      setError(err);
    }, async () => {
      const url = await storageRef.getDownloadURL();
      setUrl();
    }
    )
  }, [file, path])
  
  return {progress, url, error};
}

export default useStorage;
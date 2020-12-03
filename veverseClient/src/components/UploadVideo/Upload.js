import React, {useState} from 'react'
import firebase from 'firebase';
import "./Upload.css"
import { Button, Alert } from "react-bootstrap"
import axios from "../../axios" 
import { useEffect } from 'react';
import { useHistory } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

function Upload() {
  const Catogory = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
  ]
  // const [progress, setProgess] = useState(false);
  const [error, setError] = useState(null)
  const [videoUploadError, setVideoUploadError] = useState(false)
  const [imageUploadError, setImageUploadError] = useState(false)
  const [title, setTitle] = useState("")
  const [videoName, setVideoName] = useState([]);
  const [thumbnailName, setThumbnailName] =  useState([]);
  const [tags, setTags] = useState("")
  const [category, setCategory] = useState("Film & Animation")
  const [description, setDescription] = useState("")
  const [videoProgress, setVideoProgress ]= useState(0);
  const [imgProgress, setImgProgress ] = useState(0);
  const [videoID, setVideoID] = useState(0);
  const [videoURL, setVideoURL] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false)
  const history = useHistory()
  const {currentUser} = useAuth()



  const handleVideoChange = e => {
    if (e.target.files[0]) {
      setVideoName(e.target.files[0]);
    }
  };
  const handleChangeTags = ( event ) => {
    setTags(event.currentTarget.value)
  };
  
  const handleThumbnailChange = e => {
    if (e.target.files[0]) {
      setThumbnailName(e.target.files[0]);
    }
  };

  const handleChangeTitle = ( event ) => {
    setTitle(event.currentTarget.value)
  }

  const handleChangedescription = (event) => {
    setDescription(event.currentTarget.value)
  }

  const handleChangeTwo = (event) => {
    setCategory(event.currentTarget.value)
  }

  useEffect(() => {
    if(videoProgress === 100 && imgProgress === 100) {
      if(videoURL !== "" && imageURL !== "") {
        axios.put("/uploadvideo/update", {"videoID":`${videoID}`, "videoPath":`${videoURL}`,"thumbNailPath":`${imageURL}` })
        .then( update => {
          if(update.data.success){
            alert("Upload Successfull");
            history.push("/")
          } else {
            //In case the update failed then we delete the entire row from the sql
            axios.delete("/uploadvideo/delete", {"videoID": `${videoID}` });
            //Pending task is to delete it from the storage
            setError("Failed to update the new video and thumbnail URL");
          }
        });
      }
    }
  }, [videoProgress, videoURL, history, videoID, imageURL, imgProgress])

  useEffect(() => {
    if(videoUploadError || imageUploadError) {
      axios.delete("/uploadvideo/delete", {
        "videoID": `${videoID}`
      });
      setError("Error in videoUpload or Image Upload");
    }
  }, [videoUploadError, videoID, imageUploadError])
  
  useEffect(() => {
    if(error) {
      axios.delete("/uploadvideo/delete", {
        "videoID": `${videoID}`
      });
      setLoading(false)
    }
  }, [error, videoID])

  useEffect(() => {
    if(loading) {
      firebase.storage().ref(`Video/${videoID}/${videoName.name}`).put(videoName).on("state_changed",snap =>{
        const videoProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setVideoProgress(videoProgress);
        },err => {
          setVideoUploadError(true)
        }, () => {
          firebase.storage().ref(`Video/${videoID}`).child(videoName.name).getDownloadURL().then(url => {
          setVideoURL(url)
        });
      });

      firebase.storage().ref(`Video/${videoID}/${thumbnailName.name}`).put(thumbnailName).on("state_changed",snap =>{
        const imgProgress = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
          setImgProgress(imgProgress);
        },err => {
          setImageUploadError(true)
        }, () => {
          firebase.storage().ref(`Video/${videoID}`).child(thumbnailName.name).getDownloadURL().then(url => {
          setImageURL(url)
        })
      });
    }
  },[ videoID, loading,videoName, thumbnailName ]);


  const handleSubmit = async() => {
    if (title === "" || category===""  || tags==="" || description==="" || videoName==="" || thumbnailName==="") {
      return alert(category)
    }
    setLoading(true)
    setError(null)
    setImageURL("")
    setVideoURL("")
    async function fetchData() {
        //First make a entry in the SQL to get a Video ID, the videopath and thumbnail path
        //are dummy and needs to be updated later 
        //forming requesting
        const requestOptions = {
          "title":`${title}`,
          "description":`${description}`,
          "views":"0",
          "likes":"0",
          "categories":`${category}`,
          "tags":`${tags}`,
          "user":`${currentUser.email}`
        }
        try {
          let temp = await axios.post('/uploadvideo/', requestOptions)
          if(temp.data.success){
            setVideoID(temp.data.videoID)
          }
          else{
            alert(temp.data.error)
          }
        } catch(error) {
          alert(error)
        };
    }
    //Upload the video and get the download link
    fetchData()
  }  

  return (
    <div className="upload">
      <form>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="form-group">
        <label >Title</label>
        <input type="text"  onChange={handleChangeTitle}
                 value={title} className="form-control"   placeholder="Enter title" required  />
        </div>

        <div className="form-group">
        <label >Tags</label>
        <input type="text"  onChange={handleChangeTags}
                 value={tags} className="form-control"   placeholder="Enter comma separated tags" required  />
        </div>

        <div className="form-group">
        <label >Description</label>
        <input type="text"  onChange={handleChangedescription}
                 value={description} className="form-control"   placeholder="Enter description" required  />
        </div>

        <div className="form-group">
        <label >Category</label>
        <select className="form-control" id="exampleFormControlSelect1" onChange={handleChangeTwo}>
        {Catogory.map((item, index) => (
              <option key={index} value={item.label}>{item.label}</option>
          ))}
        </select>
        </div>
        
        <div className="form-group">
          <label >video File</label>
          <input type="file" className="form-control-file" id="exampleFormControlFile1" accept='video/*' onChange={handleVideoChange}/>
        </div>
        <progress value={videoProgress} max="100" />
        <br/>

        <div className="form-group">
          <label >thumbnail File</label>
          <input type="file" className="form-control-file" id="exampleFormControlFile2" accept='image/*' onChange={handleThumbnailChange}/>
        </div>
        <progress value={imgProgress} max="100" />
            <br/>
      </form>
      <Button disabled={loading}  className="w-100" type="submit" onClick={handleSubmit}> Upload </Button>
    </div>
  );
};

export default Upload

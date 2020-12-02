import React, {useRef, useState} from 'react'
import firebase from 'firebase';
import "./Upload.css"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Typography } from '@material-ui/core';
import axios from "../../axios" 

function Upload(){
  const Catogory = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
  ]
  const [progress, setProgess] = useState(false);
  const [error, setError] = useState(null)
  const [title, setTitle] = useState("")
  const [videoName, setVideoName] = useState([]);
  const [thumbnailName, setThumbnailName] =  useState([]);
  const [tags, setTags] = useState("")
  const [category, setCategory] = useState("Film & Animation")
  const [description, setDescription] = useState("")
  const [videoProgress, setVideoProgress ]= useState(0);
  const [imgProgress, setImgProgress] = useState(0);
  const [videoID, setVideoID] = useState(0);
  
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
    console.log(event.currentTarget.value)

    setDescription(event.currentTarget.value)
}

const handleChangeTwo = (event) => {
  setCategory(event.currentTarget.value)
}

  const handleSubmit = async() => {
    if (title === "" || category===""  || tags==="" || description==="" || videoName==="" || thumbnailName==="") {
      return alert(category)
    }
    const videoURL =""
    const imageURL = ""
    async function fetchData() {
        //First make a entry in the SQL to get a Video ID, the videopath and thumbnail path
        //are dummy and needs to be updated later 
        //forming requesting
        const requestOptions =
        {
          "title":`${title}`,
          "description":`${description}`,
          "views":"0",
          "likes":"0",
          "categories":`${category}`,
          "tags":`${tags}`,
          "user":"madhura.hegde@test.com"
        }
        
        
        console.log(requestOptions);
        var config = {
          headers: {'Access-Control-Allow-Origin': '*'}
        };
        let temp=await axios.post('/uploadvideo/', requestOptions,config)
            setVideoID(temp)
            alert("videoID is",videoID)
          console.log(videoID)
    }
    //Upload the video and get the download link
    
    
      fetchData().then(alert("videoIS is",videoID))
      try{
        await firebase.storage().ref(`Video/${videoID}/${videoName.name}`).put(videoName);
        await firebase.storage().ref(`Video/${videoID}/${thumbnailName.name}`).put(thumbnailName);
        videoURL = await firebase.storage().ref(`Video/${videoID}`).child(videoName.name).getDownloadURL()
        imageURL = await firebase.storage().ref(`Video/${videoID}`).child(thumbnailName.name).getDownloadURL()
      }catch(err) {
        const deleteTask = await  axios.delete("/uploadvideo/delete", {
                          "videoID": `${videoID}`
                        });
        alert('some error in uploading')

      }
      
  }  
      //   
      //   //This can be used to show the progess.
      //   uploadVideoTask.on("state_changed", snapshot => {
      //       const videoProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      //       setVideoProgress(videoProgress);
      //     }, 
      //     async error => {
      //       //In case the upload of the video failed, we delete the sql entry
      //       const deleteTask = await  axios.delete("/uploadvideo/delete", {
      //         "videoID": `${tempVideoID.data.videoID}`
      //       });
      //       console.log(error);
      //       alert("Failed to Upload the video ");
      //       setError(true);
      //       return {
      //         "success":false
      //       };
      //     },
      //    () => {
      //       //Upon successfully uploading the video we go ahead with uploading the image
      //       firebase.storage().ref(`Video/${tempVideoID.data.videoID}`).child(videoName.name).getDownloadURL().then(async VideoUrl => {
      //         if(thumbnailName) {
      //           //Image Upload
      //           const uploadImageTask = firebase.storage().ref(`Video/${tempVideoID.data.videoID}/${thumbnailName.name}`).put(thumbnailName);
      //           //This can be used to show the progess.
      //           uploadImageTask.on("state_changed", snapshot => {
      //             const imgProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      //             setImgProgress(imgProgress);
      //           }, 
      //           async error => {
      //             //Even though thumbnail failed, we proceed, because the video was successfully uploaded.
      //             console.error(error);
      //             const update = await  axios.put("/uploadvideo/update", {
      //               "videoID":`${tempVideoID.data.videoID}`,
      //               "videoPath":`${VideoUrl}`,
      //               "thumbNailPath":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
      //             })
      //             if(update.data.success){
      //               alert("Failed to upload Thumbnail");
      //               return {
      //                 "success":true
      //               };
      //             }
      //             else {
      //               //In case the update failed then we delete the entire row from the sql
      //               const deleteTask = await  axios.delete("/uploadvideo/delete", {
      //                 "videoID": `${tempVideoID.data.videoID}`
      //               });

      //               //Pending task is to delete it from the storage
                    
      //               alert("Failed to update the new video and thumbnail URL")
      //               setError(true);
      //               return {
      //                 "success":false
      //               };
      //             }
      //           },
      //           () => {
      //             firebase.storage().ref(`Video/${tempVideoID.data.videoID}`).child(thumbnailName.name).getDownloadURL().then(async thumbnailUrl => {
      //                 const update = await  axios.put("/uploadvideo/update", {
      //                   "videoID":`${tempVideoID.data.videoID}`,
      //                   "videoPath":`${VideoUrl}`,
      //                   "thumbNailPath":`${thumbnailUrl}`
      //               })
      //               if(update.data.success){
      //                 alert("Upload Successfull");
      //                 return {
      //                   "success":true
      //                 };
                      
      //               }
      //               else {
      //                 //In case the update failed then we delete the entire row from the sql
      //                 const deleteTask = await  axios.delete("/uploadvideo/delete", {
      //                   "videoID": `${tempVideoID.data.videoID}`
      //                 });

      //                 //Pending task is to delete it from the storage

      //                 alert("Failed to update the new video and thumbnail URL")
      //                 setError(true);
      //                 return {
      //                   "success":false
      //                 };
      //               } 
      //             });
      //           }
      //         );
      //       }
      //       });
      //     }
      //   );
      // }
      

      // );
  


  return (
    <div className="upload">
      <form>
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
    <Button className="w-100" type="submit" onClick={handleSubmit}>
              Upload
            </Button>
     
    </div>
  );
};

export default Upload

import React, {useRef, useState} from 'react'
import firebase from 'firebase';
import "./Upload.css"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Typography } from '@material-ui/core';
import axios from "../../axios" 

const Upload = () => {
  const [progress, setProgess] = useState(false);
  const [error, setError] = useState(null)
  const titleRef = useRef()
  const [videoName, setVideoName] = useState(null);
  const [thumbnailName, setThumbnailName] =  useState(null);
  const tags = useRef()
  const category = useRef()
  const [videoProgress, setVideoProgress ]= useState(0);
  const [imgProgress, setImgProgress] = useState(0);

  const handleVideoChange = e => {
    if (e.target.files[0]) {
      setVideoName(e.target.files[0]);
    }
  };
  
  const handleThumbnailChange = e => {
    if (e.target.files[0]) {
      setThumbnailName(e.target.files[0]);
    }
  };


  const handleSubmit = () => {
      async function fetchData() {
        //First make a entry in the SQL to get a Video ID, the videopath and thumbnail path
        //are dummy and needs to be updated later 
        const tempVideoID = await axios.post("/uploadvideo/", {
          "title":`${titleRef}`,
          "description" : "",
          "category": `${category}`,
          "emailID":"dikshit.nagaraj@test.com"
        }).catch(error => {
          alert(error);
        });
        console.log(tempVideoID)
        //Failed to get the TempVideoID
        if(!tempVideoID.data.success) {
            return tempVideoID.data;
        }

        //Upload the video and get the download link
        const uploadVideoTask = firebase.storage().ref(`Video/${tempVideoID.data.videoID}/${videoName.name}`).put(videoName);
        //This can be used to show the progess.
        uploadVideoTask.on("state_changed", snapshot => {
            const videoProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setVideoProgress(videoProgress);
          }, 
          async error => {
            //In case the upload of the video failed, we delete the sql entry
            const deleteTask = await  axios.delete("/uploadvideo/delete", {
              "videoID": `${tempVideoID.data.videoID}`
            });
            console.log(error);
            alert("Failed to Upload the video ");
            setError(true);
            return {
              "success":false
            };
          },
         () => {
            //Upon successfully uploading the video we go ahead with uploading the image
            firebase.storage().ref(`Video/${tempVideoID.data.videoID}`).child(videoName.name).getDownloadURL().then(async VideoUrl => {
              if(thumbnailName) {
                //Image Upload
                const uploadImageTask = firebase.storage().ref(`Video/${tempVideoID.data.videoID}/${thumbnailName.name}`).put(thumbnailName);
                //This can be used to show the progess.
                uploadImageTask.on("state_changed", snapshot => {
                  const imgProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                  setImgProgress(imgProgress);
                }, 
                async error => {
                  //Even though thumbnail failed, we proceed, because the video was successfully uploaded.
                  console.error(error);
                  const update = await  axios.put("/uploadvideo/update", {
                    "videoID":`${tempVideoID.data.videoID}`,
                    "videoPath":`${VideoUrl}`,
                    "thumbNailPath":"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/480px-No_image_available.svg.png"
                  })
                  if(update.data.success){
                    alert("Failed to upload Thumbnail");
                    return {
                      "success":true
                    };
                  }
                  else {
                    //In case the update failed then we delete the entire row from the sql
                    const deleteTask = await  axios.delete("/uploadvideo/delete", {
                      "videoID": `${tempVideoID.data.videoID}`
                    });

                    //Pending task is to delete it from the storage
                    
                    alert("Failed to update the new video and thumbnail URL")
                    setError(true);
                    return {
                      "success":false
                    };
                  }
                },
                () => {
                  firebase.storage().ref(`Video/${tempVideoID.data.videoID}`).child(thumbnailName.name).getDownloadURL().then(async thumbnailUrl => {
                      const update = await  axios.put("/uploadvideo/update", {
                        "videoID":`${tempVideoID.data.videoID}`,
                        "videoPath":`${VideoUrl}`,
                        "thumbNailPath":`${thumbnailUrl}`
                    })
                    if(update.data.success){
                      alert("Upload Successfull");
                      return {
                        "success":true
                      };
                      
                    }
                    else {
                      //In case the update failed then we delete the entire row from the sql
                      const deleteTask = await  axios.delete("/uploadvideo/delete", {
                        "videoID": `${tempVideoID.data.videoID}`
                      });

                      //Pending task is to delete it from the storage

                      alert("Failed to update the new video and thumbnail URL")
                      setError(true);
                      return {
                        "success":false
                      };
                    } 
                  });
                }
              );
            }
            });
          }
        );
      }
      fetchData().then(result=>{
        alert( result);
        // setProgess(result.success)
      }).catch(err => {
        console.log(err)
      }

      );
    }

  return (
    <div className="upload">
     
      <Card className="card">
        <Card.Body>
          <h2 className="text-left mb-4">Upload</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="titleRef">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" ref={titleRef} required />
            </Form.Group>
            <Form.Group id="tags">
              <Form.Label>Tags</Form.Label>
              <Form.Control type="text" ref={tags} required />
            </Form.Group>
            <Form.Group id="category">
              <Form.Label>Category</Form.Label>
              <Form.Control type="text" ref={category} required />
            </Form.Group>
            <Form.Group id="category">
              <Form.Label>Video</Form.Label>
              <Form.Control type="file" onChange={handleVideoChange} required />
            </Form.Group>
            <progress value={videoProgress} max="100" />
            <br/>
            <Form.Group id="category">
              <Form.Label>Thumbnail</Form.Label>
              <Form.Control type="file" onChange={handleThumbnailChange} required />
            </Form.Group>
            <progress value={imgProgress} max="100" />
            <br/>
            <Button className="w-100" type="submit">
              Upload
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Upload

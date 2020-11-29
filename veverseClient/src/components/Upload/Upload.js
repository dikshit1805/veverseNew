import React, {useRef, useState} from 'react'
import firebase from 'firebase';
import "./Upload.css"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { Typography } from '@material-ui/core';


const Upload = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState("");
  const titleRef = useRef()
  const videoName = useRef()
  const thumbnailName = useRef()
  const tags = useRef()
  const category = useRef()
  const videoProgress = useRef(0)
  const imgProgress = useRef(0)
  const [error, setError] = useState("")


  const handleSubmit = () => {
      async function fetchData() {
        const request = await  axios.post("/uploadvideo/", {
          "title":titleRef,
          "description" : "",
          "category": "pop",
          "emailID":"dikshit.nagaraj@test.com"
        });
        return(request.data.results);
      }
      fetchData().then(result=>{
        console.log(searchkey, result);
        setSearchResult(result)
      });
    console.log(titleRef)
    console.log(tags)
    console.log(category)
    console.log(videoName)
    console.log(thumbnailName)
    const uploadVideoTask = firebase.storage().ref(`Video/${image.name}`).put(image);
    const uploadImageTask = firebase.storage().ref(`Video/${image.name}`).put(image);
    uploadVideoTask.on("state_changed",
      snapshot => {
        videoProgress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      error => {alert(error);},
      () => {
        firebase.storage().ref("images").child(image.name).getDownloadURL().then(url => {
            setUrl(url);
        });
      }
    );
  };

  console.log("image: ", image);

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
              <Form.Control type="file" ref={videoName} required />
            </Form.Group>
            <Form.Group id="category">
              <Form.Label>Thumbnail</Form.Label>
              <Form.Control type="file" ref={thumbnailName} required />
            </Form.Group>
            <progress value={progress} max="100" />
            <br/>
            <Button className="w-100" type="submit">
              Upload
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {url}
    </div>
  );
};

export default Upload

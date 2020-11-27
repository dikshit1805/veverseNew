import React, { useState, useEffect} from 'react'
import { Typography, Button, Form, message, Input } from 'antd';
import Dropzone from 'react-dropzone';
//import { useSelector } from "react-redux";
import "./UploadVideo.css"
// import axios from "../../axios";
import axios from "axios";
const { Title } = Typography;


const Catogory = [
    { value: 0, label: "Film & Animation" },
    { value: 0, label: "Autos & Vehicles" },
    { value: 0, label: "Music" },
    { value: 0, label: "Pets & Animals" },
    { value: 0, label: "Sports" },
]

function UploadVideo() {
    const user =`dikshit.nagaraj@test.com` //useSelector(state => state.user);
    const [title, setTitle] = useState("");
    const [description, setdescription] = useState("");
    const [Categories, setCategories] = useState("Film & Animation")
    const [videoFile, setVideoFile] = useState([]);
    const [thumbNailFile, setThumbNailFile] = useState([]);
    const [ videoPath, setVideoPath] = useState("");
    const [imagePath, setImagePath] = useState("../public/logo.png");
    const handleChangeTitle = ( event ) => {
        setTitle(event.currentTarget.value)
    }

    const handleChangedescription = (event) => {
        console.log(event.currentTarget.value)

        setdescription(event.currentTarget.value)
    }

    const handleChangeTwo = (event) => {
        setCategories(event.currentTarget.value)
    }

    const onSubmit = async() => {
        

        if (title === "" || Categories === "" || videoFile === "" ||
            description === "" || thumbNailFile === "") {
            return alert('Please first fill all the fields')
        }
        var date= new Date();
        const filesToBeUploaded =[];
        filesToBeUploaded.push(videoFile);
        console.log("attaching",filesToBeUploaded);
        filesToBeUploaded.push(thumbNailFile);
        console.log("attaching",filesToBeUploaded);
        var dateString=date.getFullYear()+"-"+date.getMonth()+"-"+date.getDate()+" "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()
        console.log(dateString);
        const requestOptions =new FormData();
        requestOptions.append("user",user);
        requestOptions.append("title",title);
        requestOptions.append("description",description);
        requestOptions.append("date",dateString);
        requestOptions.append("views","0");
        requestOptions.append("likes","0");
        requestOptions.append("categories",Categories);
        requestOptions.append("file",filesToBeUploaded[0]);
        requestOptions.append("file",filesToBeUploaded[1]);
        
        
        console.log("request" ,requestOptions);
        var config = {
            headers: {'Access-Control-Allow-Origin': '*'}
        };
        await axios.post('https://uploadvideo-dot-veversedikshit.uc.r.appspot.com/upload/video/save', requestOptions,config)
            .then(response => {
                if (response.data.success) {
                    setVideoPath(response.data.videoPath);
                    setImagePath(response.data.imagePath);
                    alert('video Uploaded Successfully')
                } else {
                    
                    alert(response)
                }
            })
            .catch(error=>{
                alert('some error in uploading')
                console.log(error);
            })
    }
    const onDrop =(files ) => {
        
        setVideoFile(files[0]);
        
        console.log(videoFile);
        
    }
    const onDrop2 =(files ) => {
        
        setThumbNailFile(files[0]);
        
        console.log(thumbNailFile);
    }

    return (
        <div className="UploadVideo">
        <Form onSubmit={onSubmit}>
            <div className="UploadFileBlock">
                <div className="UploadVideoFile">
            <Title  className="UploadVideoTitle"> Upload Video File</Title>
                <Dropzone 
                    onDrop={onDrop}
                    multiple={false}
                    maxSize={800000000}
                    accept={'video/*'}
                    previewsContainer={'#preview'}
                    >
                        
                    {({ getRootProps, getInputProps }) => (
                        <div className="VideoFile"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <i className="fas fa-plus"></i>

                        </div>
                    )}
                </Dropzone>
                </div>
                <div className="UploadVideoFile">
                <Title  className="UploadVideoTitle"> Upload Thumbnail File</Title>
                <Dropzone 
                    onDrop={onDrop2}
                    multiple={false}
                    maxSize={800000000}
                    accept={'image/*'}
                    previewsContainer={'#preview'}
                    >
                    {({ getRootProps, getInputProps }) => (
                        <div className="VideoFile"
                            {...getRootProps()}
                        >
                            <input {...getInputProps()} />
                            <i className="fas fa-plus"></i>

                        </div>
                    )}
                </Dropzone>
                </div>
            </div>

            <br /><br />
            <label className="UploadVideoLabel">Title</label>
            <Input className="UploadVideotexts" type="text"
                 onChange={handleChangeTitle}
                 value={title}
            />
            <br /><br />
            <label className="UploadVideoLabel">description</label>
            <Input className="UploadVideotexts"
                 onChange={handleChangedescription}
                 value={description}
            />
            <br /><br />
            <label className="UploadVideoLabel">Category</label>
            <select className="UploadVideoSelect" onChange={handleChangeTwo}>
                {Catogory.map((item, index) => (
                    <option key={index} value={item.label}>{item.label}</option>
                ))}
            </select>
            <br /><br />

            <Button className="UploadVideoButton" type="primary" size="large" onClick={onSubmit}>
                Upload
            </Button>
            
        </Form>
        
        
        
    </div>
    
    )
}

export default UploadVideo;
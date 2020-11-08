import React from 'react'
import "./VideoBlock.css"
import VideoCard from './VideoCard/VideoCard'
import axios from "../../axios";
import {useState,useEffect, useRef } from 'react'


function VideoBlock() {
  const [recommendations, setrecommendations] = useState([]);
  let htmlString = '';
  // let parse = require('html-react-parser');
  useEffect(()=>{
    async function fetchData() {
      const request = await  axios.get("/recommendations/1");
      return(request.data.results);
      //   data.forEach(result => {
      //        { image="${result["thumbnail_path"]}"
      //       title="${result["title"]}"
      //       views="${result["views"]}"
      //       timestamp="${result["date"]}"
      //       video_path="${result["video_path"]}";
      //   });
        
        // return parse(htmlString);
    }


    fetchData().then(result=>setrecommendations(result));

    // console.log(htmlData);
    // setrecommendations(htmlData);
  },[htmlString]);

console.log(recommendations);



  return (
    <div className="videoblock">
      <h2>Recommendation</h2>
      <div className="videoblockvideo" >
        {recommendations.map((result) => (
            <VideoCard image= {result["thumbnail_path"]}
            title={result["title"]}
            views={result["views"]}
            timestamp={result["date"]}
            likes={result["likes"]}
            video_path={result["video_path"]} />)
        )}
      </div>
    </div>
  )
}

export default VideoBlock

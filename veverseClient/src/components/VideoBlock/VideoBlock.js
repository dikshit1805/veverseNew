import React from 'react'
import "./VideoBlock.css"
import VideoCard from './VideoCard/VideoCard'
import axios from "../../axios";
import {useState,useEffect } from 'react'
import {Link} from "react-router-dom"

function VideoBlock({query,heading,email }) {
  const [recommendations, setrecommendations] = useState([]);
  
  useEffect(()=>{
    async function fetchData() {
      const request = await  axios.get(`${query}?emailID=${email}`);
      return(request.data.results);
    }
    fetchData().then(result=>{setrecommendations(result)});
    
  },[query, email]);

  return (
    <div className="videoblock">
      <h2>{heading}</h2>
      
      <div className="videoblockvideo" >
        {recommendations.map((result) => (
          
          <Link key={`Link_${result["videoID"]}`} className="videoRow_link" to={{pathname:`/searchvideo/${result["videoID"]}`,path:result["video_path"]}}>
            <VideoCard key={result["videoID"]} image= {result["thumbnail_path"]}
            title={result["title"]}
            views={result["views"]}
            timestamp={new Date(result["date"])}
            likes={result["likes"]}
            video_path={result["video_path"]} 
            profile_pic={result["profile_pic"]}/>
          </Link>
          ))}
      </div>
    </div>
  )
}

export default VideoBlock

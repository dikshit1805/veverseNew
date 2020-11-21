import React from 'react'
import VideoRow from '../../SearchPage/VideoRow/VideoRow';
import {useState,useEffect } from 'react'
import axios from "../../../axios";
import "./SuggestedVideos.css"
import SuggestedRow from './SuggestedRow/SuggestedRow';


const SuggestedVideos = ({searchkey}) => {
  const [searchResult, setSearchResult] = useState([]);
  useEffect(()=>{
    async function fetchData() {
      const request = await  axios.post("/searchvideo/", {
        key:`${searchkey}`,
      });

      return(request.data.results);
    }
    fetchData().then(result=>{
      console.log(searchkey, result);
      setSearchResult(result)
    });

  },[searchkey]);

  return (
    <div className="suggestedpageblock" >
      {searchResult.map((result) => (
          <SuggestedRow key={result["videoID"]} videoID= {result["videoID"]}
          thumbnail_path={result["thumbnail_path"]}
          title={result["title"]}
          views={result["views"]}
          likes={result["likes"]}
          date={new Date(result["date"])}
          video_path={result["video_path"]}
          profile_pic={result["profile_pic"]}/>)
      )}
    </div>
  )
}

export default SuggestedVideos

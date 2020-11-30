import React from 'react'
import "./SearchPage.css"
import VideoRow from './VideoRow/VideoRow';
import {useState,useEffect } from 'react'
import axios from "../../axios";
import {useParams} from 'react-router-dom'


function SearchPage() {
  const [searchResult, setSearchResult] = useState([]);
  const {searchkey} = useParams();
  
  useEffect(()=>{
    async function fetchData() {
      const request = await  axios.post("/searchvideo/", {
        key:`${searchkey}`,
      });
      return(request.data.results);
    }
    fetchData().then(result=>{
      setSearchResult(result)
    });

  },[searchkey]);

  return (
    <div className="searchpage">
      <h2>Search Results</h2>
      <div className="searchpageblock" >
        {searchResult.map((result) => (
          <VideoRow key={result["videoID"]} videoID= {result["videoID"]}
          thumbnail_path={result["thumbnail_path"]}
          title={result["title"]}
          views={result["views"]}
          likes={result["likes"]}
          date={new Date(result["date"])}
          video_path={result["video_path"]}
          profile_pic={result["profile_pic"]}/>)
        )}
      </div>
    </div>
  )
}

export default SearchPage

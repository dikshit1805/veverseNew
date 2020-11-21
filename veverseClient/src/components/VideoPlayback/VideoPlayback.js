import React from 'react';
// import { useQuery, useParams } from 'react-query';
// import { useLocation } from 'react-router';
import {useEffect, useState} from 'react';
import ReactPlayer from 'react-player/lazy'
import { Avatar, Grid } from '@material-ui/core';
import "./videoPlayback.css"
import {useParams } from 'react-router-dom';
import axios from "../../axios";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import {Typography} from '@material-ui/core';
import numeral from 'numeral';
import SuggestedVideos from './SuggestedVideos/SuggestedVideos';

function VideoPlayback() {
  // let query = useLocation();
  // console.log(query.path);
  const {videoID} = useParams();
  const [videoInfo, setVideoInfo] = useState({})
  const [videoGerne, setVideoGerne] = useState({})

  const [videoComments, setVideoComments] = useState({})

  useEffect(()=>{
    axios.get(`/searchvideo/${videoID}`).then(result=>{
      console.log(result.data.results[0])
      setVideoInfo(result.data.results[0])
    }).catch(err => alert(err));
  },[videoID,videoGerne,videoComments]);
  


  return (
    <div className='videoPlayback'>
      <div className="videoBlock" >
        <div className="videoBlock_player" >
          <video src={`${videoInfo?.video_path}`}  autoplay='true' preload="auto" controls></video>
        </div>

        <div className="videoBlock_description">
          <Grid xm={12} lg={12} container >

            <Grid  sm={12} lg={12} item className="videoBlock_description_title">
              <Typography variant="h3"> {videoInfo?.title}</Typography>
              <span><Typography className="videoBlock_description_tags" variant="h5">{videoInfo?.tagName}</Typography></span>
            </Grid>
            
            <Grid sm={12} lg={12} item className="videoBlock_description_info">
              <div className="videoBlock_description_info_block">
                <div className="videoBlock_description_info_block_left">
                    <Typography variant="body2" >{numeral(videoInfo?.views).format('0.0a').toUpperCase()} <b>Views</b></Typography>
                </div>
                <div className="videoBlock_description_info_block_right">
                <ThumbUpAltIcon/> 
                <Typography variant="body2" > <b>{numeral(videoInfo?.likes).format('0.0a').toUpperCase()} </b>  </Typography>
                </div>
              </div>
            </Grid>

            <Grid sm={12} lg={12} item className="videoBlock_description_channel">
              <div className="videoBlock_description_channel_block">
                <div className="videoBlock_description_channel_block_left">
                    <Avatar src={videoInfo?.profile_pic}/>
                </div>
                <div className="videoBlock_description_channel_block_right">
                    <Typography variant="h4" className="text-capitalize"> {videoInfo?.last_name}, {videoInfo?.first_name} </Typography>
                    <Typography><b>Gerne:</b> {videoInfo?.category}</Typography> 
                    <Typography><b>Views:</b>  {numeral(videoInfo?.views).format('0.0a').toUpperCase()}</Typography>
                    <Typography><b>Likes:</b> {numeral(videoInfo?.likes).format('0.0a').toUpperCase()}</Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      
        <div className="videoBlock_comments">
          Comments
        </div>
      </div>

      <div className="videoRecommendation">
        <SuggestedVideos searchkey={`${videoInfo?.tagName} ${videoInfo?.category} ${videoInfo?.title}`}/>
      </div>    
    </div>
  )
}

export default VideoPlayback;

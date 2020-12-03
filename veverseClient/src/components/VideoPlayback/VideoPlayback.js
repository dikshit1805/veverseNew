import React from 'react';
// import { useQuery, useParams } from 'react-query';
// import { useLocation } from 'react-router';
import {useEffect, useState} from 'react';
import { Avatar, Grid } from '@material-ui/core';
import "./videoPlayback.css"
import {useParams } from 'react-router-dom';
import axios from "../../axios";
import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import {Typography} from '@material-ui/core';
import numeral from 'numeral';
import SuggestedVideos from './SuggestedVideos/SuggestedVideos';
import { useAuth } from "../../contexts/AuthContext"


function VideoPlayback() {
  // let query = useLocation();
  // console.log(query.path);
  const {videoID} = useParams();
  const [videoInfo, setVideoInfo] = useState({})
  const [likeStatus, setLikeStatus] = useState(false)
  const {currentUser} = useAuth()

  // const [videoComments, setVideoComments] = useState({})

  useEffect(()=>{
    axios.get(`/searchvideo/${videoID}`).then(result=>{
      setVideoInfo(result.data.results[0])
    }).catch(err => alert(err));
    axios.post(`/userhistory/log`, {
      "emailID":`${currentUser.email}`,
      "videoID":`${videoID}`
    }).then(result=>{
      setLikeStatus(result.data.like)
    }).catch(err => alert(err));
  },[videoID, currentUser.email]);

  const toggleLike = () => {
    setLikeStatus(!likeStatus)
  }

  useEffect(() => {
    if(likeStatus) {
      axios.post(`/userhistory/like`, {
        "emailID":`${currentUser.email}`,
        "videoID":`${videoID}`
      }).catch(err => alert(err));
    } else {
      axios.post(`/userhistory/unlike`, {
        "emailID":`${currentUser.email}`,
        "videoID":`${videoID}`
      }).catch(err => alert(err));
    }
  }, [likeStatus]);


  return (
    <div className='videoPlayback'>
      <div className="videoBlock" >
        <div className="videoBlock_player" >
          <video src={`${videoInfo?.video_path}`}  controls autoPlay="true"></video>
        </div>

        <div className="videoBlock_description">
          <Grid  container >

            <Grid  sm={12} lg={12} item className="videoBlock_description_title">
              <Typography variant="h3"> {videoInfo?.title}</Typography>
              <span><Typography className="videoBlock_description_tags" variant="h5">{videoInfo?.tagName}</Typography></span>
            </Grid>
            
            <Grid sm={12} lg={12} item className="videoBlock_description_info">
              <div className="videoBlock_description_info_block">
                <div className="videoBlock_description_info_block_left">
                    <Typography variant="body2" >{numeral(videoInfo?.views + 1).format('0.0a').toUpperCase()} <b>Views</b></Typography>
                </div>
                <div className="videoBlock_description_info_block_right">
                <ThumbUpAltIcon onClick={toggleLike} className=  {likeStatus ? ' highlightColor highlightColor_selected': 'highlightColor'}/> 
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
                    <Typography><b>Views:</b>  {numeral(videoInfo?.views + 1).format('0.0a').toUpperCase()}</Typography>
                    <Typography><b>Likes:</b> {numeral(videoInfo?.likes).format('0.0a').toUpperCase()}</Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      
        {/* <div className="videoBlock_comments">
          Comments
        </div> */}
      </div>

      <div className="videoRecommendation">
        <SuggestedVideos searchkey={`${videoInfo?.tagName} ${videoInfo?.category} ${videoInfo?.title}`}/>
      </div>    
    </div>
  )
}

export default VideoPlayback;

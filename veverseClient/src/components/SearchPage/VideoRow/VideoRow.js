import React from 'react'
import "./VideoRow.css"
import {Link} from "react-router-dom"
import { Avatar } from '@material-ui/core'        
import  numeral from 'numeral';
import moment from 'moment'

import noimage from '../../../images/no-image.png'

function VideoRow({videoID, thumbnail_path, title, views, date, likes, video_path, profile_pic}) {
  return (
    <Link className="videoRow_link" to={{pathname:`/searchvideo/${videoID}`}}>
      <div className="videoRow">  
        <img src={thumbnail_path} alt={noimage}/>
        <div className="videoRow__text">
          <h3>{title}</h3>
            <div class="videoRow__body">
            <div class="videoRow__body__img"><Avatar src={`${profile_pic}`}></Avatar></div>
            <div class="videoRow__body__details"><p>{numeral(views).format('0.0a').toUpperCase()} Views •	{numeral(likes).format('0.0a').toUpperCase()} Likes</p> 
                <p>{moment(date.toLocaleTimeString() + ' ' + date.toLocaleDateString(),"h:mm:ss a DD/MM/YYYY").fromNow()}</p></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoRow
